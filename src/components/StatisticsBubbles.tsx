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
    "bg-gradient-to-br from-violet-100/40 to-purple-200/30 border-violet-200/50",
    "bg-gradient-to-br from-blue-100/40 to-indigo-200/30 border-blue-200/50",
    "bg-gradient-to-br from-emerald-100/40 to-teal-200/30 border-emerald-200/50",
    "bg-gradient-to-br from-rose-100/40 to-pink-200/30 border-rose-200/50",
    "bg-gradient-to-br from-amber-100/40 to-orange-200/30 border-amber-200/50"
  ];

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
        <div className={cn(
          "backdrop-blur-xl border rounded-3xl p-5 max-w-[280px]",
          "shadow-[0_8px_32px_rgba(31,38,135,0.15)]",
          "hover:shadow-[0_12px_40px_rgba(31,38,135,0.25)]",
          "transition-all duration-700 ease-out",
          "hover:scale-[1.02] hover:-translate-y-1",
          variants[variant % variants.length]
        )}>
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
  // Thoughtfully positioned for visual harmony
  const positions = [
    { x: 12, y: 160 },   // Top left, elegant spacing
    { x: 88, y: 220 },   // Top right, balanced
    { x: 8, y: 420 },    // Mid left, breathing room
    { x: 92, y: 580 },   // Mid right, asymmetric balance
    { x: 15, y: 740 },   // Lower left, visual flow
    { x: 85, y: 880 },   // Lower right, clean margins
    { x: 10, y: 1020 }   // Bottom left, final accent
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
