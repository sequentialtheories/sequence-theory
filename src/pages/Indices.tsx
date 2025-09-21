import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, Target, Waves } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
const Indices = () => {
  const navigate = useNavigate();
  const indices = [{
    name: "Anchor5",
    subtitle: "The Blue-Chip Stability Index",
    icon: <Target className="h-8 w-8" />,
    description: "A concentrated 5-asset portfolio using multi-factor scoring and price-weighting like the Dow Jones.",
    methodology: [
      "Multi-factor composite scoring system",
      "Price-weighted methodology (Dow Jones style)",
      "Focus on stability and established market leaders",
      "Quarterly rebalancing with rigorous selection"
    ],
    formula: {
      composite: "Score(T) = 0.2·Rank_Price(T) + 0.3·Rank_Wallets(T) + 0.2·Rank_Stability(T) + 0.3·Rank_MCap(T)",
      index: "Anchor5Index(t) = Σᵢ₌₁⁵ Pᵢ(t) / D"
    }
  }, {
    name: "Vibe20",
    subtitle: "The High-Volume Index",
    icon: <TrendingUp className="h-8 w-8" />,
    description: "Top 20 cryptocurrencies by trading volume with volume-weighted market cap methodology.",
    methodology: [
      "Volume-weighted market capitalization",
      "Top 20 assets by trading volume",
      "Dynamic weighting based on market activity",
      "Monthly rebalancing for optimal exposure"
    ],
    formula: {
      weight: "Weight(T) = Vol(T)·MCap(T) / Σⱼ₌₁²⁰ Vol(j)·MCap(j)",
      index: "Vibe20Index(t) = Σᵢ₌₁²⁰ Weight(i)·[Pᵢ(t)/Pᵢ(0)]·1000"
    }
  }, {
    name: "Wave100",
    subtitle: "The Momentum Performance Index",
    icon: <Waves className="h-8 w-8" />,
    description: "Top 100 performers by percentage gains, with equal or return-proportional weighting.",
    methodology: [
      "Momentum-based selection criteria",
      "Dual weighting methodologies available",
      "CoinGecko data integration",
      "Weekly rebalancing for trend capture"
    ],
    formula: {
      equal: "Wave100(t) = (1/100)·Σᵢ₌₁¹⁰⁰ [Pᵢ(t)/Pᵢ(0)]·1000",
      proportional: "Weight(i) = %Gain(i) / Σ %Gain(all)"
    },
    dataSource: "CoinGecko API"
  }];
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
            {indices.map((index, i) => <Card key={index.name} className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-glow group">
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
                  
                  {/* Formula Section */}
                  <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                    <h4 className="text-sm font-semibold text-foreground mb-3">Mathematical Formula:</h4>
                    <div className="space-y-2">
                      {Object.entries(index.formula).map(([key, formula]) => (
                        <div key={key} className="text-xs font-mono text-muted-foreground bg-background/50 p-2 rounded border overflow-x-auto">
                          {formula}
                        </div>
                      ))}
                    </div>
                    {index.dataSource && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Data Source: {index.dataSource}
                      </p>
                    )}
                  </div>
                  
                  {/* Methodology Section */}
                  <div className="space-y-3 mb-6">
                    <h4 className="text-sm font-semibold text-foreground">Methodology:</h4>
                    {index.methodology.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-gradient-primary mr-3 flex-shrink-0"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300" onClick={() => {
                // Future implementation for index details
                console.log(`Learn more about ${index.name}`);
              }}>
                    Learn More
                  </Button>
                </CardContent>
              </Card>)}
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