import React, { useEffect, useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PreSignup from "@/components/PreSignup";
import { FinancialStatsExpander } from "@/components/FinancialStatsExpander";
import { IndicesPreview } from "@/components/IndicesPreview";
import { FAQPreview } from "@/components/FAQPreview";
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
  BarChart3,
  HelpCircle,
  BookOpen
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

// Scroll-triggered CTA component
const ScrollCTA: React.FC<{
  sectionRef: React.RefObject<HTMLElement>;
  label: string;
  to: string;
  icon: React.ReactNode;
  delay?: number;
}> = ({ sectionRef, label, to, icon, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [sectionRef, delay]);

  return (
    <div 
      className={`transition-all duration-700 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
      }`}
    >
      <Link to={to}>
        <Button 
          variant="outline" 
          className="rounded-full group hover:bg-primary hover:text-primary-foreground transition-all duration-300"
        >
          {icon}
          <span className="ml-2">{label}</span>
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </div>
  );
};

const Index = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Section refs for scroll-based CTAs
  const problemSectionRef = useRef<HTMLElement>(null);
  const solutionSectionRef = useRef<HTMLElement>(null);
  const missionSectionRef = useRef<HTMLElement>(null);
  const indicesSectionRef = useRef<HTMLElement>(null);
  const faqSectionRef = useRef<HTMLElement>(null);

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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Futuristic animated background */}
      <FuturisticBackground />
      
      <Navigation />
      
      <div className="pt-16 relative z-10">
        {/* ============================================ */}
        {/* HERO SECTION */}
        {/* ============================================ */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          {/* Very subtle gradient - mostly transparent to show background */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/30" />
          
          {/* Refined grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }} />
          
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
              
              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                A private, choreographed financial schematic for long-term capital growth. 
                Disciplined, automated contracts that work while you focus on life.
              </p>
              
              {/* CTA Buttons - UNCHANGED */}
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
                  <span className="text-sm">Set & Forget</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span className="text-sm">Automated compounding</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* PROBLEM SECTION */}
        {/* ============================================ */}
        <section ref={problemSectionRef} className="py-24 relative">
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
              
              {/* Problem cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
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
                    className="group bg-card/60 backdrop-blur-sm rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-14 h-14 bg-destructive/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-destructive/20 transition-colors">
                      <item.icon className="h-7 w-7 text-destructive" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
              
              {/* Scroll CTA - Learn More */}
              <div className="text-center">
                <ScrollCTA 
                  sectionRef={problemSectionRef}
                  label="Deep Dive: Learn More"
                  to="/learn-more"
                  icon={<BookOpen className="h-4 w-4" />}
                  delay={500}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* THE LEAP ISSUE SECTION */}
        {/* ============================================ */}
        <section ref={solutionSectionRef} className="py-24 relative">
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
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* Pain Points */}
                <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-8">
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
                <div className="bg-primary/5 backdrop-blur-sm rounded-2xl p-8">
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
              
              {/* Scroll CTA - Learn Now */}
              <div className="text-center">
                <ScrollCTA 
                  sectionRef={solutionSectionRef}
                  label="Start Your Education"
                  to="/learn-now"
                  icon={<BookOpen className="h-4 w-4" />}
                  delay={500}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* MISSION SECTION */}
        {/* ============================================ */}
        <section ref={missionSectionRef} className="py-24 relative">
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
        {/* FRAMEWORK SECTION */}
        {/* ============================================ */}
        <section className="py-24 relative">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              {/* Section header */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                  <Layers className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Our Solution</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground">
                  The Vault Club
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  A structured, automated investment system designed for long-term wealth building
                </p>
              </div>
              
              {/* Solution card */}
              <div className="bg-card/60 backdrop-blur-sm rounded-3xl p-10 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                      <Shield className="h-10 w-10 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-6 text-foreground">
                      Set It & Forget It
                    </h3>
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <p>
                        Join a small group of like-minded investors with shared goals. Choose your 
                        commitment level — from 1 to 20 years — and let the system handle the rest.
                        No daily decisions. No market timing. Just consistent, disciplined growth.
                      </p>
                      <div className="bg-primary/5 border-l-4 border-primary rounded-r-xl p-6 my-6">
                        <p>
                          <strong>Your journey:</strong> Make regular contributions, watch your wealth grow through 
                          automated compounding, and transition to wealth preservation as you approach your goals.
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
        <section className="py-24 relative">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              {/* Section header */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
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
                <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-8">
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
                        The goal is not to encourage financial obsession but to replace it with structure. 
                        Set & Forget — automated investing that works for you.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Features Card */}
                <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-8">
                  <h3 className="text-xl font-bold mb-6 text-foreground">
                    What Makes Us Different
                  </h3>
                  <div className="space-y-4">
                    {[
                      "Automated compounding — your money grows without constant attention",
                      "Structured discipline — built-in commitment keeps you on track",
                      "Wealth preservation — automatic transition to safer assets over time",
                      "Community support — invest alongside others with shared goals"
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
        {/* INDICES PREVIEW SECTION */}
        {/* ============================================ */}
        <section ref={indicesSectionRef} className="py-24 relative">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              {/* Section header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 rounded-full px-4 py-2 mb-6">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-blue-500">Market Indices</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground">
                  Digital Asset Indices
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Track the performance of key market segments with our proprietary indices
                </p>
              </div>
              
              {/* Indices Preview */}
              <IndicesPreview />
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* FAQ PREVIEW SECTION */}
        {/* ============================================ */}
        <section ref={faqSectionRef} className="py-24 relative">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              {/* Section header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-amber-500/10 rounded-full px-4 py-2 mb-6">
                  <HelpCircle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium text-amber-500">Common Questions</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                  Frequently Asked Questions
                </h2>
                <p className="text-muted-foreground">
                  Quick answers to help you understand The Vault Club
                </p>
              </div>
              
              {/* FAQ Preview */}
              <FAQPreview />
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
