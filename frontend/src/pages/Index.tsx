import React, { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PreSignup from "@/components/PreSignup";
import { FinancialStatsExpander } from "@/components/FinancialStatsExpander";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  TrendingUp, 
  Users, 
  Target, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Lock,
  Layers,
  Zap,
  BarChart3,
  Globe
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

// Animated counter component for live metrics
const AnimatedCounter = ({ end, duration = 2000, prefix = "", suffix = "" }: { 
  end: number; 
  duration?: number; 
  prefix?: string; 
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);
  
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

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
      metaDescription.setAttribute('content', 'Your Money, Your Power. Join The Vault Club by Sequence Theory for accessible financial education and communal cryptocurrency investments.');
    }
    const keywordsMeta = document.createElement('meta');
    keywordsMeta.name = 'keywords';
    keywordsMeta.content = 'Your Money Your Power, Sequence Theory, Vault Club, cryptocurrency investing, financial empowerment, wealth building';
    document.head.appendChild(keywordsMeta);
    return () => {
      const existingKeywords = document.querySelector('meta[name="keywords"]');
      if (existingKeywords) document.head.removeChild(existingKeywords);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-16">
        {/* ============================================ */}
        {/* HERO SECTION - Clean, Trust-Forward Design */}
        {/* ============================================ */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background" />
          
          {/* Refined grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }} />
          
          {/* Floating accent elements */}
          <div className="absolute top-1/4 left-[10%] w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-1/4 right-[10%] w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {/* Trust badge */}
              <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-2 mb-8">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-muted-foreground">Trusted by 1,000+ early members</span>
              </div>
              
              {/* Main headline */}
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                <span className="text-foreground">Your Money,</span>
                <br />
                <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                  Your Power.
                </span>
              </h1>
              
              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                Build lasting wealth through structured cryptocurrency investments. 
                No trading required. No crypto jargon. Just disciplined growth.
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
              
              {/* Live metrics ticker */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-border/50">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">
                    <AnimatedCounter end={1247} suffix="+" />
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">
                    <AnimatedCounter end={42} prefix="$" suffix="M+" />
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Assets Managed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">
                    <AnimatedCounter end={98} suffix="%" />
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* PROBLEM SECTION - Why Sequence Matters */}
        {/* ============================================ */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              {/* Section header */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-destructive/10 rounded-full px-4 py-2 mb-6">
                  <Target className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">The Challenge</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground">
                  The Compound Interest Problem
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Albert Einstein called compound interest the "eighth wonder of the world," yet most people 
                  never benefit from it meaningfully. The issue isn't failure — it's friction.
                </p>
              </div>
              
              {/* Problem cards - horizontal layout */}
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Shield,
                    title: "Ready Ability",
                    description: "Reliable access to quality investment vehicles that don't require massive capital or institutional connections."
                  },
                  {
                    icon: TrendingUp,
                    title: "Discipline",
                    description: "Consistent, recurring contributions over time without getting distracted by market volatility or speculation."
                  },
                  {
                    icon: Target,
                    title: "Long-Term Horizons",
                    description: "The patience to allow growth to compound without succumbing to short-term market pressures."
                  }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="group bg-card border border-border/50 rounded-2xl p-8 hover:border-destructive/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-14 h-14 bg-destructive/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-destructive/20 transition-colors">
                      <item.icon className="h-7 w-7 text-destructive" />
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
        {/* THE LEAP ISSUE SECTION */}
        {/* ============================================ */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              {/* Section header */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-accent/10 rounded-full px-4 py-2 mb-6">
                  <Zap className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-accent">The Barrier</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground">
                  The Leap Issue
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  In crypto, too much autonomy is required. Navigating wallets, exchanges, and DeFi jargon 
                  leaves users feeling that entering crypto is "too much of a leap."
                </p>
              </div>
              
              {/* Two-column comparison */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Pain Points */}
                <div className="bg-muted/30 border border-border/50 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                      <Target className="h-5 w-5 text-destructive" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Common Pain Points</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      "Navigating complex web3 wallets and security requirements",
                      "Overwhelming exchanges with thousands of tokens",
                      "Dense DeFi jargon and technical complexity",
                      "Constant market speculation and FOMO pressure"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2.5 flex-shrink-0" />
                        <p className="text-muted-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Solution */}
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Our Solution</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      "Spoon-feeding users with structured investing",
                      "Controlled risk exposure through automation",
                      "Completely automated contracts remove complexity",
                      "Focus on education and gradual market entry"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 flex-shrink-0" />
                        <p className="text-muted-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* MISSION SECTION - Who We Are */}
        {/* ============================================ */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Our Mission</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground">
                  Who We Are
                </h2>
              </div>
              
              {/* Financial Stats */}
              <FinancialStatsExpander />
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* FRAMEWORK SECTION - Modular Cards */}
        {/* ============================================ */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              {/* Section header */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                  <Layers className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Our Solution</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground">
                  How The Vault Club Works
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Structured investment contracts designed for long-term wealth building
                </p>
              </div>
              
              {/* Solution card */}
              <div className="bg-gradient-to-br from-card to-muted/50 border border-border rounded-3xl p-10 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                      <Shield className="h-10 w-10 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-6 text-foreground">
                      Structured Investment Contracts
                    </h3>
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <p>
                        When you join The Vault Club, you enter a subclub with its own structured investment contract. 
                        These contracts set fixed parameters such as member amount, rigor, and length.
                        All participants are immediately placed in our secure Mega Vault, providing instant diversification 
                        and professional-grade risk management.
                      </p>
                      <div className="bg-primary/5 border-l-4 border-primary rounded-r-xl p-6 my-6">
                        <p>
                          Over time, contracts gradually exit the Mega Vault to independently accumulate wBTC through strategic market timing. 
                          At contract completion, you have full control over your accumulated wBTC.
                        </p>
                      </div>
                    </div>
                    <Link to="/learn-more">
                      <Button className="mt-4 rounded-full">
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
        {/* BROADER MISSION SECTION */}
        {/* ============================================ */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              {/* Section header */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                  <Globe className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Broader Mission</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground">
                  Building Financial Literacy & Inclusion
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Sequence Theory is not just a financial product — it's a framework for building lasting financial 
                  literacy and inclusion across digital and traditional markets.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Philosophy Card */}
                <div className="bg-card border border-border/50 rounded-2xl p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-primary">Our Core Philosophy</span>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <p className="font-semibold text-foreground mb-1">MISSION:</p>
                      <p className="text-muted-foreground">Democratize Financial Empowerment</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">METHOD:</p>
                      <p className="text-muted-foreground">Community-based Investment and Education</p>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <p className="text-muted-foreground leading-relaxed">
                        In our world, poverty isn't systemic — it's optional. We provide structured investing, 
                        financial education, and a social ecosystem to make wealth building accessible.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Features Card */}
                <div className="bg-card border border-border/50 rounded-2xl p-8">
                  <h3 className="text-xl font-bold mb-6 text-foreground">
                    Key Features of The Vault Club
                  </h3>
                  <div className="space-y-4">
                    {[
                      "Quantitative strategies modeled after hedge funds via Routed Reinvestment Logic",
                      "Built-in wrapped Bitcoin accumulation for long-term retention",
                      "Multi-strand reinvestment across risk tiers",
                      "User-controlled parameters with minimal active management"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start gap-4 group">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                          {feature}
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
        {/* CTA / SIGNUP SECTION */}
        {/* ============================================ */}
        <PreSignup />
        
        <Footer />
      </div>
    </div>
  );
};

export default Index;
