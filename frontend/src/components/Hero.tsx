
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const scrollToNextSection = () => {
    const vaultClubSection = document.querySelector('section[class*="py-20"]');
    vaultClubSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSignup = () => {
    document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-hero text-white relative overflow-hidden">
      {/* No background squares - completely clean */}
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto animate-slide-up">
          {/* Logo with glow effect */}
          <div className="mb-8">
            <img 
              src="/lovable-uploads/a0e89a17-55c8-45b2-8c5d-b5e7ae0a756c.png" 
              alt="Sequence Theory Logo" 
              className="h-16 sm:h-20 md:h-32 mobile-h-12 mx-auto transition-spring hover:scale-110 animate-glow cursor-pointer"
              onClick={scrollToSignup}
            />
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl mobile-text-2xl font-bold mb-4 sm:mb-6 text-white animate-slide-up">
            <span className="bg-gradient-to-r from-white via-primary-glow to-white bg-clip-text text-transparent">
              Ease Into Investing
            </span>
          </h1>
          
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
