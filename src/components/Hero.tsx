
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const scrollToSignup = () => {
    document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src="/lovable-uploads/a0e89a17-55c8-45b2-8c5d-b5e7ae0a756c.png" 
              alt="Sequence Theory Logo" 
              className="h-24 md:h-32 mx-auto"
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Professional DeFi Investment Strategies
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-3xl mx-auto">
            Sequence Theory brings institutional-grade investment approaches to individual investors through 
            <span className="text-purple-400 font-semibold"> The Vault Club</span> - our flagship DeFi investment contract platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={scrollToSignup}
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Join The Vault Club
            </Button>
            <Link to="/learn-more">
              <Button 
                variant="outline" 
                size="lg"
                className="border-gray-400 text-gray-300 hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full text-lg transition-all duration-300"
              >
                Learn How It Works
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-8 w-8 text-gray-400" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
