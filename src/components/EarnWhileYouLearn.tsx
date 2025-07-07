
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const EarnWhileYouLearn = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Earn While You Learn
          </h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="text-lg text-gray-700 leading-relaxed">
            <p className="mb-4">
              Earn While You Learn is a core principle at Sequence Theory, designed to shift users away from blindly buying tokens they don't understand toward intentional, informed participation in the crypto economy.
            </p>
            
            {isExpanded && (
              <div className="space-y-4 animate-fade-in">
                <p>
                  Through integrations with platforms like LearnWeb3, Coinbase Education, and other on-chain learning initiatives, we embed education directly into the investment experience. While users engage with our smart contract strategies inside The Vault Club, they simultaneously gain structured financial knowledge—empowering them to understand the mechanics behind their investments in real time.
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

export default EarnWhileYouLearn;
