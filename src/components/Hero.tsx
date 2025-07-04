
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const Hero = () => {
  const scrollToSignup = () => {
    document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
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
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            Making Crypto Accessible for Everyone
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 font-light">
            Building wealth online shouldn't require a steep learning curve
          </p>
          <p className="text-lg mb-12 text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Through The Vault Club and our DeFi investment platform, we're helping everyday users 
            take their first steps into cryptocurrency with bite-sized education and accessible 
            tools that make digital wealth building simple and secure.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={scrollToSignup}
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Join The Vault Club
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-gray-400 text-gray-300 hover:bg-white hover:text-gray-900 px-8 py-3 rounded-full transition-all duration-300"
            >
              Learn About DeFi
            </Button>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-6 w-6 text-gray-400" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
