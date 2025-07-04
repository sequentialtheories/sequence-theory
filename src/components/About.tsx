
import { Code, Zap, Shield, Users } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Code,
      title: "Advanced Technology",
      description: "Built on cutting-edge blockchain infrastructure with a focus on scalability and performance."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed without compromising on security or decentralization principles."
    },
    {
      icon: Shield,
      title: "Security First",
      description: "Multi-layered security protocols ensuring your assets and data remain protected."
    },
    {
      icon: Users,
      title: "User-Centric",
      description: "Designed with simplicity in mind, making Web3 accessible to everyone."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Our Mission
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At Sequence Theory, we believe in a decentralized future where technology 
            empowers individuals and communities. We're building the infrastructure 
            that will define the next generation of digital interactions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
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
      </div>
    </section>
  );
};

export default About;
