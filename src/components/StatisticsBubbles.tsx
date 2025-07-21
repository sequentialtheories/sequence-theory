import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const statisticsData = [
  {
    headline: "62% own stocks, 10% hold the wealth",
    source: "Investopedia"
  },
  {
    headline: "Only 33% globally are financially literate",
    source: "World Financial Symposium"
  },
  {
    headline: "77% of Americans face financial stress",
    source: "WFS.org"
  },
  {
    headline: "70% mobile penetration, 7% use finance tools",
    source: "Wikipedia"
  },
  {
    headline: "35% crypto adoption in Nigeria",
    source: "CoinJournal"
  },
  {
    headline: "Bottom 50% hold 1-8% of stock wealth",
    source: "Wikipedia"
  },
  {
    headline: "Financial illiteracy costs $388-$1,800/year",
    source: "BalancingEverything"
  }
];

const BubbleCard = ({ 
  headline, 
  source, 
  delay, 
  position 
}: { 
  headline: string; 
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
        isVisible ? "opacity-100" : "opacity-0"
      )}
      style={{
        left: `${position.x}%`,
        top: `${position.y}px`,
        transform: `translate(-50%, -50%)`,
      }}
    >
      <div className="relative group">
        <div className="bg-card/90 backdrop-blur-sm border-2 border-primary/20 rounded-3xl p-6 max-w-xs shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105">
          <div className="space-y-3">
            <h3 className="text-foreground font-bold text-base leading-tight">
              {headline}
            </h3>
            <p className="text-xs text-muted-foreground/70 border-t border-border/30 pt-2">
              Source: {source}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StatisticsBubbles = () => {
  // Scatter positions throughout the page content using pixel positions
  const positions = [
    { x: 85, y: 200 },   // Hero section right
    { x: 15, y: 450 },   // Between hero and problem
    { x: 75, y: 650 },   // Problem section area
    { x: 25, y: 850 },   // Problem section left
    { x: 80, y: 1050 },  // Between sections
    { x: 20, y: 1250 },  // Mission section left
    { x: 70, y: 1450 }   // Mission section right
  ];

  return (
    <section className="relative">
      {/* Scattered statistics bubbles */}
      {statisticsData.map((stat, index) => (
        <BubbleCard
          key={index}
          headline={stat.headline}
          source={stat.source}
          delay={index * 400}
          position={positions[index]}
        />
      ))}
    </section>
  );
};