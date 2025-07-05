
import Hero from "@/components/Hero";
import About from "@/components/About";
import PreSignup from "@/components/PreSignup";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <PreSignup />
      
      {/* View Preview Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <a
            href="https://claude.ai/public/artifacts/97bd8f52-98c0-40ea-81c5-3a05a3eed034?fullscreen=true"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button 
              variant="outline" 
              className="inline-flex items-center gap-2 hover:bg-gray-100"
            >
              View Preview
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
