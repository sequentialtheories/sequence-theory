
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { ProfileDropdown } from "./ProfileDropdown";
import { navigateToSignup } from "@/utils/navigation";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  // Debug logging
  console.log('Navigation - Auth state:', { user: user?.id, loading, hasUser: !!user });

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Learn More", href: "/learn-more" },
    { label: "Learn Now", href: "/learn-now" },
    { label: "Indices", href: "/indices" },
    { label: "FAQ", href: "/faq" }
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-primary/20 shadow-soft transition-smooth">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
            onClick={() => {
              if (location.pathname === '/') {
                const whoWeAreSection = document.querySelector('main[itemScope][itemType="https://schema.org/Service"]');
                if (whoWeAreSection) {
                  whoWeAreSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }
            }}
          >
            <img 
              src="/lovable-uploads/a0e89a17-55c8-45b2-8c5d-b5e7ae0a756c.png" 
              alt="Sequence Theory" 
              className="h-8 w-auto transition-spring group-hover:scale-110"
            />
            <span className="text-foreground font-semibold text-lg hidden sm:block transition-smooth group-hover:text-primary">
              Sequence Theory
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm font-medium transition-bounce relative group animate-slide-left ${
                  isActive(item.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            
            <div className="flex items-center space-x-3">
              {!user && (
                <Button 
                  onClick={() => navigateToSignup(location.pathname, navigate)}
                  size="sm"
                  className="bg-gradient-primary hover:shadow-glow text-primary-foreground px-6 py-2 rounded-full transition-spring hover:scale-105 animate-glow"
                >
                  Join The Vault Club
                </Button>
              )}
              
              {!loading && (
                user ? (
                  <ProfileDropdown />
                ) : (
                  <Button
                    onClick={() => navigate('/auth')}
                    variant="outline"
                    size="sm"
                    className="px-4 py-2 rounded-full transition-spring hover:scale-105"
                  >
                    Sign In
                  </Button>
                )
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-muted-foreground hover:text-foreground transition-spring hover:scale-110"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-primary/20 bg-gradient-secondary/50 backdrop-blur-sm animate-slide-up mobile-py-8">
            <div className="flex flex-col space-y-6 mobile-gap-6">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-base font-medium transition-bounce animate-slide-left mobile-text-lg py-2 ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="flex flex-col space-y-4 pt-4 mobile-gap-6">
                {!user && (
                  <Button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigateToSignup(location.pathname, navigate);
                    }}
                    size="lg"
                    className="bg-gradient-primary hover:shadow-glow text-primary-foreground px-6 py-3 rounded-full transition-spring hover:scale-105 w-full mobile-text-base"
                  >
                    Join The Vault Club
                  </Button>
                )}
                
                {!loading && (
                  user ? (
                    <div onClick={() => setIsMenuOpen(false)}>
                      <ProfileDropdown />
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate('/auth');
                      }}
                      variant="outline"
                      size="lg"
                      className="px-6 py-3 rounded-full transition-spring hover:scale-105 w-full mobile-text-base"
                    >
                      Sign In
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
