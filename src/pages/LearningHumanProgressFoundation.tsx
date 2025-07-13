import ArticleLayout from "@/components/ArticleLayout";
import { 
  Brain, BookOpen, Users, TrendingUp, Target, AlertTriangle, 
  Lightbulb, Award, CheckCircle, ArrowRight, Globe, BarChart3,
  GraduationCap, Heart, Zap, Building, Lock, Unlock, Eye, EyeOff
} from "lucide-react";

const LearningHumanProgressFoundation = () => {
  return (
    <ArticleLayout
      title="Learning as Human Progress Foundation"
      level="Beginner"
    >
      <div className="space-y-12">
        {/* Introduction Hero */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Learning: The Foundation of All Progress</h2>
          </div>
          <p className="text-xl text-gray-700 leading-relaxed">
            Throughout human history, learning has been the single most powerful force driving civilization forward. 
            From the discovery of fire to the digital revolution, every breakthrough emerged from humanity's capacity 
            to learn, adapt, and build upon previous knowledge.
          </p>
        </div>

        {/* Historical Impact */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            Learning Throughout History
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                period: "Agricultural Revolution",
                impact: "Learning farming techniques transformed nomadic societies into settled civilizations",
                year: "~10,000 BCE"
              },
              {
                period: "Written Language",
                impact: "Recording knowledge enabled information to persist across generations",
                year: "~3200 BCE"
              },
              {
                period: "Scientific Method",
                impact: "Systematic learning approaches accelerated discovery and innovation",
                year: "~1600 CE"
              },
              {
                period: "Industrial Revolution",
                impact: "Technical education and skills training created modern manufacturing",
                year: "~1760 CE"
              },
              {
                period: "Information Age",
                impact: "Democratized access to learning resources transformed global society",
                year: "~1970 CE"
              },
              {
                period: "Digital Era",
                impact: "Online learning platforms make knowledge accessible to billions",
                year: "~2000 CE"
              }
            ].map((era, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300">
                <div className="text-sm font-semibold text-green-600 mb-2">{era.year}</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">{era.period}</h4>
                <p className="text-gray-600 text-sm">{era.impact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Core Principles */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Why Learning Matters */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200">
            <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              <Lightbulb className="h-6 w-6" />
              Why Learning Drives Progress
            </h3>
            <div className="space-y-4">
              {[
                "Innovation: New ideas emerge when people learn from existing knowledge",
                "Problem-Solving: Complex challenges require educated minds to find solutions",
                "Adaptation: Learning enables societies to respond to changing environments",
                "Knowledge Transfer: Teaching passes wisdom from one generation to the next",
                "Critical Thinking: Education develops the ability to analyze and evaluate",
                "Creativity: Learning provides the foundation for imaginative breakthroughs"
              ].map((principle, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-purple-700">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{principle}</span>
                </div>
              ))}
            </div>
          </div>

          {/* The Multiplier Effect */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
            <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              The Learning Multiplier Effect
            </h3>
            <p className="text-orange-700 mb-4">Education creates exponential benefits that ripple through society:</p>
            <div className="space-y-3">
              {[
                "Individual Growth → Personal empowerment and opportunities",
                "Family Impact → Breaking cycles of poverty and disadvantage",
                "Community Development → Stronger, more prosperous neighborhoods",
                "Economic Growth → Skilled workforce drives innovation",
                "Social Progress → Educated populations make better decisions",
                "Global Advancement → Collective human knowledge expansion"
              ].map((effect, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-orange-700">
                  <ArrowRight className="h-4 w-4 flex-shrink-0" />
                  <span>{effect}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modern Learning Landscape */}
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 border border-cyan-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-2 rounded-lg">
              <Globe className="h-6 w-6 text-white" />
            </div>
            The Modern Learning Revolution
          </h3>
          <p className="text-lg text-gray-700 mb-6">
            Today's digital age has transformed how we access and share knowledge:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Globe, title: "Global Access", desc: "Internet connects learners worldwide" },
              { icon: BarChart3, title: "Personalized Learning", desc: "AI adapts content to individual needs" },
              { icon: Users, title: "Collaborative Education", desc: "Peer-to-peer learning communities" },
              { icon: Zap, title: "Instant Information", desc: "Knowledge available on-demand" }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-cyan-200 hover:shadow-md transition-all text-center">
                <feature.icon className="h-8 w-8 text-cyan-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Barriers to Learning */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8 border border-red-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-red-600 to-pink-600 p-2 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            Overcoming Learning Barriers
          </h3>
          <p className="text-lg text-gray-700 mb-6">
            Despite its importance, quality education faces significant challenges:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { barrier: "Economic Inequality", solution: "Free and low-cost educational resources", icon: Lock },
              { barrier: "Geographic Isolation", solution: "Online learning platforms and mobile education", icon: Globe },
              { barrier: "Language Barriers", solution: "Multilingual content and translation tools", icon: BookOpen },
              { barrier: "Cultural Restrictions", solution: "Inclusive educational approaches", icon: Users },
              { barrier: "Technological Gaps", solution: "Infrastructure development and device access", icon: Zap },
              { barrier: "Information Gatekeeping", solution: "Open educational resources and transparency", icon: Unlock }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-red-200">
                <item.icon className="h-6 w-6 text-red-600 mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">{item.barrier}</h4>
                <p className="text-gray-600 text-sm">{item.solution}</p>
              </div>
            ))}
          </div>
        </div>

        {/* The Future of Learning */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <GraduationCap className="h-6 w-6" />
            The Future of Human Learning
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Artificial Intelligence will personalize learning experiences for every individual",
              "Virtual and augmented reality will make abstract concepts tangible and immersive",
              "Blockchain technology will create verifiable, portable educational credentials",
              "Microlearning will enable continuous skill development throughout careers",
              "Global collaboration will solve humanity's greatest challenges through shared knowledge",
              "Universal access to quality education will unlock human potential worldwide"
            ].map((future, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-white/10 rounded-lg">
                <Award className="h-5 w-5 text-yellow-300 flex-shrink-0" />
                <span className="text-white text-sm">{future}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="bg-gradient-to-br from-gray-900 to-blue-900 text-white rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Target className="h-6 w-6" />
            Key Insights
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Learning is the fundamental driver of all human progress and civilization",
              "Education creates exponential benefits that multiply across generations",
              "Modern technology democratizes access to knowledge like never before",
              "Overcoming learning barriers is essential for global human development",
              "The future depends on our commitment to universal, quality education",
              "Every individual has the potential to contribute to humanity's knowledge"
            ].map((insight, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
                <span className="text-white text-sm">{insight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ArticleLayout>
  );
};

export default LearningHumanProgressFoundation;