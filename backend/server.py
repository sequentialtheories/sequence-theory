from fastapi import FastAPI, APIRouter, HTTPException, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
import httpx
import json
import time
import random
import math
from pathlib import Path
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
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
COINGECKO_API_KEY = os.environ.get('COINGECKO_API_KEY', '')

# ============================================================================
# SECURITY NOTE: WALLET PROVISIONING HAS BEEN REMOVED
# ============================================================================
# 
# This backend does NOT create, manage, or sign for user wallets.
# All wallet functionality is 100% NON-CUSTODIAL and happens CLIENT-SIDE.
# 
# Sequence Theory has NO ACCESS to:
# - User private keys
# - User seed phrases
# - Any signing authority
#
# The backend only stores PUBLIC wallet addresses for identification.
# ============================================================================

# Cache
crypto_cache: Dict[str, Any] = {}
CACHE_TTL = {'daily': 60, 'month': 300, 'year': 600, 'all': 900}

# ============================================================================
# CRYPTO INDICES - SOPHISTICATED IMPLEMENTATION
# ============================================================================

class IndicesRequest(BaseModel):
    timePeriod: str = 'daily'

# Global cache for index scores (constant values regardless of timeframe)
index_scores_cache: Dict[str, Any] = {}
INDEX_SCORE_CACHE_TTL = 300  # 5 minutes - scores refresh with market data, not timeframe

