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

const cryptoPlaceInMoneyModule: ModuleData = {
  id: "crypto-market-role",
  title: "Crypto's Place in Money",
  description: "How digital money fits into everything else.",
  level: "Intermediate",
  category: "Financial Basics",
  categoryIndex: 0,
  moduleIndex: 3,
  slides: [
    {
      id: "slide-1",
      type: "content",
      title: "A New Player in the Financial Game",
      layout: 'visual',
      content: `Cryptocurrency isn't just digital money - it's a whole new asset class reshaping finance.`,
      visualElements: {
        icon: '₿',
        gradient: 'from-orange-50 to-amber-100',
        cards: [
          {
            title: 'Digital Native',
            description: 'Born in the internet age, designed for digital transactions',
            icon: '💻',
            color: 'blue'
          },
          {
            title: 'Decentralized',
            description: 'Not controlled by any single government or institution',
            icon: '🌐',
            color: 'green'
          },
          {
            title: 'Programmable',
            description: 'Can embed complex rules and automated conditions',
            icon: '⚡',
            color: 'purple'
          },
          {
            title: 'Global Access',
            description: 'Available 24/7 from anywhere in the world',
            icon: '🌍',
            color: 'orange'
          }
        ]
      }
    },
    {
      id: "slide-2",
      type: "content",
      title: "Crypto vs Traditional Finance",
      layout: 'comparison',
      content: `Rather than replacing traditional finance, crypto markets operate alongside with unique characteristics.`,
      visualElements: {
        comparison: {
          before: {
            title: 'Traditional Finance',
            icon: '🏦',
            items: [
              'Business hours (9-5, weekdays only)',
              'Controlled by central authorities',
              'High barriers for global access',
              'Slow international transfers',
              'Heavy regulatory oversight'
            ]
          },
          after: {
            title: 'Crypto Finance',
            icon: '₿',
            items: [
              'Always open (24/7/365)',
              'Decentralized networks',
              'Anyone with internet can participate',
              'Near-instant global transfers',
              'Emerging regulatory frameworks'
            ]
          }
        }
      }
    },
    {
      id: "slide-3",
      type: "content",
      title: "How Crypto Complements Traditional Markets",
      layout: 'grid',
      content: `Instead of replacing existing systems, crypto often fills gaps and adds new capabilities:`,
      visualElements: {
        cards: [
          {
            title: 'Portfolio Diversification',
            description: 'Uncorrelated returns can reduce overall portfolio risk when markets move differently',
            icon: '📊',
            color: 'blue'
          },
          {
            title: 'Inflation Hedge',
            description: 'Fixed supply cryptocurrencies like Bitcoin serve as "digital gold" against currency debasement',
            icon: '🛡️',
            color: 'yellow'
          },
          {
            title: 'Innovation Driver',
            description: 'Forces traditional finance to modernize with faster, cheaper, more accessible services',
            icon: '🚀',
            color: 'purple'
          },
          {
            title: 'Financial Inclusion',
            description: 'Provides banking services to 1.7 billion unbanked people worldwide',
            icon: '🌍',
            color: 'green'
          }
        ]
      }
    },
    {
      id: "slide-4",
      type: "content",
      title: "The Institutional Adoption Wave",
      layout: 'feature-cards',
      content: `Traditional financial institutions are rapidly embracing cryptocurrencies:`,
      visualElements: {
        features: [
          {
            icon: '🏢',
            title: 'Corporate Treasuries',
            description: 'Tesla, MicroStrategy, and others hold Bitcoin as treasury assets instead of just cash'
          },
          {
            icon: '📈',
            title: 'Investment Products',
            description: 'Bitcoin ETFs, futures contracts, and institutional-grade crypto investment vehicles'
          },
          {
            icon: '🏦',
            title: 'Banking Integration',
            description: 'Major banks offering crypto custody, trading, and payment processing services'
          }
        ]
      }
    },
    {
      id: "slide-5",
      type: "content",
      title: "Economic Functions Crypto Serves",
      layout: 'grid',
      content: `Crypto markets perform several critical economic functions in the global economy:`,
      visualElements: {
        cards: [
          {
            title: 'Value Transfer',
            description: 'Send money globally in minutes instead of days, with lower fees than traditional banking',
            icon: '⚡',
            color: 'blue'
          },
          {
            title: 'Store of Value',
            description: 'Alternative to traditional savings that can\'t be devalued by government money printing',
            icon: '💎',
            color: 'purple'
          },
          {
            title: 'Capital Formation',
            description: 'Fund innovation through ICOs, token sales, and decentralized finance protocols',
            icon: '💡',
            color: 'yellow'
          },
          {
            title: 'Price Discovery',
            description: 'Markets determine fair value for digital assets and new forms of programmable money',
            icon: '🎯',
            color: 'green'
          }
        ]
      }
    },
    {
      id: "slide-6",
      type: "content",
      title: "The Regulatory Reality Check",
      layout: 'comparison',
      content: `Governments worldwide are working to integrate crypto into existing regulatory frameworks.`,
      visualElements: {
        comparison: {
          before: {
            title: 'Progress Made',
            icon: '✅',
            items: [
              'Bitcoin ETFs approved in major markets',
              'Clear tax requirements in most countries',
              'Stablecoin regulations emerging',
              'Central Bank Digital Currencies (CBDCs)',
              'Consumer protection measures'
            ]
          },
          after: {
            title: 'Challenges Remain',
            icon: '⚠️',
            items: [
              'Inconsistent rules across countries',
              'Unclear guidance for new innovations',
              'Enforcement actions create uncertainty',
              'Complex compliance requirements',
              'Ongoing political and policy debates'
            ]
          }
        }
      }
    },
    {
      id: "slide-7",
      type: "content",
      title: "Reality Check: Crypto's Limitations",
      layout: 'visual',
      content: `Despite the potential, crypto markets face real challenges that smart investors understand:`,
      visualElements: {
        icon: '⚠️',
        gradient: 'from-red-50 to-rose-100',
        cards: [
          {
            title: 'Extreme Volatility',
            description: '50%+ price swings can wipe out portfolios overnight',
            icon: '🎢',
            color: 'red'
          },
          {
            title: 'Scam Paradise',
            description: 'Sophisticated fraud, rug pulls, and pump & dump schemes',
            icon: '🚨',
            color: 'orange'
          },
          {
            title: 'Technical Complexity',
            description: 'Lost keys = lost money forever, no customer service',
            icon: '🔐',
            color: 'purple'
          },
          {
            title: 'Environmental Impact',
            description: 'Some networks consume massive amounts of energy',
            icon: '🌡️',
            color: 'yellow'
          }
        ]
      }
    },
    {
      id: "slide-8",
      type: "content",
      title: "The Future Integration",
      layout: 'grid',
      content: `The future of finance likely involves deeper integration between crypto and traditional systems:`,
      visualElements: {
        cards: [
          {
            title: 'Hybrid Products',
            description: 'Financial instruments that blend crypto and traditional assets seamlessly',
            icon: '🔗',
            color: 'blue'
          },
          {
            title: 'Blockchain Securities',
            description: 'Stocks, bonds, and assets issued directly on blockchain networks',
            icon: '📜',
            color: 'green'
          },
          {
            title: 'Cross-Chain Networks',
            description: 'Different blockchain systems working together like internet protocols',
            icon: '🌉',
            color: 'purple'
          },
          {
            title: 'Regulatory Clarity',
            description: 'Clear rules that enable innovation while protecting consumers',
            icon: '⚖️',
            color: 'yellow'
          },
          {
            title: 'Mainstream Adoption',
            description: 'Crypto features built into everyday banking and payment apps',
            icon: '📱',
            color: 'orange'
          },
          {
            title: 'Smart Everything',
            description: 'Programmable money that automatically handles complex financial operations',
            icon: '🤖',
            color: 'indigo'
          }
        ]
      }
    }
  ],
  quizPool: [
    {
      id: "q1",
      question: "What is cryptocurrency's primary relationship with traditional finance?",
      options: [
        "It completely replaces traditional finance",
        "It complements and operates alongside traditional finance",
        "It has no connection to traditional finance",
        "It only works against traditional finance"
      ],
      correctAnswer: 1,
      explanation: "Cryptocurrency markets complement traditional finance by filling gaps and adding new capabilities, rather than completely replacing existing systems.",
      requiresSlides: [1]
    },
    {
      id: "q2",
      question: "Which major advantage do crypto markets have over traditional financial markets?",
      options: [
        "They have no volatility",
        "They operate 24/7/365 globally",
        "They guarantee profits",
        "They have no risks"
      ],
      correctAnswer: 1,
      explanation: "Crypto markets operate continuously 24/7/365 across the globe, unlike traditional markets that have business hours and close on weekends.",
      requiresSlides: [1]
    },
    {
      id: "q3",
      question: "How do institutions primarily use cryptocurrency in their portfolios?",
      options: [
        "As their only investment",
        "For day trading profits",
        "As portfolio diversification and treasury assets",
        "To replace all traditional investments"
      ],
      correctAnswer: 2,
      explanation: "Institutions use cryptocurrency for portfolio diversification and as treasury assets, like companies holding Bitcoin alongside cash reserves.",
      requiresSlides: [3]
    },
    {
      id: "q4",
      question: "What economic function does crypto serve for unbanked populations?",
      options: [
        "Financial inclusion and access to banking services",
        "Guaranteed wealth creation",
        "Elimination of all financial risks",
        "Free money distribution"
      ],
      correctAnswer: 0,
      explanation: "Cryptocurrency provides financial inclusion by offering banking-like services to the 1.7 billion unbanked people worldwide who lack access to traditional banking.",
      requiresSlides: [2]
    },
    {
      id: "q5",
      question: "What is a major limitation of cryptocurrency markets?",
      options: [
        "They are too stable",
        "Extreme volatility and security risks",
        "They are too regulated",
        "They are only available to institutions"
      ],
      correctAnswer: 1,
      explanation: "Crypto markets face extreme volatility with 50%+ price swings and security risks including scams, lost keys, and technical complexity.",
      requiresSlides: [6]
    },
    {
      id: "q6",
      question: "How do Central Bank Digital Currencies (CBDCs) fit into crypto's regulatory integration?",
      options: [
        "They ban all cryptocurrencies",
        "They represent government adoption of digital currency technology",
        "They replace Bitcoin entirely",
        "They have no relation to crypto"
      ],
      correctAnswer: 1,
      explanation: "CBDCs represent governments adopting digital currency technology, showing regulatory integration rather than outright rejection of crypto concepts.",
      requiresSlides: [5]
    },
    {
      id: "q7",
      question: "What role does cryptocurrency serve as a store of value?",
      options: [
        "It guarantees value preservation",
        "It provides an alternative to traditional savings that can't be devalued by money printing",
        "It eliminates all inflation",
        "It replaces all other stores of value"
      ],
      correctAnswer: 1,
      explanation: "Cryptocurrencies with fixed supplies serve as alternatives to traditional savings that can be protected from government money printing and currency debasement.",
      requiresSlides: [4]
    }
  ]
};

