
import { GraduationCap, TrendingUp, Shield, Users } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: GraduationCap,
      title: "Master DeFi",
      description: "You're already thinking beyond traditional finance. Here's what comes next."
    },
    {
      icon: TrendingUp,
      title: "Build Wealth",
      description: "You know the opportunity exists. These are the tools to capitalize on it."
    },
    {
      icon: Shield,
      title: "Stay Secure",
      description: "You understand the risks. We've built the safeguards you need."
    },
    {
      icon: Users,
      title: "Your Community",
      description: "You're not alone in this. Connect with others who see what you see."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Bridge Traditional Finance & Crypto
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            You already know where finance is heading. We're building the bridge 
            between where you are and where you need to be.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="bg-gradient-to-r from-purple-600 to-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
