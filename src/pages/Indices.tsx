import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, Target, Waves, ChevronDown, ChevronUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
const Indices = () => {
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

  // Mock performance data for each index
  const generateMockData = (indexType: string) => {
    const baseData = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 12; i++) {
      let value = 1000; // Starting value
      
      switch (indexType) {
        case 'Anchor5':
          // Stable, steady growth with low volatility
          value = 1000 + (i * 45) + (Math.random() * 30 - 15);
          break;
        case 'Vibe20':
          // More volatile, responsive to volume spikes
          value = 1000 + (i * 35) + (Math.random() * 100 - 50) + (i % 3 === 0 ? 80 : 0);
          break;
        case 'Wave100':
          // High volatility, momentum-driven
          value = 1000 + (i * 50) + (Math.random() * 150 - 75) + (Math.sin(i) * 60);
          break;
      }
      
      baseData.push({
        month: months[i],
        value: Math.max(value, 800), // Minimum floor
      });
    }
    
    return baseData;
  };

  const indices = [
    {
      name: "Anchor5",
      subtitle: "The Blue-Chip Stability Index",
      icon: <Target className="h-8 w-8" />,
      description: "Focuses on 5 long-term, stable, widely used cryptos (like a crypto version of the Dow Jones). Uses multi-factor scoring and price-weighting methodology.",
      characteristics: ["Quarterly rebalancing", "Low volatility", "High liquidity", "Conservative approach"],
      rebalance: "Quarterly",
      volatility: "Low",
      chartColor: "#3b82f6",
      data: generateMockData('Anchor5')
    },
    {
      name: "Vibe20",
      subtitle: "The High-Volume Index",
      icon: <TrendingUp className="h-8 w-8" />,
      description: "Tracks the 20 most-traded cryptos by 24h volume (excludes stablecoins). Think 'crypto Nasdaq' with volume-weighted market cap methodology.",
      characteristics: ["Monthly rebalancing", "Medium-high volatility", "Very high liquidity", "Sentiment tracking"],
      rebalance: "Monthly",
      volatility: "Medium-High",
      chartColor: "#10b981",
      data: generateMockData('Vibe20')
    },
    {
      name: "Wave100",
      subtitle: "The Momentum Performance Index",
      icon: <Waves className="h-8 w-8" />,
      description: "Picks the top 100 coins with biggest % gains, capturing momentum trends. Works as both growth tracker and resilience index.",
      characteristics: ["Weekly rebalancing", "Very high volatility", "Variable liquidity", "Trend following"],
      rebalance: "Weekly",
      volatility: "Very High",
      chartColor: "#f59e0b",
      data: generateMockData('Wave100')
    }
  ];

  const toggleIndex = (indexName: string) => {
    setExpandedIndex(expandedIndex === indexName ? null : indexName);
  };
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <Button onClick={() => navigate(-1)} variant="ghost" size="sm" className="mb-8 hover:bg-primary/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Investment Indices
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover our carefully curated investment indices designed to provide diversified exposure 
              to digital assets across different risk profiles and market segments.
            </p>
          </div>

          {/* Indices Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {indices.map((index, i) => (
              <Card key={index.name} className={`border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-glow group ${
                expandedIndex === index.name ? 'lg:col-span-3' : ''
              }`}>
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-gradient-primary/10 group-hover:bg-gradient-primary/20 transition-colors">
                      {React.cloneElement(index.icon, {
                        className: "h-8 w-8 text-primary"
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
                  
                  {/* Characteristics */}
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="font-semibold text-foreground">Rebalancing</div>
                      <div className="text-muted-foreground">{index.rebalance}</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="font-semibold text-foreground">Volatility</div>
                      <div className="text-muted-foreground">{index.volatility}</div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300" 
                    onClick={() => toggleIndex(index.name)}
                  >
                    {expandedIndex === index.name ? (
                      <>
                        Hide Chart <ChevronUp className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        View Chart <ChevronDown className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  
                  {/* Expandable Chart Section */}
                  {expandedIndex === index.name && (
                    <div className="mt-6 animate-fade-in">
                      <div className="border-t pt-6">
                        <h4 className="text-lg font-semibold text-foreground mb-4 text-center">
                          {index.name} Performance (12-Month View)
                        </h4>
                        
                        {/* Chart */}
                        <div className="h-80 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={index.data}>
                              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                              <XAxis 
                                dataKey="month" 
                                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                              />
                              <YAxis 
                                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                domain={['dataMin - 50', 'dataMax + 50']}
                              />
                              <Tooltip 
                                contentStyle={{
                                  backgroundColor: 'hsl(var(--background))',
                                  border: '1px solid hsl(var(--border))',
                                  borderRadius: '8px'
                                }}
                                labelStyle={{ color: 'hsl(var(--foreground))' }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke={index.chartColor}
                                strokeWidth={3}
                                dot={{ r: 4, fill: index.chartColor }}
                                activeDot={{ r: 6, fill: index.chartColor }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        
                        {/* Index Characteristics */}
                        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
                          {index.characteristics.map((char, charIndex) => (
                            <div key={charIndex} className="text-center p-3 bg-muted/30 rounded-lg">
                              <div className="text-xs font-medium text-muted-foreground">{char}</div>
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

          {/* Call to Action */}
          <div className="text-center">
            <Card className="border-primary/20 bg-gradient-secondary/50 backdrop-blur-sm">
              
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>;
};
export default Indices;