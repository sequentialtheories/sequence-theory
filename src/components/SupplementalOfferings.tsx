
import { GraduationCap, Users, BookOpen, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SupplementalOfferings = () => {
  const offerings = [
    {
      icon: GraduationCap,
      title: "Educational Resources",
      description: "Comprehensive learning modules covering financial basics, digital assets, and DeFi protocols.",
      link: "/learn-now",
      linkText: "Start Learning"
    },
    {
      icon: Users,
      title: "Investment Community",
      description: "Connect with like-minded investors who understand strategic investing over speculation.",
      link: "/learn-more",
      linkText: "Join Community"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            Beyond The Vault Club
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            While The Vault Club is our primary service, we also provide educational resources 
            and community support to help you succeed in your investment journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {offerings.map((offering, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-purple-600 to-cyan-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <offering.icon className="h-6 w-6 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                {offering.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {offering.description}
              </p>
              
              <Link to={offering.link}>
                <Button 
                  variant="outline" 
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  {offering.linkText}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Learning Path Preview */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="bg-white rounded-xl p-8 border border-gray-200">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 text-center flex items-center justify-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              Quick Learning Path Overview
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "Financial Basics",
                "Digital Assets", 
                "Vault Club",
                "Safe Exposure",
                "DeFi Protocols",
                "Advanced Strategies"
              ].map((step, index) => (
                <div key={index} className="bg-gradient-to-r from-purple-50 to-cyan-50 rounded-lg p-4 text-center">
                  <div className="text-sm font-medium text-purple-700">Step {index + 1}</div>
                  <div className="text-sm text-gray-700 mt-1">{step}</div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-6">
              <Link to="/learn-now">
                <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white">
                  Start Your Education Journey
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupplementalOfferings;
