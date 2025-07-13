import ArticleLayout from "@/components/ArticleLayout";
import { 
  AlertTriangle, TrendingDown, Users, Brain, Heart, Shield,
  BookOpen, Target, BarChart3, Globe, Lock, Eye, EyeOff,
  Building, Coins, GraduationCap, Lightbulb, CheckCircle
} from "lucide-react";

const ConsequencesEducationalAbsence = () => {
  return (
    <ArticleLayout
      title="Consequences of Educational Absence"
      level="Beginner"
    >
      <div className="space-y-12">
        {/* Introduction Hero */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 p-3 rounded-xl">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">When Education is Absent: The Human Cost</h2>
          </div>
          <p className="text-xl text-gray-700 leading-relaxed">
            The absence of quality education creates devastating ripple effects that extend far beyond individual lives, 
            impacting families, communities, and entire nations. Understanding these consequences reveals why educational 
            access is not just a personal benefit, but a fundamental human right essential for societal progress.
          </p>
        </div>

        {/* Individual Consequences */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            Individual Impact: The Personal Cost
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Limited Economic Opportunities",
                description: "Without education, individuals face restricted job prospects and lower earning potential",
                icon: Coins,
                stats: "Adults without basic education earn 42% less on average"
              },
              {
                title: "Reduced Critical Thinking",
                description: "Lack of formal education limits analytical skills and decision-making abilities",
                icon: Brain,
                stats: "Higher susceptibility to misinformation and manipulation"
              },
              {
                title: "Health Disparities",
                description: "Educational absence correlates with poorer health outcomes and lifestyle choices",
                icon: Heart,
                stats: "Lower life expectancy and higher disease rates"
              },
              {
                title: "Social Exclusion",
                description: "Limited education creates barriers to full participation in society",
                icon: Users,
                stats: "Reduced civic engagement and community involvement"
              },
              {
                title: "Intergenerational Poverty",
                description: "Parents without education struggle to support their children's learning",
                icon: TrendingDown,
                stats: "75% of children in poverty have parents with limited education"
              },
              {
                title: "Digital Divide",
                description: "Lack of digital literacy excludes individuals from modern opportunities",
                icon: EyeOff,
                stats: "Missing out on digital economy benefits"
              }
            ].map((consequence, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300">
                <consequence.icon className="h-8 w-8 text-blue-600 mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-3">{consequence.title}</h4>
                <p className="text-gray-600 text-sm mb-3">{consequence.description}</p>
                <div className="text-xs text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
                  {consequence.stats}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Societal Consequences */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Economic Impact */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Economic Consequences
            </h3>
            <p className="text-green-700 mb-4">Educational absence creates massive economic costs:</p>
            <div className="space-y-3">
              {[
                "Reduced GDP Growth: Countries lose 1-2% annual GDP growth due to educational gaps",
                "Lower Productivity: Unskilled workforce limits innovation and efficiency",
                "Higher Welfare Costs: More social support needed for undereducated populations",
                "Brain Drain: Educated individuals leave areas with poor educational systems",
                "Reduced Tax Revenue: Lower incomes mean less tax contribution",
                "Innovation Deficit: Fewer educated minds to solve complex problems"
              ].map((impact, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-green-700">
                  <TrendingDown className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-500" />
                  <span>{impact}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Consequences */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200">
            <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              <Users className="h-6 w-6" />
              Social Breakdown
            </h3>
            <p className="text-purple-700 mb-4">Educational absence undermines social cohesion:</p>
            <div className="space-y-3">
              {[
                "Increased Crime Rates: Lack of education correlates with higher criminal activity",
                "Political Instability: Uneducated populations are more susceptible to extremism",
                "Social Inequality: Educational gaps widen wealth and opportunity disparities",
                "Reduced Civic Participation: Lower voting rates and community engagement",
                "Cultural Stagnation: Limited preservation and advancement of cultural knowledge",
                "Weakened Democracy: Uninformed citizenry undermines democratic processes"
              ].map((consequence, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-purple-700">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-500" />
                  <span>{consequence}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Statistics */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-2 rounded-lg">
              <Globe className="h-6 w-6 text-white" />
            </div>
            Global Educational Crisis: By the Numbers
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { number: "244M", description: "Children and youth out of school globally", color: "text-red-600" },
              { number: "771M", description: "Adults lack basic literacy skills worldwide", color: "text-orange-600" },
              { number: "57%", description: "Of adults can't explain basic financial concepts", color: "text-yellow-600" },
              { number: "$5T", description: "Annual global economic loss from educational gaps", color: "text-purple-600" }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-orange-200 text-center hover:shadow-md transition-all">
                <div className={`text-3xl font-bold mb-2 ${stat.color}`}>{stat.number}</div>
                <p className="text-gray-600 text-sm">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Case Studies */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-gray-600 to-slate-600 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            Historical Examples: When Education is Denied
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Apartheid South Africa",
                period: "1948-1994",
                consequence: "Deliberate educational inequality created lasting economic and social disparities that persist today",
                lesson: "Educational segregation perpetuates systemic inequality"
              },
              {
                title: "Taliban Education Bans",
                period: "1996-2001, 2021-present",
                consequence: "Prohibiting female education devastated Afghanistan's human capital and economic development",
                lesson: "Gender-based educational exclusion harms entire societies"
              },
              {
                title: "Cultural Revolution China",
                period: "1966-1976",
                consequence: "Closing schools and persecuting intellectuals created a 'lost generation' with lasting economic impact",
                lesson: "Anti-intellectual policies destroy societal progress"
              }
            ].map((example, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all">
                <h4 className="font-semibold text-gray-900 mb-2">{example.title}</h4>
                <div className="text-sm text-gray-500 mb-3">{example.period}</div>
                <p className="text-gray-600 text-sm mb-4">{example.consequence}</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-gray-700">Key Lesson:</p>
                  <p className="text-xs text-gray-600">{example.lesson}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breaking the Cycle */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            Breaking the Cycle: Solutions and Interventions
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Immediate Interventions</h4>
              <div className="space-y-3">
                {[
                  "Free primary education programs",
                  "Adult literacy campaigns",
                  "Mobile education initiatives",
                  "Community learning centers",
                  "Digital literacy programs"
                ].map((intervention, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-emerald-700">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{intervention}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Long-term Solutions</h4>
              <div className="space-y-3">
                {[
                  "Universal basic education policies",
                  "Teacher training and support",
                  "Educational infrastructure development",
                  "Culturally relevant curricula",
                  "Technology-enabled learning"
                ].map((solution, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-emerald-700">
                    <Lightbulb className="h-4 w-4 flex-shrink-0" />
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
            The Urgency of Action
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-4">Why We Must Act Now</h4>
              <div className="space-y-2">
                {[
                  "Every day of educational absence compounds future disadvantages",
                  "Technology is accelerating the gap between educated and uneducated",
                  "Global challenges require educated populations to solve",
                  "The window for intervention narrows with each generation"
                ].map((reason, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-yellow-300 flex-shrink-0" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">The Promise of Education</h4>
              <p className="text-indigo-200 text-sm leading-relaxed">
                When we ensure educational access for all, we unlock human potential, strengthen communities, 
                and create a foundation for sustainable progress. The consequences of educational absence are severe, 
                but they are not inevitable. Through deliberate action and collective commitment, we can build 
                a world where every person has the opportunity to learn, grow, and contribute to human advancement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ArticleLayout>
  );
};

export default ConsequencesEducationalAbsence;