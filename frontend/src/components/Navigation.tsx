import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { ProfileDropdown } from "./ProfileDropdown";
import { navigateToSignup } from "@/utils/navigation";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Track scroll for nav background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Learn More", href: "/learn-more" },
    { label: "Learn Now", href: "/learn-now" },
    { label: "Indices", href: "/indices" },
    { label: "FAQ", href: "/faq" }
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <img 
              src="/lovable-uploads/a0e89a17-55c8-45b2-8c5d-b5e7ae0a756c.png" 
              alt="Sequence Theory" 
              className="h-8 w-auto transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-foreground font-semibold text-lg hidden sm:block">
              Sequence Theory
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  isActive(item.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-3">
            {!loading && (
              <>
                {user ? (
                  <ProfileDropdown />
                ) : (
                  <>
                    <Button
                      onClick={() => navigate('/auth')}
                      variant="ghost"
                      size="sm"
                      className="text-sm font-medium rounded-full"
                    >
                      Sign In
                    </Button>
                    <Button 
                      onClick={() => navigateToSignup(location.pathname, navigate)}
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 rounded-full transition-all duration-200 hover:shadow-md"
                    >
                      Join TVC
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background/95 backdrop-blur-md">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="pt-4 mt-4 border-t border-border space-y-3">
                {!loading && (
                  <>
                    {user ? (
                      <div onClick={() => setIsMenuOpen(false)}>
                        <ProfileDropdown />
                      </div>
                    ) : (
                      <>
                        <Button
                          onClick={() => {
                            setIsMenuOpen(false);
                            navigate('/auth');
                          }}
                          variant="outline"
                          className="w-full rounded-full"
                        >
                          Sign In
                        </Button>
                        <Button 
                          onClick={() => {
                            setIsMenuOpen(false);
                            navigateToSignup(location.pathname, navigate);
                          }}
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                        >
                          Join TVC
                        </Button>
                      </>
                    )}
                  </>
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
