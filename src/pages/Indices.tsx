import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { ArrowLeft, TrendingUp, BarChart3, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

interface DataPoint {
  date: string;
  value: number;
}

interface TokenComposition {
  id: string;
  symbol: string;
  name: string;
  weight: number;
  price: number;
  change_24h: number;
  market_cap: number;
  volume: number;
}

interface IndexData {
  name: string;
  data: DataPoint[];
  currentValue: number;
  change_24h_percentage: number;
  composition?: TokenComposition[];
}

type TimePeriod = 'daily' | 'month' | 'year' | 'all';

const Indices: React.FC = () => {
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('year');
  const [loading, setLoading] = useState(false);
  const [anchorData, setAnchorData] = useState<IndexData | null>(null);
  const [vibeData, setVibeData] = useState<IndexData | null>(null);
  const [waveData, setWaveData] = useState<IndexData | null>(null);

  const fetchIndicesData = async (period: TimePeriod) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('crypto-indices', {
        body: { timePeriod: period }
      });
      if (error) throw error;
      return {
        anchor5: data.anchor5,
        vibe20: data.vibe20,
        wave100: data.wave100
      };
    } catch (error) {
      console.error('Error fetching indices data:', error);
      throw error; // Remove fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const formatXAxisLabel = (value: string) => {
    const date = new Date(value);
    // Display in EST timezone
    const estOffset = -5 * 60; // EST is UTC-5
    const estDate = new Date(date.getTime() + (estOffset * 60 * 1000));
    
    switch (timePeriod) {
      case 'daily':
        return estDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          hour12: true,
          timeZone: 'America/New_York'
        });
      case 'month':
        return estDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          timeZone: 'America/New_York'
        });
      case 'year':
        return estDate.toLocaleDateString('en-US', {
          month: 'short',
          timeZone: 'America/New_York'
        });
      case 'all':
        return estDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          timeZone: 'America/New_York'
        });
      default:
        return value;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchIndicesData(timePeriod);
        setAnchorData(data.anchor5);
        setVibeData(data.vibe20);
        setWaveData(data.wave100);
      } catch (error) {
        console.error('Failed to load indices data:', error);
        // Show error state instead of mock data
        setAnchorData(null);
        setVibeData(null);
        setWaveData(null);
      }
    };
    loadData();
  }, [timePeriod]);

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
                          {index.marketScore.toLocaleString()}
                        </div>
                        {index.data?.change_24h_percentage !== undefined && (
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
                  {index.data?.composition && index.data.composition.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">Index Composition</h4>
                      <div className="max-h-96 overflow-y-auto border rounded-lg">
                        <table className="w-full text-xs">
                          <thead className="bg-muted sticky top-0">
                            <tr>
                              <th className="text-left p-2">Token</th>
                              <th className="text-right p-2">Market Cap</th>
                              <th className="text-right p-2">Volume</th>
                              <th className="text-right p-2">Weight</th>
                              <th className="text-right p-2">Price</th>
                              <th className="text-right p-2">24h</th>
                            </tr>
                          </thead>
                          <tbody>
                            {index.data.composition.map((token, tokenIndex) => (
                              <tr key={tokenIndex} className="border-t">
                                <td className="p-2">
                                  <div>
                                    <div className="font-medium">{token.symbol}</div>
                                    <div className="text-muted-foreground text-xs truncate">{token.name}</div>
                                  </div>
                                </td>
                                <td className="text-right p-2">${(token.market_cap / 1000000000).toFixed(2)}B</td>
                                <td className="text-right p-2">${(token.volume / 1000000).toFixed(2)}M</td>
                                <td className="text-right p-2">{token.weight.toFixed(1)}%</td>
                                <td className="text-right p-2">${token.price.toLocaleString()}</td>
                                <td className={`text-right p-2 ${token.change_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {token.change_24h.toFixed(1)}%
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

                  {expandedIndex === index.name && (
                    <div className="border-t pt-4">
                      <h4 className="text-lg font-semibold mb-4">
                        {index.name} Performance ({
                          timePeriod === 'daily' ? 'Last 24 Hours' : 
                          timePeriod === 'month' ? 'Last 30 Days' : 
                          timePeriod === 'year' ? 'Year to Date' : 'All Time'
                        })
                      </h4>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={index.data?.data || []}>
                            <XAxis 
                              dataKey="date" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 12, fill: '#6b7280' }} 
                              tickFormatter={formatXAxisLabel} 
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 12, fill: '#6b7280' }} 
                            />
                            <Tooltip 
                              labelFormatter={value => formatXAxisLabel(value)} 
                              formatter={(value: number) => [value.toLocaleString(), 'Index Value']} 
                            />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke={index.chartColor} 
                              strokeWidth={2} 
                              dot={false} 
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
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