const wealthEmpowermentModule: ModuleData = {
  id: "wealth-societal-empowerment",
  title: "Money = Power (Here's How)",
  description: "Why having money gives you choices and changes communities.",
  level: "Advanced",
  category: "Financial Basics",
  categoryIndex: 0,
  moduleIndex: 4,
  slides: [
    {
      id: "slide-1",
      type: "content",
      title: "Money = Power. That's Not Evil - It's Reality.",
      layout: 'visual',
      content: `Let's be honest: money gives you power. Not the evil, corrupt kind - the power to choose, to help, and to change things.`,
      visualElements: {
        icon: '👑',
        gradient: 'from-purple-50 to-indigo-100',
        cards: [
          {
            title: 'Time Freedom',
            description: 'Choose how to spend your most valuable resource',
            icon: '⏰',
            color: 'blue'
          },
          {
            title: 'Choice Freedom',
            description: 'More options in every life decision you make',
            icon: '🎯',
            color: 'green'
          },
          {
            title: 'Risk-Taking Power',
            description: 'Ability to pursue opportunities without fear',
            icon: '🚀',
            color: 'purple'
          },
          {
            title: 'Impact Power',
            description: 'Resources to create positive change',
            icon: '💪',
            color: 'orange'
          }
        ]
      }
    },
    {
      id: "slide-2",
      type: "content",
      title: "The Individual Freedom That Money Buys",
      layout: 'grid',
      content: `Money doesn't just buy stuff - it buys the fundamental freedoms that transform your life:`,
      visualElements: {
        cards: [
          {
            title: 'Education Access',
            description: 'Learn anything, anytime, anywhere - from universities to online courses to personal coaches',
            icon: '🎓',
            color: 'blue'
          },
          {
            title: 'Health Security',
            description: 'Best healthcare, preventive care, mental health support, and wellness resources',
            icon: '🛡️',
            color: 'green'
          },
          {
            title: 'Location Independence',
            description: 'Live where you want, travel freely, escape bad situations, and explore opportunities',
            icon: '🌍',
            color: 'purple'
          },
          {
            title: 'Career Leverage',
            description: 'Say no to bad jobs, start businesses, take career risks, and negotiate from strength',
            icon: '💼',
            color: 'orange'
          },
          {
            title: 'Relationship Quality',
            description: 'Leave toxic relationships, support family, and build connections based on mutual respect',
            icon: '❤️',
            color: 'red'
          },
          {
            title: 'Personal Growth',
            description: 'Therapy, coaching, experiences, and development without worrying about cost',
            icon: '✨',
            color: 'yellow'
          }
        ]
      }
    },
    {
      id: "slide-3",
      type: "content",
      title: "How Wealth Breaks Generational Cycles",
      layout: 'comparison',
      content: `Money doesn't just change your life - it can break cycles of poverty that have trapped families for generations.`,
      visualElements: {
        comparison: {
          before: {
            title: 'Poverty Cycle',
            icon: '🔗',
            items: [
              'Limited educational opportunities',
              'Health problems go untreated',
              'Can\'t take financial risks',
              'Stressed family relationships',
              'Next generation starts behind'
            ]
          },
          after: {
            title: 'Wealth Building',
            icon: '🚀',
            items: [
              'Quality education for children',
              'Preventive healthcare access',
              'Investment and entrepreneurship',
              'Stable, supportive environment',
              'Generational wealth transfer'
            ]
          }
        }
      }
    },
    {
      id: "slide-4",
      type: "content",
      title: "Your Wealth's Ripple Effect on Society",
      layout: 'feature-cards',
      content: `When you build wealth responsibly, the benefits ripple outward to benefit your entire community:`,
      visualElements: {
        features: [
          {
            icon: '💼',
            title: 'Job Creation',
            description: 'Start businesses, invest in companies, and create employment opportunities for others'
          },
          {
            icon: '💰',
            title: 'Economic Stimulus',
            description: 'Your spending drives local economies and supports other businesses and families'
          },
          {
            icon: '🏛️',
            title: 'Tax Contribution',
            description: 'Higher income generates more public funds for schools, infrastructure, and services'
          }
        ]
      }
    },
    {
      id: "slide-5",
      type: "content",
      title: "Wealth as a Tool for Positive Change",
      layout: 'grid',
      content: `Rich people aren't automatically evil. Money amplifies who you already are - and good people can do incredible things with wealth:`,
      visualElements: {
        cards: [
          {
            title: 'Direct Philanthropy',
            description: 'Fund causes you care about, from local food banks to global disease eradication',
            icon: '❤️',
            color: 'red'
          },
          {
            title: 'Social Enterprises',
            description: 'Build businesses that solve real problems while generating sustainable profits',
            icon: '🏢',
            color: 'blue'
          },
          {
            title: 'Impact Investing',
            description: 'Invest in companies and projects that create positive environmental and social outcomes',
            icon: '📈',
            color: 'green'
          },
          {
            title: 'Policy Influence',
            description: 'Support political candidates and causes that align with your values and vision',
            icon: '🗳️',
            color: 'purple'
          },
          {
            title: 'Innovation Funding',
            description: 'Back research, startups, and technologies that could benefit humanity',
            icon: '💡',
            color: 'yellow'
          },
          {
            title: 'Educational Access',
            description: 'Fund scholarships, schools, and learning opportunities for underserved communities',
            icon: '📚',
            color: 'indigo'
          }
        ]
      }
    },
    {
      id: "slide-6",
      type: "content",
      title: "The Democratization of Wealth Building",
      layout: 'visual',
      content: `Technology is breaking down the old barriers to wealth creation. You don't need to be born rich anymore.`,
      visualElements: {
        icon: '🌐',
        gradient: 'from-green-50 to-emerald-100',
        cards: [
          {
            title: 'Digital Assets',
            description: 'Fractional investing, crypto, and crowdfunding lower investment barriers',
            icon: '💎',
            color: 'blue'
          },
          {
            title: 'Online Education',
            description: 'World-class financial education available for free or low cost',
            icon: '📱',
            color: 'green'
          },
          {
            title: 'Micro-Investing',
            description: 'Start with spare change and build wealth gradually over time',
            icon: '🪙',
            color: 'orange'
          },
          {
            title: 'Global Markets',
            description: 'Access the same investments as institutions from your phone',
            icon: '🌍',
            color: 'purple'
          }
        ]
      }
    },
    {
      id: "slide-7",
      type: "content",
      title: "The Dark Side: Wealth's Responsibilities and Dangers",
      layout: 'comparison',
      content: `With great financial power comes great responsibility. Wealth can corrupt and concentrate power dangerously.`,
      visualElements: {
        comparison: {
          before: {
            title: 'Wealth\'s Dark Potential',
            icon: '⚠️',
            items: [
              'Exploitation of workers and consumers',
              'Political corruption and influence buying',
              'Extreme inequality and social division',
              'Environmental destruction for profit',
              'Hoarding resources while others suffer'
            ]
          },
          after: {
            title: 'Responsible Wealth Building',
            icon: '✅',
            items: [
              'Fair treatment of employees and customers',
              'Transparent political engagement',
              'Creating opportunities for others',
              'Sustainable business practices',
              'Active community contribution'
            ]
          }
        }
      }
    },
    {
      id: "slide-8",
      type: "content",
      title: "Building Wealth Communities That Lift Everyone",
      layout: 'grid',
      content: `The goal isn't just personal wealth - it's creating systems where everyone can build wealth together:`,
      visualElements: {
        cards: [
          {
            title: 'Investment Clubs',
            description: 'Pool resources and knowledge to make better investment decisions together',
            icon: '👥',
            color: 'blue'
          },
          {
            title: 'Mentorship Networks',
            description: 'Share knowledge and opportunities between experienced and new wealth builders',
            icon: '🤝',
            color: 'green'
          },
          {
            title: 'Community Development',
            description: 'Invest in local businesses, infrastructure, and opportunities that benefit everyone',
            icon: '🏘️',
            color: 'purple'
          },
          {
            title: 'Cooperative Models',
            description: 'Business structures where workers share ownership and profits fairly',
            icon: '⚖️',
            color: 'orange'
          },
          {
            title: 'Financial Education',
            description: 'Teach money skills to family, friends, and community members',
            icon: '📖',
            color: 'yellow'
          },
          {
            title: 'Policy Advocacy',
            description: 'Support laws that create fair opportunities for wealth building',
            icon: '🏛️',
            color: 'indigo'
          }
        ]
      }
    }
  ],
  quizPool: [
    {
      id: "q1",
      question: "What is the most important type of freedom that wealth provides?",
      options: [
        "The ability to buy expensive things",
        "Time freedom and choice in how to live your life",
        "Power over other people",
        "Ability to avoid all problems"
      ],
      correctAnswer: 1,
      explanation: "Time freedom and choice are the most valuable aspects of wealth - the ability to choose how to spend your time and make life decisions without financial constraints.",
      requiresSlides: [0]
    },
    {
      id: "q2",
      question: "How does individual wealth building benefit society as a whole?",
      options: [
        "It doesn't - wealth only benefits the individual",
        "Through job creation, economic stimulus, and tax contributions",
        "By making everyone else poorer",
        "Only through charity donations"
      ],
      correctAnswer: 1,
      explanation: "Individual wealth creates positive ripple effects through job creation, increased consumer spending, higher tax revenues, and investment in productive activities.",
      requiresSlides: [3]
    },
    {
      id: "q3",
      question: "What is the best way to break generational cycles of poverty?",
      options: [
        "Win the lottery",
        "Build wealth gradually while investing in education and health",
        "Move to a different location",
        "Wait for government assistance"
      ],
      correctAnswer: 1,
      explanation: "Breaking poverty cycles requires building wealth over time while investing in education, health, and creating opportunities for the next generation.",
      requiresSlides: [2]
    },
    {
      id: "q4",
      question: "How has technology democratized wealth building?",
      options: [
        "It hasn't - only rich people can invest",
        "Through lower barriers to investing, education, and global market access",
        "By making everyone automatically wealthy",
        "Only through cryptocurrency"
      ],
      correctAnswer: 1,
      explanation: "Technology has lowered investment barriers through fractional investing, provided accessible financial education, and given global market access to individual investors.",
      requiresSlides: [5]
    },
    {
      id: "q5",
      question: "What is a major responsibility that comes with wealth?",
      options: [
        "Buying as much as possible",
        "Using wealth ethically and contributing to community wellbeing",
        "Hiding wealth from others",
        "Only helping family members"
      ],
      correctAnswer: 1,
      explanation: "Wealth comes with the responsibility to use it ethically, avoid exploitation, and contribute to the broader community's wellbeing.",
      requiresSlides: [6]
    },
    {
      id: "q6",
      question: "Which wealth-building approach benefits the most people?",
      options: [
        "Individual accumulation with no sharing",
        "Building wealth communities and cooperative models",
        "Keeping all financial knowledge secret",
        "Only investing in foreign markets"
      ],
      correctAnswer: 1,
      explanation: "Building wealth communities through investment clubs, mentorship, cooperative business models, and shared financial education benefits the most people.",
      requiresSlides: [7]
    },
    {
      id: "q7",
      question: "What distinguishes responsible wealth building from exploitative wealth accumulation?",
      options: [
        "The amount of money involved",
        "Whether you pay taxes",
        "Fair treatment of others and contributing to community development",
        "The type of investments you make"
      ],
      correctAnswer: 2,
      explanation: "Responsible wealth building involves fair treatment of employees and customers, transparency, creating opportunities for others, and actively contributing to community development.",
      requiresSlides: [6]
    }
  ]
};

