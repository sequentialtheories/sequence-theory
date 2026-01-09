from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
import httpx
import base64
import json
import time
import hashlib
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

# Cache for crypto indices
crypto_cache: Dict[str, Any] = {}
CACHE_TTL = {
    'daily': 60,      # 1 minute
    'month': 120,     # 2 minutes
    'year': 300,      # 5 minutes
    'all': 600,       # 10 minutes
}

# ============================================================================
# WALLET PROVISIONING (existing code)
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
# CRYPTO INDICES (NEW - Optimized)
# ============================================================================

class IndicesRequest(BaseModel):
    timePeriod: str = 'daily'

async def fetch_coingecko_markets(api_key: str) -> List[Dict]:
    """Fetch top coins from CoinGecko with retry logic"""
    url = "https://api.coingecko.com/api/v3/coins/markets"
    params = {
        "vs_currency": "usd",
        "order": "market_cap_desc",
        "per_page": 100,
        "sparkline": "false",
        "price_change_percentage": "24h,7d,30d"
    }
    headers = {"x-cg-demo-api-key": api_key} if api_key else {}
    
    for attempt in range(3):
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(url, params=params, headers=headers)
                if response.status_code == 200:
                    return response.json()
                elif response.status_code == 429:
                    logger.warning(f"CoinGecko rate limit hit, attempt {attempt + 1}")
                    await asyncio.sleep(2 ** attempt)
                else:
                    logger.error(f"CoinGecko error: {response.status_code}")
        except Exception as e:
            logger.error(f"CoinGecko fetch error: {e}")
            await asyncio.sleep(1)
    
    return []

