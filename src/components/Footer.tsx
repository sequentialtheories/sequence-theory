
const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-foreground to-muted-foreground text-primary-foreground py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-float-delayed"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 animate-slide-up">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Sequence Theory, Inc.
            </span>
          </h3>
          <p className="mb-6 max-w-2xl mx-auto opacity-90 animate-slide-up [animation-delay:0.2s]">
            Democratizing access to wealth building by creating intuitive, education first tools that empower everyday people to participate in digital & traditional financial systems with confidence.
          </p>
          
          <div className="border-t border-primary-foreground/20 pt-8 animate-slide-up [animation-delay:0.4s]">
            <p className="text-sm opacity-80">
              © 2025 Sequence Theory, Inc. All rights reserved. | 
              <span className="ml-2 text-primary-glow shimmer">Democratizing Financial Empowerment</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
