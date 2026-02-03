
import { Target, Lightbulb, Globe } from "lucide-react";

const CompanyMission = () => {
  const missionPoints = [
    {
      icon: Target,
      title: "Our Core Mission",
      description: "Bridge the gap between decentralized finance and long-term retail wealth building through consumer-first design."
    },
    {
      icon: Lightbulb,
      title: "Our Approach",
      description: "Transform 'managerial effort' into 'deterministic code' — Web2 feel with Web3 infrastructure, 100% non-custodial."
    },
    {
      icon: Globe,
      title: "Our Vision",
      description: "Become the industry standard of consumer-first DeFi, making non-custodial technology frictionless for everyday investors."
    }
  ];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 left-0 w-60 h-60 bg-accent/5 rounded-full blur-3xl animate-float-delayed"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl font-bold mb-6 text-foreground">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              About Sequence Theory
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-up [animation-delay:0.2s]">
            TVC acts as an automated coordinator — not a custodian or bank. You retain 100% non-custodial ownership. Your Money. Your Power.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {missionPoints.map((point, index) => (
            <div key={index} className="text-center group animate-slide-up" style={{ animationDelay: `${0.3 + index * 0.2}s` }}>
              <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-medium transition-spring group-hover:scale-110 group-hover:shadow-glow animate-glow">
                <point.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground group-hover:text-primary transition-smooth">{point.title}</h3>
              <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-smooth">{point.description}</p>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto animate-slide-up [animation-delay:0.5s]">
          <div className="bg-gradient-card backdrop-blur-sm rounded-2xl p-8 border border-primary/10 shadow-medium hover:shadow-strong transition-spring">
            <h3 className="text-2xl font-semibold mb-6 text-foreground text-center">
              Why We Built TVC
            </h3>
            
            <div className="space-y-6 text-muted-foreground">
              <p className="text-lg leading-relaxed animate-slide-left">
                TVC is the "subscription to your future." It is not a tool for speculation — it is a tool for structured discipline. 
                Users don't "trade"; they select Risk & Rigor levels. Once deployed, contract logic is deterministic and immutable, 
                governed by unanimous consent of participants.
              </p>
              
              <p className="text-lg leading-relaxed animate-slide-right [animation-delay:0.7s]">
                Our Web2-Soul, Web3-Body architecture provides frictionless onboarding. Users sign in with Email/Passkey 
                while private keys remain 100% in their control — generated client-side, never accessible to Sequence Theory.
                This is how we make non-custodial technology frictionless.
              </p>
              
              <p className="text-lg leading-relaxed animate-slide-left [animation-delay:0.9s]">
                Risk management through established DeFi protocols: Conservative (Aave V3 stablecoin lending), 
                Medium (sUSDC savings rates), and Risky (Morpho institutional-grade vaults). 
                Simple, transparent pricing at $1.50/user/week — no hidden fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyMission;