def calculate_simple_indices(market_data: List[Dict]) -> Dict:
    """Calculate indices without historical data (much faster)"""
    stablecoins = {'usdt', 'usdc', 'busd', 'dai', 'tusd', 'fdusd', 'usdd'}
    
    # Filter out stablecoins and ensure valid data
    coins = [c for c in market_data 
             if c.get('symbol', '').lower() not in stablecoins 
             and c.get('current_price') is not None
             and c.get('market_cap') is not None]
    
    if not coins:
        return {"anchor5": None, "vibe20": None, "wave100": None}
    
    # Anchor5: Top 5 by market cap (price-weighted like Dow)
    anchor_coins = sorted(coins, key=lambda x: x.get('market_cap', 0) or 0, reverse=True)[:5]
    anchor_total_price = sum(c.get('current_price', 0) or 0 for c in anchor_coins)
    anchor_value = anchor_total_price / 10 if anchor_total_price > 0 else 1000
    anchor_change = sum((c.get('price_change_percentage_24h') or 0) for c in anchor_coins) / max(len(anchor_coins), 1)
    
    # Vibe20: Top 20 by volume (equal weighted)
    vibe_coins = sorted(coins, key=lambda x: x.get('total_volume', 0) or 0, reverse=True)[:20]
    vibe_value = sum((c.get('current_price', 0) or 0) * 0.05 for c in vibe_coins)
    vibe_value = vibe_value if vibe_value > 0 else 100
    vibe_change = sum((c.get('price_change_percentage_24h') or 0) for c in vibe_coins) / max(len(vibe_coins), 1)
    
    # Wave100: Top 100 by momentum (equal weighted)
    wave_coins = sorted(coins, key=lambda x: (x.get('price_change_percentage_24h') or 0), reverse=True)[:min(100, len(coins))]
    wave_value = sum((c.get('current_price', 0) or 0) * 0.01 for c in wave_coins) * 1000
    wave_value = wave_value if wave_value > 0 else 1000
    wave_change = sum((c.get('price_change_percentage_24h') or 0) for c in wave_coins) / max(len(wave_coins), 1)
    
    now = int(time.time())
    
    def create_simple_candles(value: float, change_24h: float, periods: int = 24) -> List[Dict]:
        """Create simple candle data based on current value and 24h change"""
        candles = []
        start_value = value / (1 + change_24h / 100)
        
        for i in range(periods):
            t = now - (periods - i) * 3600
            progress = i / periods
            candle_value = start_value + (value - start_value) * progress
            variation = candle_value * 0.001
            candles.append({
                "time": t,
                "open": candle_value - variation,
                "high": candle_value + variation,
                "low": candle_value - variation * 2,
                "close": candle_value,
                "volumeUsd": 0
            })
        return candles
    
    def format_constituents(coins_list: List[Dict], weight: float) -> List[Dict]:
        return [{
            "id": c.get('id', ''),
            "symbol": c.get('symbol', '').upper(),
            "weight": weight * 100,
            "price": c.get('current_price', 0),
            "market_cap": c.get('market_cap', 0),
            "total_volume": c.get('total_volume', 0),
            "price_change_percentage_24h": c.get('price_change_percentage_24h', 0)
        } for c in coins_list]
    
    return {
        "anchor5": {
            "index": "Anchor5",
            "baseValue": 1,
            "timeframe": "1h",
            "candles": create_simple_candles(anchor_value, anchor_change),
            "currentValue": round(anchor_value, 2),
            "change_24h_percentage": round(anchor_change, 2),
            "meta": {
                "tz": "UTC",
                "constituents": format_constituents(anchor_coins, 1/len(anchor_coins)),
                "rebalanceFrequency": "weekly"
            }
        },
        "vibe20": {
            "index": "Vibe20",
            "baseValue": 1,
            "timeframe": "1h",
            "candles": create_simple_candles(vibe_value, vibe_change),
            "currentValue": round(vibe_value, 2),
            "change_24h_percentage": round(vibe_change, 2),
            "meta": {
                "tz": "UTC",
                "constituents": format_constituents(vibe_coins, 0.05),
                "rebalanceFrequency": "daily"
            }
        },
        "wave100": {
            "index": "Wave100",
            "baseValue": 1000,
            "timeframe": "1h",
            "candles": create_simple_candles(wave_value, wave_change),
            "currentValue": round(wave_value, 2),
            "change_24h_percentage": round(wave_change, 2),
            "meta": {
                "tz": "UTC",
                "constituents": format_constituents(wave_coins[:20], 0.01),  # Only return top 20 for performance
                "rebalanceFrequency": "daily"
            }
        },
        "lastUpdated": datetime.utcnow().isoformat()
    }

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
    """Get crypto indices data - optimized for reliability"""
    try:
        time_period = request.timePeriod
        cache_key = f"indices_{time_period}"
        
        # Check cache
        if cache_key in crypto_cache:
            cached = crypto_cache[cache_key]
            ttl = CACHE_TTL.get(time_period, 120)
            if time.time() - cached['timestamp'] < ttl:
                logger.info(f"Serving cached indices for {time_period}")
                return cached['data']
        
        # Fetch fresh data
        logger.info(f"Fetching fresh indices for {time_period}")
        market_data = await fetch_coingecko_markets(COINGECKO_API_KEY)
        
        if not market_data:
            # Try to return stale cache
            if cache_key in crypto_cache:
                logger.warning("Using stale cache due to API failure")
                return crypto_cache[cache_key]['data']
            raise HTTPException(status_code=503, detail="Unable to fetch market data")
        
        indices = calculate_simple_indices(market_data)
        
        # Update cache
        crypto_cache[cache_key] = {
            'data': indices,
            'timestamp': time.time()
        }
        
        return indices
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in crypto-indices: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/traditional-markets")
async def get_traditional_markets():
    """Get traditional market comparison data (simplified)"""
    # Return static/mock data for traditional markets
    return {
        "fallback": [
            {"symbol": "SPY", "name": "S&P 500", "price": 450.0, "change_24h": 0.5},
            {"symbol": "QQQ", "name": "Nasdaq 100", "price": 380.0, "change_24h": 0.8},
            {"symbol": "GLD", "name": "Gold", "price": 180.0, "change_24h": -0.2},
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
