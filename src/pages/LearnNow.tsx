import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, PlayCircle, Users, Award, Target, DollarSign, TrendingUp, Zap, Coins, AlertTriangle, Lock, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { Progress } from "@/components/ui/progress";
const LearnNow = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(0);
  const { isModuleUnlocked, isModuleCompleted, progress } = useLearningProgress();
  const learningCategories = [{
    title: "Finance",
    description: "Learn how money actually works (it's simpler than you think!)",
    modules: [{
      icon: DollarSign,
      title: "What is Money Really?",
      description: "Why we even have money and how it makes life easier for everyone.",
      level: "Beginner",
      slug: "what-is-money-really",
      interactive: true
    }, {
      icon: BookOpen,
      title: "Money Through Time",
      description: "From trading chickens to digital coins - money's wild journey.",
      level: "Beginner",
      slug: "historical-evolution-money"
    }, {
      icon: TrendingUp,
      title: "Where Money Lives",
      description: "Stock markets, bond markets, and other places your money can hang out.",
      level: "Intermediate",
      slug: "types-financial-markets"
    }, {
      icon: Coins,
      title: "Crypto's Place in Money World",
      description: "How digital money fits into everything else.",
      level: "Intermediate",
      slug: "crypto-market-role"
    }, {
      icon: Users,
      title: "Money = Power (Here's How)",
      description: "Why having money gives you choices and changes communities.",
      level: "Advanced",
      slug: "wealth-societal-empowerment"
    }, {
      icon: Target,
      title: "Your Money Game Plan",
      description: "Smart ways to grow your money over time.",
      level: "Advanced",
      slug: "financial-strategy-planning"
    }]
  }, {
    title: "Web3 & Digital Money",
    description: "Digital money that no single person controls (The tech)",
    modules: [{
      icon: Zap,
      title: "Crypto 101",
      description: "What crypto is and why people are excited about it.",
      level: "Beginner",
      slug: "cryptocurrencies-fundamentals"
    }, {
      icon: Award,
      title: "Owning Digital Stuff",
      description: "How crypto lets you truly own things online.",
      level: "Beginner",
      slug: "digital-ownership-empowerment"
    }, {
      icon: PlayCircle,
      title: "Digital Tokens Explained",
      description: "Different types of digital tokens and what they do.",
      level: "Intermediate",
      slug: "tokens-tokenization"
    }, {
      icon: BookOpen,
      title: "How Blockchain Works",
      description: "The technology that makes crypto possible (without the confusing tech talk).",
      level: "Intermediate",
      slug: "blockchain-technology-deep-dive"
    }, {
      icon: TrendingUp,
      title: "DeFi: Banking Without Banks",
      description: "Lending, borrowing, and trading - all without traditional banks.",
      level: "Advanced",
      slug: "decentralized-finance-defi"
    }, {
      icon: AlertTriangle,
      title: "Next-Level Crypto Stuff",
      description: "Staking, yield farming, and the latest crypto innovations.",
      level: "Expert",
      slug: "advanced-web3-innovations"
    }]
  }, {
    title: "Why Learning Matters",
    description: "How education changes everything (and why some people try to limit it)",
    modules: [{
      icon: BookOpen,
      title: "Learning Changes the World",
      description: "How every big human achievement started with someone learning something new.",
      level: "Beginner",
      slug: "learning-human-progress-foundation"
    }, {
      icon: AlertTriangle,
      title: "What Happens Without Education",
      description: "Why keeping people from learning hurts everyone.",
      level: "Beginner",
      slug: "consequences-educational-absence"
    }, {
      icon: Target,
      title: "Who Gets to Learn About Money?",
      description: "How financial education has been kept from regular people.",
      level: "Intermediate",
      slug: "financial-literacy-gatekeeping"
    }, {
      icon: DollarSign,
      title: "Money as Control",
      description: "How powerful people have used money systems to control others.",
      level: "Intermediate",
      slug: "colonialism-money-trade"
    }, {
      icon: TrendingUp,
      title: "Education Around the World",
      description: "Who gets financial education and who doesn't (the numbers might surprise you).",
      level: "Advanced",
      slug: "global-education-statistics"
    }, {
      icon: Users,
      title: "Making Learning Free for All",
      description: "How to break down barriers and teach everyone about money.",
      level: "Advanced",
      slug: "democratizing-financial-knowledge"
    }]
  }];
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-cyan-600 via-purple-600 to-indigo-600 text-white py-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl translate-y-32 -translate-x-32"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 mb-6 group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="relative">
              Back to Home
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 transition-transform group-hover:scale-x-100"></span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-lg"></div>
              <img src="/lovable-uploads/a0e89a17-55c8-45b2-8c5d-b5e7ae0a756c.png" alt="Sequence Theory Logo" className="h-20 relative z-10 drop-shadow-2xl" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                Learn Now
              </h1>
              <p className="text-xl text-white/90 font-medium">Start your money & crypto journey today</p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Overview */}
      <section className="relative py-12 bg-gradient-to-br from-slate-100 to-gray-100 border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Learning Journey</h2>
                  <p className="text-gray-600">Track your progress through interactive modules</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600">{progress.completedModules.length}</div>
                  <div className="text-sm text-gray-500">modules completed</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {learningCategories.map((category, categoryIndex) => {
                  const categoryCompleted = category.modules.filter(module => 
                    progress.completedModules.includes(module.slug)
                  ).length;
                  const totalModules = category.modules.length;
                  const progressPercent = (categoryCompleted / totalModules) * 100;
                  
                  return (
                    <div key={categoryIndex} className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{category.title}</h3>
                        <span className="text-sm text-gray-500">{categoryCompleted}/{totalModules}</span>
                      </div>
                      <Progress value={progressPercent} className="h-2 mb-2" />
                      <div className="text-xs text-gray-500">
                        {progressPercent === 100 ? '🎉 Complete!' : progressPercent > 0 ? 'In Progress' : 'Not Started'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-cyan-50 via-purple-50 to-indigo-50 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-300/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-800 to-cyan-800 bg-clip-text text-transparent leading-tight">
            Get Smart About Money
          </h2>
          
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
              <BookOpen className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-gray-700">18 Lessons</span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
              <Users className="h-4 w-4 text-cyan-600" />
              <span className="font-medium text-gray-700">Made for Ease</span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
              <Award className="h-4 w-4 text-indigo-600" />
              <span className="font-medium text-gray-700">Quiz & Test</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Start Now */}
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-indigo-500"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              
                <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-purple-800 bg-clip-text text-transparent">
                  Why Start Now?
                </h3>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Money and crypto are changing fast. Get ahead while you still can.
                </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
                  <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-4 text-gray-900">Don't Lose Your Money</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Learn what NOT to do so you don't make expensive mistakes.
                  </p>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-b-2xl"></div>
                </div>
              </div>
              
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-4 text-gray-900">You're Still Early</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Crypto is still new. Most people don't understand it yet. That's your advantage.
                  </p>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-b-2xl"></div>
                </div>
              </div>
              
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-4 text-gray-900">Find Your People</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Meet smart people who actually think before they invest.
                  </p>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-b-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Learning Path Overview */}
      <section className="relative py-20 bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-10 border border-white/20 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 rounded-3xl"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-full px-6 py-3 mb-6 shadow-lg">
                    <BookOpen className="h-5 w-5" />
                    <span className="font-semibold">Learning Path Overview</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-purple-800 bg-clip-text text-transparent">
                    Pick Your Path
                  </h3>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Three simple paths. Pick what interests you most.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {learningCategories.map((category, index) => <button key={index} onClick={() => setSelectedCategory(index)} className={`group relative p-8 text-center rounded-2xl transition-all duration-500 transform hover:-translate-y-2 ${selectedCategory === index ? 'bg-gradient-to-br from-purple-600 to-cyan-600 text-white shadow-2xl scale-105' : 'bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-cyan-50 border border-gray-200 hover:border-purple-300 shadow-lg hover:shadow-xl'}`}>
                      <div className={`absolute inset-0 rounded-2xl blur-xl opacity-20 ${selectedCategory === index ? 'bg-gradient-to-br from-purple-600 to-cyan-600' : 'bg-gray-200'}`}></div>
                      
                      <div className="relative z-10">
                        <div className={`text-xl font-bold mb-4 ${selectedCategory === index ? 'text-white' : 'text-gray-900 group-hover:text-purple-700'}`}>
                          {category.title}
                        </div>
                        <div className={`text-sm leading-relaxed ${selectedCategory === index ? 'text-white/90' : 'text-gray-600 group-hover:text-gray-700'}`}>
                          {category.description}
                        </div>
                        
                        {selectedCategory === index && <div className="mt-4 inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-white">Selected</span>
                          </div>}
                      </div>
                    </button>)}
                </div>
                
                <div className="text-center mt-10">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full px-6 py-3">
                    <Target className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700 font-medium">Click any path to see what's inside</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Category Modules */}
      {selectedCategory !== null && <section className="relative py-20 bg-gradient-to-br from-slate-50 via-white to-gray-50 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-300/20 rounded-full blur-3xl animate-float-delayed"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-cyan-100 rounded-full px-6 py-2 mb-6">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-800">Learning Modules</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-purple-800 bg-clip-text text-transparent">
                  {learningCategories[selectedCategory].title} Modules
                </h3>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {learningCategories[selectedCategory].description}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {learningCategories[selectedCategory].modules.map((module, moduleIndex) => {
                  const unlocked = isModuleUnlocked(selectedCategory, moduleIndex);
                  const completed = isModuleCompleted(module.slug);
                  const linkPath = module.interactive ? `/interactive-learn/${module.slug}` : `/learn/${module.slug}`;
                  
                  if (!unlocked) {
                    return (
                      <div key={moduleIndex} className="group relative block bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-lg opacity-60">
                        <div className="absolute inset-0 bg-gray-100/50 rounded-2xl"></div>
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-4">
                            <div className="bg-gray-300 p-4 rounded-xl">
                              <module.icon className="h-8 w-8 text-gray-500" />
                            </div>
                            <div className="bg-gray-200 p-2 rounded-full">
                              <Lock className="h-4 w-4 text-gray-500" />
                            </div>
                          </div>
                          <h4 className="text-xl font-bold text-gray-500 mb-3">{module.title}</h4>
                          <p className="text-gray-400 text-sm leading-relaxed mb-4">{module.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-400 bg-gray-200 px-3 py-1 rounded-full">{module.level}</span>
                            <span className="text-xs text-gray-400">Locked</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <Link key={moduleIndex} to={linkPath} className="group relative block bg-white rounded-2xl p-8 border border-gray-100 hover:border-purple-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-4 rounded-xl transition-colors ${
                            completed 
                              ? 'bg-gradient-to-br from-green-100 to-emerald-100' 
                              : 'bg-gradient-to-br from-purple-100 to-cyan-100 group-hover:from-purple-200 group-hover:to-cyan-200'
                          }`}>
                            <module.icon className={`h-8 w-8 ${completed ? 'text-green-600' : 'text-purple-600'}`} />
                          </div>
                          <div className="flex items-center gap-2">
                            {completed && (
                              <div className="bg-green-100 p-1 rounded-full">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              </div>
                            )}
                            <div className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                              completed 
                                ? 'text-green-600 bg-green-100' 
                                : 'text-purple-600 bg-purple-100 group-hover:bg-purple-200'
                            }`}>
                              {module.level}
                            </div>
                          </div>
                        </div>
                        
                        <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-800 transition-colors">
                          {module.title}
                        </h4>
                        
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 group-hover:text-gray-700 transition-colors">
                          {module.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <PlayCircle className={`h-4 w-4 ${completed ? 'text-green-600' : 'text-purple-600'}`} />
                            <span className="text-sm font-medium text-gray-700">
                              {completed ? 'Review' : module.interactive ? 'Start Interactive' : 'Start Learning'}
                            </span>
                          </div>
                          <ArrowLeft className="h-4 w-4 text-gray-400 transform rotate-180 group-hover:translate-x-1 transition-transform" />
                        </div>
                        
                        {module.interactive && !completed && (
                          <div className="mt-3 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
                            🎯 Interactive Learning
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>}

      {/* Finance Quiz Section - Only show when Finance is selected */}
      {selectedCategory === 0 && <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Money Basics Quiz 🧠
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                  Think you got the money stuff down? Let's find out! Quick quiz on everything from "what is money" to planning your financial future.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-cyan-50 rounded-xl p-8 border border-purple-200 text-center">
                <div className="mb-6">
                  <div className="bg-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Ready to Test Your Skills?</h4>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    15 questions about money basics. One question at a time, so no stress!
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <h5 className="font-semibold text-purple-700 mb-2">15 Questions</h5>
                    <p className="text-sm text-gray-600">Everything you learned</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <h5 className="font-semibold text-cyan-700 mb-2">One by One</h5>
                    <p className="text-sm text-gray-600">No rush, take your time</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <h5 className="font-semibold text-green-700 mb-2">Instant Results</h5>
                    <p className="text-sm text-gray-600">See how you did right away</p>
                    
                  </div>
                </div>

                <Link to="/finance-quiz">
                  <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-4 text-lg font-semibold hover:from-purple-700 hover:to-cyan-700 hover:scale-105 transition-all">
                    Start Quiz
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>}

      {/* Web3 Quiz Section - Only show when Web3 is selected */}
      {selectedCategory === 1 && <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Crypto & Digital Money Quiz 🚀
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                  Ready to test your crypto knowledge? From basic crypto to advanced DeFi stuff.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 border border-indigo-200 text-center">
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Ready to Test Your Crypto Skills?</h4>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    15 questions about crypto and digital money. One at a time, nice and easy!
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-4 rounded-lg border border-indigo-200">
                    <h5 className="font-semibold text-indigo-700 mb-2">15 Questions</h5>
                    <p className="text-sm text-gray-600">All the crypto stuff you learned</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-indigo-200">
                    <h5 className="font-semibold text-purple-700 mb-2">One by One</h5>
                    <p className="text-sm text-gray-600">Questions presented individually</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-indigo-200">
                    <h5 className="font-semibold text-green-700 mb-2">Instant Results</h5>
                    <p className="text-sm text-gray-600">Get your score immediately</p>
                  </div>
                </div>

                <Link to="/web3-quiz">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 hover:scale-105 transition-all">
                    Start Quiz
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>}

      {/* Education Quiz Section - Only show when Education about Education is selected */}
      {selectedCategory === 2 && <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Why Learning Matters Quiz 🎓
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                  Time to test what you learned about learning! From why education matters to who gets to learn about money.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 border border-amber-200 text-center">
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-amber-600 to-orange-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Ready to Test Your Learning Knowledge?</h4>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    15 questions about education and why it matters. You know the drill - one question at a time!
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-4 rounded-lg border border-amber-200">
                    <h5 className="font-semibold text-amber-700 mb-2">15 Questions</h5>
                    <p className="text-sm text-gray-600">All about learning and education</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-amber-200">
                    <h5 className="font-semibold text-orange-700 mb-2">One by One</h5>
                    <p className="text-sm text-gray-600">Questions presented individually</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-amber-200">
                    <h5 className="font-semibold text-green-700 mb-2">Instant Results</h5>
                    <p className="text-sm text-gray-600">Get your score immediately</p>
                  </div>
                </div>

                <Link to="/education-quiz">
                  <Button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 text-lg font-semibold hover:from-amber-700 hover:to-orange-700 hover:scale-105 transition-all">
                    Start Quiz
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>}

      {/* Comprehensive Exam Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                📚 The Big Final Quiz
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                Ready for the ultimate test? This covers everything - money, crypto, and why learning matters.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg text-center">
              <div className="mb-6">
                <div className="bg-gradient-to-r from-slate-600 to-gray-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-10 w-10 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">The Ultimate Knowledge Test</h4>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Questions from all three learning paths. Time to show off what you've learned!
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h5 className="font-semibold text-slate-700 mb-2">35 Questions</h5>
                  <p className="text-sm text-gray-600">Random mix from all lessons</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h5 className="font-semibold text-gray-700 mb-2">All Topics</h5>
                  <p className="text-sm text-gray-600">Money, crypto, and learning</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h5 className="font-semibold text-green-700 mb-2">Final Score</h5>
                  <p className="text-sm text-gray-600">See how you did overall</p>
                </div>
              </div>

              <Link to="/comprehensive-exam">
                <Button className="bg-gradient-to-r from-slate-600 to-gray-600 text-white px-8 py-4 text-lg font-semibold hover:from-slate-700 hover:to-gray-700 hover:scale-105 transition-all">
                  Take Exam
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>;
};
export default LearnNow;