import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PreSignup from "@/components/PreSignup";
import { FuturisticBackground } from "@/components/FuturisticBackground";
import { Button } from "@/components/ui/button";
import { 
  ArrowDown, 
  ArrowRight,
  Shield, 
  TrendingUp, 
  Target, 
  Users,
  Layers,
  CheckCircle,
  Clock,
  Wallet,
  Zap,
  Bitcoin,
  DollarSign,
  BarChart3,
  Lock,
  RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";

const LearnMore = () => {
  const scrollToNextSection = () => {
    const nextSection = document.getElementById('how-it-works');
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Futuristic animated background */}
      <FuturisticBackground />
      
      <Navigation />
      
      <div className="pt-16 relative z-10">
        {/* ============================================ */}
        {/* HERO SECTION */}
        {/* ============================================ */}
        <section className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
          
          <div className="container mx-auto px-6 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-8">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">The Vault Club Whitepaper</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-foreground">
                A Private, Choreographed
                <br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Financial Schematic
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
                Designed for long-term capital growth through a disciplined, two-phase strategy that brings 
                institutional-style capital allocation and compound-interest mechanics to everyday investors.
              </p>
              
              <button 
                onClick={scrollToNextSection}
                className="animate-bounce cursor-pointer hover:text-primary transition-colors"
                aria-label="Scroll to learn more"
              >
                <ArrowDown className="h-10 w-10 text-muted-foreground mx-auto" />
              </button>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* HOW IT WORKS OVERVIEW */}
        {/* ============================================ */}
        <section id="how-it-works" className="py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                  <Layers className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">How It Works</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground">
                  Two-Phase Strategy
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  The Vault Club operates through automated, non-custodial smart contracts with a clear 
                  two-phase approach to wealth building.
                </p>
              </div>
              
              {/* Phase Overview Cards */}
              <div className="grid md:grid-cols-2 gap-8 mb-16">
                {/* Phase 1 */}
                <div className="bg-card border border-primary/20 rounded-3xl p-8 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary-foreground">1</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">The Mega Vault</h3>
                      <p className="text-muted-foreground">Growth & Compounding Phase</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    All user funds are pooled into the Mega Vault for scale-based efficiency and coordinated reinvestment. 
                    The system operates across three independent investment strands deployed exclusively on Polygon.
                  </p>
                  <div className="bg-muted/50 rounded-xl p-4">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Routed Reinvestment Logic (RRL)</strong> systematically reallocates 
                      profits across DeFi yield venues, creating compounding "compression."
                    </p>
                  </div>
                </div>
                
                {/* Phase 2 */}
                <div className="bg-card border border-accent/20 rounded-3xl p-8 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-accent-foreground">2</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">wBTC Accumulation</h3>
                      <p className="text-muted-foreground">Wealth Preservation Phase</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Once growth thresholds are met, the system transitions to wealth preservation, 
                    converting accumulated value into Wrapped Bitcoin (wBTC) via weekly Dollar-Cost Averaging.
                  </p>
                  <div className="bg-muted/50 rounded-xl p-4">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Trigger:</strong> 50% contract completion OR 
                      Subclub vault value reaches approximately $2M.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* THREE STRANDS SECTION */}
        {/* ============================================ */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Investment Strands</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground">
                  The Mega Vault Structure
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Capital is deployed across three independent investment strands using conservative 
                  stable assets and ETH-paired liquidity.
                </p>
              </div>
              
              {/* Strands */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Strand 1 */}
                <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <Shield className="h-6 w-6 text-blue-500" />
                    </div>
                    <span className="text-2xl font-bold text-blue-500">10%</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">Strand 1: Spark Protocol</h3>
                  <p className="text-sm text-muted-foreground mb-4">Conservative Stablecoin Lending</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expected Yield</span>
                      <span className="font-medium text-foreground">~3-5% APY</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role</span>
                      <span className="font-medium text-foreground">Stability Anchor</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Tracks ownership accounting, maintains emergency reserves, executes wBTC purchases.
                  </p>
                </div>
                
                {/* Strand 2 */}
                <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-purple-500" />
                    </div>
                    <span className="text-2xl font-bold text-purple-500">60%</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">Strand 2: Aave Protocol</h3>
                  <p className="text-sm text-muted-foreground mb-4">Core Yield & Capital Efficiency</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expected Yield</span>
                      <span className="font-medium text-foreground">~7-10% APY</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max LTV</span>
                      <span className="font-medium text-foreground">25%</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Collateral base for Subscription-Backed Borrowing. Strict risk controls.
                  </p>
                </div>
                
                {/* Strand 3 */}
                <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                      <Zap className="h-6 w-6 text-green-500" />
                    </div>
                    <span className="text-2xl font-bold text-green-500">30%</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">Strand 3: QuickSwap v3</h3>
                  <p className="text-sm text-muted-foreground mb-4">Concentrated Liquidity (wETH/USDC)</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expected Yield</span>
                      <span className="font-medium text-foreground">~12-15% APY</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role</span>
                      <span className="font-medium text-foreground">High-Velocity Returns</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Primary high-velocity return contributor through concentrated liquidity fee generation.
                  </p>
                </div>
              </div>
              
              {/* Profits harvested weekly note */}
              <div className="text-center mt-8">
                <div className="inline-flex items-center gap-2 bg-muted rounded-full px-4 py-2">
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Profits harvested weekly across all strands</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* WEEKLY CAPITAL CYCLE */}
        {/* ============================================ */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Operations</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground">
                  Weekly Capital Cycle
                </h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">M</span>
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Monday</h3>
                  <p className="text-sm text-muted-foreground">Initiation Day</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Conservative Aave borrowing front-loads capital for the week.
                  </p>
                </div>
                
                <div className="bg-card border border-border rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-lg font-bold text-accent">T-Th</span>
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Throughout Week</h3>
                  <p className="text-sm text-muted-foreground">Deposit Processing</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    User deposits repay outstanding loan balances progressively.
                  </p>
                </div>
                
                <div className="bg-card border border-border rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-500">F</span>
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Friday</h3>
                  <p className="text-sm text-muted-foreground">Routing Day</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Surplus funds routed via RRL. Profits harvested across all strands.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SUBCLUB STRUCTURE */}
        {/* ============================================ */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Structure</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground">
                  Subclub Contracts
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Built for 1-8 committed participants who form exclusive contracts governed by 
                  automated, non-custodial smart contracts.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Parameters */}
                <div className="bg-card border border-border rounded-2xl p-8">
                  <h3 className="text-xl font-bold mb-6 text-foreground">Contract Parameters</h3>
                  <div className="space-y-4">
                    {[
                      { label: "Participants per Subclub", value: "1-8 members" },
                      { label: "Lock-up Period", value: "1-20 years" },
                      { label: "Rigor Tiers", value: "Low, Medium, High, Custom" },
                      { label: "Contract Visibility", value: "Public or Private" },
                      { label: "Utility Fee", value: "$1.50/user/week" },
                      { label: "Max LTV (SBB)", value: "25%" }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Safeguards */}
                <div className="bg-card border border-border rounded-2xl p-8">
                  <h3 className="text-xl font-bold mb-6 text-foreground">Built-in Safeguards</h3>
                  <div className="space-y-4">
                    {[
                      "3 missed deposits = 3% ownership redistribution",
                      "Emergency termination: unanimous multisig required",
                      "Contract edits: unanimous consent anytime",
                      "Emergency withdrawal prioritizes principal",
                      "Independent pause/exit from group contracts",
                      "Contracts under 1 year: utility fee charged"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* NON-CUSTODIAL DESIGN */}
        {/* ============================================ */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-3xl p-10 text-center">
                <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Lock className="h-10 w-10 text-primary-foreground" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-foreground">
                  100% Non-Custodial Design
                </h2>
                <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Wallets are generated client-side. Private keys are never held by Sequence Theory. 
                  Users retain full control at all times.
                </p>
                <div className="bg-background/50 rounded-xl p-6 max-w-xl mx-auto">
                  <p className="text-foreground font-medium">
                    The Vault Club acts as an automated coordinator — not a custodian or bank.
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mt-6 italic">
                  "The goal is not to encourage financial obsession but to replace it with structure."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* BUSINESS MODEL */}
        {/* ============================================ */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Transparency</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground">
                  Simple, Transparent Pricing
                </h2>
              </div>
              
              <div className="bg-card border border-border rounded-3xl p-8 max-w-2xl mx-auto text-center">
                <div className="text-5xl font-bold text-primary mb-2">$1.50</div>
                <p className="text-lg text-muted-foreground mb-6">per user, per week</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-muted/50 rounded-xl p-4">
                    <div className="font-bold text-foreground">$0.50</div>
                    <div className="text-muted-foreground">Gas fees</div>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4">
                    <div className="font-bold text-foreground">$1.00</div>
                    <div className="text-muted-foreground">Utility fee</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-6">
                  Revenue derived solely from transparent utility fees. No hidden costs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* CTA SECTION */}
        {/* ============================================ */}
        <PreSignup />
        
        <Footer />
      </div>
    </div>
  );
};

export default LearnMore;
