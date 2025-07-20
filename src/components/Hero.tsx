
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const scrollToNextSection = () => {
    const vaultClubSection = document.querySelector('section[class*="py-20"]');
    vaultClubSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-hero text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary-glow/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-3/4 right-1/3 w-32 h-32 bg-primary/30 rounded-full blur-2xl animate-pulse-soft"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-accent/10"></div>
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto animate-slide-up">
          {/* Logo with glow effect */}
          <div className="mb-8">
            <img 
              src="/lovable-uploads/a0e89a17-55c8-45b2-8c5d-b5e7ae0a756c.png" 
              alt="Sequence Theory Logo" 
              className="h-24 md:h-32 mx-auto transition-spring hover:scale-110 animate-glow"
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white animate-slide-up shadow-glow">
            <span className="bg-gradient-to-r from-white via-primary-glow to-white bg-clip-text text-transparent">
              Easing Into Investing
            </span>
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-3xl mx-auto animate-slide-up [animation-delay:0.2s] opacity-0 animate-fade-in">
            Institutional-grade investment approaches for individual investors through 
            <span className="text-primary-glow font-semibold shimmer"> The Vault Club</span> - our DeFi investment platform.
          </p>
        </div>
        
        <button 
          onClick={scrollToNextSection}
          className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer hover:text-primary-glow transition-spring hover:scale-125 shadow-glow"
          aria-label="Scroll to next section"
        >
          <ArrowDown className="h-16 w-16 text-white" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