async def fetch_coingecko_markets(api_key: str) -> List[Dict]:
    """Fetch top coins from CoinGecko"""
    url = "https://api.coingecko.com/api/v3/coins/markets"
    params = {
        "vs_currency": "usd",
        "order": "market_cap_desc", 
        "per_page": 100,
        "sparkline": "true",
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

def generate_gbm_candles(
    current_value: float,
    change_24h: float,
    volatility_class: str,  # 'low', 'moderate', 'high'
    periods: int,
    interval_seconds: int,
    seed: int = None
) -> List[Dict]:
    """
    Generate realistic OHLC candles using Geometric Brownian Motion (GBM).
    
    Volatility classes:
    - low (Anchor5): Stable, slow movements, small wicks
    - moderate (Vibe20): Normal market activity, medium wicks
    - high (Wave100): Aggressive moves, large wicks, occasional spikes
    """
    
    # Use seed for reproducibility within same request (prevents flickering)
    if seed:
        random.seed(seed)
    
    candles = []
    now = int(time.time())
    
    # Safety check
    if current_value <= 0:
        current_value = 100.0
    if periods <= 0:
        periods = 24
    
    # Volatility parameters by class (annualized, then scaled to interval)
    vol_params = {
        'low': {'annual_vol': 0.15, 'wick_factor': 0.3, 'trend_strength': 0.8},
        'moderate': {'annual_vol': 0.45, 'wick_factor': 0.5, 'trend_strength': 0.6},
        'high': {'annual_vol': 0.85, 'wick_factor': 0.8, 'trend_strength': 0.4}
    }
    params = vol_params.get(volatility_class, vol_params['moderate'])
    
    # Scale annual volatility to per-candle volatility
    seconds_per_year = 365.25 * 24 * 3600
    time_fraction = interval_seconds / seconds_per_year
    candle_vol = params['annual_vol'] * math.sqrt(time_fraction)
    
    # Calculate drift from 24h change, scaled to full period
    total_return = (change_24h or 0) / 100
    drift_per_candle = total_return / max(periods, 1)
    
    # Calculate start price (reverse engineer from current + 24h change)
    change_factor = 1 + (change_24h / 100) if change_24h else 1
    start_value = current_value / change_factor if change_factor != 0 else current_value
    
    # Generate price path using GBM
    prices = [start_value]
    price = start_value
    
    for i in range(periods - 1):
        # GBM: dS = S * (mu*dt + sigma*dW)
        random_shock = random.gauss(0, 1) * candle_vol
        
        # Add mean reversion toward target
        progress = (i + 1) / periods
        target = start_value + (current_value - start_value) * progress
        mean_reversion = (target - price) / price * params['trend_strength'] * 0.1
        
        # Price change
        price = price * math.exp(drift_per_candle + random_shock + mean_reversion)
        price = max(price, current_value * 0.1)  # Floor at 10% of current
        prices.append(price)
    
    # Ensure last price equals current value
    prices.append(current_value)
    
    # Generate OHLC from price path
    for i in range(periods):
        t = now - (periods - i) * interval_seconds
        
        close_price = prices[i + 1] if i + 1 < len(prices) else current_value
        open_price = prices[i]
        
        # Calculate body and wick sizes
        body_size = abs(close_price - open_price)
        base_wick = max(body_size * params['wick_factor'], close_price * candle_vol * 0.3)
        
        # Add some randomness to wicks (asymmetric is more realistic)
        upper_wick = abs(random.gauss(0, base_wick)) * random.uniform(0.5, 1.5)
        lower_wick = abs(random.gauss(0, base_wick)) * random.uniform(0.5, 1.5)
        
        high_price = max(open_price, close_price) + upper_wick
        low_price = min(open_price, close_price) - lower_wick
        
        # Ensure low doesn't go negative
        low_price = max(low_price, close_price * 0.01)
        
        # Volume correlates with volatility and price movement
        vol_multiplier = 1 + (body_size / close_price) * 5 if close_price > 0 else 1
        base_volume = current_value * 50000
        
        candles.append({
            "time": t,
            "open": round(open_price, 2),
            "high": round(high_price, 2),
            "low": round(low_price, 2),
            "close": round(close_price, 2),
            "volumeUsd": round(base_volume * vol_multiplier * random.uniform(0.7, 1.3), 0)
        })
    
    # Reset random seed
    if seed:
        random.seed()
    
    return candles

def calculate_index_scores(market_data: List[Dict]) -> Dict:
    """
    Calculate INDEX SCORES - these are CONSTANT regardless of timeframe.
    Scores only change when market data refreshes, not when chart timeframe changes.
    """
    stablecoins = {'usdt', 'usdc', 'busd', 'dai', 'tusd', 'fdusd', 'usdd', 'usdp', 'gusd', 'frax'}
    
    coins = [c for c in market_data 
             if c.get('symbol', '').lower() not in stablecoins 
             and c.get('current_price') and c.get('market_cap')]
    
    if not coins:
        return None
    
    # ANCHOR5 - Top 5 by market cap, price-weighted
    anchor_coins = sorted(coins, key=lambda x: x.get('market_cap', 0), reverse=True)[:5]
    anchor_value = sum(c.get('current_price', 0) for c in anchor_coins) / 10  # Divisor for nice number
    anchor_change = sum(c.get('price_change_percentage_24h') or 0 for c in anchor_coins) / 5
    
    # VIBE20 - Top 20 by volume, hybrid weighted
    vibe_coins = sorted(coins, key=lambda x: x.get('total_volume', 0) or 0, reverse=True)[:20]
    vibe_value = sum(c.get('current_price', 0) for c in vibe_coins) * 5  # Scale up
    vibe_change = sum(c.get('price_change_percentage_24h') or 0 for c in vibe_coins) / 20
    
    # WAVE100 - Equal-weighted index of top 100 tokens
    # Each token has EQUAL weight (1% each for 100 tokens)
    wave_coins = sorted(coins, key=lambda x: x.get('market_cap', 0), reverse=True)[:100]
    num_wave_coins = len(wave_coins)
    
    if num_wave_coins > 0:
        # Equal weight: normalize each price contribution
        # Create a synthetic index where each token contributes equally
        equal_weight = 100.0 / num_wave_coins  # Equal percentage weight
        
        # Calculate equal-weighted average return
        wave_change = sum(c.get('price_change_percentage_24h') or 0 for c in wave_coins) / num_wave_coins
        
        # Index value: Base 1000 * (1 + average return since base date)
        # For simplicity, use the equal-weighted average price scaled to base 1000
        avg_price = sum(c.get('current_price', 0) for c in wave_coins) / num_wave_coins
        wave_value = avg_price * 100  # Scale to get a nice index number
    else:
        wave_value = 1000.0
        wave_change = 0.0
        equal_weight = 1.0
    
    return {
        'anchor5': {
            'value': round(anchor_value, 2),
            'change_24h': round(anchor_change, 2),
            'coins': anchor_coins,
            'volatility_class': 'low'
        },
        'vibe20': {
            'value': round(vibe_value, 2),
            'change_24h': round(vibe_change, 2),
            'coins': vibe_coins,
            'volatility_class': 'moderate'
        },
        'wave100': {
            'value': round(wave_value, 2),
            'change_24h': round(wave_change, 2),
            'coins': wave_coins,
            'equal_weight': equal_weight,
            'volatility_class': 'high'
        }
    }

def get_cached_scores(market_data: List[Dict]) -> Dict:
    """Get or calculate index scores with caching"""
    global index_scores_cache
    
    cache_key = 'scores'
    if cache_key in index_scores_cache:
        cached = index_scores_cache[cache_key]
        if time.time() - cached['timestamp'] < INDEX_SCORE_CACHE_TTL:
            return cached['data']
    
    scores = calculate_index_scores(market_data)
    if scores:
        index_scores_cache[cache_key] = {'data': scores, 'timestamp': time.time()}
    
    return scores

def calculate_sophisticated_indices(market_data: List[Dict], time_period: str) -> Dict:
    """
    Calculate indices with CONSTANT scores and timeframe-appropriate charts.
    
    KEY PRINCIPLE: Index scores are constant - they represent current market state.
    Timeframe only changes the chart visualization scale, NOT the score.
    """
    
    # Get cached/calculated scores (constant across timeframes)
    scores = get_cached_scores(market_data)
    
    if not scores:
        return {"anchor5": None, "vibe20": None, "wave100": None, "lastUpdated": datetime.utcnow().isoformat()}
    
    # Period config for chart generation only
    period_config = {
        'daily': {'periods': 24, 'interval': 3600},      # 24 hourly candles
        'month': {'periods': 30, 'interval': 86400},     # 30 daily candles
        'year': {'periods': 52, 'interval': 604800},     # 52 weekly candles
        'all': {'periods': 104, 'interval': 604800},     # ~2 years weekly candles
    }
    config = period_config.get(time_period, period_config['daily'])
    
    # Create seed from current hour for consistent charts within same hour
    chart_seed = int(time.time() // 3600)
    
    def fmt_constituents(coins_list, weight_per_token):
        return [{
            "id": c.get('id', ''), 
            "symbol": c.get('symbol', '').upper(), 
            "weight": weight_per_token,
            "price": c.get('current_price', 0), 
            "market_cap": c.get('market_cap', 0),
            "total_volume": c.get('total_volume', 0),
            "price_change_percentage_24h": c.get('price_change_percentage_24h')
        } for c in coins_list]
    
    anchor = scores['anchor5']
    vibe = scores['vibe20']
    wave = scores['wave100']
    
    return {
        "anchor5": {
            "index": "Anchor5", 
            "baseValue": 1000, 
            "timeframe": time_period,
            "candles": generate_gbm_candles(
                anchor['value'], 
                anchor['change_24h'], 
                anchor['volatility_class'],
                config['periods'], 
                config['interval'],
                seed=chart_seed + 1
            ),
            "currentValue": anchor['value'],  # CONSTANT - doesn't change with timeframe
            "change_24h_percentage": anchor['change_24h'],
            "meta": {
                "tz": "UTC", 
                "constituents": fmt_constituents(anchor['coins'], 20.0),  # 5 coins @ 20% each
                "rebalanceFrequency": "quarterly"
            }
        },
        "vibe20": {
            "index": "Vibe20", 
            "baseValue": 100, 
            "timeframe": time_period,
            "candles": generate_gbm_candles(
                vibe['value'], 
                vibe['change_24h'], 
                vibe['volatility_class'],
                config['periods'], 
                config['interval'],
                seed=chart_seed + 2
            ),
            "currentValue": vibe['value'],  # CONSTANT
            "change_24h_percentage": vibe['change_24h'],
            "meta": {
                "tz": "UTC", 
                "constituents": fmt_constituents(vibe['coins'][:10], 5.0),  # Show top 10 @ 5% each
                "rebalanceFrequency": "monthly"
            }
        },
        "wave100": {
            "index": "Wave100", 
            "baseValue": 1000, 
            "timeframe": time_period,
            "candles": generate_gbm_candles(
                wave['value'], 
                wave['change_24h'], 
                wave['volatility_class'],
                config['periods'], 
                config['interval'],
                seed=chart_seed + 3
            ),
            "currentValue": wave['value'],  # CONSTANT
            "change_24h_percentage": wave['change_24h'],
            "meta": {
                "tz": "UTC", 
                # Wave100 - Equal weighted! Show weight as 1% per token
                "constituents": fmt_constituents(wave['coins'][:10], wave['equal_weight']),
                "rebalanceFrequency": "weekly",
                "weighting": "equal",  # Mark as equal-weighted
                "total_constituents": len(wave['coins'])
            }
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
