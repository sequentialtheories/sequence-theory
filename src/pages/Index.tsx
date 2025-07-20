import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import VaultClubMain from "@/components/VaultClubMain";
import SupplementalOfferings from "@/components/SupplementalOfferings";
import CompanyMission from "@/components/CompanyMission";
import PreSignup from "@/components/PreSignup";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText } from "lucide-react";
import { Link } from "react-router-dom";
const Index = () => {
  return <div className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <Hero />
        <VaultClubMain />
        <SupplementalOfferings />
        <CompanyMission />
        <PreSignup />
        
        {/* View Preview Section */}
        <section className="py-8 bg-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
          <div className="container mx-auto px-6 text-center relative z-10">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
              <a href="https://claude.ai/public/artifacts/97b71d10-3256-49a0-82d1-d1b62e6c4543?fullscreen=true" target="_blank" rel="noopener noreferrer">
                
              </a>
              
              <Link to="/white-paper">
                <Button variant="outline" className="inline-flex items-center gap-2 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-bounce hover:scale-105 shadow-soft hover:shadow-medium">
                  Read White Paper
                  <FileText className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </div>;
};
export default Index;