import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PreSignup from "@/components/PreSignup";
import { FinancialStatsExpander } from "@/components/FinancialStatsExpander";

import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Shield, TrendingUp, Users, Target, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
const Index = () => {
  const {
    user
  } = useAuth();

  // Add document title and meta description for better SEO
  React.useEffect(() => {
    document.title = "Sequence Theory - Democratizing Financial Empowerment Through The Vault Club";

    // Add additional meta tags dynamically
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Join The Vault Club by Sequence Theory for accessible financial education and communal cryptocurrency investments. Build wealth through structured investing without traditional barriers.');
    }

    // Add keywords meta tag
    const keywordsMeta = document.createElement('meta');
    keywordsMeta.name = 'keywords';
    keywordsMeta.content = 'Sequence Theory, Vault Club, cryptocurrency investing, financial education, wealth building, community investing, digital assets, blockchain, financial literacy, DeFi, compound interest';
    document.head.appendChild(keywordsMeta);

    // Add author meta tag
    const authorMeta = document.createElement('meta');
    authorMeta.name = 'author';
    authorMeta.content = 'Sequence Theory, Inc.';
    document.head.appendChild(authorMeta);
    return () => {
      // Cleanup
      const existingKeywords = document.querySelector('meta[name="keywords"]');
      const existingAuthor = document.querySelector('meta[name="author"]');
      if (existingKeywords) document.head.removeChild(existingKeywords);
      if (existingAuthor) document.head.removeChild(existingAuthor);
    };
  }, []);
  const scrollToSignup = () => {
    const element = document.getElementById('signup-section');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />
      
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/10 rounded-full blur-lg"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-accent/5 rounded-full blur-2xl"></div>
      </div>

      <div className="pt-16 relative z-[1]">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 relative" itemScope itemType="https://schema.org/Organization">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-6 text-center relative z-10">
            <header>
              <h1 className="text-3xl sm:text-4xl md:text-6xl mobile-text-2xl font-bold mb-6 sm:mb-8 text-foreground leading-tight" itemProp="name">
                Sequence Theory, Inc.
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block text-lg sm:text-2xl md:text-3xl mobile-text-lg" itemProp="slogan">
                  Democratizing Financial Empowerment
                </span>
              </h1>
            </header>
            <p className="text-lg sm:text-xl mobile-text-base text-muted-foreground max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4" itemProp="description">Our mission is to provide accessible financial tools and services that empower everyday users to build wealth through communal cryptocurrency investments and educational opportunities.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/learn-more">
                <Button size="lg" className="text-lg px-10 py-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                  Learn About The Vault Club
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
          {/* Floating elements */}
          <div className="absolute top-20 left-20 animate-float">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl rotate-12"></div>
          </div>
          <div className="absolute bottom-20 right-20 animate-float-delayed">
            <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl -rotate-12"></div>
          </div>
        </section>



        {/* The Problem Section */}
        <section className="py-20 relative bg-gradient-to-br from-muted/20 to-secondary/10" itemScope itemType="https://schema.org/Article">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-6xl mx-auto">
              <header className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-destructive/10 rounded-full px-6 py-2 mb-6">
                  <Target className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">The Challenge</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl mobile-text-xl font-bold mb-4 text-foreground" itemProp="headline">The Compound Interest Problem</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-destructive to-destructive/60 mx-auto mb-8"></div>
                <p className="text-lg sm:text-xl mobile-text-base text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4" itemProp="description">
                  Albert Einstein called compound interest the "eighth wonder of the world," yet most people 
                  never benefit from it meaningfully. The issue isn't failure, it's friction maintaining these core principles.
                </p>
              </header>
              
              <article className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="relative group" itemScope itemType="https://schema.org/Article">
                  <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-destructive/10 rounded-2xl transform rotate-1 group-hover:rotate-0 transition-transform duration-300"></div>
                  <div className="relative bg-card p-8 rounded-xl border border-destructive/20 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-destructive/20 to-destructive/30 rounded-2xl flex items-center justify-center mb-6">
                      <Shield className="h-8 w-8 text-destructive" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-foreground" itemProp="headline">Ready Ability</h3>
                    <p className="text-muted-foreground leading-relaxed" itemProp="description">
                      Reliable access to quality investment vehicles that don't require massive capital or institutional connections.
                    </p>
                  </div>
                </div>
                
                <div className="relative group" itemScope itemType="https://schema.org/Article">
                  <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-destructive/10 rounded-2xl transform -rotate-1 group-hover:rotate-0 transition-transform duration-300"></div>
                  <div className="relative bg-card p-8 rounded-xl border border-destructive/20 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-destructive/20 to-destructive/30 rounded-2xl flex items-center justify-center mb-6">
                      <TrendingUp className="h-8 w-8 text-destructive" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-foreground" itemProp="headline">Discipline</h3>
                    <p className="text-muted-foreground leading-relaxed" itemProp="description">
                      Consistent, recurring contributions over time without getting distracted by market volatility or speculation.
                    </p>
                  </div>
                </div>
                
                <div className="relative group" itemScope itemType="https://schema.org/Article">
                  <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-destructive/10 rounded-2xl transform rotate-1 group-hover:rotate-0 transition-transform duration-300"></div>
                  <div className="relative bg-card p-8 rounded-xl border border-destructive/20 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-destructive/20 to-destructive/30 rounded-2xl flex items-center justify-center mb-6">
                      <Target className="h-8 w-8 text-destructive" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-foreground" itemProp="headline">Long-Term Horizons</h3>
                    <p className="text-muted-foreground leading-relaxed" itemProp="description">
                      The patience to allow growth to compound without succumbing to short-term market pressures.
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <main className="py-20 bg-gradient-to-br from-secondary/5 to-primary/5 relative overflow-hidden" itemScope itemType="https://schema.org/Service">
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-6xl mx-auto">
              <header className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-2 mb-6">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Our Core Philosophy</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-muted-foreground">Who We Are</h3>
                <h2 className="text-4xl font-bold mb-4 text-foreground" itemProp="name">Building Financial Literacy & Inclusion</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-8"></div>
                <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed" itemProp="description">
                  Sequence Theory is not just a financial product, it's a framework for building lasting financial 
                  literacy and inclusion across digital and traditional markets. Our primary audience is financially 
                  underserved individuals new to crypto or investing, overwhelmed by exchanges and speculation.
                </p>
               </header>
               
               {/* Financial Statistics Expander Section */}
               <FinancialStatsExpander />
               
               <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
                <div className="space-y-8">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl blur-xl"></div>
                    
                  </div>
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-2xl blur-xl"></div>
                    
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl transform rotate-3"></div>
                  
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* What We Do */}
        <section className="py-20 relative">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-2 mb-6">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Our Solution</span>
                </div>
                <h3 className="text-4xl font-bold mb-4 text-foreground">How The Vault Club Solves This</h3>
                <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto"></div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl transform rotate-1"></div>
                <div className="relative bg-card border border-primary/10 rounded-2xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                        <Shield className="h-8 w-8 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
                        Structured Investment Contracts
                        <div className="w-12 h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
                      </h4>
                      <div className="space-y-4">
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          When you join The Vault Club, you enter a subclub that has its own structured investment contract. 
                          These contracts are created at the start to set fixed parameters such as member amount, rigor, and length.
                          All participants are immediately placed in our secure Mega Vault, which provides instant diversification 
                          and professional-grade risk management.
                        </p>
                        <div className="border-l-4 border-primary/30 pl-6 py-2 bg-primary/5 rounded-r-lg">
                          <p className="text-lg text-muted-foreground leading-relaxed">
                            Over time, contracts gradually exit the Mega Vault to independently accumulate wBTC through strategic market timing. 
                            At contract completion, you have full control over your accumulated wBTC - hold it, liquidate it, or transfer it as you choose.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-gradient-to-br from-secondary/5 to-primary/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-2 mb-6">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Sequence Theory's Broader Mission</span>
                </div>
                <h3 className="text-4xl font-bold mb-4 text-foreground">Building Financial Literacy & Inclusion</h3>
                <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-8"></div>
                <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                  Sequence Theory is not just a financial product, it's a framework for building lasting financial 
                  literacy and inclusion across digital and traditional markets. Our primary audience is financially 
                  underserved individuals new to crypto or investing, overwhelmed by exchanges and speculation.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
                <div className="space-y-8">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl blur-xl"></div>
                    <div className="relative bg-card/80 backdrop-blur-sm p-8 rounded-2xl border border-primary/20">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-primary">Our Core Philosophy</span>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary/60 rounded-full mt-2"></div>
                          <div>
                            <p className="font-semibold text-foreground">MISSION:</p>
                            <p className="text-muted-foreground">Democratize Financial Empowerment</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-secondary/60 rounded-full mt-2"></div>
                          <div>
                            <p className="font-semibold text-foreground">METHOD:</p>
                            <p className="text-muted-foreground">Community-based Investment and Education</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-2xl blur-xl"></div>
                    <div className="relative bg-card/80 backdrop-blur-sm p-8 rounded-2xl border border-secondary/20">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" style={{
                        animationDelay: '0.5s'
                      }}></div>
                        <span className="text-sm font-medium text-secondary">Our Audience</span>
                      </div>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        In our world, poverty isn't systemic — it's optional. We provide structured investing, 
                        financial education, and a social ecosystem to make wealth building accessible. 
                        Our secondary audience is anyone seeking disciplined, long-term exposure to crypto 
                        without the chaos of trading or DeFi management.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl transform rotate-3"></div>
                  <div className="relative bg-card border border-primary/20 p-10 rounded-2xl shadow-2xl">
                    <h4 className="text-2xl font-bold mb-8 text-foreground flex items-center gap-3">
                      Key Features of The Vault Club
                      <div className="w-12 h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
                    </h4>
                    <ul className="space-y-5">
                      <li className="flex items-start gap-4 group">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200 leading-relaxed">
                          Quantitative strategies modeled after hedge funds via Routed Reinvestment Logic
                        </span>
                      </li>
                      <li className="flex items-start gap-4 group">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200 leading-relaxed">
                          Built-in wrapped Bitcoin accumulation for long-term retention
                        </span>
                      </li>
                      <li className="flex items-start gap-4 group">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200 leading-relaxed">
                          Multi-strand reinvestment across risk tiers
                        </span>
                      </li>
                      <li className="flex items-start gap-4 group">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200 leading-relaxed">
                          User-controlled parameters with minimal active management
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Join The Vault Club Section */}
        <PreSignup />
        
        <Footer />
      </div>
    </div>;
};
export default Index;