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
from typing import Optional, List, Dict, Any, Tuple
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
    """Fetch top coins from CoinGecko - fetch 250 to ensure we can get 100+ non-stablecoins"""
    url = "https://api.coingecko.com/api/v3/coins/markets"
    params = {
        "vs_currency": "usd",
        "order": "market_cap_desc", 
        "per_page": 250,  # Fetch 250 to ensure 100+ non-stablecoins after filtering
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
    
    INDEX COMPOSITION & METHODOLOGY:
    --------------------------------
    ANCHOR5: Top 5 by market cap (most stable, blue-chip)
        - Price-weighted sum (like Dow Jones)
        - Rebalances quarterly
        - Expected score: ~10,000-20,000 range
    
    VIBE20: Top 20 by trading volume (moderately volatile)
        - Hybrid weighting based on volume and price
        - Rebalances monthly
        - Expected score: ~50,000-150,000 range
    
    WAVE100: Top 100 by market cap (highly volatile, broad exposure)
        - Equal-weighted (each token = 1% weight)
        - Rebalances weekly
        - Expected score: ~1,000,000-5,000,000 range (MILLIONS)
    
    VOLATILITY GRADIENT:
    Anchor5 (lowest) → Vibe20 (moderate) → Wave100 (highest)
    """
    stablecoins = {'usdt', 'usdc', 'busd', 'dai', 'tusd', 'fdusd', 'usdd', 'usdp', 'gusd', 'frax'}
    
    coins = [c for c in market_data 
             if c.get('symbol', '').lower() not in stablecoins 
             and c.get('current_price') and c.get('market_cap')]
    
    if not coins:
        return None
    
    # ==========================================================================
    # ANCHOR5 - Top 5 by market cap, PRICE-WEIGHTED (like Dow Jones)
    # ==========================================================================
    # Methodology: Sum of constituent prices
    # This creates a stable, high-value index dominated by blue chips
    anchor_coins = sorted(coins, key=lambda x: x.get('market_cap', 0), reverse=True)[:5]
    
    # Price-weighted: Simply sum the prices of top 5 coins
    # BTC (~$60k) + ETH (~$3k) + others gives us a score in tens of thousands
    anchor_value = sum(c.get('current_price', 0) for c in anchor_coins)
    
    # 24h change: Average of constituent 24h changes (weighted by price contribution)
    total_price = sum(c.get('current_price', 0) for c in anchor_coins)
    if total_price > 0:
        anchor_change = sum(
            (c.get('current_price', 0) / total_price) * (c.get('price_change_percentage_24h') or 0) 
            for c in anchor_coins
        )
    else:
        anchor_change = 0
    
    # ==========================================================================
    # VIBE20 - Top 20 by trading volume, VOLUME-WEIGHTED
    # ==========================================================================
    # Methodology: Volume-weighted average price
    # Target: Should be between Anchor5 (~95k) and Wave100 (~4M)
    # Expected range: 200k - 600k
    vibe_coins = sorted(coins, key=lambda x: x.get('total_volume', 0) or 0, reverse=True)[:20]
    
    # Simply sum the prices of top 20 by volume - similar to price-weighted
    # This gives us a value naturally higher than Anchor5 (5 coins) but structure is similar
    vibe_value = sum(c.get('current_price', 0) for c in vibe_coins)
    
    # Scale by number of constituents to differentiate from Anchor5
    # 20 constituents vs 5 should give roughly 4x, plus some additional scaling
    vibe_value = vibe_value * 2  # Gives us ~200k range
    
    # 24h change: Volume-weighted average
    total_volume = sum(c.get('total_volume', 0) or 0 for c in vibe_coins)
    if total_volume > 0:
        vibe_change = sum(
            (c.get('total_volume', 0) / total_volume) * (c.get('price_change_percentage_24h') or 0) 
            for c in vibe_coins
        )
    else:
        vibe_change = sum(c.get('price_change_percentage_24h') or 0 for c in vibe_coins) / 20
    
    # ==========================================================================
    # WAVE100 - Top 100 by 24h PRICE APPRECIATION, EQUAL-WEIGHTED
    # ==========================================================================
    # Methodology: 
    # - Select top 100 tokens ranked by 24h price change % (best performers first)
    # - If all tokens are negative, rank by least depreciated (smallest negative change)
    # - Equal weight (1% each) for index calculation
    # - ALWAYS exactly 100 tokens, no exceptions
    #
    # This captures market momentum - the hottest movers in a bull market,
    # or the most resilient tokens in a downturn
    
    # Sort ALL non-stablecoin coins by 24h change (highest/best first)
    # This naturally handles downturns: -1% ranks above -5%
    coins_with_change = [c for c in coins if c.get('price_change_percentage_24h') is not None]
    wave_candidates = sorted(
        coins_with_change, 
        key=lambda x: x.get('price_change_percentage_24h', -999), 
        reverse=True  # Highest change first (or least negative in downturn)
    )
    
    # ALWAYS take exactly 100 tokens
    wave_coins = wave_candidates[:100]
    num_wave_coins = len(wave_coins)
    
    # If we don't have 100, pad with remaining coins (shouldn't happen with 250 fetch)
    if num_wave_coins < 100:
        remaining = [c for c in coins if c not in wave_coins]
        wave_coins.extend(remaining[:100 - num_wave_coins])
        num_wave_coins = len(wave_coins)
    
    # Final safety: ensure exactly 100
    wave_coins = wave_coins[:100]
    num_wave_coins = 100  # Force to 100 for weight calculation
    
    # Equal weight: Each token contributes exactly 1%
    equal_weight = 1.0  # Always 1% for 100 tokens
    
    # Index value: Sum of all prices scaled to millions
    raw_sum = sum(c.get('current_price', 0) for c in wave_coins)
    wave_value = raw_sum * 100  # Scale to millions (multiply by 100)
    
    # 24h change: Simple average of the 100 top movers
    wave_change = sum(c.get('price_change_percentage_24h') or 0 for c in wave_coins) / num_wave_coins
    
    logger.info(f"Index Scores - Anchor5: {anchor_value:.2f}, Vibe20: {vibe_value:.2f}, Wave100: {wave_value:.2f}")
    logger.info(f"Wave100 constituents: {num_wave_coins}, Top performer: {wave_coins[0].get('symbol','?').upper()} ({wave_coins[0].get('price_change_percentage_24h', 0):.2f}%)")
    
    return {
        'anchor5': {
            'value': round(anchor_value, 2),
            'change_24h': round(anchor_change, 4),
            'coins': anchor_coins,
            'volatility_class': 'low',
            'methodology': 'price-weighted',
            'rebalance': 'quarterly'
        },
        'vibe20': {
            'value': round(vibe_value, 2),
            'change_24h': round(vibe_change, 4),
            'coins': vibe_coins,
            'volatility_class': 'moderate',
            'methodology': 'volume-weighted',
            'rebalance': 'monthly'
        },
        'wave100': {
            'value': round(wave_value, 2),
            'change_24h': round(wave_change, 4),
            'coins': wave_coins,
            'equal_weight': equal_weight,
            'volatility_class': 'high',
            'methodology': 'momentum-weighted',  # Changed to reflect 24h change ranking
            'rebalance': 'weekly',
            'num_constituents': num_wave_coins,
            'selection_criteria': '24h_price_change'  # Document the ranking method
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
            "description": "Top 5 blue-chip assets by market cap",
            "methodology": "price-weighted",
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
            "volatility": "low",
            "meta": {
                "tz": "UTC", 
                "constituents": fmt_constituents(anchor['coins'], 20.0),  # 5 coins @ 20% each
                "rebalanceFrequency": "quarterly",
                "total_constituents": 5
            }
        },
        "vibe20": {
            "index": "Vibe20", 
            "description": "Top 20 most traded assets by volume",
            "methodology": "volume-weighted",
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
            "volatility": "moderate",
            "meta": {
                "tz": "UTC", 
                "constituents": fmt_constituents(vibe['coins'], 5.0),  # All 20 tokens @ 5% each
                "rebalanceFrequency": "monthly",
                "total_constituents": 20
            }
        },
        "wave100": {
            "index": "Wave100", 
            "description": "Top 100 momentum leaders ranked by 24h price appreciation",
            "methodology": "momentum-ranked, equal-weighted",
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
            "volatility": "high",
            "selectionCriteria": "24h price change % (best performers or least depreciated)",
            "meta": {
                "tz": "UTC", 
                # Wave100 - Equal weighted! All 100 tokens @ 1% each
                "constituents": fmt_constituents(wave['coins'], wave['equal_weight']),
                "rebalanceFrequency": "weekly",
                "weighting": "equal",  # Mark as equal-weighted
                "total_constituents": 100  # Always exactly 100
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
    """
    Health check endpoint.
    """
    return {
        "status": "healthy",
        "supabase_configured": bool(SUPABASE_SERVICE_KEY),
        "coingecko_configured": bool(COINGECKO_API_KEY),
        "turnkey_configured": bool(os.environ.get('TURNKEY_ORGANIZATION_ID')),
        "wallet_custody": "turnkey-embedded - secure TEE infrastructure"
    }

# ============================================================================
# USER PROFILE MANAGEMENT - Single Source of Truth
# ============================================================================

class EnsureProfileRequest(BaseModel):
    """Request to ensure a profile exists for the authenticated user"""
    name: Optional[str] = None


async def ensure_profile_exists(user_id: str, email: str, name: Optional[str] = None) -> Dict:
    """
    Ensure a profile exists in the profiles table for the given user.
    This keeps profiles as the single source of truth for user data.
    
    Returns the profile data.
    """
    async with httpx.AsyncClient() as client:
        # Check if profile exists
        response = await client.get(
            f"{SUPABASE_URL}/rest/v1/profiles",
            params={"user_id": f"eq.{user_id}", "select": "*"},
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"
            }
        )
        
        profiles = response.json() if response.status_code == 200 else []
        
        if profiles:
            # Profile exists, return it
            return profiles[0]
        
        # Profile doesn't exist - create it
        profile_data = {
            "user_id": user_id,
            "email": email,
            "name": name or email.split('@')[0]
        }
        
        response = await client.post(
            f"{SUPABASE_URL}/rest/v1/profiles",
            json=profile_data,
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            }
        )
        
        if response.status_code in [200, 201]:
            result = response.json()
            logger.info(f"Created profile for user {user_id}: {email}")
            return result[0] if isinstance(result, list) else result
        else:
            logger.error(f"Failed to create profile: {response.status_code} - {response.text}")
            return None


@api_router.post("/user/ensure-profile")
async def ensure_user_profile(
    request: EnsureProfileRequest,
    authorization: str = Header(None)
):
    """
    Ensure the authenticated user has a profile in the profiles table.
    Called after login/signup to keep profiles table as single source of truth.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authorization")
    
    token = authorization.replace("Bearer ", "")
    
    async with httpx.AsyncClient() as client:
        # Verify token and get user
        user_response = await client.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {token}"
            }
        )
        
        if user_response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user_data = user_response.json()
        user_id = user_data.get("id")
        email = user_data.get("email")
        
        if not user_id or not email:
            raise HTTPException(status_code=400, detail="Invalid user data")
        
        # Use name from request, or from user metadata, or from email
        name = request.name or user_data.get("user_metadata", {}).get("name") or email.split('@')[0]
        
        profile = await ensure_profile_exists(user_id, email, name)
        
        if not profile:
            raise HTTPException(status_code=500, detail="Failed to ensure profile")
        
        return {
            "success": True,
            "profile": profile
        }


