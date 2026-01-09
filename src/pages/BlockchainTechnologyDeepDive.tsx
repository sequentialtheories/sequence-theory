import ArticleLayout from "@/components/ArticleLayout";
import { 
  Blocks, Link, Shield, Cpu, Zap, Users, Network, Lock, 
  Eye, EyeOff, Leaf, Vote, Globe, AlertTriangle, CheckCircle, 
  Lightbulb, Target, Settings, Database, ArrowRight, Layers,
  TrendingUp, Key, Hash, Webhook, GitBranch, Timer, Scale,
  Building, FileText, Heart, Smartphone, Cloud, Brain
} from "lucide-react";

const BlockchainTechnologyDeepDive = () => {
  return (
    <ArticleLayout
      title="Blockchain Technology Deep Dive"
      level="Intermediate"
    >
      <div className="space-y-12">
        {/* Introduction Hero */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl">
              <Blocks className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Understanding Blockchain Technology</h2>
          </div>
          <p className="text-xl text-gray-700 leading-relaxed">
            Blockchain is the revolutionary foundation powering cryptocurrencies and decentralized applications. 
            It's a distributed ledger technology that maintains a continuously growing list of records, called blocks, 
            which are cryptographically linked and secured across a global network.
          </p>
        </div>

        {/* What Is a Blockchain */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-lg">
              <Database className="h-6 w-6 text-white" />
            </div>
            What Is a Blockchain?
          </h3>
          <p className="text-lg text-gray-700 mb-6">
            Think of a blockchain as a digital ledger book that's copied across thousands of computers worldwide. 
            Every transaction gets recorded in this book, and all computers must agree on what happened before it becomes permanent.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Network, title: "Distributed", desc: "No single point of control or failure", color: "bg-blue-500" },
              { icon: Eye, title: "Transparent", desc: "All transactions are publicly visible", color: "bg-cyan-500" },
              { icon: Lock, title: "Immutable", desc: "Once recorded, data cannot be easily changed", color: "bg-indigo-500" },
              { icon: Shield, title: "Cryptographically Secure", desc: "Uses advanced encryption", color: "bg-purple-500" }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-blue-200 hover:shadow-md transition-all">
                <div className={`${feature.color} text-white p-2 rounded-lg inline-block mb-3`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How Blocks Are Created */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-2 rounded-lg">
              <Settings className="h-6 w-6 text-white" />
            </div>
            How Blocks Are Created
          </h3>
          <p className="text-lg text-gray-700 mb-6">Understanding the process of how new blocks are added to the blockchain:</p>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { step: 1, title: "Transaction Pool", desc: "New transactions wait in a mempool", icon: "📥" },
              { step: 2, title: "Block Formation", desc: "Miners/validators select transactions to include", icon: "🔧" },
              { step: 3, title: "Consensus", desc: "Proof of Work/Stake validates the block", icon: "✅" },
              { step: 4, title: "Block Addition", desc: "Validated block is added to the chain", icon: "⛓️" },
              { step: 5, title: "Network Sync", desc: "All nodes update their copy", icon: "🔄" }
            ].map((process, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-emerald-200 hover:shadow-md transition-all text-center">
                <div className="bg-emerald-600 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3">
                  {process.step}
                </div>
                <div className="text-2xl mb-2">{process.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-2">{process.title}</h4>
                <p className="text-gray-600 text-sm">{process.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Consensus Mechanisms */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-2 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            Consensus Mechanisms
          </h3>
          <p className="text-lg text-gray-700 mb-6">How blockchain networks agree on the state of the ledger:</p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Cpu,
                title: "Proof of Work (PoW)",
                description: "Miners compete to solve computational puzzles",
                pros: ["High security", "Battle-tested", "Truly decentralized"],
                cons: ["High energy consumption", "Slower transactions"],
                examples: ["Bitcoin", "Ethereum (before 2.0)"],
                color: "from-orange-500 to-red-600"
              },
              {
                icon: Shield,
                title: "Proof of Stake (PoS)",
                description: "Validators are chosen based on their stake",
                pros: ["Energy efficient", "Faster finality", "Economic penalties"],
                cons: ["Rich get richer", "Nothing at stake problem"],
                examples: ["Ethereum 2.0", "Cardano", "Solana"],
                color: "from-green-500 to-emerald-600"
              },
              {
                icon: Vote,
                title: "Delegated Proof of Stake (DPoS)",
                description: "Token holders vote for validators",
                pros: ["Very fast", "Democratic voting", "Lower barriers"],
                cons: ["Less decentralized", "Political dynamics"],
                examples: ["EOS", "Tron", "Cosmos"],
                color: "from-blue-500 to-cyan-600"
              },
              {
                icon: CheckCircle,
                title: "Proof of Authority (PoA)",
                description: "Pre-approved validators secure the network",
                pros: ["Very efficient", "Predictable", "Enterprise-friendly"],
                cons: ["Centralized", "Trust required", "Permissioned"],
                examples: ["VeChain", "POA Network"],
                color: "from-purple-500 to-violet-600"
              }
            ].map((consensus, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-orange-200 hover:shadow-lg transition-all duration-300">
                <div className={`bg-gradient-to-r ${consensus.color} p-3 rounded-lg inline-block mb-4`}>
                  <consensus.icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{consensus.title}</h4>
                <p className="text-gray-600 mb-4">{consensus.description}</p>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-green-700 mb-2">Pros:</p>
                    {consensus.pros.map((pro, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-green-600 mb-1">
                        <CheckCircle className="h-3 w-3" />
                        {pro}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-700 mb-2">Cons:</p>
                    {consensus.cons.map((con, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-red-600 mb-1">
                        <AlertTriangle className="h-3 w-3" />
                        {con}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Examples:</p>
                  <div className="flex flex-wrap gap-2">
                    {consensus.examples.map((example, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hash Functions and Cryptography */}
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-8 border border-violet-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-2 rounded-lg">
              <Hash className="h-6 w-6 text-white" />
            </div>
            Hash Functions and Cryptography
          </h3>
          <p className="text-lg text-gray-700 mb-6">The mathematical foundation that secures blockchain networks:</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "🔐", title: "Cryptographic Hashing", desc: "Creates unique fingerprints for data" },
              { icon: "🔢", title: "SHA-256", desc: "The hashing algorithm used by Bitcoin" },
              { icon: "🌳", title: "Merkle Trees", desc: "Efficiently organize and verify transactions" },
              { icon: "✍️", title: "Digital Signatures", desc: "Prove ownership and authorize transactions" }
            ].map((crypto, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-violet-200 hover:shadow-md transition-all">
                <div className="text-2xl mb-2">{crypto.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-2">{crypto.title}</h4>
                <p className="text-gray-600 text-sm">{crypto.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Types of Blockchain Networks */}
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 border border-teal-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-2 rounded-lg">
              <Network className="h-6 w-6 text-white" />
            </div>
            Types of Blockchain Networks
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Globe,
                title: "Public Blockchains",
                description: "Open to everyone (Bitcoin, Ethereum)",
                features: ["Fully decentralized", "Permissionless", "Transparent", "Censorship resistant"],
                color: "from-blue-500 to-cyan-600"
              },
              {
                icon: Building,
                title: "Private Blockchains",
                description: "Restricted access for organizations",
                features: ["Controlled access", "Faster transactions", "Privacy", "Regulatory compliance"],
                color: "from-purple-500 to-violet-600"
              },
              {
                icon: Users,
                title: "Consortium Blockchains",
                description: "Semi-decentralized, controlled by groups",
                features: ["Shared control", "Trusted participants", "Efficiency", "Governance"],
                color: "from-green-500 to-emerald-600"
              },
              {
                icon: Layers,
                title: "Hybrid Blockchains",
                description: "Combination of public and private elements",
                features: ["Selective transparency", "Controlled participation", "Flexible architecture", "Best of both worlds"],
                color: "from-orange-500 to-red-600"
              }
            ].map((type, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-teal-200 hover:shadow-lg transition-all duration-300">
                <div className={`bg-gradient-to-r ${type.color} p-3 rounded-lg inline-block mb-4`}>
                  <type.icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{type.title}</h4>
                <p className="text-gray-600 mb-4">{type.description}</p>
                <div className="space-y-2">
                  {type.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-teal-700">
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Contracts */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-8 border border-amber-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-amber-600 to-yellow-600 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            Smart Contracts
          </h3>
          <p className="text-lg text-gray-700 mb-6">Self-executing contracts with terms directly written into code:</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Zap, title: "Automated Execution", desc: "Run automatically when conditions are met" },
              { icon: Shield, title: "Trustless", desc: "No need to trust intermediaries" },
              { icon: "💰", title: "Programmable Money", desc: "Enable complex financial instruments" },
              { icon: Lock, title: "Immutable Logic", desc: "Contract terms cannot be changed once deployed" }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-amber-200 hover:shadow-md transition-all">
                <div className="mb-3">
                  {typeof feature.icon === 'string' ? (
                    <span className="text-2xl">{feature.icon}</span>
                  ) : (
                    <feature.icon className="h-6 w-6 text-amber-600" />
                  )}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Blockchain Trilemma */}
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 border border-rose-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-rose-600 to-pink-600 p-2 rounded-lg">
              <Scale className="h-6 w-6 text-white" />
            </div>
            Blockchain Trilemma
          </h3>
          <p className="text-lg text-gray-700 mb-6">
            The fundamental challenge in blockchain design - most blockchains can only optimize for two of these three properties at once:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Network,
                title: "Decentralization",
                description: "No single point of control",
                details: ["Distributed nodes", "Censorship resistance", "No single failure point"],
                color: "from-blue-500 to-cyan-600"
              },
              {
                icon: Shield,
                title: "Security",
                description: "Resistance to attacks and manipulation",
                details: ["Cryptographic protection", "Immutable records", "Attack resistance"],
                color: "from-green-500 to-emerald-600"
              },
              {
                icon: Timer,
                title: "Scalability",
                description: "Ability to handle many transactions quickly",
                details: ["High throughput", "Low latency", "Cost efficiency"],
                color: "from-purple-500 to-violet-600"
              }
            ].map((aspect, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-rose-200 hover:shadow-lg transition-all duration-300">
                <div className={`bg-gradient-to-r ${aspect.color} p-3 rounded-lg inline-block mb-4`}>
                  <aspect.icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{aspect.title}</h4>
                <p className="text-gray-600 mb-4">{aspect.description}</p>
                <div className="space-y-2">
                  {aspect.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-rose-700">
                      <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Layer 1 vs Layer 2 Solutions */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-8 border border-slate-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-slate-600 to-gray-600 p-2 rounded-lg">
              <Layers className="h-6 w-6 text-white" />
            </div>
            Layer 1 vs Layer 2 Solutions
          </h3>
          <p className="text-lg text-gray-700 mb-6">Understanding the blockchain scaling landscape:</p>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Layer 1 */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <span className="text-white font-bold text-sm">L1</span>
                </div>
                Layer 1 (Base Layer)
              </h4>
              <p className="text-gray-600 mb-4">Main blockchain protocols that form the foundation</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <CheckCircle className="h-4 w-4" />
                  Bitcoin - Digital gold standard
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <CheckCircle className="h-4 w-4" />
                  Ethereum - Smart contract platform
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <CheckCircle className="h-4 w-4" />
                  Solana - High-performance blockchain
                </div>
              </div>
            </div>

            {/* Layer 2 */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="bg-purple-500 p-2 rounded-lg">
                  <span className="text-white font-bold text-sm">L2</span>
                </div>
                Layer 2 (Scaling Solutions)
              </h4>
              <p className="text-gray-600 mb-4">Built on top of Layer 1 for speed and cost efficiency</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-purple-700">
                  <CheckCircle className="h-4 w-4" />
                  State Channels - Off-chain transactions
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-700">
                  <CheckCircle className="h-4 w-4" />
                  Sidechains - Separate connected blockchains
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-700">
                  <CheckCircle className="h-4 w-4" />
                  Rollups - Bundle multiple transactions
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Network Effects and Additional Concepts */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Network Effects */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Network Effects and Adoption
            </h3>
            <p className="text-green-700 mb-4">How blockchain networks gain value through usage:</p>
            <div className="space-y-3">
              {[
                "Metcalfe's Law: Network value increases with the square of users",
                "Developer Ecosystem: More developers building applications",
                "Infrastructure: Wallets, exchanges, and supporting services",
                "Institutional Adoption: Business and government integration"
              ].map((effect, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-green-700">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{effect}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interoperability */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <Webhook className="h-6 w-6" />
              Blockchain Interoperability
            </h3>
            <p className="text-blue-700 mb-4">Connecting different blockchain networks:</p>
            <div className="space-y-3">
              {[
                "Cross-Chain Bridges: Transfer assets between blockchains",
                "Atomic Swaps: Direct peer-to-peer exchanges across chains",
                "Wrapped Tokens: Represent assets from other blockchains",
                "Multi-Chain Protocols: Applications across multiple blockchains"
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-blue-700">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200">
            <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              <EyeOff className="h-6 w-6" />
              Privacy and Anonymity
            </h3>
            <p className="text-purple-700 mb-4">Understanding privacy in blockchain systems:</p>
            <div className="space-y-3">
              {[
                "Pseudonymity: Addresses don't directly reveal identity",
                "Privacy Coins: Cryptocurrencies with enhanced privacy",
                "Zero-Knowledge Proofs: Prove without revealing details",
                "Mixing Services: Obscure transaction trails"
              ].map((privacy, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-purple-700">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{privacy}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Environmental */}
          <div className="bg-gradient-to-br from-green-50 to-lime-50 rounded-2xl p-6 border border-green-200">
            <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <Leaf className="h-6 w-6" />
              Environmental Considerations
            </h3>
            <p className="text-green-700 mb-4">The environmental impact of blockchain technology:</p>
            <div className="space-y-3">
              {[
                "Energy Consumption: PoW networks require significant energy",
                "Carbon Footprint: Impact depends on energy sources used",
                "Green Mining: Using renewable energy for operations",
                "Efficient Consensus: PoS and other low-energy alternatives"
              ].map((env, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-green-700">
                  <Leaf className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{env}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-World Applications */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 border border-indigo-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-2 rounded-lg">
              <Globe className="h-6 w-6 text-white" />
            </div>
            Real-World Applications
          </h3>
          <p className="text-lg text-gray-700 mb-6">Beyond cryptocurrencies, blockchain technology enables:</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🚚", title: "Supply Chain Tracking", desc: "Transparent product provenance" },
              { icon: "👤", title: "Digital Identity", desc: "Self-sovereign identity management" },
              { icon: "🗳️", title: "Voting Systems", desc: "Transparent and verifiable elections" },
              { icon: "💡", title: "Intellectual Property", desc: "Timestamped proof of creation" },
              { icon: "🏠", title: "Real Estate", desc: "Transparent property records and transactions" },
              { icon: "🏥", title: "Healthcare", desc: "Secure and portable medical records" }
            ].map((app, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-indigo-200 hover:shadow-md transition-all">
                <div className="text-2xl mb-2">{app.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-2">{app.title}</h4>
                <p className="text-gray-600 text-sm">{app.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Challenges and Future */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Challenges */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200">
            <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Challenges and Limitations
            </h3>
            <div className="space-y-3">
              {[
                "User Experience: Complex interfaces and key management",
                "Regulatory Uncertainty: Evolving legal frameworks",
                "Technical Complexity: Difficult for average users",
                "Integration Challenges: Connecting with existing systems",
                "Quantum Computing Threat: Future risk to cryptography"
              ].map((challenge, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-red-700">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{challenge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Future */}
          <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-6 border border-cyan-200">
            <h3 className="text-xl font-bold text-cyan-800 mb-4 flex items-center gap-2">
              <Lightbulb className="h-6 w-6" />
              The Future of Blockchain
            </h3>
            <div className="space-y-3">
              {[
                "Improved user experience and mainstream adoption",
                "Integration with Internet of Things (IoT) devices",
                "Central Bank Digital Currencies (CBDCs)",
                "Quantum-resistant cryptography",
                "AI and machine learning integration",
                "Enhanced privacy and scalability solutions"
              ].map((future, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-cyan-700">
                  <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{future}</span>
                </div>
              ))}
            </div>
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
              "Blockchain is a distributed ledger technology that enables trust without intermediaries",
              "Different consensus mechanisms offer various trade-offs between security, speed, and energy efficiency",
              "Smart contracts enable programmable money and automated agreements",
              "The blockchain trilemma forces design choices between decentralization, security, and scalability",
              "Layer 2 solutions help address scalability challenges while maintaining security",
              "Blockchain technology has applications far beyond cryptocurrencies"
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

export default BlockchainTechnologyDeepDive;