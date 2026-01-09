import { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volumeUsd: number;
}

interface TokenComposition {
  id: string;
  symbol: string;
  weight: number;
  price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d?: number;
  price_change_percentage_30d?: number;
}

interface PerformanceMetrics {
  ytd: number;
  one_month: number;
  three_month: number;
  one_year: number;
  since_inception: number;
  high_52_week: number;
  low_52_week: number;
}

interface RiskMetrics {
  volatility_30d: number;
  volatility_90d: number;
  sharpe_ratio: number;
  max_drawdown: number;
  max_drawdown_date?: string;
  beta_vs_btc: number;
  correlation_with_btc: number;
}

interface RebalanceInfo {
  last_rebalance: string;
  next_rebalance: string;
  days_until_rebalance: number;
  frequency: string;
  constituents_added?: string[];
  constituents_removed?: string[];
}

interface IndexMetadata {
  base_value: number;
  base_date: string;
  divisor: number;
  methodology_version: string;
  total_constituents: number;
  rebalance_info: RebalanceInfo;
}

export interface IndexData {
  index: string;
  baseValue: number;
  timeframe: string;
  candles: Candle[];
  currentValue: number;
  change_24h_percentage: number;
  change_7d_percentage?: number;
  meta: {
    tz: string;
    constituents: TokenComposition[];
    rebalanceFrequency: string;
    metadata?: IndexMetadata;
    performance?: PerformanceMetrics;
    risk?: RiskMetrics;
  };
}

export type TimePeriod = 'daily' | 'month' | 'year' | 'all';

