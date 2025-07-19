
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, TrendingUp, Users, Target, CheckCircle, DollarSign, FileText, Vault, ArrowRight, Bitcoin, AlertTriangle, ArrowDown, Timer, Coins } from "lucide-react";
import { Link } from "react-router-dom";

const LearnMore = () => {
  const scrollToSignup = () => {
    const element = document.getElementById('signup-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const benefits = [
    "Structured investment contracts designed for steady growth",
    "Professional-grade strategies adapted for individual investors",
    "Educational resources to build your digital asset knowledge",
    "Risk management protocols to protect your capital",
    "Community of like-minded investors focused on long-term success"
  ];

  const features = [
    {
      icon: Shield,
      title: "Risk Management First",
      description: "Our approach prioritizes capital protection through proven risk management techniques used by institutional investors."
    },
    {
      icon: TrendingUp,
      title: "Steady Growth Focus",
      description: "We focus on consistent, sustainable returns rather than chasing volatile market movements or speculative gains."
    },
    {
      icon: Users,
      title: "Educational Community",
      description: "Learn alongside other investors who understand the difference between strategic investing and gambling on tokens."
    },
    {
      icon: Target,
      title: "Strategic Approach",
      description: "Our investment contracts are designed using principles from quantitative finance, adapted for the digital asset space."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-6">
        <div className="container mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/a0e89a17-55c8-45b2-8c5d-b5e7ae0a756c.png" 
              alt="Sequence Theory Logo" 
              className="h-16"
            />
            <div>
              <h1 className="text-3xl font-bold">The Vault Club</h1>
              <p className="text-gray-300">by Sequence Theory</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-cyan-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Professional Investment Strategies for Everyone
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            The Vault Club brings institutional-quality investment approaches to individual investors, 
            focusing on steady growth and risk management in the digital asset space.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-8 text-center text-gray-900">Our Mission</h3>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-gray-600 mb-6">
                  We believe that sophisticated investment strategies shouldn't be exclusive to large institutions. 
                  The Vault Club democratizes access to professional-grade investment approaches, making them 
                  accessible to individual investors who are ready to move beyond speculation.
                </p>
                <p className="text-lg text-gray-600">
                  Our platform combines the precision of quantitative finance with the innovation of digital assets, 
                  creating structured investment opportunities that prioritize steady growth over volatile speculation.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-cyan-100 p-8 rounded-2xl">
                <h4 className="text-xl font-semibold mb-4 text-gray-900">Why We're Different</h4>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold mb-12 text-center text-gray-900">How We Approach Digital Assets</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-gradient-to-r from-purple-600 to-cyan-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold mb-3 text-gray-900">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Philosophy */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-8 text-center text-gray-900">Our Investment Philosophy</h3>
            <div className="space-y-8">
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h4 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-green-600" />
                  Structured Investment Contracts
                </h4>
                <p className="text-gray-600 mb-4">
                  Our investment contracts are carefully structured agreements designed to provide steady returns 
                  while protecting your capital. Unlike speculative token trading, these contracts focus on 
                  sustainable growth through proven financial principles.
                </p>
                <p className="text-gray-600">
                  Each contract is built with risk management as the foundation, ensuring that your investment 
                  has multiple layers of protection while still capturing upside potential in the digital asset market.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h4 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-3">
                  <Target className="h-6 w-6 text-purple-600" />
                  Quantitative Approach
                </h4>
                <p className="text-gray-600 mb-4">
                  We apply quantitative methods similar to those used by professional hedge funds, but adapted 
                  specifically for individual investors. Our approach uses data-driven decision making and 
                  systematic risk management.
                </p>
                <p className="text-gray-600">
                  This means less emotional decision-making and more consistent results based on mathematical 
                  models and proven investment principles that have worked for institutional investors.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h4 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-3">
                  <Users className="h-6 w-6 text-cyan-600" />
                  Education-First Community
                </h4>
                <p className="text-gray-600 mb-4">
                  The Vault Club isn't just about returns - it's about building your knowledge and confidence 
                  in the digital asset space. Our community focuses on learning and growing together.
                </p>
                <p className="text-gray-600">
                  We provide educational resources, market insights, and a supportive community of investors 
                  who understand that successful investing is about patience, strategy, and continuous learning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contract Flow Visualization */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold mb-4 text-center text-gray-900">How Vault Club Contracts Work</h3>
            <p className="text-gray-600 text-center mb-16 max-w-3xl mx-auto">
              Experience the sophisticated flow of institutional-grade investment contracts designed for individual investors.
            </p>

            {/* Main Flow Diagram */}
            <div className="relative">
              {/* Step 1: Contract Registration */}
              <div className="mb-16">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="flex-1 bg-white rounded-2xl p-8 shadow-lg border border-purple-100">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-gradient-to-r from-purple-600 to-purple-700 w-16 h-16 rounded-full flex items-center justify-center">
                        <FileText className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">Contract Represents Subclubs</h4>
                        <span className="text-purple-600 font-semibold">Initial Setup</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Each investment contract is a sophisticated financial instrument that represents and manages multiple subclubs. 
                      When you join, your subclub becomes part of a structured investment vehicle.
                    </p>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <span className="text-xs font-medium text-gray-700">Subclub A</span>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <span className="text-xs font-medium text-gray-700">Subclub B</span>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <span className="text-xs font-medium text-gray-700">Subclub C</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden lg:block">
                    <ArrowDown className="h-8 w-8 text-purple-400 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Step 2: Mega Vault Entry */}
              <div className="mb-16">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="flex-1 bg-white rounded-2xl p-8 shadow-lg border border-cyan-100">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 w-16 h-16 rounded-full flex items-center justify-center">
                        <Vault className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">Immediate Mega Vault Placement</h4>
                        <span className="text-cyan-600 font-semibold">Instant Security</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      All subclubs are immediately and initially placed in the secure Mega Vault. This provides instant 
                      diversification and professional-grade risk management from day one.
                    </p>
                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl mt-6">
                      <div className="flex items-center justify-center gap-4">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-cyan-200 rounded-full flex items-center justify-center mb-2">
                            <Vault className="h-6 w-6 text-cyan-700" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">Mega Vault</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="w-8 h-2 bg-cyan-300 rounded"></div>
                          <div className="w-8 h-2 bg-cyan-300 rounded"></div>
                          <div className="w-8 h-2 bg-cyan-300 rounded"></div>
                        </div>
                        <div className="text-center">
                          <span className="text-xs text-gray-600">All Subclubs Protected</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden lg:block">
                    <ArrowDown className="h-8 w-8 text-cyan-400 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Step 3: Gradual Exit and wBTC Accumulation */}
              <div className="mb-16">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="flex-1 bg-white rounded-2xl p-8 shadow-lg border border-orange-100">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-gradient-to-r from-orange-600 to-orange-700 w-16 h-16 rounded-full flex items-center justify-center">
                        <Bitcoin className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">Strategic wBTC Accumulation</h4>
                        <span className="text-orange-600 font-semibold">Gradual Deployment</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Contracts slowly and strategically exit the Mega Vault to accumulate wBTC independently. 
                      This gradual approach minimizes market impact and optimizes entry points.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <Timer className="h-6 w-6 text-orange-600 mb-2" />
                        <span className="text-sm font-medium text-gray-700">Timed Exits</span>
                        <p className="text-xs text-gray-500 mt-1">Strategic market timing</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <Coins className="h-6 w-6 text-orange-600 mb-2" />
                        <span className="text-sm font-medium text-gray-700">wBTC Growth</span>
                        <p className="text-xs text-gray-500 mt-1">Independent accumulation</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden lg:block">
                    <ArrowDown className="h-8 w-8 text-orange-400 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Step 4: Contract Conclusion */}
              <div className="mb-12">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-100">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-r from-green-600 to-green-700 w-16 h-16 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">Contract Length Consensus Reached</h4>
                      <span className="text-green-600 font-semibold">Decision Time</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">
                    When the predetermined contract length reaches consensus, you have complete control over your accumulated wBTC.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <Vault className="h-8 w-8 text-green-600 mx-auto mb-3" />
                      <h5 className="font-semibold text-gray-900 mb-2">Hold wBTC</h5>
                      <p className="text-sm text-gray-600">Keep your wBTC for long-term appreciation</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-3" />
                      <h5 className="font-semibold text-gray-900 mb-2">Liquidate</h5>
                      <p className="text-sm text-gray-600">Convert to fiat and secure your profits</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <ArrowRight className="h-8 w-8 text-green-600 mx-auto mb-3" />
                      <h5 className="font-semibold text-gray-900 mb-2">Transfer</h5>
                      <p className="text-sm text-gray-600">Move funds to your preferred wallet</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Warning */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h5 className="font-semibold text-red-900 mb-2">Important Security Notice</h5>
                    <p className="text-red-800 text-sm leading-relaxed">
                      <strong>Users are highly advised not to hold large funds on this service.</strong> The Vault Club 
                      operates as a hot wallet similar to exchanges, prioritizing accessibility over maximum security. 
                      For large holdings, consider transferring to a hardware wallet after contract completion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="signup-section" className="py-16 bg-gradient-to-r from-purple-600 to-cyan-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join The Vault Club and discover how professional investment strategies can work for you. 
            Start earning while you learn, with the protection and guidance you deserve.
          </p>
          <Link to="/#signup">
            <Button 
              size="lg" 
              className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Get Priority Access
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LearnMore;
