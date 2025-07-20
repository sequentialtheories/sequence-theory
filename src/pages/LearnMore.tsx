import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import VaultClubMain from "@/components/VaultClubMain";
import SupplementalOfferings from "@/components/SupplementalOfferings";
import CompanyMission from "@/components/CompanyMission";
import PreSignup from "@/components/PreSignup";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, ArrowLeft, Shield, TrendingUp, Users, Target, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const LearnMore = () => {
  const features = [{
    icon: Shield,
    title: "Risk Management First",
    description: "All investments start in our secure Mega Vault before gradual wBTC accumulation begins."
  }, {
    icon: TrendingUp,
    title: "Steady Growth Focus",
    description: "Structured contracts designed for consistent wBTC accumulation over time."
  }, {
    icon: Users,
    title: "Educational Community",
    description: "Learn alongside other investors who understand the difference between strategy and speculation."
  }, {
    icon: Target,
    title: "Strategic Approach",
    description: "Investment contracts based on proven financial principles, adapted for digital assets."
  }];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/10 rounded-full blur-lg"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-accent/5 rounded-full blur-2xl"></div>
      </div>

      {/* Header */}
      <header className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground py-12 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
        <div className="container mx-auto px-6 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-all duration-300 hover:translate-x-1 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            The Vault Club: Investment Platform
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-white/50 to-transparent mt-4"></div>
        </div>
      </header>

      <div className="pt-16">
        <Hero />
        <VaultClubMain />
        <SupplementalOfferings />
        <CompanyMission />
        <PreSignup />
        
        {/* View Preview Section */}
        <section className="py-8 bg-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
          <div className="container mx-auto px-6 text-center relative z-10">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
              <a
                href="https://claude.ai/public/artifacts/97b71d10-3256-49a0-82d1-d1b62e6c4543?fullscreen=true"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  variant="outline" 
                  className="inline-flex items-center gap-2 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-bounce hover:scale-105 shadow-soft hover:shadow-medium"
                >
                  View Preview
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
              
              <Link to="/white-paper">
                <Button 
                  variant="outline" 
                  className="inline-flex items-center gap-2 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-bounce hover:scale-105 shadow-soft hover:shadow-medium"
                >
                  Read White Paper
                  <FileText className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>

      {/* The Problem Section */}
      <section className="py-20 relative bg-gradient-to-br from-muted/20 to-secondary/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-destructive/10 rounded-full px-6 py-2 mb-6">
                <Target className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">The Challenge</span>
              </div>
              <h3 className="text-4xl font-bold mb-4 text-foreground">The Compound Interest Problem</h3>
              <div className="w-24 h-1 bg-gradient-to-r from-destructive to-destructive/60 mx-auto mb-8"></div>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Albert Einstein called compound interest the "eighth wonder of the world," yet most people 
                never benefit from it meaningfully. The issue isn't failure—it's friction.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-destructive/10 rounded-2xl transform rotate-1 group-hover:rotate-0 transition-transform duration-300"></div>
                <div className="relative bg-card p-8 rounded-xl border border-destructive/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-destructive/20 to-destructive/30 rounded-2xl flex items-center justify-center mb-6">
                    <Shield className="h-8 w-8 text-destructive" />
                  </div>
                  <h4 className="text-xl font-bold mb-4 text-foreground">Ready Ability</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Reliable access to quality investment vehicles that don't require massive capital or institutional connections.
                  </p>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-destructive/10 rounded-2xl transform -rotate-1 group-hover:rotate-0 transition-transform duration-300"></div>
                <div className="relative bg-card p-8 rounded-xl border border-destructive/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-destructive/20 to-destructive/30 rounded-2xl flex items-center justify-center mb-6">
                    <TrendingUp className="h-8 w-8 text-destructive" />
                  </div>
                  <h4 className="text-xl font-bold mb-4 text-foreground">Discipline</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Consistent, recurring contributions over time without getting distracted by market volatility or speculation.
                  </p>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-destructive/10 rounded-2xl transform rotate-1 group-hover:rotate-0 transition-transform duration-300"></div>
                <div className="relative bg-card p-8 rounded-xl border border-destructive/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-destructive/20 to-destructive/30 rounded-2xl flex items-center justify-center mb-6">
                    <Target className="h-8 w-8 text-destructive" />
                  </div>
                  <h4 className="text-xl font-bold mb-4 text-foreground">Long-Term Horizons</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    The patience to allow growth to compound without succumbing to short-term market pressures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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

            {/* Education & Community Building */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl transform rotate-1 group-hover:rotate-0 transition-transform duration-300"></div>
                <div className="relative bg-card p-8 rounded-xl border border-primary/10 hover:border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <Target className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h4 className="text-xl font-bold mb-4 text-foreground">Educational Overview</h4>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                      <span>Core Learning Modules: Personal Finance, Web3, Education of Education</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2"></div>
                      <span>Structured assessments: Periodic quizzes and cumulative exams</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-accent/5 rounded-2xl transform -rotate-1 group-hover:rotate-0 transition-transform duration-300"></div>
                <div className="relative bg-card p-8 rounded-xl border border-secondary/10 hover:border-secondary/30 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <Users className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h4 className="text-xl font-bold mb-4 text-foreground">Community Building</h4>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2"></div>
                      <span>Active Discord: Peer support, financial accountability, and shared insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2"></div>
                      <span>Collaborative Learning: Social reinforcement and gamified education</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                      <span>Subclubs: Micro-groups inside The Vault Club with shared strategies and goals</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 rounded-2xl transform rotate-1 group-hover:rotate-0 transition-transform duration-300"></div>
                <div className="relative bg-card p-8 rounded-xl border border-accent/10 hover:border-accent/30 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <TrendingUp className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h4 className="text-xl font-bold mb-4 text-foreground">Future Innovation</h4>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2"></div>
                      <span>Tokenization of real-world assets and equities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                      <span>Educational bridges between Web2 finance and Web3 protocols</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2"></div>
                      <span>Cross-market strategies blending DeFi with traditional investing</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-2 mb-6">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Our Approach</span>
            </div>
            <h3 className="text-4xl font-bold mb-4 text-foreground">Our Approach</h3>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl transform rotate-2 group-hover:rotate-0 transition-transform duration-300"></div>
                <div className="relative bg-card p-8 rounded-xl border border-primary/10 hover:border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h4 className="text-xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">{feature.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  <div className="w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Investment Philosophy */}
      <section className="py-20 bg-gradient-to-br from-muted/30 to-secondary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-2 mb-6">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Investment Philosophy</span>
              </div>
              <h3 className="text-4xl font-bold mb-4 text-foreground">Investment Philosophy</h3>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto"></div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl transform -rotate-1"></div>
              <div className="relative bg-card/90 backdrop-blur-sm border border-primary/20 rounded-2xl p-12 shadow-2xl">
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-3 h-3 bg-primary rounded-full mt-3 animate-pulse"></div>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                      Our investment contracts are structured financial instruments designed to accumulate wBTC steadily 
                      while protecting your capital. Unlike speculative crypto trading, these contracts focus on 
                      sustainable growth through proven risk management principles.
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-3 h-3 bg-secondary rounded-full mt-3 animate-pulse" style={{
                    animationDelay: '0.5s'
                  }}></div>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                      Each contract begins with placement in our diversified Mega Vault, providing immediate security 
                      and professional oversight. As market conditions allow, contracts gradually transition to 
                      independent wBTC accumulation strategies.
                    </p>
                  </div>
                  
                  <div className="relative mt-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-destructive/5 to-destructive/10 rounded-xl"></div>
                    <div className="relative bg-destructive/10 border border-destructive/30 rounded-xl p-6 backdrop-blur-sm">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-destructive/20 rounded-full flex items-center justify-center">
                          <Shield className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                          <h5 className="font-bold text-destructive mb-2">Important Security Notice</h5>
                          <p className="text-sm text-destructive leading-relaxed">
                            The Vault Club operates as a hot wallet service similar to exchanges. 
                            Users are advised not to hold large unused amounts on the platform. Consider transferring 
                            significant holdings to hardware wallets after contract completion.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="signup-section" className="py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-secondary/10 rounded-full blur-xl animate-pulse" style={{
        animationDelay: '1s'
      }}></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/20 rounded-full px-6 py-2 mb-8">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Ready to Start?</span>
            </div>
            
            <h3 className="text-5xl font-bold mb-8 text-foreground leading-tight">
              Ready to 
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
                Get Started?
              </span>
            </h3>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Join The Vault Club today and start your journey toward professional-grade digital asset investment.
            </p>
            
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-xl opacity-50"></div>
              <Link to="/learn-now">
                <Button size="lg" className="relative text-xl px-12 py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                  Start Learning Now
                  <TrendingUp className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-8 mt-12 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="text-sm">Secure Platform</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">Growing Community</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span className="text-sm">Professional Grade</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearnMore;