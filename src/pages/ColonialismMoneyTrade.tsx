import ArticleLayout from "@/components/ArticleLayout";
import { 
  Coins, Crown, Globe, Ship, Anchor, TrendingDown, AlertTriangle,
  Users, Building, Shield, Target, BookOpen, BarChart3, Zap,
  Lock, Eye, EyeOff, Lightbulb, CheckCircle, ArrowRight, Heart
} from "lucide-react";

const ColonialismMoneyTrade = () => {
  return (
    <ArticleLayout
      title="Colonialism of Money & Trade"
      level="Intermediate"
    >
      <div className="space-y-12">
        {/* Introduction Hero */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-3 rounded-xl">
              <Ship className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Money as a Tool of Control</h2>
          </div>
          <p className="text-xl text-gray-700 leading-relaxed">
            Throughout history, monetary systems and trade relationships have been weaponized as instruments 
            of colonial control, creating economic dependencies that persist long after political independence. 
            Understanding this legacy reveals how financial systems can perpetuate power imbalances across generations.
          </p>
        </div>

        {/* Historical Colonial Monetary Systems */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8 border border-red-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-red-600 to-pink-600 p-2 rounded-lg">
              <Crown className="h-6 w-6 text-white" />
            </div>
            Historical Monetary Colonialism
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                system: "Spanish Colonial Silver",
                period: "1500-1800",
                method: "Forced extraction of precious metals from colonies to fund European wars",
                impact: "Devastated indigenous economies and created global inflation",
                legacy: "Established extractive economic relationships"
              },
              {
                system: "British Currency Controls",
                period: "1600-1947",
                method: "Prohibited colonies from issuing their own currency or trading freely",
                impact: "Forced dependence on British financial institutions",
                legacy: "Created lasting banking and trade dependencies"
              },
              {
                system: "French CFA Franc",
                period: "1945-Present",
                method: "African nations required to keep reserves in French banks",
                impact: "Limits monetary sovereignty and economic independence",
                legacy: "Ongoing example of neocolonial monetary control"
              },
              {
                system: "Company Currencies",
                period: "1600-1900",
                method: "Trading companies issued their own money in colonized territories",
                impact: "Created captive markets and prevented local economic development",
                legacy: "Established corporate-state collusion models"
              },
              {
                system: "Bretton Woods System",
                period: "1944-1971",
                method: "Dollar-gold standard gave US monetary dominance",
                impact: "Created global dependence on US financial system",
                legacy: "Foundation for modern financial hegemony"
              },
              {
                system: "Structural Adjustment",
                period: "1980-Present",
                method: "IMF/World Bank conditions tied to market liberalization",
                impact: "Forces developing nations to open markets to foreign exploitation",
                legacy: "Modern form of economic colonialism"
              }
            ].map((system, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-red-200 hover:shadow-lg transition-all duration-300">
                <div className="text-sm font-semibold text-red-600 mb-2">{system.period}</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">{system.system}</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">Method:</p>
                    <p className="text-xs text-gray-600">{system.method}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-1">Impact:</p>
                    <p className="text-xs text-gray-600">{system.impact}</p>
                  </div>
                  <div className="bg-red-50 p-2 rounded">
                    <p className="text-xs font-semibold text-red-700 mb-1">Legacy:</p>
                    <p className="text-xs text-red-600">{system.legacy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mechanisms of Control */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Trade Dependencies */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <Anchor className="h-6 w-6" />
              Trade Dependency Mechanisms
            </h3>
            <p className="text-blue-700 mb-4">Colonial powers created economic dependencies:</p>
            <div className="space-y-3">
              {[
                "Raw Material Extraction: Colonies forced to export unprocessed goods",
                "Import Dependencies: Manufactured goods must be imported from colonizer",
                "Monoculture Economies: Single-crop specialization creates vulnerability",
                "Infrastructure Control: Transportation and ports owned by colonial powers",
                "Market Access Restrictions: Limited ability to trade with other nations",
                "Technology Transfer Barriers: Prevented industrial development"
              ].map((mechanism, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-blue-700">
                  <Ship className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{mechanism}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Controls */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200">
            <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              <Lock className="h-6 w-6" />
              Financial Control Systems
            </h3>
            <p className="text-purple-700 mb-4">Monetary tools used to maintain dominance:</p>
            <div className="space-y-3">
              {[
                "Currency Pegging: Local currencies tied to colonial power's currency",
                "Central Bank Control: Colonial powers controlling monetary policy",
                "Reserve Requirements: Colonies forced to hold reserves in colonial banks",
                "Credit Restrictions: Limited access to capital for local development",
                "Exchange Rate Manipulation: Artificial currency values favor colonizers",
                "Debt Bondage: Loans with impossible terms create permanent dependency"
              ].map((control, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-purple-700">
                  <Coins className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{control}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modern Neocolonialism */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-2 rounded-lg">
              <Building className="h-6 w-6 text-white" />
            </div>
            Modern Economic Colonialism
          </h3>
          <p className="text-lg text-gray-700 mb-6">
            Colonial control has evolved into sophisticated forms of economic dominance:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                form: "Debt Trap Diplomacy",
                example: "Belt and Road Initiative loans",
                mechanism: "Unsustainable loans leading to asset seizure",
                impact: "Strategic infrastructure control"
              },
              {
                form: "Currency Manipulation",
                example: "CFA Franc system",
                mechanism: "External currency control",
                impact: "Limited monetary sovereignty"
              },
              {
                form: "Resource Extraction",
                example: "African mining contracts",
                mechanism: "Unfavorable commodity agreements",
                impact: "Wealth flows to foreign corporations"
              },
              {
                form: "Financial Sanctions",
                example: "SWIFT system exclusion",
                mechanism: "Blocking international payments",
                impact: "Economic isolation and control"
              }
            ].map((form, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-orange-200 hover:shadow-md transition-all">
                <h4 className="font-semibold text-gray-900 mb-2">{form.form}</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-orange-700">Example:</p>
                    <p className="text-xs text-gray-600">{form.example}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-orange-700">Method:</p>
                    <p className="text-xs text-gray-600">{form.mechanism}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-orange-700">Impact:</p>
                    <p className="text-xs text-gray-600">{form.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Case Studies */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg">
              <Globe className="h-6 w-6 text-white" />
            </div>
            Case Studies in Monetary Colonialism
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                country: "Democratic Republic of Congo",
                colonial_power: "Belgium",
                mechanism: "Forced rubber extraction using currency controls",
                modern_legacy: "Ongoing mineral extraction by foreign corporations with minimal local benefit",
                resistance: "Attempts at currency reform face international pressure"
              },
              {
                country: "India",
                colonial_power: "Britain",
                mechanism: "Drain of wealth through tribute system and deindustrialization",
                modern_legacy: "Service-based economy serving Western markets",
                resistance: "Digital payment systems reducing Western financial dependency"
              },
              {
                country: "Haiti",
                colonial_power: "France",
                mechanism: "Independence debt that lasted until 1947",
                modern_legacy: "Chronic underdevelopment and aid dependency",
                resistance: "Local currency initiatives and regional cooperation"
              }
            ].map((study, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-3">{study.country}</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-green-700 mb-1">Colonial Method:</p>
                    <p className="text-xs text-gray-600">{study.mechanism}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-green-700 mb-1">Modern Legacy:</p>
                    <p className="text-xs text-gray-600">{study.modern_legacy}</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded">
                    <p className="text-xs font-semibold text-green-700 mb-1">Resistance:</p>
                    <p className="text-xs text-green-600">{study.resistance}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Psychological Impact */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-gray-600 to-slate-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            Psychological Impact of Economic Colonialism
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Individual Effects</h4>
              <div className="space-y-3">
                {[
                  "Internalized Inferiority: Belief that foreign systems are inherently better",
                  "Economic Anxiety: Constant fear of external economic shocks",
                  "Dependency Mindset: Reliance on external validation and support",
                  "Cultural Devaluation: Rejection of traditional economic practices",
                  "Learned Helplessness: Belief that economic sovereignty is impossible"
                ].map((effect, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <TrendingDown className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-500" />
                    <span>{effect}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Societal Impact</h4>
              <div className="space-y-3">
                {[
                  "Brain Drain: Educated individuals migrate to economically dominant countries",
                  "Cultural Erosion: Traditional economic knowledge is lost or devalued",
                  "Political Instability: Economic dependency creates governance challenges",
                  "Social Stratification: Elites benefit from colonial relationships",
                  "Reduced Innovation: Lack of economic independence stifles creativity"
                ].map((impact, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0 text-orange-500" />
                    <span>{impact}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Breaking Free */}
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 border border-cyan-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-2 rounded-lg">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            Strategies for Economic Independence
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                strategy: "Monetary Sovereignty",
                actions: [
                  "Develop independent central banking",
                  "Create regional currency unions",
                  "Implement local exchange systems",
                  "Build digital currency alternatives"
                ]
              },
              {
                strategy: "Trade Diversification",
                actions: [
                  "Develop South-South trade relationships",
                  "Build local manufacturing capacity",
                  "Create value-added export industries",
                  "Establish regional trade agreements"
                ]
              },
              {
                strategy: "Financial Education",
                actions: [
                  "Teach economic history and colonialism",
                  "Promote financial literacy programs",
                  "Develop local investment knowledge",
                  "Encourage cooperative economics"
                ]
              }
            ].map((approach, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-cyan-200">
                <h4 className="font-semibold text-gray-900 mb-4">{approach.strategy}</h4>
                <div className="space-y-2">
                  {approach.actions.map((action, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-cyan-700">
                      <CheckCircle className="h-3 w-3 flex-shrink-0" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modern Solutions */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Zap className="h-6 w-6" />
            Technology and Economic Decolonization
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-4">Emerging Solutions</h4>
              <div className="space-y-2">
                {[
                  "Cryptocurrencies enable direct peer-to-peer transactions",
                  "Blockchain technology reduces reliance on traditional banking",
                  "Digital payment systems bypass correspondent banking",
                  "Decentralized finance (DeFi) protocols provide alternative financial services",
                  "Mobile money systems reach the financially excluded"
                ].map((solution, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 text-yellow-300 flex-shrink-0" />
                    <span>{solution}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">The Path Forward</h4>
              <p className="text-indigo-200 text-sm leading-relaxed">
                Breaking free from economic colonialism requires understanding its mechanisms, 
                developing alternative systems, and building economic sovereignty. Technology 
                provides new tools, but the fundamental challenge remains: creating economic 
                systems that serve people rather than extractive powers. This requires both 
                individual financial education and collective action to build truly independent 
                economic foundations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ArticleLayout>
  );
};

export default ColonialismMoneyTrade;