interface CacheEntry {
  data: {
    anchor5: IndexData | null;
    vibe20: IndexData | null;
    wave100: IndexData | null;
  };
  timestamp: number;
  traditionalMarkets: any[];
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL || '';

const CACHE_TTL: Record<TimePeriod, number> = {
  daily: 60 * 1000,
  month: 2 * 60 * 1000,
  year: 5 * 60 * 1000,
  all: 10 * 60 * 1000,
};

const dataCache = new Map<TimePeriod, CacheEntry>();

// ============================================================================
// CALCULATION HELPERS
// ============================================================================

const calculatePerformanceMetrics = (candles: Candle[], baseValue: number): PerformanceMetrics => {
  if (!candles || candles.length === 0) {
    return { ytd: 0, one_month: 0, three_month: 0, one_year: 0, since_inception: 0, high_52_week: baseValue, low_52_week: baseValue };
  }
  
  const currentPrice = candles[candles.length - 1].close;
  const now = new Date();
  const nowTime = Math.floor(now.getTime() / 1000);
  
  const findCandleAtTime = (targetTime: number): Candle | null => {
    if (candles[0].time > targetTime) return null;
    let closest = candles[0];
    for (const candle of candles) {
      if (candle.time <= targetTime) closest = candle;
      else break;
    }
    return closest;
  };
  
  const calculateReturn = (pastCandle: Candle | null): number => {
    if (!pastCandle) return 0;
    return (currentPrice - pastCandle.close) / pastCandle.close * 100;
  };
  
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const recentCandles = candles.filter(c => c.time >= nowTime - 365 * 86400);
  
  return {
    ytd: calculateReturn(findCandleAtTime(Math.floor(yearStart.getTime() / 1000))),
    one_month: calculateReturn(findCandleAtTime(nowTime - 30 * 86400)),
    three_month: calculateReturn(findCandleAtTime(nowTime - 90 * 86400)),
    one_year: calculateReturn(findCandleAtTime(nowTime - 365 * 86400)),
    since_inception: (currentPrice - candles[0].open) / candles[0].open * 100,
    high_52_week: recentCandles.length > 0 ? Math.max(...recentCandles.map(c => c.high)) : currentPrice,
    low_52_week: recentCandles.length > 0 ? Math.min(...recentCandles.map(c => c.low)) : currentPrice
  };
};

const calculateRiskMetrics = (candles: Candle[]): RiskMetrics => {
  if (!candles || candles.length < 2) {
    return { volatility_30d: 0, volatility_90d: 0, sharpe_ratio: 0, max_drawdown: 0, beta_vs_btc: 0, correlation_with_btc: 0 };
  }
  
  const dailyReturns: number[] = [];
  for (let i = 1; i < candles.length; i++) {
    dailyReturns.push((candles[i].close - candles[i - 1].close) / candles[i - 1].close);
  }
  
  const calculateStdDev = (values: number[]): number => {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  };
  
  let maxDrawdown = 0;
  let peak = candles[0].close;
  
  for (let i = 1; i < candles.length; i++) {
    if (candles[i].close > peak) peak = candles[i].close;
    else {
      const drawdown = (candles[i].close - peak) / peak * 100;
      if (drawdown < maxDrawdown) maxDrawdown = drawdown;
    }
  }
  
  const avgReturn = dailyReturns.reduce((sum, val) => sum + val, 0) / dailyReturns.length;
  const annualizedVol = calculateStdDev(dailyReturns) * Math.sqrt(365);
  
  return {
    volatility_30d: calculateStdDev(dailyReturns.slice(-30)) * Math.sqrt(365) * 100,
    volatility_90d: calculateStdDev(dailyReturns.slice(-90)) * Math.sqrt(365) * 100,
    sharpe_ratio: annualizedVol !== 0 ? (avgReturn * 365) / annualizedVol : 0,
    max_drawdown: maxDrawdown,
    beta_vs_btc: 0,
    correlation_with_btc: 0
  };
};

const enhanceIndexData = (indexData: IndexData | null, frequency: string): IndexData | null => {
  if (!indexData || !indexData.candles || indexData.candles.length === 0) return indexData;
  
  const performance = calculatePerformanceMetrics(indexData.candles, indexData.baseValue);
  const risk = calculateRiskMetrics(indexData.candles);
  
  const now = new Date();
  const currentQuarter = Math.floor(now.getMonth() / 3);
  const lastRebalance = frequency === 'Quarterly' 
    ? new Date(now.getFullYear(), currentQuarter * 3, 1)
    : new Date(now.getFullYear(), now.getMonth(), 1);
  const nextRebalance = frequency === 'Quarterly'
    ? new Date(now.getFullYear(), (currentQuarter + 1) * 3, 1)
    : new Date(now.getFullYear(), now.getMonth() + 1, 1);
  
  return {
    ...indexData,
    meta: {
      ...indexData.meta,
      performance,
      risk,
      metadata: {
        base_value: indexData.baseValue || 1000,
        base_date: indexData.candles[0] ? new Date(indexData.candles[0].time * 1000).toISOString().split('T')[0] : '2024-01-01',
        divisor: 1.0,
        methodology_version: '1.0',
        total_constituents: indexData.meta.constituents?.length || 0,
        rebalance_info: {
          last_rebalance: lastRebalance.toISOString(),
          next_rebalance: nextRebalance.toISOString(),
          days_until_rebalance: Math.ceil((nextRebalance.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
          frequency
        }
      }
    }
  };
};

// ============================================================================
// MAIN HOOK
// ============================================================================

export function useIndicesData(timePeriod: TimePeriod) {
  const [anchorData, setAnchorData] = useState<IndexData | null>(null);
  const [vibeData, setVibeData] = useState<IndexData | null>(null);
  const [waveData, setWaveData] = useState<IndexData | null>(null);
  const [traditionalMarkets, setTraditionalMarkets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  const currentRequestId = useRef<number>(0);

  const isCacheValid = useCallback((period: TimePeriod): boolean => {
    const cached = dataCache.get(period);
    if (!cached) return false;
    return Date.now() - cached.timestamp < CACHE_TTL[period];
  }, []);

  const getCachedData = useCallback((period: TimePeriod): CacheEntry | null => {
    if (isCacheValid(period)) return dataCache.get(period) || null;
    return null;
  }, [isCacheValid]);

  const fetchFromBackend = useCallback(async (period: TimePeriod, requestId: number) => {
    const maxAttempts = 3;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`[useIndicesData] Fetching from backend (attempt ${attempt})`);
        
        // Fetch indices from backend
        const indicesResponse = await fetch(`${BACKEND_URL}/api/crypto-indices`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ timePeriod: period })
        });
        
        if (requestId !== currentRequestId.current) return null;
        
        if (!indicesResponse.ok) {
          throw new Error(`Backend error: ${indicesResponse.status}`);
        }
        
        const data = await indicesResponse.json();
        
        // Fetch traditional markets
        let markets: any[] = [];
        try {
          const marketsResponse = await fetch(`${BACKEND_URL}/api/traditional-markets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          if (marketsResponse.ok) {
            const marketsData = await marketsResponse.json();
            markets = marketsData.fallback || [];
          }
        } catch (e) {
          console.warn('[useIndicesData] Failed to fetch traditional markets');
        }
        
        return {
          indices: {
            anchor5: enhanceIndexData(data.anchor5, 'Quarterly'),
            vibe20: enhanceIndexData(data.vibe20, 'Monthly'),
            wave100: enhanceIndexData(data.wave100, 'Monthly')
          },
          markets
        };
        
      } catch (err: any) {
        console.error(`[useIndicesData] Fetch error (attempt ${attempt}):`, err);
        
        if (requestId !== currentRequestId.current) return null;
        if (attempt === maxAttempts) throw err;
        
        await new Promise(r => setTimeout(r, 500 * attempt));
      }
    }
    
    return null;
  }, []);

  const loadData = useCallback(async (isRefresh = false) => {
    const requestId = ++currentRequestId.current;
    
    // Check cache first
    if (!isRefresh) {
      const cached = getCachedData(timePeriod);
      if (cached) {
        console.log(`[useIndicesData] Using cached data for ${timePeriod}`);
        setAnchorData(cached.data.anchor5);
        setVibeData(cached.data.vibe20);
        setWaveData(cached.data.wave100);
        setTraditionalMarkets(cached.traditionalMarkets);
        setLastUpdated(new Date(cached.timestamp));
        setError(null);
        return;
      }
    }
    
    if (isRefresh) setIsRefreshing(true);
    else setLoading(true);
    
    try {
      const result = await fetchFromBackend(timePeriod, requestId);
      if (!result) return;
      
      setAnchorData(result.indices.anchor5);
      setVibeData(result.indices.vibe20);
      setWaveData(result.indices.wave100);
      setTraditionalMarkets(result.markets);
      setLastUpdated(new Date());
      setError(null);
      
      dataCache.set(timePeriod, {
        data: result.indices,
        timestamp: Date.now(),
        traditionalMarkets: result.markets
      });
      
      console.log(`[useIndicesData] Loaded data for ${timePeriod}`);
      
    } catch (err: any) {
      if (requestId === currentRequestId.current) {
        setError(err?.message || 'Failed to load market data');
        
        // Try stale cache
        const staleCache = dataCache.get(timePeriod);
        if (staleCache) {
          console.log(`[useIndicesData] Using stale cache after error`);
          setAnchorData(staleCache.data.anchor5);
          setVibeData(staleCache.data.vibe20);
          setWaveData(staleCache.data.wave100);
          setTraditionalMarkets(staleCache.traditionalMarkets);
        }
      }
    } finally {
      if (requestId === currentRequestId.current) {
        setLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [timePeriod, getCachedData, fetchFromBackend]);

  const refreshData = useCallback(() => loadData(true), [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    anchorData,
    vibeData,
    waveData,
    traditionalMarkets,
    loading,
    isRefreshing,
    error,
    lastUpdated,
    refreshData
  };
}

export function clearIndicesCache(): void {
  dataCache.clear();
  console.log('[useIndicesData] Cache cleared');
}
