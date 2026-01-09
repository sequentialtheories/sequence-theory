import ArticleLayout from "@/components/ArticleLayout";
import { Zap, Shield, Globe, TrendingUp, Lock, Users, AlertTriangle, Lightbulb, Target, CheckCircle } from "lucide-react";

const CryptocurrenciesFundamentals = () => {
  return (
    <ArticleLayout title="Cryptocurrencies Fundamentals" level="Beginner">
      <div className="space-y-12">
        {/* Introduction Hero */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">What Are Cryptocurrencies?</h2>
          </div>
          <p className="text-xl text-gray-700 leading-relaxed">
            Cryptocurrencies are digital or virtual currencies secured by cryptography and built on blockchain technology.
            They represent a fundamental shift in how we think about money and value exchange, offering unprecedented 
            control, transparency, and global accessibility.
          </p>
        </div>

        {/* Key Characteristics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: "Decentralized",
              description: "No central authority controls the currency",
              color: "from-green-500 to-emerald-600"
            },
            {
              icon: Globe,
              title: "Digital Native",
              description: "Exist only in digital form",
              color: "from-blue-500 to-cyan-600"
            },
            {
              icon: Lock,
              title: "Cryptographically Secure",
              description: "Protected by advanced cryptography",
              color: "from-purple-500 to-violet-600"
            },
            {
              icon: Users,
              title: "Transparent",
              description: "All transactions are recorded on a public ledger",
              color: "from-orange-500 to-red-600"
            },
            {
              icon: CheckCircle,
              title: "Immutable",
              description: "Once recorded, transactions cannot be easily changed",
              color: "from-teal-500 to-green-600"
            },
            {
              icon: TrendingUp,
              title: "Programmable",
              description: "Can be programmed with smart contract functionality",
              color: "from-pink-500 to-rose-600"
            }
          ].map((characteristic, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className={`bg-gradient-to-r ${characteristic.color} p-3 rounded-lg inline-block mb-4`}>
                <characteristic.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{characteristic.title}</h3>
              <p className="text-gray-600">{characteristic.description}</p>
            </div>
          ))}
        </div>

        {/* How Cryptocurrencies Work */}
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 border border-cyan-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-2 rounded-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            How Cryptocurrencies Work
          </h3>
          <p className="text-gray-700 mb-6 text-lg">
            Cryptocurrencies operate on blockchain networks, which are distributed ledgers maintained by networks of computers:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Blockchain",
                description: "A chain of blocks containing transaction data",
                icon: "🔗"
              },
              {
                title: "Mining/Validation",
                description: "Process of confirming transactions and securing the network",
                icon: "⛏️"
              },
              {
                title: "Wallets",
                description: "Software that stores private keys and enables transactions",
                icon: "👛"
              },
              {
                title: "Addresses",
                description: "Unique identifiers for sending and receiving funds",
                icon: "📍"
              }
            ].map((concept, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-cyan-200">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{concept.icon}</span>
                  <h4 className="font-semibold text-gray-900">{concept.title}</h4>
                </div>
                <p className="text-gray-600">{concept.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Major Cryptocurrencies */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            Major Cryptocurrencies
          </h3>
          <div className="space-y-4">
            {[
              {
                name: "Bitcoin (BTC)",
                description: "The first and largest cryptocurrency, digital gold",
                color: "bg-orange-500",
                symbol: "₿"
              },
              {
                name: "Ethereum (ETH)",
                description: "Platform for smart contracts and decentralized applications",
                color: "bg-blue-500",
                symbol: "Ξ"
              },
              {
                name: "Stablecoins",
                description: "Cryptocurrencies pegged to stable assets like USD",
                color: "bg-green-500",
                symbol: "$"
              },
              {
                name: "Altcoins",
                description: "Alternative cryptocurrencies with various use cases",
                color: "bg-purple-500",
                symbol: "🔮"
              }
            ].map((crypto, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`${crypto.color} text-white p-3 rounded-lg font-bold text-xl min-w-[3rem] text-center`}>
                  {crypto.symbol}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{crypto.name}</h4>
                  <p className="text-gray-600">{crypto.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 border border-green-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-2 rounded-lg">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            Cryptocurrency Use Cases
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "🏦", title: "Store of Value", desc: "Preserving wealth against inflation" },
              { icon: "💳", title: "Medium of Exchange", desc: "Paying for goods and services" },
              { icon: "🌍", title: "Remittances", desc: "Sending money across borders quickly" },
              { icon: "🔄", title: "DeFi Participation", desc: "Accessing decentralized financial services" },
              { icon: "📈", title: "Investment", desc: "Speculating on price appreciation" },
              { icon: "🎮", title: "Digital Ownership", desc: "Gaming assets and digital collectibles" }
            ].map((useCase, index) => (
              <div key={index} className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">{useCase.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-1">{useCase.title}</h4>
                <p className="text-sm text-gray-600">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Advantages vs Risks */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Advantages */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200">
            <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              Advantages
            </h3>
            <ul className="space-y-3">
              {[
                "24/7 global accessibility",
                "Lower transaction fees for international transfers",
                "Financial inclusion for the unbanked",
                "Programmable money with smart contracts",
                "Protection against currency debasement",
                "Pseudonymous transactions"
              ].map((advantage, index) => (
                <li key={index} className="flex items-center gap-2 text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {advantage}
                </li>
              ))}
            </ul>
          </div>

          {/* Risks */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200">
            <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Risks & Challenges
            </h3>
            <ul className="space-y-3">
              {[
                "Significant price volatility",
                "Regulatory uncertainty",
                "Security risks and potential hacks",
                "Network congestion and high fees",
                "Environmental concerns",
                "Technical complexity for users"
              ].map((risk, index) => (
                <li key={index} className="flex items-center gap-2 text-red-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Getting Started Safely */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            Getting Started Safely
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { step: "01", title: "Start Small", desc: "Begin with amounts you can afford to lose" },
              { step: "02", title: "Use Reputable Platforms", desc: "Choose established exchanges and wallets" },
              { step: "03", title: "Secure Your Keys", desc: "Protect your private keys and seed phrases" },
              { step: "04", title: "Research First", desc: "Understand before investing in any cryptocurrency" },
              { step: "05", title: "Know Tax Rules", desc: "Understand implications in your jurisdiction" },
              { step: "06", title: "Avoid Scams", desc: "Be wary of too-good-to-be-true offers" }
            ].map((tip, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-purple-200">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm px-3 py-1 rounded-full min-w-[2.5rem] text-center">
                  {tip.step}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{tip.title}</h4>
                  <p className="text-gray-600 text-sm">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Future Trends */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-8 border border-slate-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">The Future of Cryptocurrencies</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: "🏛️", title: "CBDCs", desc: "Central Bank Digital Currencies" },
              { icon: "⚡", title: "Better Scaling", desc: "Improved transaction speed and costs" },
              { icon: "👥", title: "Mainstream UX", desc: "User-friendly interfaces" },
              { icon: "🤝", title: "TradFi Integration", desc: "Connection with traditional finance" },
              { icon: "🔒", title: "Enhanced Privacy", desc: "Better privacy features" },
              { icon: "🌱", title: "Sustainability", desc: "Eco-friendly consensus mechanisms" }
            ].map((trend, index) => (
              <div key={index} className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">{trend.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-1">{trend.title}</h4>
                <p className="text-sm text-gray-600">{trend.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Target className="h-6 w-6" />
            Key Takeaways
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Cryptocurrencies are digital currencies built on blockchain technology",
              "They offer unique advantages but also come with significant risks",
              "Understanding the technology is crucial before investing",
              "Start small and prioritize security when getting involved",
              "The space is rapidly evolving with new developments regularly"
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

export default CryptocurrenciesFundamentals;