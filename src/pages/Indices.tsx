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
interface IndexData {
  name: string;
  data: DataPoint[];
  currentValue: number;
}
type TimePeriod = 'daily' | 'year' | 'all';
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
      const {
        data,
        error
      } = await supabase.functions.invoke('crypto-indices', {
        body: {
          timePeriod: period
        }
      });
      if (error) throw error;
      return {
        anchor5: data.anchor5,
        vibe20: data.vibe20,
        wave100: data.wave100
      };
    } catch (error) {
      console.error('Error fetching indices data:', error);
      // Fallback to mock data
      return {
        anchor5: {
          name: 'Anchor5',
          data: generateMockData(period),
          currentValue: 1247
        },
        vibe20: {
          name: 'Vibe20',
          data: generateMockData(period),
          currentValue: 892
        },
        wave100: {
          name: 'Wave100',
          data: generateMockData(period),
          currentValue: 1834
        }
      };
    } finally {
      setLoading(false);
    }
  };
  const generateMockData = (period: TimePeriod): DataPoint[] => {
    const now = new Date();
    const points = [];
    switch (period) {
      case 'daily':
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          points.push({
            date: date.toISOString().split('T')[0],
            value: Math.round(1000 + Math.sin(i * 0.2) * 200 + Math.random() * 100)
          });
        }
        break;
      case 'year':
        const currentMonth = now.getMonth();
        for (let i = 0; i <= currentMonth; i++) {
          const date = new Date(now.getFullYear(), i, 1);
          points.push({
            date: date.toISOString().split('T')[0],
            value: Math.round(1000 + i * 50 + Math.sin(i * 0.5) * 100)
          });
        }
        break;
      case 'all':
        for (let i = 8; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i * 3);
          points.push({
            date: date.toISOString().split('T')[0],
            value: Math.round(800 + (8 - i) * 100 + Math.sin((8 - i) * 0.3) * 150)
          });
        }
        break;
    }
    return points;
  };
  const formatXAxisLabel = (value: string) => {
    const date = new Date(value);
    switch (timePeriod) {
      case 'daily':
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
      case 'year':
        return date.toLocaleDateString('en-US', {
          month: 'short'
        });
      case 'all':
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short'
        });
      default:
        return value;
    }
  };
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchIndicesData(timePeriod);
      setAnchorData(data.anchor5);
      setVibeData(data.vibe20);
      setWaveData(data.wave100);
    };
    loadData();
  }, [timePeriod]);
  const indices = [{
    name: 'Anchor5',
    subtitle: 'Price-Weighted Top 5',
    icon: TrendingUp,
    description: 'A price-weighted index of the top 5 cryptocurrencies by market cap (excluding stablecoins).',
    characteristics: ['High correlation with major coins', 'Lower volatility', 'Blue-chip focus'],
    marketScore: anchorData?.currentValue || 0,
    chartColor: '#3b82f6',
    data: anchorData?.data || []
  }, {
    name: 'Vibe20',
    subtitle: 'Volume-Weighted Top 20',
    icon: BarChart3,
    description: 'A volume-weighted index focusing on the 20 most actively traded cryptocurrencies.',
    characteristics: ['High liquidity focus', 'Trading activity based', 'Market sentiment indicator'],
    marketScore: vibeData?.currentValue || 0,
    chartColor: '#10b981',
    data: vibeData?.data || []
  }, {
    name: 'Wave100',
    subtitle: 'Momentum Top 100',
    icon: Activity,
    description: 'A momentum-based index tracking the performance of the top 100 cryptocurrencies.',
    characteristics: ['Broad market exposure', 'Momentum-driven', 'Higher volatility potential'],
    marketScore: waveData?.currentValue || 0,
    chartColor: '#f59e0b',
    data: waveData?.data || []
  }];
  const toggleIndex = (name: string) => {
    setExpandedIndex(expandedIndex === name ? null : name);
  };
  return <div className="min-h-screen bg-background">
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
              {(['daily', 'year', 'all'] as TimePeriod[]).map(period => <button key={period} onClick={() => setTimePeriod(period)} disabled={loading} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timePeriod === period ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {period === 'daily' ? 'Daily' : period === 'year' ? 'Year' : 'All Time'}
                </button>)}
            </div>
          </div>

          <div className="grid gap-6">
            {indices.map(index => <Card key={index.name} className="border border-border">
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
                      <div className="text-2xl font-bold text-primary">
                        {index.marketScore.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Current market index value
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{index.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {index.characteristics.map((char, charIndex) => {})}
                  </div>

                  <Button onClick={() => toggleIndex(index.name)} variant="outline" className="w-full mb-4">
                    {expandedIndex === index.name ? 'Hide Chart' : 'View Chart'}
                  </Button>

                  {expandedIndex === index.name && <div className="border-t pt-4">
                      <h4 className="text-lg font-semibold mb-4">
                        {index.name} Performance ({timePeriod === 'daily' ? 'Last 30 Days' : timePeriod === 'year' ? 'Year to Date' : 'All Time'})
                      </h4>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={index.data}>
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{
                        fontSize: 12,
                        fill: '#6b7280'
                      }} tickFormatter={formatXAxisLabel} />
                            <YAxis axisLine={false} tickLine={false} tick={{
                        fontSize: 12,
                        fill: '#6b7280'
                      }} />
                            <Tooltip labelFormatter={value => formatXAxisLabel(value)} formatter={(value: number) => [value.toLocaleString(), 'Index Value']} />
                            <Line type="monotone" dataKey="value" stroke={index.chartColor} strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>}
                </CardContent>
              </Card>)}
          </div>
        </div>
      </main>
    </div>;
};
export default Indices;