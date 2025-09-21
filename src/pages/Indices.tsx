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
    icon: <Target className="h-8 w-8" />,
    description: "A stable foundation index focused on established digital assets with proven track records.",
    features: ["Conservative risk profile", "5 core digital assets", "Quarterly rebalancing", "Focus on market leaders"]
  }, {
    name: "Vibe20",
    icon: <TrendingUp className="h-8 w-8" />,
    description: "A balanced growth index capturing emerging opportunities across the digital asset ecosystem.",
    features: ["Moderate risk profile", "20 diversified assets", "Monthly rebalancing", "Innovation focused"]
  }, {
    name: "Wave100",
    icon: <Waves className="h-8 w-8" />,
    description: "A comprehensive index providing broad exposure to the entire digital asset market.",
    features: ["Aggressive growth profile", "100+ digital assets", "Weekly rebalancing", "Full market exposure"]
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
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-center mb-6 leading-relaxed">
                    {index.description}
                  </CardDescription>
                  
                  <div className="space-y-3">
                    {index.features.map((feature, featureIndex) => <div key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-gradient-primary mr-3 flex-shrink-0"></div>
                        {feature}
                      </div>)}
                  </div>
                  
                  <Button className="w-full mt-6 bg-gradient-primary hover:shadow-glow transition-all duration-300" onClick={() => {
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