import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AdvancedWeb3Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const { toast } = useToast();

  const questions = [
    {
      id: 'q1',
      question: "According to the Advanced Staking Mechanisms section, what is the primary benefit of liquid staking?",
      options: [
        { value: 'a', text: 'Higher rewards than regular staking' },
        { value: 'b', text: 'Stake tokens while maintaining liquidity through derivative tokens' },
        { value: 'c', text: 'Automatic compound interest' },
        { value: 'd', text: 'No slashing risk' }
      ],
      source: "Advanced Staking Mechanisms section"
    },
    {
      id: 'q2',
      question: "What is restaking as described in the module?",
      options: [
        { value: 'a', text: 'Staking the same tokens multiple times' },
        { value: 'b', text: 'Use staked ETH to secure additional protocols (EigenLayer)' },
        { value: 'c', text: 'Withdrawing and re-staking tokens' },
        { value: 'd', text: 'Delegating stake to multiple validators' }
      ],
      source: "Advanced Staking Mechanisms section"
    },
    {
      id: 'q3',
      question: "According to the Sophisticated Lending Protocols, what are flash loans?",
      options: [
        { value: 'a', text: 'Loans with instant approval' },
        { value: 'b', text: 'Uncollateralized loans repaid in same transaction' },
        { value: 'c', text: 'Loans with very low interest rates' },
        { value: 'd', text: 'Automated lending protocols' }
      ],
      source: "Sophisticated Lending Protocols section"
    },
    {
      id: 'q4',
      question: "What is credit delegation as described in the lending protocols?",
      options: [
        { value: 'a', text: 'Transferring credit scores between users' },
        { value: 'b', text: 'Allow others to borrow against your collateral' },
        { value: 'c', text: 'Automated credit approval systems' },
        { value: 'd', text: 'Sharing loan responsibilities' }
      ],
      source: "Sophisticated Lending Protocols section"
    },
    {
      id: 'q5',
      question: "According to the MEV section, what are sandwich attacks?",
      options: [
        { value: 'a', text: 'Attacking the protocol from multiple angles' },
        { value: 'b', text: 'Manipulating prices around large trades' },
        { value: 'c', text: 'Exploiting smart contract vulnerabilities' },
        { value: 'd', text: 'Coordinated attacks by multiple validators' }
      ],
      source: "MEV (Maximal Extractable Value) section"
    },
    {
      id: 'q6',
      question: "What is the purpose of Flashbots as mentioned in the MEV section?",
      options: [
        { value: 'a', text: 'Fast transaction processing' },
        { value: 'b', text: 'Transparent and efficient MEV marketplaces' },
        { value: 'c', text: 'Automated trading bots' },
        { value: 'd', text: 'Flash loan protocols' }
      ],
      source: "MEV (Maximal Extractable Value) section"
    },
    {
      id: 'q7',
      question: "According to the Meme Coins section, what drives token adoption and value in meme coins?",
      options: [
        { value: 'a', text: 'Technical fundamentals' },
        { value: 'b', text: 'Viral marketing through social media' },
        { value: 'c', text: 'Traditional financial metrics' },
        { value: 'd', text: 'Government endorsement' }
      ],
      source: "Meme Coins and Social Finance section"
    },
    {
      id: 'q8',
      question: "What is liquidity mining as described in the Yield Farming section?",
      options: [
        { value: 'a', text: 'Mining cryptocurrency with liquidity pools' },
        { value: 'b', text: 'Earning additional tokens for providing liquidity' },
        { value: 'c', text: 'Extracting value from liquid assets' },
        { value: 'd', text: 'Converting illiquid assets to liquid ones' }
      ],
      source: "Yield Farming Strategies section"
    },
    {
      id: 'q9',
      question: "According to the DAO section, what is quadratic voting designed to prevent?",
      options: [
        { value: 'a', text: 'Double voting' },
        { value: 'b', text: 'Whale dominance in governance' },
        { value: 'c', text: 'Voting fraud' },
        { value: 'd', text: 'Anonymous voting' }
      ],
      source: "Decentralized Autonomous Organizations section"
    },
    {
      id: 'q10',
      question: "What are ZK-Rollups as described in the Layer 2 section?",
      options: [
        { value: 'a', text: 'Zero-knowledge proof-based scaling solutions' },
        { value: 'b', text: 'Fast transaction rollback mechanisms' },
        { value: 'c', text: 'Automated market makers' },
        { value: 'd', text: 'Cross-chain bridge protocols' }
      ],
      source: "Layer 2 and Scaling Solutions section"
    },
    {
      id: 'q11',
      question: "According to the Privacy Technologies section, what do zk-SNARKs enable?",
      options: [
        { value: 'a', text: 'Fast transaction processing' },
        { value: 'b', text: 'Succinct non-interactive argument of knowledge' },
        { value: 'c', text: 'Anonymous wallet creation' },
        { value: 'd', text: 'Encrypted smart contracts' }
      ],
      source: "Privacy-Preserving Technologies section"
    },
    {
      id: 'q12',
      question: "What is concentrated liquidity as mentioned in the AMM Evolution section?",
      options: [
        { value: 'a', text: 'Pooling all liquidity in one location' },
        { value: 'b', text: 'Providing liquidity in specific ranges' },
        { value: 'c', text: 'Concentrated ownership of liquidity' },
        { value: 'd', text: 'High-density liquidity pools' }
      ],
      source: "Automated Market Maker Evolution section"
    },
    {
      id: 'q13',
      question: "According to the Cross-Chain Infrastructure section, what are atomic swaps?",
      options: [
        { value: 'a', text: 'Instantaneous token swaps' },
        { value: 'b', text: 'Cross-chain asset exchanges without intermediaries' },
        { value: 'c', text: 'Splitting tokens into smaller units' },
        { value: 'd', text: 'Automated trading algorithms' }
      ],
      source: "Cross-Chain Infrastructure section"
    },
    {
      id: 'q14',
      question: "What is composability risk as described in the Risk Management section?",
      options: [
        { value: 'a', text: 'Risk of poor protocol design' },
        { value: 'b', text: 'Cascading failures across protocols' },
        { value: 'c', text: 'Risk of protocol incompatibility' },
        { value: 'd', text: 'Smart contract compilation errors' }
      ],
      source: "Risk Management in Advanced DeFi section"
    },
    {
      id: 'q15',
      question: "According to the Emerging Trends section, what are modular blockchains?",
      options: [
        { value: 'a', text: 'Blockchains that can be easily modified' },
        { value: 'b', text: 'Specialized chains for specific functions' },
        { value: 'c', text: 'Blockchains with removable components' },
        { value: 'd', text: 'Blockchains built with modules' }
      ],
      source: "Emerging Trends & Future Innovations section"
    }
  ];

  // Correct answers
  const correctAnswers = {
    q1: 'b', q2: 'b', q3: 'b', q4: 'b', q5: 'b', 
    q6: 'b', q7: 'b', q8: 'b', q9: 'b', q10: 'a', 
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
      title: "Quiz Completed!",
      description: `You scored ${score}/${totalQuestions} (${percentage}%). ${percentage >= 70 ? 'Excellent work on advanced Web3!' : 'Review the module to master these concepts!'}`,
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
          <Link to="/advanced-web3-innovations" className="inline-flex items-center gap-2 text-gray-100 hover:text-white transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Advanced Web3 Innovations
          </Link>
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/a0e89a17-55c8-45b2-8c5d-b5e7ae0a756c.png" 
              alt="Sequence Theory Logo" 
              className="h-16"
            />
            <div>
              <h1 className="text-3xl font-bold">Advanced Web3 Innovations Quiz</h1>
              <p className="text-gray-100">Test Your Expert-Level Knowledge</p>
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
                
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Advanced Web3 Quiz Complete!</h2>
                
                <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Your Expert-Level Results</h3>
                  <p className="text-3xl mb-2">
                    <span className="font-bold text-indigo-600">{quizScore}</span>
                    <span className="text-gray-600">/{questions.length}</span>
                  </p>
                  <p className="text-2xl mb-6">
                    <span className="font-bold text-purple-600">{Math.round((quizScore / questions.length) * 100)}%</span>
                  </p>
                  
                  {Math.round((quizScore / questions.length) * 100) >= 70 ? (
                    <div className="text-green-600">
                      <p className="text-xl font-semibold mb-2">🚀 Outstanding Mastery!</p>
                      <p>You demonstrate expert-level understanding of advanced Web3 innovations. You're ready to implement these cutting-edge concepts!</p>
                    </div>
                  ) : (
                    <div className="text-orange-600">
                      <p className="text-xl font-semibold mb-2">📚 Continue Your Advanced Learning!</p>
                      <p>These are complex topics. Review the Advanced Web3 Innovations module to strengthen your expertise in these cutting-edge technologies!</p>
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
                  <Link to="/advanced-web3-innovations">
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3">
                      Return to Module
                    </Button>
                  </Link>
                  <Link to="/learn-now">
                    <Button 
                      variant="outline"
                      className="px-6 py-3"
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Continue Learning
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

export default AdvancedWeb3Quiz;