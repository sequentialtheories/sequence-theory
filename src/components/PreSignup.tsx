
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, Vault } from "lucide-react";

const PreSignup = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Welcome to The Vault Club!",
        description: "You're now on our priority list for early access.",
      });
      setEmail("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section id="signup" className="py-20 bg-gradient-primary text-primary-foreground relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-glow/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-float-delayed"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-primary-foreground/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-glow animate-glow animate-pulse-soft">
            <Vault className="h-10 w-10 text-primary-foreground" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up shadow-glow">
            Join The Vault Club
          </h2>
          <p className="text-xl mb-8 opacity-90 animate-slide-up [animation-delay:0.2s]">
            Ready to ease into digital assets smartly? Get priority access to our investment platform - earn and learn before token madness.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto animate-slide-up [animation-delay:0.4s]">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-12 py-3 bg-primary-foreground/5 border-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60 focus:border-primary-foreground/30 focus:ring-primary-foreground/20 backdrop-blur-sm transition-smooth"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-background text-primary hover:bg-secondary px-8 py-3 font-semibold transition-bounce hover:scale-105 shadow-medium hover:shadow-strong"
            >
              {isLoading ? "Registering..." : "Register for Early Access"}
            </Button>
          </form>
          
          <p className="text-sm text-primary-foreground/80 mt-6 animate-slide-up [animation-delay:0.6s]">
            Skip speculation. Start with structured earning. No spam.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PreSignup;
