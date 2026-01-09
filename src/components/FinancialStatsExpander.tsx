import { useState } from "react";
import { ChevronDown, ChevronUp, TrendingDown, Globe, AlertTriangle, Smartphone, Bitcoin, DollarSign, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const statisticsData = [
  {
    icon: TrendingDown,
    headline: "62% own stocks, 10% hold the wealth",
    detail: "Compounding isn't the issue—access is. Most retail investors never see meaningful returns because the wealthiest dominate the tools and timing.",
    source: "Investopedia"
  },
  {
    icon: Globe,
    headline: "Only 33% globally are financially literate",
    detail: "Despite increasing internet access, most people still don't understand core financial concepts like interest, inflation, or risk diversification.",
    source: "World Financial Symposium"
  },
  {
    icon: AlertTriangle,
    headline: "77% of Americans face financial stress",
    detail: "Poor financial literacy isn't just a knowledge gap—it's a wellness crisis affecting daily decisions, stability, and mental health.",
    source: "WFS.org"
  },
  {
    icon: Smartphone,
    headline: "70% mobile penetration, 7% use finance tools",
    detail: "This is a tech-literacy disconnect: the hardware is there, but not the knowledge or tools to use it for wealth building.",
    source: "Wikipedia – Digital Divide"
  },
  {
    icon: Bitcoin,
    headline: "35% crypto adoption in Nigeria",
    detail: "Digital assets are being embraced in regions where traditional banking has failed—showing the global demand for accessible alternatives.",
    source: "CoinJournal"
  },
  {
    icon: DollarSign,
    headline: "Bottom 50% hold 1-8% of stock wealth",
    detail: "Even in the world's most developed markets, the investment ladder is still broken for most.",
    source: "Wikipedia – Wealth Inequality"
  },
  {
    icon: BookOpen,
    headline: "Financial illiteracy costs $388-$1,800/year",
    detail: "That's real money lost to fees, bad decisions, or missed opportunities—simply from lack of knowledge.",
    source: "BalancingEverything"
  }
];

const StatBubble = ({ 
  icon: Icon, 
  headline, 
  detail, 
  source, 
  isExpanded, 
  onToggle,
  index 
}: { 
  icon: any;
  headline: string; 
  detail: string;
  source: string; 
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}) => {
  const gradients = [
    "bg-gradient-to-br from-violet-100/60 to-purple-200/50 border-violet-300/60",
    "bg-gradient-to-br from-blue-100/60 to-indigo-200/50 border-blue-300/60",
    "bg-gradient-to-br from-purple-100/60 to-violet-200/50 border-purple-300/60",
    "bg-gradient-to-br from-indigo-100/60 to-blue-200/50 border-indigo-300/60",
    "bg-gradient-to-br from-violet-200/60 to-purple-300/50 border-violet-400/60",
    "bg-gradient-to-br from-blue-200/60 to-indigo-300/50 border-blue-400/60",
    "bg-gradient-to-br from-purple-200/60 to-violet-300/50 border-purple-400/60"
  ];

  return (
    <div 
      className={cn(
        "group cursor-pointer transition-all duration-500 ease-out",
        "hover:scale-[1.02] hover:-translate-y-1"
      )}
      onClick={onToggle}
    >
      <div className={cn(
        "backdrop-blur-xl border-2 rounded-2xl p-6",
        "shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
        "hover:shadow-[0_15px_45px_rgba(0,0,0,0.2)]",
        "transition-all duration-500 ease-out",
        gradients[index % gradients.length]
      )}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-2 rounded-lg bg-white/50 shadow-sm">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-base text-gray-800 leading-tight group-hover:text-primary transition-colors duration-300">
                {headline}
              </h3>
              <div className="flex-shrink-0 text-primary transition-transform duration-300 group-hover:scale-110">
                {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </div>
            
            <div className={cn(
              "overflow-hidden transition-all duration-500 ease-out",
              isExpanded ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
            )}>
              <p className="text-sm text-gray-700 leading-relaxed mb-3 font-medium">
                {detail}
              </p>
            </div>
            
            <div className="flex items-center gap-2 mt-3">
              <div className="w-4 h-[1px] bg-gradient-to-r from-gray-400/70 to-transparent"></div>
              <p className="text-xs text-gray-500/90 font-medium uppercase tracking-wider">
                {source}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FinancialStatsExpander = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold text-foreground mb-3">The Current State of Financial Access</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Understanding the scope of financial inequality reveals why new approaches to wealth building are essential.
        </p>
      </div>
      
      <div className="grid gap-4 md:gap-6">
        {statisticsData.map((stat, index) => (
          <StatBubble
            key={index}
            icon={stat.icon}
            headline={stat.headline}
            detail={stat.detail}
            source={stat.source}
            isExpanded={expandedIndex === index}
            onToggle={() => handleToggle(index)}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};