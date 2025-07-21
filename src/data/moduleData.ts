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
      layout: 'visual',
      content: `Ever wonder why we use money instead of trading chickens for haircuts? You're about to find out!`,
      visualElements: {
        icon: '💰',
        gradient: 'from-blue-50 to-indigo-100',
        cards: [
          {
            title: 'Your Salary',
            description: 'How you earn and what it really represents',
            icon: '💼',
            color: 'blue'
          },
          {
            title: 'Bitcoin & Crypto',
            description: 'Digital money and what makes it special',
            icon: '₿',
            color: 'orange'
          },
          {
            title: 'Global Economics',
            description: 'Why some countries are richer than others',
            icon: '🌍',
            color: 'green'
          }
        ]
      }
    },
    {
      id: 'slide-2',
      type: 'content',
      title: 'The Barter Problem',
      layout: 'comparison',
      content: `This is called the "double coincidence of wants" problem. For trade to work, both people need to want what the other person has.`,
      visualElements: {
        comparison: {
          before: {
            title: 'Barter System Problems',
            icon: '😤',
            items: [
              'Need someone who wants YOUR goods',
              'AND has what YOU want',
              'Complex chains of trades needed',
              'Time-consuming negotiations',
              'Limited trading opportunities'
            ]
          },
          after: {
            title: 'With Money',
            icon: '✨',
            items: [
              'Sell to anyone for money',
              'Buy from anyone with money',
              'Simple two-step process',
              'Quick and efficient trades',
              'Unlimited possibilities'
            ]
          }
        }
      }
    },
    {
      id: 'slide-3',
      type: 'content',
      title: 'Enter Money: The Universal Translator',
      layout: 'feature-cards',
      content: `Money solves this problem by acting like a universal translator for value.`,
      visualElements: {
        features: [
          {
            icon: '🐔',
            title: 'Step 1: Sell Chickens',
            description: 'Convert your goods into money that everyone accepts'
          },
          {
            icon: '💰',
            title: 'Money Acts as Bridge',
            description: 'Universal medium that holds value between transactions'
          },
          {
            icon: '✂️',
            title: 'Step 2: Buy Haircut',
            description: 'Use money to purchase any service or product you need'
          }
        ]
      }
    },
    {
      id: 'slide-4',
      type: 'content',
      title: 'The Three Jobs of Money',
      layout: 'grid',
      content: `Good money needs to do three things well:`,
      visualElements: {
        cards: [
          {
            title: 'Store of Value',
            description: 'Save it for later - it won\'t disappear or rot like chickens! Your money maintains its purchasing power over time.',
            icon: '🏦',
            color: 'blue'
          },
          {
            title: 'Medium of Exchange',
            description: 'Everyone accepts it for trade. It\'s the common language of commerce that all parties trust.',
            icon: '🔄',
            color: 'green'
          },
          {
            title: 'Unit of Account',
            description: 'Compare prices and value easily. It provides a standard measurement for worth.',
            icon: '📊',
            color: 'purple'
          }
        ]
      }
    },
    {
      id: 'slide-5',
      type: 'content',
      title: 'Why This Matters Today',
      layout: 'visual',
      content: `Understanding money's core purpose helps you understand modern finance:`,
      visualElements: {
        icon: '🎯',
        gradient: 'from-purple-50 to-pink-100',
        cards: [
          {
            title: 'Gold\'s Legacy',
            description: 'Why gold was money for thousands of years',
            icon: '🥇',
            color: 'yellow'
          },
          {
            title: 'Currency Strength',
            description: 'What makes some currencies stronger than others',
            icon: '💪',
            color: 'red'
          },
          {
            title: 'Crypto\'s Role',
            description: 'How cryptocurrencies fit into the picture',
            icon: '🚀',
            color: 'indigo'
          },
          {
            title: 'Inflation Impact',
            description: 'Why inflation happens and what it means for you',
            icon: '📈',
            color: 'orange'
          }
        ]
      }
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
      layout: 'visual',
      content: `Money is one of humanity's greatest inventions - right up there with the wheel, writing, and the internet!`,
      visualElements: {
        icon: '🏛️',
        gradient: 'from-amber-50 to-orange-100',
        cards: [
          {
            title: 'The Wheel',
            description: 'Revolutionized transportation and movement',
            icon: '🛞',
            color: 'blue'
          },
          {
            title: 'Writing',
            description: 'Enabled knowledge sharing across time',
            icon: '📜',
            color: 'green'
          },
          {
            title: 'Money',
            description: 'Made complex economies and trade possible',
            icon: '💰',
            color: 'yellow'
          },
          {
            title: 'Internet',
            description: 'Connected the world in the digital age',
            icon: '🌐',
            color: 'purple'
          }
        ]
      }
    },
    {
      id: "slide-2", 
      type: "content",
      title: "Life Before Money (The Barter Days)",
      layout: 'comparison',
      content: `The barter system worked for small communities, but it had a fatal flaw: the "double coincidence of wants" problem.`,
      visualElements: {
        comparison: {
          before: {
            title: 'Barter Problems',
            icon: '😰',
            items: [
              'Need exact match of wants',
              'Time-consuming negotiations',
              'Goods spoil while searching',
              'Complex chains of trades',
              'Limited to small communities'
            ]
          },
          after: {
            title: 'What People Needed',
            icon: '💡',
            items: [
              'Universal medium of exchange',
              'Durable store of value',
              'Standardized unit of measure',
              'Portable and divisible',
              'Widely accepted by all'
            ]
          }
        }
      }
    },
    {
      id: "slide-3",
      type: "content",
      title: "The First Money: Things People Actually Wanted",
      layout: 'grid',
      content: `Humans got clever and started using items that EVERYONE wanted as money:`,
      visualElements: {
        cards: [
          {
            title: 'Cattle Money',
            description: 'Valuable livestock became currency - this is where the word "capital" comes from!',
            icon: '🐄',
            color: 'green'
          },
          {
            title: 'Salt Payment',
            description: 'So valuable that Roman soldiers were paid with it - giving us the word "salary"',
            icon: '🧂',
            color: 'blue'
          },
          {
            title: 'Shell Currency',
            description: 'Cowrie shells served as money across Africa, Asia, and Pacific islands',
            icon: '🐚',
            color: 'purple'
          },
          {
            title: 'Precious Metals',
            description: 'Gold and silver: rare, durable, and universally desired across cultures',
            icon: '🥇',
            color: 'yellow'
          }
        ]
      }
    },
    {
      id: "slide-4",
      type: "content",
      title: "The Coin Revolution (Money Gets Official)",
      layout: 'feature-cards',
      content: `Around 650 BCE, the kingdom of Lydia created something revolutionary: the first official coins.`,
      visualElements: {
        features: [
          {
            icon: '⚖️',
            title: 'Standardized Weight',
            description: 'Government guaranteed exact weight and purity - no more weighing and testing'
          },
          {
            icon: '👑',
            title: 'Official Stamp',
            description: 'Royal seal prevented counterfeiting and built trust in the currency'
          },
          {
            icon: '🚀',
            title: 'Global Adoption',
            description: 'Coins spread rapidly because they solved major trade problems'
          }
        ]
      }
    },
    {
      id: "slide-5",
      type: "content",
      title: "Paper Money: The Dangerous Temptation",
      layout: 'comparison',
      content: `China invented paper money around 1000 CE. It was revolutionary but came with a dangerous temptation...`,
      visualElements: {
        comparison: {
          before: {
            title: 'Paper Money Benefits',
            icon: '📄',
            items: [
              'Incredibly lightweight and portable',
              'Different denominations possible',
              'Enabled modern banking systems',
              'Facilitated international trade',
              'Much cheaper to produce'
            ]
          },
          after: {
            title: 'The Printing Temptation',
            icon: '⚠️',
            items: [
              'Governments could print more for wars',
              'French revolutionary money became worthless',
              'Confederate dollars lost all value',
              'German hyperinflation in the 1920s',
              'Pattern repeated throughout history'
            ]
          }
        }
      }
    },
    {
      id: "slide-6",
      type: "content",
      title: "The Great Experiment: Money Without Gold",
      layout: 'visual',
      content: `On August 15, 1971, Nixon ended the dollar's connection to gold. For the first time in history, the world's dominant currency wasn't backed by anything physical.`,
      visualElements: {
        icon: '🏛️',
        gradient: 'from-red-50 to-rose-100',
        cards: [
          {
            title: 'Global Trade Explosion',
            description: 'Flexible currencies enabled massive economic growth',
            icon: '🌍',
            color: 'green'
          },
          {
            title: 'Financial Innovation',
            description: 'Credit cards, digital payments, and modern banking',
            icon: '💳',
            color: 'blue'
          },
          {
            title: 'Money Printing Acceleration',
            description: 'No gold backing removed natural limits on currency creation',
            icon: '🖨️',
            color: 'red'
          },
          {
            title: '85% Value Loss',
            description: 'The dollar lost most of its purchasing power since 1971',
            icon: '📉',
            color: 'orange'
          }
        ]
      }
    },
    {
      id: "slide-7",
      type: "content",
      title: "Enter the Digital Age",
      layout: 'visual',
      content: `The 2008 financial crisis shook faith in traditional banking, and something revolutionary emerged: Bitcoin.`,
      visualElements: {
        icon: '₿',
        gradient: 'from-orange-50 to-amber-100',
        cards: [
          {
            title: 'No Government Control',
            description: 'Decentralized network with no central authority',
            icon: '🏛️',
            color: 'purple'
          },
          {
            title: 'Fixed Supply',
            description: 'Only 21 million Bitcoin will ever exist',
            icon: '🔒',
            color: 'orange'
          },
          {
            title: 'Global & Borderless',
            description: 'Works anywhere in the world without banks',
            icon: '🌐',
            color: 'blue'
          },
          {
            title: 'Programmable Money',
            description: 'Smart contracts and automated transactions',
            icon: '⚡',
            color: 'green'
          }
        ]
      }
    },
    {
      id: "slide-8",
      type: "content",
      title: "What History Teaches Us",
      layout: 'grid',
      content: `Looking back through monetary history, several powerful patterns emerge:`,
      visualElements: {
        cards: [
          {
            title: 'Technology Drives Evolution',
            description: 'Money always adapts to new technology - from metals to coins to paper to digital',
            icon: '🔧',
            color: 'blue'
          },
          {
            title: 'Trust is Everything',
            description: 'Money only works when people believe in it - confidence creates value',
            icon: '🤝',
            color: 'green'
          },
          {
            title: 'Convenience Wins',
            description: 'Easier-to-use money always defeats harder-to-use alternatives',
            icon: '📱',
            color: 'purple'
          },
          {
            title: 'Power Corrupts',
            description: 'Those who control money printing eventually abuse this power',
            icon: '⚖️',
            color: 'red'
          },
          {
            title: 'Innovation from Crisis',
            description: 'New monetary systems emerge when old ones fail people',
            icon: '💡',
            color: 'yellow'
          },
          {
            title: 'You\'re Living History',
            description: 'The story of money continues - and you\'re part of the next chapter',
            icon: '📖',
            color: 'indigo'
          }
        ]
      }
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

const whereMoneyLivesModule: ModuleData = {
  id: "types-financial-markets",
  title: "Where Money Lives",
  description: "Stock markets, bond markets, and other places your money can hang out",
  level: "Intermediate", 
  category: "Financial Basics",
  categoryIndex: 0,
  moduleIndex: 2,
  slides: [
    {
      id: "slide-1",
      type: "content",
      title: "The Financial Universe",
      layout: 'visual',
      content: `Think of financial markets as different neighborhoods where money lives. Each has its own culture, rules, and dangers.`,
      visualElements: {
        icon: '🏙️',
        gradient: 'from-slate-50 to-gray-100',
        cards: [
          {
            title: 'Safe Suburbs',
            description: 'Bonds and savings - stable but inflation risk',
            icon: '🏘️',
            color: 'green'
          },
          {
            title: 'Business District',
            description: 'Stock markets - corporate ownership',
            icon: '🏢',
            color: 'blue'
          },
          {
            title: 'Wild West',
            description: 'Crypto markets - 24/7 frontier territory',
            icon: '🤠',
            color: 'orange'
          },
          {
            title: 'The Casino',
            description: 'Derivatives - high stakes gambling',
            icon: '🎰',
            color: 'red'
          }
        ]
      }
    },
    {
      id: "slide-2",
      type: "content", 
      title: "Stock Markets: Owning Pieces of Companies",
      layout: 'comparison',
      content: `The most famous neighborhood - where you buy tiny pieces of companies and hope they grow.`,
      visualElements: {
        comparison: {
          before: {
            title: 'The Promise',
            icon: '📈',
            items: [
              'Own pieces of profitable companies',
              'Share in business growth',
              'Compound wealth over time',
              'Beat inflation long-term',
              'Build generational wealth'
            ]
          },
          after: {
            title: 'The Reality',
            icon: '⚠️',
            items: [
              '90% of day traders lose money',
              'Market psychology drives prices',
              'Insider trading advantages institutions',
              'Emotional trading destroys accounts',
              'Timing is nearly impossible'
            ]
          }
        }
      }
    },
    {
      id: "slide-3",
      type: "content",
      title: "Bond Markets: The \"Safe\" Neighborhood", 
      layout: 'feature-cards',
      content: `You lend money, they pay you interest. Sounds safe until inflation or defaults happen.`,
      visualElements: {
        features: [
          {
            icon: '🏛️',
            title: 'Government Bonds',
            description: 'Treasuries considered "risk-free" - until governments print too much money and inflation eats your returns'
          },
          {
            icon: '🏭',
            title: 'Corporate Bonds',
            description: 'Higher yield but companies can fail - you\'re betting on their ability to pay you back with interest'
          },
          {
            icon: '🔥',
            title: 'Inflation Risk',
            description: 'When prices rise faster than bond interest, your "safe" investment becomes a guaranteed loss'
          }
        ]
      }
    },
    {
      id: "slide-4", 
      type: "content",
      title: "Commodity Markets: Real Stuff in a Digital World",
      layout: 'grid',
      content: `Physical things that power civilization - when paper money becomes questionable, smart money flows here.`,
      visualElements: {
        cards: [
          {
            title: 'Energy',
            description: 'Oil, gas, electricity - the fuel that powers modern civilization',
            icon: '⚡',
            color: 'red'
          },
          {
            title: 'Precious Metals',
            description: 'Gold, silver, platinum - store of value for thousands of years',
            icon: '🥇',
            color: 'yellow'
          },
          {
            title: 'Agriculture',
            description: 'Wheat, corn, coffee - you can\'t eat a stock certificate',
            icon: '🌾',
            color: 'green'
          },
          {
            title: 'Industrial',
            description: 'Copper, steel, lumber - the building blocks of infrastructure',
            icon: '⚙️',
            color: 'blue'
          }
        ]
      }
    },
    {
      id: "slide-5",
      type: "content", 
      title: "Forex: Where Retail Traders Go to Die",
      layout: 'visual',
      content: `The biggest, most liquid market on Earth. Also where retail traders get absolutely destroyed.`,
      visualElements: {
        icon: '🦈',
        gradient: 'from-red-50 to-rose-100',
        cards: [
          {
            title: '$7+ Trillion Daily',
            description: 'Most liquid market ever - but that comes with dangerous sharks',
            icon: '🌊',
            color: 'blue'
          },
          {
            title: '24/7 Trading',
            description: 'Never closes, never sleeps - emotions and FOMO run wild',
            icon: '🌍',
            color: 'green'
          },
          {
            title: '80%+ Lose Money',
            description: 'Retail traders are lunch for institutional sharks',
            icon: '📉',
            color: 'red'
          },
          {
            title: 'High Leverage',
            description: 'Quick account wipeouts with 100:1 leverage ratios',
            icon: '💥',
            color: 'orange'
          }
        ]
      }
    },
    {
      id: "slide-6",
      type: "content",
      title: "Derivatives: The Casino Layer",
      layout: 'comparison',
      content: `Financial instruments derived from other assets. Useful for hedging, devastating for speculation.`,
      visualElements: {
        comparison: {
          before: {
            title: 'Legitimate Uses',
            icon: '🛡️',
            items: [
              'Hedge existing positions',
              'Risk management for businesses',
              'Portfolio insurance strategies',
              'Professional trading tools',
              'Institutional protection'
            ]
          },
          after: {
            title: 'Gambling Reality',
            icon: '🎲',
            items: [
              '80% of options expire worthless',
              'Can lose more than invested',
              'Time decay works against you',
              'Complexity hides the real risks',
              'Most retail use = pure speculation'
            ]
          }
        }
      }
    },
    {
      id: "slide-7",
      type: "content",
      title: "Crypto: The New Wild West", 
      layout: 'visual',
      content: `24/7 global markets with extreme volatility. Revolutionary technology meets speculative mania.`,
      visualElements: {
        icon: '₿',
        gradient: 'from-orange-50 to-amber-100',
        cards: [
          {
            title: 'Revolutionary Tech',
            description: 'Programmable money, smart contracts, decentralized systems',
            icon: '⚡',
            color: 'purple'
          },
          {
            title: '24/7/365 Markets',
            description: 'Never close, global access, no central authority control',
            icon: '🌐',
            color: 'blue'
          },
          {
            title: 'Extreme Volatility',
            description: '50%+ price swings, fortunes made and lost overnight',
            icon: '🎢',
            color: 'red'
          },
          {
            title: 'Scam Paradise',
            description: 'Rug pulls, pump & dumps, regulatory uncertainty',
            icon: '🚨',
            color: 'orange'
          }
        ]
      }
    },
    {
      id: "slide-8",
      type: "content",
      title: "The Truth About All Markets",
      layout: 'grid',
      content: `Markets are efficient at one thing: transferring money from the impatient to the patient.`,
      visualElements: {
        cards: [
          {
            title: 'What Actually Works',
            description: 'Long-term investing in productive assets with proper position sizing',
            icon: '⏰',
            color: 'green'
          },
          {
            title: 'Diversification',
            description: 'Spread risk across uncorrelated markets and asset classes',
            icon: '🎯',
            color: 'blue'
          },
          {
            title: 'Understanding',
            description: 'Know what you\'re buying and why before risking money',
            icon: '🧠',
            color: 'purple'
          },
          {
            title: 'Wealth Destroyers',
            description: 'Trading without knowledge, chasing performance, excessive leverage',
            icon: '💀',
            color: 'red'
          },
          {
            title: 'Market Reality',
            description: 'Liquidity disappears in crises, manipulation by large players',
            icon: '🎭',
            color: 'orange'
          },
          {
            title: 'Your Choice',
            description: 'Now you know where money lives - where will you send yours?',
            icon: '🤔',
            color: 'indigo'
          }
        ]
      }
    }
  ],
  quizPool: [
    {
      id: "q1",
      question: "What percentage of day traders typically lose money?",
      options: [
        "50%",
        "70%", 
        "90%",
        "95%"
      ],
      correctAnswer: 2,
      explanation: "Studies consistently show that about 90% of day traders lose money over time, highlighting the difficulty of short-term trading.",
      requiresSlides: [1]
    },
    {
      id: "q2",
      question: "What is the main risk with bonds during periods of high inflation?",
      options: [
        "They become more volatile",
        "Fixed interest payments lose purchasing power",
        "They stop paying interest",
        "They become harder to sell"
      ],
      correctAnswer: 1,
      explanation: "When inflation rises faster than bond interest rates, the fixed payments lose purchasing power, making bonds a poor inflation hedge.",
      requiresSlides: [2]
    },
    {
      id: "q3",
      question: "Which market has the highest daily trading volume?",
      options: [
        "Stock markets",
        "Bond markets",
        "Forex markets", 
        "Cryptocurrency markets"
      ],
      correctAnswer: 2,
      explanation: "The foreign exchange (forex) market has over $7 trillion in daily trading volume, making it the most liquid market in the world.",
      requiresSlides: [4]
    },
    {
      id: "q4",
      question: "What percentage of options typically expire worthless?",
      options: [
        "50%",
        "65%",
        "80%",
        "95%"
      ],
      correctAnswer: 2,
      explanation: "Approximately 80% of options expire worthless, making options trading heavily skewed against buyers and in favor of sellers.",
      requiresSlides: [5]
    },
    {
      id: "q5",
      question: "Which type of asset represents ownership in physical things people actually need?",
      options: [
        "Stocks",
        "Bonds",
        "Commodities",
        "Derivatives"
      ],
      correctAnswer: 2,
      explanation: "Commodities like oil, gold, wheat, and copper represent ownership in physical materials that power civilization and have intrinsic value.",
      requiresSlides: [3]
    },
    {
      id: "q6",
      question: "What is a key advantage of cryptocurrency markets?",
      options: [
        "They have no volatility",
        "They are 24/7/365 and globally accessible",
        "They are guaranteed to make profits",
        "They have no risks"
      ],
      correctAnswer: 1,
      explanation: "Cryptocurrency markets operate 24/7/365 globally without central authority control, offering unprecedented accessibility compared to traditional markets.",
      requiresSlides: [6]
    },
    {
      id: "q7",
      question: "According to the lesson, what are markets most efficient at doing?",
      options: [
        "Creating wealth for everyone",
        "Allocating capital perfectly",
        "Transferring money from the impatient to the patient",
        "Eliminating all risks"
      ],
      correctAnswer: 2,
      explanation: "Markets are particularly efficient at transferring wealth from impatient traders to patient investors who understand the assets they buy.",
      requiresSlides: [7]
    },
    {
      id: "q8", 
      question: "What typically happens to market liquidity during crisis periods?",
      options: [
        "It increases significantly",
        "It stays the same",
        "It disappears when you need it most",
        "It becomes more predictable"
      ],
      correctAnswer: 2,
      explanation: "During market crises, liquidity often evaporates just when investors need it most, making it difficult to exit positions at reasonable prices.",
      requiresSlides: [7]
    }
  ]
};

// You can add more modules here following the same pattern
export const allModules: ModuleData[] = [
  whatIsMoneyModule,
  moneyThroughTimeModule,
  whereMoneyLivesModule
  // Add more modules as they're created
];