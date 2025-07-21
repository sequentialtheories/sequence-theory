import React from 'react';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  requiresSlides: number[]; // Which slides must be completed before this question can appear
}

export interface ContentSlide {
  id: string;
  type: 'content' | 'quiz';
  title: string;
  content?: string | React.ReactNode;
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
      explanation: 'Money solves the double coincidence of wants problem by eliminating the need for both parties to want what the other has. Instead, everyone accepts money as an intermediary.',
      requiresSlides: [1] // Can appear after slide 2 (barter problem)
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
      explanation: 'Money itself doesn\'t generate wealth - it\'s a tool for storing, exchanging, and measuring value. The three main functions are store of value, medium of exchange, and unit of account.',
      requiresSlides: [3] // Can appear after slide 4 (three jobs of money)
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
      explanation: 'The barber didn\'t want chickens; he wanted shoes. This created a chain of trades the farmer would need to make, illustrating the double coincidence of wants problem.',
      requiresSlides: [1] // Can appear after slide 2 (barter problem)
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
      explanation: 'Money acts as a universal translator because it allows people to trade without needing to directly want what the other person has. Everyone accepts money, making trade much easier.',
      requiresSlides: [2] // Can appear after slide 3 (universal translator)
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
      explanation: 'Understanding money\'s core functions (store of value, medium of exchange, unit of account) helps you evaluate how well cryptocurrencies fulfill these same fundamental purposes that all money must serve.',
      requiresSlides: [4] // Can appear after slide 5 (why this matters today)
    }
  ]
};

