import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const EducationQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const { toast } = useToast();

  const questions = [
    {
      id: 'q1',
      question: "According to Learning as Human Progress Foundation, what has been the single most powerful force driving civilization forward?",
      options: [
        { value: 'a', text: 'Technology and innovation' },
        { value: 'b', text: 'Learning and the capacity to build upon previous knowledge' },
        { value: 'c', text: 'Economic development and trade' },
        { value: 'd', text: 'Political systems and governance' }
      ],
      source: "Learning as Human Progress Foundation module"
    },
    {
      id: 'q2',
      question: "What is the 'learning multiplier effect' described in the Human Progress Foundation module?",
      options: [
        { value: 'a', text: 'The ability to learn multiple subjects simultaneously' },
        { value: 'b', text: 'Education creates exponential benefits that ripple through society across generations' },
        { value: 'c', text: 'Learning speeds increase with practice' },
        { value: 'd', text: 'Digital tools amplify learning capacity' }
      ],
      source: "Learning as Human Progress Foundation module"
    },
    {
      id: 'q3',
      question: "According to Consequences of Educational Absence, how many children and youth are out of school globally?",
      options: [
        { value: 'a', text: '144 million' },
        { value: 'b', text: '244 million' },
        { value: 'c', text: '344 million' },
        { value: 'd', text: '444 million' }
      ],
      source: "Consequences of Educational Absence module"
    },
    {
      id: 'q4',
      question: "What percentage of adults worldwide lack basic literacy skills according to the Educational Absence module?",
      options: [
        { value: 'a', text: '571 million people' },
        { value: 'b', text: '771 million people' },
        { value: 'c', text: '671 million people' },
        { value: 'd', text: '471 million people' }
      ],
      source: "Consequences of Educational Absence module"
    },
    {
      id: 'q5',
      question: "According to Financial Literacy Gatekeeping, what was the primary method of controlling financial knowledge in Medieval Europe?",
      options: [
        { value: 'a', text: 'Royal decrees limiting education' },
        { value: 'b', text: 'Guild systems that restricted financial knowledge to members' },
        { value: 'c', text: 'Church control of all monetary transactions' },
        { value: 'd', text: 'Feudal lords controlling trade routes' }
      ],
      source: "Financial Literacy Gatekeeping module"
    },
    {
      id: 'q6',
      question: "What is 'information asymmetry' as described in the Financial Gatekeeping module?",
      options: [
        { value: 'a', text: 'Unequal access to technology' },
        { value: 'b', text: 'Deliberate information gaps that maintain advantages for some over others' },
        { value: 'c', text: 'Different learning speeds among individuals' },
        { value: 'd', text: 'Regional differences in educational quality' }
      ],
      source: "Financial Literacy Gatekeeping module"
    },
    {
      id: 'q7',
      question: "According to Colonialism of Money & Trade, what is the CFA Franc system an example of?",
      options: [
        { value: 'a', text: 'Successful regional currency cooperation' },
        { value: 'b', text: 'Ongoing neocolonial monetary control where African nations must keep reserves in French banks' },
        { value: 'c', text: 'A model for developing nation currencies' },
        { value: 'd', text: 'An example of post-colonial economic independence' }
      ],
      source: "Colonialism of Money & Trade module"
    },
    {
      id: 'q8',
      question: "What is 'debt trap diplomacy' as mentioned in the Colonialism module?",
      options: [
        { value: 'a', text: 'Helping nations manage their existing debt' },
        { value: 'b', text: 'Unsustainable loans leading to asset seizure and strategic control' },
        { value: 'c', text: 'International cooperation on debt relief' },
        { value: 'd', text: 'Diplomatic negotiations about trade agreements' }
      ],
      source: "Colonialism of Money & Trade module"
    },
    {
      id: 'q9',
      question: "According to Global Education Statistics, what percentage of adults worldwide are financially illiterate?",
      options: [
        { value: 'a', text: '47%' },
        { value: 'b', text: '57%' },
        { value: 'c', text: '67%' },
        { value: 'd', text: '77%' }
      ],
      source: "Global Education Statistics module"
    },
    {
      id: 'q10',
      question: "What percentage of children in Sub-Saharan Africa cannot read according to the Statistics module?",
      options: [
        { value: 'a', text: '79%' },
        { value: 'b', text: '89%' },
        { value: 'c', text: '69%' },
        { value: 'd', text: '99%' }
      ],
      source: "Global Education Statistics module"
    },
    {
      id: 'q11',
      question: "According to Global Education Statistics, what is the annual global economic loss from educational gaps?",
      options: [
        { value: 'a', text: '$3 trillion' },
        { value: 'b', text: '$5 trillion' },
        { value: 'c', text: '$7 trillion' },
        { value: 'd', text: '$10 trillion' }
      ],
      source: "Global Education Statistics module"
    },
    {
      id: 'q12',
      question: "What is the core principle of 'Universal Access' in Democratizing Financial Knowledge?",
      options: [
        { value: 'a', text: 'Everyone should have the same educational background' },
        { value: 'b', text: 'Financial education should be available to everyone, regardless of income, location, or social status' },
        { value: 'c', text: 'All financial products should be standardized globally' },
        { value: 'd', text: 'Universal basic income should be provided' }
      ],
      source: "Democratizing Financial Knowledge module"
    },
    {
      id: 'q13',
      question: "According to Democratizing Financial Knowledge, what are VSLAs?",
      options: [
        { value: 'a', text: 'Virtual Savings and Loan Applications' },
        { value: 'b', text: 'Village Savings and Loan Associations - peer-led groups combining saving, lending, and financial education' },
        { value: 'c', text: 'Very Small Loan Arrangements' },
        { value: 'd', text: 'Verified Secure Lending Agencies' }
      ],
      source: "Democratizing Financial Knowledge module"
    },
    {
      id: 'q14',
      question: "What is the target participation rate for successful financial democracy programs according to the Democratizing module?",
      options: [
        { value: 'a', text: 'Greater than 50%' },
        { value: 'b', text: 'Greater than 70%' },
        { value: 'c', text: 'Greater than 80%' },
        { value: 'd', text: 'Greater than 90%' }
      ],
      source: "Democratizing Financial Knowledge module"
    },
    {
      id: 'q15',
      question: "According to the Historical Evolution section in Human Progress Foundation, when did the Information Age begin?",
      options: [
        { value: 'a', text: '~1960 CE' },
        { value: 'b', text: '~1970 CE' },
        { value: 'c', text: '~1980 CE' },
        { value: 'd', text: '~1990 CE' }
      ],
      source: "Learning as Human Progress Foundation module"
    }
  ];

  // Correct answers
  const correctAnswers = {
    q1: 'b', q2: 'b', q3: 'b', q4: 'b', q5: 'b', 
    q6: 'b', q7: 'b', q8: 'b', q9: 'b', q10: 'b', 
    q11: 'b', q12: 'b', q13: 'b', q14: 'b', q15: 'b'
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
      title: "Education Quiz Completed!",
      description: `You scored ${score}/${totalQuestions} (${percentage}%). ${percentage >= 70 ? 'Excellent understanding of education!' : 'Review the modules to strengthen your knowledge!'}`,
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
      <header className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-6">
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
              <h1 className="text-3xl font-bold">Education about Education Quiz</h1>
              <p className="text-gray-100">Test Your Knowledge About Learning and Educational Systems</p>
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
                    className="bg-gradient-to-r from-amber-600 to-orange-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 border border-amber-200 mb-8">
                <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-4 mb-6">
                    <span className="bg-gradient-to-r from-amber-600 to-orange-600 text-white text-lg font-bold px-4 py-2 rounded-full min-w-[3rem] text-center">
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
                      className="bg-gradient-to-r from-amber-600 to-orange-600 text-white flex items-center gap-2"
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
                          ? 'bg-amber-500'
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
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-12 border border-amber-200">
                <div className="mb-6">
                  {Math.round((quizScore / questions.length) * 100) >= 70 ? (
                    <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
                  ) : (
                    <XCircle className="h-20 w-20 text-orange-500 mx-auto mb-4" />
                  )}
                </div>
                
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Education Quiz Complete!</h2>
                
                <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Your Education Knowledge Results</h3>
                  <p className="text-3xl mb-2">
                    <span className="font-bold text-amber-600">{quizScore}</span>
                    <span className="text-gray-600">/{questions.length}</span>
                  </p>
                  <p className="text-2xl mb-6">
                    <span className="font-bold text-orange-600">{Math.round((quizScore / questions.length) * 100)}%</span>
                  </p>
                  
                  {Math.round((quizScore / questions.length) * 100) >= 70 ? (
                    <div className="text-green-600">
                      <p className="text-xl font-semibold mb-2">🎓 Excellent Educational Understanding!</p>
                      <p>You have a strong grasp of educational systems, barriers, and solutions. You understand the critical role of learning in human progress!</p>
                    </div>
                  ) : (
                    <div className="text-orange-600">
                      <p className="text-xl font-semibold mb-2">📚 Continue Your Educational Journey!</p>
                      <p>Review the Education about Education modules to deepen your understanding of learning systems and their impact on society!</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={resetQuiz}
                    variant="outline"
                    className="px-6 py-3"
                  >
                    Retake Quiz
                  </Button>
                  <Link to="/learn-now">
                    <Button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3">
                      Return to Learning
                    </Button>
                  </Link>
                  <Link to="/learn-now">
                    <Button 
                      variant="outline"
                      className="px-6 py-3"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Explore More Modules
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

export default EducationQuiz;