
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, PlayCircle, Users, Award, Target, DollarSign, TrendingUp, Zap, Coins } from "lucide-react";
import { Link } from "react-router-dom";

const LearnNow = () => {
  const learningModules = [
    {
      icon: DollarSign,
      title: "Financial Basics",
      description: "Learn the fundamentals of money, investing, and building wealth in simple terms.",
      level: "Beginner",
      slug: "financial-basics"
    },
    {
      icon: BookOpen,
      title: "Digital Asset Fundamentals", 
      description: "Master the basics of digital assets, blockchain technology, and market dynamics.",
      level: "Beginner",
      slug: "digital-asset-fundamentals"
    },
    {
      icon: PlayCircle,
      title: "Investment Contracts",
      description: "Understand how Vault Club contracts work and their advantages for new investors.",
      level: "Intermediate",
      slug: "vault-club-contracts"
    },
    {
      icon: Coins,
      title: "Digital Asset Exposure",
      description: "Deep dive into specific tokens like BTC, ETH, SOL, and LINK. Learn about tokenization and Web3.",
      level: "Intermediate",
      slug: "digital-asset-exposure"
    },
    {
      icon: Zap,
      title: "DeFi & Protocols",
      description: "Deep dive into the technical mechanics of staking, liquidity farming, and DeFi protocols.",
      level: "Advanced",
      slug: "defi-protocols"
    },
    {
      icon: TrendingUp,
      title: "Expanding Your Portfolio",
      description: "Learn strategic approaches to diversifying beyond structured investment contracts.",
      level: "Advanced", 
      slug: "expanding-beyond-vault-club"
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
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Expert instructors</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>Certificate upon completion</span>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold mb-12 text-center text-gray-900">Your Learning Path</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {learningModules.map((module, index) => (
              <Link 
                key={index} 
                to={`/learn/${module.slug}`}
                className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-r from-cyan-600 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <module.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{module.title}</h4>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {module.level}
                      </span>
                    </div>
                    <p className="text-gray-600">{module.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Start Now */}
      <section className="py-16 bg-gray-50">
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-cyan-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-6">Ready to Begin Your Education?</h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start your journey to becoming a knowledgeable digital asset investor. 
            Join thousands of others who chose education over speculation.
          </p>
          <Link to="/#signup">
            <Button 
              size="lg" 
              className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Start Learning Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LearnNow;
