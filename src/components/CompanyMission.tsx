
import { Target, Lightbulb, Globe } from "lucide-react";

const CompanyMission = () => {
  const missionPoints = [
    {
      icon: Target,
      title: "Our Core Mission",
      description: "Democratize sophisticated investment strategies previously exclusive to institutions."
    },
    {
      icon: Lightbulb,
      title: "Our Approach",
      description: "Combine quantitative finance with blockchain innovation for automated investment opportunities."
    },
    {
      icon: Globe,
      title: "Our Vision",
      description: "Make professional investing accessible through convergence of traditional and blockchain finance."
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
            Bridging institutional investment strategies and individual investors through DeFi technology.
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
                Sophisticated investment strategies shouldn't be gatekept by traditional finance. 
                Using smart contracts and DeFi protocols, we've created a system with hedge fund precision 
                while remaining transparent and accessible.
              </p>
              
              <p className="text-lg leading-relaxed animate-slide-right [animation-delay:0.7s]">
                Our platform focuses on steady growth and risk management over speculation. 
                Through automated diversification across AAVE and Quickswap, 
                The Vault Club provides institutional-quality management for individuals.
              </p>
              
              <p className="text-lg leading-relaxed animate-slide-left [animation-delay:0.9s]">
                We're exploring integration of traditional assets with blockchain technology, 
                bridging established markets and emerging DeFi. 
                Our goal: equitable, transparent financial tools for everyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyMission;
