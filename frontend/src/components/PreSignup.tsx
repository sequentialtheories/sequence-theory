import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useValidation } from "@/hooks/useValidation";
import { useAuth } from "@/components/AuthProvider";
import { Mail, ArrowRight, Shield, Lock } from "lucide-react";

const PreSignup = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastSubmissionTime, setLastSubmissionTime] = useState<number>(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { validateEmail, sanitizeInput } = useValidation();

  // Rate limiting: 1 submission per 30 seconds
  const isRateLimited = useCallback((): boolean => {
    const now = Date.now();
    const timeSinceLastSubmission = now - lastSubmissionTime;
    return timeSinceLastSubmission < 30000;
  }, [lastSubmissionTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const sanitizedEmail = sanitizeInput(email);
    if (!validateEmail(sanitizedEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (isRateLimited()) {
      toast({
        title: "Too Many Requests",
        description: "Please wait 30 seconds before trying again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setLastSubmissionTime(Date.now());
    
    try {
      toast({
        title: "Welcome to The Vault Club!",
        description: "Complete your account to get early access and your secure wallet.",
      });
      navigate(`/auth?email=${encodeURIComponent(sanitizedEmail)}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if user is logged in
  if (user) {
    return null;
  }

  return (
    <section id="signup" className="py-24 bg-primary relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)`,
        backgroundSize: '32px 32px'
      }} />
      
      {/* Gradient overlays */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-black/10 to-transparent" />
      <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-gradient-to-t from-black/10 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-8">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          
          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-primary-foreground">
            Join The Vault Club
          </h2>
          
          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
            Ready to ease into digital assets smartly? Get priority access to our investment platform — 
            earn and learn before token madness.
          </p>
          
          {/* Form - Fixed color contrast */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-12 h-12 bg-white text-gray-900 placeholder:text-gray-500 border-0 rounded-full shadow-lg focus:ring-2 focus:ring-white/50"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="h-12 px-6 bg-gray-900 text-white hover:bg-gray-800 rounded-full font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
              >
                {isLoading ? "Registering..." : "Get Early Access"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-primary-foreground/90 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>No spam, ever</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Non-custodial wallet</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreSignup;
