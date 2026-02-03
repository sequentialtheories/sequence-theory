import ArticleLayout from "@/components/ArticleLayout";
import { Link } from "react-router-dom";
import { Coins } from "lucide-react";

const ExpandingBeyondVaultClub = () => {
  return (
    <ArticleLayout title="Expanding Your Portfolio" level="Advanced">
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900">Strategic Portfolio Diversification</h2>
        
        <div className="bg-cyan-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-cyan-800">Building on Your Foundation</h3>
          <p className="text-gray-700">
            TVC provides a solid DeFi foundation with deterministic smart contracts across established protocols. 
            Portfolio expansion means adding complementary investments while maintaining this core strategy. 
            Think of TVC as your structured DeFi base — then you can explore other opportunities with confidence.
          </p>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">When You're Ready to Expand</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 text-green-800">Knowledge Readiness</h4>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>You understand how TVC's Risk & Rigor levels work</li>
              <li>You can explain basic DeFi protocols (Aave, Morpho)</li>
              <li>You've weathered market volatility calmly</li>
              <li>You have clear additional investment goals</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 text-blue-800">Emotional Readiness</h4>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>You're comfortable with your TVC strategy</li>
              <li>You make decisions based on analysis, not emotions</li>
              <li>You have realistic expectations about returns</li>
              <li>You understand 100% non-custodial means 100% responsibility</li>
            </ul>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Your Investment Journey Progression</h3>
        
        <p className="text-gray-700 mb-4">
          Advanced investors understand that wealth building involves a strategic progression. 
          Your journey naturally flows from TVC's structured approach to individual token selection.
        </p>

        <div className="space-y-6">
          <div className="bg-purple-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 text-purple-800">Step 1: DeFi Foundation - TVC</h4>
            <p className="text-gray-700">
              TVC provides your structured DeFi foundation: deterministic smart contracts, Risk & Rigor levels 
              across Aave V3, sUSDC, and Morpho — all non-custodial and automated. This removes emotional decisions 
              and establishes your core strategy.
            </p>
          </div>
          
          <div className="bg-cyan-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 text-cyan-800">Step 2: Individual Token Selection - Cryptocurrency Exchanges</h4>
            <p className="text-gray-700 mb-3">
              Once comfortable with your TVC foundation, cryptocurrency exchanges open access to thousands of digital assets:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Research and select specific tokens based on fundamentals and use cases</li>
              <li>Access major cryptocurrencies, DeFi tokens, and emerging projects</li>
              <li>Practice dollar-cost averaging into chosen assets</li>
              <li>Learn proper security practices for holding digital assets</li>
              <li>Develop skills in technical and fundamental analysis</li>
            </ul>
            <div className="mt-4 p-4 bg-cyan-100 rounded-lg">
              <p className="text-sm text-cyan-800">
                <strong>Popular Exchanges:</strong> Coinbase (beginner-friendly), Binance (thousands of tokens), 
                Kraken (security-focused), Gemini (regulated), KuCoin (altcoins).
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 text-blue-800">Step 3: Advanced DeFi (Optional)</h4>
            <p className="text-gray-700 mb-3">
              With TVC experience, you may explore more complex DeFi strategies:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Liquidity provision on DEXs</li>
              <li>Yield farming strategies</li>
              <li>Cross-chain bridges and L2 solutions</li>
              <li>Different risk/return profiles than TVC's curated approach</li>
            </ul>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Understanding Cryptocurrency Exchanges</h3>
        
        <p className="text-gray-700 mb-4">
          Cryptocurrency exchanges are digital marketplaces where you can buy, sell, and trade thousands of different tokens. 
          Think of them as specialized financial platforms that give you access to the entire digital asset ecosystem.
        </p>

        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-green-800">Available Token Categories</h4>
          <p className="text-gray-700 mb-4">
            Major exchanges offer access to thousands of tokens across different categories:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold text-green-700 mb-2">Major Categories</h5>
              <ul className="list-disc pl-4 text-gray-700 space-y-1">
                <li>Layer 1 blockchains (Bitcoin, Ethereum, Solana)</li>
                <li>DeFi protocol tokens (Uniswap, AAVE, Compound)</li>
                <li>Gaming and metaverse tokens</li>
                <li>Infrastructure and oracle tokens</li>
                <li>Stablecoins across different networks</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-green-700 mb-2">Ecosystem Diversity</h5>
              <ul className="list-disc pl-4 text-gray-700 space-y-1">
                <li>Ethereum ecosystem tokens</li>
                <li>Binance Smart Chain projects</li>
                <li>Solana-based applications</li>
                <li>Polygon and layer 2 solutions</li>
                <li>Emerging blockchain networks</li>
              </ul>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Multi-Asset Investment Strategies</h3>
        
        <div className="space-y-4">
          <div className="bg-purple-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 text-purple-800">Strategic Asset Allocation</h4>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li><strong>Core Holdings:</strong> TVC for structured DeFi exposure (60-70%)</li>
              <li><strong>Individual Tokens:</strong> Selected digital assets via exchanges (20-30%)</li>
              <li><strong>Emerging Opportunities:</strong> New tokens and DeFi protocols (5-10%)</li>
              <li><strong>Stablecoins:</strong> For liquidity and opportunities (5-10%)</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 text-blue-800">Dollar-Cost Averaging</h4>
            <p className="text-gray-700">
              Your TVC experience with structured investing applies perfectly to individual tokens. 
              Set up recurring buys for your chosen tokens to smooth out volatility 
              and build positions over time without trying to time the market.
            </p>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Risk Management & Security</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 text-red-800">Position Sizing</h4>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>TVC remains your structured foundation</li>
              <li>Individual tokens should be researched and sized appropriately</li>
              <li>Never invest more than you can afford to lose</li>
              <li>Consider correlation between similar tokens</li>
              <li>Regularly rebalance based on performance</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 text-yellow-800">Security & Tax</h4>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>All digital assets taxed as property</li>
              <li>Track all transactions for tax reporting</li>
              <li>Consider portfolio tracking tools (CoinTracker, Koinly)</li>
              <li>Understand DeFi tax implications</li>
              <li>Keep detailed records</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">Key Takeaways</h4>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>TVC serves as your structured DeFi foundation with Risk & Rigor levels</li>
            <li>Cryptocurrency exchanges provide access to thousands of tokens</li>
            <li>Individual token selection develops your analysis skills</li>
            <li>Ecosystem diversification reduces concentration risk</li>
            <li>Proper security practices are critical when self-custodying</li>
            <li>Tax tracking and compliance require ongoing attention</li>
          </ul>
        </div>

        {/* Continue Your Learning Journey */}
        <section className="bg-gray-50 rounded-xl p-8">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">Continue Your Learning Journey</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Link 
                to="/learn/digital-asset-exposure"
                className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Coins className="h-6 w-6 text-purple-600" />
                  <span className="font-semibold text-gray-900">Previous: Digital Asset Exposure</span>
                </div>
                <p className="text-gray-600">Deep dive into specific tokens like BTC, ETH, SOL, and LINK. Learn about tokenization and Web3.</p>
              </Link>
              
              <Link 
                to="/learn-now"
                className="block bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-semibold">Back to Learning Path</span>
                </div>
                <p className="text-gray-100">Explore all available learning modules and continue your education.</p>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </ArticleLayout>
  );
};

export default ExpandingBeyondVaultClub;
