
import { Target, Lightbulb, Globe } from "lucide-react";

const CompanyMission = () => {
  const missionPoints = [
    {
      icon: Target,
      title: "Our Core Mission",
      description: "Democratize access to sophisticated investment strategies that were previously exclusive to large institutions and hedge funds."
    },
    {
      icon: Lightbulb,
      title: "Our Approach",
      description: "Combine the precision of quantitative finance with blockchain innovation to create structured, automated investment opportunities."
    },
    {
      icon: Globe,
      title: "Our Vision",
      description: "Build a future where traditional finance and blockchain converge, making professional-grade investing accessible to everyone."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            About Sequence Theory
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're on a mission to bridge the gap between institutional-grade investment strategies 
            and individual investors through innovative DeFi technology.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {missionPoints.map((point, index) => (
            <div key={index} className="text-center">
              <div className="bg-gradient-to-r from-purple-600 to-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <point.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">{point.title}</h3>
              <p className="text-gray-600 leading-relaxed">{point.description}</p>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900 text-center">
              Why We Built The Vault Club
            </h3>
            
            <div className="prose prose-lg mx-auto text-gray-700">
              <p className="mb-4">
                The Vault Club represents our core belief that sophisticated investment strategies shouldn't be 
                gatekept by traditional finance. By leveraging smart contracts and DeFi protocols, we've created 
                a system that operates with the precision of quantitative hedge funds while remaining transparent 
                and accessible.
              </p>
              
              <p className="mb-4">
                Our platform focuses on steady growth and risk management rather than speculative trading. 
                Through automated diversification across established protocols like AAVE and Quickswap, 
                The Vault Club provides institutional-quality investment management for individual investors.
              </p>
              
              <p>
                Looking ahead, we're exploring ways to integrate traditional assets with blockchain technology, 
                creating bridges between established financial markets and the emerging DeFi ecosystem. 
                Our goal is to build financial tools that are equitable, transparent, and built for everyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyMission;
