import ArticleLayout from "@/components/ArticleLayout";
import { 
  Lock, Shield, Eye, EyeOff, Target, Building, Crown, Coins,
  Users, BookOpen, BarChart3, AlertTriangle, TrendingUp, Brain,
  Globe, Lightbulb, CheckCircle, ArrowRight, Key, Unlock
} from "lucide-react";

const FinancialLiteracyGatekeeping = () => {
  return (
    <ArticleLayout
      title="Financial Literacy Gatekeeping"
      level="Intermediate"
    >
      <div className="space-y-12">
        {/* Introduction Hero */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-3 rounded-xl">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">The Hidden Barriers to Financial Knowledge</h2>
          </div>
          <p className="text-xl text-gray-700 leading-relaxed">
            Throughout history, financial knowledge has been deliberately restricted, creating artificial barriers 
            that serve to maintain existing power structures. Understanding these gatekeeping mechanisms reveals 
            how financial education has been used as a tool of control rather than empowerment.
          </p>
        </div>

        {/* Historical Gatekeeping */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-violet-600 p-2 rounded-lg">
              <Crown className="h-6 w-6 text-white" />
            </div>
            Historical Financial Gatekeeping
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                era: "Ancient Civilizations",
                period: "3000 BCE - 500 CE",
                method: "Priestly Classes",
                description: "Religious leaders controlled mathematical and financial knowledge, making it sacred and exclusive",
                impact: "Created dependency on temple institutions for financial transactions"
              },
              {
                era: "Medieval Europe",
                period: "500 - 1500 CE",
                method: "Guild Systems",
                description: "Trade guilds restricted financial knowledge to members, controlling who could participate in commerce",
                impact: "Limited economic mobility and concentrated wealth among established families"
              },
              {
                era: "Banking Renaissance",
                period: "1400 - 1700 CE",
                method: "Family Banking Houses",
                description: "Wealthy families like the Medici kept financial techniques secret to maintain dominance",
                impact: "Created banking oligarchies that influenced entire nations"
              },
              {
                era: "Industrial Revolution",
                period: "1760 - 1840 CE",
                method: "Capital Requirements",
                description: "High barriers to entry for financial markets excluded working classes from investment",
                impact: "Widened wealth gap between owners and workers"
              },
              {
                era: "Modern Banking",
                period: "1900 - 1980 CE",
                method: "Professional Licensing",
                description: "Created complex certification requirements that limited who could provide financial advice",
                impact: "Made financial guidance expensive and inaccessible to average people"
              },
              {
                era: "Digital Age",
                period: "1980 - Present",
                method: "Information Complexity",
                description: "Financial products became increasingly complex, requiring specialized knowledge to understand",
                impact: "Created new forms of exclusion through deliberate obfuscation"
              }
            ].map((period, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-purple-200 hover:shadow-lg transition-all duration-300">
                <div className="text-sm font-semibold text-purple-600 mb-2">{period.period}</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{period.era}</h4>
                <div className="bg-purple-50 px-3 py-1 rounded-full text-xs font-semibold text-purple-700 mb-3 inline-block">
                  {period.method}
                </div>
                <p className="text-gray-600 text-sm mb-3">{period.description}</p>
                <div className="border-t border-purple-100 pt-3">
                  <p className="text-xs text-purple-700 font-medium">Impact: {period.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modern Gatekeeping Mechanisms */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Institutional Barriers */}
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200">
            <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
              <Building className="h-6 w-6" />
              Institutional Gatekeeping
            </h3>
            <p className="text-red-700 mb-4">Modern institutions maintain financial knowledge barriers:</p>
            <div className="space-y-3">
              {[
                "Minimum Investment Requirements: Exclude small investors from opportunities",
                "Accredited Investor Rules: Limit advanced investments to wealthy individuals",
                "Complex Financial Jargon: Make products deliberately difficult to understand",
                "High Advisory Fees: Price out average people from professional guidance",
                "Regulatory Capture: Industry influences rules to benefit established players",
                "Educational Gatekeeping: Expensive business schools control access to knowledge"
              ].map((barrier, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-red-700">
                  <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{barrier}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Information Asymmetry */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              <EyeOff className="h-6 w-6" />
              Information Asymmetry
            </h3>
            <p className="text-blue-700 mb-4">Deliberate information gaps maintain advantages:</p>
            <div className="space-y-3">
              {[
                "Hidden Fees: Financial products obscure true costs from consumers",
                "Insider Information: Privileged access to market-moving information",
                "Complex Structures: Deliberately confusing product designs",
                "Marketing Manipulation: Emotional appeals over factual education",
                "Timing Advantages: Early access to investment opportunities",
                "Network Effects: Exclusive relationships and information sharing"
              ].map((asymmetry, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-blue-700">
                  <Eye className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{asymmetry}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* The Cost of Gatekeeping */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-gray-600 to-slate-600 p-2 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            The True Cost of Financial Gatekeeping
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                metric: "Wealth Gap",
                impact: "Top 1% owns 32% of all wealth",
                description: "Gatekeeping concentrates wealth among the financially educated elite",
                trend: "trending-up"
              },
              {
                metric: "Financial Stress",
                impact: "64% live paycheck to paycheck",
                description: "Lack of financial education creates chronic financial anxiety",
                trend: "trending-up"
              },
              {
                metric: "Retirement Crisis",
                impact: "$3.68T retirement shortfall",
                description: "Gatekeeping prevents effective retirement planning",
                trend: "trending-up"
              },
              {
                metric: "Economic Mobility",
                impact: "Only 7.5% escape poverty",
                description: "Financial ignorance traps people in economic disadvantage",
                trend: "trending-down"
              }
            ].map((cost, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 text-center hover:shadow-md transition-all">
                <div className="text-2xl font-bold text-red-600 mb-2">{cost.impact}</div>
                <h4 className="font-semibold text-gray-900 mb-2">{cost.metric}</h4>
                <p className="text-gray-600 text-xs">{cost.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Methods of Control */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-2 rounded-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            How Financial Gatekeeping Works
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                method: "Educational Scarcity",
                tactics: [
                  "Limited financial education in schools",
                  "Expensive advanced training programs",
                  "Academic language barriers",
                  "Focus on theory over practical application"
                ],
                icon: BookOpen
              },
              {
                method: "Access Restrictions",
                tactics: [
                  "High minimum investments",
                  "Geographic limitations",
                  "Income requirements",
                  "Social network prerequisites"
                ],
                icon: Lock
              },
              {
                method: "Complexity Inflation",
                tactics: [
                  "Unnecessarily complex products",
                  "Legal jargon in documentation",
                  "Multiple fee structures",
                  "Confusing terminology"
                ],
                icon: Brain
              }
            ].map((control, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-orange-200">
                <control.icon className="h-8 w-8 text-orange-600 mb-4" />
                <h4 className="font-semibold text-gray-900 mb-4">{control.method}</h4>
                <div className="space-y-2">
                  {control.tactics.map((tactic, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0"></div>
                      <span>{tactic}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Who Benefits */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            Who Benefits from Financial Gatekeeping?
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Primary Beneficiaries</h4>
              <div className="space-y-4">
                {[
                  {
                    group: "Financial Institutions",
                    benefit: "Higher fees from uninformed customers",
                    mechanism: "Information asymmetry enables premium pricing"
                  },
                  {
                    group: "Wealthy Families",
                    benefit: "Reduced competition for investment opportunities",
                    mechanism: "Exclusive access to high-return investments"
                  },
                  {
                    group: "Financial Advisors",
                    benefit: "Professional monopoly on financial guidance",
                    mechanism: "Licensing requirements limit competition"
                  }
                ].map((beneficiary, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg border border-green-200">
                    <h5 className="font-semibold text-green-800 mb-1">{beneficiary.group}</h5>
                    <p className="text-sm text-gray-600 mb-2">{beneficiary.benefit}</p>
                    <p className="text-xs text-green-600">{beneficiary.mechanism}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Systemic Advantages</h4>
              <div className="space-y-3">
                {[
                  "Reduced market efficiency benefits established players",
                  "Information advantages create unfair competitive moats",
                  "Regulatory complexity favors large institutions",
                  "Educational barriers maintain status quo power structures",
                  "Network effects strengthen existing relationships",
                  "Complexity justifies high fees and intermediaries"
                ].map((advantage, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-green-700">
                    <Coins className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{advantage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Breaking Down Barriers */}
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 border border-cyan-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-2 rounded-lg">
              <Unlock className="h-6 w-6 text-white" />
            </div>
            Breaking Down Financial Gatekeeping
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Technology Solutions</h4>
              <div className="space-y-3">
                {[
                  "Online learning platforms democratize financial education",
                  "Robo-advisors reduce advisory costs",
                  "Cryptocurrency enables direct peer-to-peer transactions",
                  "Mobile apps provide accessible financial tools",
                  "Open-source financial models increase transparency"
                ].map((solution, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-cyan-700">
                    <Lightbulb className="h-4 w-4 flex-shrink-0" />
                    <span>{solution}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Educational Reforms</h4>
              <div className="space-y-3">
                {[
                  "Mandatory financial literacy in school curricula",
                  "Plain language requirements for financial products",
                  "Free public financial education programs",
                  "Community-based financial workshops",
                  "Simplified investment platforms for beginners"
                ].map((reform, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-cyan-700">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{reform}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Key className="h-6 w-6" />
            Unlocking Financial Knowledge for All
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-4">The Path Forward</h4>
              <div className="space-y-2">
                {[
                  "Recognize gatekeeping when you encounter it",
                  "Seek out free and accessible financial education",
                  "Share knowledge with others in your community",
                  "Support policies that promote financial transparency",
                  "Use technology to bypass traditional gatekeepers"
                ].map((action, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 text-yellow-300 flex-shrink-0" />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">A Democratic Future</h4>
              <p className="text-indigo-200 text-sm leading-relaxed">
                Financial knowledge should be a public good, not a private privilege. By understanding 
                how gatekeeping works, we can actively work to dismantle these barriers and create 
                a more equitable financial system. The democratization of financial education is not 
                just about individual empowerment—it's about building a society where economic 
                opportunity is based on merit and effort, not on privileged access to information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ArticleLayout>
  );
};

export default FinancialLiteracyGatekeeping;
