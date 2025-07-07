
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
      </div>
    </section>
  );
};

export default SupplementalOfferings;
