import React, { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PreSignup from "@/components/PreSignup";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { FuturisticBackground } from "@/components/FuturisticBackground";
import { 
  Shield, 
  TrendingUp, 
  Users, 
  Target, 
  CheckCircle, 
  ArrowRight,
  Lock,
  Layers,
  Zap,
  Globe,
  Clock,
  Wallet,
  Bitcoin
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Handle navigation with scroll-to-signup state
  useEffect(() => {
    if (location.state?.scrollToSignup) {
      setTimeout(() => {
        document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState({}, document.title);
      }, 300);
    }
  }, [location]);

  // SEO meta tags
  useEffect(() => {
    document.title = "Sequence Theory - Your Money, Your Power. Through The Vault Club";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'The Vault Club - A private, choreographed financial schematic for long-term capital growth through disciplined, automated investing.');
    }
    const keywordsMeta = document.createElement('meta');
    keywordsMeta.name = 'keywords';
    keywordsMeta.content = 'Your Money Your Power, Sequence Theory, Vault Club, long-term investing, financial empowerment, wealth building, automated investing';
    document.head.appendChild(keywordsMeta);
    return () => {
      const existingKeywords = document.querySelector('meta[name="keywords"]');
      if (existingKeywords) document.head.removeChild(existingKeywords);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Futuristic animated background */}
      <FuturisticBackground />
      
      <Navigation />
      
      <div className="pt-16 relative z-10">
        {/* ============================================ */}
        {/* HERO SECTION */}
        {/* ============================================ */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {/* Main headline */}
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                <span className="text-foreground">Your Money,</span>
                <br />
                <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                  Your Power.
                </span>
              </h1>
              
              {/* Subheadline - from whitepaper abstract */}
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                A private, choreographed financial schematic designed for long-term capital growth. 
                Institutional-style investing made accessible through disciplined, automated contracts.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Link to="/learn-more">
                  <Button 
                    size="lg" 
                    className="text-base px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 min-w-[220px]"
                  >
                    Learn About The Vault Club
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/learn-now">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="text-base px-8 py-6 rounded-full border-2 hover:bg-secondary/50 min-w-[220px]"
                  >
                    Start Learning Free
                  </Button>
                </Link>
              </div>
              
              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-6 pt-8 border-t border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Lock className="h-5 w-5 text-primary" />
                  <span className="text-sm">Non-custodial smart contracts</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span className="text-sm">Disciplined, automated growth</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SYSTEM OBJECTIVES SECTION */}
        {/* ============================================ */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              {/* Section header */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">System Objectives</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground">
                  What We're Building
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  The Vault Club addresses growing financial illiteracy and inequality by providing 
                  an accessible wealth-building system that enforces disciplined participation.
                </p>
              </div>
              
              {/* Objectives cards */}
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Zap,
                    title: "Automate Long-Term Growth",
                    description: "Automate long-term DeFi compounding and wBTC accumulation through smart contracts that work while you sleep."
                  },
                  {
                    icon: Shield,
                    title: "Enforce Discipline",
                    description: "Enforce disciplined participation while discouraging inconsistent behavior through structured contract parameters."
                  },
                  {
                    icon: Users,
                    title: "Accessible Wealth-Building",
                    description: "Provide an accessible wealth-building system amid growing financial illiteracy and inequality."
                  }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="group bg-card border border-border/50 rounded-2xl p-8 hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* TWO-PHASE STRATEGY SECTION */}
        {/* ============================================ */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              {/* Section header */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                  <Layers className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Two-Phase Strategy</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground">
                  How The Vault Club Works
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  A disciplined, two-phase strategy that brings institutional-style capital allocation 
                  and compound-interest mechanics to everyday investors.
                </p>
              </div>
              
              {/* Two Phase Cards */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Phase 1 */}
                <div className="bg-gradient-to-br from-card to-muted/50 border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                      <span className="text-xl font-bold text-primary-foreground">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">The Mega Vault</h3>
                      <p className="text-sm text-muted-foreground">Growth Phase</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    All user funds are pooled into the Mega Vault for scale-based efficiency and coordinated reinvestment. 
                    Capital is deployed across three independent investment strands using conservative stable assets.
                  </p>
                  <div className="space-y-3 mt-6">
                    {[
                      "Routed Reinvestment Logic (RRL) creates compounding 'compression'",
                      "Subscription-Backed Borrowing enhances capital efficiency",
                      "Profits harvested and reinvested weekly"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Phase 2 */}
                <div className="bg-gradient-to-br from-card to-muted/50 border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                      <span className="text-xl font-bold text-accent-foreground">2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">wBTC Accumulation</h3>
                      <p className="text-sm text-muted-foreground">Wealth Preservation</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Once growth thresholds are met (50% contract completion OR ~$2M vault value), 
                    the system transitions to wealth preservation, converting accumulated value into wBTC.
                  </p>
                  <div className="space-y-3 mt-6">
                    {[
                      "Weekly Dollar-Cost Averaging into Wrapped Bitcoin",
                      "Target full wBTC allocation by contract completion",
                      "Participants hold wBTC externally with full control"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SUBCLUB STRUCTURE SECTION */}
        {/* ============================================ */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              {/* Section header */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Contract Structure</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground">
                  Subclub Contracts
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  The system is built for 1-8 committed participants who form exclusive contracts 
                  governed by automated, non-custodial smart contracts.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Contract Parameters */}
                <div className="bg-card border border-border/50 rounded-2xl p-8">
                  <h3 className="text-xl font-bold mb-6 text-foreground flex items-center gap-3">
                    <Clock className="h-6 w-6 text-primary" />
                    Contract Parameters
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: "Participants", value: "1-8 members per subclub" },
                      { label: "Lock-up Period", value: "1-20 years" },
                      { label: "Rigor Tiers", value: "Low, Medium, High, & Custom" },
                      { label: "Contract Type", value: "Public or Private" },
                      { label: "Deposits", value: "Custom sizes & frequencies (unanimous agreement)" }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-b border-border/50 last:border-0">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Safeguards */}
                <div className="bg-card border border-border/50 rounded-2xl p-8">
                  <h3 className="text-xl font-bold mb-6 text-foreground flex items-center gap-3">
                    <Shield className="h-6 w-6 text-primary" />
                    Built-in Safeguards
                  </h3>
                  <div className="space-y-4">
                    {[
                      "3 missed deposits = 3% ownership redistribution to active members",
                      "Emergency termination requires unanimous multisig approval",
                      "Contract details editable anytime with unanimous consent",
                      "Emergency withdrawal prioritizes principal protection",
                      "Users can pause or exit group contracts independently"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3 group">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors mt-0.5">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed text-sm">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* NON-CUSTODIAL DESIGN SECTION */}
        {/* ============================================ */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-3xl p-10">
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                      <Wallet className="h-10 w-10 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4 text-foreground">
                      100% Non-Custodial Design
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Wallets are generated client-side. Private keys are never held by Sequence Theory. 
                      Users retain full control at all times. The Vault Club acts as an automated coordinator — not a custodian or bank.
                    </p>
                    <div className="bg-background/50 border-l-4 border-primary rounded-r-xl p-6">
                      <p className="text-foreground font-medium italic">
                        "The goal is not to encourage financial obsession but to replace it with structure."
                      </p>
                    </div>
                    <Link to="/learn-more">
                      <Button className="mt-6 rounded-full">
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* CTA / SIGNUP SECTION */}
        {/* ============================================ */}
        <PreSignup />
        
        <Footer />
      </div>
    </div>
  );
};

export default Index;
