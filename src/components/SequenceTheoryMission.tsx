
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
              Sequence Theory is focused on building accessible tools and services that onboard everyday users into the world of crypto. Our flagship platform, The Vault Club, is a DeFi investment contract system designed to combine financial education with powerful, automated wealth-building tools.
            </p>
            
            {isExpanded && (
              <div className="space-y-4 animate-fade-in">
                <p>
                  The Vault Club brings hedge fund–level strategies to the average user, including wrapped Bitcoin accumulation and cross-protocol yield reinvestment. It functions as a self-reinforcing system that compounds returns across independent crypto investments. Instead of passively holding tokens or ETFs with limited control, users actively learn and earn, gaining both knowledge and upside in a transparent, user-driven environment.
                </p>
                
                <p>
                  Beyond product development, Sequence Theory is on a mission to democratize financial literacy and inclusion. We're lowering the barrier to entry for digital assets by offering bite-sized educational experiences that guide users from their first wallet to more complex DeFi strategies. Financial systems shouldn't be gatekept—and we're actively designing on-ramps for underserved communities to build wealth from the ground up.
                </p>
                
                <p>
                  Looking ahead, we see a future where traditional finance and blockchain converge. Whether through tokenized stocks or real-world asset integration, Sequence Theory is exploring ways to simplify access to financial markets and bring more users into a digitally native financial ecosystem—one that's equitable, transparent, and built for everyone.
                </p>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">
                    Earn While You Learn
                  </h3>
                  <p className="mb-4">
                    Earn While You Learn is a core principle at Sequence Theory, designed to shift users away from blindly buying tokens they don't understand toward intentional, informed participation in the crypto economy.
                  </p>
                  <p>
                    Through integrations with platforms like LearnWeb3, Coinbase Education, and other on-chain learning initiatives, we embed education directly into the investment experience. While users engage with our smart contract strategies inside The Vault Club, they simultaneously gain structured financial knowledge—empowering them to understand the mechanics behind their investments in real time.
                  </p>
                </div>
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
