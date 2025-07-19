import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, TrendingUp, Users, Target, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const LearnMore = () => {
  const scrollToSignup = () => {
    const element = document.getElementById('signup-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const benefits = [
    "Access to institutional-grade investment strategies",
    "Structured contracts with wBTC accumulation focus",
    "Initial placement in diversified Mega Vault for security",
    "Risk management protocols to protect your capital",
    "Community of serious investors focused on steady growth"
  ];

  const features = [
    {
      icon: Shield,
      title: "Risk Management First",
      description: "All investments start in our secure Mega Vault before gradual wBTC accumulation begins."
    },
    {
      icon: TrendingUp,
      title: "Steady Growth Focus",
      description: "Structured contracts designed for consistent wBTC accumulation over time."
    },
    {
      icon: Users,
      title: "Educational Community",
      description: "Learn alongside other investors who understand the difference between strategy and speculation."
    },
    {
      icon: Target,
      title: "Strategic Approach",
      description: "Investment contracts based on proven financial principles, adapted for digital assets."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-6">
        <div className="container mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold">Learn More About The Vault Club</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Professional Investment Strategies for Everyone
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            The Vault Club brings institutional-quality investment approaches to individual investors, 
            focusing on steady wBTC accumulation and risk management.
          </p>
          <Button 
            onClick={scrollToSignup}
            size="lg" 
            className="text-lg px-8 py-3"
          >
            Get Started Today
          </Button>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-8 text-center text-foreground">How The Vault Club Works</h3>
            <div className="space-y-8">
              <div className="bg-card border rounded-xl p-8">
                <h4 className="text-xl font-semibold mb-4 text-foreground">Structured Investment Contracts</h4>
                <p className="text-muted-foreground mb-4">
                  When you join The Vault Club, you enter a structured investment contract that represents multiple subclubs. 
                  All participants are immediately placed in our secure Mega Vault, which provides instant diversification 
                  and professional-grade risk management.
                </p>
                <p className="text-muted-foreground">
                  Over time, contracts gradually exit the Mega Vault to independently accumulate wBTC through strategic market timing. 
                  At contract completion, you have full control over your accumulated wBTC - hold it, liquidate it, or transfer it as you choose.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-8 text-center text-foreground">Our Mission</h3>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-muted-foreground mb-6">
                  We believe that sophisticated investment strategies shouldn't be exclusive to large institutions. 
                  The Vault Club democratizes access to professional-grade investment approaches, making them 
                  accessible to individual investors who are ready to move beyond speculation.
                </p>
                <p className="text-lg text-muted-foreground">
                  Our platform combines the precision of quantitative finance with wBTC accumulation strategies, 
                  creating structured investment opportunities that prioritize steady growth over volatile speculation.
                </p>
              </div>
              <div className="bg-card p-8 rounded-2xl border">
                <h4 className="text-xl font-semibold mb-4 text-foreground">Why We're Different</h4>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold mb-12 text-center text-foreground">Our Approach</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-card p-6 rounded-xl border hover:shadow-md transition-shadow">
                <div className="bg-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h4 className="text-lg font-semibold mb-3 text-foreground">{feature.title}</h4>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Philosophy */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-8 text-center text-foreground">Investment Philosophy</h3>
            <div className="bg-card border rounded-xl p-8">
              <p className="text-muted-foreground mb-6">
                Our investment contracts are structured financial instruments designed to accumulate wBTC steadily 
                while protecting your capital. Unlike speculative crypto trading, these contracts focus on 
                sustainable growth through proven risk management principles.
              </p>
              <p className="text-muted-foreground mb-6">
                Each contract begins with placement in our diversified Mega Vault, providing immediate security 
                and professional oversight. As market conditions allow, contracts gradually transition to 
                independent wBTC accumulation strategies.
              </p>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm text-destructive font-medium">
                  <strong>Important:</strong> The Vault Club operates as a hot wallet service similar to exchanges. 
                  Users are advised not to hold large unused amounts on the platform. Consider transferring 
                  significant holdings to hardware wallets after contract completion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="signup-section" className="py-16 bg-primary/10">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-6 text-foreground">Ready to Get Started?</h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join The Vault Club today and start your journey toward professional-grade digital asset investment.
          </p>
          <Link to="/learn-now">
            <Button size="lg" className="text-lg px-8 py-3">
              Start Learning Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LearnMore;