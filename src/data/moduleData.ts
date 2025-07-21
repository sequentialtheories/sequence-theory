export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ContentSlide {
  id: string;
  type: 'content' | 'quiz';
  title: string;
  content?: string;
  image?: string;
}

export interface ModuleData {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  categoryIndex: number;
  moduleIndex: number;
  slides: ContentSlide[];
  quizPool: QuizQuestion[];
}

// First module: "What is Money, Really?"
export const whatIsMoneyModule: ModuleData = {
  id: 'what-is-money-really',
  title: 'What is Money, Really?',
  description: 'Why we even have money and how it makes life easier for everyone.',
  level: 'Beginner',
  category: 'Financial Basics',
  categoryIndex: 0,
  moduleIndex: 0,
  slides: [
    {
      id: 'slide-1',
      type: 'content',
      title: 'Welcome to Money 101',
      content: `Ever wonder why we use money instead of trading chickens for haircuts? You're about to find out!

Money seems so normal that we rarely question it. But understanding what money really is will change how you think about everything - from your salary to Bitcoin to why some countries are richer than others.

Let's start with a simple question: What problem does money solve?`
    },
    {
      id: 'slide-2',
      type: 'content',
      title: 'The Barter Problem',
      content: `Imagine you're a chicken farmer in ancient times. You need a haircut, but the barber doesn't want chickens - he wants shoes. 

So you need to find someone who wants chickens AND has shoes. But that person might want grain, not chickens. So now you need to find someone with grain who wants chickens...

This is called the "double coincidence of wants" problem. For trade to work, both people need to want what the other person has. This made trading incredibly difficult and limited.`
    },
    {
      id: 'slide-3',
      type: 'content',
      title: 'Enter Money: The Universal Translator',
      content: `Money solves this problem by acting like a universal translator for value.

Instead of trading chickens directly, you:
1. Sell your chickens for money
2. Use that money to buy a haircut

The barber doesn't need to want chickens. They just need to trust that the money you give them can be used to buy what THEY want.

Money is essentially a technology that makes trading easier and more efficient.`
    },
    {
      id: 'slide-4',
      type: 'content',
      title: 'The Three Jobs of Money',
      content: `Good money needs to do three things well:

1. **Store of Value**: You can save it for later and it won't disappear or rot (unlike chickens!)

2. **Medium of Exchange**: Everyone accepts it for trade

3. **Unit of Account**: It helps you compare prices and value

Think about it: You can save dollars in your bank (store of value), spend them at stores (medium of exchange), and compare prices between different products (unit of account).`
    },
    {
      id: 'slide-5',
      type: 'content',
      title: 'Why This Matters Today',
      content: `Understanding money's core purpose helps you understand:

• Why gold was money for thousands of years
• What makes some currencies stronger than others  
• How cryptocurrencies fit into the picture
• Why inflation happens and what it means for you

Money isn't magic - it's a tool. And like any tool, the better you understand it, the better you can use it.

Ready to test your knowledge?`
    }
  ],
  quizPool: [
    {
      id: 'q1',
      question: 'What is the main problem that money solves?',
      options: [
        'It makes things more expensive',
        'The double coincidence of wants problem',
        'It helps people count better',
        'It makes governments more powerful'
      ],
      correctAnswer: 1,
      explanation: 'Money solves the double coincidence of wants problem by eliminating the need for both parties to want what the other has. Instead, everyone accepts money as an intermediary.'
    },
    {
      id: 'q2',
      question: 'Which of these is NOT one of the three main functions of money?',
      options: [
        'Store of value',
        'Medium of exchange',
        'Unit of account',
        'Generator of wealth'
      ],
      correctAnswer: 3,
      explanation: 'Money itself doesn\'t generate wealth - it\'s a tool for storing, exchanging, and measuring value. The three main functions are store of value, medium of exchange, and unit of account.'
    },
    {
      id: 'q3',
      question: 'In the barter example, why was it difficult for the chicken farmer to get a haircut?',
      options: [
        'Chickens were not valuable',
        'The barber was too expensive',
        'The barber didn\'t want chickens - he wanted shoes',
        'There were no barbers in ancient times'
      ],
      correctAnswer: 2,
      explanation: 'The barber didn\'t want chickens; he wanted shoes. This created a chain of trades the farmer would need to make, illustrating the double coincidence of wants problem.'
    },
    {
      id: 'q4',
      question: 'How does money act like a "universal translator" for value?',
      options: [
        'It converts different languages into one',
        'It allows people to trade without needing to want each other\'s goods directly',
        'It translates prices into different currencies',
        'It helps people understand foreign cultures'
      ],
      correctAnswer: 1,
      explanation: 'Money acts as a universal translator because it allows people to trade without needing to directly want what the other person has. Everyone accepts money, making trade much easier.'
    },
    {
      id: 'q5',
      question: 'Why is understanding money\'s core purpose important for understanding cryptocurrency?',
      options: [
        'Cryptocurrencies are completely different from traditional money',
        'It helps you see how cryptocurrencies attempt to fulfill the same basic functions as traditional money',
        'Cryptocurrencies don\'t need to follow money principles',
        'Understanding money makes cryptocurrency trading easier'
      ],
      correctAnswer: 1,
      explanation: 'Understanding money\'s core functions (store of value, medium of exchange, unit of account) helps you evaluate how well cryptocurrencies fulfill these same fundamental purposes that all money must serve.'
    }
  ]
};

// You can add more modules here following the same pattern
export const allModules: ModuleData[] = [
  whatIsMoneyModule
  // Add more modules as they're created
];