
import { Target, Lightbulb, Building2, Users2 } from "lucide-react";

const SequenceTheoryMission = () => {
  const missionPoints = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To democratize access to sophisticated financial strategies and digital asset opportunities through education and structured investment products."
    },
    {
      icon: Lightbulb,
      title: "Innovation First",
      description: "We develop cutting-edge solutions that bridge traditional finance with the emerging digital economy, making complex strategies accessible to everyone."
    },
    {
      icon: Building2,
      title: "Built to Last",
      description: "Sequence Theory is founded on principles of sustainability, transparency, and long-term value creation for our community and stakeholders."
    },
    {
      icon: Users2,
      title: "Community Focused",
      description: "We believe in empowering individuals through education and providing tools that help them make informed financial decisions in the digital age."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            About Sequence Theory, Our Mission
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sequence Theory, Inc. is dedicated to building the infrastructure and educational resources 
            needed to navigate the evolving landscape of digital assets and decentralized finance.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {missionPoints.map((point, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="bg-gradient-to-r from-purple-600 to-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <point.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                {point.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white p-8 rounded-2xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="text-lg leading-relaxed">
              To create a world where everyone has access to the tools, knowledge, and opportunities 
              needed to build wealth through both traditional and digital assets, regardless of their 
              starting point or technical expertise.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SequenceTheoryMission;
