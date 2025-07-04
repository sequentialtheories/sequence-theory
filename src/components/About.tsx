
import { GraduationCap, TrendingUp, Shield, Users } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: GraduationCap,
      title: "Learn DeFi",
      description: "Simple lessons that make crypto investing accessible to everyone."
    },
    {
      icon: TrendingUp,
      title: "Build Wealth",
      description: "Investment tools designed for everyday users, not just experts."
    },
    {
      icon: Shield,
      title: "Stay Secure",
      description: "Safe and simple platform for crypto newcomers."
    },
    {
      icon: Users,
      title: "Join Community",
      description: "Connect with others on their digital wealth journey."
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
            We're making cryptocurrency accessible by breaking down complex concepts 
            into simple steps everyone can follow.
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
