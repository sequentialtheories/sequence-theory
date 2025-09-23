import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ArrowLeft,
  TrendingUp,
  Target,
  Waves,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface MarketCoin {
  id: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_30d_in_currency?: number;
  price_change_percentage_30d?: number;
}

interface DataPoint {
  month: string;
  value: number;
}

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const stableIds = new Set([
  'tether','usdt','usd-coin','usdc','binance-usd','busd','dai','true-usd','usdd','frax','pax-dollar','paxos-standard','gemini-dollar','gusd','tusd','lusd','liquity-usd','usdp'
]);

const getChangeAsRatio = (pct: number) => {
  return 1 + pct / 100;
};

const generateSeries = (start: number, monthlyRatio: number): DataPoint[] => {
  const series: DataPoint[] = [];
  let value = start;
  for (let i = 0; i < 12; i++) {
    if (i === 0) {
      series.push({ month: months[i], value });
    } else {
      value = value * monthlyRatio;
      series.push({ month: months[i], value });
    }
  }
  return series;
};

const fetchMarketData = async (): Promise<MarketCoin[]> => {
  const apiKey = import.meta.env.VITE_CG_API_KEY;
  const headers: Record<string, string> = {};
  if (apiKey) {
    headers['x-cg-demo-api-key'] = apiKey;
  }
  const urlBase = 'https://api.coingecko.com/api/v3/coins/markets';
  const params = 'vs_currency=usd&order=market_cap_desc&per_page=250&sparkline=false&price_change_percentage=24h%2C7d%2C30d';
  const urls = [`${urlBase}?${params}&page=1`, `${urlBase}?${params}&page=2`];
  const responses = await Promise.all(
    urls.map((url) => fetch(url, { headers }).then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return res.json();
    }))
  );
  return responses.flat();
};

const computeAnchor5Series = (coins: MarketCoin[]): DataPoint[] => {
  if (!coins) return [];
  const filtered = coins.filter((c) => !stableIds.has(c.id));
  filtered.sort((a, b) => (b.current_price ?? 0) - (a.current_price ?? 0));
  const selected = filtered.slice(0, 5);
  const totalPrice = selected.reduce((sum, c) => sum + (c.current_price ?? 0), 0);
  if (totalPrice === 0) return [];
  const weightedPct = selected.reduce((acc, c) => {
    const weight = (c.current_price ?? 0) / totalPrice;
    const pct = c.price_change_percentage_30d_in_currency ?? c.price_change_percentage_30d ?? 0;
    return acc + weight * pct;
  }, 0);
  const ratio = getChangeAsRatio(weightedPct);
  return generateSeries(1000, ratio);
};

const computeVibe20Series = (coins: MarketCoin[]): DataPoint[] => {
  if (!coins) return [];
  const filtered = coins.filter((c) => !stableIds.has(c.id));
  filtered.sort((a, b) => (b.total_volume ?? 0) - (a.total_volume ?? 0));
  const selected = filtered.slice(0, 20);
  const totalVolume = selected.reduce((sum, c) => sum + (c.total_volume ?? 0), 0);
  if (totalVolume === 0) return [];
  const weightedPct = selected.reduce((acc, c) => {
    const weight = (c.total_volume ?? 0) / totalVolume;
    const pct = c.price_change_percentage_30d_in_currency ?? c.price_change_percentage_30d ?? 0;
    return acc + weight * pct;
  }, 0);
  const ratio = getChangeAsRatio(weightedPct);
  return generateSeries(1000, ratio);
};

const computeWave100Series = (coins: MarketCoin[]): DataPoint[] => {
  if (!coins) return [];
  const filtered = coins.filter((c) => !stableIds.has(c.id) && (c.market_cap ?? 0) >= 10000000);
  filtered.sort((a, b) => {
    const pctB = b.price_change_percentage_30d_in_currency ?? b.price_change_percentage_30d ?? 0;
    const pctA = a.price_change_percentage_30d_in_currency ?? a.price_change_percentage_30d ?? 0;
    return pctB - pctA;
  });
  const selected = filtered.slice(0, 100);
  if (selected.length === 0) return [];
  const avgPct = selected.reduce((sum, c) => {
    const pct = c.price_change_percentage_30d_in_currency ?? c.price_change_percentage_30d ?? 0;
    return sum + pct;
  }, 0) / selected.length;
  const ratio = getChangeAsRatio(avgPct);
  return generateSeries(1000, ratio);
};