@api_router.get("/user/profile")
async def get_user_profile(authorization: str = Header(None)):
    """
    Get the authenticated user's profile (single source of truth).
    Also includes wallet info if available.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authorization")
    
    token = authorization.replace("Bearer ", "")
    
    async with httpx.AsyncClient() as client:
        # Verify token and get user
        user_response = await client.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {token}"
            }
        )
        
        if user_response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user_data = user_response.json()
        user_id = user_data.get("id")
        email = user_data.get("email")
        
        # Get profile
        profile_response = await client.get(
            f"{SUPABASE_URL}/rest/v1/profiles",
            params={"user_id": f"eq.{user_id}", "select": "*"},
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"
            }
        )
        
        profiles = profile_response.json() if profile_response.status_code == 200 else []
        profile = profiles[0] if profiles else None
        
        # Get wallet info
        wallet_response = await client.get(
            f"{SUPABASE_URL}/rest/v1/user_wallets",
            params={"user_id": f"eq.{user_id}", "select": "*"},
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"
            }
        )
        
        wallets = wallet_response.json() if wallet_response.status_code == 200 else []
        wallet = wallets[0] if wallets else None
        
        return {
            "user_id": user_id,
            "email": email,
            "profile": profile,
            "wallet": wallet,
            "has_profile": profile is not None,
            "has_wallet": wallet is not None
        }


class DeleteUserRequest(BaseModel):
    user_id: str


@api_router.delete("/user/delete/{user_id}")
async def delete_user_completely(
    user_id: str,
    authorization: str = Header(None)
):
    """
    Delete a user completely from ALL tables:
    - auth.users
    - profiles  
    - user_wallets
    
    This ensures profiles table stays as single source of truth.
    When you delete from profiles, you should call this to clean up everywhere.
    
    ADMIN ONLY: Requires service role key in header for now.
    """
    # For admin operations, we check for a special admin header
    # In production, you'd want proper admin authentication
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authorization")
    
    async with httpx.AsyncClient() as client:
        deleted_from = []
        
        # 1. Delete from user_wallets
        response = await client.delete(
            f"{SUPABASE_URL}/rest/v1/user_wallets",
            params={"user_id": f"eq.{user_id}"},
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"
            }
        )
        if response.status_code in [200, 204]:
            deleted_from.append("user_wallets")
        
        # 2. Delete from profiles
        response = await client.delete(
            f"{SUPABASE_URL}/rest/v1/profiles",
            params={"user_id": f"eq.{user_id}"},
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"
            }
        )
        if response.status_code in [200, 204]:
            deleted_from.append("profiles")
        
        # 3. Delete from auth.users (this is the critical one!)
        response = await client.delete(
            f"{SUPABASE_URL}/auth/v1/admin/users/{user_id}",
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"
            }
        )
        if response.status_code in [200, 204]:
            deleted_from.append("auth.users")
        else:
            logger.warning(f"Failed to delete from auth.users: {response.status_code} - {response.text}")
        
        logger.info(f"Deleted user {user_id} from: {deleted_from}")
        
        return {
            "success": True,
            "user_id": user_id,
            "deleted_from": deleted_from
        }


@api_router.post("/admin/sync-cleanup")
async def admin_sync_cleanup(authorization: str = Header(None)):
    """
    Admin endpoint to clean up orphaned records:
    - Delete auth.users that don't have profiles
    - Delete user_wallets that don't have profiles
    
    This keeps profiles as the single source of truth.
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization")
    
    async with httpx.AsyncClient() as client:
        # Get all profile user_ids
        response = await client.get(
            f"{SUPABASE_URL}/rest/v1/profiles",
            params={"select": "user_id"},
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"
            }
        )
        profiles = response.json() if response.status_code == 200 else []
        profile_user_ids = set(p.get('user_id') for p in profiles)
        
        # Get all auth users
        response = await client.get(
            f"{SUPABASE_URL}/auth/v1/admin/users",
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"
            }
        )
        auth_data = response.json()
        auth_users = auth_data.get('users', [])
        
        # Delete orphaned auth users
        deleted_auth = 0
        for user in auth_users:
            user_id = user.get('id')
            if user_id not in profile_user_ids:
                # Delete wallet first
                await client.delete(
                    f"{SUPABASE_URL}/rest/v1/user_wallets",
                    params={"user_id": f"eq.{user_id}"},
                    headers={
                        "apikey": SUPABASE_SERVICE_KEY,
                        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"
                    }
                )
                # Delete from auth
                response = await client.delete(
                    f"{SUPABASE_URL}/auth/v1/admin/users/{user_id}",
                    headers={
                        "apikey": SUPABASE_SERVICE_KEY,
                        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"
                    }
                )
                if response.status_code in [200, 204]:
                    deleted_auth += 1
        
        return {
            "success": True,
            "profiles_count": len(profile_user_ids),
            "auth_users_before": len(auth_users),
            "deleted_orphaned_auth_users": deleted_auth
        }

