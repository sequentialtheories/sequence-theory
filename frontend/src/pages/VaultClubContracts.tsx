import ArticleLayout from "@/components/ArticleLayout";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const VaultClubContracts = () => {
  return (
    <ArticleLayout title="Investment Contracts" level="Intermediate">
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

        <h3 className="text-2xl font-semibold text-gray-900">How The System Works</h3>
        
        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-purple-800">The Two-Phase Strategy</h4>
          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-purple-700">Phase 1: The Growth Phase</h5>
              <p className="text-gray-700 mb-2">
                Your deposits are automatically allocated across different types of DeFi protocols:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>Lending Protocols:</strong> Like AAVE, which allows you to earn interest by lending digital assets to others</li>
                <li><strong>Staking Protocols:</strong> Where you lock up assets to help secure networks and earn rewards</li>
                <li><strong>Liquidity Protocols:</strong> Like Quickswap, where you provide liquidity to trading pairs and earn fees</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-purple-700">Phase 2: Wealth Preservation</h5>
              <p className="text-gray-700">
                When the system reaches certain milestones, it automatically transitions to accumulating 
                established digital assets like Bitcoin for long-term wealth preservation.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Understanding DeFi Protocols</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 text-green-800">AAVE - Lending Protocol</h4>
            <p className="text-gray-700 mb-3">
              AAVE is like a decentralized bank where people can lend and borrow digital assets:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Lenders deposit assets and earn interest</li>
              <li>Borrowers provide collateral to take loans</li>
              <li>Interest rates adjust automatically based on supply and demand</li>
              <li>All transactions are secured by smart contracts</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 text-blue-800">Quickswap - Liquidity Protocol</h4>
            <p className="text-gray-700 mb-3">
              Quickswap is a decentralized exchange where users can trade digital assets:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Liquidity providers deposit pairs of assets</li>
              <li>Traders pay fees to swap between assets</li>
              <li>Providers earn a share of trading fees</li>
              <li>Automated market makers handle pricing</li>
            </ul>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">The Smart Contract Structure</h3>
        
        <div className="bg-indigo-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-indigo-800">Automated and Transparent</h4>
          <p className="text-gray-700 mb-3">
            Everything runs on smart contracts with no human intervention needed for investment decisions:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Automated logic manages capital allocation and reinvestment</li>
            <li>Profits are harvested and reinvested on regular schedules</li>
            <li>All operations are visible and verifiable on the blockchain</li>
            <li>Multi-signature security protocols protect funds</li>
          </ul>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Investment Requirements and Structure</h3>
        
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-yellow-800">Group-Based Contracts</h4>
          <p className="text-gray-700 mb-3">
            You join small groups (4-8 people) with shared investment contracts and commitment levels:
          </p>
          <div className="space-y-3">
            <div>
              <h5 className="font-semibold">Contract Terms</h5>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Lock-up periods from 1-20 years</li>
                <li>Regular deposit requirements (weekly or monthly)</li>
                <li>Penalties for missed deposits to maintain group commitment</li>
                <li>Emergency withdrawal options for your deposits</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold">Commitment Levels</h5>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>Heavy Rigor:</strong> Weekly deposits with increasing amounts over time</li>
                <li><strong>Medium Rigor:</strong> Fixed weekly deposits</li>
                <li><strong>Light Rigor:</strong> Monthly deposits</li>
              </ul>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Risk Management</h3>
        
        <div className="bg-red-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-red-800">Built-in Protections</h4>
          <p className="text-gray-700 mb-3">
            The system includes multiple layers of protection against common DeFi risks:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Protocol Selection:</strong> Only audited, established DeFi protocols are used</li>
            <li><strong>Diversification:</strong> Funds are spread across multiple protocol types</li>
            <li><strong>Phase Transitions:</strong> Automatic shifts to preservation mode when targets are met</li>
            <li><strong>Emergency Controls:</strong> Built-in safeguards and withdrawal options</li>
            <li><strong>Legal Framework:</strong> Clear terms of service and governance structure</li>
          </ul>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Why This System Works</h3>
        
        <div className="bg-teal-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-teal-800">Key Advantages</h4>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Systematic Approach:</strong> Removes emotion and speculation from crypto investing</li>
            <li><strong>Compound Interest:</strong> Automated reinvestment maximizes compounding effects</li>
            <li><strong>Professional Strategies:</strong> Institutional-grade methodologies made accessible</li>
            <li><strong>Risk Management:</strong> Diversified approach with built-in safety measures</li>
            <li><strong>Long-term Focus:</strong> Encourages disciplined, consistent investing</li>
            <li><strong>Transparency:</strong> All operations visible on blockchain</li>
            <li><strong>Community:</strong> Shared commitment with like-minded investors</li>
          </ul>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Understanding the Commitment</h3>
        
        <div className="bg-orange-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-orange-800">What You're Actually Doing</h4>
          <p className="text-gray-700 mb-4">
            You're not giving money to random people or trusting human fund managers. Instead, you're:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Participating in an automated, algorithmic investment system</li>
            <li>Joining a small group with shared financial goals and timeline</li>
            <li>Committing to regular deposits over a fixed period</li>
            <li>Benefiting from institutional-grade DeFi strategies</li>
            <li>Building wealth through disciplined, systematic investing</li>
            <li>Learning about DeFi while your money works automatically</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">Key Takeaways</h4>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>TVC is a decentralized software coordination platform for long-term wealth building</li>
            <li>Web2-Soul, Web3-Body architecture: familiar login, 100% non-custodial ownership</li>
            <li>Users don't "trade" — they select Risk & Rigor levels across established DeFi protocols</li>
            <li>Deterministic, immutable contract logic governed by unanimous participant consent</li>
            <li>Risk tiers: Conservative (Aave V3), Medium (sUSDC savings), Risky (Morpho institutional vaults)</li>
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
