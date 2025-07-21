import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const statisticsData = [
  {
    statistic: "62% of Americans own stocks — but the top 10% hold nearly all the value.",
    explanation: "Compounding isn't the issue—access is.",
    source: "Investopedia"
  },
  {
    statistic: "Only 33% of adults globally are financially literate.",
    explanation: "Despite increasing internet access, most people still don't understand core financial concepts like interest, inflation, or risk diversification.",
    source: "World Financial Symposium"
  },
  {
    statistic: "Over 77% of U.S. adults report feeling financial stress.",
    explanation: "Poor financial literacy isn't just a knowledge gap—it's a wellness crisis affecting daily decisions, stability, and mental health.",
    source: "WFS.org"
  },
  {
    statistic: "In Sub-Saharan Africa, mobile penetration exceeds 70%—yet only 7–18% use online finance tools.",
    explanation: "This is a tech-literacy disconnect: the hardware is there, but not the knowledge or tools to use it for wealth building.",
    source: "Wikipedia – Digital Divide"
  },
  {
    statistic: "Crypto adoption is surging: 35% in Nigeria, 22% in South Africa, 9% in Kenya.",
    explanation: "Digital assets are being embraced in regions where traditional banking has failed—showing the global demand for accessible alternatives.",
    source: "CoinJournal"
  },
  {
    statistic: "Low-income U.S. families (bottom 50%) hold only 1–8% of stock wealth.",
    explanation: "Even in the world's most developed markets, the investment ladder is still broken for most.",
    source: "Wikipedia – Wealth Inequality"
  },
  {
    statistic: "Financial illiteracy costs the average adult $388–$1,800 per year.",
    explanation: "That's real money lost to fees, bad decisions, or missed opportunities simply from lack of knowledge.",
    source: "BalancingEverything"
  }
];

const BubbleCard = ({ 
  statistic, 
  explanation, 
  source, 
  delay, 
  position 
}: { 
  statistic: string; 
  explanation: string; 
  source: string; 
  delay: number;
  position: { x: number; y: number };
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={cn(
        "absolute transition-all duration-1000 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `translate(-50%, -50%)`,
      }}
    >
      <div className="relative group">
        <div className="bg-card border border-border rounded-2xl p-6 max-w-sm shadow-soft hover:shadow-glow transition-all duration-500 animate-float">
          <div className="space-y-3">
            <p className="text-foreground font-bold text-lg leading-tight">
              {statistic}
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {explanation}
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground/60 mt-2 text-center">
          Source: {source}
        </p>
      </div>
    </div>
  );
};

export const StatisticsBubbles = () => {
  // Generate random but consistent positions for each bubble
  const positions = [
    { x: 15, y: 20 },
    { x: 85, y: 15 },
    { x: 25, y: 60 },
    { x: 75, y: 45 },
    { x: 45, y: 25 },
    { x: 20, y: 85 },
    { x: 80, y: 75 }
  ];

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-subtle opacity-30" />
        
        {/* Section header */}
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            The Global Financial Literacy Crisis
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Understanding the scope of financial inequality and literacy gaps that drive our mission to democratize financial education.
          </p>
        </div>

        {/* Statistics bubbles container */}
        <div className="relative h-[800px] md:h-[900px]">
          {statisticsData.map((stat, index) => (
            <BubbleCard
              key={index}
              statistic={stat.statistic}
              explanation={stat.explanation}
              source={stat.source}
              delay={index * 200}
              position={positions[index]}
            />
          ))}
        </div>
      </div>
    </section>
  );
};