import { useState } from "react";
import { GraduationCap, TrendingUp, Shield, Users, ChevronDown, ChevronUp } from "lucide-react";

const About = () => {
  const [isEarnWhileYouLearnExpanded, setIsEarnWhileYouLearnExpanded] = useState(false);
  const [isMitigateVolatilityExpanded, setIsMitigateVolatilityExpanded] = useState(false);
  const [isInvestmentContractsExpanded, setIsInvestmentContractsExpanded] = useState(false);
  const [isYourCommunityExpanded, setIsYourCommunityExpanded] = useState(false);

  const features = [
    {
      icon: GraduationCap,
      title: "Earn While You Learn",
      description: "Generate returns through structured investment contracts while building your digital asset knowledge.",
      expandedDescription: "Earn While You Learn is a core principle at Sequence Theory, designed to shift users away from blindly buying tokens they don't understand toward intentional, informed participation in the crypto economy. Through integrations with platforms like LearnWeb3, Coinbase Education, and other on-chain learning initiatives, we embed education directly into the investment experience. While users engage with our smart contract strategies inside TVC, they simultaneously gain structured financial knowledge—empowering them to understand the mechanics behind their investments in real time. This hands-on approach reduces costly trial-and-error learning, builds long-term confidence, and helps users grow both their assets and their understanding of decentralized finance from day one. Emergency liquidity is built in but profits are not earned if deposits are withdrawn before contract conclusion.",
      isExpandable: true,
      isExpanded: isEarnWhileYouLearnExpanded,
      setExpanded: setIsEarnWhileYouLearnExpanded
    },
    {
      icon: TrendingUp,
      title: "Consumer-First DeFi",
      description: "Web2 feel with Web3 infrastructure — making non-custodial technology frictionless for everyday investors.",
      expandedDescription: "TVC transforms 'managerial effort' into 'deterministic code,' offering an intuitive interface that brings a Web2 feel to Web3 infrastructure. We're becoming an industry standard of consumer-first DeFi by finding the fine balance between accessibility and true non-custodial ownership. Users don't need to manage seed phrases or navigate complex interfaces — they simply sign in with familiar methods like Email or Passkey while their private keys remain 100% in their control, generated client-side and never accessible to Sequence Theory. This is how we make non-custodial tech frictionless.",
      isExpandable: true,
      isExpanded: isMitigateVolatilityExpanded,
      setExpanded: setIsMitigateVolatilityExpanded
    },
    {
      icon: Shield,
      title: "Set & Forget Investing",
      description: "Once deployed, contract logic is immutable — governed by unanimous consent, not speculation.",
      expandedDescription: "The Vault Club is the 'subscription to your future.' It is not a tool for speculation; it is a tool for structured discipline. Users do not 'trade'; they select Risk & Rigor levels that dictate fund distribution across different DeFi protocols. Conservative options use stablecoin lending through Aave V3, medium risk holds sUSDC for savings rates, while higher risk accesses precurated vaults using institutional risk modeling through Morpho. Once a contract is deployed, its logic is deterministic and immutable — governed by the unanimous consent of participants. This empowers everyday investors to stop chasing hype and start compounding legacy.",
      isExpandable: true,
      isExpanded: isInvestmentContractsExpanded,
      setExpanded: setIsInvestmentContractsExpanded
    },
    {
      icon: Users,
      title: "Your Community",
      description: "Connect with the next generation of 'set-and-forget' investors building long-term wealth.",
      expandedDescription: "Your Community at Sequence Theory is built on trust, purpose, and long-term value — something that's unfortunately rare in the crypto space. Too often, wealth-building platforms turn out to be get rich quick schemes or pump and dump groups disguised as communities. We're the outlier. TVC bridges the gap between decentralized finance and long-term retail wealth building, designed for the next generation of 'set-and-forget' investors. This is your community built for real progress, not empty promises. Your Money. Your Power.",
      isExpandable: true,
      isExpanded: isYourCommunityExpanded,
      setExpanded: setIsYourCommunityExpanded
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
