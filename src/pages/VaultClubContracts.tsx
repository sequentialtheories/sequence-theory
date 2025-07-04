
import ArticleLayout from "@/components/ArticleLayout";

const VaultClubContracts = () => {
  return (
    <ArticleLayout title="Vault Club Investment Contracts" level="Intermediate">
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900">What Is The Vault Club?</h2>
        
        <div className="bg-cyan-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-cyan-800">A Structured DeFi Investment System</h3>
          <p className="text-gray-700 mb-4">
            The Vault Club is a sophisticated, automated investment system that uses smart contracts on the Polygon blockchain. 
            It's not about giving your money to random people - it's about participating in a carefully designed, 
            algorithmic system that manages DeFi investments through proven protocols.
          </p>
          <p className="text-gray-700">
            Think of it like a high-tech savings account that automatically invests your money across different 
            DeFi protocols to generate returns, with built-in protections and a structured approach to wealth building.
          </p>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">How The System Actually Works</h3>
        
        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-purple-800">The Two-Phase Strategy</h4>
          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-purple-700">Phase 1: The Engine Pool (Growth Phase)</h5>
              <p className="text-gray-700 mb-2">
                Your deposits are automatically allocated across three different "strands" of DeFi protocols:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>AAVE Base Capital (10%):</strong> Stable lending at ~5% APY for security</li>
                <li><strong>AAVE Long-Term Yield (60%):</strong> Staking for ~10% APY</li>
                <li><strong>Quickswap Accelerator (30%):</strong> Liquidity farming for ~15% APY</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-purple-700">Phase 2: Wealth Preservation</h5>
              <p className="text-gray-700">
                When the system reaches certain targets (50% completion or ~$2M total value), 
                it automatically transitions to accumulating Wrapped Bitcoin (wBTC) for long-term wealth preservation.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">The Smart Contract Structure</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 text-green-800">Automated Execution</h4>
            <p className="text-gray-700 mb-3">
              Everything runs on smart contracts with no human intervention needed for investment decisions:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Routed Reinvestment Logic (RRL) automatically manages capital flow</li>
              <li>Profits are harvested and reinvested weekly (168 hours fixed)</li>
              <li>Chainlink Keepers provide automation</li>
              <li>Multi-signature security protocols</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 text-blue-800">Group-Based Contracts</h4>
            <p className="text-gray-700 mb-3">
              You join small groups (4-8 people) with shared investment contracts:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Lock-up periods from 1-20 years</li>
              <li>Regular weekly deposits required</li>
              <li>Penalties for missed deposits (3% share decrease)</li>
              <li>Emergency withdrawal option (deposits only, no profits)</li>
            </ul>
          </div>
        </div>

        <h3 className="text-2xl font-semibent text-gray-900">Investment Requirements and Structure</h3>
        
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-yellow-800">Commitment Levels</h4>
          <div className="space-y-3">
            <div>
              <h5 className="font-semibold">Heavy Rigor (Highest Returns)</h5>
              <p className="text-gray-700">Years 1-3: $100/week → Years 4-6: $200/week → Years 7-10: $300/week → Years 11+: $400/week</p>
            </div>
            <div>
              <h5 className="font-semibold">Medium Rigor</h5>
              <p className="text-gray-700">Weekly deposits: $50, $100, $200, or $250</p>
            </div>
            <div>
              <h5 className="font-semibold">Light Rigor</h5>
              <p className="text-gray-700">Monthly deposits: $100, $150, $200, or $250</p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Technical Infrastructure</h3>
        
        <div className="bg-indigo-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-indigo-800">Built on Proven Technology</h4>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Network:</strong> Polygon PoS (low fees, fast transactions)</li>
            <li><strong>Contracts:</strong> Solidity with modular design</li>
            <li><strong>Protocols:</strong> Only audited DeFi protocols (AAVE, Quickswap)</li>
            <li><strong>Automation:</strong> Chainlink Keepers for reliable execution</li>
            <li><strong>Security:</strong> Multi-signature wallets and audit recommendations</li>
          </ul>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Risk Management</h3>
        
        <div className="space-y-4">
          <div className="bg-red-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 text-red-800">Built-in Protections</h4>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>DeFi Yield Drop:</strong> Phase 2 transition and Subscription Backed Borrowing</li>
              <li><strong>Protocol Failure:</strong> Only audited protocols used</li>
              <li><strong>Smart Contract Failure:</strong> Modular logic with emergency overrides</li>
              <li><strong>User Inconsistency:</strong> Penalties and education/awareness programs</li>
              <li><strong>Regulatory Uncertainty:</strong> Legal governance and clear Terms of Service</li>
            </ul>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Projected Outcomes</h3>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">Conservative vs Aggressive Scenarios</h4>
          <p className="text-gray-700 mb-4">
            Based on 15+ years with high rigor and 8-person groups:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold text-gray-700">Conservative Scenario</h5>
              <p className="text-gray-700">Total Vault: ~$2M | Per User: ~$250k</p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-700">Aggressive Scenario</h5>
              <p className="text-gray-700">Total Vault: $6M | Per User: $750k</p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Why This System Works</h3>
        
        <div className="space-y-4">
          <div className="bg-teal-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 text-teal-800">Key Advantages</h4>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Systematic Approach:</strong> Removes emotion and speculation from crypto investing</li>
              <li><strong>Compound Interest:</strong> Automated reinvestment maximizes compounding effects</li>
              <li><strong>Professional Strategies:</strong> Quantitative hedge fund methodologies made accessible</li>
              <li><strong>Risk Management:</strong> Diversified across protocols with built-in safety measures</li>
              <li><strong>Long-term Focus:</strong> Encourages disciplined, consistent investing</li>
              <li><strong>Transparency:</strong> All operations visible on blockchain</li>
            </ul>
          </div>
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
          </ul>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">Key Takeaways</h4>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>The Vault Club is an automated DeFi investment system, not a human-managed fund</li>
            <li>Smart contracts handle all investment decisions and capital allocation</li>
            <li>Two-phase strategy: growth through DeFi yields, then preservation through Bitcoin</li>
            <li>Small group structure with 1-20 year commitment periods</li>
            <li>Built-in risk management and emergency protections</li>
            <li>Designed for long-term wealth building, not speculation</li>
            <li>Transparent, blockchain-based operations</li>
          </ul>
        </div>
      </div>
    </ArticleLayout>
  );
};

export default VaultClubContracts;