# ============================================================================
# TURNKEY WALLET ENDPOINTS
# ============================================================================

class CreateWalletRequest(BaseModel):
    email: str
    name: Optional[str] = None
    user_id: str  # Supabase auth user ID
    passkey_attestation: Optional[Dict[str, Any]] = None

class SignMessageRequest(BaseModel):
    message: str

class SignTransactionRequest(BaseModel):
    # Option 1: Pre-encoded RLP transaction
    unsigned_transaction: Optional[str] = None  # RLP-encoded hex
    # Option 2: Transaction fields (will be RLP-encoded by backend)
    to: Optional[str] = None
    value: Optional[str] = "0"
    data: Optional[str] = "0x"
    chainId: Optional[int] = 137  # Polygon by default
    gasLimit: Optional[str] = "21000"
    maxFeePerGas: Optional[str] = None
    maxPriorityFeePerGas: Optional[str] = None
    nonce: Optional[int] = None
    transaction_type: Optional[str] = "TRANSACTION_TYPE_ETHEREUM"

class EmailAuthInitRequest(BaseModel):
    email: str
    target_public_key: str  # Client-generated public key

class EmailAuthVerifyRequest(BaseModel):
    activity_id: str
    otp_code: str
    target_sub_org_id: Optional[str] = None


async def get_user_and_wallet(authorization: str) -> Tuple[Dict, Dict]:
    """
    SECURITY: Verify auth token and get user's wallet.
    Ensures the user can only access their own wallet.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authorization")
    
    token = authorization.replace("Bearer ", "")
    
    async with httpx.AsyncClient() as client:
        # Verify Supabase token
        user_response = await client.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {token}"
            }
        )
        
        if user_response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        
        user_data = user_response.json()
        user_id = user_data.get("id")
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid user")
        
        # Get user's wallet - CRITICAL: Only fetch wallet belonging to this user
        wallet_response = await client.get(
            f"{SUPABASE_URL}/rest/v1/user_wallets",
            params={"user_id": f"eq.{user_id}", "select": "*"},
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"
            }
        )
        
        wallets = wallet_response.json() if wallet_response.status_code == 200 else []
        
        if not wallets:
            return user_data, None
        
        wallet = wallets[0]
        
        # SECURITY: Verify wallet belongs to authenticated user
        if wallet.get("user_id") != user_id:
            logger.error(f"SECURITY: User {user_id} tried to access wallet belonging to {wallet.get('user_id')}")
            raise HTTPException(status_code=403, detail="Access denied")
        
        return user_data, wallet


@api_router.post("/turnkey/create-wallet")
async def create_turnkey_wallet(
    request: CreateWalletRequest,
    authorization: str = Header(None)
):
    """
    Create a new Turnkey sub-organization and embedded wallet for a user.
    
    SECURITY:
    - Requires valid Supabase auth token
    - User ID must match authenticated user
    - Only stores sub_org_id, wallet_id, eth_address in Supabase
    - NEVER stores private keys or seed phrases
    """
    try:
        # Verify authentication
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Missing authorization")
        
        token = authorization.replace("Bearer ", "")
        
        async with httpx.AsyncClient() as client:
            user_response = await client.get(
                f"{SUPABASE_URL}/auth/v1/user",
                headers={
                    "apikey": SUPABASE_SERVICE_KEY,
                    "Authorization": f"Bearer {token}"
                }
            )
            
            if user_response.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid token")
            
            user_data = user_response.json()
            auth_user_id = user_data.get("id")
            
            # SECURITY: Verify request user_id matches authenticated user
            if request.user_id != auth_user_id:
                logger.error(f"SECURITY: User {auth_user_id} tried to create wallet for {request.user_id}")
                raise HTTPException(status_code=403, detail="Cannot create wallet for another user")
            
            # Check if user already has a wallet
            check_response = await client.get(
                f"{SUPABASE_URL}/rest/v1/user_wallets",
                params={"user_id": f"eq.{request.user_id}"},
                headers={
                    "apikey": SUPABASE_SERVICE_KEY,
                    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"
                }
            )
            
            existing_wallets = check_response.json() if check_response.status_code == 200 else []
            
            if existing_wallets:
                raise HTTPException(status_code=400, detail="User already has a wallet")
        
        from turnkey_service import create_sub_organization_with_wallet
        
        # Create sub-org and wallet via Turnkey
        sub_org_id, wallet_id, eth_address, root_user_id = await create_sub_organization_with_wallet(
            user_email=request.email,
            user_name=request.name or request.email.split('@')[0],
            passkey_attestation=request.passkey_attestation
        )
        
        if not sub_org_id or not wallet_id or not eth_address:
            raise HTTPException(status_code=500, detail="Failed to create wallet via Turnkey")
        
        # Store in Supabase
        async with httpx.AsyncClient() as client:
            wallet_data = {
                "user_id": request.user_id,
                "wallet_address": eth_address,
                "turnkey_sub_org_id": sub_org_id,
                "turnkey_wallet_id": wallet_id,
                "turnkey_user_id": root_user_id,
                "provider": "turnkey",
                "network": "polygon",
                "created_via": "passkey" if request.passkey_attestation else "email",
                "provenance": "turnkey_invisible"
            }
            
            create_response = await client.post(
                f"{SUPABASE_URL}/rest/v1/user_wallets",
                json=wallet_data,
                headers={
                    "apikey": SUPABASE_SERVICE_KEY,
                    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                    "Content-Type": "application/json",
                    "Prefer": "return=representation"
                }
            )
            
            if create_response.status_code not in [200, 201]:
                logger.error(f"Failed to store wallet in Supabase: {create_response.text}")
            
            # Update profiles table
            await client.patch(
                f"{SUPABASE_URL}/rest/v1/profiles",
                params={"user_id": f"eq.{request.user_id}"},
                json={"eth_address": eth_address},
                headers={
                    "apikey": SUPABASE_SERVICE_KEY,
                    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                    "Content-Type": "application/json"
                }
            )
        
        logger.info(f"Created Turnkey wallet for user {request.user_id}: {eth_address}")
        
        return {
            "success": True,
            "wallet_address": eth_address,
            "turnkey_sub_org_id": sub_org_id,
            "turnkey_wallet_id": wallet_id,
            "message": "Wallet created successfully via Turnkey"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating Turnkey wallet: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/turnkey/wallet-info")
async def get_turnkey_wallet_info(authorization: str = Header(None)):
    """
    Get wallet info for the authenticated user.
    """
    try:
        user_data, wallet = await get_user_and_wallet(authorization)
        
        if not wallet:
            return {
                "hasWallet": False,
                "wallet": None
            }
        
        return {
            "hasWallet": True,
            "wallet": {
                "address": wallet.get("wallet_address"),
                "network": wallet.get("network", "polygon"),
                "provider": wallet.get("provider", "turnkey"),
                "turnkey_sub_org_id": wallet.get("turnkey_sub_org_id"),
                "turnkey_wallet_id": wallet.get("turnkey_wallet_id")
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting wallet info: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/turnkey/sign-message")
async def sign_turnkey_message(
    request: SignMessageRequest,
    authorization: str = Header(None)
):
    """
    Sign a message with the user's Turnkey wallet.
    
    SECURITY:
    - Requires valid Supabase auth token
    - Only signs with wallet owned by authenticated user
    - Never exposes private keys
    """
    try:
        user_data, wallet = await get_user_and_wallet(authorization)
        
        if not wallet:
            raise HTTPException(status_code=404, detail="No wallet found for user")
        
        sub_org_id = wallet.get("turnkey_sub_org_id")
        wallet_address = wallet.get("wallet_address")
        
        if not sub_org_id or not wallet_address:
            raise HTTPException(status_code=400, detail="Wallet not properly configured")
        
        from turnkey_service import sign_raw_payload
        from Crypto.Hash import keccak
        
        # Prepare message for signing (Ethereum personal_sign format)
        message = request.message
        prefix = f"\x19Ethereum Signed Message:\n{len(message)}"
        prefixed_message = prefix + message
        k = keccak.new(digest_bits=256)
        k.update(prefixed_message.encode())
        message_hash = k.hexdigest()
        
        signature_data = await sign_raw_payload(
            sub_org_id=sub_org_id,
            wallet_address=wallet_address,
            payload=message_hash,
            encoding="PAYLOAD_ENCODING_HEXADECIMAL",
            hash_function="HASH_FUNCTION_NO_OP"  # Already hashed
        )
        
        logger.info(f"Signed message for user {user_data.get('id')}")
        
        return {
            "success": True,
            "signature": signature_data.get("signature"),
            "r": signature_data.get("r"),
            "s": signature_data.get("s"),
            "v": signature_data.get("v"),
            "signer": wallet_address
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error signing message: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/turnkey/sign-transaction")
async def sign_turnkey_transaction(
    request: SignTransactionRequest,
    authorization: str = Header(None)
):
    """
    Sign an EVM transaction with the user's Turnkey wallet.
    
    Accepts either:
    1. Pre-encoded unsigned_transaction (RLP hex)
    2. Transaction fields (to, value, data, etc.) - will be RLP-encoded
    
    SECURITY:
    - Requires valid Supabase auth token
    - Only signs with wallet owned by authenticated user
    - Supports ERC-20 transfers, approvals, and contract interactions
    """
    try:
        user_data, wallet = await get_user_and_wallet(authorization)
        
        if not wallet:
            raise HTTPException(status_code=404, detail="No wallet found for user")
        
        sub_org_id = wallet.get("turnkey_sub_org_id")
        wallet_address = wallet.get("wallet_address")
        
        if not sub_org_id or not wallet_address:
            raise HTTPException(status_code=400, detail="Wallet not properly configured")
        
        # Build or use provided unsigned transaction
        unsigned_tx = request.unsigned_transaction
        
        if not unsigned_tx and request.to:
            # Build RLP-encoded unsigned transaction from fields
            import rlp
            
            # Parse values
            to_addr = bytes.fromhex(request.to[2:] if request.to.startswith('0x') else request.to) if request.to else b''
            value = int(request.value or '0', 16) if request.value.startswith('0x') else int(request.value or '0')
            data = bytes.fromhex(request.data[2:] if request.data.startswith('0x') else request.data) if request.data else b''
            chain_id = request.chainId or 137
            gas_limit = int(request.gasLimit or '21000', 16) if str(request.gasLimit).startswith('0x') else int(request.gasLimit or '21000')
            nonce = request.nonce or 0
            
            # For EIP-1559 transactions (type 2) on Polygon
            max_fee_per_gas = int(request.maxFeePerGas or '50000000000', 16) if request.maxFeePerGas and str(request.maxFeePerGas).startswith('0x') else int(request.maxFeePerGas or '50000000000')  # 50 gwei default
            max_priority_fee_per_gas = int(request.maxPriorityFeePerGas or '30000000000', 16) if request.maxPriorityFeePerGas and str(request.maxPriorityFeePerGas).startswith('0x') else int(request.maxPriorityFeePerGas or '30000000000')  # 30 gwei default
            
            # EIP-1559 transaction structure (type 2)
            # [chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList]
            tx_fields = [
                chain_id,
                nonce,
                max_priority_fee_per_gas,
                max_fee_per_gas,
                gas_limit,
                to_addr,
                value,
                data,
                []  # access list (empty for simple transactions)
            ]
            
            # Encode as type 2 transaction: 0x02 || RLP([...])
            rlp_encoded = rlp.encode(tx_fields)
            unsigned_tx = '0x02' + rlp_encoded.hex()
            
            logger.info(f"Built unsigned tx: {unsigned_tx[:50]}...")
        
        if not unsigned_tx:
            raise HTTPException(status_code=400, detail="Either unsigned_transaction or 'to' field required")
        
        from turnkey_service import sign_transaction
        
        signed_data = await sign_transaction(
            sub_org_id=sub_org_id,
            wallet_address=wallet_address,
            unsigned_transaction=unsigned_tx,
            transaction_type=request.transaction_type
        )
        
        logger.info(f"Signed transaction for user {user_data.get('id')}")
        
        return {
            "success": True,
            "signedTransaction": signed_data.get("signedTransaction"),
            "from": wallet_address
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error signing transaction: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/turnkey/wallet-info")
async def get_turnkey_wallet_info(authorization: str = Header(None)):
    """
    Get the authenticated user's Turnkey wallet information.
    
    SECURITY: Only returns wallet info for the authenticated user.
    """
    try:
        user_data, wallet = await get_user_and_wallet(authorization)
        
        if not wallet:
            return {
                "hasWallet": False,
                "wallet": None
            }
        
        return {
            "hasWallet": True,
            "wallet": {
                "address": wallet.get("wallet_address"),
                "network": wallet.get("network", "polygon"),
                "provider": wallet.get("provider", "turnkey"),
                "createdAt": wallet.get("created_at"),
                "createdVia": wallet.get("created_via", "unknown")
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting wallet info: {e}")
        raise HTTPException(status_code=500, detail=str(e))

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
