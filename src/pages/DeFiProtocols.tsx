
import ArticleLayout from "@/components/ArticleLayout";
import { Link } from "react-router-dom";
import { 
  TrendingUp, Building, Coins, Zap, Shield, Users, Globe, 
  AlertTriangle, CheckCircle, Lightbulb, Target, ArrowRight,
  DollarSign, Clock, Lock, Unlock, BarChart3, Layers,
  Repeat, FileText, Code, Network, Eye, Database, Settings,
  Wallet, TrendingDown, ChevronRight, Star, Award
} from "lucide-react";

const DeFiProtocols = () => {
  return (
    <ArticleLayout title="DeFi & Protocols" level="Advanced">
      <div className="space-y-12">
        {/* Introduction Hero */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-xl">
              <Coins className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">What Is DeFi Really?</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Traditional Finance */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
              <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                <Building className="h-6 w-6" />
                Traditional Finance
              </h3>
              <p className="text-gray-700 mb-4">
                Imagine traditional banking like a big building with lots of employees handling your money. 
                You trust them to keep your savings safe, give you loans, and manage your investments.
              </p>
              <div className="flex items-center gap-2 text-sm text-red-700">
                <AlertTriangle className="h-4 w-4" />
                Centralized control, limited access, high fees
              </div>
            </div>

            {/* DeFi */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                <Network className="h-6 w-6" />
                DeFi (Decentralized Finance)
              </h3>
              <p className="text-gray-700 mb-4">
                DeFi is like having all those banking services, but instead of people running them, computer programs called "smart contracts" handle everything automatically. 
                No building, no employees - just code that everyone can see and verify.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-700">
                <CheckCircle className="h-4 w-4" />
                Decentralized, transparent, globally accessible
              </div>
            </div>
          </div>
        </div>

        {/* Why Decentralizing Banks Is Revolutionary */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-8 border border-slate-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-slate-600 to-gray-600 p-2 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            Why Decentralizing Banks Is Revolutionary
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Problems with Traditional Banks */}
            <div className="bg-white rounded-xl p-6 border border-red-200">
              <h4 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6" />
                The Problems with Traditional Banks
              </h4>
              <div className="space-y-4">
                {[
                  {
                    title: "They Control Your Money",
                    desc: "Banks can freeze your account, deny transactions, or even close your account entirely. They decide when you can access your own money and how you can use it."
                  },
                  {
                    title: "High Fees and Poor Returns",
                    desc: "Banks charge fees for almost everything while paying you nearly 0% interest on savings. They make money by lending your deposits at much higher rates but share very little with you."
                  },
                  {
                    title: "Limited Access",
                    desc: "Billions of people worldwide can't get bank accounts due to location, documentation requirements, or minimum balance restrictions."
                  },
                  {
                    title: "Slow and Expensive Transfers",
                    desc: "Sending money internationally takes days and costs significant fees. Banks use outdated systems that haven't meaningfully improved in decades."
                  }
                ].map((problem, index) => (
                  <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <h5 className="font-semibold text-red-900 mb-2">{problem.title}</h5>
                    <p className="text-red-700 text-sm">{problem.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* How DeFi Solves These Problems */}
            <div className="bg-white rounded-xl p-6 border border-green-200">
              <h4 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                <CheckCircle className="h-6 w-6" />
                How DeFi Solves These Problems
              </h4>
              <div className="space-y-4">
                {[
                  {
                    title: "You Own Your Money",
                    desc: "With DeFi, you hold your own private keys. No one can freeze your account or stop you from making transactions. You're the bank - you have complete control over your assets 24/7."
                  },
                  {
                    title: "Better Returns, Lower Costs",
                    desc: "DeFi eliminates the middleman markup. When you lend money through protocols like AAVE, you get most of the interest instead of the bank keeping it."
                  },
                  {
                    title: "Global Access",
                    desc: "Anyone with internet and a smartphone can access DeFi. No paperwork, no minimum balances, no geographic restrictions."
                  },
                  {
                    title: "Instant, Cheap Transactions",
                    desc: "DeFi transactions settle in minutes, not days. Cross-border payments cost pennies instead of tens of dollars. The system works 24/7."
                  },
                  {
                    title: "Transparent and Auditable",
                    desc: "Every transaction is recorded on the blockchain for anyone to verify. Smart contract code is open source - you can see exactly how your money is being handled."
                  },
                  {
                    title: "Innovation Without Permission",
                    desc: "Developers can build new financial products without asking banks for permission. This creates rapid innovation and competition that benefits users."
                  }
                ].map((solution, index) => (
                  <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <h5 className="font-semibold text-green-900 mb-2">{solution.title}</h5>
                    <p className="text-green-700 text-sm">{solution.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Real-World Impact */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-8 border border-amber-200">
          <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-amber-600 to-yellow-600 p-2 rounded-lg">
              <Globe className="h-6 w-6 text-white" />
            </div>
            Real-World Impact
          </h4>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Remittances",
                scenario: "Maria works in the US and sends $200 home to her family in El Salvador monthly.",
                traditional: "Traditional services charge $15-20 in fees and take 2-3 days.",
                defi: "With DeFi, she can send the same amount for under $5 and it arrives in minutes.",
                icon: "💸"
              },
              {
                title: "Savings",
                scenario: "Ahmed's bank pays 0.5% interest on his savings while inflation is 8%.",
                traditional: "His purchasing power decreases every year.",
                defi: "Through DeFi lending, he earns 6% APY on stablecoins, actually preserving his purchasing power.",
                icon: "💰"
              },
              {
                title: "Financial Inclusion",
                scenario: "Priya runs a small business in rural India but can't get a bank loan due to lack of credit history.",
                traditional: "Banks deny her loan applications despite profitable business.",
                defi: "DeFi protocols let her use her cryptocurrency as collateral to borrow funds for expansion.",
                icon: "🏪"
              }
            ].map((example, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-amber-200 hover:shadow-lg transition-all duration-300">
                <div className="text-3xl mb-3">{example.icon}</div>
                <h5 className="font-bold text-amber-900 mb-3">{example.title}</h5>
                <p className="text-gray-700 text-sm mb-3">{example.scenario}</p>
                <div className="space-y-2">
                  <div className="p-2 bg-red-50 rounded text-xs text-red-700">
                    <strong>Traditional:</strong> {example.traditional}
                  </div>
                  <div className="p-2 bg-green-50 rounded text-xs text-green-700">
                    <strong>DeFi:</strong> {example.defi}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staking Section */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg">
              <Lock className="h-6 w-6 text-white" />
            </div>
            Staking: Earning Rewards for Helping Networks
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* What is Staking */}
            <div className="bg-white rounded-xl p-6 border border-green-200">
              <h4 className="text-xl font-bold text-green-800 mb-4">What Is Staking?</h4>
              <p className="text-gray-700 mb-4">
                Think of staking like putting money in a special savings account that helps keep a blockchain network secure.
              </p>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <h5 className="font-semibold text-green-700 mb-2">The Simple Version:</h5>
                  <p className="text-gray-700 text-sm">
                    You "lock up" your digital assets (like putting them in a time-locked safe) to help validate 
                    transactions on a blockchain. In return, you earn rewards - like interest on a savings account.
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h5 className="font-semibold text-green-700 mb-2">Why Networks Need Stakers:</h5>
                  <div className="space-y-1 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Blockchain networks need people to verify transactions are legitimate
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Stakers put their own money at risk, so they're motivated to be honest
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      If they try to cheat, they lose their staked money (like a security deposit)
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      Honest stakers get rewarded with new tokens
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Types of Staking */}
            <div className="bg-white rounded-xl p-6 border border-green-200">
              <h4 className="text-xl font-bold text-green-800 mb-4">Types of Staking</h4>
              <div className="space-y-4">
                {[
                  {
                    icon: Shield,
                    title: "Direct Staking",
                    desc: "You stake your tokens directly with the blockchain network. Like depositing money directly with the bank instead of going through a middleman."
                  },
                  {
                    icon: Users,
                    title: "Delegated Staking",
                    desc: "You give your tokens to a 'validator' (like a professional money manager) who stakes them for you. You keep ownership but they do the technical work."
                  },
                  {
                    icon: Unlock,
                    title: "Liquid Staking",
                    desc: "You stake your tokens but get a 'receipt token' that you can still trade or use elsewhere. It's like getting a certificate for money in a CD that you can still sell."
                  }
                ].map((type, index) => (
                  <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <type.icon className="h-5 w-5 text-green-600" />
                      <h5 className="font-semibold text-green-700">{type.title}</h5>
                    </div>
                    <p className="text-gray-700 text-sm">{type.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Liquidity Farming */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-2 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            Liquidity Farming: Being the Bank
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* What is Liquidity Farming */}
            <div className="bg-white rounded-xl p-6 border border-yellow-200">
              <h4 className="text-xl font-bold text-yellow-800 mb-4">What Is Liquidity Farming?</h4>
              <p className="text-gray-700 mb-4">
                Imagine you and your friend want to start a currency exchange booth. You both put in equal amounts 
                of two different currencies, and people come to trade between them. You earn fees from every trade.
              </p>
              <p className="text-gray-700 mb-4">
                That's essentially liquidity farming (also called yield farming or providing liquidity). You provide 
                pairs of tokens to decentralized exchanges so other people can trade, and you earn fees from their trades.
              </p>
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <h5 className="font-semibold text-yellow-700 mb-2">How It Works:</h5>
                <div className="space-y-1 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    You deposit two tokens in equal dollar amounts (like $100 of ETH + $100 of USDC)
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    These go into a "liquidity pool" - like a shared pot that traders use
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    When people trade between these tokens, they pay small fees
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    Those fees get distributed to everyone who provided liquidity
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    You also often get bonus "reward tokens" from the protocol
                  </div>
                </div>
              </div>
            </div>

            {/* Impermanent Loss */}
            <div className="bg-white rounded-xl p-6 border border-red-200">
              <h4 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                <TrendingDown className="h-6 w-6" />
                Impermanent Loss: The Hidden Risk
              </h4>
              <p className="text-gray-700 mb-4">Here's the tricky part that catches many people off guard:</p>
              <div className="space-y-4">
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <h5 className="font-semibold text-red-700 mb-2">The Problem:</h5>
                  <p className="text-gray-700 text-sm">
                    When you provide liquidity, you're essentially betting that both tokens will move in price together. 
                    If one token goes up much more than the other, you end up with less of the valuable token.
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <h5 className="font-semibold text-red-700 mb-2">Simple Example:</h5>
                  <p className="text-gray-700 text-sm">
                    You put in $100 ETH + $100 USDC. ETH doubles in price. The pool automatically rebalances, 
                    so you now have less ETH and more USDC. You missed out on some of ETH's gains.
                  </p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <h5 className="font-semibold text-orange-700 mb-2">Why "Impermanent"?</h5>
                  <p className="text-gray-700 text-sm">
                    It's only a loss if you withdraw when prices are different. If prices return to where they started, 
                    the "loss" disappears - but you still earned fees while providing liquidity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lending Protocols */}
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 border border-teal-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-2 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            Lending Protocols: The DeFi Bank
          </h3>

          <div className="bg-white rounded-xl p-6 border border-teal-200">
            <h4 className="text-xl font-bold text-teal-800 mb-4">How AAVE Works</h4>
            <p className="text-gray-700 mb-6">
              AAVE is like a bank, but run by computer code instead of people. Here's how the magic works:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* For Lenders */}
              <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                <h5 className="font-semibold text-teal-700 mb-3 flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  For Lenders (Depositors):
                </h5>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    You deposit tokens (like USDC) into AAVE's smart contract
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    You get "aTokens" (like aUSDC) as a receipt
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    These aTokens slowly increase in number - that's your interest
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    You can withdraw anytime by trading your aTokens back
                  </div>
                </div>
              </div>

              {/* For Borrowers */}
              <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                <h5 className="font-semibold text-cyan-700 mb-3 flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  For Borrowers:
                </h5>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    They deposit valuable collateral (like ETH worth $150)
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    They can borrow less valuable assets (like $100 worth of USDC)
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    They pay interest on what they borrow
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    If their collateral value drops too much, it gets sold automatically
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
              <h5 className="font-semibold text-teal-700 mb-2 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                The Interest Rate Magic:
              </h5>
              <p className="text-gray-700 text-sm">
                When lots of people want to borrow, interest rates go up (more demand). 
                When there's lots of money to lend, rates go down (more supply). 
                It's all automatic based on supply and demand.
              </p>
            </div>
          </div>
        </div>

        {/* Automated Market Makers */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
              <Repeat className="h-6 w-6 text-white" />
            </div>
            Automated Market Makers (AMMs)
          </h3>

          <div className="bg-white rounded-xl p-6 border border-indigo-200">
            <h4 className="text-xl font-bold text-indigo-800 mb-4">How Quickswap (and Uniswap) Work</h4>
            <p className="text-gray-700 mb-6">
              Traditional exchanges match buyers and sellers directly. AMMs work differently - they use math 
              instead of order books.
            </p>

            <div className="space-y-6">
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <h5 className="font-semibold text-indigo-700 mb-3 flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  The Constant Product Formula:
                </h5>
                <div className="bg-white p-3 rounded border text-center mb-3">
                  <code className="text-lg font-bold text-indigo-800">Token A × Token B = Constant Number</code>
                </div>
                <p className="text-gray-700 text-sm">
                  If someone buys Token A, there's less of it in the pool, so its price goes up. 
                  The math automatically adjusts prices based on how much of each token is left.
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-700 mb-3">Example Trade:</h5>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Pool has 100 ETH and 200,000 USDC (so 1 ETH = 2,000 USDC)
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Someone buys 10 ETH with USDC
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Pool now has 90 ETH and more USDC
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    The price of ETH automatically increases because there's less of it
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                <h5 className="font-semibold text-indigo-700 mb-2 flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Why This Is Revolutionary:
                </h5>
                <p className="text-gray-700 text-sm">
                  No company needed, no employees, no downtime. The math works 24/7 automatically, 
                  and anyone can trade anytime without waiting for someone else to place a matching order.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CEX vs DEX */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-8 border border-slate-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-slate-600 to-gray-600 p-2 rounded-lg">
              <ArrowRight className="h-6 w-6 text-white" />
            </div>
            CEX vs DEX: Two Different Worlds
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Centralized Exchanges */}
            <div className="bg-white rounded-xl p-6 border border-blue-200">
              <h4 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                <Building className="h-6 w-6" />
                Centralized Exchanges (CEX)
              </h4>
              <p className="text-gray-700 mb-4">
                Traditional exchanges controlled by companies, like banks but for digital assets:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-blue-700 mb-2">Examples:</h5>
                  <div className="flex flex-wrap gap-2">
                    {["Coinbase", "Binance", "Kraken", "Gemini"].map((exchange, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        {exchange}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-green-700 mb-2">Pros:</h5>
                    <div className="space-y-1 text-sm text-gray-700">
                      {[
                        "User-friendly for beginners",
                        "Customer support when things go wrong",
                        "Insurance on some deposits",
                        "Fiat currency on/off ramps"
                      ].map((pro, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {pro}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-red-700 mb-2">Cons:</h5>
                    <div className="space-y-1 text-sm text-gray-700">
                      {[
                        "You don't truly own your crypto",
                        "Can freeze accounts or restrict access",
                        "Single point of failure (hacks, bankruptcy)",
                        "Higher fees"
                      ].map((con, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <AlertTriangle className="h-3 w-3 text-red-600" />
                          {con}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decentralized Exchanges */}
            <div className="bg-white rounded-xl p-6 border border-green-200">
              <h4 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                <Network className="h-6 w-6" />
                Decentralized Exchanges (DEX)
              </h4>
              <p className="text-gray-700 mb-4">
                No company in control - just smart contracts doing the work automatically:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-green-700 mb-2">Examples:</h5>
                  <div className="flex flex-wrap gap-2">
                    {["Uniswap", "Quickswap", "PancakeSwap", "SushiSwap"].map((dex, idx) => (
                      <span key={idx} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        {dex}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-green-700 mb-2">Pros:</h5>
                    <div className="space-y-1 text-sm text-gray-700">
                      {[
                        "You maintain control of your assets",
                        "No account creation or KYC required",
                        "Access to thousands of tokens",
                        "Transparent operations on blockchain"
                      ].map((pro, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {pro}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-red-700 mb-2">Cons:</h5>
                    <div className="space-y-1 text-sm text-gray-700">
                      {[
                        "More complex for beginners",
                        "No customer support",
                        "Higher transaction fees (gas)",
                        "Risk of user error (wrong address, etc.)"
                      ].map((con, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <AlertTriangle className="h-3 w-3 text-red-600" />
                          {con}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decentralized Applications */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-violet-600 p-2 rounded-lg">
              <Layers className="h-6 w-6 text-white" />
            </div>
            Decentralized Applications (dApps)
          </h3>

          <div className="bg-white rounded-xl p-6 border border-purple-200 mb-6">
            <h4 className="text-xl font-bold text-purple-800 mb-4">What Are dApps?</h4>
            <p className="text-gray-700 mb-4">
              Decentralized Applications are like regular apps (think Instagram or Uber), but instead of running 
              on company servers, they run on blockchain networks. No single company controls them.
            </p>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h5 className="font-semibold text-purple-700 mb-3">Key Characteristics:</h5>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { icon: Eye, text: "Open Source: Anyone can see and verify the code" },
                  { icon: Network, text: "Decentralized: No single point of control or failure" },
                  { icon: Database, text: "Blockchain-Based: All data and logic stored on blockchain" },
                  { icon: Coins, text: "Token-Incentivized: Often use tokens for governance or utility" }
                ].map((char, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-purple-700">
                    <char.icon className="h-4 w-4" />
                    {char.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                category: "Finance (DeFi)",
                color: "from-green-500 to-emerald-600",
                examples: ["Uniswap - Decentralized trading", "AAVE - Lending and borrowing", "Compound - Interest earning"]
              },
              {
                category: "Gaming & NFTs",
                color: "from-pink-500 to-rose-600",
                examples: ["Axie Infinity - Play-to-earn gaming", "OpenSea - NFT marketplace", "Decentraland - Virtual world"]
              },
              {
                category: "Social & Identity",
                color: "from-blue-500 to-cyan-600",
                examples: ["ENS - Domain names (.eth)", "Lens Protocol - Decentralized social", "Mirror - Publishing platform"]
              },
              {
                category: "Infrastructure",
                color: "from-orange-500 to-red-600",
                examples: ["Chainlink - Oracle services", "IPFS - Decentralized storage", "The Graph - Data indexing"]
              }
            ].map((category, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border border-purple-200 hover:shadow-lg transition-all duration-300">
                <div className={`bg-gradient-to-r ${category.color} p-2 rounded-lg inline-block mb-3`}>
                  <span className="text-white font-bold text-xs px-2">{category.category.split(' ')[0]}</span>
                </div>
                <h6 className="font-semibold text-purple-900 mb-3">{category.category}</h6>
                <div className="space-y-2">
                  {category.examples.map((example, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-purple-700">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Contracts */}
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 border border-teal-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            Smart Contracts: The Building Blocks
          </h3>

          <div className="bg-white rounded-xl p-6 border border-teal-200">
            <h4 className="text-xl font-bold text-teal-800 mb-4">Understanding Smart Contracts</h4>
            <p className="text-gray-700 mb-6">
              Smart contracts are self-executing agreements written in code. Think of them as digital vending machines - 
              you put in the right input, and you automatically get the expected output.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                <h5 className="font-semibold text-teal-700 mb-3">Real-World Example:</h5>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 rounded border border-red-200">
                    <h6 className="font-medium text-red-800 mb-1">Traditional Insurance:</h6>
                    <p className="text-gray-700 text-sm">
                      Submit paperwork → Wait weeks → Insurance company reviews → Human decides → Maybe you get paid
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded border border-green-200">
                    <h6 className="font-medium text-green-800 mb-1">Smart Contract Insurance:</h6>
                    <p className="text-gray-700 text-sm">
                      Weather data shows hurricane → Contract automatically pays out to affected areas → Money arrives in minutes
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                <h5 className="font-semibold text-cyan-700 mb-3">Why They Matter:</h5>
                <div className="space-y-2">
                  {[
                    { icon: Zap, text: "Automatic Execution: No humans needed to enforce the agreement" },
                    { icon: Eye, text: "Transparent: Everyone can see exactly how they work" },
                    { icon: Lock, text: "Immutable: Once deployed, the rules can't be changed arbitrarily" },
                    { icon: Globe, text: "Global Access: Available 24/7 to anyone with internet" },
                    { icon: DollarSign, text: "Reduced Costs: No middlemen taking fees" }
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-cyan-700">
                      <benefit.icon className="h-4 w-4" />
                      {benefit.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Understanding the Risks */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 p-2 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            Understanding the Risks
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Smart Contract Risk",
                desc: "Code can have bugs. If there's a problem with the smart contract, funds could be lost. That's why audited, established protocols are safer.",
                icon: Code
              },
              {
                title: "User Error Risk",
                desc: "With great power comes great responsibility. Send tokens to the wrong address? They're gone forever. No customer service to call.",
                icon: AlertTriangle
              },
              {
                title: "Liquidation Risk",
                desc: "If you're borrowing against collateral and prices move against you, your collateral can be automatically sold to repay the loan.",
                icon: TrendingDown
              },
              {
                title: "Network Congestion",
                desc: "When networks get busy, transaction fees spike and confirmations slow down. This can affect your ability to interact with dApps when you need to.",
                icon: Clock
              }
            ].map((risk, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border border-red-200 hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <risk.icon className="h-5 w-5 text-red-600" />
                  <h4 className="font-semibold text-red-900">{risk.title}</h4>
                </div>
                <p className="text-gray-700 text-sm">{risk.desc}</p>
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
              "DeFi eliminates traditional banking intermediaries, giving you control and better returns",
              "Decentralization provides global access, transparency, and 24/7 availability",
              "Smart contracts reduce costs and enable innovation impossible in traditional finance",
              "Staking helps secure networks and earns rewards, but locks up your tokens",
              "Liquidity farming earns trading fees but exposes you to impermanent loss",
              "Lending protocols like AAVE work through over-collateralized loans",
              "AMMs use mathematical formulas instead of order books for trading",
              "Complex yield strategies can stack multiple earning methods",
              "Higher yields usually mean higher risks - understand what you're getting into",
              "Stick to audited, established protocols for safety"
            ].map((takeaway, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
                <span className="text-white text-sm">{takeaway}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Your Learning Journey */}
        <section className="bg-gray-50 rounded-xl p-8">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">Continue Your Learning Journey</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Link 
                to="/learn/expanding-beyond-vault-club"
                className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  <span className="font-semibold text-gray-900">Previous: Expanding Your Portfolio</span>
                </div>
                <p className="text-gray-600">Learn strategic approaches to diversifying beyond structured investment contracts.</p>
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

export default DeFiProtocols;
