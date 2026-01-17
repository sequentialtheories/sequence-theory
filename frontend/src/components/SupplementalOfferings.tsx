
import { GraduationCap, Users, BookOpen, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SupplementalOfferings = () => {
  const offerings = [
    {
      icon: GraduationCap,
      title: "Educational Resources",
      description: "Learning modules covering financial basics, digital assets, and DeFi protocols.",
      link: "/learn-now",
      linkText: "Start Learning",
      external: false
    },
    {
      icon: Users,
      title: "Investment Community",
      description: "Connect with investors who prioritize strategy over speculation.",
      link: "https://t.me/+2NSJ3ZwdXJQwOWRh",
      linkText: "Join Community",
      external: true
    }
  ];

  return (
    <section className="py-16 bg-muted/50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-float-delayed"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Beyond The Vault Club
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up [animation-delay:0.2s]">
            Beyond The Vault Club, we provide education and community 
            to help you succeed in investing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {offerings.map((offering, index) => (
            <div key={index} className="bg-gradient-card backdrop-blur-sm rounded-xl p-8 shadow-medium hover:shadow-strong transition-spring hover:scale-105 border border-primary/10 group animate-slide-up" style={{ animationDelay: `${0.3 + index * 0.2}s` }}>
              <div className="bg-gradient-primary w-12 h-12 rounded-lg flex items-center justify-center mb-6 shadow-medium transition-spring group-hover:scale-110 group-hover:shadow-glow animate-glow">
                <offering.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              
              <h3 className="text-xl font-semibold mb-4 text-foreground group-hover:text-primary transition-smooth">
                {offering.title}
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed group-hover:text-foreground transition-smooth">
                {offering.description}
              </p>
              
              {offering.external ? (
                <a href={offering.link} target="_blank" rel="noopener noreferrer">
                  <Button 
                    variant="outline" 
                    className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-bounce hover:scale-105 shadow-soft hover:shadow-medium"
                  >
                    {offering.linkText}
                  </Button>
                </a>
              ) : (
                <Link to={offering.link}>
                  <Button 
                    variant="outline" 
                    className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-bounce hover:scale-105 shadow-soft hover:shadow-medium"
                  >
                    {offering.linkText}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupplementalOfferings;
