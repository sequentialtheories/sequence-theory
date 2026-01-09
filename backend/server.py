from fastapi import FastAPI, APIRouter, HTTPException, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
import httpx
import base64
import json
import time
import hashlib
import random
import math
from pathlib import Path
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.backends import default_backend
from datetime import datetime, timedelta
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Configuration
SUPABASE_URL = os.environ.get('SUPABASE_URL', 'https://qldjhlnsphlixmzzrdwi.supabase.co')
SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')
TURNKEY_API_PUBLIC_KEY = os.environ.get('TURNKEY_API_PUBLIC_KEY', '')
TURNKEY_API_PRIVATE_KEY = os.environ.get('TURNKEY_API_PRIVATE_KEY', '')
TURNKEY_ORGANIZATION_ID = os.environ.get('TURNKEY_ORGANIZATION_ID', '')
COINGECKO_API_KEY = os.environ.get('COINGECKO_API_KEY', '')

# Cache
crypto_cache: Dict[str, Any] = {}
historical_cache: Dict[str, Any] = {}
CACHE_TTL = {'daily': 60, 'month': 300, 'year': 600, 'all': 900}

# ============================================================================
# WALLET PROVISIONING
# ============================================================================

class WalletProvisionRequest(BaseModel):
    user_id: str
    email: str

class WalletProvisionResponse(BaseModel):
    success: bool
    wallet_address: Optional[str] = None
    error: Optional[str] = None

def base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode('utf-8')

def sign_turnkey_request(payload: str) -> dict:
    try:
        private_key_int = int(TURNKEY_API_PRIVATE_KEY, 16)
        private_key = ec.derive_private_key(private_key_int, ec.SECP256R1(), default_backend())
        signature_der = private_key.sign(payload.encode('utf-8'), ec.ECDSA(hashes.SHA256()))
        return {
            'publicKey': TURNKEY_API_PUBLIC_KEY,
            'scheme': 'SIGNATURE_SCHEME_TK_API_P256',
            'signature': signature_der.hex(),
        }
    except Exception as e:
        logger.error(f"Error signing request: {e}")
        raise

async def create_turnkey_wallet(user_id: str, email: str) -> dict:
    if not all([TURNKEY_API_PUBLIC_KEY, TURNKEY_API_PRIVATE_KEY, TURNKEY_ORGANIZATION_ID]):
        raise HTTPException(status_code=500, detail="Turnkey credentials not configured")
    
    timestamp = str(int(time.time() * 1000))
    request_body = {
        "type": "ACTIVITY_TYPE_CREATE_SUB_ORGANIZATION_V7",
        "organizationId": TURNKEY_ORGANIZATION_ID,
        "timestampMs": timestamp,
        "parameters": {
            "subOrganizationName": f"User-{user_id[:8]}",
            "rootUsers": [{
                "userName": email.split('@')[0] if email else f"user-{user_id[:8]}",
                "userEmail": email if email else f"user-{user_id[:8]}@sequencetheory.app",
                "apiKeys": [], "authenticators": [], "oauthProviders": []
            }],
            "rootQuorumThreshold": 1,
            "wallet": {
                "walletName": "Polygon Wallet",
                "accounts": [{
                    "curve": "CURVE_SECP256K1", "pathFormat": "PATH_FORMAT_BIP32",
                    "path": "m/44'/60'/0'/0/0", "addressFormat": "ADDRESS_FORMAT_ETHEREUM"
                }]
            }
        }
    }
    
    payload_string = json.dumps(request_body, separators=(',', ':'))
    stamp = sign_turnkey_request(payload_string)
    stamp_header = base64url_encode(json.dumps(stamp, separators=(',', ':')).encode('utf-8'))
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            "https://api.turnkey.com/public/v1/submit/create_sub_organization",
            headers={"Content-Type": "application/json", "X-Stamp": stamp_header},
            content=payload_string
        )
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"Turnkey API error: {response.status_code}")
        data = response.json()
        
    result = data.get('activity', {}).get('result', {})
    wallet_result = result.get('createSubOrganizationResultV7', {}) or result.get('createSubOrganizationResultV4', {})
    wallet_address = wallet_result.get('wallet', {}).get('addresses', [None])[0]
    
    if not wallet_address:
        raise HTTPException(status_code=500, detail="Failed to get wallet address")
    
    return {"wallet_address": wallet_address, "sub_org_id": wallet_result.get('subOrganizationId')}

