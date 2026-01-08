import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
// CACHE CONFIGURATION
// ============================================================================

// Cache TTLs based on time period (shorter periods need fresher data)
const CACHE_TTL: Record<TimePeriod, number> = {
  daily: 60 * 1000,      // 1 minute for daily view
  month: 2 * 60 * 1000,  // 2 minutes for monthly
  year: 5 * 60 * 1000,   // 5 minutes for yearly
  all: 10 * 60 * 1000,   // 10 minutes for all-time
};

// In-memory cache that persists across component renders
const dataCache = new Map<TimePeriod, CacheEntry>();

// ============================================================================
// CALCULATION FUNCTIONS
// ============================================================================

const calculatePerformanceMetrics = (candles: Candle[], baseValue: number): PerformanceMetrics => {
  if (!candles || candles.length === 0) {
    return {
      ytd: 0, one_month: 0, three_month: 0, one_year: 0, since_inception: 0,
      high_52_week: baseValue, low_52_week: baseValue
    };
  }
  
  const currentCandle = candles[candles.length - 1];
  const currentPrice = currentCandle.close;
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
  const ytdCandle = findCandleAtTime(Math.floor(yearStart.getTime() / 1000));
  
  const oneMonthCandle = findCandleAtTime(nowTime - 30 * 86400);
  const threeMonthCandle = findCandleAtTime(nowTime - 90 * 86400);
  const oneYearCandle = findCandleAtTime(nowTime - 365 * 86400);
  
  const fiftyTwoWeeksAgo = nowTime - 365 * 86400;
  const recentCandles = candles.filter(c => c.time >= fiftyTwoWeeksAgo);
  
  return {
    ytd: calculateReturn(ytdCandle),
    one_month: calculateReturn(oneMonthCandle),
    three_month: calculateReturn(threeMonthCandle),
    one_year: calculateReturn(oneYearCandle),
    since_inception: (currentPrice - candles[0].open) / candles[0].open * 100,
    high_52_week: recentCandles.length > 0 ? Math.max(...recentCandles.map(c => c.high)) : currentPrice,
    low_52_week: recentCandles.length > 0 ? Math.min(...recentCandles.map(c => c.low)) : currentPrice
  };
};

