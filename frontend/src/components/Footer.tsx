import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Linkedin, 
  Instagram, 
  Youtube, 
  Mail,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast({
      title: "Subscribed!",
      description: "Thank you for subscribing to our newsletter.",
    });
    
    setEmail("");
    setIsSubmitting(false);
  };

  const navigationLinks = [
    { label: "Home", href: "/" },
    { label: "Learn More", href: "/learn-more" },
    { label: "Learn Now", href: "/learn-now" },
    { label: "Indices", href: "/indices" },
    { label: "FAQ", href: "/faq" },
  ];

  const socialLinks = [
    { icon: Linkedin, href: "https://linkedin.com/company/sequencetheory", label: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com/sequencetheory", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com/@sequencetheory", label: "YouTube" },
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
          {/* Column 1: Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-background">Navigation</h3>
            <nav className="space-y-3">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block text-background/70 hover:text-background transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 2: Social */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-background">Connect With Us</h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-background/10 hover:bg-background/20 rounded-full flex items-center justify-center transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 text-background" />
                </a>
              ))}
            </div>
            <p className="mt-6 text-background/60 text-sm leading-relaxed">
              Stay connected for updates on financial education, investment opportunities, and community events.
            </p>
          </div>

          {/* Column 3: Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-background">Newsletter</h3>
            <p className="text-background/70 text-sm mb-4">
              Get the latest insights on wealth building and crypto investing.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background/10 border-background/20 text-background placeholder:text-background/50 focus:border-primary rounded-full"
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/a0e89a17-55c8-45b2-8c5d-b5e7ae0a756c.png" 
                alt="Sequence Theory" 
                className="h-6 w-auto brightness-0 invert opacity-80"
              />
              <span className="text-background/80 font-medium">Sequence Theory, Inc.</span>
            </div>
            
            <p className="text-background/60 text-sm text-center md:text-right">
              © {new Date().getFullYear()} Sequence Theory, Inc. All rights reserved.
              <span className="hidden sm:inline ml-2">|</span>
              <span className="block sm:inline sm:ml-2 text-primary font-medium">Your Money, Your Power.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
