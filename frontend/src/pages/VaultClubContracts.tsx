import ArticleLayout from "@/components/ArticleLayout";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const VaultClubContracts = () => {
  return (
    <ArticleLayout title="Understanding TVC" level="Intermediate">
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900">What Is TVC (The Vault Club)?</h2>
        
        <div className="bg-cyan-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-cyan-800">A Decentralized Software Coordination Platform</h3>
          <p className="text-gray-700 mb-4">
            TVC is designed to bridge the gap between decentralized finance (DeFi) and long-term retail wealth building. 
            It transforms "managerial effort" into "deterministic code," offering an intuitive interface and subscription model 
            for the next generation of "set-and-forget" investors.
          </p>
          <p className="text-gray-700">
            Think of it as a "subscription to your future" — combining the transparency of DeFi with Web2 ease. 
            TVC provides a Web2 feel with Web3 infrastructure, making non-custodial technology frictionless.
          </p>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">The Consumer-First Approach</h3>
        
        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-purple-800">Web2-Soul, Web3-Body Architecture</h4>
          <div className="space-y-4">
            <p className="text-gray-700">
              TVC eliminates the traditional barriers to DeFi adoption:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Familiar Login:</strong> Sign in with Email or Passkey — no seed phrases to manage</li>
              <li><strong>100% Non-Custodial:</strong> Private keys generated client-side, never accessible to Sequence Theory</li>
              <li><strong>Frictionless Onboarding:</strong> Web2 ease with full Web3 ownership</li>
              <li><strong>Your Money. Your Power:</strong> You retain complete control at all times</li>
            </ul>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Risk & Rigor: How TVC Works</h3>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-green-800">Not Speculation — Structured Discipline</h4>
          <p className="text-gray-700 mb-4">
            TVC is not a tool for speculation; it is a tool for structured discipline. Users don't "trade" — 
            they select Risk & Rigor levels that dictate fund distribution across different DeFi protocols:
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h5 className="font-semibold text-green-700 mb-2">Conservative</h5>
              <p className="text-sm text-gray-600"><strong>Aave V3</strong> — Stablecoin lending through battle-tested protocols</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-yellow-200">
              <h5 className="font-semibold text-yellow-700 mb-2">Medium</h5>
              <p className="text-sm text-gray-600"><strong>sUSDC</strong> — Savings rates with established stablecoin yields</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-red-200">
              <h5 className="font-semibold text-red-700 mb-2">Risky</h5>
              <p className="text-sm text-gray-600"><strong>Morpho</strong> — Institutional-grade vaults with precurated risk modeling</p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Understanding the DeFi Protocols</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 text-blue-800">Aave V3</h4>
            <p className="text-gray-700 mb-3">
              A battle-tested lending protocol where:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Lenders deposit stablecoins and earn interest</li>
              <li>Interest rates adjust based on supply and demand</li>
              <li>All transactions secured by audited smart contracts</li>
              <li>Conservative risk profile for steady returns</li>
            </ul>
          </div>
          
          <div className="bg-indigo-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 text-indigo-800">Morpho</h4>
            <p className="text-gray-700 mb-3">
              Institutional-grade DeFi vaults featuring:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Precurated risk modeling</li>
              <li>Optimized yields through peer-to-peer matching</li>
              <li>Professional-grade strategies made accessible</li>
              <li>Higher potential returns with managed risk</li>
            </ul>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Deterministic Smart Contracts</h3>
        
        <div className="bg-indigo-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-indigo-800">Immutable Logic, Transparent Operations</h4>
          <p className="text-gray-700 mb-3">
            Once deployed, TVC contract logic is deterministic and immutable:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Governed by Code:</strong> No human intervention in investment decisions</li>
            <li><strong>Unanimous Consent:</strong> Contract changes require participant agreement</li>
            <li><strong>On-Chain Transparency:</strong> All operations verifiable on the blockchain</li>
            <li><strong>Emergency Liquidity:</strong> Built-in safeguards for fund access when needed</li>
          </ul>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Simple, Transparent Pricing</h3>
        
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-yellow-800">$1.50 Per User Per Week</h4>
          <div className="space-y-3">
            <p className="text-gray-700">
              No hidden fees. No percentage-based charges on your gains.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>$0.50</strong> — Gas fees for on-chain operations</li>
              <li><strong>$1.00</strong> — Utility fee for platform maintenance</li>
            </ul>
            <p className="text-gray-700 mt-4">
              <strong>Note:</strong> Emergency liquidity is built in, but profits are not earned if deposits are 
              withdrawn before contract conclusion.
            </p>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Why TVC Works</h3>
        
        <div className="bg-teal-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-teal-800">The Subscription to Your Future</h4>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Consumer-First DeFi:</strong> Industry-leading approach to accessible decentralized finance</li>
            <li><strong>Non-Custodial Ownership:</strong> You always control your funds — we never have access</li>
            <li><strong>Deterministic Execution:</strong> Remove emotion and speculation from investing</li>
            <li><strong>Structured Discipline:</strong> Stop chasing hype, start compounding legacy</li>
            <li><strong>Transparent Operations:</strong> Every action visible and verifiable on-chain</li>
            <li><strong>Established Protocols:</strong> Capital deployed through audited, battle-tested DeFi</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">Key Takeaways</h4>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>TVC is a decentralized software coordination platform for long-term wealth building</li>
            <li>Web2-Soul, Web3-Body architecture: familiar login, 100% non-custodial ownership</li>
            <li>Users don't "trade" — they select Risk & Rigor levels across established DeFi protocols</li>
            <li>Deterministic, immutable contract logic governed by code, not humans</li>
            <li>Risk tiers: Conservative (Aave V3), Medium (sUSDC), Risky (Morpho)</li>
            <li>Simple pricing: $1.50/user/week with no hidden fees</li>
            <li>Not a tool for speculation — a tool for structured discipline</li>
            <li>Your Money. Your Power. The subscription to your future.</li>
          </ul>
        </div>

        {/* Continue Your Learning Journey */}
        <section className="bg-gray-50 rounded-xl p-8">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">Continue Your Learning Journey</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Link 
                to="/learn/digital-asset-fundamentals"
                className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                  <span className="font-semibold text-gray-900">Previous: Digital Asset Fundamentals</span>
                </div>
                <p className="text-gray-600">Master the basics of digital assets, blockchain technology, and market dynamics.</p>
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

export default VaultClubContracts;
