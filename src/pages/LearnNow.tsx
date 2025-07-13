
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, PlayCircle, Users, Award, Target, DollarSign, TrendingUp, Zap, Coins, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const LearnNow = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const learningCategories = [
    {
      title: "Finance",
      description: "Build a strong foundation in financial literacy and money management",
      modules: [
        {
          icon: DollarSign,
          title: "The Concept & Purpose of Money",
          description: "Understand what money is, its fundamental role in society, and why it exists.",
          level: "Beginner",
          slug: "concept-purpose-money"
        },
        {
          icon: BookOpen,
          title: "Historical Evolution of Money",
          description: "Learn how money has evolved throughout history and the lessons it teaches us.",
          level: "Beginner", 
          slug: "historical-evolution-money"
        },
        {
          icon: TrendingUp,
          title: "Types of Financial Markets",
          description: "Explore different financial markets and how they function in the global economy.",
          level: "Intermediate",
          slug: "types-financial-markets"
        },
        {
          icon: Coins,
          title: "The Crypto Market's Role",
          description: "Understand how cryptocurrency markets fit into the broader financial ecosystem.",
          level: "Intermediate",
          slug: "crypto-market-role"
        },
        {
          icon: Users,
          title: "Wealth & Societal Empowerment",
          description: "Learn how wealth drives societal change and individual empowerment.",
          level: "Advanced",
          slug: "wealth-societal-empowerment"
        },
        {
          icon: Target,
          title: "Financial Strategy & Planning",
          description: "Master strategic financial planning and wealth-building techniques.",
          level: "Advanced",
          slug: "financial-strategy-planning"
        }
      ]
    },
    {
      title: "Web3 (Crypto & Blockchain)",
      description: "Dive deep into the world of decentralized technologies and digital assets",
      modules: [
        {
          icon: Zap,
          title: "Cryptocurrencies Fundamentals",
          description: "Learn the basics of cryptocurrencies and how they work.",
          level: "Beginner",
          slug: "cryptocurrencies-fundamentals"
        },
        {
          icon: Award,
          title: "Digital Ownership & Empowerment",
          description: "Understand how blockchain enables true digital ownership and empowerment.",
          level: "Beginner",
          slug: "digital-ownership-empowerment"
        },
        {
          icon: PlayCircle,
          title: "Tokens & Tokenization",
          description: "Explore different types of tokens and the tokenization process.",
          level: "Intermediate",
          slug: "tokens-tokenization"
        },
        {
          icon: BookOpen,
          title: "Blockchain Technology Deep Dive",
          description: "Master the technical foundations of blockchain technology.",
          level: "Intermediate",
          slug: "blockchain-technology-deep-dive"
        },
        {
          icon: TrendingUp,
          title: "Decentralized Finance (DeFi)",
          description: "Learn about DeFi protocols, yield farming, and decentralized trading.",
          level: "Advanced",
          slug: "decentralized-finance-defi"
        },
        {
          icon: AlertTriangle,
          title: "Advanced Web3 Innovations",
          description: "Explore staking, lending, meme coins, and sophisticated Web3 innovations.",
          level: "Expert",
          slug: "advanced-web3-innovations"
        }
      ]
    },
    {
      title: "Education about Education",
      description: "Understand the power of learning and its impact on human progress",
      modules: [
        {
          icon: BookOpen,
          title: "Learning as Human Progress Foundation",
          description: "Discover how learning serves as the foundation of all human advancement.",
          level: "Beginner",
          slug: "learning-human-progress-foundation"
        },
        {
          icon: AlertTriangle,
          title: "Consequences of Educational Absence",
          description: "Understand what happens when education is lacking or inaccessible.",
          level: "Beginner",
          slug: "consequences-educational-absence"
        },
        {
          icon: Target,
          title: "Financial Literacy Gatekeeping",
          description: "Learn how financial education has been historically restricted and controlled.",
          level: "Intermediate",
          slug: "financial-literacy-gatekeeping"
        },
        {
          icon: DollarSign,
          title: "Colonialism of Money & Trade",
          description: "Explore how monetary systems have been used as tools of control throughout history.",
          level: "Intermediate",
          slug: "colonialism-money-trade"
        },
        {
          icon: TrendingUp,
          title: "Global Education Statistics",
          description: "Examine worldwide data on financial literacy and educational inequality.",
          level: "Advanced",
          slug: "global-education-statistics"
        },
        {
          icon: Users,
          title: "Democratizing Financial Knowledge",
          description: "Learn how to break down barriers and make financial education accessible to all.",
          level: "Advanced",
          slug: "democratizing-financial-knowledge"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white py-6">
        <div className="container mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-100 hover:text-white transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/a0e89a17-55c8-45b2-8c5d-b5e7ae0a756c.png" 
              alt="Sequence Theory Logo" 
              className="h-16"
            />
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
                {learningCategories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(index)}
                    className={`p-6 text-center rounded-lg transition-all duration-300 ${
                      selectedCategory === index
                        ? 'bg-gradient-to-r from-purple-100 to-cyan-100 border-2 border-purple-400 shadow-lg'
                        : 'bg-gradient-to-r from-purple-50 to-cyan-50 border border-gray-200 hover:shadow-md'
                    }`}
                  >
                    <div className={`text-lg font-semibold mb-2 ${
                      selectedCategory === index ? 'text-purple-800' : 'text-purple-700'
                    }`}>
                      {category.title}
                    </div>
                    <div className="text-sm text-gray-700 mb-2">{category.description}</div>
                    <div className={`text-xs font-medium mt-2 ${
                      selectedCategory === index ? 'text-purple-700' : 'text-purple-600'
                    }`}>
                      {category.modules.length} Modules
                    </div>
                  </button>
                ))}
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
              {learningCategories[selectedCategory].modules.map((module, moduleIndex) => (
                <Link 
                  key={moduleIndex} 
                  to={`/learn/${module.slug}`}
                  className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
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
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Finance Modules Comprehensive Quiz */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Finance Modules Comprehensive Quiz 🧠
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Test your knowledge across all finance modules. This quiz covers concepts from The Concept & Purpose of Money through Financial Strategy & Planning.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-cyan-50 rounded-xl p-8 border border-purple-200">
              <div className="space-y-8">
                
                {/* Question 1 - Money's Core Functions */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">1</span>
                    <div className="flex-1">
                      <p className="font-semibold mb-3">What are the three core functions of money according to the Concept & Purpose of Money module?</p>
                      <div className="space-y-2 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q1" value="a" className="w-4 h-4" />
                          <span>Store of value, medium of exchange, unit of account</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q1" value="b" className="w-4 h-4" />
                          <span>Investment tool, payment method, savings account</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q1" value="c" className="w-4 h-4" />
                          <span>Gold standard, fiat currency, digital currency</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q1" value="d" className="w-4 h-4" />
                          <span>Credit, debit, cash</span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 italic">Source: The Concept & Purpose of Money module</p>
                    </div>
                  </div>
                </div>

                {/* Question 2 - Historical Evolution */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">2</span>
                    <div className="flex-1">
                      <p className="font-semibold mb-3">According to the Historical Evolution of Money, what system preceded modern monetary systems?</p>
                      <div className="space-y-2 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q2" value="a" className="w-4 h-4" />
                          <span>Banking system</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q2" value="b" className="w-4 h-4" />
                          <span>Barter system</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q2" value="c" className="w-4 h-4" />
                          <span>Credit card system</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q2" value="d" className="w-4 h-4" />
                          <span>Stock market system</span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 italic">Source: Historical Evolution of Money module</p>
                    </div>
                  </div>
                </div>

                {/* Question 3 - Financial Markets Types */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">3</span>
                    <div className="flex-1">
                      <p className="font-semibold mb-3">Which financial market is primarily for short-term, highly liquid investments?</p>
                      <div className="space-y-2 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q3" value="a" className="w-4 h-4" />
                          <span>Stock market</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q3" value="b" className="w-4 h-4" />
                          <span>Bond market</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q3" value="c" className="w-4 h-4" />
                          <span>Money market</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q3" value="d" className="w-4 h-4" />
                          <span>Derivatives market</span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 italic">Source: Types of Financial Markets module</p>
                    </div>
                  </div>
                </div>

                {/* Question 4 - Crypto Market Role */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">4</span>
                    <div className="flex-1">
                      <p className="font-semibold mb-3">How does the crypto market operate differently from traditional markets?</p>
                      <div className="space-y-2 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q4" value="a" className="w-4 h-4" />
                          <span>It operates only during business hours</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q4" value="b" className="w-4 h-4" />
                          <span>It operates 24/7 and is globally accessible</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q4" value="c" className="w-4 h-4" />
                          <span>It requires government approval for all transactions</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q4" value="d" className="w-4 h-4" />
                          <span>It only allows institutional investors</span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 italic">Source: The Crypto Market's Role module</p>
                    </div>
                  </div>
                </div>

                {/* Question 5 - Wealth and Society */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">5</span>
                    <div className="flex-1">
                      <p className="font-semibold mb-3">According to Wealth & Societal Empowerment, how does wealth creation impact communities?</p>
                      <div className="space-y-2 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q5" value="a" className="w-4 h-4" />
                          <span>It only benefits the wealthy individual</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q5" value="b" className="w-4 h-4" />
                          <span>It creates economic multiplier effects that benefit entire communities</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q5" value="c" className="w-4 h-4" />
                          <span>It has no impact on communities</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q5" value="d" className="w-4 h-4" />
                          <span>It always creates inequality</span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 italic">Source: Wealth & Societal Empowerment module</p>
                    </div>
                  </div>
                </div>

                {/* Question 6 - SMART Goals */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">6</span>
                    <div className="flex-1">
                      <p className="font-semibold mb-3">What does the "T" in SMART financial goals represent?</p>
                      <div className="space-y-2 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q6" value="a" className="w-4 h-4" />
                          <span>Targeted</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q6" value="b" className="w-4 h-4" />
                          <span>Time-bound</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q6" value="c" className="w-4 h-4" />
                          <span>Tactical</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q6" value="d" className="w-4 h-4" />
                          <span>Transparent</span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 italic">Source: Financial Strategy & Planning module</p>
                    </div>
                  </div>
                </div>

                {/* Question 7 - Emergency Fund */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">7</span>
                    <div className="flex-1">
                      <p className="font-semibold mb-3">How many months of expenses should an emergency fund typically cover?</p>
                      <div className="space-y-2 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q7" value="a" className="w-4 h-4" />
                          <span>1-2 months</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q7" value="b" className="w-4 h-4" />
                          <span>3-6 months</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q7" value="c" className="w-4 h-4" />
                          <span>8-12 months</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q7" value="d" className="w-4 h-4" />
                          <span>12+ months</span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 italic">Source: Financial Strategy & Planning module</p>
                    </div>
                  </div>
                </div>

                {/* Question 8 - Asset Classes */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">8</span>
                    <div className="flex-1">
                      <p className="font-semibold mb-3">Which asset class is primarily known for "stability and income generation"?</p>
                      <div className="space-y-2 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q8" value="a" className="w-4 h-4" />
                          <span>Stocks</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q8" value="b" className="w-4 h-4" />
                          <span>Bonds</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q8" value="c" className="w-4 h-4" />
                          <span>Real Estate</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q8" value="d" className="w-4 h-4" />
                          <span>Cryptocurrency</span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 italic">Source: Financial Strategy & Planning module</p>
                    </div>
                  </div>
                </div>

                {/* Question 9 - Money's Social Role */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">9</span>
                    <div className="flex-1">
                      <p className="font-semibold mb-3">Why was money invented to replace the barter system?</p>
                      <div className="space-y-2 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q9" value="a" className="w-4 h-4" />
                          <span>To make transactions more complex</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q9" value="b" className="w-4 h-4" />
                          <span>To solve the "double coincidence of wants" problem</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q9" value="c" className="w-4 h-4" />
                          <span>To create inflation</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q9" value="d" className="w-4 h-4" />
                          <span>To eliminate all trade</span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 italic">Source: The Concept & Purpose of Money module</p>
                    </div>
                  </div>
                </div>

                {/* Question 10 - Market Functions */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">10</span>
                    <div className="flex-1">
                      <p className="font-semibold mb-3">What is a primary function of financial markets?</p>
                      <div className="space-y-2 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q10" value="a" className="w-4 h-4" />
                          <span>Price discovery and capital allocation</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q10" value="b" className="w-4 h-4" />
                          <span>Eliminating all investment risk</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q10" value="c" className="w-4 h-4" />
                          <span>Guaranteeing profits to all investors</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q10" value="d" className="w-4 h-4" />
                          <span>Preventing market volatility</span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 italic">Source: Types of Financial Markets module</p>
                    </div>
                  </div>
                </div>

                {/* Question 11 - Tax Optimization */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">11</span>
                    <div className="flex-1">
                      <p className="font-semibold mb-3">What is "tax-loss harvesting" in financial planning?</p>
                      <div className="space-y-2 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q11" value="a" className="w-4 h-4" />
                          <span>Avoiding all taxes on investments</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q11" value="b" className="w-4 h-4" />
                          <span>Offsetting gains with losses to reduce tax liability</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q11" value="c" className="w-4 h-4" />
                          <span>Only investing in tax-free accounts</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q11" value="d" className="w-4 h-4" />
                          <span>Moving to a different country</span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 italic">Source: Financial Strategy & Planning module</p>
                    </div>
                  </div>
                </div>

                {/* Question 12 - Behavioral Finance */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">12</span>
                    <div className="flex-1">
                      <p className="font-semibold mb-3">What is "loss aversion" in behavioral finance?</p>
                      <div className="space-y-2 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q12" value="a" className="w-4 h-4" />
                          <span>The tendency to avoid losses more than seeking equivalent gains</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q12" value="b" className="w-4 h-4" />
                          <span>Always choosing the safest investment</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q12" value="c" className="w-4 h-4" />
                          <span>Never selling any investments</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q12" value="d" className="w-4 h-4" />
                          <span>Avoiding all financial markets</span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 italic">Source: Financial Strategy & Planning module</p>
                    </div>
                  </div>
                </div>

                {/* Question 13 - Cryptocurrency Integration */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">13</span>
                    <div className="flex-1">
                      <p className="font-semibold mb-3">How is the crypto market integrating with traditional finance?</p>
                      <div className="space-y-2 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q13" value="a" className="w-4 h-4" />
                          <span>It's completely replacing traditional finance</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q13" value="b" className="w-4 h-4" />
                          <span>Through institutional adoption and regulatory frameworks</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q13" value="c" className="w-4 h-4" />
                          <span>It operates completely independently</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q13" value="d" className="w-4 h-4" />
                          <span>There is no integration happening</span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 italic">Source: The Crypto Market's Role module</p>
                    </div>
                  </div>
                </div>

                {/* Question 14 - Wealth Democratization */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">14</span>
                    <div className="flex-1">
                      <p className="font-semibold mb-3">What tools are democratizing wealth creation according to the modules?</p>
                      <div className="space-y-2 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q14" value="a" className="w-4 h-4" />
                          <span>Only traditional banking services</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q14" value="b" className="w-4 h-4" />
                          <span>Fintech platforms, online education, and micro-investing</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q14" value="c" className="w-4 h-4" />
                          <span>Exclusive private wealth management</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q14" value="d" className="w-4 h-4" />
                          <span>Government-controlled investment programs</span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 italic">Source: Wealth & Societal Empowerment module</p>
                    </div>
                  </div>
                </div>

                {/* Question 15 - Estate Planning */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">15</span>
                    <div className="flex-1">
                      <p className="font-semibold mb-3">What are the primary estate planning documents mentioned in financial planning?</p>
                      <div className="space-y-2 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q15" value="a" className="w-4 h-4" />
                          <span>Bank statements and credit reports</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q15" value="b" className="w-4 h-4" />
                          <span>Wills and trusts</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q15" value="c" className="w-4 h-4" />
                          <span>Tax returns and investment accounts</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="q15" value="d" className="w-4 h-4" />
                          <span>Insurance policies only</span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 italic">Source: Financial Strategy & Planning module</p>
                    </div>
                  </div>
                </div>

                {/* Answer Key */}
                <div className="bg-gray-100 p-6 rounded-lg border-2 border-gray-300">
                  <p className="text-sm text-gray-600 text-center font-medium">
                    <strong>Answer Key:</strong> 1-a, 2-b, 3-c, 4-b, 5-b, 6-b, 7-b, 8-b, 9-b, 10-a, 11-b, 12-a, 13-b, 14-b, 15-b
                  </p>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Each question tests core concepts from the respective finance modules. Review the modules for detailed explanations of these concepts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LearnNow;
