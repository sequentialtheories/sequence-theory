
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const SequenceTheoryMission = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            About Sequence Theory, Our Mission
          </h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="text-lg text-gray-700 leading-relaxed">
            <p className="mb-4">
              Sequence Theory is focused on building accessible tools and services that onboard everyday users into decentralized finance. Our flagship platform, TVC (The Vault Club), is a decentralized software coordination platform designed to bridge DeFi and long-term retail wealth building — combining the transparency of DeFi with Web2 ease.
            </p>
            
            {isExpanded && (
              <div className="space-y-4 animate-fade-in">
                <p>
                  TVC transforms "managerial effort" into "deterministic code," providing a Web2-Soul, Web3-Body architecture. Users sign in with familiar methods like Email/Passkey while maintaining 100% non-custodial ownership — private keys are generated client-side and never accessible to Sequence Theory. This is how we make non-custodial technology frictionless.
                </p>
                
                <p>
                  Beyond product development, Sequence Theory is becoming an industry standard of consumer-first DeFi. We're lowering the barrier to entry by offering bite-sized educational experiences that guide users from their first wallet to more complex DeFi strategies. TVC empowers everyday investors to stop chasing hype and start compounding legacy.
                </p>
                
                <p>
                  Looking ahead, we see a future where users don't "trade" — they select Risk & Rigor. Whether through stablecoin lending (Aave V3), savings rates (sUSDC), or institutional-grade vaults (Morpho), TVC is the subscription to your future. Your Money. Your Power.
                </p>
              </div>
            )}
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              {isExpanded ? "Read less" : "Read more"}
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SequenceTheoryMission;
