import ArticleLayout from "@/components/ArticleLayout";
import { Coins, Zap, Shield, Users, Crown, Palette, Building, TrendingUp, AlertTriangle, CheckCircle, Lightbulb, Target, Rocket, Globe, Key, Award, Lock, Gem, Layers, Network, BarChart3, Banknote, Wallet, ArrowUpDown, Settings } from "lucide-react";

const TokensTokenization = () => {
  return (
    <ArticleLayout title="Tokens & Tokenization" level="Intermediate">
      <div className="space-y-12">
        {/* Introduction Hero */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-3 rounded-xl">
              <Coins className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Understanding Tokens and Tokenization</h2>
          </div>
          <p className="text-xl text-gray-700 leading-relaxed">
            Tokens represent digital assets on blockchain networks, enabling revolutionary forms of value creation, ownership, and exchange. Tokenization transforms real-world assets into programmable digital tokens that can be stored, transferred, and traded globally.
          </p>
        </div>

        {/* What Are Tokens */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg">
              <Gem className="h-6 w-6 text-white" />
            </div>
            What Are Tokens?
          </h3>
          <p className="text-lg text-gray-700 mb-6">
            Tokens are digital assets that represent something of value on a blockchain network. Unlike cryptocurrencies that have their own blockchain, tokens are built on existing platforms using smart contracts.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "🔗", title: "Digital Representation", desc: "Represent anything from money to assets to rights" },
              { icon: "🤖", title: "Smart Contract Powered", desc: "Built using programmable smart contracts" },
              { icon: "💸", title: "Transferable", desc: "Can be sent between wallets and traded" },
              { icon: "⚙️", title: "Programmable", desc: "Can have built-in rules and behaviors" }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-purple-200 hover:shadow-md transition-all">
                <div className="text-2xl mb-2">{feature.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Types of Tokens */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-2 rounded-lg">
              <Layers className="h-6 w-6 text-white" />
            </div>
            Types of Tokens
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Utility Tokens",
                description: "Provide access to services or platforms",
                examples: ["Binance Coin (BNB)", "Chainlink (LINK)", "Filecoin (FIL)"],
                uses: ["Payment for services", "Platform access", "Discount mechanisms"],
                color: "from-orange-500 to-yellow-600"
              },
              {
                icon: Shield,
                title: "Security Tokens",
                description: "Represent ownership in assets or companies",
                examples: ["Tokenized stocks", "Real estate tokens", "Revenue-sharing tokens"],
                uses: ["Asset ownership", "Regulatory compliance", "Investment vehicles"],
                color: "from-blue-500 to-cyan-600"
              },
              {
                icon: Users,
                title: "Governance Tokens",
                description: "Enable voting rights in decentralized protocols",
                examples: ["Uniswap (UNI)", "Compound (COMP)", "Aave (AAVE)"],
                uses: ["Protocol voting", "Fee structures", "Treasury allocation"],
                color: "from-purple-500 to-violet-600"
              },
              {
                icon: Palette,
                title: "Non-Fungible Tokens (NFTs)",
                description: "Represent unique, one-of-a-kind digital assets (unlike fungible tokens where each unit is identical)",
                examples: ["Digital art", "Collectibles", "Game items"],
                uses: ["Unique ownership", "Digital collectibles", "Identity tokens"],
                color: "from-pink-500 to-rose-600"
              },
              {
                icon: BarChart3,
                title: "Stablecoins",
                description: "Maintain stable value relative to reference assets",
                examples: ["USDC", "USDT", "DAI"],
                uses: ["Price stability", "Store of value", "Payment medium"],
                color: "from-green-500 to-emerald-600"
              }
            ].map((token, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-emerald-200 hover:shadow-lg transition-all duration-300">
                <div className={`bg-gradient-to-r ${token.color} p-3 rounded-lg inline-block mb-4`}>
                  <token.icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{token.title}</h4>
                <p className="text-gray-600 mb-4">{token.description}</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Examples:</p>
                    {token.examples.map((example, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-emerald-700">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                        {example}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Use Cases:</p>
                    {token.uses.map((use, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        {use}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Token Standards */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-8 border border-slate-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-slate-600 to-gray-600 p-2 rounded-lg">
              <Settings className="h-6 w-6 text-white" />
            </div>
            Token Standards
          </h3>
          <p className="text-lg text-gray-700 mb-6">
            Standardized protocols that define how tokens behave on blockchain networks.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Ethereum Standards */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <span className="text-white font-bold text-sm">ETH</span>
                </div>
                Ethereum Standards
              </h4>
              <div className="space-y-3">
                {[
                  { name: "ERC-20", desc: "Standard for fungible tokens (most common)" },
                  { name: "ERC-721", desc: "Standard for non-fungible tokens (NFTs)" },
                  { name: "ERC-1155", desc: "Multi-token standard for both fungible and non-fungible" },
                  { name: "ERC-777", desc: "Advanced fungible token with additional features" }
                ].map((standard, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-blue-900">{standard.name}</h5>
                      <p className="text-blue-700 text-sm">{standard.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Blockchain Standards */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="bg-purple-500 p-2 rounded-lg">
                  <Network className="h-5 w-5 text-white" />
                </div>
                Other Blockchain Standards
              </h4>
              <div className="space-y-3">
                {[
                  { name: "BEP-20", desc: "Binance Smart Chain token standard" },
                  { name: "TRC-20", desc: "TRON blockchain token standard" },
                  { name: "SPL", desc: "Solana Program Library token standard" }
                ].map((standard, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-purple-900">{standard.name}</h5>
                      <p className="text-purple-700 text-sm">{standard.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tokenization Process */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-2 rounded-lg">
              <ArrowUpDown className="h-6 w-6 text-white" />
            </div>
            The Tokenization Process
          </h3>
          <p className="text-lg text-gray-700 mb-6">
            How real-world assets are converted into digital tokens:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { step: 1, title: "Asset Identification", desc: "Determine what asset to tokenize" },
              { step: 2, title: "Legal Framework", desc: "Establish ownership rights and compliance" },
              { step: 3, title: "Valuation", desc: "Determine the asset's worth and token allocation" },
              { step: 4, title: "Smart Contract Creation", desc: "Program the token's rules and behaviors" },
              { step: 5, title: "Token Minting", desc: "Create the digital tokens on the blockchain" },
              { step: 6, title: "Distribution", desc: "Allocate tokens to investors or stakeholders" }
            ].map((process, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-amber-200 hover:shadow-md transition-all">
                <div className="bg-amber-600 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mb-3">
                  {process.step}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{process.title}</h4>
                <p className="text-gray-600 text-sm">{process.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits of Tokenization */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            Benefits of Tokenization
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "💧", title: "Increased Liquidity", desc: "Previously illiquid assets become tradeable" },
              { icon: "🧩", title: "Fractional Ownership", desc: "Expensive assets can be divided into smaller portions" },
              { icon: "🌍", title: "Global Accessibility", desc: "Anyone worldwide can invest in tokenized assets" },
              { icon: "⏰", title: "24/7 Trading", desc: "No market hours restrictions" },
              { icon: "✂️", title: "Reduced Intermediaries", desc: "Lower costs and faster transactions" },
              { icon: "👁️", title: "Transparent Ownership", desc: "Blockchain records provide clear ownership history" },
              { icon: "🤖", title: "Programmable Features", desc: "Automated dividends, voting, and other functions" }
            ].map((benefit, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-green-200 hover:shadow-md transition-all">
                <div className="text-2xl mb-2">{benefit.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                <p className="text-gray-600 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Real-World Tokenization Examples */}
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-8 border border-violet-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-2 rounded-lg">
              <Building className="h-6 w-6 text-white" />
            </div>
            Real-World Tokenization Examples
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: "🏠",
                title: "Real Estate",
                applications: [
                  "Property Fractionalization: Divide expensive properties into affordable shares",
                  "REITs on Blockchain: Digital real estate investment trusts",
                  "Global Investment: International property investment without borders"
                ],
                color: "from-blue-500 to-cyan-600"
              },
              {
                icon: "🎨",
                title: "Art and Collectibles",
                applications: [
                  "Masterpiece Shares: Own fractions of famous artworks",
                  "Provenance Tracking: Transparent ownership and authenticity records",
                  "Liquidity for Collectors: Easier buying and selling of rare items"
                ],
                color: "from-pink-500 to-rose-600"
              },
              {
                icon: "📦",
                title: "Commodities",
                applications: [
                  "Digital Gold: Gold-backed tokens for easy trading",
                  "Agricultural Products: Tokenized crops and farming investments",
                  "Energy Trading: Renewable energy credits and carbon tokens"
                ],
                color: "from-green-500 to-emerald-600"
              },
              {
                icon: "💡",
                title: "Intellectual Property",
                applications: [
                  "Patent Tokens: Share in patent royalties",
                  "Music Rights: Ownership in song royalties and publishing",
                  "Brand Licensing: Tokenized trademark and licensing agreements"
                ],
                color: "from-purple-500 to-violet-600"
              }
            ].map((example, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-violet-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{example.icon}</span>
                  <h4 className="text-lg font-semibold text-gray-900">{example.title}</h4>
                </div>
                <div className="space-y-2">
                  {example.applications.map((app, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-violet-700">
                      <div className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{app}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Token Economics & Distribution */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Token Economics */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-200">
            <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Token Economics (Tokenomics)
            </h3>
            <p className="text-indigo-700 mb-4">The economic design and incentive structures of token systems:</p>
            <div className="space-y-3">
              {[
                "Supply Mechanisms: How tokens are created and distributed",
                "Demand Drivers: What creates value and demand for tokens",
                "Inflation/Deflation: How token supply changes over time",
                "Utility Design: How tokens are used within their ecosystem",
                "Incentive Alignment: Ensuring all participants benefit from success"
              ].map((point, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-indigo-700">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Token Distribution */}
          <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-6 border border-cyan-200">
            <h3 className="text-xl font-bold text-cyan-800 mb-4 flex items-center gap-2">
              <Rocket className="h-6 w-6" />
              Token Distribution Methods
            </h3>
            <p className="text-cyan-700 mb-4">Various ways tokens are initially distributed to users:</p>
            <div className="space-y-3">
              {[
                "Initial Coin Offering (ICO): Public token sale",
                "Security Token Offering (STO): Regulated token sale",
                "Initial DEX Offering (IDO): Launch on decentralized exchanges",
                "Airdrops: Free distribution to eligible users",
                "Fair Launch: No pre-sale, equal opportunity for all",
                "Liquidity Mining: Earn tokens by providing liquidity"
              ].map((method, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-cyan-700">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{method}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Challenges and Future */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Challenges */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200">
            <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Challenges and Risks
            </h3>
            <div className="space-y-3">
              {[
                "Regulatory Uncertainty: Evolving legal frameworks",
                "Technical Complexity: Smart contract vulnerabilities",
                "Market Volatility: Token prices can be highly volatile",
                "Liquidity Risks: Some tokens may have limited trading volume",
                "Custody Challenges: Secure storage of digital assets",
                "Valuation Difficulties: Determining fair value for unique assets"
              ].map((challenge, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-red-700">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{challenge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Future */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <Rocket className="h-6 w-6" />
              Future of Tokenization
            </h3>
            <div className="space-y-3">
              {[
                "Central Bank Digital Currencies (CBDCs): Government-issued digital currencies",
                "Corporate Tokens: Companies issuing their own utility tokens",
                "Carbon Credit Tokens: Environmental impact tokenization",
                "Identity Tokens: Self-sovereign digital identity",
                "Cross-Chain Tokens: Assets that work across multiple blockchains",
                "Dynamic NFTs: Tokens that change based on external conditions"
              ].map((trend, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-green-700">
                  <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{trend}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-violet-600 p-2 rounded-lg">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            Getting Started with Tokens
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { step: 1, title: "Education First", desc: "Understand different token types and their purposes" },
              { step: 2, title: "Start Small", desc: "Begin with well-established tokens and small amounts" },
              { step: 3, title: "Research Projects", desc: "Investigate tokenomics, team, and use cases" },
              { step: 4, title: "Use Reputable Platforms", desc: "Trade on established exchanges and platforms" },
              { step: 5, title: "Secure Storage", desc: "Use hardware wallets for significant holdings" },
              { step: 6, title: "Stay Informed", desc: "Follow regulatory developments and market trends" }
            ].map((step, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-purple-200 hover:shadow-md transition-all">
                <div className="bg-purple-600 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mb-3">
                  {step.step}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Target className="h-6 w-6" />
            Key Takeaways
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Tokens represent digital ownership of assets, rights, or access on blockchain networks",
              "Different token types serve various purposes from utility to governance to unique collectibles",
              "Tokenization enables fractional ownership and increased liquidity for traditionally illiquid assets",
              "Token standards ensure interoperability and consistent behavior across platforms",
              "Successful tokenomics requires careful balance of supply, demand, and utility",
              "While tokenization offers many benefits, it also comes with technical and regulatory challenges",
              "The future of tokenization includes CBDCs, corporate tokens, and cross-chain compatibility"
            ].map((takeaway, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
                <span className="text-white">{takeaway}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ArticleLayout>
  );
};

export default TokensTokenization;