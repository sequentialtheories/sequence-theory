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
    volatility_pct: float,
    periods: int,
    interval_seconds: int,
    sparkline: List[float] = None
) -> List[Dict]:
    """Generate natural-looking OHLC candles"""
    
    candles = []
    now = int(time.time())
    
    # Calculate start value from 24h change
    change_factor = 1 + (change_24h / 100) if change_24h else 1
    start_value = current_value / change_factor if change_factor != 0 else current_value
    
    # Scale volatility to per-candle basis (smaller for more candles)
    candle_vol = (volatility_pct / 100) / math.sqrt(periods) * 0.5
    
    prices = []
    price = start_value
    
    # Generate price path
    for i in range(periods):
        # Trend toward current value
        target_progress = (i + 1) / periods
        target_price = start_value + (current_value - start_value) * target_progress
        
        # Random component scaled by volatility
        noise = random.gauss(0, price * candle_vol)
        
        # Blend trend with noise
        price = target_price * 0.7 + (price + noise) * 0.3
        price = max(price, current_value * 0.3)  # Floor
        prices.append(price)
    
    # Ensure last price equals current value
    if prices:
        prices[-1] = current_value
    
    # Generate OHLC from prices
    for i in range(periods):
        t = now - (periods - i) * interval_seconds
        close_price = prices[i]
        open_price = prices[i - 1] if i > 0 else start_value
        
        # Wick size based on volatility
        wick = abs(close_price - open_price) * random.uniform(0.2, 0.8) + close_price * candle_vol * 0.5
        
        high_price = max(open_price, close_price) + abs(random.gauss(0, wick))
        low_price = min(open_price, close_price) - abs(random.gauss(0, wick))
        
        candles.append({
            "time": t,
            "open": round(open_price, 2),
            "high": round(high_price, 2),
            "low": round(low_price, 2),
            "close": round(close_price, 2),
            "volumeUsd": round(current_value * 50000 * random.uniform(0.8, 1.2), 0)
        })
    
    return candles

def calculate_sophisticated_indices(market_data: List[Dict], time_period: str) -> Dict:
    """Calculate indices with proper volatility levels"""
    stablecoins = {'usdt', 'usdc', 'busd', 'dai', 'tusd', 'fdusd', 'usdd', 'usdp', 'gusd', 'frax'}
    
    coins = [c for c in market_data 
             if c.get('symbol', '').lower() not in stablecoins 
             and c.get('current_price') and c.get('market_cap')]
    
    if not coins:
        return {"anchor5": None, "vibe20": None, "wave100": None, "lastUpdated": datetime.utcnow().isoformat()}
    
    period_config = {
        'daily': {'periods': 24, 'interval': 3600},
        'month': {'periods': 30, 'interval': 86400},
        'year': {'periods': 52, 'interval': 604800},
        'all': {'periods': 60, 'interval': 604800},
    }
    config = period_config.get(time_period, period_config['daily'])
    
    # ANCHOR5 - Least volatile (top 5 market cap)
    anchor_coins = sorted(coins, key=lambda x: x.get('market_cap', 0), reverse=True)[:5]
    anchor_value = sum(c.get('current_price', 0) for c in anchor_coins) / 10
    anchor_change = sum(c.get('price_change_percentage_24h') or 0 for c in anchor_coins) / 5
    anchor_vol = 15  # Low volatility
    
    # VIBE20 - Moderate volatility (top 20 by volume)
    vibe_coins = sorted(coins, key=lambda x: x.get('total_volume', 0) or 0, reverse=True)[:20]
    vibe_value = sum(c.get('current_price', 0) * 5 for c in vibe_coins)
    vibe_change = sum(c.get('price_change_percentage_24h') or 0 for c in vibe_coins) / 20
    vibe_vol = 35  # Moderate volatility
    
    # WAVE100 - High volatility (momentum/appreciation)
    wave_coins = sorted(coins, key=lambda x: abs(x.get('price_change_percentage_24h') or 0), reverse=True)[:50]
    total_mcap = sum(c.get('market_cap', 0) for c in wave_coins) or 1
    wave_value = sum(c.get('current_price', 0) * (c.get('market_cap', 0) / total_mcap) * 5000 for c in wave_coins)
    wave_change = sum((c.get('price_change_percentage_24h') or 0) for c in wave_coins) / len(wave_coins)
    wave_vol = 60  # High volatility
    
    def fmt_constituents(coins_list, weight):
        return [{"id": c.get('id', ''), "symbol": c.get('symbol', '').upper(), "weight": weight,
                 "price": c.get('current_price', 0), "market_cap": c.get('market_cap', 0),
                 "price_change_percentage_24h": c.get('price_change_percentage_24h')} for c in coins_list]
    
    return {
        "anchor5": {
            "index": "Anchor5", "baseValue": 1000, "timeframe": "1h",
            "candles": generate_realistic_candles(anchor_value, anchor_change, anchor_vol, config['periods'], config['interval']),
            "currentValue": round(anchor_value, 2), "change_24h_percentage": round(anchor_change, 2),
            "meta": {"tz": "UTC", "constituents": fmt_constituents(anchor_coins, 20), "rebalanceFrequency": "quarterly"}
        },
        "vibe20": {
            "index": "Vibe20", "baseValue": 100, "timeframe": "1h",
            "candles": generate_realistic_candles(vibe_value, vibe_change, vibe_vol, config['periods'], config['interval']),
            "currentValue": round(vibe_value, 2), "change_24h_percentage": round(vibe_change, 2),
            "meta": {"tz": "UTC", "constituents": fmt_constituents(vibe_coins[:10], 5), "rebalanceFrequency": "monthly"}
        },
        "wave100": {
            "index": "Wave100", "baseValue": 1000, "timeframe": "1h",
            "candles": generate_realistic_candles(wave_value, wave_change, wave_vol, config['periods'], config['interval']),
            "currentValue": round(wave_value, 2), "change_24h_percentage": round(wave_change, 2),
            "meta": {"tz": "UTC", "constituents": fmt_constituents(wave_coins[:10], 2), "rebalanceFrequency": "weekly"}
        },
        "lastUpdated": datetime.utcnow().isoformat()
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
