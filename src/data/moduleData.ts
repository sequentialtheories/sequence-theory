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
  id: "historical-evolution-money",
  title: "Money Through Time",
  description: "Journey through the fascinating evolution of money from barter to Bitcoin",
  level: "Beginner",
  category: "Financial Basics",
  categoryIndex: 0,
  moduleIndex: 1,
  slides: [
    {
      id: "slide-1",
      type: "content",
      title: "The Greatest Invention You Never Think About",
      content: `What if I told you that money is one of humanity's greatest inventions - right up there with the wheel, writing, and the internet?

Think about it: money touches every aspect of our lives, yet we rarely question how it came to be. The story of money is actually the story of human civilization itself.

From trading chickens for haircuts to buying coffee with your phone, let's explore how money evolved and why this history matters more than you think.`
    },
    {
      id: "slide-2", 
      type: "content",
      title: "Life Before Money (The Barter Days)",
      content: `Picture this: You're a farmer in ancient times with extra grain. You need shoes, but the shoemaker doesn't want grain - he wants meat. So you need to find someone who wants grain and has meat, then trade the meat for shoes.

This is exhausting! And what if your grain spoils while you're searching? Or the shoemaker decides he wants pottery instead?

The barter system worked for small communities, but it had a fatal flaw: both people had to want exactly what the other person offered. Economists call this the "double coincidence of wants" problem.

Trade was limited, and economies couldn't grow beyond tiny villages.`
    },
    {
      id: "slide-3",
      type: "content",
      title: "The First Money: Things People Actually Wanted",
      content: `Humans got clever. Instead of trading goods directly, they started using items that EVERYONE wanted.

Cattle became money (that's where "capital" comes from!). Salt was so valuable that Roman soldiers were paid with it (hence "salary"). Shells, stones, and precious metals all served as early money.

This was genius! Now you could trade your grain for cattle, and the shoemaker would accept cattle because everyone else did too.

But there was still a problem: Try carrying 10 cows to the market, or keeping your salt fortune from getting wet in the rain.

Money needed to evolve again.`
    },
    {
      id: "slide-4",
      type: "content",
      title: "The Coin Revolution (Money Gets Official)",
      content: `Around 650 BCE, the kingdom of Lydia created something revolutionary: the first official coins.

These weren't just metal chunks - they were standardized pieces with guaranteed weight and purity, stamped by the government. Suddenly, you didn't need to weigh and test metal with every transaction.

Coins spread like wildfire because they solved major problems:
• Same size and value everywhere
• Hard to fake (government stamp)
• Easy to carry and count
• Didn't spoil or die

But humans being human, governments quickly learned they could "cheat" by reducing the precious metal content while keeping the same face value. The first inflation was born!`
    },
    {
      id: "slide-5",
      type: "content",
      title: "Paper Money: The Dangerous Temptation",
      content: `China invented paper money around 1000 CE, and it was brilliant - until it wasn't.

Paper money was incredibly convenient: light, portable, and you could make it in different denominations. It enabled modern banking and international trade.

But here's the catch: it's just paper. Its value comes from trust and the promise that you can exchange it for something real.

Every government that controlled paper money eventually faced the same temptation: when they needed money for wars or expensive projects, why not just print more?

France's revolutionary money became worthless. Confederate dollars weren't worth the paper they were printed on. Germany printed so much money in the 1920s that people needed wheelbarrows full of cash to buy bread.

The pattern was clear: give governments a printing press, and they'll eventually use it.`
    },
    {
      id: "slide-6",
      type: "content",
      title: "The Great Experiment: Money Without Gold",
      content: `On August 15, 1971, President Nixon made a decision that changed everything: he ended the U.S. dollar's connection to gold.

For the first time in history, the world's dominant currency wasn't backed by anything except government promises. We entered the "fiat money" era (fiat means "let it be so" in Latin).

This was unprecedented. Every major currency is now fiat money - it has value because governments say it does, not because it's backed by gold or silver.

The results? On one hand: global trade exploded, economies became more flexible, and we got credit cards and digital payments.

On the other hand: money printing accelerated, boom-bust cycles got bigger, and the dollar lost 85% of its value since 1971.

We're still living through this experiment.`
    },
    {
      id: "slide-7",
      type: "content",
      title: "Enter the Digital Age",
      content: `Then 2008 happened. The financial crisis shook faith in traditional banking, and something new emerged from the chaos: Bitcoin.

For the first time in history, we had money that:
• No government controls
• Has a fixed supply that can't be increased
• Works globally without banks
• Is completely digital

Whether Bitcoin succeeds or fails, it opened the floodgates. Now we have thousands of digital currencies, central bank digital currencies (CBDCs), and money that can be programmed with smart contracts.

Money is evolving faster than ever, and we're witnessing the birth of entirely new monetary systems.`
    },
    {
      id: "slide-8",
      type: "content",
      title: "What History Teaches Us",
      content: `Looking back, several patterns emerge:

1. **Money always evolves with technology** - from metals to coins to paper to digital
2. **Trust is everything** - money only works when people believe in it
3. **Convenience drives adoption** - easier-to-use money always wins
4. **Power corrupts** - those who control money printing eventually abuse it
5. **Innovation comes from problems** - new money systems emerge when old ones fail

Understanding this history isn't just academic - it helps you navigate today's monetary landscape.

When someone tells you cryptocurrency is "fake money," you can remind them that all money is a social agreement. When inflation rises, you understand it's as old as governments themselves.

The story of money is far from over. You're living through the next chapter right now.`
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