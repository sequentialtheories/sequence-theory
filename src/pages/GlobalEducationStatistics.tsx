import ArticleLayout from "@/components/ArticleLayout";
import { 
  BarChart3, Globe, TrendingDown, TrendingUp, AlertTriangle, Users,
  BookOpen, GraduationCap, Coins, Building, Target, Shield,
  Eye, EyeOff, Heart, Brain, Lightbulb, CheckCircle, ArrowRight
} from "lucide-react";

const GlobalEducationStatistics = () => {
  return (
    <ArticleLayout
      title="Global Education Statistics"
      level="Advanced"
    >
      <div className="space-y-12">
        {/* Introduction Hero */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">The Global Education Crisis: Data and Insights</h2>
          </div>
          <p className="text-xl text-gray-700 leading-relaxed">
            Understanding the scope of global educational inequality requires examining hard data. 
            These statistics reveal not just numbers, but stories of human potential unrealized, 
            opportunities denied, and the urgent need for systemic change in how we approach education worldwide.
          </p>
        </div>

        {/* Global Education Overview */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 p-2 rounded-lg">
              <Globe className="h-6 w-6 text-white" />
            </div>
            Global Education Crisis by Numbers
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                stat: "244 Million",
                label: "Children and youth out of school",
                context: "Equivalent to the entire population of Indonesia",
                trend: "increasing",
                color: "text-red-600"
              },
              {
                stat: "771 Million",
                label: "Adults lack basic literacy skills",
                context: "More than 2x the population of the United States",
                trend: "slowly decreasing",
                color: "text-orange-600"
              },
              {
                stat: "617 Million",
                label: "Children cannot read or do basic math",
                context: "Despite being in school",
                trend: "stable",
                color: "text-yellow-600"
              },
              {
                stat: "4 Billion",
                label: "People lack meaningful internet access",
                context: "Cannot access digital learning resources",
                trend: "decreasing",
                color: "text-purple-600"
              }
            ].map((data, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-red-200 text-center hover:shadow-md transition-all">
                <div className={`text-3xl font-bold mb-2 ${data.color}`}>{data.stat}</div>
                <h4 className="font-semibold text-gray-900 mb-2">{data.label}</h4>
                <p className="text-gray-600 text-sm mb-2">{data.context}</p>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  data.trend === 'increasing' ? 'bg-red-100 text-red-700' :
                  data.trend === 'decreasing' ? 'bg-green-100 text-green-700' :
                  data.trend === 'slowly decreasing' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {data.trend}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Literacy Statistics */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-lg">
              <Coins className="h-6 w-6 text-white" />
            </div>
            Financial Literacy: The Hidden Crisis
          </h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { percentage: "57%", description: "of adults worldwide are financially illiterate", region: "Global Average" },
              { percentage: "43%", description: "of Americans can't explain compound interest", region: "United States" },
              { percentage: "70%", description: "of adults in developing countries lack bank accounts", region: "Developing World" },
              { percentage: "76%", description: "of millennials lack basic financial knowledge", region: "Young Adults" },
              { percentage: "84%", description: "of women in Sub-Saharan Africa are financially excluded", region: "Africa" },
              { percentage: "91%", description: "of financial products are not understood by users", region: "Product Complexity" }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-blue-200 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">{stat.percentage}</div>
                <p className="text-xs text-gray-600 mb-2">{stat.description}</p>
                <div className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                  {stat.region}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Disparities */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Education Access by Region */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              Primary Education Access by Region
            </h3>
            <div className="space-y-4">
              {[
                { region: "North America & Europe", access: "99%", children_oos: "1.2M", quality: "High" },
                { region: "Latin America & Caribbean", access: "94%", children_oos: "2.8M", quality: "Medium" },
                { region: "East Asia & Pacific", access: "96%", children_oos: "8.2M", quality: "Medium" },
                { region: "South & West Asia", access: "87%", children_oos: "12.4M", quality: "Low" },
                { region: "Arab States", access: "85%", children_oos: "5.1M", quality: "Medium" },
                { region: "Sub-Saharan Africa", access: "64%", children_oos: "97.3M", quality: "Low" }
              ].map((data, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border border-green-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm">{data.region}</h4>
                    <span className={`text-lg font-bold ${
                      parseInt(data.access) > 90 ? 'text-green-600' :
                      parseInt(data.access) > 80 ? 'text-yellow-600' : 'text-red-600'
                    }`}>{data.access}</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-semibold">Out of school:</span> {data.children_oos} children
                  </div>
                  <div className={`text-xs px-2 py-1 rounded mt-2 inline-block ${
                    data.quality === 'High' ? 'bg-green-100 text-green-700' :
                    data.quality === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    Quality: {data.quality}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gender Disparities */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
            <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              <Users className="h-6 w-6" />
              Gender Disparities in Education
            </h3>
            <div className="space-y-4">
              {[
                {
                  metric: "Girls out of primary school",
                  global: "53%",
                  worst_region: "Chad: 74%",
                  impact: "of out-of-school children are girls"
                },
                {
                  metric: "Women's literacy rate",
                  global: "83%",
                  worst_region: "Niger: 19%",
                  impact: "vs 90% for men globally"
                },
                {
                  metric: "Financial account ownership",
                  global: "65%",
                  worst_region: "Middle East: 35%",
                  impact: "women vs 72% men"
                },
                {
                  metric: "STEM field participation",
                  global: "28%",
                  worst_region: "South Asia: 18%",
                  impact: "women in engineering"
                },
                {
                  metric: "Digital literacy",
                  global: "52%",
                  worst_region: "LDCs: 15%",
                  impact: "women vs 69% men"
                }
              ].map((disparity, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-gray-900 text-sm mb-2">{disparity.metric}</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="font-semibold text-purple-700">Global:</span>
                      <div className="text-purple-600">{disparity.global}</div>
                    </div>
                    <div>
                      <span className="font-semibold text-red-700">Worst:</span>
                      <div className="text-red-600">{disparity.worst_region}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mt-2">{disparity.impact}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Economic Impact */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-2 rounded-lg">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
            Economic Cost of Educational Inequality
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                cost: "$5 Trillion",
                description: "Annual global loss from educational gaps",
                breakdown: "Lost productivity and innovation",
                timeframe: "Per year"
              },
              {
                cost: "$130 Trillion",
                description: "Lifetime earnings lost to learning poverty",
                breakdown: "Current generation of students",
                timeframe: "Lifetime impact"
              },
              {
                cost: "1.2% GDP",
                description: "Annual growth loss per country",
                breakdown: "From inadequate education systems",
                timeframe: "Annual"
              },
              {
                cost: "$200 Billion",
                description: "Cost to achieve universal primary education",
                breakdown: "One-time global investment needed",
                timeframe: "Implementation"
              }
            ].map((impact, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-orange-200 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-2">{impact.cost}</div>
                <h4 className="font-semibold text-gray-900 mb-2">{impact.description}</h4>
                <p className="text-gray-600 text-sm mb-2">{impact.breakdown}</p>
                <div className="text-xs text-orange-700 bg-orange-50 px-2 py-1 rounded">
                  {impact.timeframe}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Digital Divide */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-gray-600 to-slate-600 p-2 rounded-lg">
              <Eye className="h-6 w-6 text-white" />
            </div>
            The Digital Education Divide
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                category: "Internet Access",
                developed: "87%",
                developing: "47%",
                least_developed: "19%",
                impact: "Cannot access online learning resources"
              },
              {
                category: "Device Ownership",
                developed: "76%",
                developing: "43%",
                least_developed: "22%",
                impact: "Limited ability to participate in digital education"
              },
              {
                category: "Digital Skills",
                developed: "70%",
                developing: "31%",
                least_developed: "15%",
                impact: "Cannot effectively use educational technology"
              },
              {
                category: "Reliable Electricity",
                developed: "99%",
                developing: "85%",
                least_developed: "28%",
                impact: "Cannot charge devices or access consistent internet"
              },
              {
                category: "High-Speed Internet",
                developed: "78%",
                developing: "28%",
                least_developed: "8%",
                impact: "Limited to basic text-based learning only"
              },
              {
                category: "Educational Content",
                developed: "68%",
                developing: "24%",
                least_developed: "7%",
                impact: "Available in local languages and contexts"
              }
            ].map((divide, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">{divide.category}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Developed:</span>
                    <span className="text-sm font-semibold text-green-600">{divide.developed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Developing:</span>
                    <span className="text-sm font-semibold text-yellow-600">{divide.developing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Least Developed:</span>
                    <span className="text-sm font-semibold text-red-600">{divide.least_developed}</span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  <span className="font-semibold">Impact:</span> {divide.impact}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Crisis */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-2 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            The Learning Crisis: Quality vs Access
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Children in School but Not Learning</h4>
              <div className="space-y-3">
                {[
                  { region: "Sub-Saharan Africa", reading: "89%", math: "84%", description: "cannot read or do basic math" },
                  { region: "South Asia", reading: "76%", math: "78%", description: "lack foundational skills" },
                  { region: "Latin America", reading: "51%", math: "62%", description: "below minimum proficiency" },
                  { region: "Middle East", reading: "64%", math: "59%", description: "struggle with basics" }
                ].map((crisis, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg border border-yellow-200">
                    <h5 className="font-semibold text-gray-900 mb-2">{crisis.region}</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-semibold text-red-600">Reading:</span> {crisis.reading}
                      </div>
                      <div>
                        <span className="font-semibold text-red-600">Math:</span> {crisis.math}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">{crisis.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Contributing Factors</h4>
              <div className="space-y-3">
                {[
                  "Undertrained Teachers: 69% of teachers lack minimum qualifications",
                  "Overcrowded Classrooms: Average 40+ students per teacher in many regions",
                  "Lack of Materials: 57% of schools lack basic learning resources",
                  "Language Barriers: 37% taught in languages they don't speak at home",
                  "Poverty Impact: Hungry children cannot focus on learning",
                  "Cultural Barriers: Traditional practices that limit educational participation"
                ].map((factor, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-yellow-700">
                    <Brain className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Progress and Solutions */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            Progress and Proven Solutions
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Success Stories</h4>
              <div className="space-y-3">
                {[
                  { country: "Rwanda", achievement: "98% primary enrollment", method: "Free education + community support" },
                  { country: "Brazil", achievement: "50% reduction in illiteracy", method: "Adult literacy campaigns" },
                  { country: "Bangladesh", achievement: "Gender parity in primary education", method: "Girls' education incentives" },
                  { country: "Ethiopia", achievement: "85% increase in enrollment", method: "Mother tongue instruction" }
                ].map((success, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg border border-green-200">
                    <h5 className="font-semibold text-green-800 mb-1">{success.country}</h5>
                    <p className="text-sm text-gray-900 mb-2">{success.achievement}</p>
                    <p className="text-xs text-green-600">{success.method}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Scalable Solutions</h4>
              <div className="space-y-3">
                {[
                  "Technology Integration: Mobile learning platforms reach remote areas",
                  "Teacher Training: Intensive programs improve educational quality",
                  "Community Engagement: Local ownership increases sustainability",
                  "Flexible Scheduling: Accommodates work and family responsibilities",
                  "Multilingual Education: Instruction in local languages improves comprehension",
                  "Public-Private Partnerships: Leverage resources for maximum impact"
                ].map((solution, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-green-700">
                    <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{solution}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Target className="h-6 w-6" />
            The Path Forward: Evidence-Based Action
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-4">What the Data Tells Us</h4>
              <div className="space-y-2">
                {[
                  "Universal primary education is achievable with focused investment",
                  "Technology can bridge gaps but requires basic infrastructure",
                  "Quality matters more than access alone",
                  "Gender equality accelerates overall progress",
                  "Local solutions adapted to cultural contexts work best"
                ].map((insight, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-yellow-300 flex-shrink-0" />
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">The Opportunity</h4>
              <p className="text-indigo-200 text-sm leading-relaxed">
                The statistics paint a challenging picture, but they also reveal immense opportunity. 
                We know what works, we have the technology, and successful models exist. What's needed 
                is the political will, financial commitment, and coordinated action to scale proven 
                solutions. Every child denied education represents not just individual tragedy, but 
                collective loss of human potential that impoverishes us all.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ArticleLayout>
  );
};

export default GlobalEducationStatistics;