const financialStrategyModule: ModuleData = {
  id: "financial-strategy-planning",
  title: "Your Money Game Plan",
  description: "Smart ways to grow your money over time.",
  level: "Advanced",
  category: "Financial Basics",
  categoryIndex: 0,
  moduleIndex: 5,
  slides: [
    {
      id: "slide-1",
      type: "content",
      title: "Building Your Financial Fortress",
      layout: 'visual',
      content: `Most people drift through life financially. You're going to build a strategic plan that actually works.`,
      visualElements: {
        icon: '🏰',
        gradient: 'from-emerald-50 to-teal-100',
        cards: [
          {
            title: 'Clear Goals',
            description: 'Specific, measurable targets instead of vague wishes',
            icon: '🎯',
            color: 'blue'
          },
          {
            title: 'Smart Strategy',
            description: 'Evidence-based approach to growing wealth',
            icon: '🧠',
            color: 'green'
          },
          {
            title: 'Risk Management',
            description: 'Protect what you build from life\'s surprises',
            icon: '🛡️',
            color: 'purple'
          },
          {
            title: 'Regular Reviews',
            description: 'Adapt and improve as your life changes',
            icon: '🔄',
            color: 'orange'
          }
        ]
      }
    },
    {
      id: "slide-2",
      type: "content",
      title: "The SMART Goals Framework That Actually Works",
      layout: 'feature-cards',
      content: `Forget vague "get rich" dreams. Successful wealth building starts with goals that force you to take action.`,
      visualElements: {
        features: [
          {
            icon: '📅',
            title: 'Short-term (1-2 years)',
            description: 'Emergency fund of 3-6 months expenses, pay off high-interest debt, establish investing habit'
          },
          {
            icon: '🏠',
            title: 'Medium-term (3-10 years)',
            description: 'Home down payment, education funding, career transition fund, substantial investment portfolio'
          },
          {
            icon: '🌅',
            title: 'Long-term (10+ years)',
            description: 'Retirement independence, generational wealth, legacy planning, complete financial freedom'
          }
        ]
      }
    },
    {
      id: "slide-3",
      type: "content",
      title: "Asset Allocation: Your Money's Job Assignments",
      layout: 'grid',
      content: `Don't put all your eggs in one basket. Smart diversification reduces risk while maintaining growth potential.`,
      visualElements: {
        cards: [
          {
            title: 'Stocks (Growth Engine)',
            description: 'High growth potential with volatility. Young investors: 70-90%. Older: 40-60%.',
            icon: '📈',
            color: 'blue'
          },
          {
            title: 'Bonds (Stability Anchor)',
            description: 'Income and stability. Balances portfolio during market turbulence. 10-40% allocation.',
            icon: '🏛️',
            color: 'green'
          },
          {
            title: 'Real Estate (Inflation Shield)',
            description: 'Physical assets that appreciate and generate income. REITs for easy access.',
            icon: '🏠',
            color: 'orange'
          },
          {
            title: 'Cash (Opportunity Fund)',
            description: 'Emergency fund plus opportunities. 3-6 months expenses in high-yield savings.',
            icon: '💰',
            color: 'yellow'
          },
          {
            title: 'Alternatives (Diversifiers)',
            description: 'Commodities, crypto, private investments. 5-15% for diversification.',
            icon: '💎',
            color: 'purple'
          },
          {
            title: 'International (Global Exposure)',
            description: 'Foreign markets for geographic diversification. 20-30% of stock allocation.',
            icon: '🌍',
            color: 'indigo'
          }
        ]
      }
    },
    {
      id: "slide-4",
      type: "content",
      title: "Risk Management: Protecting Your Financial Fortress",
      layout: 'comparison',
      content: `Building wealth without protection is like building a house without insurance. One disaster wipes out years of progress.`,
      visualElements: {
        comparison: {
          before: {
            title: 'Unprotected Wealth',
            icon: '⚠️',
            items: [
              'One medical emergency = bankruptcy',
              'Job loss = immediate financial crisis',
              'Market crash = panic selling at losses',
              'Disability = income disappears forever',
              'Lawsuit = assets at risk of seizure'
            ]
          },
          after: {
            title: 'Protected Wealth',
            icon: '🛡️',
            items: [
              'Health insurance covers medical costs',
              'Emergency fund covers 6 months expenses',
              'Diversified portfolio weathers market storms',
              'Disability insurance replaces income',
              'Liability insurance protects assets'
            ]
          }
        }
      }
    },
    {
      id: "slide-5",
      type: "content",
      title: "Tax Optimization: Keep More of What You Earn",
      layout: 'grid',
      content: `Taxes are your largest lifetime expense. Smart tax planning can save you hundreds of thousands of dollars.`,
      visualElements: {
        cards: [
          {
            title: 'Tax-Advantaged Accounts',
            description: '401(k), IRA, HSA contributions reduce current taxes while building future wealth',
            icon: '🏦',
            color: 'blue'
          },
          {
            title: 'Tax-Loss Harvesting',
            description: 'Offset investment gains with losses to reduce taxable income annually',
            icon: '⚖️',
            color: 'green'
          },
          {
            title: 'Asset Location Strategy',
            description: 'Put tax-inefficient investments in tax-advantaged accounts, efficient ones in taxable',
            icon: '📍',
            color: 'purple'
          },
          {
            title: 'Roth Conversions',
            description: 'Convert traditional IRA to Roth during low-income years for tax-free future growth',
            icon: '🔄',
            color: 'orange'
          }
        ]
      }
    },
    {
      id: "slide-6",
      type: "content",
      title: "Investment Philosophy: Your North Star",
      layout: 'comparison',
      content: `Successful investing requires a consistent philosophy that keeps you disciplined during both booms and crashes.`,
      visualElements: {
        comparison: {
          before: {
            title: 'Emotional Investing',
            icon: '😰',
            items: [
              'Buy high when markets are euphoric',
              'Sell low during market panics',
              'Chase last year\'s hot investments',
              'Constantly second-guess decisions',
              'Get paralyzed by too many options'
            ]
          },
          after: {
            title: 'Strategic Investing',
            icon: '🎯',
            items: [
              'Dollar-cost average consistently',
              'Rebalance annually to target allocation',
              'Focus on low-cost index funds',
              'Ignore market noise and predictions',
              'Stay the course through all cycles'
            ]
          }
        }
      }
    },
    {
      id: "slide-7",
      type: "content",
      title: "Cash Flow Mastery: The Foundation of Wealth",
      layout: 'feature-cards',
      content: `You can't invest what you don't save. Optimizing cash flow is the engine that powers all wealth building.`,
      visualElements: {
        features: [
          {
            icon: '📊',
            title: 'Track Every Dollar',
            description: 'Use apps like Mint or YNAB to understand exactly where your money goes each month'
          },
          {
            icon: '🎯',
            title: 'Automate Savings',
            description: 'Pay yourself first - automatic transfers to savings and investment accounts'
          },
          {
            icon: '🔪',
            title: 'Strategic Spending Cuts',
            description: 'Eliminate subscriptions you don\'t use, negotiate bills, optimize major expenses'
          }
        ]
      }
    },
    {
      id: "slide-8",
      type: "content",
      title: "Behavioral Finance: Mastering Your Money Psychology",
      layout: 'visual',
      content: `Your brain is your biggest enemy in building wealth. Understanding these biases helps you make better decisions.`,
      visualElements: {
        icon: '🧠',
        gradient: 'from-red-50 to-rose-100',
        cards: [
          {
            title: 'Loss Aversion',
            description: 'We hate losing $100 more than we like gaining $100. This makes us too conservative.',
            icon: '😱',
            color: 'red'
          },
          {
            title: 'Confirmation Bias',
            description: 'We seek information that confirms our beliefs while ignoring contradictory evidence.',
            icon: '🙈',
            color: 'orange'
          },
          {
            title: 'Overconfidence',
            description: 'We overestimate our ability to predict markets and pick winning investments.',
            icon: '🦸',
            color: 'purple'
          },
          {
            title: 'Herd Mentality',
            description: 'We follow the crowd, buying high in bubbles and selling low in crashes.',
            icon: '🐑',
            color: 'blue'
          }
        ]
      }
    }
  ],
  quizPool: [
    {
      id: "q1",
      question: "What is the most important characteristic of effective financial goals?",
      options: [
        "They should be as ambitious as possible",
        "They should be specific, measurable, and time-bound",
        "They should focus only on short-term gains",
        "They should be kept secret from others"
      ],
      correctAnswer: 1,
      explanation: "SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) are more likely to be achieved because they provide clear targets and deadlines.",
      requiresSlides: [1]
    },
    {
      id: "q2",
      question: "For a young investor in their 20s, what is typically the recommended stock allocation?",
      options: [
        "20-30%",
        "40-50%",
        "70-90%",
        "100%"
      ],
      correctAnswer: 2,
      explanation: "Young investors can typically allocate 70-90% to stocks because they have decades to recover from market downturns and benefit from compound growth.",
      requiresSlides: [2]
    },
    {
      id: "q3",
      question: "What is the primary purpose of an emergency fund?",
      options: [
        "To invest in high-risk opportunities",
        "To cover 3-6 months of expenses during unexpected events",
        "To buy luxury items",
        "To speculate in the stock market"
      ],
      correctAnswer: 1,
      explanation: "An emergency fund should cover 3-6 months of expenses in easily accessible savings to protect against job loss, medical emergencies, or other unexpected costs.",
      requiresSlides: [3]
    },
    {
      id: "q4",
      question: "What is tax-loss harvesting?",
      options: [
        "Avoiding all taxes on investments",
        "Only investing in tax-free accounts",
        "Offsetting investment gains with losses to reduce taxable income",
        "Hiding investment income from the IRS"
      ],
      correctAnswer: 2,
      explanation: "Tax-loss harvesting involves selling investments at a loss to offset gains from other investments, reducing your overall taxable income.",
      requiresSlides: [4]
    },
    {
      id: "q5",
      question: "Which investment approach typically produces better long-term results?",
      options: [
        "Timing the market perfectly",
        "Following hot stock tips",
        "Dollar-cost averaging with low-cost index funds",
        "Trading frequently based on news"
      ],
      correctAnswer: 2,
      explanation: "Dollar-cost averaging with low-cost index funds typically outperforms active trading because it removes emotion, reduces costs, and captures market returns over time.",
      requiresSlides: [5]
    },
    {
      id: "q6",
      question: "What is the biggest psychological bias that hurts investors?",
      options: [
        "Being too conservative",
        "Loss aversion leading to poor timing decisions",
        "Investing too much too quickly",
        "Not researching investments enough"
      ],
      correctAnswer: 1,
      explanation: "Loss aversion causes investors to hold losing investments too long and sell winning investments too early, significantly hurting long-term returns.",
      requiresSlides: [7]
    },
    {
      id: "q7",
      question: "What is the most important factor in building wealth over time?",
      options: [
        "Picking the perfect investments",
        "Timing the market correctly",
        "Consistently saving and investing over many years",
        "Finding get-rich-quick opportunities"
      ],
      correctAnswer: 2,
      explanation: "Consistent saving and investing over many years, combined with compound growth, is the most reliable path to building substantial wealth.",
      requiresSlides: [6]
    }
  ]
};

// You can add more modules here following the same pattern
export const allModules: ModuleData[] = [
  whatIsMoneyModule,
  moneyThroughTimeModule,
  whereMoneyLivesModule,
  cryptoPlaceInMoneyModule,
  wealthEmpowermentModule,
  financialStrategyModule
  // Add more modules as they're created
];