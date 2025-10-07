import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navigation from '@/components/Navigation';
import { TrendingUp, BarChart3, Activity, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalChart } from '@/components/chart/ProfessionalChart';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volumeUsd: number;
}

interface CandlestickDataPoint {
  time: number; // ✅ Fixed: Unix timestamp instead of ISO string
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TokenComposition {
  id: string;
  symbol: string;
  weight: number;
  price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
}

interface IndexData {
  index: string;
  baseValue: number;
  timeframe: string;
  candles: Candle[];
  currentValue: number;
  change_24h_percentage: number;
  meta: {
    tz: string;
    constituents: TokenComposition[];
    rebalanceFrequency: string;
  };
}

type TimePeriod = 'daily' | 'month' | 'year' | 'all';

const formatLargeNumber = (value: number): string => {
  const abs = Math.abs(value);
  
  if (abs >= 1e12) {
    const formatted = (value / 1e12).toFixed(2);
    return `${parseFloat(formatted)}T`;
  } else if (abs >= 1e9) {
    const formatted = (value / 1e9).toFixed(2);
    return `${parseFloat(formatted)}B`;
  } else if (abs >= 1e6) {
    const formatted = (value / 1e6).toFixed(2);
    return `${parseFloat(formatted)}M`;
  } else {
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
};

// Skeleton loader component
const IndexCardSkeleton: React.FC = () => (
  <Card className="border border-border">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-muted rounded-lg animate-pulse" />
          <div>
            <div className="h-6 w-24 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="text-right">
          <div className="h-8 w-32 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-40 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="h-4 w-full bg-muted rounded animate-pulse mb-4" />
      <div className="flex gap-2 mb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-6 w-24 bg-muted rounded-full animate-pulse" />
        ))}
      </div>
    </CardContent>
  </Card>
);

