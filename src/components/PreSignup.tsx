
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, Rocket } from "lucide-react";

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
        title: "Welcome to the future!",
        description: "You've been added to our early access list. We'll be in touch soon!",
      });
      setEmail("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section id="signup" className="py-20 bg-gradient-to-r from-purple-900 via-slate-900 to-blue-900 text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
            <Rocket className="h-10 w-10 text-white" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Be Among the First
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Join our exclusive early access program and get a front-row seat to the future 
            of decentralized applications. Limited spots available.
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
                className="pl-12 py-3 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-3 font-semibold transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? "Joining..." : "Get Access"}
            </Button>
          </form>
          
          <p className="text-sm text-gray-400 mt-4">
            No spam, ever. We respect your privacy and will only send you updates about our launch.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PreSignup;
