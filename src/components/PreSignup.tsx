
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
    <section id="signup" className="py-20 bg-gradient-to-r from-purple-600 to-cyan-600 text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
            <Vault className="h-10 w-10 text-white" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join The Vault Club
          </h2>
          <p className="text-xl mb-8">
            You're ready to ease into digital assets. Secure your priority access to Sequence Theory's premier volatility mitigation platform.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-12 py-3 bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-white focus:ring-white"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-3 font-semibold transition-all duration-300"
            >
              {isLoading ? "Registering..." : "Register for Early Access"}
            </Button>
          </form>
          
          <p className="text-sm text-purple-100 mt-6">
            You're already part of this movement. No spam, just the tools you need.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PreSignup;
