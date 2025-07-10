import { CheckCircle, Circle, Lock } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LearningProgress = () => {
  const location = useLocation();
  
  const learningPath = [
    {
      title: "Financial Basics",
      href: "/learn/financial-basics",
      description: "Foundation wealth building concepts",
      isUnlocked: true
    },
    {
      title: "Digital Asset Fundamentals", 
      href: "/learn/digital-asset-fundamentals",
      description: "Cryptocurrency and blockchain basics",
      isUnlocked: true
    },
    {
      title: "Vault Club Contracts",
      href: "/learn/vault-club-contracts",
      description: "How investment contracts work",
      isUnlocked: true
    },
    {
      title: "Digital Asset Exposure",
      href: "/learn/digital-asset-exposure",
      description: "Safe crypto exposure methods",
      isUnlocked: true
    },
    {
      title: "DeFi Protocols",
      href: "/learn/defi-protocols",
      description: "Decentralized finance mechanisms",
      isUnlocked: true
    },
    {
      title: "Expanding Beyond Vault Club",
      href: "/learn/expanding-beyond-vault-club",
      description: "Advanced strategies and next steps",
      isUnlocked: true
    },
    {
      title: "Understanding Markets",
      href: "/learn/understanding-markets",
      description: "Market analysis and economic cycles",
      isUnlocked: true
    },
    {
      title: "Shortfalls of Crypto",
      href: "/learn/shortfalls-of-crypto",
      description: "Technology exploitation and red flags",
      isUnlocked: true
    }
  ];

  const isActive = (href: string) => location.pathname === href;
  const isCompleted = () => false; // This would be connected to user progress in a real app

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-500" />
        Learning Progress
      </h3>
      
      <div className="space-y-3">
        {learningPath.map((step, index) => (
          <div key={step.href} className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {isCompleted() ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : step.isUnlocked ? (
                <Circle className={`h-5 w-5 ${isActive(step.href) ? 'text-purple-600' : 'text-gray-400'}`} />
              ) : (
                <Lock className="h-5 w-5 text-gray-300" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              {step.isUnlocked ? (
                <Link
                  to={step.href}
                  className={`block hover:bg-gray-50 rounded p-2 -m-2 transition-colors ${
                    isActive(step.href) ? 'bg-purple-50' : ''
                  }`}
                >
                  <div className={`font-medium text-sm ${
                    isActive(step.href) ? 'text-purple-600' : 'text-gray-900'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </div>
                </Link>
              ) : (
                <div className="p-2 -m-2">
                  <div className="font-medium text-sm text-gray-400">
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {step.description}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link to="/learn-now">
          <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white">
            Continue Learning
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default LearningProgress;
