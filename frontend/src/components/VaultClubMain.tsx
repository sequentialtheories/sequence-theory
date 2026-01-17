import { Button } from "@/components/ui/button";
import { Shield, TrendingUp, Users, Target, CheckCircle } from "lucide-react";
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
    title: "Set & Forget",
    description: "Automated investing that works for you. No daily decisions required."
  }, {
    icon: TrendingUp,
    title: "Automated Compounding",
    description: "Routed Reinvestment Logic (RRL) strategically allocates and preserves capital for optimal risk-adjusted growth."
  }, {
    icon: Target,
    title: "Disciplined Contracts",
    description: "Lock-up periods from 1-20 years with customizable rigor tiers"
  }, {
    icon: Users,
    title: "Contract Structure",
    description: "1-8 participants per contract with unanimous governance"
  }];
  const benefits = ["Strategic Aggressive Growth & Capital Preservation", "Diversification Across Established DeFi Protocols", "Elevated Returns Through Conservative Leverage", "Built-in safeguards: missed deposit redistribution, emergency withdrawal, multisig security"];
  return <section className="py-20 bg-gradient-secondary relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-float-delayed"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Main Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              The Vault Club
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 animate-slide-up [animation-delay:0.2s]">A private, choreographed financial schematic designed for long-term capital growth through disciplined, automated smart contracts.</p>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mb-16 animate-slide-up [animation-delay:0.3s]">
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground">How It Works</h3>
          <div className="bg-gradient-card backdrop-blur-sm rounded-2xl p-8 shadow-medium transition-spring hover:shadow-strong">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="animate-slide-left">
                <h4 className="text-lg font-semibold mb-4 text-primary">Phase 1: The Mega Vault</h4>
                <ul className="list-none space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 animate-pulse-soft"></div>
                    <span className="text-gray-600">All user funds pooled into the Mega Vault for scale-based efficiency</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 animate-pulse-soft [animation-delay:0.5s]"></div>
                    <span className="text-gray-600">Capital deployed across three strands: Spark (10%), Aave (60%), QuickSwap (30%)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 animate-pulse-soft [animation-delay:1s]"></div>
                    <span className="text-gray-600">Routed Reinvestment Logic (RRL) creates compounding "compression"</span>
                  </li>
                </ul>
              </div>
              <div className="animate-slide-right">
                <h4 className="text-lg font-semibold mb-4 text-accent">Phase 2: wBTC Accumulation</h4>
                <ul className="list-none space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 animate-pulse-soft"></div>
                    <span className="text-gray-600">Triggered at 50% contract completion OR ~$1M value</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 animate-pulse-soft [animation-delay:0.5s]"></div>
                    <span className="text-gray-600">Weekly Dollar-Cost Averaging into Wrapped Bitcoin for wealth preservation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 animate-pulse-soft [animation-delay:1s]"></div>
                    <span className="text-gray-600">Target full wBTC allocation by contract completion, which is finally swapped back to USDC.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-16 animate-slide-up [animation-delay:0.4s]">
          <h3 className="text-2xl font-bold text-center mb-12 text-foreground">Key Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => <div key={index} className="text-center group animate-slide-up" style={{
            animationDelay: `${0.5 + index * 0.1}s`
          }}>
                <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-medium transition-spring group-hover:scale-110 group-hover:shadow-glow animate-glow">
                  <feature.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h4 className="text-lg font-semibold mb-3 text-foreground group-hover:text-primary transition-smooth">{feature.title}</h4>
                <p className="text-gray-600 group-hover:text-foreground transition-smooth">{feature.description}</p>
              </div>)}
          </div>
        </div>

        {/* Benefits List */}
        <div className="max-w-3xl mx-auto mb-12 animate-slide-up [animation-delay:0.5s]">
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground">What You Get</h3>
          <div className="bg-gradient-card backdrop-blur-sm rounded-xl p-8 shadow-medium transition-spring hover:shadow-strong">
            <ul className="space-y-4">
              {benefits.map((benefit, index) => <li key={index} className="flex items-start gap-3 group animate-slide-left" style={{
              animationDelay: `${0.6 + index * 0.1}s`
            }}>
                  <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0 transition-spring group-hover:scale-110" />
                  <span className="text-gray-600 text-lg group-hover:text-foreground transition-smooth">{benefit}</span>
                </li>)}
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center animate-slide-up [animation-delay:0.6s]">
          <div className="bg-gradient-primary text-primary-foreground rounded-2xl p-8 max-w-2xl mx-auto shadow-strong transition-spring hover:scale-105 hover:shadow-glow animate-glow">
            <h3 className="text-2xl font-bold mb-4">Ready to Build Long-Term Wealth?</h3>
            <p className="text-lg mb-6 opacity-90">
              Join The Vault Club — automated, disciplined investing designed for the long haul.
            </p>
            <Button onClick={handleJoinClick} size="lg" className="bg-background text-primary hover:bg-secondary px-8 py-3 rounded-full text-lg font-semibold transition-bounce hover:scale-110 shadow-medium hover:shadow-strong">
              Get Priority Access
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
export default VaultClubMain;