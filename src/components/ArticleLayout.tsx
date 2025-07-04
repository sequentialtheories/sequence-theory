
import { Button } from "@/components/ui/button";
import { ArrowLeft, Award } from "lucide-react";
import { Link } from "react-router-dom";

interface ArticleLayoutProps {
  title: string;
  level: string;
  children: React.ReactNode;
}

const ArticleLayout = ({ title, level, children }: ArticleLayoutProps) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white py-6">
        <div className="container mx-auto px-6">
          <Link to="/learn-now" className="inline-flex items-center gap-2 text-gray-100 hover:text-white transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Learn Now
          </Link>
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/a0e89a17-55c8-45b2-8c5d-b5e7ae0a756c.png" 
              alt="Sequence Theory Logo" 
              className="h-16"
            />
            <div>
              <h1 className="text-3xl font-bold">{title}</h1>
              <div className="flex items-center gap-1 text-gray-100 mt-2">
                <Award className="h-4 w-4" />
                <span>{level}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto prose prose-lg">
            {children}
          </div>
        </div>
      </main>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-cyan-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-6">Ready to Put This Into Practice?</h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join The Vault Club and start applying what you've learned with our structured investment contracts.
          </p>
          <Link to="/#signup">
            <Button 
              size="lg" 
              className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Join The Vault Club
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ArticleLayout;
