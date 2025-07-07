
import { useState } from "react";
import { GraduationCap, TrendingUp, Shield, Users, ChevronDown, ChevronUp } from "lucide-react";

const About = () => {
  const [isEarnWhileYouLearnExpanded, setIsEarnWhileYouLearnExpanded] = useState(false);
  const [isMitigateVolatilityExpanded, setIsMitigateVolatilityExpanded] = useState(false);
  const [isInvestmentContractsExpanded, setIsInvestmentContractsExpanded] = useState(false);

  const features = [
    {
      icon: GraduationCap,
      title: "Earn While You Learn",
      description: "Generate returns through structured investment contracts while building your digital asset knowledge.",
      expandedDescription: "Earn While You Learn is a core principle at Sequence Theory, designed to shift users away from blindly buying tokens they don't understand toward intentional, informed participation in the crypto economy. Through integrations with platforms like LearnWeb3, Coinbase Education, and other on-chain learning initiatives, we embed education directly into the investment experience. While users engage with our smart contract strategies inside The Vault Club, they simultaneously gain structured financial knowledge—empowering them to understand the mechanics behind their investments in real time. This hands-on approach reduces costly trial-and-error learning, builds long-term confidence, and helps users grow both their assets and their understanding of decentralized finance from day one.",
      isExpandable: true,
      isExpanded: isEarnWhileYouLearnExpanded,
      setExpanded: setIsEarnWhileYouLearnExpanded
    },
    {
      icon: TrendingUp,
      title: "Mitigate Volatility",
      description: "Skip the random token speculation. Our platform provides steady growth through proven strategies.",
      expandedDescription: "Mitigating Volatility is about bringing structure to the unpredictable nature of crypto. In this space, prices move based almost entirely on supply and demand, since there's no central value anchor like in traditional markets. That means price swings are often driven by hype, panic, or sudden shifts in sentiment. The Vault Club helps reduce that chaos by introducing more predictable & systematic behavior into the market. Through features like recurring contributions, automated reinvestment, and time-locked contracts, we create steady demand and discourage impulsive decision making. This helps smooth out some of the noise and gives users a more stable path to be successful over time.",
      isExpandable: true,
      isExpanded: isMitigateVolatilityExpanded,
      setExpanded: setIsMitigateVolatilityExpanded
    },
    {
      icon: Shield,
      title: "Investment Contracts",
      description: "Structured agreements that protect your capital while you ease into the digital asset space.",
      expandedDescription: "Investment Contracts are a safer and smarter way to start in crypto—especially before diving into an exchange. Platforms like Coinbase or Binance can feel like a sea of tokens, many of which serve different purposes or, frankly, have no real value at all. Some tokens aren't even designed to increase in price, and others—like memecoins—exist mainly for speculation. For beginners, this can lead to confusion, impulsive purchases, and costly mistakes. That's why The Vault Club offers structured contracts as a starting point. Instead of buying random tokens and figuring it out later, users can begin with a clear, guided strategy that grows over time and teaches them how crypto really works. It's about building first, then exploring on your terms, with confidence.",
      isExpandable: true,
      isExpanded: isInvestmentContractsExpanded,
      setExpanded: setIsInvestmentContractsExpanded
    },
    {
      icon: Users,
      title: "Your Community",
      description: "Connect with others who understand the difference between investing and gambling on tokens."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            The Vault Club by Sequence Theory
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our premier investment contract platform designed for those ready to ease into digital assets 
            through structured earning opportunities, not random token purchases.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="bg-gradient-to-r from-purple-600 to-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {feature.description}
              </p>
              
              {feature.isExpandable && (
                <>
                  {feature.isExpanded && (
                    <div className="text-gray-600 mb-4 animate-fade-in">
                      <p>{feature.expandedDescription}</p>
                    </div>
                  )}
                  <button
                    onClick={() => feature.setExpanded(!feature.isExpanded)}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors text-sm"
                  >
                    {feature.isExpanded ? "Read less" : "Read more"}
                    {feature.isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
