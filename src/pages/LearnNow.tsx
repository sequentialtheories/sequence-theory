import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, PlayCircle, Users, Award, Target, DollarSign, TrendingUp, Zap, Coins, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
const LearnNow = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const learningCategories = [{
    title: "Finance",
    description: "Build a strong foundation in financial literacy and money management",
    modules: [{
      icon: DollarSign,
      title: "The Concept & Purpose of Money",
      description: "Understand what money is, its fundamental role in society, and why it exists.",
      level: "Beginner",
      slug: "concept-purpose-money"
    }, {
      icon: BookOpen,
      title: "Historical Evolution of Money",
      description: "Learn how money has evolved throughout history and the lessons it teaches us.",
      level: "Beginner",
      slug: "historical-evolution-money"
    }, {
      icon: TrendingUp,
      title: "Types of Financial Markets",
      description: "Explore different financial markets and how they function in the global economy.",
      level: "Intermediate",
      slug: "types-financial-markets"
    }, {
      icon: Coins,
      title: "The Crypto Market's Role",
      description: "Understand how cryptocurrency markets fit into the broader financial ecosystem.",
      level: "Intermediate",
      slug: "crypto-market-role"
    }, {
      icon: Users,
      title: "Wealth & Societal Empowerment",
      description: "Learn how wealth drives societal change and individual empowerment.",
      level: "Advanced",
      slug: "wealth-societal-empowerment"
    }, {
      icon: Target,
      title: "Financial Strategy & Planning",
      description: "Master strategic financial planning and wealth-building techniques.",
      level: "Advanced",
      slug: "financial-strategy-planning"
    }]
  }, {
    title: "Web3 (Crypto & Blockchain)",
    description: "Dive deep into the world of decentralized technologies and digital assets",
    modules: [{
      icon: Zap,
      title: "Cryptocurrencies Fundamentals",
      description: "Learn the basics of cryptocurrencies and how they work.",
      level: "Beginner",
      slug: "cryptocurrencies-fundamentals"
    }, {
      icon: Award,
      title: "Digital Ownership & Empowerment",
      description: "Understand how blockchain enables true digital ownership and empowerment.",
      level: "Beginner",
      slug: "digital-ownership-empowerment"
    }, {
      icon: PlayCircle,
      title: "Tokens & Tokenization",
      description: "Explore different types of tokens and the tokenization process.",
      level: "Intermediate",
      slug: "tokens-tokenization"
    }, {
      icon: BookOpen,
      title: "Blockchain Technology Deep Dive",
      description: "Master the technical foundations of blockchain technology.",
      level: "Intermediate",
      slug: "blockchain-technology-deep-dive"
    }, {
      icon: TrendingUp,
      title: "Decentralized Finance (DeFi)",
      description: "Learn about DeFi protocols, yield farming, and decentralized trading.",
      level: "Advanced",
      slug: "decentralized-finance-defi"
    }, {
      icon: AlertTriangle,
      title: "Advanced Web3 Innovations",
      description: "Explore staking, lending, meme coins, and sophisticated Web3 innovations.",
      level: "Expert",
      slug: "advanced-web3-innovations"
    }]
  }, {
    title: "Education about Education",
    description: "Understand the power of learning and its impact on human progress",
    modules: [{
      icon: BookOpen,
      title: "Learning as Human Progress Foundation",
      description: "Discover how learning serves as the foundation of all human advancement.",
      level: "Beginner",
      slug: "learning-human-progress-foundation"
    }, {
      icon: AlertTriangle,
      title: "Consequences of Educational Absence",
      description: "Understand what happens when education is lacking or inaccessible.",
      level: "Beginner",
      slug: "consequences-educational-absence"
    }, {
      icon: Target,
      title: "Financial Literacy Gatekeeping",
      description: "Learn how financial education has been historically restricted and controlled.",
      level: "Intermediate",
      slug: "financial-literacy-gatekeeping"
    }, {
      icon: DollarSign,
      title: "Colonialism of Money & Trade",
      description: "Explore how monetary systems have been used as tools of control throughout history.",
      level: "Intermediate",
      slug: "colonialism-money-trade"
    }, {
      icon: TrendingUp,
      title: "Global Education Statistics",
      description: "Examine worldwide data on financial literacy and educational inequality.",
      level: "Advanced",
      slug: "global-education-statistics"
    }, {
      icon: Users,
      title: "Democratizing Financial Knowledge",
      description: "Learn how to break down barriers and make financial education accessible to all.",
      level: "Advanced",
      slug: "democratizing-financial-knowledge"
    }]
  }];
  return <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white py-6">
        <div className="container mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-100 hover:text-white transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <img src="/lovable-uploads/a0e89a17-55c8-45b2-8c5d-b5e7ae0a756c.png" alt="Sequence Theory Logo" className="h-16" />
            <div>
              <h1 className="text-3xl font-bold">Learn Now</h1>
              <p className="text-gray-100">Start Your Digital Asset Education Journey</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-cyan-50 to-purple-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Master Digital Assets Today
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Skip the trial and error. Our structured learning modules teach you everything you need to know 
            about digital asset investing, from fundamentals to advanced strategies.
          </p>
        </div>
      </section>

      {/* Why Start Now */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-8 text-center text-gray-900">Why Start Learning Now?</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-cyan-600" />
                </div>
                <h4 className="text-lg font-semibold mb-3 text-gray-900">Avoid Costly Mistakes</h4>
                <p className="text-gray-600">
                  Learn from others' experiences and avoid the common pitfalls that cost investors thousands.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold mb-3 text-gray-900">Evolving Market</h4>
                <p className="text-gray-600">
                  Cryptocurrency is still in its early stages and will only continue to grow in adoption. Position yourself ahead of the curve in this rapidly evolving market.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold mb-3 text-gray-900">Join the Community</h4>
                <p className="text-gray-600">
                  Connect with like-minded investors who prioritize education and strategic thinking over speculation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Learning Path Overview */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold mb-6 text-gray-900 text-center flex items-center justify-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                Quick Learning Path Overview
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {learningCategories.map((category, index) => <button key={index} onClick={() => setSelectedCategory(index)} className={`p-6 text-center rounded-lg transition-all duration-300 ${selectedCategory === index ? 'bg-gradient-to-r from-purple-100 to-cyan-100 border-2 border-purple-400 shadow-lg' : 'bg-gradient-to-r from-purple-50 to-cyan-50 border border-gray-200 hover:shadow-md'}`}>
                    <div className={`text-lg font-semibold mb-2 ${selectedCategory === index ? 'text-purple-800' : 'text-purple-700'}`}>
                      {category.title}
                    </div>
                    <div className="text-sm text-gray-700 mb-2">{category.description}</div>
                    
                  </button>)}
              </div>
              
              <div className="text-center mt-6">
                <p className="text-gray-600 mb-4">
                  Explore three comprehensive learning paths designed to give you a complete understanding of finance, technology, and education.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Category Modules */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {learningCategories[selectedCategory].title} Modules
              </h3>
              <p className="text-gray-600">{learningCategories[selectedCategory].description}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningCategories[selectedCategory].modules.map((module, moduleIndex) => <Link key={moduleIndex} to={`/learn/${module.slug}`} className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-cyan-600 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <module.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-lg font-semibold text-gray-900">{module.title}</h5>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {module.level}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{module.description}</p>
                    </div>
                  </div>
                </Link>)}
            </div>
          </div>
        </div>
      </section>


    </div>;
};
export default LearnNow;