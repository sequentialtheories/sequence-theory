import { Button } from "@/components/ui/button";
import { Shield, TrendingUp, Users, Target, CheckCircle, Wallet, Lock, Zap } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { navigateToSignup } from "@/utils/navigation";

const VaultClubMain = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleJoinClick = () => {
    navigateToSignup(location.pathname, navigate);
  };

  const features = [{
    icon: Shield,
    title: "100% Non-Custodial",
    description: "Your private keys are generated client-side and never accessible to Sequence Theory. Your Money. Your Power."
  }, {
    icon: TrendingUp,
    title: "Risk & Rigor Levels",
    description: "Select your risk profile — funds are distributed across established DeFi protocols automatically."
  }, {
    icon: Lock,
    title: "Deterministic Code",
    description: "Once deployed, contract logic is immutable — governed by unanimous consent, not speculation."
  }, {
    icon: Wallet,
    title: "Web2 Feel, Web3 Body",
    description: "Sign in with Email or Passkey. No seed phrases to manage. Frictionless onboarding."
  }];

  const riskTiers = [
    {
      level: "Conservative",
      protocol: "Aave V3",
      description: "Stablecoin lending through battle-tested protocols",
      color: "text-green-600"
    },
    {
      level: "Medium",
      protocol: "sUSDC",
      description: "Savings rates with established stablecoin yields",
      color: "text-yellow-600"
    },
    {
      level: "Risky",
      protocol: "Morpho",
      description: "Institutional-grade vaults with precurated risk modeling",
      color: "text-red-500"
    }
  ];

  const benefits = [
    "Simple pricing: $1.50/user/week ($0.50 gas + $1.00 utility)",
    "No percentage-based fees on your gains",
    "Emergency liquidity built in",
    "Transparent, on-chain operations"
  ];

  return (
    <section className="py-20 bg-gradient-secondary relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-float-delayed"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Main Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              The Vault Club (TVC)
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 animate-slide-up [animation-delay:0.2s]">
            A decentralized software coordination platform transforming "managerial effort" into "deterministic code" — 
            bridging DeFi and long-term retail wealth building with Web2 ease and Web3 infrastructure.
          </p>
        </div>

        {/* How It Works - Risk & Rigor */}
        <div className="max-w-4xl mx-auto mb-16 animate-slide-up [animation-delay:0.3s]">
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground">Select Your Risk & Rigor</h3>
          <p className="text-center text-gray-600 mb-8">
            TVC is not a tool for speculation — it's a tool for structured discipline. 
            Users don't "trade"; they select Risk & Rigor levels.
          </p>
          <div className="bg-gradient-card backdrop-blur-sm rounded-2xl p-8 shadow-medium transition-spring hover:shadow-strong">
            <div className="grid md:grid-cols-3 gap-6">
              {riskTiers.map((tier, index) => (
                <div key={index} className="text-center p-6 rounded-xl bg-background/50 hover:bg-background transition-all duration-300 animate-slide-up" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                  <div className={`text-2xl font-bold mb-2 ${tier.color}`}>{tier.level}</div>
                  <div className="text-lg font-semibold text-foreground mb-2">{tier.protocol}</div>
                  <p className="text-sm text-gray-600">{tier.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-16 animate-slide-up [animation-delay:0.4s]">
          <h3 className="text-2xl font-bold text-center mb-12 text-foreground">Consumer-First DeFi</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group animate-slide-up" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-medium transition-spring group-hover:scale-110 group-hover:shadow-glow animate-glow">
                  <feature.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h4 className="text-lg font-semibold mb-3 text-foreground group-hover:text-primary transition-smooth">{feature.title}</h4>
                <p className="text-gray-600 group-hover:text-foreground transition-smooth">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits List */}
        <div className="max-w-3xl mx-auto mb-12 animate-slide-up [animation-delay:0.5s]">
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground">Transparent & Simple</h3>
          <div className="bg-gradient-card backdrop-blur-sm rounded-xl p-8 shadow-medium transition-spring hover:shadow-strong">
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3 group animate-slide-left" style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
                  <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0 transition-spring group-hover:scale-110" />
                  <span className="text-gray-600 text-lg group-hover:text-foreground transition-smooth">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center animate-slide-up [animation-delay:0.6s]">
          <div className="bg-gradient-primary text-primary-foreground rounded-2xl p-8 max-w-2xl mx-auto shadow-strong transition-spring hover:scale-105 hover:shadow-glow animate-glow">
            <h3 className="text-2xl font-bold mb-4">The Subscription to Your Future</h3>
            <p className="text-lg mb-6 opacity-90">
              Stop chasing hype. Start compounding legacy. Your Money. Your Power.
            </p>
            <Button onClick={handleJoinClick} size="lg" className="bg-background text-primary hover:bg-secondary px-8 py-3 rounded-full text-lg font-semibold transition-bounce hover:scale-110 shadow-medium hover:shadow-strong">
              Get Priority Access
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VaultClubMain;
