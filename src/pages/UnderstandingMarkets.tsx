import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, BarChart3, Globe, Bitcoin, DollarSign, LineChart, PieChart, Activity, Clock, Target, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const UnderstandingMarkets = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white py-6">
        <div className="container mx-auto px-6">
          <Link to="/learn-now" className="inline-flex items-center gap-2 text-gray-100 hover:text-white transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Learning Path
          </Link>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Understanding Markets</h1>
              <p className="text-gray-100">Master Global Financial Markets & Crypto Evolution</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Introduction */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">The Evolution of Financial Markets</h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Financial markets have undergone dramatic transformation over the past century. From traditional stock exchanges 
              to the emergence of digital assets, understanding market evolution is crucial for any sophisticated investor.
            </p>
            <div className="bg-gradient-to-r from-cyan-50 to-purple-50 rounded-xl p-8">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">What You'll Master</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-cyan-600 w-2 h-2 rounded-full"></div>
                  <span className="text-gray-700">Traditional vs. Digital Markets</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-600 w-2 h-2 rounded-full"></div>
                  <span className="text-gray-700">Cryptocurrency Market Origins</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-cyan-600 w-2 h-2 rounded-full"></div>
                  <span className="text-gray-700">Market Cycles & Psychology</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-600 w-2 h-2 rounded-full"></div>
                  <span className="text-gray-700">Future Market Predictions</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Traditional Financial Markets */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-8 text-gray-900">Traditional Financial Markets Framework</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                  <h4 className="text-xl font-semibold text-gray-900">Equity Markets</h4>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li>• Stock exchanges (NYSE, NASDAQ, LSE)</li>
                  <li>• Market capitalization dynamics</li>
                  <li>• Valuation methodologies</li>
                  <li>• Dividend vs. growth strategies</li>
                  <li>• Sector rotation patterns</li>
                </ul>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="h-6 w-6 text-green-600" />
                  <h4 className="text-xl font-semibold text-gray-900">Bond Markets</h4>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li>• Government vs. corporate bonds</li>
                  <li>• Yield curve interpretation</li>
                  <li>• Credit risk assessment</li>
                  <li>• Interest rate sensitivity</li>
                  <li>• Fixed income allocation</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="h-6 w-6 text-purple-600" />
                  <h4 className="text-xl font-semibold text-gray-900">Forex Markets</h4>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li>• Currency pair dynamics</li>
                  <li>• Central bank policies</li>
                  <li>• Economic indicators impact</li>
                  <li>• Carry trade strategies</li>
                  <li>• Geopolitical influences</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <PieChart className="h-6 w-6 text-orange-600" />
                  <h4 className="text-xl font-semibold text-gray-900">Commodities</h4>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li>• Precious metals (Gold, Silver)</li>
                  <li>• Energy markets (Oil, Gas)</li>
                  <li>• Agricultural products</li>
                  <li>• Supply/demand fundamentals</li>
                  <li>• Inflation hedging properties</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Cryptocurrency Market Deep Dive */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-8 text-gray-900">The Cryptocurrency Revolution</h3>
            
            {/* Origins */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-8 mb-8">
              <h4 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center gap-3">
                <Clock className="h-6 w-6 text-orange-600" />
                Origins & Genesis (2008-2012)
              </h4>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>2008 Financial Crisis:</strong> The global financial meltdown exposed fundamental flaws in traditional banking systems, 
                  creating demand for decentralized alternatives that couldn't be manipulated by central authorities.
                </p>
                <p>
                  <strong>Satoshi's Vision:</strong> The Bitcoin whitepaper introduced a peer-to-peer electronic cash system, 
                  solving the double-spending problem without requiring trusted third parties.
                </p>
                <p>
                  <strong>Early Adoption:</strong> Cryptographers, libertarians, and tech enthusiasts formed the initial community, 
                  establishing Bitcoin's value through scarcity and utility rather than government backing.
                </p>
              </div>
            </div>

            {/* Evolution Timeline */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
              <h4 className="text-2xl font-semibold mb-6 text-gray-900">Market Evolution Timeline</h4>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h5 className="font-semibold text-gray-900">2013-2017: Infrastructure Building</h5>
                  <p className="text-gray-600">Exchanges emerge, altcoins launch, institutional awareness grows. First major bull run reaches $20K.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-6">
                  <h5 className="font-semibold text-gray-900">2018-2020: Maturation Phase</h5>
                  <p className="text-gray-600">Bear market consolidation, DeFi emergence, smart contract platforms gain traction.</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-6">
                  <h5 className="font-semibold text-gray-900">2021-Present: Institutional Adoption</h5>
                  <p className="text-gray-600">Corporate treasuries, ETFs, regulatory clarity, mainstream financial integration.</p>
                </div>
              </div>
            </div>

            {/* Current Market Structure */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <Bitcoin className="h-8 w-8 text-orange-500 mb-4" />
                <h5 className="text-lg font-semibold mb-3 text-gray-900">Store of Value</h5>
                <p className="text-gray-600">Bitcoin's evolution from experimental currency to "digital gold" and institutional reserve asset.</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <Zap className="h-8 w-8 text-blue-500 mb-4" />
                <h5 className="text-lg font-semibold mb-3 text-gray-900">Smart Contracts</h5>
                <p className="text-gray-600">Ethereum and competitors enabling programmable money and decentralized applications.</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <Activity className="h-8 w-8 text-green-500 mb-4" />
                <h5 className="text-lg font-semibold mb-3 text-gray-900">DeFi Ecosystem</h5>
                <p className="text-gray-600">Decentralized finance recreating traditional financial services on blockchain infrastructure.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Market Psychology & Cycles */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-8 text-gray-900">Market Psychology & Cycles</h3>
            <div className="bg-gradient-to-r from-cyan-50 to-purple-50 rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold mb-4 text-gray-900">Crypto Market Cycles</h4>
                  <ul className="space-y-3 text-gray-700">
                    <li><strong>Accumulation:</strong> Smart money builds positions during low sentiment</li>
                    <li><strong>Markup:</strong> Price discovery as institutional interest grows</li>
                    <li><strong>Distribution:</strong> Retail FOMO coincides with smart money exits</li>
                    <li><strong>Decline:</strong> Capitulation and fear dominate sentiment</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-4 text-gray-900">Behavioral Patterns</h4>
                  <ul className="space-y-3 text-gray-700">
                    <li><strong>Halving Events:</strong> Bitcoin's supply reduction drives 4-year cycles</li>
                    <li><strong>Regulatory Impact:</strong> Policy changes create volatility spikes</li>
                    <li><strong>Adoption Milestones:</strong> Institutional entries fuel major rallies</li>
                    <li><strong>Technology Upgrades:</strong> Protocol improvements affect valuations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Future Outlook */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-8 text-gray-900">Future Market Outlook</h3>
            <div className="space-y-8">
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h4 className="text-2xl font-semibold mb-6 text-gray-900">Central Bank Digital Currencies (CBDCs)</h4>
                <p className="text-gray-600 mb-4">
                  Over 100 countries are exploring or piloting CBDCs, representing the biggest monetary system change in generations.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Implications:</h5>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Enhanced monetary policy transmission</li>
                      <li>• Reduced settlement times</li>
                      <li>• Increased financial surveillance</li>
                      <li>• Competition with private cryptocurrencies</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Timeline:</h5>
                    <ul className="text-gray-600 space-y-1">
                      <li>• 2024-2026: Major economy pilots</li>
                      <li>• 2027-2030: Widespread adoption</li>
                      <li>• 2030+: Cross-border settlement integration</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h4 className="text-2xl font-semibold mb-6 text-gray-900">Tokenization of Real-World Assets</h4>
                <p className="text-gray-600 mb-4">
                  The transformation of traditional assets into blockchain-based tokens will unlock trillions in value and liquidity.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Real Estate</h5>
                    <p className="text-gray-600 text-sm">Fractional ownership, global liquidity, reduced transaction costs</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Securities</h5>
                    <p className="text-gray-600 text-sm">24/7 trading, programmable compliance, instant settlement</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Commodities</h5>
                    <p className="text-gray-600 text-sm">Supply chain transparency, provenance tracking, micro-investing</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-cyan-50 rounded-xl p-8">
                <h4 className="text-2xl font-semibold mb-6 text-gray-900">Investment Strategy Evolution</h4>
                <p className="text-gray-600 mb-6">
                  Successful investors will need to adapt their strategies to navigate an increasingly complex and interconnected global market.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">Key Adaptations:</h5>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Multi-asset portfolio construction</li>
                      <li>• Technology-first fundamental analysis</li>
                      <li>• Regulatory arbitrage opportunities</li>
                      <li>• Cross-market correlation monitoring</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">Emerging Opportunities:</h5>
                    <ul className="text-gray-600 space-y-2">
                      <li>• DeFi yield optimization</li>
                      <li>• NFT utility and gaming</li>
                      <li>• Web3 infrastructure plays</li>
                      <li>• Sustainable finance tokens</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation */}
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
                <p className="text-gray-600">Strategic approaches to diversifying beyond structured investment contracts.</p>
              </Link>
              
              <Link 
                to="/learn-now"
                className="block bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Target className="h-6 w-6" />
                  <span className="font-semibold">Back to Learning Path</span>
                </div>
                <p className="text-gray-100">Explore all available learning modules and continue your education.</p>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UnderstandingMarkets;