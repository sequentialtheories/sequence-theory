import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Web3Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const { toast } = useToast();

  const questions = [
    {
      id: 'q1',
      question: "According to the Cryptocurrencies Fundamentals module, what is the primary innovation of cryptocurrencies?",
      options: [
        { value: 'a', text: 'They are digital forms of traditional money' },
        { value: 'b', text: 'They operate on decentralized blockchain networks without central authorities' },
        { value: 'c', text: 'They are backed by government guarantees' },
        { value: 'd', text: 'They eliminate all transaction fees' }
      ],
      source: "Cryptocurrencies Fundamentals module"
    },
    {
      id: 'q2',
      question: "In Digital Ownership & Empowerment, what is the key benefit of blockchain-based ownership?",
      options: [
        { value: 'a', text: 'Ownership records can be easily modified' },
        { value: 'b', text: 'True digital ownership with immutable, verifiable records' },
        { value: 'c', text: 'Ownership is controlled by tech companies' },
        { value: 'd', text: 'All digital assets are free to use' }
      ],
      source: "Digital Ownership & Empowerment module"
    },
    {
      id: 'q3',
      question: "According to Tokens & Tokenization, what are utility tokens primarily used for?",
      options: [
        { value: 'a', text: 'As investment vehicles only' },
        { value: 'b', text: 'To access specific services or functions within a platform' },
        { value: 'c', text: 'As digital collectibles' },
        { value: 'd', text: 'To replace traditional currencies' }
      ],
      source: "Tokens & Tokenization module"
    },
    {
      id: 'q4',
      question: "In the Blockchain Technology Deep Dive, what is the primary purpose of consensus mechanisms?",
      options: [
        { value: 'a', text: 'To speed up transactions' },
        { value: 'b', text: 'To ensure all network participants agree on the state of the blockchain' },
        { value: 'c', text: 'To reduce energy consumption' },
        { value: 'd', text: 'To encrypt transaction data' }
      ],
      source: "Blockchain Technology Deep Dive module"
    },
    {
      id: 'q5',
      question: "According to DeFi Protocols, what is the main advantage of decentralized exchanges (DEXs)?",
      options: [
        { value: 'a', text: 'They have lower fees than all centralized exchanges' },
        { value: 'b', text: 'Users maintain control of their funds without intermediaries' },
        { value: 'c', text: 'They offer better customer service' },
        { value: 'd', text: 'They are regulated by government agencies' }
      ],
      source: "DeFi Protocols module"
    },
    {
      id: 'q6',
      question: "In Advanced Web3 Innovations, what is liquid staking?",
      options: [
        { value: 'a', text: 'Staking only highly liquid cryptocurrencies' },
        { value: 'b', text: 'Stake tokens while maintaining liquidity through derivative tokens' },
        { value: 'c', text: 'Staking in multiple protocols simultaneously' },
        { value: 'd', text: 'Converting staked tokens to liquid assets' }
      ],
      source: "Advanced Web3 Innovations module"
    },
    {
      id: 'q7',
      question: "According to Cryptocurrencies Fundamentals, what problem does double-spending address?",
      options: [
        { value: 'a', text: 'Preventing the same digital currency from being used twice' },
        { value: 'b', text: 'Reducing transaction costs' },
        { value: 'c', text: 'Increasing transaction speed' },
        { value: 'd', text: 'Improving privacy protection' }
      ],
      source: "Cryptocurrencies Fundamentals module"
    },
    {
      id: 'q8',
      question: "In Blockchain Technology Deep Dive, what is a smart contract?",
      options: [
        { value: 'a', text: 'A legal document stored on blockchain' },
        { value: 'b', text: 'Self-executing contracts with terms directly written into code' },
        { value: 'c', text: 'A contract negotiated by AI' },
        { value: 'd', text: 'A digital signature system' }
      ],
      source: "Blockchain Technology Deep Dive module"
    },
    {
      id: 'q9',
      question: "According to DeFi Protocols, what is yield farming?",
      options: [
        { value: 'a', text: 'Growing crops using blockchain technology' },
        { value: 'b', text: 'Earning rewards by providing liquidity to DeFi protocols' },
        { value: 'c', text: 'Mining cryptocurrency with farming equipment' },
        { value: 'd', text: 'Trading agricultural commodities on blockchain' }
      ],
      source: "DeFi Protocols module"
    },
    {
      id: 'q10',
      question: "In Digital Ownership & Empowerment, what are NFTs primarily used for?",
      options: [
        { value: 'a', text: 'As alternatives to cryptocurrency payments' },
        { value: 'b', text: 'Representing unique ownership of digital or physical assets' },
        { value: 'c', text: 'As security tokens for companies' },
        { value: 'd', text: 'As utility tokens for platform access' }
      ],
      source: "Digital Ownership & Empowerment module"
    },
    {
      id: 'q11',
      question: "According to Advanced Web3 Innovations, what is MEV (Maximal Extractable Value)?",
      options: [
        { value: 'a', text: 'The maximum value a blockchain can process' },
        { value: 'b', text: 'Value that can be extracted by reordering, including, or excluding transactions' },
        { value: 'c', text: 'The maximum exchange rate between cryptocurrencies' },
        { value: 'd', text: 'The maximum staking rewards possible' }
      ],
      source: "Advanced Web3 Innovations module"
    },
    {
      id: 'q12',
      question: "In Tokens & Tokenization, what is the key difference between fungible and non-fungible tokens?",
      options: [
        { value: 'a', text: 'Fungible tokens are more valuable' },
        { value: 'b', text: 'Fungible tokens are interchangeable, while NFTs are unique' },
        { value: 'c', text: 'NFTs can only represent digital art' },
        { value: 'd', text: 'Fungible tokens cannot be traded' }
      ],
      source: "Tokens & Tokenization module"
    },
    {
      id: 'q13',
      question: "According to DeFi Protocols, what is impermanent loss?",
      options: [
        { value: 'a', text: 'Permanent loss of funds in a protocol hack' },
        { value: 'b', text: 'Temporary loss in value when providing liquidity due to price changes' },
        { value: 'c', text: 'Loss due to network congestion' },
        { value: 'd', text: 'Loss from smart contract bugs' }
      ],
      source: "DeFi Protocols module"
    },
    {
      id: 'q14',
      question: "In Blockchain Technology Deep Dive, what is the purpose of cryptographic hashing?",
      options: [
        { value: 'a', text: 'To encrypt user passwords' },
        { value: 'b', text: 'To create unique fingerprints for blocks and ensure data integrity' },
        { value: 'c', text: 'To speed up transaction processing' },
        { value: 'd', text: 'To compress blockchain data' }
      ],
      source: "Blockchain Technology Deep Dive module"
    },
    {
      id: 'q15',
      question: "According to Advanced Web3 Innovations, what are zero-knowledge proofs used for?",
      options: [
        { value: 'a', text: 'Eliminating the need for blockchain networks' },
        { value: 'b', text: 'Proving statements without revealing the underlying information' },
        { value: 'c', text: 'Creating faster transaction speeds' },
        { value: 'd', text: 'Reducing gas fees to zero' }
      ],
      source: "Advanced Web3 Innovations module"
    }
  ];

  // Correct answers
  const correctAnswers = {
    q1: 'b', q2: 'b', q3: 'b', q4: 'b', q5: 'b', 
    q6: 'b', q7: 'a', q8: 'b', q9: 'b', q10: 'b', 
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
      title: "Web3 Quiz Completed!",
      description: `You scored ${score}/${totalQuestions} (${percentage}%). ${percentage >= 70 ? 'Excellent Web3 knowledge!' : 'Keep studying Web3 concepts!'}`,
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
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6">
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
              <h1 className="text-3xl font-bold">Web3 Modules Quiz</h1>
              <p className="text-gray-100">Test Your Knowledge Across All Web3 Modules</p>
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
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 border border-indigo-200 mb-8">
                <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-4 mb-6">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-bold px-4 py-2 rounded-full min-w-[3rem] text-center">
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
                            className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 ${
                              answers[currentQ.id] === option.value 
                                ? 'border-indigo-500 bg-indigo-50' 
                                : 'border-gray-200'
                            }`}
                          >
                            <input 
                              type="radio" 
                              name={currentQ.id} 
                              value={option.value}
                              checked={answers[currentQ.id] === option.value}
                              onChange={(e) => handleAnswerSelect(currentQ.id, e.target.value)}
                              className="w-5 h-5 text-indigo-600"
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
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center gap-2"
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
                          ? 'bg-indigo-500'
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
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-12 border border-indigo-200">
                <div className="mb-6">
                  {Math.round((quizScore / questions.length) * 100) >= 70 ? (
                    <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
                  ) : (
                    <XCircle className="h-20 w-20 text-orange-500 mx-auto mb-4" />
                  )}
                </div>
                
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Web3 Quiz Complete!</h2>
                
                <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Your Web3 Results</h3>
                  <p className="text-3xl mb-2">
                    <span className="font-bold text-indigo-600">{quizScore}</span>
                    <span className="text-gray-600">/{questions.length}</span>
                  </p>
                  <p className="text-2xl mb-6">
                    <span className="font-bold text-purple-600">{Math.round((quizScore / questions.length) * 100)}%</span>
                  </p>
                  
                  {Math.round((quizScore / questions.length) * 100) >= 70 ? (
                    <div className="text-green-600">
                      <p className="text-xl font-semibold mb-2">🚀 Outstanding Web3 Knowledge!</p>
                      <p>You have excellent understanding of Web3 concepts from fundamentals to advanced innovations. You're ready to navigate the decentralized future!</p>
                    </div>
                  ) : (
                    <div className="text-orange-600">
                      <p className="text-xl font-semibold mb-2">📚 Continue Your Web3 Journey!</p>
                      <p>Review the Web3 modules to strengthen your understanding of blockchain, DeFi, and decentralized technologies. The future is decentralized!</p>
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
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3">
                      Return to Learning
                    </Button>
                  </Link>
                  <Link to="/learn-now">
                    <Button 
                      variant="outline"
                      className="px-6 py-3"
                    >
                      <Zap className="h-4 w-4 mr-2" />
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

export default Web3Quiz;