const moneyThroughTimeModule: ModuleData = {
  id: "money-through-time",
  title: "Money Through Time",
  description: "Explore the evolution of money from barter to digital currencies",
  level: "Beginner",
  category: "Finance Fundamentals",
  categoryIndex: 0,
  moduleIndex: 1,
  slides: [
    {
      id: "intro",
      type: "content",
      title: "The Journey of Money Through Time",
      content: `Money's evolution reveals humanity's greatest financial triumphs and catastrophic mistakes. Understanding this history is crucial for navigating today's monetary landscape.

Let's take a journey through time to see how money evolved from simple bartering to today's digital currencies.`
    },
    {
      id: "barter",
      type: "content", 
      title: "The Barter System (Pre-3000 BCE)",
      content: `Before money existed, people traded goods directly. This was simple in concept but had major problems:

**The Double Coincidence Problem**: You want my cow, but I need your grain - not your tools!

**No Fair Pricing**: How many chickens equal one cow? Pricing was inconsistent and unfair.

**No Savings**: You can't store perishable goods for future use. Your wealth would literally rot away.

This system severely limited trade and economic growth.`
    },
    {
      id: "commodity",
      type: "content",
      title: "Commodity Money Era (3000-600 BCE)",
      content: `Items with intrinsic value became the first "money":

**Popular Commodities**:
• Cattle (where "capital" comes from)
• Salt (Roman soldiers' "salary") 
• Shells and rare stones
• Precious metals

**The Problems**:
• Heavy and hard to transport
• Spoilage and deterioration
• Difficult to divide
• Easy to counterfeit

While better than barter, commodity money had serious limitations for growing economies.`
    },
    {
      id: "coins",
      type: "content",
      title: "The Coin Revolution (650 BCE - 1000 CE)",
      content: `Lydia's first coins around 650 BCE revolutionized trade:

**Major Innovations**:
• Standardized weight and purity
• Government authentication  
• Portable and durable
• Divisible into smaller units

**The Dark Side**:
• Coin clipping and debasement
• Roman inflation from silver debasement
• Still heavy for large transactions

Coins solved many problems but governments quickly learned to abuse them.`
    },
    {
      id: "paper",
      type: "content",
      title: "Paper Money & Banking (1000 CE - 1971)",
      content: `China invented paper money, but it came with a dangerous temptation:

**Revolutionary Benefits**:
• Lightweight and portable
• Enabled modern banking
• Facilitated international trade
• Gold standard provided stability

**Historic Failures**:
• France's assignats (1790s) - 99% loss
• Confederate dollars - became worthless
• Germany's Weimar hyperinflation
• Government printing to fund wars

⚠️ **The Pattern**: Every government that gained control of money printing eventually abused it.`
    },
    {
      id: "fiat",
      type: "content",
      title: "The Fiat Experiment (1971 - Present)",
      content: `Nixon ended gold backing in 1971. We're now 50+ years into the first global fiat experiment:

**Fiat Advantages**:
• Flexible monetary policy
• Digital transactions possible
• Quick crisis response
• Global payment systems

**The Cost**:
• Persistent inflation erodes savings
• Currency wars and devaluations  
• Boom-bust cycles amplified
• Growing wealth inequality

📊 **The Numbers**: Since 1971, the US dollar has lost 85% of its purchasing power. What cost $1 then costs $6.50+ today.`
    },
    {
      id: "digital",
      type: "content",
      title: "The Digital Revolution (2008 - Present)",
      content: `Bitcoin emerged from the 2008 financial crisis, offering new possibilities:

**Payment Innovation**: Digital wallets, instant transfers, global reach

**Programmable Money**: Smart contracts, DeFi, automated systems

**Monetary Choice**: Fixed supply vs. infinite printing debate

The digital age has opened up entirely new possibilities for what money can be and how it can function.`
    },
    {
      id: "lessons",
      type: "content",
      title: "Critical Lessons from History",
      content: `**What We've Learned**:
• Money always evolves with technology
• Trust is the foundation of any monetary system
• Governments can't resist printing money
• Inflation is theft from savers
• Monopoly money always fails eventually

**Why This Matters Today**:
• Central banks printed $20+ trillion since 2008
• We're in the longest fiat experiment ever
• Digital alternatives are emerging
• Your wealth depends on these choices

💡 **Key Insight**: Understanding history helps predict the future of money.`
    }
  ],
  quizPool: [
    {
      id: "q1",
      question: "What was the main problem with the barter system?",
      options: [
        "It was too complex",
        "The double coincidence of wants problem",
        "It required technology",
        "It was illegal"
      ],
      correctAnswer: 1,
      explanation: "The double coincidence of wants meant both parties had to want what the other offered, making trades difficult and limiting economic growth.",
      requiresSlides: [1]
    },
    {
      id: "q2", 
      question: "Which ancient civilization is credited with creating the first coins?",
      options: [
        "Greece",
        "Rome", 
        "Lydia",
        "Egypt"
      ],
      correctAnswer: 2,
      explanation: "Lydia (modern-day Turkey) created the first official coins around 650 BCE, revolutionizing trade with standardized weight and purity.",
      requiresSlides: [3]
    },
    {
      id: "q3",
      question: "What happened to the US dollar's purchasing power since 1971?",
      options: [
        "It increased by 50%",
        "It stayed the same",
        "It lost about 85% of its value",
        "It doubled in value"
      ],
      correctAnswer: 2,
      explanation: "Since Nixon ended the gold standard in 1971, the dollar has lost approximately 85% of its purchasing power due to persistent inflation.",
      requiresSlides: [5]
    },
    {
      id: "q4",
      question: "Which country first invented paper money?",
      options: [
        "England",
        "France",
        "China", 
        "Italy"
      ],
      correctAnswer: 2,
      explanation: "China invented paper money during the Tang Dynasty, centuries before it appeared in Europe, revolutionizing trade and commerce.",
      requiresSlides: [4]
    },
    {
      id: "q5",
      question: "What was salt used for in ancient Rome related to money?",
      options: [
        "As currency for soldiers' salaries",
        "As backing for coins",
        "As a trade commodity only",
        "As a measure of wealth"
      ],
      correctAnswer: 0,
      explanation: "Roman soldiers were often paid in salt, which is where the word 'salary' comes from - highlighting salt's role as commodity money.",
      requiresSlides: [2]
    },
    {
      id: "q6",
      question: "What emerged after the 2008 financial crisis?",
      options: [
        "New banking regulations only",
        "Bitcoin and digital currencies",
        "Return to the gold standard",
        "Elimination of paper money"
      ],
      correctAnswer: 1,
      explanation: "Bitcoin was created in 2008 as a response to the financial crisis, offering an alternative to traditional banking systems and fiat currencies.",
      requiresSlides: [6]
    },
    {
      id: "q7",
      question: "What is the most important lesson from monetary history?",
      options: [
        "Gold is always the best money",
        "Technology doesn't matter",
        "Governments tend to abuse money printing power",
        "Inflation is always good"
      ],
      correctAnswer: 2,
      explanation: "Throughout history, governments that gained control over money printing consistently abused this power, leading to inflation and currency devaluation.",
      requiresSlides: [7]
    },
    {
      id: "q8",
      question: "What was a major problem with commodity money?",
      options: [
        "It was too valuable",
        "It was heavy and hard to transport",
        "It lasted too long",
        "It was too easy to create"
      ],
      correctAnswer: 1,
      explanation: "Commodity money like cattle or large stones was difficult to transport and impractical for everyday transactions, limiting trade efficiency.",
      requiresSlides: [2]
    }
  ]
};

// You can add more modules here following the same pattern
export const allModules: ModuleData[] = [
  whatIsMoneyModule,
  moneyThroughTimeModule
  // Add more modules as they're created
];