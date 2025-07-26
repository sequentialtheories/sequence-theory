
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Award, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { allModules } from '@/data/moduleData';
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ArticleLayoutProps {
  title: string;
  level: string;
  children: React.ReactNode;
}

const ArticleLayout = ({ title, level, children }: ArticleLayoutProps) => {
  const { completeModule, isModuleCompleted } = useLearningProgress();
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const [hasCompletedModule, setHasCompletedModule] = useState(false);

  // Find the current module based on title
  const currentModule = allModules.find(module => module.title === title);
  const moduleId = currentModule?.id;

  useEffect(() => {
    if (moduleId && isModuleCompleted(moduleId)) {
      setHasCompletedModule(true);
      setProgress(100);
    }
  }, [moduleId, isModuleCompleted]);

  // Simulate reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.min((scrollTop / docHeight) * 100, 95); // Max 95% until completion
      
      if (!hasCompletedModule) {
        setProgress(scrollPercent);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasCompletedModule]);

  const handleCompleteModule = () => {
    if (moduleId && currentModule && !hasCompletedModule) {
      completeModule(moduleId, currentModule.categoryIndex, currentModule.moduleIndex);
      setHasCompletedModule(true);
      setProgress(100);
      toast({
        title: "🎉 Module Completed!",
        description: "Your progress has been saved. Keep learning!",
      });
    }
  };

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
              src="/lovable-uploads/22e8418f-d8fd-4cd1-8b21-8654423a51a6.png" 
              alt="ST Logo" 
              className="h-16"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{title}</h1>
              <div className="flex items-center gap-1 text-gray-100 mt-2">
                <Award className="h-4 w-4" />
                <span>{level}</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/90 text-sm font-medium">Reading Progress</span>
              <span className="text-white/90 text-sm">
                {Math.round(progress)}%
                {hasCompletedModule && <CheckCircle className="inline h-4 w-4 ml-1 text-green-300" />}
              </span>
            </div>
            <Progress value={progress} className="h-3 bg-white/20" />
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto prose prose-lg">
            {children}
          </div>
          
          {/* Complete Module Button */}
          {!hasCompletedModule && progress > 80 && (
            <div className="max-w-4xl mx-auto mt-12 text-center">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Complete?</h3>
                <p className="text-gray-600 mb-6">
                  You've read most of this module. Mark it as complete to track your progress and unlock new content.
                </p>
                <Button 
                  onClick={handleCompleteModule}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg font-semibold"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Mark as Complete
                </Button>
              </div>
            </div>
          )}
          
          {hasCompletedModule && (
            <div className="max-w-4xl mx-auto mt-12 text-center">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <CheckCircle className="h-6 w-6" />
                  <span className="font-semibold text-lg">Module Completed!</span>
                </div>
              </div>
            </div>
          )}
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