const Indices: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('year');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [anchorData, setAnchorData] = useState<IndexData | null>(null);
  const [vibeData, setVibeData] = useState<IndexData | null>(null);
  const [waveData, setWaveData] = useState<IndexData | null>(null);

  // Ref for abort controller
  const abortControllerRef = useRef<AbortController | null>(null);

  // Get user's timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  const fetchIndicesData = useCallback(async (period: TimePeriod, isRefresh = false) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

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
      
      setError(null);
      setLastUpdated(new Date());
      
      return {
        anchor5: data.anchor5,
        vibe20: data.vibe20,
        wave100: data.wave100
      };
    } catch (err: any) {
      // Don't set error if request was aborted
      if (err?.name === 'AbortError') {
        return null;
      }
      
      const errorMsg = err?.message || 'Failed to load market data';
      console.error('Error fetching indices data:', err);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const formatXAxisLabel = useCallback((value: string | number) => {
    const date = typeof value === 'number' ? new Date(value * 1000) : new Date(value);
    
    switch (timePeriod) {
      case 'daily':
        return date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          hour12: true,
          timeZone: userTimezone
        });
      case 'month':
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          timeZone: userTimezone
        });
      case 'year':
        return date.toLocaleDateString('en-US', {
          month: 'short',
          timeZone: userTimezone
        });
      case 'all':
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          timeZone: userTimezone
        });
      default:
        return typeof value === 'number' ? date.toLocaleString() : value;
    }
  }, [timePeriod, userTimezone]);

  const loadData = useCallback(async (isRefresh = false) => {
    try {
      const data = await fetchIndicesData(timePeriod, isRefresh);
      
      if (data) {
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
  }, [timePeriod, fetchIndicesData]);

  const refreshData = useCallback(() => loadData(true), [loadData]);

  const handleRetry = useCallback(() => {
    setError(null);
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadData();

    // Cleanup: abort any ongoing requests on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadData]);

  // Auto-refresh every 60 seconds
  useAutoRefresh({
    onRefresh: refreshData,
    enabled: !loading && !error,
    interval: 60000
  });

  const toggleIndex = (name: string) => {
    setExpandedIndex(expandedIndex === name ? null : name);
  };

  const indices = React.useMemo(() => [
    {
      name: 'Anchor5',
      subtitle: 'Price-Weighted Top 5',
      icon: TrendingUp,
      description: 'A price-weighted index of the top 5 cryptocurrencies by longevity indicators such as market capitalization, holding wallets, security, etc.',
      characteristics: ['High correlation with major coins', 'Lower volatility', 'Blue-chip focus'],
      marketScore: anchorData?.currentValue || 0,
      chartColor: '#3b82f6',
      data: anchorData
    },
    {
      name: 'Vibe20',
      subtitle: 'Volume-Weighted Top 20',
      icon: BarChart3,
      description: 'A volume-weighted index focusing on the 20 most actively traded cryptocurrencies.',
      characteristics: ['High liquidity focus', 'Trading activity based', 'Market sentiment indicator'],
      marketScore: vibeData?.currentValue || 0,
      chartColor: '#10b981',
      data: vibeData
    },
    {
      name: 'Wave100',
      subtitle: 'Momentum Top 100',
      icon: Activity,
      description: 'A momentum-based index tracking the performance of the top 100 cryptocurrencies.',
      characteristics: ['Broad market exposure', 'Momentum-driven', 'Higher volatility potential'],
      marketScore: waveData?.currentValue || 0,
      chartColor: '#f59e0b',
      data: waveData
    }
  ], [anchorData, vibeData, waveData]);

  // ✅ FIXED: Convert candles to chart data format with time as number
  const convertCandlesToChartData = useCallback((candles: Candle[]): CandlestickDataPoint[] => {
    return candles.map(candle => ({
      time: candle.time, // Keep as Unix timestamp (seconds)
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volumeUsd
    }));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Market Indices</h1>
            <p className="text-muted-foreground mt-2">
              Track the performance of curated cryptocurrency investment indices
            </p>
            
            {/* Error Alert with Retry */}
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Data</AlertTitle>
                <AlertDescription className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <span>{error}</span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleRetry}
                    className="whitespace-nowrap"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            {/* Time Period Selector */}
            <div className="flex flex-wrap gap-2 mt-6" role="tablist" aria-label="Time period selection">
              {(['daily', 'month', 'year', 'all'] as TimePeriod[]).map(period => (
                <button 
                  key={period}
                  role="tab"
                  aria-selected={timePeriod === period}
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

            {/* Last Updated Indicator */}
            {!loading && !error && (
              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                {isRefreshing && (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                )}
              </div>
            )}
          </header>

          {/* Loading Skeleton */}
          {loading && !anchorData && !vibeData && !waveData && (
            <div className="grid gap-6" role="status" aria-label="Loading market data">
              {[1, 2, 3].map(i => <IndexCardSkeleton key={i} />)}
            </div>
          )}

          {/* Index Cards */}
          <div className="grid gap-6" role="region" aria-label="Market indices">
            {!loading && indices.map(index => (
              <Card 
                key={index.name} 
                className="border border-border"
                role="article"
                aria-labelledby={`${index.name}-title`}
              >
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10" aria-hidden="true">
                        <index.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle id={`${index.name}-title`} className="text-xl">
                          {index.name}
                        </CardTitle>
                        <CardDescription>{index.subtitle}</CardDescription>
                      </div>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto">
                      <div className="flex items-center justify-start sm:justify-end gap-2 flex-wrap">
                        <div className="text-2xl font-bold text-primary">
                          {formatLargeNumber(index.marketScore)}
                        </div>
                        {index.data?.change_24h_percentage != null && (
                          <div 
                            className={`text-lg font-semibold ${
                              index.data.change_24h_percentage >= 0 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}
                            aria-label={`24 hour change: ${index.data.change_24h_percentage >= 0 ? 'up' : 'down'} ${Math.abs(index.data.change_24h_percentage).toFixed(2)} percent`}
                          >
                            {index.data.change_24h_percentage >= 0 ? '+' : ''}
                            {index.data.change_24h_percentage.toFixed(2)}%
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Current index value (24h change)
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{index.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4" role="list" aria-label="Index characteristics">
                    {index.characteristics.map((char, charIndex) => (
                      <span 
                        key={charIndex} 
                        className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
                        role="listitem"
                      >
                        {char}
                      </span>
                    ))}
                  </div>

                  {/* Token Composition Table */}
                  {index.data?.meta?.constituents && index.data.meta.constituents.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">Index Composition</h4>
                      <div className="max-h-96 overflow-y-auto border rounded-lg">
                        <table className="w-full text-xs" role="table" aria-label={`${index.name} composition`}>
                          <thead className="bg-muted sticky top-0 z-10">
                            <tr>
                              <th scope="col" className="text-left p-2">Token</th>
                              <th scope="col" className="text-right p-2">Weight</th>
                              <th scope="col" className="text-right p-2 hidden sm:table-cell">Price</th>
                              <th scope="col" className="text-right p-2 hidden md:table-cell">Market Cap</th>
                              <th scope="col" className="text-right p-2 hidden lg:table-cell">Volume</th>
                              <th scope="col" className="text-right p-2">24h %</th>
                            </tr>
                          </thead>
                          <tbody>
                            {index.data.meta.constituents.map((token, tokenIndex) => (
                              <tr key={`${token.id}-${tokenIndex}`} className="border-t hover:bg-muted/50 transition-colors">
                                <td className="p-2">
                                  <div className="font-medium">{token.symbol}</div>
                                </td>
                                <td className="text-right p-2">{(token.weight || 0).toFixed(1)}%</td>
                                <td className="text-right p-2 hidden sm:table-cell">${formatLargeNumber(token.price)}</td>
                                <td className="text-right p-2 hidden md:table-cell">${formatLargeNumber(token.market_cap)}</td>
                                <td className="text-right p-2 hidden lg:table-cell">${formatLargeNumber(token.total_volume)}</td>
                                <td className={`text-right p-2 ${
                                  token.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {token.price_change_percentage_24h >= 0 ? '+' : ''}
                                  {token.price_change_percentage_24h.toFixed(2)}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={() => toggleIndex(index.name)} 
                    variant="outline" 
                    className="w-full mb-4"
                    aria-expanded={expandedIndex === index.name}
                    aria-controls={`${index.name}-chart`}
                  >
                    {expandedIndex === index.name ? 'Hide Chart' : 'View Chart'}
                  </Button>

                  {/* Conditionally render chart */}
                  {expandedIndex === index.name && (
                    <div 
                      id={`${index.name}-chart`}
                      className="border-t pt-4 animate-in fade-in-50 duration-300"
                      role="region"
                      aria-label={`${index.name} price chart`}
                    >
                      {index.data?.candles && index.data.candles.length > 0 ? (
                        <ProfessionalChart
                          data={convertCandlesToChartData(index.data.candles)}
                          color={index.chartColor}
                          indexName={index.name}
                          timePeriod={timePeriod}
                          isRefreshing={isRefreshing}
                          lastUpdated={lastUpdated}
                          formatXAxisLabel={formatXAxisLabel}
                          formatLargeNumber={formatLargeNumber}
                        />
                      ) : (
                        <div className="py-8 text-center text-muted-foreground" role="status">
                          {loading ? 'Loading chart data...' : 'No chart data available for this time period'}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Indices; 
