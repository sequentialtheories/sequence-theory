import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const FinanceQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const { toast } = useToast();

  const questions = [
    {
      id: 'q1',
      question: "What are the three core functions of money according to the Concept & Purpose of Money module?",
      options: [
        { value: 'a', text: 'Store of value, medium of exchange, unit of account' },
        { value: 'b', text: 'Investment tool, payment method, savings account' },
        { value: 'c', text: 'Gold standard, fiat currency, digital currency' },
        { value: 'd', text: 'Credit, debit, cash' }
      ],
      source: "The Concept & Purpose of Money module"
    },
    {
      id: 'q2',
      question: "According to the Historical Evolution of Money, what system preceded modern monetary systems?",
      options: [
        { value: 'a', text: 'Banking system' },
        { value: 'b', text: 'Barter system' },
        { value: 'c', text: 'Credit card system' },
        { value: 'd', text: 'Stock market system' }
      ],
      source: "Historical Evolution of Money module"
    },
    {
      id: 'q3',
      question: "In Types of Financial Markets, which market allows companies to raise capital by selling ownership stakes?",
      options: [
        { value: 'a', text: 'Bond market' },
        { value: 'b', text: 'Commodity market' },
        { value: 'c', text: 'Equity market' },
        { value: 'd', text: 'Foreign exchange market' }
      ],
      source: "Types of Financial Markets module"
    },
    {
      id: 'q4',
      question: "According to The Crypto Market's Role, what makes cryptocurrency different from traditional currencies?",
      options: [
        { value: 'a', text: 'It is backed by gold' },
        { value: 'b', text: 'It operates on decentralized blockchain technology' },
        { value: 'c', text: 'It is controlled by central banks' },
        { value: 'd', text: 'It cannot be traded internationally' }
      ],
      source: "The Crypto Market's Role module"
    },
    {
      id: 'q5',
      question: "In Wealth & Societal Empowerment, what is identified as a key driver of societal progress?",
      options: [
        { value: 'a', text: 'Government spending' },
        { value: 'b', text: 'Individual wealth accumulation and education' },
        { value: 'c', text: 'Corporate profits' },
        { value: 'd', text: 'International trade' }
      ],
      source: "Wealth & Societal Empowerment module"
    },
    {
      id: 'q6',
      question: "According to Financial Strategy & Planning, what is the most important first step in wealth building?",
      options: [
        { value: 'a', text: 'Investing in stocks' },
        { value: 'b', text: 'Creating a budget and emergency fund' },
        { value: 'c', text: 'Buying real estate' },
        { value: 'd', text: 'Starting a business' }
      ],
      source: "Financial Strategy & Planning module"
    },
    {
      id: 'q7',
      question: "What percentage of emergency fund coverage does Financial Strategy & Planning recommend?",
      options: [
        { value: 'a', text: '1-2 months of expenses' },
        { value: 'b', text: '3-6 months of expenses' },
        { value: 'c', text: '12 months of expenses' },
        { value: 'd', text: '24 months of expenses' }
      ],
      source: "Financial Strategy & Planning module"
    },
    {
      id: 'q8',
      question: "In the context of Wealth & Societal Empowerment, what role does education play?",
      options: [
        { value: 'a', text: 'It is not important for wealth building' },
        { value: 'b', text: 'It is fundamental to breaking cycles of poverty and building generational wealth' },
        { value: 'c', text: 'It only matters for academic careers' },
        { value: 'd', text: 'It is only useful for getting jobs' }
      ],
      source: "Wealth & Societal Empowerment module"
    },
    {
      id: 'q9',
      question: "According to Types of Financial Markets, what is the primary purpose of the bond market?",
      options: [
        { value: 'a', text: 'To trade company ownership' },
        { value: 'b', text: 'To provide debt financing for organizations and governments' },
        { value: 'c', text: 'To exchange foreign currencies' },
        { value: 'd', text: 'To trade physical commodities' }
      ],
      source: "Types of Financial Markets module"
    },
    {
      id: 'q10',
      question: "In The Concept & Purpose of Money, what makes something an effective store of value?",
      options: [
        { value: 'a', text: 'It maintains its value over time' },
        { value: 'b', text: 'It can be spent immediately' },
        { value: 'c', text: 'It is widely accepted' },
        { value: 'd', text: 'It is backed by government' }
      ],
      source: "The Concept & Purpose of Money module"
    },
    {
      id: 'q11',
      question: "According to The Crypto Market's Role, what advantage does cryptocurrency offer for global transactions?",
      options: [
        { value: 'a', text: 'Lower fees only' },
        { value: 'b', text: 'Faster settlement times and reduced intermediaries' },
        { value: 'c', text: 'Government backing' },
        { value: 'd', text: 'Physical storage' }
      ],
      source: "The Crypto Market's Role module"
    },
    {
      id: 'q12',
      question: "In Historical Evolution of Money, what was a major limitation of the barter system?",
      options: [
        { value: 'a', text: 'Double coincidence of wants problem' },
        { value: 'b', text: 'Too much government regulation' },
        { value: 'c', text: 'High transaction fees' },
        { value: 'd', text: 'Limited to small transactions' }
      ],
      source: "Historical Evolution of Money module"
    },
    {
      id: 'q13',
      question: "According to Wealth & Societal Empowerment, what is a key characteristic of generational wealth?",
      options: [
        { value: 'a', text: 'It only benefits one person' },
        { value: 'b', text: 'It creates opportunities for future generations through education and assets' },
        { value: 'c', text: 'It is only about money' },
        { value: 'd', text: 'It cannot be shared' }
      ],
      source: "Wealth & Societal Empowerment module"
    },
    {
      id: 'q14',
      question: "In Financial Strategy & Planning, what is the recommended approach to investment risk?",
      options: [
        { value: 'a', text: 'Avoid all risk' },
        { value: 'b', text: 'Diversify across different asset classes and time horizons' },
        { value: 'c', text: 'Put everything in one investment' },
        { value: 'd', text: 'Only invest in guaranteed returns' }
      ],
      source: "Financial Strategy & Planning module"
    },
    {
      id: 'q15',
      question: "According to Financial Strategy & Planning, what documents should be part of a comprehensive financial plan?",
      options: [
        { value: 'a', text: 'Budget only' },
        { value: 'b', text: 'Budget, investment plan, insurance coverage, and estate planning documents' },
        { value: 'c', text: 'Tax returns and investment accounts' },
        { value: 'd', text: 'Insurance policies only' }
      ],
      source: "Financial Strategy & Planning module"
    }
  ];

  // Correct answers
  const correctAnswers = {
    q1: 'a', q2: 'b', q3: 'c', q4: 'b', q5: 'b', 
    q6: 'b', q7: 'b', q8: 'b', q9: 'b', q10: 'a', 
    q11: 'b', q12: 'a', q13: 'b', q14: 'b', q15: 'b'
  };

  const handleAnswerSelect = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    const totalQuestions = questions.length;

    // Check each answer
    Object.entries(correctAnswers).forEach(([question, correctAnswer]) => {
      if (answers[question] === correctAnswer) {
        score++;
      }
    });

    setQuizScore(score);
    setQuizCompleted(true);

    const percentage = Math.round((score / totalQuestions) * 100);
    toast({
      title: "Quiz Completed!",
      description: `You scored ${score}/${totalQuestions} (${percentage}%). ${percentage >= 70 ? 'Great job!' : 'Keep studying!'}`,
    });
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setQuizCompleted(false);
    setQuizScore(0);
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

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
              <h1 className="text-3xl font-bold">Finance Modules Quiz</h1>
              <p className="text-gray-100">Test Your Knowledge Across All Finance Modules</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          
          {!quizCompleted ? (
            <>
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-gradient-to-br from-purple-50 to-cyan-50 rounded-xl p-8 border border-purple-200 mb-8">
                <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-4 mb-6">
                    <span className="bg-purple-600 text-white text-lg font-bold px-4 py-2 rounded-full min-w-[3rem] text-center">
                      {currentQuestion + 1}
                    </span>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-6 text-gray-900 leading-relaxed">
                        {currentQ.question}
                      </h2>
                      
                      <div className="space-y-4">
                        {currentQ.options.map((option) => (
                          <label 
                            key={option.value}
                            className={`flex items-center gap-3 p-4 cursor-pointer transition-all ${
                              answers[currentQ.id] === option.value 
                                ? 'border-0 bg-transparent' 
                                : 'border-0 bg-transparent'
                            }`}
                          >
                            <input 
                              type="radio" 
                              name={currentQ.id} 
                              value={option.value}
                              checked={answers[currentQ.id] === option.value}
                              onChange={(e) => handleAnswerSelect(currentQ.id, e.target.value)}
                              className="w-5 h-5 opacity-0"
                            />
                            <span className="text-base">{option.text}</span>
                          </label>
                        ))}
                      </div>
                      
                      <p className="text-sm text-gray-500 mt-6 italic">
                        Source: {currentQ.source}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center">
                <Button 
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex gap-4">
                  {currentQuestion === questions.length - 1 ? (
                    <Button 
                      onClick={handleSubmitQuiz}
                      disabled={Object.keys(answers).length !== questions.length}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 text-lg font-semibold hover:from-green-700 hover:to-emerald-700"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Submit Quiz
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleNext}
                      disabled={!answers[currentQ.id]}
                      className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white flex items-center gap-2"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Answered Questions Indicator */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Answered: {Object.keys(answers).length}/{questions.length} questions
                </p>
                <div className="flex justify-center gap-2">
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        answers[questions[index].id] 
                          ? 'bg-green-500' 
                          : index === currentQuestion
                          ? 'bg-purple-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Results Screen */
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-50 to-cyan-50 rounded-xl p-12 border border-purple-200">
                <div className="mb-6">
                  {Math.round((quizScore / questions.length) * 100) >= 70 ? (
                    <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
                  ) : (
                    <XCircle className="h-20 w-20 text-orange-500 mx-auto mb-4" />
                  )}
                </div>
                
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Quiz Complete!</h2>
                
                <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Your Results</h3>
                  <p className="text-3xl mb-2">
                    <span className="font-bold text-purple-600">{quizScore}</span>
                    <span className="text-gray-600">/{questions.length}</span>
                  </p>
                  <p className="text-2xl mb-6">
                    <span className="font-bold text-cyan-600">{Math.round((quizScore / questions.length) * 100)}%</span>
                  </p>
                  
                  {Math.round((quizScore / questions.length) * 100) >= 70 ? (
                    <div className="text-green-600">
                      <p className="text-xl font-semibold mb-2">🎉 Excellent Work!</p>
                      <p>You have a solid understanding of finance fundamentals. You're ready to apply this knowledge to your financial journey!</p>
                    </div>
                  ) : (
                    <div className="text-orange-600">
                      <p className="text-xl font-semibold mb-2">📚 Keep Learning!</p>
                      <p>Review the finance modules to strengthen your knowledge. Every expert was once a beginner!</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={resetQuiz}
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-8 py-3 text-lg font-semibold hover:from-purple-700 hover:to-cyan-700"
                  >
                    Retake Quiz
                  </Button>
                  
                  <Link to="/learn-now">
                    <Button 
                      variant="outline"
                      className="px-8 py-3 text-lg font-semibold border-purple-600 text-purple-600 hover:bg-purple-50"
                    >
                      Back to Learn Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinanceQuiz;