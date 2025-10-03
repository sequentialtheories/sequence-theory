import React, { useState, useEffect, useCallback } from 'react';
import Navigation from '@/components/Navigation';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  date: string;
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
    return value.toLocaleString();
  }
};

const Indices: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('year');
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [anchorData, setAnchorData] = useState<IndexData | null>(null);
  const [vibeData, setVibeData] = useState<IndexData | null>(null);
  const [waveData, setWaveData] = useState<IndexData | null>(null);

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
      
      setLastUpdated(new Date());
      return {
        anchor5: data.anchor5,
        vibe20: data.vibe20,
        wave100: data.wave100
      };
    } catch (error) {
      console.error('Error fetching indices data:', error);
      throw error;
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const formatXAxisLabel = (value: string | number) => {
    // Convert Unix timestamp to Date if it's a number
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

  const loadData = useCallback(async (isRefresh = false) => {
    try {
      const data = await fetchIndicesData(timePeriod, isRefresh);
      setAnchorData(data.anchor5);
      setVibeData(data.vibe20);
      setWaveData(data.wave100);
    } catch (error) {
      console.error('Failed to load indices data:', error);
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

  const indices = [{
    name: 'Anchor5',
    subtitle: 'Price-Weighted Top 5',
    icon: TrendingUp,
    description: 'A price-weighted index of the top 5 cryptocurrencies by longevity indicators such as market capitalization, holding wallets, security, etc.',
    characteristics: ['High correlation with major coins', 'Lower volatility', 'Blue-chip focus'],
    marketScore: anchorData?.currentValue || 0,
    chartColor: '#3b82f6',
    data: anchorData
  }, {
    name: 'Vibe20',
    subtitle: 'Volume-Weighted Top 20',
    icon: BarChart3,
    description: 'A volume-weighted index focusing on the 20 most actively traded cryptocurrencies.',
    characteristics: ['High liquidity focus', 'Trading activity based', 'Market sentiment indicator'],
    marketScore: vibeData?.currentValue || 0,
    chartColor: '#10b981',
    data: vibeData
  }, {
    name: 'Wave100',
    subtitle: 'Momentum Top 100',
    icon: Activity,
    description: 'A momentum-based index tracking the performance of the top 100 cryptocurrencies.',
    characteristics: ['Broad market exposure', 'Momentum-driven', 'Higher volatility potential'],
    marketScore: waveData?.currentValue || 0,
    chartColor: '#f59e0b',
    data: waveData
  }];

  // Convert candles to chart data format
  const convertCandlesToChartData = (candles: Candle[]): CandlestickDataPoint[] => {
    return candles.map(candle => ({
      date: new Date(candle.time * 1000).toISOString(),
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volumeUsd
    }));
  };

  const toggleIndex = (name: string) => {
    setExpandedIndex(expandedIndex === name ? null : name);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Market Indices</h1>
            <p className="text-muted-foreground mt-2">
              Track the performance of curated cryptocurrency investment indices
            </p>
            
            {/* Time Period Selector */}
            <div className="flex gap-2 mt-6">
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
          </div>

          <div className="grid gap-6">
            {indices.map(index => (
              <Card key={index.name} className="border border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <index.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{index.name}</CardTitle>
                        <CardDescription>{index.subtitle}</CardDescription>
                      </div>
                    </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="text-2xl font-bold text-primary">
                            {formatLargeNumber(index.marketScore)}
                          </div>
                          {index.data?.change_24h_percentage != null && (
                            <div className={`text-lg font-semibold ${
                              index.data.change_24h_percentage >= 0 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {index.data.change_24h_percentage >= 0 ? '+' : ''}
                              {index.data.change_24h_percentage.toFixed(2)}%
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Current index value (24h change)
                        </div>
                      </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{index.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {index.characteristics.map((char, charIndex) => (
                      <span key={charIndex} className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full">
                        {char}
                      </span>
                    ))}
                  </div>

                  {/* Token Composition Table */}
                  {index.data?.meta?.constituents && index.data.meta.constituents.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">Index Composition</h4>
                      <div className="max-h-96 overflow-y-auto border rounded-lg">
                        <table className="w-full text-xs">
                          <thead className="bg-muted sticky top-0">
                            <tr>
                              <th className="text-left p-2">Token</th>
                              <th className="text-right p-2">Weight</th>
                              <th className="text-right p-2">Price</th>
                              <th className="text-right p-2">Market Cap</th>
                              <th className="text-right p-2">Volume</th>
                              <th className="text-right p-2">24h %</th>
                            </tr>
                          </thead>
                          <tbody>
                             {index.data.meta.constituents.map((token, tokenIndex) => (
                               <tr key={tokenIndex} className="border-t">
                                 <td className="p-2">
                                   <div className="font-medium">{token.symbol}</div>
                                 </td>
                                 <td className="text-right p-2">{(token.weight || 0).toFixed(1)}%</td>
                                 <td className="text-right p-2">${formatLargeNumber(token.price)}</td>
                                 <td className="text-right p-2">${formatLargeNumber(token.market_cap)}</td>
                                 <td className="text-right p-2">${formatLargeNumber(token.total_volume)}</td>
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

                  <Button onClick={() => toggleIndex(index.name)} variant="outline" className="w-full mb-4">
                    {expandedIndex === index.name ? 'Hide Chart' : 'View Chart'}
                  </Button>

                  {expandedIndex === index.name && index.data?.candles && index.data.candles.length > 0 && (
                    <div className="border-t pt-4">
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