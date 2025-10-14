import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navigation from '@/components/Navigation';
import { 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Download,
  RefreshCw,
  Calendar,
  Info,
  LineChart,
  TrendingDown,
  Shield,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalChart } from '@/components/chart/ProfessionalChart';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import { normalizeCandles, NormalizedCandle } from '@/utils/candleUtils';

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

interface IndexData {
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

type TimePeriod = 'daily' | 'month' | 'year' | 'all';
type ComparisonMode = 'none' | 'overlay' | 'relative';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatLargeNumber = (value: number, precision: number = 2): string => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';
  
  const abs = Math.abs(value);
  
  if (abs >= 1e12) {
    return `${(value / 1e12).toFixed(precision)}T`;
  } else if (abs >= 1e9) {
    return `${(value / 1e9).toFixed(precision)}B`;
  } else if (abs >= 1e6) {
    return `${(value / 1e6).toFixed(precision)}M`;
  } else if (abs >= 1e3) {
    return `${(value / 1e3).toFixed(precision)}K`;
  } else {
    return value.toFixed(precision);
  }
};

const formatPercentage = (value: number | undefined, showSign: boolean = true): string => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';
  const sign = showSign && value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

const getPercentageColor = (value: number | undefined): string => {
  if (!value || isNaN(value)) return 'text-muted-foreground';
  return value >= 0 ? 'text-green-600' : 'text-red-600';
};

