import { Button } from "@/components/ui/button";
import { Shield, TrendingUp, Users, Target, CheckCircle } from "lucide-react";
const VaultClubMain = () => {
  const scrollToSignup = () => {
    document.getElementById('signup')?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  const features = [{
    icon: Shield,
    title: "Risk Management First",
    description: "Capital protection through proven institutional techniques"
  }, {
    icon: TrendingUp,
    title: "Steady Growth Focus",
    description: "Consistent returns over volatile speculation"
  }, {
    icon: Target,
    title: "Automated Strategies",
    description: "Smart contracts handle investment decisions"
  }, {
    icon: Users,
    title: "Group Contracts",
    description: "Small groups with shared commitment levels"
  }];
  const benefits = ["Structured investment contracts for steady growth", "Professional DeFi strategies for individuals", "Automated diversification across established protocols", "Built-in risk management and capital protection"];
  return <section className="py-20 bg-gradient-secondary relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-float-delayed"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Main Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground shadow-soft">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              The Vault Club
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-slide-up [animation-delay:0.2s]">DeFi investment contracts:
 Bringing hedge fund strategies to investors through automated smart contracts.</p>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mb-16 animate-slide-up [animation-delay:0.3s]">
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground">How It Works</h3>
          <div className="bg-gradient-card backdrop-blur-sm rounded-2xl p-8 shadow-medium border border-primary/10 transition-spring hover:shadow-strong">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="animate-slide-left">
                <h4 className="text-lg font-semibold mb-4 text-primary">Automated DeFi Investment System</h4>
                <ul className="list-none space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 animate-pulse-soft"></div>
                    <span className="text-muted-foreground">Deposits auto-allocated across established DeFi protocols like AAVE and Quickswap</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 animate-pulse-soft [animation-delay:0.5s]"></div>
                    <span className="text-muted-foreground">Profits harvested and reinvested on regular schedules</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 animate-pulse-soft [animation-delay:1s]"></div>
                    <span className="text-muted-foreground">System transitions through growth phases to Bitcoin accumulation for wealth preservation</span>
                  </li>
                </ul>
              </div>
              <div className="animate-slide-right">
                <h4 className="text-lg font-semibold mb-4 text-accent">Group-Based Contracts</h4>
                <ul className="list-none space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 animate-pulse-soft"></div>
                    <span className="text-muted-foreground">Small groups (4-8 people) with shared investment contracts and commitment levels</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 animate-pulse-soft [animation-delay:0.5s]"></div>
                    <span className="text-muted-foreground">Weekly or monthly deposit schedules with lock-up periods matching your goals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 animate-pulse-soft [animation-delay:1s]"></div>
                    <span className="text-muted-foreground">Blockchain-transparent operations with emergency withdrawal and multi-signature security</span>
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
                <p className="text-muted-foreground group-hover:text-foreground transition-smooth">{feature.description}</p>
              </div>)}
          </div>
        </div>

        {/* Benefits List */}
        <div className="max-w-3xl mx-auto mb-12 animate-slide-up [animation-delay:0.5s]">
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground">What You Get</h3>
          <div className="bg-gradient-card backdrop-blur-sm border border-primary/10 rounded-xl p-8 shadow-medium transition-spring hover:shadow-strong">
            <ul className="space-y-4">
              {benefits.map((benefit, index) => <li key={index} className="flex items-start gap-3 group animate-slide-left" style={{
              animationDelay: `${0.6 + index * 0.1}s`
            }}>
                  <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0 transition-spring group-hover:scale-110" />
                  <span className="text-muted-foreground text-lg group-hover:text-foreground transition-smooth">{benefit}</span>
                </li>)}
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center animate-slide-up [animation-delay:0.6s]">
          <div className="bg-gradient-primary text-primary-foreground rounded-2xl p-8 max-w-2xl mx-auto shadow-strong transition-spring hover:scale-105 hover:shadow-glow animate-glow">
            <h3 className="text-2xl font-bold mb-4">Ready to Build Wealth?</h3>
            <p className="text-lg mb-6 opacity-90">
              Join The Vault Club and let automated DeFi work for you.
            </p>
            <Button onClick={scrollToSignup} size="lg" className="bg-background text-primary hover:bg-secondary px-8 py-3 rounded-full text-lg font-semibold transition-bounce hover:scale-110 shadow-medium hover:shadow-strong">
              Get Priority Access
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
export default VaultClubMain;