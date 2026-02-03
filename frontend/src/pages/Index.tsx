/**
 * Landing Page for The Vault Club by Sequence Theory
 *
 * Features:
 * - Scroll-triggered CTAs that appear as user progresses
 * - Multi-section layout with clear user journey
 * - Automated SEO meta tag management
 * - Responsive design with mobile-first approach
 * - Accessibility: ARIA labels, skip links, reduced motion support
 *
 * Performance:
 * - Uses consolidated IntersectionObserver for scroll triggers
 * - Lazy loads below-fold content
 * - Respects user's motion preferences
 */

import React, { useEffect, useState, useRef, lazy, Suspense, memo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PreSignup from "@/components/PreSignup";
import { FinancialStatsExpander } from "@/components/FinancialStatsExpander";
import { Button } from "@/components/ui/button";
import { FuturisticBackground } from "@/components/FuturisticBackground";
import { SkipLink } from "@/components/SkipLink";

// Lazy load below-fold components
const IndicesPreview = lazy(() => 
  import("@/components/IndicesPreview").then(module => ({ default: module.IndicesPreview }))
);
const FAQPreview = lazy(() => 
  import("@/components/FAQPreview").then(module => ({ default: module.FAQPreview }))
);

// Landing page components
import { SectionHeader } from "@/components/landing/SectionHeader";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { CheckListItem, BulletListItem } from "@/components/landing/CheckListItem";
import { ScrollCTA } from "@/components/landing/ScrollCTA";

// Hooks
import { useSEO } from "@/hooks/useSEO";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// Constants
import { SEO_CONFIG, ANIMATION_CONFIG } from "@/constants/landing";

// Icons
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
  BookOpen,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

// Memoized background for performance
const MemoizedBackground = memo(FuturisticBackground);

// Loading skeleton for lazy-loaded components
const SectionSkeleton: React.FC<{ height?: string }> = ({ height = "h-64" }) => (
  <div className={`${height} bg-card/30 rounded-2xl animate-pulse`} />
);

// Problem section data
const PROBLEM_CARDS = [
  {
    icon: Shield,
    title: "Ready Ability",
    description:
      "Reliable access to quality investment vehicles that do not require massive capital or institutional connections.",
  },
  {
    icon: TrendingUp,
    title: "Discipline",
    description:
      "Consistent, recurring contributions over time without getting distracted by market volatility or speculation.",
  },
  {
    icon: Target,
    title: "Long-Term Horizons",
    description:
      "The patience to allow growth to compound without succumbing to short-term market pressures.",
  },
];

const PAIN_POINTS = [
  "Navigating complex web3 wallets and security requirements",
  "Overwhelming exchanges with thousands of tokens",
  "Dense DeFi jargon and technical complexity",
  "Constant market speculation and FOMO pressure",
];

const SOLUTIONS = [
  "Spoon-feeding users with structured investing",
  "Controlled risk exposure through automation",
  "Completely automated contracts remove complexity",
  "Focus on education and gradual market entry",
];

const DIFFERENTIATORS = [
  "Automated compounding - your money grows without constant attention",
  "Structured discipline - built-in commitment keeps you on track",
  "Wealth preservation - automatic transition to safer assets over time",
  "Community support - invest alongside others with shared goals",
];

const Index: React.FC = () => {
  const location = useLocation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  // Section refs for scroll-based CTAs
  const problemSectionRef = useRef<HTMLElement>(null);
  const solutionSectionRef = useRef<HTMLElement>(null);
  const missionSectionRef = useRef<HTMLElement>(null);
  const indicesSectionRef = useRef<HTMLElement>(null);
  const faqSectionRef = useRef<HTMLElement>(null);

  // SEO management
  useSEO(SEO_CONFIG);

  // Hero animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Handle navigation with scroll-to-signup state
  useEffect(() => {
    if (location.state?.scrollToSignup) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const signupEl = document.getElementById("signup");
          if (signupEl) {
            signupEl.scrollIntoView({ behavior: "smooth" });
            // Focus first interactive element for accessibility
            const firstInteractive = signupEl.querySelector("button, input, a");
            if (firstInteractive instanceof HTMLElement) {
              firstInteractive.focus();
            }
          }
          window.history.replaceState({}, document.title);
        });
      });
    }
  }, [location]);

  const heroTransition = prefersReducedMotion
    ? ""
    : `transition-all duration-${ANIMATION_CONFIG.HERO_FADE_DURATION}`;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Skip link for accessibility */}
      <SkipLink targetId="main-content" />

      {/* Futuristic animated background */}
      <MemoizedBackground />

      <Navigation />

      <main id="main-content" className="pt-16 relative z-10">
        {/* ============================================ */}
        {/* HERO SECTION */}
        {/* ============================================ */}
        <section
          className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
          aria-labelledby="hero-heading"
        >
          {/* Very subtle gradient - mostly transparent to show background */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/30"
            aria-hidden="true"
          />

          {/* Refined grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
            aria-hidden="true"
          />

          <div className="container mx-auto px-6 relative z-10">
            <div
              className={`max-w-4xl mx-auto text-center ${heroTransition} ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              {/* Main headline */}
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight"
              >
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

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Link to="/learn-more">
                  <Button
                    size="lg"
                    className="text-base px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 min-w-[220px]"
                  >
                    Learn About The Vault Club
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
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
              <div
                className="flex items-center justify-center gap-6 pt-8 border-t border-border/50"
                role="list"
                aria-label="Trust indicators"
              >
                <div className="flex items-center gap-2 text-muted-foreground" role="listitem">
                  <Lock className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span className="text-sm">Set & Forget</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground" role="listitem">
                  <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span className="text-sm">Automated compounding</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* PROBLEM SECTION */}
        {/* ============================================ */}
        <section
          ref={problemSectionRef}
          className="py-24 relative"
          aria-labelledby="problem-heading"
          data-testid="problem-section"
        >
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <SectionHeader
                id="problem-heading"
                badge={{
                  icon: <Target className="h-4 w-4" />,
                  label: "The Challenge",
                  variant: "destructive",
                }}
                title="The Compound Interest Problem"
                description="Albert Einstein called compound interest the 'eighth wonder of the world,' yet most people never benefit from it meaningfully. The issue is not failure - it is friction."
              />

              {/* Problem cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {PROBLEM_CARDS.map((item, index) => (
                  <FeatureCard
                    key={index}
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                    variant="destructive"
                  />
                ))}
              </div>

              {/* Scroll CTA */}
              <div className="text-center" data-testid="scroll-cta-learn-more">
                <ScrollCTA
                  sectionRef={problemSectionRef}
                  label="Deep Dive: Learn More"
                  to="/learn-more"
                  icon={<BookOpen className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* THE LEAP ISSUE SECTION */}
        {/* ============================================ */}
        <section
          ref={solutionSectionRef}
          className="py-24 relative"
          aria-labelledby="solution-heading"
        >
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <SectionHeader
                id="solution-heading"
                badge={{
                  icon: <Zap className="h-4 w-4" />,
                  label: "The Barrier",
                  variant: "accent",
                }}
                title="The Leap Issue"
                description="In crypto, too much autonomy is required. Navigating wallets, exchanges, and DeFi jargon leaves users feeling that entering crypto is 'too much of a leap.'"
              />

              {/* Two-column comparison */}
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* Pain Points */}
                <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <Target className="h-5 w-5 text-destructive" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Common Pain Points</h3>
                  </div>
                  <div className="space-y-4">
                    {PAIN_POINTS.map((item, index) => (
                      <BulletListItem key={index} text={item} variant="destructive" />
                    ))}
                  </div>
                </div>

                {/* Solution */}
                <div className="bg-primary/5 backdrop-blur-sm rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Our Solution</h3>
                  </div>
                  <div className="space-y-4">
                    {SOLUTIONS.map((item, index) => (
                      <BulletListItem key={index} text={item} variant="primary" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Scroll CTA */}
              <div className="text-center">
                <ScrollCTA
                  sectionRef={solutionSectionRef}
                  label="Start Your Education"
                  to="/learn-now"
                  icon={<BookOpen className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* MISSION SECTION */}
        {/* ============================================ */}
        <section
          ref={missionSectionRef}
          className="py-24 relative"
          aria-labelledby="mission-heading"
        >
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <SectionHeader
                id="mission-heading"
                badge={{
                  icon: <Users className="h-4 w-4" />,
                  label: "Our Mission",
                  variant: "primary",
                }}
                title="Who We Are"
              />

              {/* Financial Stats */}
              <FinancialStatsExpander />
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* FRAMEWORK SECTION */}
        {/* ============================================ */}
        <section className="py-24 relative" aria-labelledby="framework-heading">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <SectionHeader
                id="framework-heading"
                badge={{
                  icon: <Layers className="h-4 w-4" />,
                  label: "Our Solution",
                  variant: "primary",
                }}
                title="The Vault Club (TVC)"
                description="A decentralized software coordination platform — Web2 feel, Web3 infrastructure"
              />

              {/* Solution card */}
              <div className="bg-card/60 backdrop-blur-sm rounded-3xl p-10 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className="flex-shrink-0" aria-hidden="true">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                      <Shield className="h-10 w-10 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-6 text-foreground">Set It & Forget It</h3>
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <p>
                        TVC is the "subscription to your future." Select your Risk & Rigor level
                        and let deterministic smart contracts handle the rest. Not a tool for speculation — 
                        a tool for structured discipline. 100% non-custodial ownership.
                      </p>
                      <div className="bg-primary/5 border-l-4 border-primary rounded-r-xl p-6 my-6">
                        <p>
                          <strong>Your journey:</strong> Transform "managerial effort" into "deterministic code." 
                          Grow wealth through established DeFi protocols (Aave, Morpho, sUSDC) with 
                          immutable contract logic governed by unanimous consent.
                        </p>
                      </div>
                    </div>
                    <Link to="/learn-more">
                      <Button className="mt-4 rounded-full">
                        Learn More <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
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
        <section className="py-24 relative" aria-labelledby="broader-mission-heading">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <SectionHeader
                id="broader-mission-heading"
                badge={{
                  icon: <Globe className="h-4 w-4" />,
                  label: "Broader Mission",
                  variant: "primary",
                }}
                title="Building Financial Literacy & Inclusion"
                description="Sequence Theory is not just a financial product - it is a framework for building lasting financial literacy and inclusion across digital and traditional markets."
              />

              <div className="grid md:grid-cols-2 gap-8">
                {/* Philosophy Card */}
                <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-pulse"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium text-primary">Our Core Philosophy</span>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <p className="font-semibold text-foreground mb-1">MISSION:</p>
                      <p className="text-muted-foreground">Democratize Financial Empowerment</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">METHOD:</p>
                      <p className="text-muted-foreground">
                        Community-based Investment and Education
                      </p>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <p className="text-muted-foreground leading-relaxed">
                        The goal is not to encourage financial obsession but to replace it with
                        structure. Set & Forget - automated investing that works for you.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Features Card */}
                <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-8">
                  <h3 className="text-xl font-bold mb-6 text-foreground">What Makes Us Different</h3>
                  <div className="space-y-4">
                    {DIFFERENTIATORS.map((feature, index) => (
                      <CheckListItem key={index} text={feature} variant="primary" />
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
        <section
          ref={indicesSectionRef}
          className="py-24 relative"
          aria-labelledby="indices-heading"
        >
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <SectionHeader
                id="indices-heading"
                badge={{
                  icon: <BarChart3 className="h-4 w-4" />,
                  label: "Market Indices",
                  variant: "info",
                }}
                title="Digital Asset Indices"
                description="Track the performance of key market segments with our proprietary indices"
              />

              {/* Lazy loaded Indices Preview */}
              <Suspense fallback={<SectionSkeleton height="h-96" />}>
                <IndicesPreview />
              </Suspense>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* FAQ PREVIEW SECTION */}
        {/* ============================================ */}
        <section ref={faqSectionRef} className="py-24 relative" aria-labelledby="faq-heading">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <SectionHeader
                id="faq-heading"
                badge={{
                  icon: <HelpCircle className="h-4 w-4" />,
                  label: "Common Questions",
                  variant: "warning",
                }}
                title="Frequently Asked Questions"
                description="Quick answers to help you understand TVC"
                titleClassName="text-3xl sm:text-4xl"
              />

              {/* Lazy loaded FAQ Preview */}
              <Suspense fallback={<SectionSkeleton />}>
                <FAQPreview />
              </Suspense>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* CTA / SIGNUP SECTION */}
        {/* ============================================ */}
        <PreSignup />

        <Footer />
      </main>
    </div>
  );
};

export default Index;
