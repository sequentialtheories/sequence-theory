
import { GraduationCap, TrendingUp, Shield, Users } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: GraduationCap,
      title: "Financial Education",
      description: "Learn DeFi fundamentals through bite-sized lessons that make complex concepts simple and actionable."
    },
    {
      icon: TrendingUp,
      title: "Wealth Building Tools",
      description: "Access investment contracts and digital asset opportunities designed for everyday users, not just crypto experts."
    },
    {
      icon: Shield,
      title: "Secure & Accessible",
      description: "Our platform prioritizes security while maintaining the simplicity needed for crypto newcomers."
    },
    {
      icon: Users,
      title: "Community Focused",
      description: "Join The Vault Club community where members support each other's journey into digital wealth building."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Bridging Traditional Finance & Crypto
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At Sequence Theory, we believe everyone deserves the opportunity to build wealth online. 
            We're making cryptocurrency and DeFi accessible by breaking down complex concepts into 
            manageable steps, helping users transition from traditional finance to the digital economy 
            with confidence.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="bg-gradient-to-r from-purple-600 to-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-purple-900 to-cyan-900 rounded-3xl p-8 md:p-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-6">The Vault Club</h3>
            <p className="text-lg leading-relaxed mb-6">
              Our flagship DeFi investment contract platform combines sophisticated blockchain technology 
              with user-friendly interfaces. Members gain access to curated investment opportunities, 
              educational resources, and a supportive community all focused on making digital wealth 
              building accessible to everyone.
            </p>
            <p className="text-purple-200">
              From tokenized stocks to innovative DeFi protocols, we're building the bridge 
              between traditional finance and the future of digital assets.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
