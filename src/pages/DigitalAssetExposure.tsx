
import ArticleLayout from "@/components/ArticleLayout";
import { Link } from "react-router-dom";
import { PlayCircle } from "lucide-react";

const DigitalAssetExposure = () => {
  return (
    <ArticleLayout title="Digital Asset Exposure" level="Intermediate">
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900">Understanding Individual Digital Assets</h2>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-blue-800">Beyond Generic "Crypto"</h3>
          <p className="text-gray-700 mb-4">
            While many people think of digital assets as just "cryptocurrency," each token represents 
            a unique technology, use case, and economic model. Understanding the specifics of major 
            tokens helps you make informed decisions about exposure and diversification.
          </p>
          <p className="text-gray-700">
            This module explores the technical foundations, real-world applications, and investment 
            considerations for specific digital assets that have established themselves as foundational 
            to the Web3 ecosystem.
          </p>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Bitcoin (BTC): Digital Gold</h3>
        
        <div className="bg-orange-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-orange-800">The Original Store of Value</h4>
          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-orange-700">Technical Specifications</h5>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>Consensus Mechanism:</strong> Proof of Work (PoW) with SHA-256 mining</li>
                <li><strong>Supply Cap:</strong> Fixed at 21 million coins, creating built-in scarcity</li>
                <li><strong>Block Time:</strong> ~10 minutes, optimized for security over speed</li>
                <li><strong>Halving Events:</strong> Mining rewards cut in half every 4 years</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-orange-700">Investment Thesis</h5>
              <p className="text-gray-700">
                Bitcoin functions as "digital gold" - a store of value that's portable, divisible, 
                and immune to government monetary policy. Its fixed supply makes it deflationary 
                by design, potentially protecting against currency debasement.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Ethereum (ETH): The Web3 Platform</h3>
        
        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-purple-800">More Than Just Currency</h4>
          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-purple-700">Technical Innovation</h5>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>Smart Contracts:</strong> Self-executing contracts with built-in logic</li>
                <li><strong>Virtual Machine:</strong> Ethereum Virtual Machine (EVM) runs decentralized applications</li>
                <li><strong>Proof of Stake:</strong> Transitioned from mining to staking for energy efficiency</li>
                <li><strong>Gas System:</strong> Network fees paid in ETH for computational resources</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-purple-700">Ethereum's Role in Web3</h5>
              <p className="text-gray-700 mb-2">
                Ethereum serves as the foundation for Web3 - the decentralized internet. It hosts:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Decentralized Finance (DeFi) protocols</li>
                <li>Non-Fungible Token (NFT) marketplaces</li>
                <li>Decentralized Autonomous Organizations (DAOs)</li>
                <li>Web3 applications and games</li>
              </ul>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Solana (SOL): High-Performance Blockchain</h3>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-green-800">Speed and Scalability Focus</h4>
          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-green-700">Technical Advantages</h5>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>Proof of History:</strong> Innovative consensus mechanism for faster transactions</li>
                <li><strong>High Throughput:</strong> Capable of 65,000+ transactions per second</li>
                <li><strong>Low Fees:</strong> Transaction costs typically under $0.01</li>
                <li><strong>Rust Programming:</strong> Built for performance and developer efficiency</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-green-700">Use Cases</h5>
              <p className="text-gray-700">
                Solana's speed makes it ideal for applications requiring real-time interactions: 
                high-frequency trading, gaming, social media, and micropayments. It's often called 
                the "Visa of blockchains" for its transaction processing capabilities.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Chainlink (LINK): The Oracle Network</h3>
        
        <div className="bg-cyan-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-cyan-800">Connecting Blockchains to Reality</h4>
          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-cyan-700">The Oracle Problem</h5>
              <p className="text-gray-700 mb-2">
                Blockchains can't access external data (stock prices, weather, sports scores) 
                without compromising decentralization. Chainlink solves this through:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>Decentralized Oracles:</strong> Multiple data sources prevent single points of failure</li>
                <li><strong>Cryptographic Proofs:</strong> Verifiable data integrity</li>
                <li><strong>Economic Incentives:</strong> LINK tokens reward accurate data providers</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-cyan-700">Critical Infrastructure</h5>
              <p className="text-gray-700">
                Chainlink powers price feeds for most DeFi protocols, enabling lending, derivatives, 
                and automated trading. It's essential infrastructure that most users never see but 
                rely on constantly.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">The Power of Tokenization</h3>
        
        <div className="bg-indigo-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-indigo-800">Beyond Digital Currency</h4>
          <p className="text-gray-700 mb-4">
            Tokenization represents ownership, access rights, or utility in digital form. 
            This creates entirely new economic models and investment opportunities:
          </p>
          <div className="space-y-3">
            <div>
              <h5 className="font-semibold">Utility Tokens</h5>
              <p className="text-gray-700">
                Provide access to specific services or features within a platform. 
                Like arcade tokens, but for decentralized services.
              </p>
            </div>
            <div>
              <h5 className="font-semibold">Governance Tokens</h5>
              <p className="text-gray-700">
                Give holders voting rights in protocol decisions. Essentially digital 
                shareholder rights without traditional corporate structures.
              </p>
            </div>
            <div>
              <h5 className="font-semibold">Yield-Bearing Tokens</h5>
              <p className="text-gray-700">
                Automatically generate returns through built-in mechanisms like staking 
                rewards or protocol fees.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Web3 and Decentralized Applications</h3>
        
        <div className="bg-rose-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-rose-800">The Next Internet Evolution</h4>
          <p className="text-gray-700 mb-4">
            Web3 represents a shift from centralized platforms to user-owned networks. 
            Instead of data being controlled by companies, users own their digital assets and identity:
          </p>
          <div className="space-y-3">
            <div>
              <h5 className="font-semibold">Decentralized Finance (DeFi)</h5>
              <p className="text-gray-700">
                Banking services without banks - lending, borrowing, and trading through 
                smart contracts instead of traditional financial institutions.
              </p>
            </div>
            <div>
              <h5 className="font-semibold">Decentralized Identity</h5>
              <p className="text-gray-700">
                Your digital identity and reputation aren't tied to specific platforms. 
                You can move between applications while keeping your history and assets.
              </p>
            </div>
            <div>
              <h5 className="font-semibold">Programmable Money</h5>
              <p className="text-gray-700">
                Money that can execute complex logic automatically - payments that split 
                between multiple recipients, subscriptions that adjust based on usage, etc.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Investment Considerations</h3>
        
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-yellow-800">Beyond Price Speculation</h4>
          <p className="text-gray-700 mb-4">
            Understanding the technology helps you evaluate tokens as investments rather than 
            just price movements:
          </p>
          <div className="space-y-3">
            <div>
              <h5 className="font-semibold">Network Effects</h5>
              <p className="text-gray-700">
                Tokens become more valuable as more people use the underlying network. 
                Ethereum's value grows with DeFi adoption, Chainlink's with oracle usage.
              </p>
            </div>
            <div>
              <h5 className="font-semibold">Technical Moats</h5>
              <p className="text-gray-700">
                Some tokens have technical advantages that are difficult to replicate. 
                Bitcoin's security, Ethereum's developer ecosystem, Solana's performance architecture.
              </p>
            </div>
            <div>
              <h5 className="font-semibold">Tokenomics</h5>
              <p className="text-gray-700">
                How tokens are created, distributed, and used affects their long-term value. 
                Deflationary mechanisms, staking rewards, and utility requirements all matter.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Building Exposure Strategically</h3>
        
        <div className="bg-teal-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-teal-800">Portfolio Construction</h4>
          <p className="text-gray-700 mb-4">
            Rather than buying random tokens, consider exposure based on different roles in the ecosystem:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Store of Value:</strong> Bitcoin for digital gold exposure</li>
            <li><strong>Platform Layer:</strong> Ethereum for Web3 infrastructure exposure</li>
            <li><strong>Performance Layer:</strong> Solana for high-speed application exposure</li>
            <li><strong>Infrastructure:</strong> Chainlink for critical service exposure</li>
            <li><strong>Emerging Sectors:</strong> Tokens representing new use cases or geographies</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">Key Takeaways</h4>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Each major token serves different functions in the digital asset ecosystem</li>
            <li>Bitcoin provides store-of-value exposure with fixed supply economics</li>
            <li>Ethereum powers Web3 applications and serves as the foundation for DeFi</li>
            <li>Solana offers high-performance blockchain capabilities for real-time applications</li>
            <li>Chainlink provides critical oracle services that connect blockchains to real-world data</li>
            <li>Tokenization creates new economic models beyond traditional currency</li>
            <li>Web3 represents user ownership of digital assets and identity</li>
            <li>Understanding technology helps evaluate tokens as investments, not just speculation</li>
            <li>Strategic exposure considers each token's role rather than just price potential</li>
          </ul>
        </div>

        {/* Continue Your Learning Journey */}
        <section className="bg-gray-50 rounded-xl p-8">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">Continue Your Learning Journey</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Link 
                to="/learn/vault-club-contracts"
                className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <PlayCircle className="h-6 w-6 text-purple-600" />
                  <span className="font-semibold text-gray-900">Previous: Investment Contracts</span>
                </div>
                <p className="text-gray-600">Understand how Vault Club contracts work and their advantages for new investors.</p>
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

        {/* Ready to Put This Into Practice */}
        <section className="py-16 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-xl">
          <div className="container mx-auto px-6 text-center">
            <h3 className="text-3xl font-bold mb-6">Ready to Put This Into Practice?</h3>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join The Vault Club and start applying what you've learned with our structured investment contracts.
            </p>
            <button className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105">
              Join The Vault Club
            </button>
          </div>
        </section>
      </div>
    </ArticleLayout>
  );
};

export default DigitalAssetExposure;
