import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, CheckCircle, X, Trophy, Target, Coins, TrendingUp, Users, Zap, Shield, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ContentSlide {
  id: string;
  type: 'content' | 'quiz';
  title: string;
  content?: string | React.ReactNode;
  image?: string;
  layout?: 'default' | 'visual' | 'comparison' | 'grid' | 'feature-cards';
  visualElements?: {
    icon?: string;
    gradient?: string;
    cards?: Array<{
      title: string;
      description: string;
      icon?: string;
      color?: string;
    }>;
    comparison?: {
      before: { title: string; items: string[]; icon?: string };
      after: { title: string; items: string[]; icon?: string };
    };
    features?: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
}

interface ModuleData {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  slides: ContentSlide[];
  quizPool: QuizQuestion[];
}

interface InteractiveModuleProps {
  moduleData: ModuleData;
  isUnlocked: boolean;
  onComplete: (moduleId: string) => void;
}

export default function InteractiveModule({ moduleData, isUnlocked, onComplete }: InteractiveModuleProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [moduleCompleted, setModuleCompleted] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number>(0);
  const { toast } = useToast();

  // Icon mapping for visual elements
  const iconMap: { [key: string]: React.ReactNode } = {
    'coins': <Coins className="h-6 w-6" />,
    'trending': <TrendingUp className="h-6 w-6" />,
    'users': <Users className="h-6 w-6" />,
    'zap': <Zap className="h-6 w-6" />,
    'shield': <Shield className="h-6 w-6" />,
    'chart': <BarChart3 className="h-6 w-6" />,
  };

  // Color mapping for cards
  const colorMap: { [key: string]: string } = {
    'blue': 'from-blue-500/10 to-blue-600/20 border-blue-200',
    'green': 'from-green-500/10 to-green-600/20 border-green-200',
    'purple': 'from-purple-500/10 to-purple-600/20 border-purple-200',
    'red': 'from-red-500/10 to-red-600/20 border-red-200',
    'yellow': 'from-yellow-500/10 to-yellow-600/20 border-yellow-200',
    'orange': 'from-orange-500/10 to-orange-600/20 border-orange-200',
    'indigo': 'from-indigo-500/10 to-indigo-600/20 border-indigo-200',
  };

  // Animate card reveals
  useEffect(() => {
    const slide = moduleData.slides[currentSlide];
    if (slide?.visualElements?.cards) {
      setVisibleCards(0);
      const timer = setInterval(() => {
        setVisibleCards((prev) => {
          if (prev < slide.visualElements!.cards!.length) {
            return prev + 1;
          }
          clearInterval(timer);
          return prev;
        });
      }, 200);
      return () => clearInterval(timer);
    }
  }, [currentSlide, moduleData.slides]);

  // Generate random quiz questions on module start
  useEffect(() => {
    if (moduleData.quizPool.length >= 3) {
      const shuffled = [...moduleData.quizPool].sort(() => 0.5 - Math.random());
      setQuizQuestions(shuffled.slice(0, 3));
    }
  }, [moduleData.quizPool]);

  const progress = ((currentSlide + 1) / moduleData.slides.length) * 100;

  const nextSlide = () => {
    if (currentSlide < moduleData.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Finished all content, start quiz
      setShowQuiz(true);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setShowExplanation(true);

    setTimeout(() => {
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
      } else {
        // Quiz completed
        setQuizCompleted(true);
        const finalScore = isCorrect ? score + 1 : score;
        
        if (finalScore === 3) {
          setModuleCompleted(true);
          onComplete(moduleData.id);
          toast({
            title: "🎉 Module Completed!",
            description: "Perfect score! You've unlocked the next module.",
          });
        } else {
          toast({
            title: "Almost there!",
            description: `You scored ${finalScore}/3. You need 3/3 to unlock the next module. Try again!`,
            variant: "destructive"
          });
        }
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setShowQuiz(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizCompleted(false);
    setShowExplanation(false);
    
    // Generate new random questions
    const shuffled = [...moduleData.quizPool].sort(() => 0.5 - Math.random());
    setQuizQuestions(shuffled.slice(0, 3));
  };

  const renderSlideContent = (slide: ContentSlide) => {
    if (!slide) return null;

    const layout = slide.layout || 'default';
    const elements = slide.visualElements;

    switch (layout) {
      case 'visual':
        return (
          <div className="mb-8">
            <div className={`bg-gradient-to-br ${elements?.gradient || 'from-blue-50 to-indigo-100'} rounded-2xl p-8 mb-6`}>
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{elements?.icon}</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{slide.title}</h2>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">{slide.content}</p>
              </div>
            </div>
            
            {elements?.cards && (
              <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {elements.cards.map((card, index) => (
                  <Card 
                    key={index}
                    className={`hover-scale transition-all duration-300 ${
                      index < visibleCards ? 'animate-fade-in' : 'opacity-0'
                    } bg-gradient-to-br ${colorMap[card.color || 'blue']} border`}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl mb-3">{card.icon}</div>
                      <h3 className="font-semibold text-gray-900 mb-2">{card.title}</h3>
                      <p className="text-sm text-gray-600">{card.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 'comparison':
        return (
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{slide.title}</h2>
                <p className="text-lg text-gray-700">{slide.content}</p>
              </div>
              
              {elements?.comparison && (
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <div className="text-3xl mb-2">{elements.comparison.before.icon}</div>
                        <h3 className="text-xl font-bold text-red-900">{elements.comparison.before.title}</h3>
                      </div>
                      <ul className="space-y-3">
                        {elements.comparison.before.items.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-red-800">
                            <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <div className="text-3xl mb-2">{elements.comparison.after.icon}</div>
                        <h3 className="text-xl font-bold text-green-900">{elements.comparison.after.title}</h3>
                      </div>
                      <ul className="space-y-3">
                        {elements.comparison.after.items.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-green-800">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'feature-cards':
        return (
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{slide.title}</h2>
                <p className="text-lg text-gray-700">{slide.content}</p>
              </div>
              
              {elements?.features && (
                <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
                  {elements.features.map((feature, index) => (
                    <Card 
                      key={index}
                      className={`text-center hover-scale transition-all duration-300 ${
                        index < visibleCards ? 'animate-fade-in' : 'opacity-0'
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="text-4xl mb-4">{feature.icon}</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'grid':
        return (
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{slide.title}</h2>
                <p className="text-lg text-gray-700 mb-8">{slide.content}</p>
              </div>
              
              {elements?.cards && (
                <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {elements.cards.map((card, index) => (
                    <Card 
                      key={index}
                      className={`hover-scale transition-all duration-300 ${
                        index < visibleCards ? 'animate-fade-in' : 'opacity-0'
                      } bg-gradient-to-br ${colorMap[card.color || 'blue']} border`}
                    >
                      <CardContent className="p-6">
                        <div className="text-center mb-4">
                          <div className="text-3xl mb-3">{card.icon}</div>
                          <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{card.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="animate-fade-in">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{slide.title}</h2>
                
                {slide.image && (
                  <img 
                    src={slide.image} 
                    alt={slide.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}
                
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  {typeof slide.content === 'string' 
                    ? slide.content.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4">{paragraph}</p>
                      ))
                    : slide.content
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Module Locked</h2>
            <p className="text-gray-600 mb-6">
              Complete the previous module with 100% accuracy to unlock this lesson.
            </p>
            <Link to="/learn-now">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Learning Path
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showQuiz) {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;

    if (quizCompleted) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              {moduleCompleted ? (
                <>
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="h-12 w-12 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Perfect Score!</h2>
                  <p className="text-xl text-gray-600 mb-2">
                    You scored {score}/3 on {moduleData.title}
                  </p>
                  <p className="text-gray-500 mb-8">
                    The next module is now unlocked!
                  </p>
                  <div className="space-y-4">
                    <Link to="/learn-now">
                      <Button size="lg" className="w-full">
                        Continue Learning Journey
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target className="h-12 w-12 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Try Again!</h2>
                  <p className="text-xl text-gray-600 mb-2">
                    You scored {score}/3
                  </p>
                  <p className="text-gray-500 mb-8">
                    You need a perfect score to unlock the next module.
                  </p>
                  <div className="space-y-4">
                    <Button onClick={resetQuiz} size="lg" className="w-full">
                      Retake Quiz
                    </Button>
                    <Link to="/learn-now">
                      <Button variant="outline" size="lg" className="w-full">
                        Back to Learning Path
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Quiz Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2 mb-4">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-800">
                  Quiz Time - Question {currentQuestionIndex + 1} of 3
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Card */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {currentQuestion?.question}
                </h2>
                
                <div className="space-y-4">
                  {currentQuestion?.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => !showExplanation && handleAnswerSelect(index)}
                      disabled={showExplanation}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                        showExplanation
                          ? index === currentQuestion.correctAnswer
                            ? 'border-green-500 bg-green-50 text-green-900'
                            : selectedAnswer === index
                            ? 'border-red-500 bg-red-50 text-red-900'
                            : 'border-gray-200 bg-gray-50 text-gray-500'
                          : selectedAnswer === index
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          showExplanation
                            ? index === currentQuestion.correctAnswer
                              ? 'border-green-500 bg-green-500'
                              : selectedAnswer === index
                              ? 'border-red-500 bg-red-500'
                              : 'border-gray-300'
                            : selectedAnswer === index
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {showExplanation && index === currentQuestion.correctAnswer && (
                            <CheckCircle className="h-4 w-4 text-white" />
                          )}
                          {showExplanation && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                            <X className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <span className="font-medium">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {showExplanation && (
                  <div className={`mt-6 p-4 rounded-lg ${
                    isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-red-600 mt-0.5" />
                      )}
                      <div>
                        <h4 className={`font-semibold mb-2 ${isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                          {isCorrect ? 'Correct!' : 'Not quite right'}
                        </h4>
                        <p className={isCorrect ? 'text-green-800' : 'text-red-800'}>
                          {currentQuestion?.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!showExplanation && (
                  <div className="mt-6 flex justify-center">
                    <Button 
                      onClick={submitAnswer}
                      disabled={selectedAnswer === null}
                      size="lg"
                    >
                      Submit Answer
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/learn-now" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Learning Path</span>
            </Link>
            <div className="text-sm text-gray-500">
              {moduleData.level} • {moduleData.category}
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{moduleData.title}</h1>
              <span className="text-sm text-gray-500">
                {currentSlide + 1} of {moduleData.slides.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Content Card */}
          {renderSlideContent(moduleData.slides[currentSlide])}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {moduleData.slides.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <Button 
              onClick={nextSlide}
              className="flex items-center gap-2"
            >
              {currentSlide === moduleData.slides.length - 1 ? 'Start Quiz' : 'Next'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}