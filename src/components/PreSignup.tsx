
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useValidation } from "@/hooks/useValidation";
import { useAuth } from "@/components/AuthProvider";
import { Mail, Vault } from "lucide-react";

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
    return timeSinceLastSubmission < 30000; // 30 seconds
  }, [lastSubmissionTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitize and validate email
    const sanitizedEmail = sanitizeInput(email);
    if (!validateEmail(sanitizedEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Check rate limiting
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
        description: "Complete your account to get early access and your Web3 wallet.",
      });

      // Redirect to auth page with sanitized email prefilled
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
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl mobile-text-2xl font-bold mb-4 sm:mb-6 animate-slide-up shadow-glow">
            Join The Vault Club
          </h2>
          <p className="text-lg sm:text-xl mobile-text-base mb-6 sm:mb-8 opacity-90 animate-slide-up [animation-delay:0.2s] px-4">
            Ready to ease into digital assets smartly? Get priority access to our investment platform - earn and learn before token madness.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto animate-slide-up [animation-delay:0.4s] mobile-px-4">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-12 py-3 bg-transparent border-transparent text-primary-foreground placeholder:text-primary-foreground/60 focus:border-transparent focus:ring-transparent backdrop-blur-sm transition-smooth"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-background text-primary hover:bg-secondary px-6 sm:px-8 py-3 font-semibold transition-bounce hover:scale-105 shadow-medium hover:shadow-strong mobile-text-sm w-full sm:w-auto"
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