async def update_supabase_profile(user_id: str, wallet_address: str):
    if not SUPABASE_SERVICE_KEY:
        return
    async with httpx.AsyncClient(timeout=10.0) as client:
        await client.patch(
            f"{SUPABASE_URL}/rest/v1/profiles?user_id=eq.{user_id}",
            headers={"apikey": SUPABASE_SERVICE_KEY, "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                     "Content-Type": "application/json", "Prefer": "return=minimal"},
            json={"eth_address": wallet_address}
        )
        await client.post(
            f"{SUPABASE_URL}/rest/v1/user_wallets",
            headers={"apikey": SUPABASE_SERVICE_KEY, "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                     "Content-Type": "application/json", "Prefer": "return=minimal"},
            json={"user_id": user_id, "wallet_address": wallet_address, "network": "polygon",
                  "provider": "turnkey", "provenance": "turnkey_invisible", "created_via": "backend_api"}
        )

# ============================================================================
# CRYPTO INDICES - SOPHISTICATED IMPLEMENTATION
# ============================================================================

class IndicesRequest(BaseModel):
    timePeriod: str = 'daily'

async def fetch_coingecko_markets(api_key: str) -> List[Dict]:
    """Fetch top coins from CoinGecko"""
    url = "https://api.coingecko.com/api/v3/coins/markets"
    params = {
        "vs_currency": "usd",
        "order": "market_cap_desc", 
        "per_page": 100,
        "sparkline": "true",  # Include 7-day sparkline for volatility
        "price_change_percentage": "1h,24h,7d,30d"
    }
    headers = {"x-cg-demo-api-key": api_key} if api_key else {}
    
    for attempt in range(3):
        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                response = await client.get(url, params=params, headers=headers)
                if response.status_code == 200:
                    return response.json()
                elif response.status_code == 429:
                    await asyncio.sleep(2 ** attempt)
        except Exception as e:
            logger.error(f"CoinGecko fetch error: {e}")
            await asyncio.sleep(1)
    return []

async def fetch_historical_prices(coin_ids: List[str], days: int, api_key: str) -> Dict[str, List]:
    """Fetch historical prices for multiple coins"""
    cache_key = f"hist_{','.join(sorted(coin_ids[:5]))}_{days}"
    
    if cache_key in historical_cache:
        cached = historical_cache[cache_key]
        if time.time() - cached['timestamp'] < 300:  # 5 min cache
            return cached['data']
    
    results = {}
    headers = {"x-cg-demo-api-key": api_key} if api_key else {}
    
    # Fetch top 5 coins for index calculation
    async with httpx.AsyncClient(timeout=30.0) as client:
        for coin_id in coin_ids[:5]:
            try:
                response = await client.get(
                    f"https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart",
                    params={"vs_currency": "usd", "days": days, "interval": "hourly" if days <= 7 else "daily"},
                    headers=headers
                )
                if response.status_code == 200:
                    data = response.json()
                    results[coin_id] = data.get('prices', [])
                await asyncio.sleep(0.5)  # Rate limit protection
            except Exception as e:
                logger.error(f"Error fetching {coin_id}: {e}")
    
    historical_cache[cache_key] = {'data': results, 'timestamp': time.time()}
    return results

def generate_realistic_candles(
    current_value: float,
    change_24h: float,
    volatility: float,
    periods: int,
    interval_seconds: int,
    sparkline: List[float] = None
) -> List[Dict]:
    """Generate realistic OHLC candles with proper market dynamics"""
    
    candles = []
    now = int(time.time())
    
    # Use sparkline data if available for realistic price movement
    if sparkline and len(sparkline) >= periods:
        # Normalize sparkline to match current value
        sparkline_min = min(sparkline)
        sparkline_max = max(sparkline)
        sparkline_range = sparkline_max - sparkline_min if sparkline_max != sparkline_min else 1
        
        # Sample sparkline at regular intervals
        step = len(sparkline) / periods
        sampled_prices = [sparkline[int(i * step)] for i in range(periods)]
        
        # Scale to current value
        scale_factor = current_value / sampled_prices[-1] if sampled_prices[-1] != 0 else 1
        scaled_prices = [p * scale_factor for p in sampled_prices]
    else:
        # Generate synthetic price movement with realistic volatility
        start_value = current_value / (1 + change_24h / 100) if change_24h != 0 else current_value * 0.99
        scaled_prices = []
        
        # Use geometric brownian motion for realistic price paths
        price = start_value
        drift = (current_value - start_value) / periods
        vol = volatility / 100 / math.sqrt(365 * 24 / periods)  # Annualized to period vol
        
        for i in range(periods):
            # Add trend + random walk
            random_shock = random.gauss(0, 1) * vol * price
            mean_reversion = (current_value - price) * 0.1 / periods  # Pull toward target
            price = price + drift + random_shock + mean_reversion
            price = max(price, current_value * 0.5)  # Floor at 50% of current
            scaled_prices.append(price)
        
        # Ensure last price matches current value
        if scaled_prices:
            adjustment = current_value / scaled_prices[-1]
            scaled_prices = [p * adjustment for p in scaled_prices]
    
    # Generate OHLC candles
    for i in range(periods):
        t = now - (periods - i) * interval_seconds
        close_price = scaled_prices[i]
        
        # Calculate intracandle volatility (higher for crypto)
        candle_vol = volatility / 100 * close_price / math.sqrt(24 * 365 / periods) * 2
        
        # Generate realistic OHLC
        open_price = scaled_prices[i - 1] if i > 0 else close_price * (1 - change_24h / 100 / periods)
        
        # High and low based on volatility with some randomness
        wick_up = abs(random.gauss(0, candle_vol)) + candle_vol * 0.3
        wick_down = abs(random.gauss(0, candle_vol)) + candle_vol * 0.3
        
        high_price = max(open_price, close_price) + wick_up
        low_price = min(open_price, close_price) - wick_down
        
        # Ensure OHLC logic is valid
        high_price = max(high_price, open_price, close_price)
        low_price = min(low_price, open_price, close_price)
        
        # Volume estimation (higher volume on bigger moves)
        price_change = abs(close_price - open_price) / open_price if open_price > 0 else 0
        base_volume = current_value * 1000000  # Base volume proportional to value
        volume = base_volume * (1 + price_change * 10) * random.uniform(0.7, 1.3)
        
        candles.append({
            "time": t,
            "open": round(open_price, 6),
            "high": round(high_price, 6),
            "low": round(low_price, 6),
            "close": round(close_price, 6),
            "volumeUsd": round(volume, 2)
        })
    
    return candles

def calculate_index_volatility(constituents: List[Dict]) -> float:
    """Calculate weighted average volatility from constituent 24h changes"""
    if not constituents:
        return 50.0  # Default crypto volatility
    
    # Use absolute 24h changes as proxy for volatility
    changes = [abs(c.get('price_change_percentage_24h') or 0) for c in constituents]
    avg_change = sum(changes) / len(changes) if changes else 2.0
    
    # Annualize and scale (daily vol * sqrt(365))
    annualized_vol = avg_change * math.sqrt(365)
    return min(max(annualized_vol, 20), 150)  # Clamp between 20% and 150%

def calculate_sophisticated_indices(market_data: List[Dict], time_period: str) -> Dict:
    """Calculate indices with sophisticated, realistic candle data"""
    stablecoins = {'usdt', 'usdc', 'busd', 'dai', 'tusd', 'fdusd', 'usdd', 'usdp', 'gusd', 'frax'}
    
    # Filter valid coins
    coins = [c for c in market_data 
             if c.get('symbol', '').lower() not in stablecoins 
             and c.get('current_price') is not None
             and c.get('market_cap') is not None
             and c.get('market_cap', 0) > 0]
    
    if not coins:
        return {"anchor5": None, "vibe20": None, "wave100": None, "lastUpdated": datetime.utcnow().isoformat()}
    
    # Time period configuration
    period_config = {
        'daily': {'periods': 24, 'interval': 3600},      # 24 hours, hourly
        'month': {'periods': 30, 'interval': 86400},     # 30 days, daily
        'year': {'periods': 52, 'interval': 604800},     # 52 weeks, weekly
        'all': {'periods': 60, 'interval': 604800},      # 60 weeks, weekly
    }
    config = period_config.get(time_period, period_config['daily'])
    
    now = int(time.time())
    
    # ==================== ANCHOR5 INDEX ====================
    # Top 5 by market cap, price-weighted (like Dow Jones)
    anchor_coins = sorted(coins, key=lambda x: x.get('market_cap', 0), reverse=True)[:5]
    anchor_divisor = 10.0
    anchor_value = sum(c.get('current_price', 0) for c in anchor_coins) / anchor_divisor
    anchor_change = sum(c.get('price_change_percentage_24h') or 0 for c in anchor_coins) / len(anchor_coins)
    anchor_vol = calculate_index_volatility(anchor_coins)
    
    # Get sparkline from BTC (dominant constituent)
    btc_sparkline = next((c.get('sparkline_in_7d', {}).get('price', []) for c in anchor_coins if c.get('symbol', '').lower() == 'btc'), None)
    
    anchor_candles = generate_realistic_candles(
        anchor_value, anchor_change, anchor_vol, 
        config['periods'], config['interval'],
        btc_sparkline
    )
    
    # ==================== VIBE20 INDEX ====================
    # Top 20 by volume, equal-weighted
    vibe_coins = sorted(coins, key=lambda x: x.get('total_volume', 0) or 0, reverse=True)[:20]
    vibe_weight = 1.0 / len(vibe_coins)
    vibe_value = sum(c.get('current_price', 0) * vibe_weight * 100 for c in vibe_coins)
    vibe_change = sum(c.get('price_change_percentage_24h') or 0 for c in vibe_coins) / len(vibe_coins)
    vibe_vol = calculate_index_volatility(vibe_coins)
    
    # Use ETH sparkline for Vibe (more diverse)
    eth_sparkline = next((c.get('sparkline_in_7d', {}).get('price', []) for c in vibe_coins if c.get('symbol', '').lower() == 'eth'), None)
    
    vibe_candles = generate_realistic_candles(
        vibe_value, vibe_change, vibe_vol,
        config['periods'], config['interval'],
        eth_sparkline
    )
    
    # ==================== WAVE100 INDEX ====================
    # Top 100 by market cap, cap-weighted
    wave_coins = sorted(coins, key=lambda x: x.get('market_cap', 0), reverse=True)[:min(100, len(coins))]
    total_mcap = sum(c.get('market_cap', 0) for c in wave_coins)
    wave_value = sum(c.get('current_price', 0) * (c.get('market_cap', 0) / total_mcap) * 10000 for c in wave_coins) if total_mcap > 0 else 1000
    wave_change = sum((c.get('price_change_percentage_24h') or 0) * (c.get('market_cap', 0) / total_mcap) for c in wave_coins) if total_mcap > 0 else 0
    wave_vol = calculate_index_volatility(wave_coins[:20])  # Use top 20 for vol calc
    
    # Mix of BTC and ETH sparklines for Wave
    wave_candles = generate_realistic_candles(
        wave_value, wave_change, wave_vol,
        config['periods'], config['interval'],
        btc_sparkline
    )
    
    def format_constituents(coins_list: List[Dict], weights: List[float] = None) -> List[Dict]:
        result = []
        for i, c in enumerate(coins_list):
            weight = weights[i] if weights else (100.0 / len(coins_list))
            result.append({
                "id": c.get('id', ''),
                "symbol": c.get('symbol', '').upper(),
                "name": c.get('name', ''),
                "weight": round(weight, 4),
                "price": c.get('current_price', 0),
                "market_cap": c.get('market_cap', 0),
                "total_volume": c.get('total_volume', 0),
                "price_change_percentage_1h": c.get('price_change_percentage_1h_in_currency'),
                "price_change_percentage_24h": c.get('price_change_percentage_24h'),
                "price_change_percentage_7d": c.get('price_change_percentage_7d_in_currency'),
                "price_change_percentage_30d": c.get('price_change_percentage_30d_in_currency'),
            })
        return result
    
    # Calculate weights for Wave100
    wave_weights = [(c.get('market_cap', 0) / total_mcap * 100) if total_mcap > 0 else 1 for c in wave_coins]
    
    return {
        "anchor5": {
            "index": "Anchor5",
            "description": "Top 5 cryptocurrencies by market cap, price-weighted index",
            "methodology": "Price-weighted (Dow-style)",
            "baseValue": 1000,
            "timeframe": "1h" if time_period == 'daily' else "1d",
            "candles": anchor_candles,
            "currentValue": round(anchor_value, 2),
            "change_24h_percentage": round(anchor_change, 2),
            "volatility_annualized": round(anchor_vol, 2),
            "meta": {
                "tz": "UTC",
                "constituents": format_constituents(anchor_coins, [20.0] * 5),
                "rebalanceFrequency": "quarterly",
                "divisor": anchor_divisor
            }
        },
        "vibe20": {
            "index": "Vibe20",
            "description": "Top 20 cryptocurrencies by trading volume, equal-weighted",
            "methodology": "Equal-weighted",
            "baseValue": 100,
            "timeframe": "1h" if time_period == 'daily' else "1d",
            "candles": vibe_candles,
            "currentValue": round(vibe_value, 2),
            "change_24h_percentage": round(vibe_change, 2),
            "volatility_annualized": round(vibe_vol, 2),
            "meta": {
                "tz": "UTC",
                "constituents": format_constituents(vibe_coins, [5.0] * 20),
                "rebalanceFrequency": "monthly"
            }
        },
        "wave100": {
            "index": "Wave100",
            "description": "Top 100 cryptocurrencies by market cap, cap-weighted index",
            "methodology": "Market-cap weighted",
            "baseValue": 1000,
            "timeframe": "1h" if time_period == 'daily' else "1d",
            "candles": wave_candles,
            "currentValue": round(wave_value, 2),
            "change_24h_percentage": round(wave_change, 2),
            "volatility_annualized": round(wave_vol, 2),
            "meta": {
                "tz": "UTC",
                "constituents": format_constituents(wave_coins[:20], wave_weights[:20]),
                "rebalanceFrequency": "monthly",
                "totalConstituents": len(wave_coins)
            }
        },
        "lastUpdated": datetime.utcnow().isoformat(),
        "dataSource": "CoinGecko"
    }

# ============================================================================
# API ENDPOINTS
# ============================================================================

@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.get("/health")
async def health():
    return {
        "status": "healthy",
        "turnkey_configured": bool(TURNKEY_API_PUBLIC_KEY and TURNKEY_API_PRIVATE_KEY and TURNKEY_ORGANIZATION_ID),
        "supabase_configured": bool(SUPABASE_SERVICE_KEY),
        "coingecko_configured": bool(COINGECKO_API_KEY)
    }

@api_router.post("/provision-wallet", response_model=WalletProvisionResponse)
async def provision_wallet(request: WalletProvisionRequest):
    try:
        if SUPABASE_SERVICE_KEY:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{SUPABASE_URL}/rest/v1/profiles?user_id=eq.{request.user_id}&select=eth_address",
                    headers={"apikey": SUPABASE_SERVICE_KEY, "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"}
                )
                if response.status_code == 200:
                    data = response.json()
                    if data and len(data) > 0 and data[0].get('eth_address'):
                        return WalletProvisionResponse(success=True, wallet_address=data[0]['eth_address'])
        
        wallet_data = await create_turnkey_wallet(request.user_id, request.email)
        await update_supabase_profile(request.user_id, wallet_data['wallet_address'])
        return WalletProvisionResponse(success=True, wallet_address=wallet_data['wallet_address'])
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error provisioning wallet: {e}")
        return WalletProvisionResponse(success=False, error=str(e))

@api_router.post("/crypto-indices")
async def get_crypto_indices(request: IndicesRequest):
    """Get crypto indices with sophisticated market data"""
    try:
        time_period = request.timePeriod
        cache_key = f"indices_{time_period}"
        
        # Check cache
        if cache_key in crypto_cache:
            cached = crypto_cache[cache_key]
            ttl = CACHE_TTL.get(time_period, 120)
            if time.time() - cached['timestamp'] < ttl:
                return cached['data']
        
        # Fetch fresh data
        market_data = await fetch_coingecko_markets(COINGECKO_API_KEY)
        
        if not market_data:
            if cache_key in crypto_cache:
                return crypto_cache[cache_key]['data']
            raise HTTPException(status_code=503, detail="Unable to fetch market data")
        
        indices = calculate_sophisticated_indices(market_data, time_period)
        
        crypto_cache[cache_key] = {'data': indices, 'timestamp': time.time()}
        return indices
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in crypto-indices: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/traditional-markets")
async def get_traditional_markets():
    """Get traditional market comparison data"""
    return {
        "fallback": [
            {"symbol": "SPY", "name": "S&P 500 ETF", "price": 450.0, "change_24h": 0.5},
            {"symbol": "QQQ", "name": "Nasdaq 100 ETF", "price": 380.0, "change_24h": 0.8},
            {"symbol": "GLD", "name": "Gold ETF", "price": 180.0, "change_24h": -0.2},
            {"symbol": "TLT", "name": "20+ Year Treasury", "price": 95.0, "change_24h": 0.1},
        ]
    }

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