const Indices = () => {
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);
  const [anchorSeries, setAnchorSeries] = useState<DataPoint[]>([]);
  const [vibeSeries, setVibeSeries] = useState<DataPoint[]>([]);
  const [waveSeries, setWaveSeries] = useState<DataPoint[]>([]);

  useEffect(() => {
  const load = async () => {
      try {
        const data = await fetchMarketData();
        setAnchorSeries(computeAnchor5Series(data));
        setVibeSeries(computeVibe20Series(data));
        setWaveSeries(computeWave100Series(data));
      } catch (err) {
        console.error(err);
        setAnchorSeries([]);
        setVibeSeries([]);
        setWaveSeries([]);
      }
    };
    load();
  }, []);

  const indices = [
    {
      name: 'Anchor5',
      subtitle: 'The Blue-Chip Stability Index',
      icon: <Target className="h-8 w-8" />, 
      description:
        'Focuses on 5 long-term, stable, widely used cryptos (like a crypto version of the Dow Jones). Uses price ranking for selection and price weighting.',
      characteristics: [
        'Quarterly rebalancing',
        'Low volatility',
        'High liquidity',
        'Conservative approach'
      ],
      marketScore: 1247,
      chartColor: '#3b82f6',
      data: anchorSeries
    },
    {
      name: 'Vibe20',
      subtitle: 'The High-Volume Index',
      icon: <TrendingUp className="h-8 w-8" />, 
      description:
        'Tracks the 20 most-traded cryptos by 24h volume (excludes stablecoins). Purely volume-based weighting.',
      characteristics: [
        'Monthly rebalancing',
        'Medium-high volatility',
        'Very high liquidity',
        'Sentiment tracking'
      ],
      marketScore: 892,
      chartColor: '#10b981',
      data: vibeSeries
    },
    {
      name: 'Wave100',
      subtitle: 'The Momentum Performance Index',
      icon: <Waves className="h-8 w-8" />, 
      description:
        'Picks the top 100 coins with biggest 30-day percentage gains, capturing momentum trends. Equal-weighted.',
      characteristics: [
        'Weekly rebalancing',
        'Very high volatility',
        'Variable liquidity',
        'Trend following'
      ],
      marketScore: 1834,
      chartColor: '#f59e0b',
      data: waveSeries
    }
  ];

  const toggleIndex = (name: string) => {
    setExpandedIndex(expandedIndex === name ? null : name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              size="sm"
              className="mb-8 hover:bg-primary/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Investment Indices
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover our carefully curated investment indices designed to
              provide diversified exposure to digital assets across different
              risk profiles and market segments.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {indices.map((index) => (
              <Card
                key={index.name}
                className={`border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-glow group ${
                  expandedIndex === index.name ? 'lg:col-span-3' : ''
                }`}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-gradient-primary/10 group-hover:bg-gradient-primary/20 transition-colors">
                      {React.cloneElement(index.icon, {
                        className: 'h-8 w-8 text-primary'
                      })}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {index.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-primary font-semibold mt-2">
                    {index.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-center mb-6 leading-relaxed">
                    {index.description}
                  </CardDescription>
                  <div className="text-center p-4 bg-gradient-primary/10 rounded-lg mb-6">
                    <div className="font-semibold text-foreground mb-2">
                      Market Score
                    </div>
                    <div className="text-3xl font-bold text-primary">
                      {index.marketScore.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Current market index value
                    </div>
                  </div>
                  <Button
                    className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    onClick={() => toggleIndex(index.name)}
                  >
                    {expandedIndex === index.name ? (
                      <>
                        Hide Chart{' '}
                        <ChevronUp className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        View Chart{' '}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  {expandedIndex === index.name && (
                    <div className="mt-6 animate-fade-in">
                      <div className="border-t pt-6">
                        <h4 className="text-lg font-semibold text-foreground mb-4 text-center">
                          {index.name} Performance (12-Month View)
                        </h4>
                        <div className="h-80 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={index.data}>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                className="opacity-30"
                              />
                              <XAxis
                                dataKey="month"
                                tick={{
                                  fontSize: 12,
                                  fill: 'hsl(var(--muted-foreground))'
                                }}
                              />
                              <YAxis
                                tick={{
                                  fontSize: 12,
                                  fill: 'hsl(var(--muted-foreground))'
                                }}
                                domain={[
                                  'dataMin - 50',
                                  'dataMax + 50'
                                ]}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: 'hsl(var(--background))',
                                  border: '1px solid hsl(var(--border))',
                                  borderRadius: '8px'
                                }}
                                labelStyle={{
                                  color: 'hsl(var(--foreground))'
                                }}
                              />
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke={index.chartColor}
                                strokeWidth={3}
                                dot={{
                                  r: 4,
                                  fill: index.chartColor
                                }}
                                activeDot={{
                                  r: 6,
                                  fill: index.chartColor
                                }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
                          {index.characteristics.map((char, charIndex) => (
                            <div
                              key={charIndex}
                              className="text-center p-3 bg-muted/30 rounded-lg"
                            >
                              {char}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Card className="border-primary/20 bg-gradient-secondary/50 backdrop-blur-sm">
              {/* Add call to action content here */}
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Indices;