const calculateRiskMetrics = (candles: Candle[]): RiskMetrics => {
  if (!candles || candles.length < 2) {
    return {
      volatility_30d: 0, volatility_90d: 0, sharpe_ratio: 0,
      max_drawdown: 0, beta_vs_btc: 0, correlation_with_btc: 0
    };
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

  const returns30d = dailyReturns.slice(-Math.min(30, dailyReturns.length));
  const returns90d = dailyReturns.slice(-Math.min(90, dailyReturns.length));
  
  const avgReturn = dailyReturns.reduce((sum, val) => sum + val, 0) / dailyReturns.length;
  const annualizedVol = calculateStdDev(dailyReturns) * Math.sqrt(365);

  let maxDrawdown = 0;
  let maxDrawdownDate = '';
  let peak = candles[0].close;
  
  for (let i = 1; i < candles.length; i++) {
    if (candles[i].close > peak) {
      peak = candles[i].close;
    } else {
      const drawdown = (candles[i].close - peak) / peak * 100;
      if (drawdown < maxDrawdown) {
        maxDrawdown = drawdown;
        maxDrawdownDate = new Date(candles[i].time * 1000).toISOString().split('T')[0];
      }
    }
  }

  return {
    volatility_30d: calculateStdDev(returns30d) * Math.sqrt(365) * 100,
    volatility_90d: calculateStdDev(returns90d) * Math.sqrt(365) * 100,
    sharpe_ratio: annualizedVol !== 0 ? (avgReturn * 365) / annualizedVol : 0,
    max_drawdown: maxDrawdown,
    max_drawdown_date: maxDrawdownDate || undefined,
    beta_vs_btc: 0,
    correlation_with_btc: 0
  };
};

const calculateRebalanceInfo = (frequency: string): RebalanceInfo => {
  const now = new Date();
  let lastRebalance: Date;
  let nextRebalance: Date;
  
  if (frequency === 'Quarterly') {
    const currentQuarter = Math.floor(now.getMonth() / 3);
    lastRebalance = new Date(now.getFullYear(), currentQuarter * 3, 1);
    nextRebalance = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 1);
  } else {
    lastRebalance = new Date(now.getFullYear(), now.getMonth(), 1);
    nextRebalance = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }

  return {
    last_rebalance: lastRebalance.toISOString(),
    next_rebalance: nextRebalance.toISOString(),
    days_until_rebalance: Math.ceil((nextRebalance.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    frequency,
    constituents_added: [],
    constituents_removed: []
  };
};

const enhanceIndexData = (indexData: IndexData | null, frequency: string): IndexData | null => {
  if (!indexData || !indexData.candles || indexData.candles.length === 0) return null;
  
  const performance = calculatePerformanceMetrics(indexData.candles, indexData.baseValue);
  const risk = calculateRiskMetrics(indexData.candles);
  const rebalanceInfo = calculateRebalanceInfo(frequency);
  const totalMarketCap = indexData.meta.constituents?.reduce((sum, token) => sum + token.market_cap, 0) || 0;

  return {
    ...indexData,
    meta: {
      ...indexData.meta,
      performance,
      risk,
      metadata: {
        base_value: indexData.baseValue || 1000,
        base_date: indexData.candles[0] ? new Date(indexData.candles[0].time * 1000).toISOString().split('T')[0] : '2024-01-01',
        divisor: totalMarketCap > 0 ? totalMarketCap / indexData.baseValue : 1.0,
        methodology_version: '1.0',
        total_constituents: indexData.meta.constituents?.length || 0,
        rebalance_info: rebalanceInfo
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

  // Track the current request to prevent race conditions
  const currentRequestId = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Check if cache is valid for the given time period
  const isCacheValid = useCallback((period: TimePeriod): boolean => {
    const cached = dataCache.get(period);
    if (!cached) return false;
    return Date.now() - cached.timestamp < CACHE_TTL[period];
  }, []);

  // Get cached data if available
  const getCachedData = useCallback((period: TimePeriod): CacheEntry | null => {
    if (isCacheValid(period)) {
      return dataCache.get(period) || null;
    }
    return null;
  }, [isCacheValid]);

  // Fetch data from API (with small retry/backoff for transient edge/network failures)
  const fetchFromAPI = useCallback(async (
    period: TimePeriod,
    requestId: number
  ): Promise<{
    indices: { anchor5: IndexData | null; vibe20: IndexData | null; wave100: IndexData | null };
    markets: any[];
  } | null> => {
    const maxAttempts = 3;
    const baseDelayMs = 400;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const [indicesResponse, marketsResponse] = await Promise.all([
          supabase.functions.invoke('crypto-indices', { body: { timePeriod: period } }),
          supabase.functions.invoke('traditional-markets', { body: { timePeriod: period } })
        ]);

        // Check if this request is still the current one
        if (requestId !== currentRequestId.current) {
          console.log(`[useIndicesData] Request ${requestId} superseded, ignoring results`);
          return null;
        }

        if (indicesResponse.error) throw indicesResponse.error;

        const data = indicesResponse.data;
        const markets = marketsResponse.data?.fallback || marketsResponse.data || [];

        return {
          indices: {
            anchor5: enhanceIndexData(data.anchor5, 'Quarterly'),
            vibe20: enhanceIndexData(data.vibe20, 'Monthly'),
            wave100: enhanceIndexData(data.wave100, 'Monthly')
          },
          markets
        };
      } catch (err: any) {
        const msg = (err?.message || '').toLowerCase();
        const isTransient =
          msg.includes('failed to fetch') ||
          msg.includes('failed to send a request') ||
          msg.includes('network') ||
          msg.includes('timeout');

        console.error(`[useIndicesData] Error fetching data (attempt ${attempt}/${maxAttempts}):`, err);

        if (requestId !== currentRequestId.current) return null;
        if (!isTransient || attempt === maxAttempts) throw err;

        const delay = baseDelayMs * Math.pow(2, attempt - 1);
        await new Promise((r) => setTimeout(r, delay));
      }
    }

    return null;
  }, []);

  // Main data loading function
  const loadData = useCallback(async (isRefresh = false) => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    // Increment request ID to track this request
    const requestId = ++currentRequestId.current;

    // Check cache first (unless forcing refresh)
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

    // Set loading state
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const result = await fetchFromAPI(timePeriod, requestId);

      // If result is null, this request was superseded
      if (!result) return;

      // Update state with new data
      setAnchorData(result.indices.anchor5);
      setVibeData(result.indices.vibe20);
      setWaveData(result.indices.wave100);
      setTraditionalMarkets(result.markets);
      setLastUpdated(new Date());
      setError(null);

      // Update cache
      dataCache.set(timePeriod, {
        data: result.indices,
        timestamp: Date.now(),
        traditionalMarkets: result.markets
      });

      console.log(`[useIndicesData] Loaded and cached data for ${timePeriod}`);
    } catch (err: any) {
      // Only set error if this is still the current request
      if (requestId === currentRequestId.current) {
        const errorMsg = err?.message || 'Failed to load market data';
        setError(errorMsg);

        // Try to use stale cache on error
        const staleCache = dataCache.get(timePeriod);
        if (staleCache && !isRefresh) {
          console.log(`[useIndicesData] Using stale cache for ${timePeriod} after error`);
          setAnchorData(staleCache.data.anchor5);
          setVibeData(staleCache.data.vibe20);
          setWaveData(staleCache.data.wave100);
          setTraditionalMarkets(staleCache.traditionalMarkets);
        }
      }
    } finally {
      // Only update loading state if this is still the current request
      if (requestId === currentRequestId.current) {
        setLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [timePeriod, getCachedData, fetchFromAPI]);

  // Refresh function that bypasses cache
  const refreshData = useCallback(() => {
    return loadData(true);
  }, [loadData]);

  // Effect to load data when time period changes
  useEffect(() => {
    loadData();

    // Cleanup: abort any in-flight request when unmounting or period changes
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadData]);

  // Prefetch adjacent time periods in the background (skip heavy "all" period)
  useEffect(() => {
    const prefetchPeriods: TimePeriod[] = [];

    // Determine which periods to prefetch based on current
    if (timePeriod === 'daily') prefetchPeriods.push('month');
    else if (timePeriod === 'month') prefetchPeriods.push('daily', 'year');
    else if (timePeriod === 'year') {
      // Avoid prefetching 'all' (it's the heaviest view)
      prefetchPeriods.push('month');
    } else if (timePeriod === 'all') prefetchPeriods.push('year');

    if (prefetchPeriods.length === 0) return;

    // Prefetch after a short delay to not interfere with current load
    const timeoutId = setTimeout(() => {
      prefetchPeriods.forEach(async (period) => {
        if (!isCacheValid(period)) {
          try {
            console.log(`[useIndicesData] Prefetching ${period}`);
            const [indicesResponse, marketsResponse] = await Promise.all([
              supabase.functions.invoke('crypto-indices', { body: { timePeriod: period } }),
              supabase.functions.invoke('traditional-markets', { body: { timePeriod: period } })
            ]);

            if (!indicesResponse.error) {
              const data = indicesResponse.data;
              const markets = marketsResponse.data?.fallback || marketsResponse.data || [];

              dataCache.set(period, {
                data: {
                  anchor5: enhanceIndexData(data.anchor5, 'Quarterly'),
                  vibe20: enhanceIndexData(data.vibe20, 'Monthly'),
                  wave100: enhanceIndexData(data.wave100, 'Monthly')
                },
                timestamp: Date.now(),
                traditionalMarkets: markets
              });
              console.log(`[useIndicesData] Prefetched and cached ${period}`);
            }
          } catch (err) {
            // Silent fail for prefetch
            console.debug(`[useIndicesData] Prefetch failed for ${period}:`, err);
          }
        }
      });
    }, 2000); // Wait 2 seconds before prefetching

    return () => clearTimeout(timeoutId);
  }, [timePeriod, isCacheValid]);

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

// Export cache clearing function for manual invalidation
export function clearIndicesCache(): void {
  dataCache.clear();
  console.log('[useIndicesData] Cache cleared');
}
