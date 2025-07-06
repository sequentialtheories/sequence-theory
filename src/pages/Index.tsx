
import Hero from "@/components/Hero";
import About from "@/components/About";
import PreSignup from "@/components/PreSignup";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <PreSignup />
      
      {/* View Preview Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
            
            <a
              href="/lovable-uploads/ba89813f-6e52-48b8-b2cf-67601c222f5c.png"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                variant="outline" 
                className="inline-flex items-center gap-2 hover:bg-gray-100"
              >
                Read White Paper
                <FileText className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
