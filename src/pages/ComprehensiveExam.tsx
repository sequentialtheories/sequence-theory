import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, GraduationCap, Shuffle } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ComprehensiveExam = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [examCompleted, setExamCompleted] = useState(false);
  const [examScore, setExamScore] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);
  const { toast } = useToast();

  // Pool of 50 questions from all categories
  const questionPool = [
    // Finance Questions (16 questions)
    {
      id: 'f1',
      question: "What are the three core functions of money according to financial fundamentals?",
      options: [
        { value: 'a', text: 'Store of value, medium of exchange, unit of account' },
        { value: 'b', text: 'Investment tool, payment method, savings account' },
        { value: 'c', text: 'Gold standard, fiat currency, digital currency' },
        { value: 'd', text: 'Credit, debit, cash' }
      ],
      correct: 'a',
      category: "Finance",
      source: "The Concept & Purpose of Money"
    },
    {
      id: 'f2',
      question: "What system preceded modern monetary systems according to historical evolution?",
      options: [
        { value: 'a', text: 'Banking system' },
        { value: 'b', text: 'Barter system' },
        { value: 'c', text: 'Credit card system' },
        { value: 'd', text: 'Stock market system' }
      ],
      correct: 'b',
      category: "Finance",
      source: "Historical Evolution of Money"
    },
    {
      id: 'f3',
      question: "Which market allows companies to raise capital by selling ownership stakes?",
      options: [
        { value: 'a', text: 'Bond market' },
        { value: 'b', text: 'Commodity market' },
        { value: 'c', text: 'Equity market' },
        { value: 'd', text: 'Foreign exchange market' }
      ],
      correct: 'c',
      category: "Finance",
      source: "Types of Financial Markets"
    },
    {
      id: 'f4',
      question: "What makes cryptocurrency different from traditional currencies?",
      options: [
        { value: 'a', text: 'It is backed by gold' },
        { value: 'b', text: 'It operates on decentralized blockchain technology' },
        { value: 'c', text: 'It is controlled by central banks' },
        { value: 'd', text: 'It cannot be traded internationally' }
      ],
      correct: 'b',
      category: "Finance",
      source: "The Crypto Market's Role"
    },
    {
      id: 'f5',
      question: "What is identified as a key driver of societal progress in wealth empowerment?",
      options: [
        { value: 'a', text: 'Government spending' },
        { value: 'b', text: 'Individual wealth accumulation and education' },
        { value: 'c', text: 'Corporate profits' },
        { value: 'd', text: 'International trade' }
      ],
      correct: 'b',
      category: "Finance",
      source: "Wealth & Societal Empowerment"
    },
    {
      id: 'f6',
      question: "What is the most important first step in wealth building according to financial strategy?",
      options: [
        { value: 'a', text: 'Investing in stocks' },
        { value: 'b', text: 'Creating a budget and emergency fund' },
        { value: 'c', text: 'Buying real estate' },
        { value: 'd', text: 'Starting a business' }
      ],
      correct: 'b',
      category: "Finance",
      source: "Financial Strategy & Planning"
    },
    {
      id: 'f7',
      question: "What percentage of emergency fund coverage is recommended?",
      options: [
        { value: 'a', text: '1-2 months of expenses' },
        { value: 'b', text: '3-6 months of expenses' },
        { value: 'c', text: '12 months of expenses' },
        { value: 'd', text: '24 months of expenses' }
      ],
      correct: 'b',
      category: "Finance",
      source: "Financial Strategy & Planning"
    },
    {
      id: 'f8',
      question: "What role does education play in wealth and societal empowerment?",
      options: [
        { value: 'a', text: 'It is not important for wealth building' },
        { value: 'b', text: 'It is fundamental to breaking cycles of poverty and building generational wealth' },
        { value: 'c', text: 'It only matters for academic careers' },
        { value: 'd', text: 'It is only useful for getting jobs' }
      ],
      correct: 'b',
      category: "Finance",
      source: "Wealth & Societal Empowerment"
    },
    {
      id: 'f9',
      question: "What is the primary purpose of the bond market?",
      options: [
        { value: 'a', text: 'To trade company ownership' },
        { value: 'b', text: 'To provide debt financing for organizations and governments' },
        { value: 'c', text: 'To exchange foreign currencies' },
        { value: 'd', text: 'To trade physical commodities' }
      ],
      correct: 'b',
      category: "Finance",
      source: "Types of Financial Markets"
    },
    {
      id: 'f10',
      question: "What makes something an effective store of value?",
      options: [
        { value: 'a', text: 'It maintains its value over time' },
        { value: 'b', text: 'It can be spent immediately' },
        { value: 'c', text: 'It is widely accepted' },
        { value: 'd', text: 'It is backed by government' }
      ],
      correct: 'a',
      category: "Finance",
      source: "The Concept & Purpose of Money"
    },
    {
      id: 'f11',
      question: "What advantage does cryptocurrency offer for global transactions?",
      options: [
        { value: 'a', text: 'Lower fees only' },
        { value: 'b', text: 'Faster settlement times and reduced intermediaries' },
        { value: 'c', text: 'Government backing' },
        { value: 'd', text: 'Physical storage' }
      ],
      correct: 'b',
      category: "Finance",
      source: "The Crypto Market's Role"
    },
    {
      id: 'f12',
      question: "What was a major limitation of the barter system?",
      options: [
        { value: 'a', text: 'Double coincidence of wants problem' },
        { value: 'b', text: 'Too much government regulation' },
        { value: 'c', text: 'High transaction fees' },
        { value: 'd', text: 'Limited to small transactions' }
      ],
      correct: 'a',
      category: "Finance",
      source: "Historical Evolution of Money"
    },
    {
      id: 'f13',
      question: "What is a key characteristic of generational wealth?",
      options: [
        { value: 'a', text: 'It only benefits one person' },
        { value: 'b', text: 'It creates opportunities for future generations through education and assets' },
        { value: 'c', text: 'It is only about money' },
        { value: 'd', text: 'It cannot be shared' }
      ],
      correct: 'b',
      category: "Finance",
      source: "Wealth & Societal Empowerment"
    },
    {
      id: 'f14',
      question: "What is the recommended approach to investment risk?",
      options: [
        { value: 'a', text: 'Avoid all risk' },
        { value: 'b', text: 'Diversify across different asset classes and time horizons' },
        { value: 'c', text: 'Put everything in one investment' },
        { value: 'd', text: 'Only invest in guaranteed returns' }
      ],
      correct: 'b',
      category: "Finance",
      source: "Financial Strategy & Planning"
    },
    {
      id: 'f15',
      question: "What documents should be part of a comprehensive financial plan?",
      options: [
        { value: 'a', text: 'Budget only' },
        { value: 'b', text: 'Budget, investment plan, insurance coverage, and estate planning documents' },
        { value: 'c', text: 'Tax returns and investment accounts' },
        { value: 'd', text: 'Insurance policies only' }
      ],
      correct: 'b',
      category: "Finance",
      source: "Financial Strategy & Planning"
    },
    {
      id: 'f16',
      question: "What is compound interest often called in finance?",
      options: [
        { value: 'a', text: 'Simple interest' },
        { value: 'b', text: 'The eighth wonder of the world' },
        { value: 'c', text: 'Linear growth' },
        { value: 'd', text: 'Fixed return' }
      ],
      correct: 'b',
      category: "Finance",
      source: "Financial Strategy & Planning"
    },
    
    // Web3 Questions (17 questions)
    {
      id: 'w1',
      question: "What is the primary innovation of cryptocurrencies?",
      options: [
        { value: 'a', text: 'They are digital forms of traditional money' },
        { value: 'b', text: 'They operate on decentralized blockchain networks without central authorities' },
        { value: 'c', text: 'They are backed by government guarantees' },
        { value: 'd', text: 'They eliminate all transaction fees' }
      ],
      correct: 'b',
      category: "Web3",
      source: "Cryptocurrencies Fundamentals"
    },
    {
      id: 'w2',
      question: "What is the key benefit of blockchain-based ownership?",
      options: [
        { value: 'a', text: 'Ownership records can be easily modified' },
        { value: 'b', text: 'True digital ownership with immutable, verifiable records' },
        { value: 'c', text: 'Ownership is controlled by tech companies' },
        { value: 'd', text: 'All digital assets are free to use' }
      ],
      correct: 'b',
      category: "Web3",
      source: "Digital Ownership & Empowerment"
    },
    {
      id: 'w3',
      question: "What are utility tokens primarily used for?",
      options: [
        { value: 'a', text: 'As investment vehicles only' },
        { value: 'b', text: 'To access specific services or functions within a platform' },
        { value: 'c', text: 'As digital collectibles' },
        { value: 'd', text: 'To replace traditional currencies' }
      ],
      correct: 'b',
      category: "Web3",
      source: "Tokens & Tokenization"
    },
    {
      id: 'w4',
      question: "What is the primary purpose of consensus mechanisms?",
      options: [
        { value: 'a', text: 'To speed up transactions' },
        { value: 'b', text: 'To ensure all network participants agree on the state of the blockchain' },
        { value: 'c', text: 'To reduce energy consumption' },
        { value: 'd', text: 'To encrypt transaction data' }
      ],
      correct: 'b',
      category: "Web3",
      source: "Blockchain Technology Deep Dive"
    },
    {
      id: 'w5',
      question: "What is the main advantage of decentralized exchanges (DEXs)?",
      options: [
        { value: 'a', text: 'They have lower fees than all centralized exchanges' },
        { value: 'b', text: 'Users maintain control of their funds without intermediaries' },
        { value: 'c', text: 'They offer better customer service' },
        { value: 'd', text: 'They are regulated by government agencies' }
      ],
      correct: 'b',
      category: "Web3",
      source: "DeFi Protocols"
    },
    {
      id: 'w6',
      question: "What is liquid staking?",
      options: [
        { value: 'a', text: 'Staking only highly liquid cryptocurrencies' },
        { value: 'b', text: 'Stake tokens while maintaining liquidity through derivative tokens' },
        { value: 'c', text: 'Staking in multiple protocols simultaneously' },
        { value: 'd', text: 'Converting staked tokens to liquid assets' }
      ],
      correct: 'b',
      category: "Web3",
      source: "Advanced Web3 Innovations"
    },
    {
      id: 'w7',
      question: "What problem does double-spending address?",
      options: [
        { value: 'a', text: 'Preventing the same digital currency from being used twice' },
        { value: 'b', text: 'Reducing transaction costs' },
        { value: 'c', text: 'Increasing transaction speed' },
        { value: 'd', text: 'Improving privacy protection' }
      ],
      correct: 'a',
      category: "Web3",
      source: "Cryptocurrencies Fundamentals"
    },
    {
      id: 'w8',
      question: "What is a smart contract?",
      options: [
        { value: 'a', text: 'A legal document stored on blockchain' },
        { value: 'b', text: 'Self-executing contracts with terms directly written into code' },
        { value: 'c', text: 'A contract negotiated by AI' },
        { value: 'd', text: 'A digital signature system' }
      ],
      correct: 'b',
      category: "Web3",
      source: "Blockchain Technology Deep Dive"
    },
    {
      id: 'w9',
      question: "What is yield farming?",
      options: [
        { value: 'a', text: 'Growing crops using blockchain technology' },
        { value: 'b', text: 'Earning rewards by providing liquidity to DeFi protocols' },
        { value: 'c', text: 'Mining cryptocurrency with farming equipment' },
        { value: 'd', text: 'Trading agricultural commodities on blockchain' }
      ],
      correct: 'b',
      category: "Web3",
      source: "DeFi Protocols"
    },
    {
      id: 'w10',
      question: "What are NFTs primarily used for?",
      options: [
        { value: 'a', text: 'As alternatives to cryptocurrency payments' },
        { value: 'b', text: 'Representing unique ownership of digital or physical assets' },
        { value: 'c', text: 'As security tokens for companies' },
        { value: 'd', text: 'As utility tokens for platform access' }
      ],
      correct: 'b',
      category: "Web3",
      source: "Digital Ownership & Empowerment"
    },
    {
      id: 'w11',
      question: "What is MEV (Maximal Extractable Value)?",
      options: [
        { value: 'a', text: 'The maximum value a blockchain can process' },
        { value: 'b', text: 'Value that can be extracted by reordering, including, or excluding transactions' },
        { value: 'c', text: 'The maximum exchange rate between cryptocurrencies' },
        { value: 'd', text: 'The maximum staking rewards possible' }
      ],
      correct: 'b',
      category: "Web3",
      source: "Advanced Web3 Innovations"
    },
    {
      id: 'w12',
      question: "What is the key difference between fungible and non-fungible tokens?",
      options: [
        { value: 'a', text: 'Fungible tokens are more valuable' },
        { value: 'b', text: 'Fungible tokens are interchangeable, while NFTs are unique' },
        { value: 'c', text: 'NFTs can only represent digital art' },
        { value: 'd', text: 'Fungible tokens cannot be traded' }
      ],
      correct: 'b',
      category: "Web3",
      source: "Tokens & Tokenization"
    },
    {
      id: 'w13',
      question: "What is impermanent loss?",
      options: [
        { value: 'a', text: 'Permanent loss of funds in a protocol hack' },
        { value: 'b', text: 'Temporary loss in value when providing liquidity due to price changes' },
        { value: 'c', text: 'Loss due to network congestion' },
        { value: 'd', text: 'Loss from smart contract bugs' }
      ],
      correct: 'b',
      category: "Web3",
      source: "DeFi Protocols"
    },
    {
      id: 'w14',
      question: "What is the purpose of cryptographic hashing?",
      options: [
        { value: 'a', text: 'To encrypt user passwords' },
        { value: 'b', text: 'To create unique fingerprints for blocks and ensure data integrity' },
        { value: 'c', text: 'To speed up transaction processing' },
        { value: 'd', text: 'To compress blockchain data' }
      ],
      correct: 'b',
      category: "Web3",
      source: "Blockchain Technology Deep Dive"
    },
    {
      id: 'w15',
      question: "What are zero-knowledge proofs used for?",
      options: [
        { value: 'a', text: 'Eliminating the need for blockchain networks' },
        { value: 'b', text: 'Proving statements without revealing the underlying information' },
        { value: 'c', text: 'Creating faster transaction speeds' },
        { value: 'd', text: 'Reducing gas fees to zero' }
      ],
      correct: 'b',
      category: "Web3",
      source: "Advanced Web3 Innovations"
    },
    {
      id: 'w16',
      question: "What is restaking in advanced Web3 innovations?",
      options: [
        { value: 'a', text: 'Staking the same tokens multiple times' },
        { value: 'b', text: 'Use staked ETH to secure additional protocols (EigenLayer)' },
        { value: 'c', text: 'Withdrawing and re-staking tokens' },
        { value: 'd', text: 'Delegating stake to multiple validators' }
      ],
      correct: 'b',
      category: "Web3",
      source: "Advanced Web3 Innovations"
    },
    {
      id: 'w17',
      question: "What are flash loans?",
      options: [
        { value: 'a', text: 'Loans with instant approval' },
        { value: 'b', text: 'Uncollateralized loans repaid in same transaction' },
        { value: 'c', text: 'Loans with very low interest rates' },
        { value: 'd', text: 'Automated lending protocols' }
      ],
      correct: 'b',
      category: "Web3",
      source: "Advanced Web3 Innovations"
    },

    // Education Questions (17 questions)
    {
      id: 'e1',
      question: "What has been the single most powerful force driving civilization forward?",
      options: [
        { value: 'a', text: 'Technology and innovation' },
        { value: 'b', text: 'Learning and the capacity to build upon previous knowledge' },
        { value: 'c', text: 'Economic development and trade' },
        { value: 'd', text: 'Political systems and governance' }
      ],
      correct: 'b',
      category: "Education",
      source: "Learning as Human Progress Foundation"
    },
    {
      id: 'e2',
      question: "What is the 'learning multiplier effect'?",
      options: [
        { value: 'a', text: 'The ability to learn multiple subjects simultaneously' },
        { value: 'b', text: 'Education creates exponential benefits that ripple through society across generations' },
        { value: 'c', text: 'Learning speeds increase with practice' },
        { value: 'd', text: 'Digital tools amplify learning capacity' }
      ],
      correct: 'b',
      category: "Education",
      source: "Learning as Human Progress Foundation"
    },
    {
      id: 'e3',
      question: "How many children and youth are out of school globally?",
      options: [
        { value: 'a', text: '144 million' },
        { value: 'b', text: '244 million' },
        { value: 'c', text: '344 million' },
        { value: 'd', text: '444 million' }
      ],
      correct: 'b',
      category: "Education",
      source: "Consequences of Educational Absence"
    },
    {
      id: 'e4',
      question: "How many adults worldwide lack basic literacy skills?",
      options: [
        { value: 'a', text: '571 million people' },
        { value: 'b', text: '771 million people' },
        { value: 'c', text: '671 million people' },
        { value: 'd', text: '471 million people' }
      ],
      correct: 'b',
      category: "Education",
      source: "Consequences of Educational Absence"
    },
    {
      id: 'e5',
      question: "What was the primary method of controlling financial knowledge in Medieval Europe?",
      options: [
        { value: 'a', text: 'Royal decrees limiting education' },
        { value: 'b', text: 'Guild systems that restricted financial knowledge to members' },
        { value: 'c', text: 'Church control of all monetary transactions' },
        { value: 'd', text: 'Feudal lords controlling trade routes' }
      ],
      correct: 'b',
      category: "Education",
      source: "Financial Literacy Gatekeeping"
    },
    {
      id: 'e6',
      question: "What is 'information asymmetry'?",
      options: [
        { value: 'a', text: 'Unequal access to technology' },
        { value: 'b', text: 'Deliberate information gaps that maintain advantages for some over others' },
        { value: 'c', text: 'Different learning speeds among individuals' },
        { value: 'd', text: 'Regional differences in educational quality' }
      ],
      correct: 'b',
      category: "Education",
      source: "Financial Literacy Gatekeeping"
    },
    {
      id: 'e7',
      question: "What is the CFA Franc system an example of?",
      options: [
        { value: 'a', text: 'Successful regional currency cooperation' },
        { value: 'b', text: 'Ongoing neocolonial monetary control where African nations must keep reserves in French banks' },
        { value: 'c', text: 'A model for developing nation currencies' },
        { value: 'd', text: 'An example of post-colonial economic independence' }
      ],
      correct: 'b',
      category: "Education",
      source: "Colonialism of Money & Trade"
    },
    {
      id: 'e8',
      question: "What is 'debt trap diplomacy'?",
      options: [
        { value: 'a', text: 'Helping nations manage their existing debt' },
        { value: 'b', text: 'Unsustainable loans leading to asset seizure and strategic control' },
        { value: 'c', text: 'International cooperation on debt relief' },
        { value: 'd', text: 'Diplomatic negotiations about trade agreements' }
      ],
      correct: 'b',
      category: "Education",
      source: "Colonialism of Money & Trade"
    },
    {
      id: 'e9',
      question: "What percentage of adults worldwide are financially illiterate?",
      options: [
        { value: 'a', text: '47%' },
        { value: 'b', text: '57%' },
        { value: 'c', text: '67%' },
        { value: 'd', text: '77%' }
      ],
      correct: 'b',
      category: "Education",
      source: "Global Education Statistics"
    },
    {
      id: 'e10',
      question: "What percentage of children in Sub-Saharan Africa cannot read?",
      options: [
        { value: 'a', text: '79%' },
        { value: 'b', text: '89%' },
        { value: 'c', text: '69%' },
        { value: 'd', text: '99%' }
      ],
      correct: 'b',
      category: "Education",
      source: "Global Education Statistics"
    },
    {
      id: 'e11',
      question: "What is the annual global economic loss from educational gaps?",
      options: [
        { value: 'a', text: '$3 trillion' },
        { value: 'b', text: '$5 trillion' },
        { value: 'c', text: '$7 trillion' },
        { value: 'd', text: '$10 trillion' }
      ],
      correct: 'b',
      category: "Education",
      source: "Global Education Statistics"
    },
    {
      id: 'e12',
      question: "What is the core principle of 'Universal Access' in democratizing financial knowledge?",
      options: [
        { value: 'a', text: 'Everyone should have the same educational background' },
        { value: 'b', text: 'Financial education should be available to everyone, regardless of income, location, or social status' },
        { value: 'c', text: 'All financial products should be standardized globally' },
        { value: 'd', text: 'Universal basic income should be provided' }
      ],
      correct: 'b',
      category: "Education",
      source: "Democratizing Financial Knowledge"
    },
    {
      id: 'e13',
      question: "What are VSLAs?",
      options: [
        { value: 'a', text: 'Virtual Savings and Loan Applications' },
        { value: 'b', text: 'Village Savings and Loan Associations - peer-led groups combining saving, lending, and financial education' },
        { value: 'c', text: 'Very Small Loan Arrangements' },
        { value: 'd', text: 'Verified Secure Lending Agencies' }
      ],
      correct: 'b',
      category: "Education",
      source: "Democratizing Financial Knowledge"
    },
    {
      id: 'e14',
      question: "What is the target participation rate for successful financial democracy programs?",
      options: [
        { value: 'a', text: 'Greater than 50%' },
        { value: 'b', text: 'Greater than 70%' },
        { value: 'c', text: 'Greater than 80%' },
        { value: 'd', text: 'Greater than 90%' }
      ],
      correct: 'b',
      category: "Education",
      source: "Democratizing Financial Knowledge"
    },
    {
      id: 'e15',
      question: "When did the Information Age begin according to the Historical Evolution section?",
      options: [
        { value: 'a', text: '~1960 CE' },
        { value: 'b', text: '~1970 CE' },
        { value: 'c', text: '~1980 CE' },
        { value: 'd', text: '~1990 CE' }
      ],
      correct: 'b',
      category: "Education",
      source: "Learning as Human Progress Foundation"
    },
    {
      id: 'e16',
      question: "What is the primary barrier that financial literacy gatekeeping creates?",
      options: [
        { value: 'a', text: 'Language differences' },
        { value: 'b', text: 'Artificial scarcity of knowledge to maintain power structures' },
        { value: 'c', text: 'Lack of interest in financial topics' },
        { value: 'd', text: 'Insufficient educational resources' }
      ],
      correct: 'b',
      category: "Education",
      source: "Financial Literacy Gatekeeping"
    },
    {
      id: 'e17',
      question: "According to democratizing financial knowledge, what makes community-based education effective?",
      options: [
        { value: 'a', text: 'It uses the latest technology' },
        { value: 'b', text: 'It builds trust and ensures cultural relevance through peer-to-peer teaching' },
        { value: 'c', text: 'It follows standardized curricula' },
        { value: 'd', text: 'It is provided by certified professionals only' }
      ],
      correct: 'b',
      category: "Education",
      source: "Democratizing Financial Knowledge"
    }
  ];

  // Function to randomly select 35 questions from the pool
  const selectRandomQuestions = () => {
    const shuffled = [...questionPool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 35).map((q, index) => ({ ...q, examId: `exam_${index + 1}` }));
  };

  // Initialize exam with random questions
  useEffect(() => {
    setSelectedQuestions(selectRandomQuestions());
  }, []);

  const handleAnswerSelect = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < selectedQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitExam = () => {
    let score = 0;
    const totalQuestions = selectedQuestions.length;

    // Check each answer
    selectedQuestions.forEach((question) => {
      if (answers[question.examId] === question.correct) {
        score++;
      }
    });

    setExamScore(score);
    setExamCompleted(true);

    const percentage = Math.round((score / totalQuestions) * 100);
    toast({
      title: "Comprehensive Exam Completed!",
      description: `You scored ${score}/${totalQuestions} (${percentage}%). ${percentage >= 80 ? 'Outstanding mastery across all subjects!' : percentage >= 70 ? 'Great knowledge, keep building!' : 'Review the modules to strengthen your understanding!'}`,
    });
  };

  const resetExam = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setExamCompleted(false);
    setExamScore(0);
    setSelectedQuestions(selectRandomQuestions()); // New random selection
  };

  if (selectedQuestions.length === 0) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <Shuffle className="h-12 w-12 text-indigo-600 mx-auto mb-4 animate-spin" />
        <p className="text-lg text-gray-600">Preparing your personalized exam...</p>
      </div>
    </div>;
  }

  const currentQ = selectedQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / selectedQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-orange-600 text-white py-6">
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
            <div>
              <h1 className="text-3xl font-bold">Comprehensive Knowledge Exam</h1>
              <p className="text-gray-100">35 Questions Across Finance, Web3 & Education</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          
          {!examCompleted ? (
            <>
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Question {currentQuestion + 1} of {selectedQuestions.length}
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-600 via-purple-600 to-orange-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-orange-50 rounded-xl p-8 border border-indigo-200 mb-8">
                <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex flex-col items-center">
                      <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-bold px-4 py-2 rounded-full min-w-[3rem] text-center mb-2">
                        {currentQuestion + 1}
                      </span>
                      <div className={`text-xs px-2 py-1 rounded-full text-white font-semibold ${
                        currentQ.category === 'Finance' ? 'bg-cyan-500' :
                        currentQ.category === 'Web3' ? 'bg-purple-500' :
                        'bg-orange-500'
                      }`}>
                        {currentQ.category}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-6 text-gray-900 leading-relaxed">
                        {currentQ.question}
                      </h2>
                      
                      <div className="space-y-4">
                        {currentQ.options.map((option) => (
                          <label 
                            key={option.value}
                            className={`flex items-center gap-3 p-4 cursor-pointer transition-all ${
                              answers[currentQ.examId] === option.value 
                                ? 'border-0 bg-transparent' 
                                : 'border-0 bg-transparent'
                            }`}
                          >
                            <input 
                              type="radio" 
                              name={currentQ.examId} 
                              value={option.value}
                              checked={answers[currentQ.examId] === option.value}
                              onChange={(e) => handleAnswerSelect(currentQ.examId, e.target.value)}
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
                  {currentQuestion === selectedQuestions.length - 1 ? (
                    <Button 
                      onClick={handleSubmitExam}
                      disabled={Object.keys(answers).length !== selectedQuestions.length}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 text-lg font-semibold hover:from-green-700 hover:to-emerald-700"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Submit Exam
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleNext}
                      disabled={!answers[currentQ.examId]}
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
                  Answered: {Object.keys(answers).length}/{selectedQuestions.length} questions
                </p>
                <div className="flex justify-center gap-1 flex-wrap">
                  {selectedQuestions.map((question, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        answers[question.examId] 
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
              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-orange-50 rounded-xl p-12 border border-indigo-200">
                <div className="mb-6">
                  {Math.round((examScore / selectedQuestions.length) * 100) >= 80 ? (
                    <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
                  ) : Math.round((examScore / selectedQuestions.length) * 100) >= 70 ? (
                    <CheckCircle className="h-20 w-20 text-blue-500 mx-auto mb-4" />
                  ) : (
                    <XCircle className="h-20 w-20 text-orange-500 mx-auto mb-4" />
                  )}
                </div>
                
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Comprehensive Exam Complete!</h2>
                
                <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Your Knowledge Mastery Results</h3>
                  <p className="text-3xl mb-2">
                    <span className="font-bold text-indigo-600">{examScore}</span>
                    <span className="text-gray-600">/{selectedQuestions.length}</span>
                  </p>
                  <p className="text-2xl mb-6">
                    <span className="font-bold text-purple-600">{Math.round((examScore / selectedQuestions.length) * 100)}%</span>
                  </p>
                  
                  {Math.round((examScore / selectedQuestions.length) * 100) >= 80 ? (
                    <div className="text-green-600">
                      <p className="text-xl font-semibold mb-2">🏆 Exceptional Mastery!</p>
                      <p>You demonstrate outstanding knowledge across Finance, Web3, and Education. You're ready to apply these concepts and teach others!</p>
                    </div>
                  ) : Math.round((examScore / selectedQuestions.length) * 100) >= 70 ? (
                    <div className="text-blue-600">
                      <p className="text-xl font-semibold mb-2">🎯 Strong Understanding!</p>
                      <p>You have solid knowledge across all three domains. Continue building on this strong foundation!</p>
                    </div>
                  ) : (
                    <div className="text-orange-600">
                      <p className="text-xl font-semibold mb-2">📚 Keep Learning!</p>
                      <p>Review the modules to strengthen your understanding across Finance, Web3, and Education. Every expert was once a beginner!</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={resetExam}
                    variant="outline"
                    className="px-6 py-3 flex items-center gap-2"
                  >
                    <Shuffle className="h-4 w-4" />
                    New Random Exam
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
                      <GraduationCap className="h-4 w-4 mr-2" />
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

export default ComprehensiveExam;