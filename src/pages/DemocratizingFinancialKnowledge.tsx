import ArticleLayout from "@/components/ArticleLayout";
import { 
  Users, Unlock, Globe, Lightbulb, Heart, Building, Zap,
  Target, BookOpen, Coins, TrendingUp, Shield, Eye, ArrowRight,
  CheckCircle, Brain, GraduationCap, Award, AlertTriangle
} from "lucide-react";

const DemocratizingFinancialKnowledge = () => {
  return (
    <ArticleLayout
      title="Democratizing Financial Knowledge"
      level="Advanced"
    >
      <div className="space-y-12">
        {/* Introduction Hero */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-3 rounded-xl">
              <Unlock className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Making Financial Knowledge Accessible to All</h2>
          </div>
          <p className="text-xl text-gray-700 leading-relaxed">
            Democratizing financial knowledge means breaking down the barriers that have historically kept 
            financial education exclusive and making it universally accessible, culturally relevant, and 
            practically applicable for everyone, regardless of their economic status, geography, or background.
          </p>
        </div>

        {/* Core Principles */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            Principles of Financial Democracy
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                principle: "Universal Access",
                description: "Financial education should be available to everyone, regardless of income, location, or social status",
                icon: Globe,
                examples: ["Free online courses", "Community workshops", "Mobile learning platforms"]
              },
              {
                principle: "Cultural Relevance",
                description: "Financial concepts adapted to local contexts, values, and economic realities",
                icon: Heart,
                examples: ["Local currency examples", "Community-based practices", "Traditional saving methods"]
              },
              {
                principle: "Practical Application",
                description: "Focus on immediately usable skills and real-world financial challenges",
                icon: Zap,
                examples: ["Budgeting tools", "Investment simulators", "Debt management strategies"]
              },
              {
                principle: "Plain Language",
                description: "Complex financial concepts explained in simple, understandable terms",
                icon: Eye,
                examples: ["Jargon-free explanations", "Visual learning aids", "Step-by-step guides"]
              },
              {
                principle: "Collaborative Learning",
                description: "Peer-to-peer education and community-driven knowledge sharing",
                icon: Users,
                examples: ["Study groups", "Mentorship programs", "Community forums"]
              },
              {
                principle: "Continuous Support",
                description: "Ongoing resources and assistance rather than one-time education",
                icon: Shield,
                examples: ["Follow-up sessions", "Q&A platforms", "Progress tracking"]
              }
            ].map((principle, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300">
                <principle.icon className="h-8 w-8 text-blue-600 mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-3">{principle.principle}</h4>
                <p className="text-gray-600 text-sm mb-4">{principle.description}</p>
                <div className="space-y-1">
                  {principle.examples.map((example, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-blue-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>{example}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breaking Down Barriers */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Traditional Barriers */}
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200">
            <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Traditional Barriers to Break
            </h3>
            <div className="space-y-4">
              {[
                {
                  barrier: "Economic Barriers",
                  details: "High costs of financial education and advisory services",
                  solution: "Free and low-cost educational resources"
                },
                {
                  barrier: "Geographic Barriers",
                  details: "Limited access in rural and remote areas",
                  solution: "Digital platforms and mobile education"
                },
                {
                  barrier: "Language Barriers",
                  details: "Financial education only available in dominant languages",
                  solution: "Multilingual content and local language programs"
                },
                {
                  barrier: "Cultural Barriers",
                  details: "Western-centric financial models that don't fit local contexts",
                  solution: "Culturally adapted curricula and examples"
                },
                {
                  barrier: "Complexity Barriers",
                  details: "Deliberately complex jargon and unnecessarily complicated explanations",
                  solution: "Plain language and visual learning tools"
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-gray-900 mb-2">{item.barrier}</h4>
                  <p className="text-sm text-gray-600 mb-2">{item.details}</p>
                  <div className="bg-green-50 p-2 rounded text-xs">
                    <span className="font-semibold text-green-700">Solution: </span>
                    <span className="text-green-600">{item.solution}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Democratic Solutions */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <Lightbulb className="h-6 w-6" />
              Democratic Education Approaches
            </h3>
            <div className="space-y-4">
              {[
                {
                  approach: "Peer Education Networks",
                  description: "Community members teaching community members",
                  impact: "Builds trust and ensures cultural relevance"
                },
                {
                  approach: "Open Source Resources",
                  description: "Freely available educational materials that can be adapted",
                  impact: "Enables local customization and continuous improvement"
                },
                {
                  approach: "Technology Platforms",
                  description: "Mobile apps and online platforms for scalable delivery",
                  impact: "Reaches remote areas and provides 24/7 access"
                },
                {
                  approach: "Community Partnerships",
                  description: "Collaboration with local organizations and leaders",
                  impact: "Leverages existing trust and social networks"
                },
                {
                  approach: "Gamification",
                  description: "Game-based learning that makes education engaging",
                  impact: "Increases participation and retention rates"
                }
              ].map((approach, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-2">{approach.approach}</h4>
                  <p className="text-sm text-gray-600 mb-2">{approach.description}</p>
                  <div className="bg-blue-50 p-2 rounded text-xs">
                    <span className="font-semibold text-blue-700">Impact: </span>
                    <span className="text-blue-600">{approach.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technology as Democratizer */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-violet-600 p-2 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            Technology: The Great Equalizer
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                technology: "Mobile Learning",
                reach: "5.2B mobile users",
                benefit: "Accessibility in remote areas",
                example: "SMS-based financial tips and courses"
              },
              {
                technology: "AI-Powered Personalization",
                reach: "Infinite scalability",
                benefit: "Customized learning paths",
                example: "Adaptive quizzes and content recommendations"
              },
              {
                technology: "Blockchain Credentials",
                reach: "Global verification",
                benefit: "Portable qualifications",
                example: "Tamper-proof certificates and achievements"
              },
              {
                technology: "Virtual Reality Training",
                reach: "Immersive experiences",
                benefit: "Safe practice environments",
                example: "Virtual investment simulations"
              }
            ].map((tech, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-purple-200 text-center hover:shadow-md transition-all">
                <h4 className="font-semibold text-gray-900 mb-3">{tech.technology}</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-purple-700">Reach:</p>
                    <p className="text-sm text-purple-600">{tech.reach}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-purple-700">Benefit:</p>
                    <p className="text-sm text-gray-600">{tech.benefit}</p>
                  </div>
                  <div className="bg-purple-50 p-2 rounded">
                    <p className="text-xs font-semibold text-purple-700">Example:</p>
                    <p className="text-xs text-purple-600">{tech.example}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community-Based Models */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-2 rounded-lg">
              <Building className="h-6 w-6 text-white" />
            </div>
            Community-Driven Financial Education Models
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                model: "Village Savings and Loan Associations (VSLAs)",
                participants: "12M+ members globally",
                method: "Peer-led groups that combine saving, lending, and financial education",
                success: "96% of participants report improved financial knowledge",
                countries: "Predominantly Africa and Asia"
              },
              {
                model: "Community Development Financial Institutions (CDFIs)",
                participants: "50M+ people served",
                method: "Locally-controlled organizations providing financial services and education",
                success: "85% of clients increase their credit scores",
                countries: "United States and expanding globally"
              },
              {
                model: "Rotating Savings and Credit Associations (ROSCAs)",
                participants: "200M+ participants worldwide",
                method: "Informal groups that pool resources and provide financial discipline",
                success: "Enables access to credit for unbanked populations",
                countries: "Global, especially developing nations"
              },
              {
                model: "Cooperative Financial Education",
                participants: "1B+ cooperative members",
                method: "Member-owned institutions teaching democratic financial principles",
                success: "Higher financial literacy rates among members",
                countries: "Worldwide, strong in Europe and Latin America"
              },
              {
                model: "Faith-Based Financial Ministry",
                participants: "500M+ religious community members",
                method: "Integrating financial education with spiritual values",
                success: "High trust and participation rates",
                countries: "Global, adapted to local religious contexts"
              },
              {
                model: "Workplace Financial Wellness",
                participants: "100M+ employees",
                method: "Employer-sponsored financial education programs",
                success: "Reduced financial stress and increased productivity",
                countries: "Primarily developed nations, expanding globally"
              }
            ].map((model, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-orange-200">
                <h4 className="font-semibold text-gray-900 mb-3">{model.model}</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-orange-700">Scale:</p>
                    <p className="text-sm text-orange-600">{model.participants}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700">Method:</p>
                    <p className="text-xs text-gray-600">{model.method}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-green-700">Success:</p>
                    <p className="text-xs text-green-600">{model.success}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-blue-700">Regions:</p>
                    <p className="text-xs text-blue-600">{model.countries}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Implementation Strategies */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Getting Started */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200">
            <h3 className="text-xl font-bold text-cyan-800 mb-4 flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              Getting Started: Individual Action
            </h3>
            <div className="space-y-3">
              {[
                "Assess your own financial knowledge honestly and identify gaps",
                "Seek out free educational resources and commit to regular learning",
                "Practice financial skills with small amounts before scaling up",
                "Connect with others who share learning goals",
                "Share knowledge with family and friends as you learn",
                "Challenge financial jargon and demand clear explanations",
                "Support organizations that promote financial democracy",
                "Advocate for financial education in your community"
              ].map((action, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-cyan-700">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Organizational Implementation */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200">
            <h3 className="text-xl font-bold text-teal-800 mb-4 flex items-center gap-2">
              <Building className="h-6 w-6" />
              Organizational Implementation
            </h3>
            <div className="space-y-3">
              {[
                "Conduct community needs assessments to understand local challenges",
                "Partner with existing trusted community organizations",
                "Develop culturally appropriate educational materials",
                "Train local facilitators and create peer education networks",
                "Use multiple delivery channels (online, mobile, in-person)",
                "Provide ongoing support beyond initial education",
                "Measure impact and continuously improve programs",
                "Advocate for policy changes that support financial democracy"
              ].map((strategy, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-teal-700">
                  <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{strategy}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Success Metrics */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            Measuring Success in Financial Democracy
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                metric: "Participation Rate",
                description: "Percentage of target population engaged",
                target: ">70%",
                measurement: "Enrollment and completion data"
              },
              {
                metric: "Knowledge Retention",
                description: "Long-term retention of financial concepts",
                target: ">80%",
                measurement: "Follow-up assessments at 3, 6, 12 months"
              },
              {
                metric: "Behavior Change",
                description: "Adoption of better financial practices",
                target: ">60%",
                measurement: "Surveys and financial behavior tracking"
              },
              {
                metric: "Economic Impact",
                description: "Measurable improvement in financial wellbeing",
                target: ">40%",
                measurement: "Income, savings, debt reduction metrics"
              }
            ].map((metric, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-yellow-200 text-center">
                <h4 className="font-semibold text-gray-900 mb-2">{metric.metric}</h4>
                <p className="text-sm text-gray-600 mb-2">{metric.description}</p>
                <div className="text-lg font-bold text-yellow-600 mb-2">{metric.target}</div>
                <p className="text-xs text-gray-500">{metric.measurement}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vision for the Future */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Award className="h-6 w-6" />
            The Future of Financial Democracy
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-4">Our Vision</h4>
              <div className="space-y-2">
                {[
                  "Universal financial literacy as a basic human right",
                  "Technology-enabled personalized learning for everyone",
                  "Community-driven education that respects local contexts",
                  "Financial systems designed for transparency and accessibility",
                  "Economic empowerment that reduces inequality globally"
                ].map((vision, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <GraduationCap className="h-4 w-4 text-yellow-300 flex-shrink-0" />
                    <span>{vision}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">The Path Forward</h4>
              <p className="text-indigo-200 text-sm leading-relaxed">
                Democratizing financial knowledge is not just about individual empowerment—it's about 
                creating a more equitable and sustainable economic system for all. When everyone has 
                access to financial education, we reduce inequality, increase economic stability, and 
                unlock human potential on a global scale. The tools exist, the models work, and the 
                need is urgent. What's required now is the collective will to make financial democracy 
                a reality for every person, everywhere.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ArticleLayout>
  );
};

export default DemocratizingFinancialKnowledge;