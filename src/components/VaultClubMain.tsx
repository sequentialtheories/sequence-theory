import { Button } from "@/components/ui/button";
import { Shield, TrendingUp, Users, Target, CheckCircle } from "lucide-react";

const VaultClubMain = () => {
  const scrollToSignup = () => {
    document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: Shield,
      title: "Risk Management First",
      description: "Capital protection through proven institutional techniques"
    },
    {
      icon: TrendingUp,
      title: "Steady Growth Focus", 
      description: "Consistent returns over volatile speculation"
    },
    {
      icon: Target,
      title: "Automated Strategies",
      description: "Smart contracts handle investment decisions"
    },
    {
      icon: Users,
      title: "Group Contracts",
      description: "Small groups with shared commitment levels"
    }
  ];

  const benefits = [
    "Structured investment contracts for steady growth",
    "Professional-grade DeFi strategies adapted for individuals",
    "Automated diversification across established protocols",
    "Built-in risk management and capital protection",
    "Flexible commitment periods from 1 month to 20 years"
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Main Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            The Vault Club
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Our flagship DeFi investment contract platform that brings hedge fund-level strategies 
            to individual investors through automated smart contracts and structured group investments.
          </p>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">How The Vault Club Works</h3>
          <div className="bg-gradient-to-br from-purple-50 to-cyan-50 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4 text-purple-800">Automated DeFi Investment System</h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Auto-allocates across AAVE, Quickswap, and other established DeFi protocols</li>
                  <li>Transitions to Bitcoin accumulation for long-term wealth preservation</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-cyan-800">Group-Based Contracts</h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Small groups (4-8 people) with flexible weekly/monthly schedules</li>
                  <li>Blockchain-transparent with emergency withdrawal options</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-12 text-gray-900">Why Choose The Vault Club</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-purple-600 to-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold mb-3 text-gray-900">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits List */}
        <div className="max-w-3xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">What You Get</h3>
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-lg">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Building Wealth?</h3>
            <p className="text-lg mb-6 opacity-90">
              Join The Vault Club and let automated DeFi strategies work for you.
            </p>
            <Button 
              onClick={scrollToSignup}
              size="lg" 
              className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold"
            >
              Get Priority Access
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VaultClubMain;