const calculateDaysUntilRebalance = (nextRebalance: string): number => {
  try {
    const next = new Date(nextRebalance);
    const now = new Date();
    const diff = next.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
};

// ============================================================================
// REAL CALCULATION FUNCTIONS
// ============================================================================

const calculatePerformanceMetrics = (candles: Candle[], baseValue: number): PerformanceMetrics => {
  if (!candles || candles.length === 0) {
    return {
      ytd: 0,
      one_month: 0,
      three_month: 0,
      one_year: 0,
      since_inception: 0,
      high_52_week: baseValue,
      low_52_week: baseValue,
    };
  }

  const currentCandle = candles[candles.length - 1];
  const currentPrice = currentCandle.close;
  const now = new Date();
  const nowTime = Math.floor(now.getTime() / 1000);

  // Helper: Find candle closest to target timestamp
  const findCandleAtTime = (targetTime: number): Candle | null => {
    if (candles[0].time > targetTime) return null;
    
    let closest = candles[0];
    for (const candle of candles) {
      if (candle.time <= targetTime) {
        closest = candle;
      } else {
        break;
      }
    }
    return closest;
  };

  // Calculate returns
  const calculateReturn = (pastCandle: Candle | null): number => {
    if (!pastCandle) return 0;
    return ((currentPrice - pastCandle.close) / pastCandle.close) * 100;
  };

  // YTD: First candle of current year
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const ytdCandle = findCandleAtTime(Math.floor(yearStart.getTime() / 1000));
  const ytd = calculateReturn(ytdCandle);

  // 1 month ago
  const oneMonthAgo = nowTime - (30 * 24 * 60 * 60);
  const oneMonthCandle = findCandleAtTime(oneMonthAgo);
  const one_month = calculateReturn(oneMonthCandle);

  // 3 months ago
  const threeMonthAgo = nowTime - (90 * 24 * 60 * 60);
  const threeMonthCandle = findCandleAtTime(threeMonthAgo);
  const three_month = calculateReturn(threeMonthCandle);

  // 1 year ago
  const oneYearAgo = nowTime - (365 * 24 * 60 * 60);
  const oneYearCandle = findCandleAtTime(oneYearAgo);
  const one_year = calculateReturn(oneYearCandle);

  // Since inception
  const inceptionCandle = candles[0];
  const since_inception = ((currentPrice - inceptionCandle.open) / inceptionCandle.open) * 100;

  // 52-week high/low
  const fiftyTwoWeeksAgo = nowTime - (365 * 24 * 60 * 60);
  const recentCandles = candles.filter(c => c.time >= fiftyTwoWeeksAgo);
  
  let high_52_week = currentPrice;
  let low_52_week = currentPrice;
  
  if (recentCandles.length > 0) {
    high_52_week = Math.max(...recentCandles.map(c => c.high));
    low_52_week = Math.min(...recentCandles.map(c => c.low));
  }

  return {
    ytd,
    one_month,
    three_month,
    one_year,
    since_inception,
    high_52_week,
    low_52_week,
  };
};

const calculateRiskMetrics = (candles: Candle[]): RiskMetrics => {
  if (!candles || candles.length < 2) {
    return {
      volatility_30d: 0,
      volatility_90d: 0,
      sharpe_ratio: 0,
      max_drawdown: 0,
      beta_vs_btc: 0,
      correlation_with_btc: 0,
    };
  }

  // Calculate daily returns
  const dailyReturns: number[] = [];
  for (let i = 1; i < candles.length; i++) {
    const ret = (candles[i].close - candles[i - 1].close) / candles[i - 1].close;
    dailyReturns.push(ret);
  }

  // Helper: Calculate standard deviation
  const calculateStdDev = (values: number[]): number => {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  };

  // Helper: Get returns for last N days
  const getReturnsForDays = (days: number): number[] => {
    const targetCount = Math.min(days, dailyReturns.length);
    return dailyReturns.slice(-targetCount);
  };

  // 30-day volatility (annualized)
  const returns30d = getReturnsForDays(30);
  const volatility_30d = calculateStdDev(returns30d) * Math.sqrt(365) * 100;

  // 90-day volatility (annualized)
  const returns90d = getReturnsForDays(90);
  const volatility_90d = calculateStdDev(returns90d) * Math.sqrt(365) * 100;

  // Sharpe Ratio (assume 0% risk-free rate for crypto)
  const avgReturn = dailyReturns.reduce((sum, val) => sum + val, 0) / dailyReturns.length;
  const annualizedReturn = avgReturn * 365;
  const annualizedVol = calculateStdDev(dailyReturns) * Math.sqrt(365);
  const sharpe_ratio = annualizedVol !== 0 ? annualizedReturn / annualizedVol : 0;

  // Max Drawdown
  let maxDrawdown = 0;
  let maxDrawdownDate = '';
  let peak = candles[0].close;
  let peakDate = new Date(candles[0].time * 1000);

  for (let i = 1; i < candles.length; i++) {
    const current = candles[i].close;
    
    if (current > peak) {
      peak = current;
      peakDate = new Date(candles[i].time * 1000);
    } else {
      const drawdown = ((current - peak) / peak) * 100;
      if (drawdown < maxDrawdown) {
        maxDrawdown = drawdown;
        maxDrawdownDate = new Date(candles[i].time * 1000).toISOString().split('T')[0];
      }
    }
  }

  return {
    volatility_30d,
    volatility_90d,
    sharpe_ratio,
    max_drawdown: maxDrawdown,
    max_drawdown_date: maxDrawdownDate || undefined,
    beta_vs_btc: 0, // Requires BTC data
    correlation_with_btc: 0, // Requires BTC data
  };
};

const calculateRebalanceInfo = (frequency: string, constituents: TokenComposition[]): RebalanceInfo => {
  const now = new Date();
  
  let lastRebalance: Date;
  let nextRebalance: Date;

  if (frequency === 'Monthly') {
    // Last rebalance: First day of current month
    lastRebalance = new Date(now.getFullYear(), now.getMonth(), 1);
    // Next rebalance: First day of next month
    nextRebalance = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  } else if (frequency === 'Quarterly') {
    // Find current quarter (0=Q1, 1=Q2, 2=Q3, 3=Q4)
    const currentQuarter = Math.floor(now.getMonth() / 3);
    // Last rebalance: First day of current quarter
    lastRebalance = new Date(now.getFullYear(), currentQuarter * 3, 1);
    // Next rebalance: First day of next quarter
    nextRebalance = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 1);
  } else {
    // Default to monthly
    lastRebalance = new Date(now.getFullYear(), now.getMonth(), 1);
    nextRebalance = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }

  const daysUntil = Math.ceil((nextRebalance.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return {
    last_rebalance: lastRebalance.toISOString(),
    next_rebalance: nextRebalance.toISOString(),
    days_until_rebalance: daysUntil,
    frequency,
    constituents_added: [],
    constituents_removed: [],
  };
};

const calculateDivisor = (indexData: IndexData): number => {
  // Simplified divisor calculation - in production this would be more complex
  const totalMarketCap = indexData.meta.constituents?.reduce((sum, token) => sum + token.market_cap, 0) || 0;
  return totalMarketCap > 0 ? totalMarketCap / indexData.baseValue : 1.0;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Indices: React.FC = () => {
  // State Management
  const [chartVisibility, setChartVisibility] = useState({
    Anchor5: false,
    Vibe20: false,
    Wave100: false
  });
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('year');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [anchorData, setAnchorData] = useState<IndexData | null>(null);
  const [vibeData, setVibeData] = useState<IndexData | null>(null);
  const [waveData, setWaveData] = useState<IndexData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'methodology'>('overview');
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('none');
  const [selectedIndices, setSelectedIndices] = useState<string[]>([]);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  const fetchIndicesData = async (period: TimePeriod, isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('crypto-indices', {
        body: { timePeriod: period }
      });
      
      if (error) throw error;
      
      console.log('[fetchIndicesData] Received data for period:', period);
      
      // Enhance data with real calculated metrics
      const enhanceData = (indexData: IndexData | null, frequency: string): IndexData | null => {
        if (!indexData || !indexData.candles || indexData.candles.length === 0) return null;
        
        const performance = calculatePerformanceMetrics(indexData.candles, indexData.baseValue);
        const risk = calculateRiskMetrics(indexData.candles);
        const rebalanceInfo = calculateRebalanceInfo(frequency, indexData.meta.constituents || []);
        
        return {
          ...indexData,
          meta: {
            ...indexData.meta,
            performance,
            risk,
            metadata: {
              base_value: indexData.baseValue || 1000,
              base_date: indexData.candles[0] 
                ? new Date(indexData.candles[0].time * 1000).toISOString().split('T')[0] 
                : '2024-01-01',
              divisor: calculateDivisor(indexData),
              methodology_version: '1.0',
              total_constituents: indexData.meta.constituents?.length || 0,
              rebalance_info: rebalanceInfo,
            }
          }
        };
      };
      
      setError(null);
      setLastUpdated(new Date());
      
      return {
        anchor5: enhanceData(data.anchor5, 'Quarterly'),
        vibe20: enhanceData(data.vibe20, 'Monthly'),
        wave100: enhanceData(data.wave100, 'Monthly')
      };
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to load market data';
      console.error('Error fetching indices data:', err);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const loadData = useCallback(async (isRefresh = false) => {
    try {
      const data = await fetchIndicesData(timePeriod, isRefresh);
      
      // During refresh, only update if we have valid data
      // This prevents rate-limit errors from wiping existing charts
      if (isRefresh) {
        if (data.anchor5) setAnchorData(data.anchor5);
        if (data.vibe20) setVibeData(data.vibe20);
        if (data.wave100) setWaveData(data.wave100);
      } else {
        setAnchorData(data.anchor5);
        setVibeData(data.vibe20);
        setWaveData(data.wave100);
      }
    } catch (err) {
      console.error('Failed to load indices data:', err);
      if (!isRefresh) {
        setAnchorData(null);
        setVibeData(null);
        setWaveData(null);
      }
    }
  }, [timePeriod]);

  const refreshData = useCallback(() => loadData(true), [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-refresh every 60 seconds
  useAutoRefresh({
    onRefresh: refreshData,
    enabled: true,
    interval: 60000
  });

  // ============================================================================
  // CHART HELPERS
  // ============================================================================

  const formatXAxisLabel = (value: string | number) => {
    const date = typeof value === 'number' ? new Date(value * 1000) : new Date(value);
    
    switch (timePeriod) {
      case 'daily':
        return date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          hour12: true,
          timeZone: 'America/New_York'
        });
      case 'month':
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          timeZone: 'America/New_York'
        });
      case 'year':
        return date.toLocaleDateString('en-US', {
          month: 'short',
          timeZone: 'America/New_York'
        });
      case 'all':
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          timeZone: 'America/New_York'
        });
      default:
        return typeof value === 'number' ? date.toLocaleString() : value;
    }
  };

  const getNormalizedCandles = useCallback((candles: Candle[] | undefined): NormalizedCandle[] => {
    if (!candles || candles.length === 0) return [];
    return normalizeCandles(candles);
  }, []);

  const toggleChartVisibility = (indexName: string) => {
    setChartVisibility(prev => ({
      ...prev,
      [indexName]: !prev[indexName as keyof typeof prev]
    }));
  };

  // ============================================================================
  // EXPORT FUNCTIONALITY
  // ============================================================================

  const exportIndexData = (indexName: string, data: IndexData | null) => {
    if (!data) return;
    
    const csvContent = [
      ['Time', 'Open', 'High', 'Low', 'Close', 'Volume'],
      ...data.candles.map(c => [
        new Date(c.time * 1000).toISOString(),
        c.open,
        c.high,
        c.low,
        c.close,
        c.volumeUsd
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${indexName}_${timePeriod}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ============================================================================
  // INDEX DEFINITIONS
  // ============================================================================

  const indices = useMemo(() => [{
    name: 'Anchor5' as const,
    subtitle: 'Blue-Chip Index',
    icon: Shield,
    description: 'Price-weighted index of the top 5 cryptocurrencies by longevity, security, and institutional adoption.',
    fullDescription: 'The Anchor5 Index represents the most established digital assets with proven stability, widespread adoption, and institutional recognition. Similar to the Dow Jones Industrial Average, it uses price-weighting to emphasize quality over size.',
    methodology: {
      weighting: 'Price-Weighted',
      rebalancing: 'Quarterly',
      constituents: '5 Blue-Chip Assets',
      eligibility: 'Min 3 years old, $5B market cap, institutional adoption'
    },
    characteristics: [
      'High correlation with major coins',
      'Lower volatility',
      'Blue-chip focus',
      'Institutional grade'
    ],
    marketScore: anchorData?.currentValue || 0,
    chartColor: '#3b82f6',
    data: anchorData
  }, {
    name: 'Vibe20' as const,
    subtitle: 'Volume Index',
    icon: BarChart3,
    description: 'Hybrid volume-weighted index tracking the 20 most actively traded cryptocurrencies.',
    fullDescription: 'The Vibe20 Index captures market interest and liquidity by focusing on trading volume. It uses a hybrid weighting methodology combining volume and market cap to prevent manipulation while reflecting genuine trading activity.',
    methodology: {
      weighting: 'Volume × Market Cap Hybrid',
      rebalancing: 'Monthly',
      constituents: '20 High-Volume Assets',
      eligibility: '$1B market cap, $50M daily volume, multi-exchange listing'
    },
    characteristics: [
      'High liquidity focus',
      'Trading activity based',
      'Market sentiment indicator',
      'Manipulation resistant'
    ],
    marketScore: vibeData?.currentValue || 0,
    chartColor: '#10b981',
    data: vibeData
  }, {
    name: 'Wave100' as const,
    subtitle: 'Momentum Index',
    icon: Activity,
    description: 'Equal-weighted momentum index tracking the top 100 cryptocurrencies by risk-adjusted returns.',
    fullDescription: 'The Wave100 Index identifies tokens with the strongest momentum, serving as both a growth tracker in bull markets and a relative-strength indicator in bear markets. Equal-weighting ensures diversified momentum exposure.',
    methodology: {
      weighting: 'Equal-Weight (1% each)',
      rebalancing: 'Monthly',
      constituents: '100 Momentum Leaders',
      eligibility: '$50M market cap, $10M daily volume, 90-day history'
    },
    characteristics: [
      'Broad market exposure',
      'Momentum-driven',
      'Higher volatility potential',
      'Bear market resilience'
    ],
    marketScore: waveData?.currentValue || 0,
    chartColor: '#f59e0b',
    data: waveData
  }], [anchorData, vibeData, waveData]);

  // ============================================================================
  // RENDER: PERFORMANCE METRICS CARD
  // ============================================================================

  const PerformanceMetricsCard: React.FC<{ metrics: PerformanceMetrics | undefined }> = ({ metrics }) => {
    if (!metrics) return null;
    
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">1 Month</div>
              <div className={`text-lg font-semibold ${getPercentageColor(metrics.one_month)}`}>
                {formatPercentage(metrics.one_month)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">3 Months</div>
              <div className={`text-lg font-semibold ${getPercentageColor(metrics.three_month)}`}>
                {formatPercentage(metrics.three_month)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">YTD</div>
              <div className={`text-lg font-semibold ${getPercentageColor(metrics.ytd)}`}>
                {formatPercentage(metrics.ytd)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">1 Year</div>
              <div className={`text-lg font-semibold ${getPercentageColor(metrics.one_year)}`}>
                {formatPercentage(metrics.one_year)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Since Inception</div>
              <div className={`text-lg font-semibold ${getPercentageColor(metrics.since_inception)}`}>
                {formatPercentage(metrics.since_inception)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">52W Range</div>
              <div className="text-sm font-medium text-foreground">
                {formatLargeNumber(metrics.low_52_week)} - {formatLargeNumber(metrics.high_52_week)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // ============================================================================
  // RENDER: RISK METRICS CARD
  // ============================================================================

  const RiskMetricsCard: React.FC<{ risk: RiskMetrics | undefined }> = ({ risk }) => {
    if (!risk) return null;
    
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Risk Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Volatility (30d)</div>
              <div className="text-lg font-semibold">{risk.volatility_30d.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Volatility (90d)</div>
              <div className="text-lg font-semibold">{risk.volatility_90d.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Sharpe Ratio</div>
              <div className={`text-lg font-semibold ${risk.sharpe_ratio > 1 ? 'text-green-600' : 'text-muted-foreground'}`}>
                {risk.sharpe_ratio.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Max Drawdown</div>
              <div className="text-lg font-semibold text-red-600">
                {formatPercentage(risk.max_drawdown)}
              </div>
              {risk.max_drawdown_date && (
                <div className="text-xs text-muted-foreground">
                  {formatDate(risk.max_drawdown_date)}
                </div>
              )}
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Beta vs BTC</div>
              <div className="text-lg font-semibold">{risk.beta_vs_btc.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Correlation w/ BTC</div>
              <div className="text-lg font-semibold">{risk.correlation_with_btc.toFixed(2)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // ============================================================================
  // RENDER: REBALANCE INFO
  // ============================================================================

  const RebalanceInfoCard: React.FC<{ info: RebalanceInfo | undefined }> = ({ info }) => {
    if (!info) return null;
    
    const daysUntil = info.days_until_rebalance;
    const isImminent = daysUntil <= 7;
    
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Rebalancing Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Frequency</div>
                <div className="text-lg font-semibold">{info.frequency}</div>
              </div>
              <Badge variant={isImminent ? "destructive" : "secondary"}>
                {daysUntil} days until next rebalance
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Last Rebalance</div>
                <div className="text-sm font-medium">{formatDate(info.last_rebalance)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Next Rebalance</div>
                <div className="text-sm font-medium">{formatDate(info.next_rebalance)}</div>
              </div>
            </div>

            {(info.constituents_added?.length || info.constituents_removed?.length) && (
              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground mb-2">Last Changes</div>
                <div className="flex gap-2 flex-wrap">
                  {info.constituents_added?.map(token => (
                    <Badge key={token} variant="outline" className="text-green-600 border-green-600">
                      +{token}
                    </Badge>
                  ))}
                  {info.constituents_removed?.map(token => (
                    <Badge key={token} variant="outline" className="text-red-600 border-red-600">
                      -{token}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // ============================================================================
  // RENDER: INDEX METADATA
  // ============================================================================

  const IndexMetadataCard: React.FC<{ metadata: IndexMetadata | undefined }> = ({ metadata }) => {
    if (!metadata) return null;
    
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5" />
            Index Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Base Value</div>
              <div className="text-sm font-medium">{formatLargeNumber(metadata.base_value, 0)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Base Date</div>
              <div className="text-sm font-medium">{formatDate(metadata.base_date)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Current Divisor</div>
              <div className="text-sm font-medium">{metadata.divisor.toFixed(5)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Methodology</div>
              <div className="text-sm font-medium">Version {metadata.methodology_version}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Constituents</div>
              <div className="text-sm font-medium">{metadata.total_constituents} tokens</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Status</div>
              <Badge variant="outline" className="text-green-600 border-green-600">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // ============================================================================
  // RENDER: MAIN COMPONENT
  // ============================================================================

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold">Digital Asset Indices</h1>
                <p className="text-muted-foreground mt-2">
                  Professional-grade cryptocurrency market indices with transparent, rules-based methodologies
                </p>
              </div>
              <Button
                onClick={refreshData}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>

            {/* Last Updated */}
            <div className="text-xs text-muted-foreground">
              Last updated: {lastUpdated.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                timeZone: 'America/New_York',
                timeZoneName: 'short'
              })}
            </div>
            
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Data</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-6">
            <TabsList>
              <TabsTrigger value="overview">Index Overview</TabsTrigger>
              <TabsTrigger value="methodology">Methodology</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Time Period Selector */}
              <div className="flex gap-2">
                {(['daily', 'month', 'year', 'all'] as TimePeriod[]).map(period => (
                  <button 
                    key={period} 
                    onClick={() => setTimePeriod(period)} 
                    disabled={loading} 
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      timePeriod === period 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {period === 'daily' ? 'Daily' : 
                     period === 'month' ? 'Month' : 
                     period === 'year' ? 'Year' : 'All Time'}
                  </button>
                ))}
              </div>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Loading market data...</p>
                </div>
              )}

              {/* Index Cards */}
              <div className="grid gap-6">
                {indices.map(index => (
                  <Card key={index.name} className="border border-border">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <index.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-xl">{index.name}</CardTitle>
                              <Badge variant="outline">{index.subtitle}</Badge>
                            </div>
                            <CardDescription className="mt-1">{index.description}</CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="text-2xl font-bold" style={{ color: index.chartColor }}>
                              {formatLargeNumber(index.marketScore, 2)}
                            </div>
                            {index.data?.change_24h_percentage != null && (
                              <div className={`text-lg font-semibold ${getPercentageColor(index.data.change_24h_percentage)}`}>
                                {formatPercentage(index.data.change_24h_percentage)}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Current value (24h change)
                          </div>
                          {index.data?.change_7d_percentage != null && (
                            <div className={`text-xs mt-1 ${getPercentageColor(index.data.change_7d_percentage)}`}>
                              7d: {formatPercentage(index.data.change_7d_percentage)}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Methodology Quick Facts */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-muted/50 rounded-lg">
                        <div>
                          <div className="text-xs text-muted-foreground">Weighting</div>
                          <div className="text-sm font-medium">{index.methodology.weighting}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Rebalancing</div>
                          <div className="text-sm font-medium">{index.methodology.rebalancing}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Constituents</div>
                          <div className="text-sm font-medium">{index.methodology.constituents}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Base Value</div>
                          <div className="text-sm font-medium">1,000</div>
                        </div>
                      </div>

                      {/* Characteristics */}
                      <div className="flex flex-wrap gap-2">
                        {index.characteristics.map((char, idx) => (
                          <span key={idx} className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                            {char}
                          </span>
                        ))}
                      </div>

                      {/* Performance & Risk Metrics */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <PerformanceMetricsCard metrics={index.data?.meta?.performance} />
                        <RiskMetricsCard risk={index.data?.meta?.risk} />
                      </div>

                      {/* Rebalance Info & Metadata */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <RebalanceInfoCard info={index.data?.meta?.metadata?.rebalance_info} />
                        <IndexMetadataCard metadata={index.data?.meta?.metadata} />
                      </div>

                      {/* Token Composition Table */}
                      {index.data?.meta?.constituents && index.data.meta.constituents.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Index Composition ({index.data.meta.constituents.length} tokens)
                          </h4>
                          <div className="max-h-96 overflow-y-auto border rounded-lg">
                            <table className="w-full text-xs">
                              <thead className="bg-muted sticky top-0">
                                <tr>
                                  <th className="text-left p-2 font-semibold">Token</th>
                                  <th className="text-right p-2 font-semibold">Weight</th>
                                  <th className="text-right p-2 font-semibold">Price</th>
                                  <th className="text-right p-2 font-semibold">Market Cap</th>
                                  <th className="text-right p-2 font-semibold">Volume</th>
                                  <th className="text-right p-2 font-semibold">24h</th>
                                  <th className="text-right p-2 font-semibold">7d</th>
                                </tr>
                              </thead>
                              <tbody>
                                {index.data.meta.constituents.map((token, idx) => (
                                  <tr key={idx} className="border-t hover:bg-muted/30 transition-colors">
                                    <td className="p-2">
                                      <div className="font-medium">{token.symbol}</div>
                                    </td>
                                    <td className="text-right p-2 font-medium">
                                      {(token.weight || 0).toFixed(2)}%
                                    </td>
                                    <td className="text-right p-2">
                                      ${formatLargeNumber(token.price)}
                                    </td>
                                    <td className="text-right p-2">
                                      ${formatLargeNumber(token.market_cap)}
                                    </td>
                                    <td className="text-right p-2">
                                      ${formatLargeNumber(token.total_volume)}
                                    </td>
                                    <td className={`text-right p-2 font-medium ${getPercentageColor(token.price_change_percentage_24h)}`}>
                                      {formatPercentage(token.price_change_percentage_24h)}
                                    </td>
                                    <td className={`text-right p-2 ${getPercentageColor(token.price_change_percentage_7d)}`}>
                                      {formatPercentage(token.price_change_percentage_7d || 0, false)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Chart Actions */}
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => toggleChartVisibility(index.name)} 
                          variant="outline" 
                          className="flex-1"
                        >
                          <LineChart className="h-4 w-4 mr-2" />
                          {chartVisibility[index.name as keyof typeof chartVisibility] ? 'Hide Chart' : 'View Chart'}
                        </Button>
                        <Button 
                          onClick={() => exportIndexData(index.name, index.data)}
                          variant="outline"
                          disabled={!index.data}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export CSV
                        </Button>
                      </div>

                      {/* Chart */}
                      <div 
                        className="border-t pt-4 transition-all duration-300"
                        style={{
                          opacity: chartVisibility[index.name as keyof typeof chartVisibility] ? 1 : 0,
                          maxHeight: chartVisibility[index.name as keyof typeof chartVisibility] ? '600px' : 0,
                          overflow: 'hidden',
                        }}
                      >
                        {chartVisibility[index.name as keyof typeof chartVisibility] && (
                          <ProfessionalChart
                            key={`${index.name}-${timePeriod}`}
                            data={getNormalizedCandles(index.data?.candles)}
                            color={index.chartColor}
                            indexName={index.name}
                            timePeriod={timePeriod}
                            isVisible={chartVisibility[index.name as keyof typeof chartVisibility]}
                            isRefreshing={isRefreshing}
                            lastUpdated={lastUpdated}
                            formatXAxisLabel={formatXAxisLabel}
                            formatLargeNumber={formatLargeNumber}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="methodology" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Index Methodology Documentation</CardTitle>
                  <CardDescription>
                    Comprehensive methodology for Sequence Theory's Digital Asset Indices
                  </CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Methodology Version 1.0</AlertTitle>
                    <AlertDescription>
                      Effective Date: January 1, 2024. All indices follow transparent, rules-based methodologies with regular rebalancing schedules.
                    </AlertDescription>
                  </Alert>

                  <div className="mt-6 space-y-6">
                    {indices.map(index => (
                      <div key={index.name} className="border-l-4 pl-4" style={{ borderColor: index.chartColor }}>
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                          <index.icon className="h-5 w-5" />
                          {index.name} - {index.subtitle}
                        </h3>
                        <p className="text-muted-foreground mb-4">{index.fullDescription}</p>
                        
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <h4 className="font-semibold mb-2">Methodology</h4>
                            <dl className="space-y-2 text-sm">
                              <div>
                                <dt className="text-muted-foreground">Weighting Method:</dt>
                                <dd className="font-medium">{index.methodology.weighting}</dd>
                              </div>
                              <div>
                                <dt className="text-muted-foreground">Rebalancing:</dt>
                                <dd className="font-medium">{index.methodology.rebalancing}</dd>
                              </div>
                              <div>
                                <dt className="text-muted-foreground">Constituents:</dt>
                                <dd className="font-medium">{index.methodology.constituents}</dd>
                              </div>
                            </dl>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Eligibility Criteria</h4>
                            <p className="text-sm text-muted-foreground">{index.methodology.eligibility}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Additional Resources</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Full methodology document available for download</li>
                      <li>• Historical constituent changes tracked quarterly</li>
                      <li>• Data sources: Tier-1 exchanges (Binance, Coinbase, Kraken, OKX, Bybit)</li>
                      <li>• All indices exclude stablecoins and wrapped tokens</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Indices;
