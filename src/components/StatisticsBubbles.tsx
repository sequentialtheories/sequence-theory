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
  position,
  variant
}: { 
  headline: string; 
  source: string; 
  delay: number;
  position: { x: number; y: number };
  variant: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const variants = [
    "bg-gradient-to-br from-violet-200/70 to-purple-300/60 border-violet-300/80",
    "bg-gradient-to-br from-blue-200/70 to-indigo-300/60 border-blue-300/80",
    "bg-gradient-to-br from-emerald-200/70 to-teal-300/60 border-emerald-300/80",
    "bg-gradient-to-br from-rose-200/70 to-pink-300/60 border-rose-300/80",
    "bg-gradient-to-br from-amber-200/70 to-orange-300/60 border-amber-300/80"
  ];

  const rotations = [-2, 1, -1, 2, -3, 1, -1];
  const rotation = rotations[variant % rotations.length];

  return (
    <div 
      className={cn(
        "absolute transition-all duration-[2000ms] ease-out",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}
      style={{
        left: `${position.x}%`,
        top: `${position.y}px`,
        transform: `translate(-50%, -50%)`,
        animationDelay: `${variant * 0.8}s`
      }}
    >
      <div 
        className={cn(
          "relative group cursor-default",
          "animate-[gentle-float_12s_ease-in-out_infinite]"
        )}
        style={{ animationDelay: `${variant * 1.2}s` }}
      >
        <div 
          className={cn(
            "backdrop-blur-xl border-2 rounded-3xl p-5 max-w-[280px]",
            "shadow-[0_12px_40px_rgba(0,0,0,0.25)]",
            "hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]",
            "transition-all duration-700 ease-out",
            "hover:scale-[1.05] hover:-translate-y-2",
            variants[variant % variants.length]
          )}
          style={{ 
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <div className="space-y-3">
            <h3 className="text-gray-800 font-semibold text-sm leading-snug tracking-tight">
              {headline}
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-[1px] bg-gradient-to-r from-gray-400/60 to-transparent"></div>
              <p className="text-[10px] text-gray-500/80 font-medium uppercase tracking-wider">
                {source}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StatisticsBubbles = () => {
  // More centered positioning spreading toward bottom
  const positions = [
    { x: 25, y: 280 },   // Top left, more centered
    { x: 75, y: 350 },   // Top right, more centered
    { x: 30, y: 520 },   // Mid left, centered
    { x: 70, y: 680 },   // Mid right, centered
    { x: 20, y: 840 },   // Lower left, spreading down
    { x: 80, y: 1000 },  // Lower right, spreading down
    { x: 35, y: 1160 }   // Bottom center-left, final spread
  ];

  return (
    <section className="relative pointer-events-none">
      {statisticsData.map((stat, index) => (
        <BubbleCard
          key={index}
          headline={stat.headline}
          source={stat.source}
          delay={index * 600}
          position={positions[index]}
          variant={index}
        />
      ))}
    </section>
  );
};
