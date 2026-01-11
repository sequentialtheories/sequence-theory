
import { Target, Lightbulb, Globe } from "lucide-react";

const CompanyMission = () => {
  const missionPoints = [
    {
      icon: Target,
      title: "Our Core Mission",
      description: "Democratize financial empowerment through community-based investment and education."
    },
    {
      icon: Lightbulb,
      title: "Our Approach",
      description: "Automate long-term compounding and wBTC accumulation through disciplined, non-custodial smart contracts."
    },
    {
      icon: Globe,
      title: "Our Vision",
      description: "Address growing financial illiteracy and inequality with an accessible wealth-building system."
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
            The Vault Club acts as an automated coordinator — not a custodian or bank. You retain full control.
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
              Why We Built The Vault Club
            </h3>
            
            <div className="space-y-6 text-muted-foreground">
              <p className="text-lg leading-relaxed animate-slide-left">
                The goal is not to encourage financial obsession but to replace it with structure. 
                Through automated smart contracts, we've created a system that enforces disciplined participation 
                while remaining 100% non-custodial — your keys, your control.
              </p>
              
              <p className="text-lg leading-relaxed animate-slide-right [animation-delay:0.7s]">
                Our two-phase strategy starts with the Mega Vault for growth and compounding, 
                then transitions to wBTC accumulation for wealth preservation. 
                Capital is deployed across three strands: Spark, Aave, and QuickSwap protocols.
              </p>
              
              <p className="text-lg leading-relaxed animate-slide-left [animation-delay:0.9s]">
                Built-in safeguards protect all participants: missed deposit redistribution, 
                emergency withdrawal options, and multisig security. 
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
