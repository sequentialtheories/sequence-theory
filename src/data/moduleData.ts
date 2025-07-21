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

// Money as Control Module (Interactive version of Colonialism, Money & Trade)
export const moneyAsControlModule: ModuleData = {
  id: 'money-as-control',
  title: 'Money as Control',
  description: 'Discover how monetary systems have been used as tools of control throughout history.',
  level: 'Intermediate',
  category: 'Why Learning Matters',
  categoryIndex: 2,
  moduleIndex: 3,
  slides: [
    {
      id: 'slide-1',
      type: 'content',
      title: 'Money as a Tool of Control',
      layout: 'visual',
      content: `Throughout history, monetary systems and trade relationships have been weaponized as instruments of colonial control. Ready to uncover this hidden history?`,
      visualElements: {
        icon: '🚢',
        gradient: 'from-amber-50 to-orange-100',
        cards: [
          {
            title: 'Colonial Currencies',
            description: 'How empires controlled economies through money',
            icon: '👑',
            color: 'amber'
          },
          {
            title: 'Trade Dependencies',
            description: 'Creating economic relationships that benefit colonizers',
            icon: '⚓',
            color: 'blue'
          },
          {
            title: 'Modern Legacy',
            description: 'How these systems persist in new forms today',
            icon: '🏢',
            color: 'red'
          }
        ]
      }
    },
    {
      id: 'slide-2',
      type: 'content',
      title: 'The Spanish Silver Empire',
      layout: 'feature-cards',
      content: `Let's start with one of history's most devastating examples: Spanish colonial silver extraction from 1500-1800.`,
      visualElements: {
        features: [
          {
            icon: '⛏️',
            title: 'Forced Extraction',
            description: 'Indigenous people forced to mine precious metals to fund European wars'
          },
          {
            icon: '💰',
            title: 'Global Inflation',
            description: 'Massive silver influx caused worldwide price inflation and economic disruption'
          },
          {
            icon: '🔗',
            title: 'Extractive Legacy',
            description: 'Established patterns of resource extraction that continue today'
          }
        ]
      }
    },
    {
      id: 'slide-3',
      type: 'content',
      title: 'British Currency Controls',
      layout: 'comparison',
      content: `The British Empire perfected monetary control from 1600-1947. Here's how they did it:`,
      visualElements: {
        comparison: {
          before: {
            title: 'What Britain Banned',
            icon: '🚫',
            items: [
              'Colonies issuing their own currency',
              'Free trade with other nations',
              'Local banking independence',
              'Manufacturing of finished goods',
              'Technology development'
            ]
          },
          after: {
            title: 'What Britain Controlled',
            icon: '🎯',
            items: [
              'All colonial currency and banking',
              'Trade routes and partnerships',
              'Raw material extraction',
              'Manufacturing monopolies',
              'Financial institutions'
            ]
          }
        }
      }
    },
    {
      id: 'slide-4',
      type: 'content',
      title: 'The CFA Franc: Modern Colonialism',
      layout: 'visual',
      content: `Think colonial monetary control ended with independence? Meet the CFA Franc - a system that continues today.`,
      visualElements: {
        icon: '🇫🇷',
        gradient: 'from-red-50 to-pink-100',
        cards: [
          {
            title: '14 African Nations',
            description: 'Still required to use French-controlled currency',
            icon: '🌍',
            color: 'orange'
          },
          {
            title: '50% Reserves in France',
            description: 'Must keep half their money in French banks',
            icon: '🏦',
            color: 'blue'
          },
          {
            title: 'Limited Sovereignty',
            description: 'Cannot control their own monetary policy',
            icon: '⛓️',
            color: 'red'
          }
        ]
      }
    },
    {
      id: 'slide-5',
      type: 'content',
      title: 'How Trade Dependencies Work',
      layout: 'grid',
      content: `Colonial powers created economic traps that persist long after political independence:`,
      visualElements: {
        cards: [
          {
            title: 'Raw Material Trap',
            description: 'Colonies forced to export unprocessed goods, import expensive manufactured products',
            icon: '🏭',
            color: 'blue'
          },
          {
            title: 'Monoculture Economics',
            description: 'Single-crop specialization creates vulnerability to market manipulation',
            icon: '🌾',
            color: 'green'
          },
          {
            title: 'Infrastructure Control',
            description: 'Transportation and ports owned by colonial powers, limiting trade options',
            icon: '🚢',
            color: 'purple'
          },
          {
            title: 'Technology Barriers',
            description: 'Prevented industrial development to maintain dependency relationships',
            icon: '🔧',
            color: 'orange'
          }
        ]
      }
    },
    {
      id: 'slide-6',
      type: 'content',
      title: 'Modern Economic Colonialism',
      layout: 'feature-cards',
      content: `Today's economic control uses sophisticated new methods. Here are the main tools:`,
      visualElements: {
        features: [
          {
            icon: '🪤',
            title: 'Debt Trap Diplomacy',
            description: 'Unsustainable loans leading to asset seizure - like the Belt and Road Initiative'
          },
          {
            icon: '💱',
            title: 'Currency Manipulation',
            description: 'External control of exchange rates and monetary policy'
          },
          {
            icon: '🚫',
            title: 'Financial Sanctions',
            description: 'Blocking countries from international payment systems like SWIFT'
          }
        ]
      }
    },
    {
      id: 'slide-7',
      type: 'content',
      title: 'Case Study: The DRC',
      layout: 'visual',
      content: `The Democratic Republic of Congo shows how monetary colonialism evolved from direct rule to corporate extraction:`,
      visualElements: {
        icon: '🌍',
        gradient: 'from-green-50 to-emerald-100',
        cards: [
          {
            title: 'Belgian Period',
            description: 'Forced rubber extraction using currency controls',
            icon: '👑',
            color: 'amber'
          },
          {
            title: 'Modern Reality',
            description: 'Foreign corporations extract minerals with minimal local benefit',
            icon: '⛏️',
            color: 'red'
          },
          {
            title: 'Currency Reform Blocked',
            description: 'Attempts at monetary independence face international pressure',
            icon: '🚫',
            color: 'gray'
          }
        ]
      }
    },
    {
      id: 'slide-8',
      type: 'content',
      title: 'The Psychological Impact',
      layout: 'comparison',
      content: `Economic colonialism doesn't just affect money - it changes how people think about themselves and their capabilities.`,
      visualElements: {
        comparison: {
          before: {
            title: 'Individual Effects',
            icon: '🧠',
            items: [
              'Internalized inferiority complex',
              'Constant economic anxiety',
              'Dependency mindset',
              'Cultural devaluation',
              'Learned helplessness'
            ]
          },
          after: {
            title: 'Societal Impact',
            icon: '🏛️',
            items: [
              'Brain drain to dominant countries',
              'Loss of traditional knowledge',
              'Political instability',
              'Elite capture of benefits',
              'Reduced innovation capacity'
            ]
          }
        }
      }
    },
    {
      id: 'slide-9',
      type: 'content',
      title: 'Breaking Free: Paths to Independence',
      layout: 'grid',
      content: `Despite these challenges, there are real strategies for achieving economic independence:`,
      visualElements: {
        cards: [
          {
            title: 'Monetary Sovereignty',
            description: 'Independent central banking, regional currencies, digital alternatives',
            icon: '🏦',
            color: 'blue'
          },
          {
            title: 'Trade Diversification',
            description: 'South-South trade, local manufacturing, value-added exports',
            icon: '🔄',
            color: 'green'
          },
          {
            title: 'Financial Education',
            description: 'Teaching economic history, promoting literacy, encouraging cooperation',
            icon: '📚',
            color: 'purple'
          },
          {
            title: 'Technology Solutions',
            description: 'Blockchain currencies, mobile payments, decentralized finance',
            icon: '💻',
            color: 'orange'
          }
        ]
      }
    },
    {
      id: 'slide-10',
      type: 'content',
      title: 'Your Role in Economic Justice',
      layout: 'visual',
      content: `Understanding monetary colonialism empowers you to make informed decisions and support genuine economic justice.`,
      visualElements: {
        icon: '✊',
        gradient: 'from-cyan-50 to-blue-100',
        cards: [
          {
            title: 'Conscious Spending',
            description: 'Support businesses that practice fair trade and equitable partnerships',
            icon: '💳',
            color: 'green'
          },
          {
            title: 'Financial Independence',
            description: 'Build wealth that doesn\'t depend on exploitative systems',
            icon: '💰',
            color: 'blue'
          },
          {
            title: 'Spread Awareness',
            description: 'Share this knowledge to help others understand economic realities',
            icon: '📢',
            color: 'purple'
          }
        ]
      }
    }
  ],
  quizPool: [
    {
      id: 'q1',
      question: 'What was the main purpose of Spanish colonial silver extraction?',
      options: [
        'To develop local economies in the Americas',
        'To fund European wars and maintain empire',
        'To create fair trade relationships',
        'To establish modern banking systems'
      ],
      correctAnswer: 1,
      explanation: 'Spanish colonial silver extraction was primarily used to fund European wars and maintain the Spanish Empire, devastating indigenous economies in the process.',
      requiresSlides: [1]
    },
    {
      id: 'q2',
      question: 'What is the CFA Franc system?',
      options: [
        'A cryptocurrency used in Africa',
        'An independent African currency',
        'A French-controlled currency still used by 14 African nations',
        'A historical currency that no longer exists'
      ],
      correctAnswer: 2,
      explanation: 'The CFA Franc is a French-controlled currency system that 14 African nations are still required to use, with 50% of their reserves held in French banks.',
      requiresSlides: [3]
    },
    {
      id: 'q3',
      question: 'How did British currency controls create dependency?',
      options: [
        'By helping colonies develop their own banks',
        'By prohibiting colonies from issuing currency or trading freely',
        'By providing free financial education',
        'By encouraging local manufacturing'
      ],
      correctAnswer: 1,
      explanation: 'British currency controls prohibited colonies from issuing their own currency or trading freely, forcing dependence on British financial institutions and trade networks.',
      requiresSlides: [2]
    },
    {
      id: 'q4',
      question: 'What is "debt trap diplomacy"?',
      options: [
        'Helping countries reduce their debt burden',
        'Teaching financial literacy to developing nations',
        'Providing unsustainable loans that lead to asset seizure',
        'Creating fair trade agreements'
      ],
      correctAnswer: 2,
      explanation: 'Debt trap diplomacy involves providing unsustainable loans to countries, then seizing strategic assets when they cannot repay - a modern form of economic colonialism.',
      requiresSlides: [5]
    },
    {
      id: 'q5',
      question: 'What is one effective strategy for achieving economic independence?',
      options: [
        'Accepting all foreign investment unconditionally',
        'Focusing only on raw material exports',
        'Developing South-South trade relationships and local manufacturing',
        'Eliminating all international trade'
      ],
      correctAnswer: 2,
      explanation: 'Developing South-South trade relationships and building local manufacturing capacity helps reduce dependency on former colonial powers and creates more balanced economic relationships.',
      requiresSlides: [8]
    }
  ]
};

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
          },
          {
            title: 'Widely Accepted',
            description: 'Must be recognized and trusted by many people. Network effects make money more valuable as more people use it.',
            icon: '🌐',
            color: 'orange'
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
// Seventh module: "Cryptocurrencies Fundamentals"
export const cryptoFundamentalsModule: ModuleData = {
  id: 'cryptocurrencies-fundamentals',
  title: 'Crypto 101',
  description: 'What crypto is and why people are excited about it.',
  level: 'Beginner',
  category: 'Web3 & Digital Ownership',
  categoryIndex: 1,
  moduleIndex: 0,
  slides: [
    {
      id: 'slide-1',
      type: 'content',
      title: 'Welcome to the Crypto World',
      layout: 'visual',
      content: `Think of crypto as the internet's native money. Finally, money that speaks computer!`,
      visualElements: {
        icon: '⚡',
        gradient: 'from-orange-50 to-purple-100',
        cards: [
          {
            title: 'Digital Money',
            description: 'Money that exists purely as computer code',
            icon: '💻',
            color: 'blue'
          },
          {
            title: 'No Banks Needed',
            description: 'Send money directly to anyone, anywhere',
            icon: '🏦',
            color: 'green'
          },
          {
            title: 'Programmable',
            description: 'Money that can follow rules automatically',
            icon: '⚙️',
            color: 'purple'
          }
        ]
      }
    },
    {
      id: 'slide-2',
      type: 'content',
      title: 'What Makes Crypto Special?',
      layout: 'comparison',
      content: `Crypto isn't just digital money - it's a completely different approach to how money works.`,
      visualElements: {
        comparison: {
          before: {
            title: 'Traditional Money',
            icon: '🏛️',
            items: [
              'Controlled by governments & banks',
              'Need permission for transactions',
              'Closed on weekends',
              'Slow international transfers',
              'Lots of middlemen taking fees'
            ]
          },
          after: {
            title: 'Cryptocurrency',
            icon: '⚡',
            items: [
              'Controlled by computer code',
              'Permission-less transactions',
              'Works 24/7 globally',
              'Instant international transfers',
              'Direct peer-to-peer payments'
            ]
          }
        }
      }
    },
    {
      id: 'slide-3',
      type: 'content',
      title: 'The Big Players',
      layout: 'feature-cards',
      content: `Let's meet the major cryptocurrencies and what makes each one special.`,
      visualElements: {
        features: [
          {
            icon: '₿',
            title: 'Bitcoin (BTC)',
            description: 'The OG cryptocurrency. Digital gold that started it all. Store of value.'
          },
          {
            icon: 'Ξ',
            title: 'Ethereum (ETH)',
            description: 'The smart contract platform. Where most crypto apps are built.'
          },
          {
            icon: '$',
            title: 'Stablecoins',
            description: 'Crypto pegged to dollars. All the benefits, none of the wild price swings.'
          }
        ]
      }
    },
    {
      id: 'slide-4',
      type: 'content',
      title: 'Why People Use Crypto',
      layout: 'grid',
      content: `From saving money to building the future - here's why crypto matters:`,
      visualElements: {
        cards: [
          {
            title: 'Protection from Inflation',
            description: 'When governments print money, crypto can hold its value better. Bitcoin is often called "digital gold" for this reason.',
            icon: '🛡️',
            color: 'blue'
          },
          {
            title: 'Financial Freedom',
            description: 'Send money anywhere without asking permission. No bank hours, no geographic limits.',
            icon: '🗽',
            color: 'green'
          },
          {
            title: 'Innovation Platform',
            description: 'Build new financial services on programmable money. DeFi, NFTs, and more.',
            icon: '🚀',
            color: 'purple'
          },
          {
            title: 'Investment Opportunity',
            description: 'Early adoption of revolutionary technology. High risk, but potentially high reward.',
            icon: '📈',
            color: 'orange'
          }
        ]
      }
    },
    {
      id: 'slide-5',
      type: 'content',
      title: 'The Real Talk: Risks & Rewards',
      layout: 'comparison',
      content: `Crypto isn't all rainbows and lambos. Here's what you need to know:`,
      visualElements: {
        comparison: {
          before: {
            title: 'The Exciting Stuff',
            icon: '🎉',
            items: [
              'Potential for massive gains',
              'Be part of financial revolution',
              '24/7 global access',
              'No traditional banking limits',
              'Programmable money features'
            ]
          },
          after: {
            title: 'The Reality Check',
            icon: '⚠️',
            items: [
              'Prices swing wildly',
              'Regulation is still developing',
              'Easy to lose your keys (and money)',
              'Scams are everywhere',
              'Technical complexity'
            ]
          }
        }
      }
    },
    {
      id: 'slide-6',
      type: 'content',
      title: 'Getting Started Safely',
      layout: 'feature-cards',
      content: `Ready to dip your toes in? Here's how to start without getting rekt:`,
      visualElements: {
        features: [
          {
            icon: '👶',
            title: 'Start Small',
            description: 'Only invest what you can afford to lose. Seriously. Crypto is volatile.'
          },
          {
            icon: '🔒',
            title: 'Secure Your Stuff',
            description: 'Learn about wallets and private keys. "Not your keys, not your crypto."'
          },
          {
            icon: '📚',
            title: 'Educate Yourself',
            description: 'Understand what you\'re buying. Avoid FOMO and hype-driven decisions.'
          }
        ]
      }
    }
  ],
  quizPool: [
    {
      id: 'q1',
      question: 'What is the main difference between cryptocurrency and traditional money?',
      options: [
        'Crypto is always more valuable',
        'Crypto is controlled by computer code instead of governments',
        'Crypto can only be used online',
        'Crypto is free to use'
      ],
      correctAnswer: 1,
      explanation: 'The key difference is that cryptocurrencies are controlled by computer code and mathematical rules, while traditional money is controlled by governments and central banks.',
      requiresSlides: [1] // Can appear after slide 2
    },
    {
      id: 'q2',
      question: 'What is Bitcoin often called and why?',
      options: [
        'Digital silver because it\'s shiny',
        'Digital gold because it can store value over time',
        'Digital cash because it\'s fast',
        'Digital bank because it holds money'
      ],
      correctAnswer: 1,
      explanation: 'Bitcoin is called "digital gold" because many people use it as a store of value, similar to how gold has been used to preserve wealth throughout history.',
      requiresSlides: [2] // Can appear after slide 3
    },
    {
      id: 'q3',
      question: 'What makes Ethereum different from Bitcoin?',
      options: [
        'Ethereum is faster',
        'Ethereum is cheaper',
        'Ethereum can run smart contracts and apps',
        'Ethereum is more popular'
      ],
      correctAnswer: 2,
      explanation: 'Ethereum is a platform that can run smart contracts and decentralized applications (dapps), making it programmable money, while Bitcoin focuses primarily on being digital money.',
      requiresSlides: [2] // Can appear after slide 3
    },
    {
      id: 'q4',
      question: 'What are stablecoins designed to do?',
      options: [
        'Increase in value over time',
        'Stay stable in price, usually pegged to the dollar',
        'Replace Bitcoin',
        'Only work in certain countries'
      ],
      correctAnswer: 1,
      explanation: 'Stablecoins are designed to maintain a stable value, typically by being pegged to a stable asset like the US dollar, giving you crypto benefits without the wild price swings.',
      requiresSlides: [2] // Can appear after slide 3
    },
    {
      id: 'q5',
      question: 'What\'s the most important rule when starting with crypto?',
      options: [
        'Buy as much as possible immediately',
        'Only invest what you can afford to lose',
        'Always follow social media hype',
        'Focus only on the cheapest coins'
      ],
      correctAnswer: 1,
      explanation: 'The most important rule is to only invest what you can afford to lose, because cryptocurrency prices are highly volatile and you could lose your entire investment.',
      requiresSlides: [5] // Can appear after slide 6
    },
    {
      id: 'q6',
      question: 'What does "not your keys, not your crypto" mean?',
      options: [
        'You need physical keys to use crypto',
        'If you don\'t control the private keys, you don\'t truly own the crypto',
        'Keys are more important than passwords',
        'You should give your keys to exchanges'
      ],
      correctAnswer: 1,
      explanation: 'This means if someone else (like an exchange) holds your private keys, they technically control your crypto. For true ownership, you should control your own private keys.',
      requiresSlides: [5] // Can appear after slide 6
    }
  ]
};

// Eighth module: "Digital Ownership & Empowerment"
export const digitalOwnershipModule: ModuleData = {
  id: 'digital-ownership-empowerment',
  title: 'Owning Digital Stuff',
  description: 'How crypto lets you truly own things online.',
  level: 'Beginner',
  category: 'Web3 & Digital Ownership',
  categoryIndex: 1,
  moduleIndex: 1,
  slides: [
    {
      id: 'slide-1',
      type: 'content',
      title: 'You Don\'t Own Anything Online... Yet',
      layout: 'visual',
      content: `Your Spotify playlists, game skins, social media - you think you own them, but you don't. You're just renting!`,
      visualElements: {
        icon: '👑',
        gradient: 'from-purple-50 to-pink-100',
        cards: [
          {
            title: 'Digital Rentals',
            description: 'Everything online is actually just licensed to you',
            icon: '📄',
            color: 'red'
          },
          {
            title: 'Platform Control',
            description: 'Companies can take away your "stuff" anytime',
            icon: '🏢',
            color: 'orange'
          },
          {
            title: 'True Ownership',
            description: 'Crypto changes this - you can actually own digital things',
            icon: '🔑',
            color: 'green'
          }
        ]
      }
    },
    {
      id: 'slide-2',
      type: 'content',
      title: 'Web 1.0 → 2.0 → 3.0: The Evolution',
      layout: 'feature-cards',
      content: `The internet evolved from reading, to interacting, to owning. We're entering the ownership era!`,
      visualElements: {
        features: [
          {
            icon: '📖',
            title: 'Web 1.0: Read Only',
            description: 'Static websites. You could only read information. Like digital newspapers.'
          },
          {
            icon: '✍️',
            title: 'Web 2.0: Read + Write',
            description: 'Social media born! You could create content, but platforms owned everything.'
          },
          {
            icon: '👑',
            title: 'Web 3.0: Read + Write + Own',
            description: 'Blockchain enables true ownership. You control your data and digital assets.'
          }
        ]
      }
    },
    {
      id: 'slide-3',
      type: 'content',
      title: 'Traditional vs. True Digital Ownership',
      layout: 'comparison',
      content: `The difference between renting and owning in the digital world is huge.`,
      visualElements: {
        comparison: {
          before: {
            title: 'Traditional "Ownership"',
            icon: '🏢',
            items: [
              'You get a license, not ownership',
              'Platform can revoke access anytime',
              'Can\'t sell or transfer your assets',
              'Dependent on company policies',
              'No real control over your stuff'
            ]
          },
          after: {
            title: 'True Digital Ownership',
            icon: '🔑',
            items: [
              'You hold the cryptographic keys',
              'Independent of any platform',
              'Freely trade and transfer assets',
              'You set the rules',
              'Complete control and sovereignty'
            ]
          }
        }
      }
    },
    {
      id: 'slide-4',
      type: 'content',
      title: 'What Can You Actually Own?',
      layout: 'grid',
      content: `NFTs (Non-Fungible Tokens) let you own unique digital items:`,
      visualElements: {
        cards: [
          {
            title: 'Digital Art & Media',
            description: 'Own unique artwork, music, videos. Artists sell directly to you, no middlemen taking huge cuts.',
            icon: '🎨',
            color: 'purple'
          },
          {
            title: 'Gaming Assets',
            description: 'Own game characters, weapons, skins that work across games. Finally, your items have real value.',
            icon: '🎮',
            color: 'blue'
          },
          {
            title: 'Virtual Real Estate',
            description: 'Buy land in digital worlds. Build, rent, or develop it. Some virtual plots sold for millions!',
            icon: '🏘️',
            color: 'green'
          },
          {
            title: 'Identity & Access',
            description: 'Own your digital identity, certificates, memberships. Prove who you are without relying on others.',
            icon: '🎓',
            color: 'orange'
          }
        ]
      }
    },
    {
      id: 'slide-5',
      type: 'content',
      title: 'The Power of True Ownership',
      layout: 'feature-cards',
      content: `When you truly own digital assets, amazing things become possible:`,
      visualElements: {
        features: [
          {
            icon: '💰',
            title: 'Make Money',
            description: 'Sell, rent, or earn royalties from your digital assets. Turn your online activity into income.'
          },
          {
            icon: '🌍',
            title: 'Use Everywhere',
            description: 'Take your assets between platforms and games. Your sword works in multiple games!'
          },
          {
            icon: '🔧',
            title: 'Program Them',
            description: 'Add smart contracts to your assets. Automatic royalties, rental agreements, or special behaviors.'
          }
        ]
      }
    },
    {
      id: 'slide-6',
      type: 'content',
      title: 'Getting Started with Digital Ownership',
      layout: 'comparison',
      content: `There are different ways to manage your digital assets. Choose what fits your comfort level:`,
      visualElements: {
        comparison: {
          before: {
            title: 'Custodial (Easy Mode)',
            icon: '🏦',
            items: [
              'Company holds your keys for you',
              'Like a bank account - familiar',
              'Easy recovery if you forget password',
              'Examples: Coinbase, Binance',
              'Good for beginners'
            ]
          },
          after: {
            title: 'Self-Custodial (True Ownership)',
            icon: '🔑',
            items: [
              'You hold your own keys',
              'Complete control over assets',
              'No one can freeze your account',
              'Examples: MetaMask, Ledger',
              'More responsibility, more freedom'
            ]
          }
        }
      }
    }
  ],
  quizPool: [
    {
      id: 'q1',
      question: 'What\'s the key difference between Web 2.0 and Web 3.0?',
      options: [
        'Web 3.0 is faster',
        'Web 3.0 adds true digital ownership',
        'Web 3.0 has better graphics',
        'Web 3.0 is more expensive'
      ],
      correctAnswer: 1,
      explanation: 'Web 3.0 adds the concept of true digital ownership through blockchain technology, allowing users to actually own their digital assets rather than just licensing them.',
      requiresSlides: [1] // Can appear after slide 2
    },
    {
      id: 'q2',
      question: 'In traditional digital platforms, what do you actually own?',
      options: [
        'Everything you create and buy',
        'Only the content you pay for',
        'Just a license to use things',
        'Your account and password'
      ],
      correctAnswer: 2,
      explanation: 'In traditional digital platforms, you typically only get a license to use content and services. The platforms retain actual ownership and can revoke your access.',
      requiresSlides: [2] // Can appear after slide 3
    },
    {
      id: 'q3',
      question: 'What are NFTs primarily used for?',
      options: [
        'Making payments faster',
        'Proving ownership of unique digital items',
        'Storing large files',
        'Mining cryptocurrency'
      ],
      correctAnswer: 1,
      explanation: 'NFTs (Non-Fungible Tokens) are primarily used to prove ownership of unique digital items like art, collectibles, gaming assets, and other digital goods.',
      requiresSlides: [3] // Can appear after slide 4
    },
    {
      id: 'q4',
      question: 'What can you do with truly owned digital assets that you can\'t with traditional "owned" digital items?',
      options: [
        'Use them offline',
        'Sell and transfer them freely',
        'Make them load faster',
        'Change their color'
      ],
      correctAnswer: 1,
      explanation: 'With true digital ownership, you can sell, transfer, and trade your assets freely, unlike traditional digital items where you only have a license that can\'t be transferred.',
      requiresSlides: [4] // Can appear after slide 5
    },
    {
      id: 'q5',
      question: 'What\'s the main advantage of self-custodial wallets over custodial ones?',
      options: [
        'They\'re easier to use',
        'They\'re completely free',
        'You have complete control over your assets',
        'They work faster'
      ],
      correctAnswer: 2,
      explanation: 'Self-custodial wallets give you complete control over your assets because you hold the private keys. No one can freeze your account or prevent you from accessing your assets.',
      requiresSlides: [5] // Can appear after slide 6
    },
    {
      id: 'q6',
      question: 'What does "interoperability" mean for digital assets?',
      options: [
        'They can be copied easily',
        'They work across different platforms and games',
        'They\'re cheaper to buy',
        'They load faster'
      ],
      correctAnswer: 1,
      explanation: 'Interoperability means your digital assets can work across different platforms and games. For example, a sword you own could potentially be used in multiple different games.',
      requiresSlides: [4] // Can appear after slide 5
    }
  ]
};

// Ninth module: "Tokens & Tokenization"
export const tokensTokenizationModule: ModuleData = {
  id: 'tokens-tokenization',
  title: 'Digital Tokens Explained',
  description: 'Different types of digital tokens and what they do.',
  level: 'Intermediate',
  category: 'Web3 & Digital Ownership',
  categoryIndex: 1,
  moduleIndex: 2,
  slides: [
    {
      id: 'slide-1',
      type: 'content',
      title: 'Welcome to the Token Universe',
      layout: 'visual',
      content: `Tokens are like digital Lego blocks - you can build almost anything with them!`,
      visualElements: {
        icon: '🪙',
        gradient: 'from-blue-50 to-cyan-100',
        cards: [
          {
            title: 'Digital Assets',
            description: 'Represent anything valuable in digital form',
            icon: '💎',
            color: 'blue'
          },
          {
            title: 'Programmable',
            description: 'Can follow rules and execute automatically',
            icon: '⚙️',
            color: 'purple'
          },
          {
            title: 'Transferable',
            description: 'Send them anywhere in the world instantly',
            icon: '🌍',
            color: 'green'
          }
        ]
      }
    },
    {
      id: 'slide-2',
      type: 'content',
      title: 'Tokens vs Cryptocurrencies',
      layout: 'comparison',
      content: `Most people think they're the same thing, but there's an important difference!`,
      visualElements: {
        comparison: {
          before: {
            title: 'Cryptocurrencies',
            icon: '₿',
            items: [
              'Have their own blockchain (Bitcoin, Ethereum)',
              'Primary purpose: be money',
              'Secure their own network',
              'Examples: BTC, ETH, LTC',
              'Need miners/validators'
            ]
          },
          after: {
            title: 'Tokens',
            icon: '🪙',
            items: [
              'Built on existing blockchains',
              'Can represent anything',
              'Use host blockchain security',
              'Examples: USDC, UNI, NFTs',
              'Created via smart contracts'
            ]
          }
        }
      }
    },
    {
      id: 'slide-3',
      type: 'content',
      title: 'The Token Family Tree',
      layout: 'grid',
      content: `Different types of tokens for different purposes:`,
      visualElements: {
        cards: [
          {
            title: 'Utility Tokens',
            description: 'Access passes to services. Like buying arcade tokens to play games, but for DeFi platforms.',
            icon: '🎟️',
            color: 'orange'
          },
          {
            title: 'Security Tokens',
            description: 'Digital shares in real companies or assets. Think stocks, but on the blockchain.',
            icon: '📊',
            color: 'blue'
          },
          {
            title: 'Governance Tokens',
            description: 'Voting rights in crypto projects. Your voice in how protocols evolve and spend money.',
            icon: '🗳️',
            color: 'purple'
          },
          {
            title: 'NFTs (Non-Fungible)',
            description: 'Unique digital collectibles. Each one is different, like trading cards or art pieces.',
            icon: '🎨',
            color: 'pink'
          }
        ]
      }
    },
    {
      id: 'slide-4',
      type: 'content',
      title: 'Tokenization: Turning Real Stuff Digital',
      layout: 'feature-cards',
      content: `Take anything valuable and turn it into tokens that anyone can own pieces of:`,
      visualElements: {
        features: [
          {
            icon: '🏠',
            title: 'Real Estate',
            description: 'Buy $100 worth of a $1M house. Finally, real estate investing for normal people.'
          },
          {
            icon: '🎨',
            title: 'Art & Collectibles',
            description: 'Own a piece of a Picasso or rare baseball card. Art investing without millions.'
          },
          {
            icon: '💰',
            title: 'Business Revenue',
            description: 'Get paid when companies make money. Buy tokens that earn you royalties.'
          }
        ]
      }
    },
    {
      id: 'slide-5',
      type: 'content',
      title: 'Why Tokenization is Revolutionary',
      layout: 'grid',
      content: `It solves problems that have existed for centuries:`,
      visualElements: {
        cards: [
          {
            title: 'Fractional Ownership',
            description: 'Can\'t afford a whole Lamborghini? Buy 1/1000th of one. Now anyone can invest in expensive assets.',
            icon: '🧩',
            color: 'green'
          },
          {
            title: 'Global Access',
            description: 'Japanese person wants to own US real estate? No problem. Tokens make everything globally accessible.',
            icon: '🌍',
            color: 'blue'
          },
          {
            title: 'Instant Liquidity',
            description: 'Need to sell your real estate investment? With tokens, it\'s as easy as selling crypto.',
            icon: '⚡',
            color: 'yellow'
          },
          {
            title: 'Transparent Ownership',
            description: 'Blockchain shows exactly who owns what. No more shady ownership disputes or fake documents.',
            icon: '👁️',
            color: 'purple'
          }
        ]
      }
    },
    {
      id: 'slide-6',
      type: 'content',
      title: 'Token Standards: The Rules of the Game',
      layout: 'comparison',
      content: `Different blockchains have different rules for how tokens work:`,
      visualElements: {
        comparison: {
          before: {
            title: 'Ethereum Token Standards',
            icon: 'Ξ',
            items: [
              'ERC-20: Regular tokens (like USDC)',
              'ERC-721: NFTs (unique items)',
              'ERC-1155: Multi-token (gaming)',
              'Most popular and established',
              'Higher fees but more features'
            ]
          },
          after: {
            title: 'Other Blockchain Standards',
            icon: '🔗',
            items: [
              'BEP-20: Binance Smart Chain',
              'SPL: Solana tokens',
              'TRC-20: TRON tokens',
              'Usually cheaper to use',
              'Different trade-offs and features'
            ]
          }
        }
      }
    }
  ],
  quizPool: [
    {
      id: 'q1',
      question: 'What\'s the main difference between tokens and cryptocurrencies?',
      options: [
        'Tokens are more expensive',
        'Cryptocurrencies have their own blockchain, tokens are built on existing ones',
        'Tokens are only for NFTs',
        'There is no difference'
      ],
      correctAnswer: 1,
      explanation: 'Cryptocurrencies like Bitcoin have their own blockchain, while tokens are built on existing blockchains using smart contracts.',
      requiresSlides: [1] // Can appear after slide 2
    },
    {
      id: 'q2',
      question: 'What are utility tokens primarily used for?',
      options: [
        'Voting in elections',
        'Accessing services on platforms',
        'Storing files',
        'Mining new blocks'
      ],
      correctAnswer: 1,
      explanation: 'Utility tokens provide access to services or platforms, like arcade tokens that let you play games, but for digital services.',
      requiresSlides: [2] // Can appear after slide 3
    },
    {
      id: 'q3',
      question: 'What makes NFTs different from other tokens?',
      options: [
        'They\'re more expensive',
        'They\'re unique and non-fungible',
        'They only work on Ethereum',
        'They can\'t be transferred'
      ],
      correctAnswer: 1,
      explanation: 'NFTs are non-fungible, meaning each one is unique and different, unlike regular tokens where each unit is identical and interchangeable.',
      requiresSlides: [2] // Can appear after slide 3
    },
    {
      id: 'q4',
      question: 'What is tokenization?',
      options: [
        'Creating new blockchains',
        'Converting real-world assets into digital tokens',
        'Mining cryptocurrency',
        'Building smart contracts'
      ],
      correctAnswer: 1,
      explanation: 'Tokenization is the process of converting real-world assets (like real estate or art) into digital tokens that can be owned and traded.',
      requiresSlides: [3] // Can appear after slide 4
    },
    {
      id: 'q5',
      question: 'What problem does fractional ownership through tokens solve?',
      options: [
        'Making transactions faster',
        'Allowing people to own pieces of expensive assets',
        'Reducing gas fees',
        'Creating new cryptocurrencies'
      ],
      correctAnswer: 1,
      explanation: 'Fractional ownership allows people to buy small pieces of expensive assets like real estate or art, making investing accessible to everyone.',
      requiresSlides: [4] // Can appear after slide 5
    },
    {
      id: 'q6',
      question: 'What is ERC-20?',
      options: [
        'A new cryptocurrency',
        'A standard for creating regular tokens on Ethereum',
        'A type of NFT',
        'A blockchain protocol'
      ],
      correctAnswer: 1,
      explanation: 'ERC-20 is the most common standard for creating regular (fungible) tokens on the Ethereum blockchain, like USDC or UNI.',
      requiresSlides: [5] // Can appear after slide 6
    }
  ]
};

const blockchainTechnologyModule: ModuleData = {
  id: "blockchain-technology-deep-dive",
  title: "How Blockchain Works",
  description: "The technology that makes crypto possible (without the confusing tech talk).",
  level: "Intermediate",
  category: "Web3 & Digital Ownership",
  categoryIndex: 1,
  moduleIndex: 3,
  slides: [
    {
      id: "slide-1",
      type: "content",
      title: "Understanding Blockchain",
      layout: 'visual',
      content: `Blockchain is a revolutionary distributed ledger technology that maintains a continuously growing list of records, called blocks, which are cryptographically linked and secured across a global network.

Think of blockchain as a digital ledger book that's copied across thousands of computers worldwide. Every transaction gets recorded in this book, and all computers must agree on what happened before it becomes permanent.`,
      visualElements: {
        icon: '🔗',
        gradient: 'from-indigo-50 to-purple-100',
        cards: [
          { icon: '🌐', title: 'Distributed', description: 'No single point of control or failure', color: 'blue' },
          { icon: '👁️', title: 'Transparent', description: 'All transactions are publicly visible', color: 'cyan' },
          { icon: '🔒', title: 'Immutable', description: 'Once recorded, data cannot be easily changed', color: 'indigo' },
          { icon: '🛡️', title: 'Secure', description: 'Uses advanced cryptographic protection', color: 'purple' }
        ]
      }
    },
    {
      id: "slide-2",
      type: "content",
      title: "How Blocks Are Created",
      layout: 'feature-cards',
      content: `Understanding the process of how new blocks are added to the blockchain is crucial to grasping how the technology works. This process involves several key steps that ensure the integrity and security of the network.`,
      visualElements: {
        icon: '⛓️',
        gradient: 'from-emerald-50 to-green-100',
        features: [
          { title: 'Transaction Pool', description: 'New transactions wait in a mempool', icon: '📥' },
          { title: 'Block Formation', description: 'Miners/validators select transactions to include', icon: '🔧' },
          { title: 'Consensus', description: 'Proof of Work/Stake validates the block', icon: '✅' },
          { title: 'Block Addition', description: 'Validated block is added to the chain', icon: '⛓️' },
          { title: 'Network Sync', description: 'All nodes update their copy', icon: '🔄' }
        ]
      }
    },
    {
      id: "slide-3",
      type: "content",
      title: "Consensus Mechanisms",
      layout: 'comparison',
      content: `Consensus mechanisms are protocols that ensure all nodes in a blockchain network agree on the current state of the ledger. Different mechanisms have different trade-offs between security, scalability, and decentralization.`,
      visualElements: {
        icon: '🎯',
        gradient: 'from-orange-50 to-red-100',
        comparison: {
          before: {
            title: 'Proof of Work (PoW)',
            items: ['High security', 'Battle-tested', 'Truly decentralized', 'High energy consumption', 'Slower transactions'],
            icon: '⚒️'
          },
          after: {
            title: 'Proof of Stake (PoS)',
            items: ['Energy efficient', 'Faster finality', 'Economic penalties', 'Rich get richer', 'Nothing at stake problem'],
            icon: '🎯'
          }
        }
      }
    },
    {
      id: "slide-4",
      type: "content",
      title: "Hash Functions & Cryptography",
      layout: 'visual',
      content: `Cryptographic hash functions are the mathematical foundation that secures blockchain networks. They create unique digital fingerprints for data and enable the tamper-evident properties of blockchain.`,
      visualElements: {
        icon: '🔐',
        gradient: 'from-violet-50 to-purple-100',
        cards: [
          { icon: '🔐', title: 'Cryptographic Hashing', description: 'Creates unique fingerprints for data', color: 'violet' },
          { icon: '🔢', title: 'SHA-256', description: 'The hashing algorithm used by Bitcoin', color: 'purple' },
          { icon: '🌳', title: 'Merkle Trees', description: 'Efficiently organize and verify transactions', color: 'indigo' },
          { icon: '✍️', title: 'Digital Signatures', description: 'Prove ownership and authorize transactions', color: 'blue' }
        ]
      }
    },
    {
      id: "slide-5",
      type: "content",
      title: "Types of Blockchain Networks",
      layout: 'visual',
      content: `Different types of blockchain networks serve different purposes. Understanding the distinctions between public, private, consortium, and hybrid blockchains is essential for choosing the right solution.`,
      visualElements: {
        icon: '🌍',
        gradient: 'from-teal-50 to-cyan-100',
        cards: [
          { icon: '🌍', title: 'Public Blockchains', description: 'Open to everyone (Bitcoin, Ethereum)', color: 'blue' },
          { icon: '🏢', title: 'Private Blockchains', description: 'Restricted access for organizations', color: 'purple' },
          { icon: '👥', title: 'Consortium Blockchains', description: 'Semi-decentralized, controlled by groups', color: 'green' },
          { icon: '🔄', title: 'Hybrid Blockchains', description: 'Combination of public and private elements', color: 'orange' }
        ]
      }
    },
    {
      id: "slide-6",
      type: "content",
      title: "Smart Contracts",
      layout: 'visual',
      content: `Smart contracts are self-executing contracts with terms directly written into code. They automatically execute when predetermined conditions are met, eliminating the need for intermediaries.`,
      visualElements: {
        icon: '📝',
        gradient: 'from-amber-50 to-yellow-100',
        cards: [
          { icon: '⚡', title: 'Automated Execution', description: 'Run automatically when conditions are met', color: 'amber' },
          { icon: '🤝', title: 'Trustless', description: 'No need to trust intermediaries', color: 'yellow' },
          { icon: '💰', title: 'Programmable Money', description: 'Enable complex financial instruments', color: 'orange' },
          { icon: '🔐', title: 'Immutable Logic', description: 'Contract terms cannot be changed once deployed', color: 'red' }
        ]
      }
    }
  ],
  quizPool: [
    {
      id: 'blockchain-immutable',
      question: 'What is the main characteristic that makes blockchain immutable?',
      options: [
        'It uses encryption',
        'Blocks are cryptographically linked and distributed across many nodes',
        'It runs on the internet',
        'It stores data digitally'
      ],
      correctAnswer: 1,
      explanation: 'Blockchain immutability comes from the cryptographic linking of blocks and their distribution across many nodes, making it extremely difficult to alter historical records.',
      requiresSlides: [1]
    },
    {
      id: 'consensus-efficiency',
      question: 'Which consensus mechanism is more energy efficient?',
      options: [
        'Proof of Work',
        'Proof of Stake', 
        'Both are equally efficient',
        'Neither uses energy'
      ],
      correctAnswer: 1,
      explanation: 'Proof of Stake is significantly more energy efficient than Proof of Work because it doesn\'t require computational mining.',
      requiresSlides: [3]
    },
    {
      id: 'smart-contracts',
      question: 'What is a key feature of smart contracts?',
      options: [
        'They require human intervention to execute',
        'They can be easily modified after deployment',
        'They execute automatically when conditions are met',
        'They only work on private blockchains'
      ],
      correctAnswer: 2,
      explanation: 'Smart contracts automatically execute when predetermined conditions are met, without requiring human intervention.',
      requiresSlides: [6]
    },
    {
      id: 'blockchain-trilemma',
      question: 'The blockchain trilemma refers to the difficulty of optimizing:',
      options: [
        'Speed, cost, and security',
        'Decentralization, security, and scalability',
        'Privacy, transparency, and efficiency',
        'Mining, staking, and voting'
      ],
      correctAnswer: 1,
      explanation: 'The blockchain trilemma describes the challenge of simultaneously optimizing decentralization, security, and scalability in blockchain networks.',
      requiresSlides: [3]
    },
    {
      id: 'blockchain-types',
      question: 'What makes public blockchains different from private ones?',
      options: [
        'Public blockchains are faster',
        'Private blockchains are more secure',
        'Public blockchains are open to everyone, private ones have restricted access',
        'There is no difference'
      ],
      correctAnswer: 2,
      explanation: 'Public blockchains are permissionless and open to anyone, while private blockchains have restricted access and are controlled by organizations.',
      requiresSlides: [5]
    }
  ]
};

// DeFi: Banking Without Banks module
export const defiBankingModule: ModuleData = {
  id: 'decentralized-finance-defi',
  title: 'DeFi: Banking Without Banks',
  description: 'Lending, borrowing, and trading - all without traditional banks.',
  level: 'Advanced',
  category: 'Web3 & Digital Ownership',
  categoryIndex: 1,
  moduleIndex: 4,
  slides: [
    {
      id: 'slide-1',
      type: 'content',
      title: 'What Is DeFi Really?',
      layout: 'comparison',
      content: `DeFi stands for Decentralized Finance - it's like having all banking services run by computer programs instead of banks.`,
      visualElements: {
        comparison: {
          before: {
            title: 'Traditional Banking',
            icon: '🏦',
            items: [
              'Big building with employees handling your money',
              'You trust them to keep savings safe',
              'They control when you can access funds',
              'High fees and limited access',
              'Centralized control over your money'
            ]
          },
          after: {
            title: 'DeFi (Decentralized Finance)',
            icon: '🌐',
            items: [
              'Computer programs (smart contracts) handle everything',
              'No building, no employees - just code',
              'You control your own money 24/7',
              'Lower fees and global access',
              'Transparent and open to everyone'
            ]
          }
        }
      }
    },
    {
      id: 'slide-2',
      type: 'content',
      title: 'Why Decentralizing Banks Is Revolutionary',
      layout: 'comparison',
      content: `Traditional banks have several problems that DeFi solves completely.`,
      visualElements: {
        comparison: {
          before: {
            title: 'Problems with Traditional Banks',
            icon: '⚠️',
            items: [
              'They control your money and can freeze accounts',
              'High fees with poor returns (nearly 0% savings interest)',
              'Billions excluded due to location or documentation',
              'Slow, expensive international transfers',
              'Limited hours and outdated systems'
            ]
          },
          after: {
            title: 'How DeFi Solves These',
            icon: '✅',
            items: [
              'You own your money with private keys - no freezing',
              'Better returns, lower costs (no middleman markup)',
              'Global access with just internet and smartphone',
              'Instant, cheap transactions that work 24/7',
              'Transparent code everyone can verify'
            ]
          }
        }
      }
    },
    {
      id: 'slide-3',
      type: 'content',
      title: 'Real-World Impact Stories',
      layout: 'grid',
      content: `Here's how DeFi is already changing lives around the world:`,
      visualElements: {
        cards: [
          {
            title: 'Remittances Revolution',
            description: 'Maria sends $200 from US to El Salvador. Traditional: $20 fees, 3 days. DeFi: Under $5, arrives in minutes.',
            icon: '💸',
            color: 'blue'
          },
          {
            title: 'Better Savings Returns',
            description: 'Ahmed earns 6% APY on stablecoins through DeFi vs 0.5% at his bank during 8% inflation.',
            icon: '💰',
            color: 'green'
          },
          {
            title: 'Financial Inclusion',
            description: 'Priya uses her crypto as collateral for business loans when banks denied her due to lack of credit history.',
            icon: '🏪',
            color: 'purple'
          },
          {
            title: 'Innovation Without Permission',
            description: 'Developers build new financial products without asking banks for approval, creating rapid innovation.',
            icon: '🚀',
            color: 'orange'
          }
        ]
      }
    },
    {
      id: 'slide-4',
      type: 'content',
      title: 'Staking: Earning Rewards for Helping Networks',
      layout: 'feature-cards',
      content: `Staking is like putting money in a special savings account that helps keep blockchain networks secure.`,
      visualElements: {
        features: [
          {
            icon: '🔒',
            title: 'What Is Staking?',
            description: 'Lock up your digital assets to help validate transactions. Like a time-locked safe that pays you interest for helping secure the network.'
          },
          {
            icon: '🛡️',
            title: 'Why Networks Need You',
            description: 'Stakers verify transactions are legitimate. Put your money at risk as security deposit - honest stakers get rewarded, cheaters lose their stake.'
          },
          {
            icon: '💎',
            title: 'Types of Staking',
            description: 'Direct staking (you do it), delegated staking (professionals do it), or liquid staking (stake but keep trading ability).'
          }
        ]
      }
    },
    {
      id: 'slide-5',
      type: 'content',
      title: 'Liquidity Farming: Being the Bank',
      layout: 'visual',
      content: `Liquidity farming is like starting a currency exchange booth - you provide the money for others to trade and earn fees.`,
      visualElements: {
        icon: '🌾',
        gradient: 'from-yellow-50 to-orange-100',
        cards: [
          {
            title: 'How It Works',
            description: 'Deposit two tokens in equal amounts (like $100 ETH + $100 USDC) into a trading pool',
            icon: '⚖️',
            color: 'yellow'
          },
          {
            title: 'Earn Trading Fees',
            description: 'When people trade between your tokens, they pay small fees that get distributed to liquidity providers',
            icon: '💰',
            color: 'green'
          },
          {
            title: 'Bonus Rewards',
            description: 'Many protocols give extra reward tokens on top of trading fees to encourage liquidity provision',
            icon: '🎁',
            color: 'purple'
          },
          {
            title: 'Impermanent Loss Risk',
            description: 'If token prices change differently, you might end up with less value than just holding the tokens',
            icon: '⚠️',
            color: 'red'
          }
        ]
      }
    },
    {
      id: 'slide-6',
      type: 'content',
      title: 'DeFi Protocols You Should Know',
      layout: 'grid',
      content: `Here are the major DeFi protocols and what they do:`,
      visualElements: {
        cards: [
          {
            title: 'Uniswap',
            description: 'The biggest decentralized exchange - trade any token without a centralized exchange',
            icon: '🦄',
            color: 'pink'
          },
          {
            title: 'AAVE',
            description: 'Lending and borrowing protocol - earn interest on deposits or borrow against crypto collateral',
            icon: '👻',
            color: 'blue'
          },
          {
            title: 'Compound',
            description: 'Automated lending protocol that adjusts interest rates based on supply and demand',
            icon: '🏛️',
            color: 'green'
          },
          {
            title: 'MakerDAO',
            description: 'Creates DAI stablecoin backed by crypto collateral - decentralized dollar alternative',
            icon: '🎭',
            color: 'orange'
          },
          {
            title: 'Curve',
            description: 'Specialized exchange for stablecoins and similar assets with minimal slippage',
            icon: '📈',
            color: 'purple'
          },
          {
            title: 'Yearn Finance',
            description: 'Automated yield farming - finds the best returns and moves your money automatically',
            icon: '🌾',
            color: 'indigo'
          }
        ]
      }
    }
  ],
  quizPool: [
    {
      id: 'q1',
      question: 'What is the main difference between traditional banking and DeFi?',
      options: [
        'DeFi is only for wealthy people',
        'DeFi uses computer programs (smart contracts) instead of human employees',
        'DeFi is more expensive than traditional banking',
        'DeFi only works in certain countries'
      ],
      correctAnswer: 1,
      explanation: 'DeFi uses smart contracts (automated computer programs) to handle financial services instead of relying on human employees and centralized institutions.',
      requiresSlides: [0]
    },
    {
      id: 'q2',
      question: 'What is staking in the context of DeFi?',
      options: [
        'Buying stakes in traditional companies',
        'Locking up digital assets to help secure a blockchain network and earn rewards',
        'A type of cryptocurrency trading strategy',
        'Converting crypto back to traditional currency'
      ],
      correctAnswer: 1,
      explanation: 'Staking involves locking up your digital assets to help validate transactions on a blockchain network. In return, you earn rewards, similar to earning interest on a savings account.',
      requiresSlides: [3]
    },
    {
      id: 'q3',
      question: 'What is "impermanent loss" in liquidity farming?',
      options: [
        'A permanent loss of all your money',
        'The risk that token prices might change differently, resulting in less value than just holding the tokens',
        'A fee charged by DeFi protocols',
        'The loss of internet connection during farming'
      ],
      correctAnswer: 1,
      explanation: 'Impermanent loss occurs when the prices of tokens in a liquidity pool change relative to when you deposited them. You might end up with less value than if you had just held the tokens separately.',
      requiresSlides: [4]
    },
    {
      id: 'q4',
      question: 'Which protocol is known for creating the DAI stablecoin?',
      options: [
        'Uniswap',
        'AAVE',
        'MakerDAO',
        'Compound'
      ],
      correctAnswer: 2,
      explanation: 'MakerDAO is the protocol that creates and manages DAI, a decentralized stablecoin backed by crypto collateral rather than traditional bank reserves.',
      requiresSlides: [5]
    },
    {
      id: 'q5',
      question: 'How does DeFi solve the problem of financial exclusion?',
      options: [
        'By requiring more documentation than traditional banks',
        'By only working in developed countries',
        'By providing global access to anyone with internet and a smartphone',
        'By charging higher fees than traditional banks'
      ],
      correctAnswer: 2,
      explanation: 'DeFi provides financial services to anyone with internet access and a smartphone, eliminating geographic restrictions, documentation requirements, and minimum balance restrictions that exclude billions from traditional banking.',
      requiresSlides: [1, 2]
    }
  ]
};

// Advanced Web3 Innovations module
export const advancedWeb3Module: ModuleData = {
  id: 'advanced-web3-innovations',
  title: 'Next-Level Crypto Stuff',
  description: 'Staking, yield farming, and the latest crypto innovations.',
  level: 'Expert',
  category: 'Web3 & Digital Ownership',
  categoryIndex: 1,
  moduleIndex: 5,
  slides: [
    {
      id: 'slide-1',
      type: 'content',
      title: 'Cutting-Edge Web3 Innovations',
      layout: 'visual',
      content: `The Web3 ecosystem is rapidly evolving with sophisticated financial instruments and technological innovations. This expert-level module explores advanced concepts including staking mechanisms, lending protocols, meme coin dynamics, and sophisticated DeFi strategies that are reshaping the digital economy. We'll dive deep into the bleeding edge of blockchain technology.`,
      visualElements: {
        icon: '🚀',
        gradient: 'from-violet-50 to-purple-100',
        cards: [
          {
            title: 'Advanced Staking',
            description: 'Liquid staking, restaking, and validator-as-a-service for institutional investors',
            icon: '🔒',
            color: 'green'
          },
          {
            title: 'Sophisticated Lending',
            description: 'Flash loans, credit delegation, and cross-chain lending protocols',
            icon: '💰',
            color: 'blue'
          },
          {
            title: 'MEV & Arbitrage',
            description: 'Maximal extractable value, front-running, and sandwich attacks',
            icon: '⚡',
            color: 'orange'
          },
          {
            title: 'Social Finance',
            description: 'Meme coins, viral marketing, and community-driven token economies',
            icon: '📈',
            color: 'pink'
          }
        ]
      }
    },
    {
      id: 'slide-2',
      type: 'content',
      title: 'Advanced Staking Mechanisms',
      layout: 'grid',
      content: `Staking has evolved beyond simple token lockup to include complex mechanisms for network security and governance. These innovations allow for more flexible and profitable staking strategies while maintaining network security.`,
      visualElements: {
        cards: [
          {
            title: 'Liquid Staking',
            description: 'Stake tokens while maintaining liquidity through derivative tokens. Protocols like Lido allow you to stake ETH and receive stETH, which can be traded or used in DeFi while still earning staking rewards.',
            icon: '🌊',
            color: 'blue'
          },
          {
            title: 'Restaking (EigenLayer)',
            description: 'Use already-staked ETH to secure additional protocols and earn extra rewards. This creates composable security where one stake secures multiple networks.',
            icon: '🏗️',
            color: 'purple'
          },
          {
            title: 'Validator-as-a-Service',
            description: 'Professional staking services for institutional investors who want staking rewards without technical complexity. Companies like Coinbase and Kraken offer these services.',
            icon: '🏢',
            color: 'green'
          },
          {
            title: 'Multi-Asset Staking',
            description: 'Protocols that allow staking multiple different tokens in a single platform, optimizing returns across various networks simultaneously.',
            icon: '📊',
            color: 'orange'
          },
          {
            title: 'Slashing Protection',
            description: 'Understanding penalty mechanisms for validator misbehavior and how to protect against slashing events that can cause loss of staked tokens.',
            icon: '⚠️',
            color: 'red'
          },
          {
            title: 'Governance Staking',
            description: 'Staking tokens to participate in protocol governance while earning rewards, combining financial returns with decision-making power.',
            icon: '🗳️',
            color: 'indigo'
          }
        ]
      }
    },
    {
      id: 'slide-3',
      type: 'content',
      title: 'Sophisticated Lending & MEV',
      layout: 'comparison',
      content: `Advanced lending mechanisms go beyond simple borrowing, while MEV (Maximal Extractable Value) represents a new frontier in blockchain value extraction that every DeFi user should understand.`,
      visualElements: {
        comparison: {
          before: {
            title: 'Sophisticated Lending Protocols',
            icon: '💰',
            items: [
              'Flash Loans: Uncollateralized loans repaid in same transaction - borrow millions instantly',
              'Credit Delegation: Allow others to borrow against your collateral with shared responsibility',
              'Undercollateralized Lending: Using reputation and credit scoring like traditional finance',
              'Cross-Chain Lending: Borrow on one blockchain using collateral from another chain',
              'Interest Rate Optimization: Automated yield maximization strategies across protocols'
            ]
          },
          after: {
            title: 'MEV (Maximal Extractable Value)',
            icon: '⚡',
            items: [
              'Front-running: Profiting from knowledge of pending transactions in the mempool',
              'Sandwich Attacks: Manipulating prices around large trades to extract value',
              'Arbitrage Opportunities: Exploiting price differences across different DEXs',
              'MEV Protection: Protocols like CowSwap preventing value extraction from users',
              'Flashbots: Transparent and efficient MEV marketplaces for fair value distribution'
            ]
          }
        }
      }
    },
    {
      id: 'slide-4',
      type: 'content',
      title: 'Meme Coins and Social Finance',
      layout: 'grid',
      content: `Meme coins represent the intersection of culture and finance in the digital age. Understanding their dynamics is crucial for navigating the modern crypto landscape where community and memes can drive billion-dollar valuations.`,
      visualElements: {
        cards: [
          {
            title: 'Viral Marketing Dynamics',
            description: 'How social media, Reddit communities, and celebrity endorsements drive token adoption and create massive value through network effects and FOMO.',
            icon: '🚀',
            color: 'blue'
          },
          {
            title: 'Community Governance',
            description: 'Meme coin communities making collective decisions about token burns, charity donations, and ecosystem development through decentralized voting.',
            icon: '🏛️',
            color: 'purple'
          },
          {
            title: 'Pump and Dump Recognition',
            description: 'Identifying and avoiding manipulative schemes where early holders coordinate to inflate prices before selling, leaving later investors with losses.',
            icon: '⚠️',
            color: 'red'
          },
          {
            title: 'Fair Launch Mechanisms',
            description: 'Equitable token distribution methods without pre-mines or insider allocations, ensuring early adopters and community members get fair access.',
            icon: '⚖️',
            color: 'green'
          },
          {
            title: 'Liquidity Bootstrapping',
            description: 'How meme coins create initial trading liquidity through community contributions and automated market makers.',
            icon: '💧',
            color: 'cyan'
          },
          {
            title: 'Cultural Value Creation',
            description: 'How memes, community identity, and shared beliefs create genuine economic value that extends beyond pure speculation.',
            icon: '⭐',
            color: 'yellow'
          }
        ]
      }
    },
    {
      id: 'slide-5',
      type: 'content',
      title: 'Yield Farming & Advanced DAOs',
      layout: 'comparison',
      content: `Yield farming has evolved into sophisticated strategies for maximizing returns, while DAOs have developed complex governance structures for managing decentralized communities and treasuries.`,
      visualElements: {
        comparison: {
          before: {
            title: 'Advanced Yield Farming Strategies',
            icon: '🌾',
            items: [
              'Liquidity Mining: Earning additional tokens for providing liquidity to DEX pools',
              'Yield Stacking: Combining multiple yield sources like staking + lending + LP rewards',
              'Impermanent Loss Mitigation: Strategies using options or insurance to protect against IL',
              'Auto-Compounding: Protocols that automatically reinvest earned rewards for compound growth',
              'Cross-Protocol Arbitrage: Exploiting yield differences between competing protocols',
              'Risk-Adjusted Returns: Calculating true yields after accounting for smart contract and market risks'
            ]
          },
          after: {
            title: 'Decentralized Autonomous Organizations',
            icon: '🏛️',
            items: [
              'Quadratic Voting: Preventing whale dominance by making additional votes exponentially expensive',
              'Delegation Strategies: Optimizing voting power distribution to expert community members',
              'Proposal Mechanisms: Structured systems for community members to suggest protocol changes',
              'Treasury Management: Sophisticated strategies for managing community-owned funds',
              'Multi-Signature Security: Requiring multiple approvals for critical decisions and fund movements',
              'Reputation Systems: Merit-based influence where contribution history affects governance power'
            ]
          }
        }
      }
    },
    {
      id: 'slide-6',
      type: 'content',
      title: 'Layer 2 Solutions & Privacy Tech',
      layout: 'comparison',
      content: `Scaling solutions are making blockchain more efficient while privacy technologies are preserving user confidentiality in an increasingly transparent world.`,
      visualElements: {
        comparison: {
          before: {
            title: 'Layer 2 and Scaling Solutions',
            icon: '🏗️',
            items: [
              'Optimistic Rollups: Process transactions off-chain with fraud proofs for security (Arbitrum, Optimism)',
              'ZK-Rollups: Use zero-knowledge proofs for instant finality and privacy (Polygon zkEVM, zkSync)',
              'State Channels: Off-chain transaction processing for instant, low-cost transfers',
              'Plasma Chains: Specialized child chains for specific use cases like gaming or payments',
              'Sharding: Splitting blockchain state across multiple chains for parallel processing',
              'Interoperability Protocols: Seamless asset and data transfer between different blockchains'
            ]
          },
          after: {
            title: 'Privacy-Preserving Technologies',
            icon: '🔒',
            items: [
              'Zero-Knowledge Proofs: Proving statements without revealing the underlying information',
              'zk-SNARKs: Succinct non-interactive arguments enabling private smart contracts',
              'Ring Signatures: Anonymous signatures from group members (used in Monero)',
              'Stealth Addresses: One-time addresses for enhanced transaction privacy',
              'Mixing Protocols: Breaking transaction linkability through coin mixing services',
              'Homomorphic Encryption: Performing computations on encrypted data without decrypting it'
            ]
          }
        }
      }
    },
    {
      id: 'slide-7',
      type: 'content',
      title: 'Cutting-Edge Innovations & Risk Management',
      layout: 'visual',
      content: `The frontier of Web3 includes derivatives, cross-chain infrastructure, real-world asset tokenization, and institutional DeFi. However, with sophistication comes complex risks that must be carefully managed.`,
      visualElements: {
        icon: '🧠',
        gradient: 'from-indigo-50 to-purple-100',
        cards: [
          {
            title: 'Derivatives & Structured Products',
            description: 'Perpetual futures, options protocols, synthetic assets, and complex financial instruments bringing traditional finance sophistication to DeFi.',
            icon: '📈',
            color: 'indigo'
          },
          {
            title: 'Cross-Chain Infrastructure',
            description: 'Bridge protocols, cross-chain DEXs, wrapped assets, and atomic swaps enabling seamless multi-blockchain experiences.',
            icon: '🌐',
            color: 'green'
          },
          {
            title: 'Real-World Asset Tokenization',
            description: 'Tokenizing real estate, commodities, carbon credits, art, and equipment financing to bring traditional assets on-chain.',
            icon: '🏠',
            color: 'orange'
          },
          {
            title: 'Institutional DeFi Solutions',
            description: 'KYC/AML compliance, institutional custody, sophisticated reporting, and prime brokerage services for large investors.',
            icon: '🏢',
            color: 'blue'
          },
          {
            title: 'Emerging Technologies',
            description: 'AI-powered protocols, quantum-resistant cryptography, social recovery wallets, account abstraction, and decentralized physical infrastructure.',
            icon: '🔮',
            color: 'purple'
          },
          {
            title: 'Risk Management',
            description: 'Smart contract audits, liquidity risk assessment, governance risk monitoring, and composability risk analysis for complex strategies.',
            icon: '⚠️',
            color: 'red'
          }
        ]
      }
    }
  ],
  quizPool: [
    {
      id: 'q1',
      question: 'What is "restaking" in the context of advanced staking mechanisms?',
      options: [
        'Unstaking and restaking tokens to reset rewards',
        'Using already-staked ETH to secure additional protocols and earn extra rewards',
        'Staking multiple different cryptocurrencies simultaneously',
        'Converting staking rewards back into staked tokens'
      ],
      correctAnswer: 1,
      explanation: 'Restaking, pioneered by EigenLayer, allows validators to use their already-staked ETH to secure additional protocols, earning extra rewards while creating composable security across multiple networks.',
      requiresSlides: [1]
    },
    {
      id: 'q2',
      question: 'What are flash loans in DeFi?',
      options: [
        'Very fast loan approval processes',
        'Loans with extremely high interest rates',
        'Uncollateralized loans that must be repaid within the same transaction',
        'Loans that use lightning-fast payment channels'
      ],
      correctAnswer: 2,
      explanation: 'Flash loans are uncollateralized loans that must be borrowed and repaid within the same blockchain transaction. If the loan cannot be repaid, the entire transaction fails, making them risk-free for lenders.',
      requiresSlides: [2]
    },
    {
      id: 'q3',
      question: 'What is MEV (Maximal Extractable Value)?',
      options: [
        'The maximum value a cryptocurrency can reach',
        'Value extracted by miners/validators from reordering, including, or censoring transactions',
        'The total value locked in a DeFi protocol',
        'The maximum amount you can borrow in a lending protocol'
      ],
      correctAnswer: 1,
      explanation: 'MEV refers to the value that miners or validators can extract by reordering, including, or censoring transactions within blocks. This includes front-running, sandwich attacks, and arbitrage opportunities.',
      requiresSlides: [2]
    },
    {
      id: 'q4',
      question: 'What makes quadratic voting different from traditional voting in DAOs?',
      options: [
        'Votes are counted four times',
        'Only quadrilateral token holders can vote',
        'Additional votes become exponentially more expensive, preventing whale dominance',
        'Voting happens four times per year'
      ],
      correctAnswer: 2,
      explanation: 'In quadratic voting, the cost of votes increases quadratically (1, 4, 9, 16, etc.), making it expensive for large token holders to dominate governance, thus creating more democratic decision-making.',
      requiresSlides: [4]
    },
    {
      id: 'q5',
      question: 'What is the main advantage of ZK-Rollups over Optimistic Rollups?',
      options: [
        'ZK-Rollups are always cheaper',
        'ZK-Rollups provide instant finality and built-in privacy',
        'ZK-Rollups work on any blockchain',
        'ZK-Rollups require no technical knowledge'
      ],
      correctAnswer: 1,
      explanation: 'ZK-Rollups use zero-knowledge proofs to provide instant finality (no waiting periods) and built-in privacy, whereas Optimistic Rollups require fraud-proof challenge periods and offer less privacy.',
      requiresSlides: [5]
    },
    {
      id: 'q6',
      question: 'What is "impermanent loss" in yield farming?',
      options: [
        'Temporary network connection problems',
        'Loss that occurs when token prices in a liquidity pool change relative to when you deposited',
        'Interest rate reductions on loans',
        'Smart contract bugs that cause fund loss'
      ],
      correctAnswer: 1,
      explanation: 'Impermanent loss occurs when the prices of tokens in a liquidity pool change relative to when you deposited them. You may end up with less value than if you had simply held the tokens separately.',
      requiresSlides: [4]
    },
    {
      id: 'q7',
      question: 'What is a key characteristic of successful meme coins?',
      options: [
        'Advanced technical features',
        'Strong community engagement and viral marketing',
        'High transaction fees',
        'Complex tokenomics'
      ],
      correctAnswer: 1,
      explanation: 'Successful meme coins typically rely on strong community engagement, viral marketing, and cultural resonance rather than complex technical features. Community and social dynamics drive their value.',
      requiresSlides: [3]
    },
    {
      id: 'q8',
      question: 'What is "composability risk" in DeFi?',
      options: [
        'Risk of musical composition copyright infringement',
        'Risk of protocols failing due to dependencies on other protocols',
        'Risk of smart contracts being too simple',
        'Risk of user interface complexity'
      ],
      correctAnswer: 1,
      explanation: 'Composability risk refers to the danger of cascading failures when DeFi protocols that depend on each other experience problems. If one protocol fails, it can cause failures in dependent protocols.',
      requiresSlides: [6]
    },
    {
      id: 'q9',
      question: 'What are stealth addresses used for?',
      options: [
        'Hiding smart contract code',
        'Creating one-time addresses for enhanced transaction privacy',
        'Concealing validator identities',
        'Masking token contract addresses'
      ],
      correctAnswer: 1,
      explanation: 'Stealth addresses are one-time addresses generated for each transaction to enhance privacy by making it difficult to link transactions to a specific recipient.',
      requiresSlides: [5]
    },
    {
      id: 'q10',
      question: 'What is the primary benefit of real-world asset tokenization?',
      options: [
        'Making physical assets completely digital',
        'Increasing liquidity and enabling fractional ownership of traditionally illiquid assets',
        'Eliminating the need for physical storage',
        'Reducing asset values'
      ],
      correctAnswer: 1,
      explanation: 'Real-world asset tokenization increases liquidity and enables fractional ownership of traditionally illiquid assets like real estate, art, or commodities, making them accessible to more investors.',
      requiresSlides: [6]
    }
  ]
};

const learningChangesWorldModule: ModuleData = {
  id: 'learning-human-progress-foundation',
  title: 'Learning Changes the World',
  description: 'How every big human achievement started with someone learning something new.',
  level: 'Beginner',
  category: 'Why Learning Matters',
  categoryIndex: 2,
  moduleIndex: 0,
  slides: [
    {
      id: 'slide-1',
      type: 'content',
      title: 'Learning: The Foundation of All Progress',
      layout: 'visual',
      content: `Throughout human history, learning has been the single most powerful force driving civilization forward. From the discovery of fire to the digital revolution, every breakthrough emerged from humanity's capacity to learn, adapt, and build upon previous knowledge.`,
      visualElements: {
        icon: '🧠',
        gradient: 'from-blue-50 to-indigo-100',
        cards: [
          {
            title: 'Discovery of Fire',
            description: 'Transformed human survival and cooking',
            icon: '🔥',
            color: 'red'
          },
          {
            title: 'Written Language',
            description: 'Enabled knowledge to persist across generations',
            icon: '📜',
            color: 'blue'
          },
          {
            title: 'Scientific Method',
            description: 'Systematic approach to discovery and innovation',
            icon: '🔬',
            color: 'green'
          },
          {
            title: 'Digital Revolution',
            description: 'Connected the world through technology',
            icon: '💻',
            color: 'purple'
          }
        ]
      }
    },
    {
      id: 'slide-2',
      type: 'content',
      title: 'Learning Throughout History',
      layout: 'grid',
      content: `Every major turning point in human civilization was built on learning:`,
      visualElements: {
        cards: [
          {
            title: 'Agricultural Revolution (~10,000 BCE)',
            description: 'Learning farming techniques transformed nomadic societies into settled civilizations',
            icon: '🌾',
            color: 'green'
          },
          {
            title: 'Written Language (~3200 BCE)',
            description: 'Recording knowledge enabled information to persist across generations',
            icon: '📝',
            color: 'blue'
          },
          {
            title: 'Industrial Revolution (~1760 CE)',
            description: 'Technical education and skills training created modern manufacturing',
            icon: '⚙️',
            color: 'gray'
          },
          {
            title: 'Information Age (~1970 CE)',
            description: 'Democratized access to learning resources transformed global society',
            icon: '📡',
            color: 'cyan'
          },
          {
            title: 'Digital Era (~2000 CE)',
            description: 'Online learning platforms make knowledge accessible to billions',
            icon: '🌐',
            color: 'indigo'
          },
          {
            title: 'AI Age (Today)',
            description: 'Artificial intelligence personalizes learning for every individual',
            icon: '🤖',
            color: 'purple'
          }
        ]
      }
    },
    {
      id: 'slide-3',
      type: 'content',
      title: 'Why Learning Drives Progress',
      layout: 'feature-cards',
      content: `Learning creates exponential benefits that ripple through society:`,
      visualElements: {
        features: [
          {
            icon: '💡',
            title: 'Innovation',
            description: 'New ideas emerge when people learn from existing knowledge and build upon it'
          },
          {
            icon: '🛠️',
            title: 'Problem-Solving',
            description: 'Complex challenges require educated minds to find creative solutions'
          },
          {
            icon: '🔄',
            title: 'Adaptation',
            description: 'Learning enables societies to respond effectively to changing environments'
          },
          {
            icon: '🎓',
            title: 'Knowledge Transfer',
            description: 'Teaching passes wisdom from one generation to the next, preserving progress'
          }
        ]
      }
    },
    {
      id: 'slide-4',
      type: 'content',
      title: 'The Learning Multiplier Effect',
      layout: 'comparison',
      content: `Education creates exponential benefits that multiply across all levels of society:`,
      visualElements: {
        comparison: {
          before: {
            title: 'Individual Level',
            icon: '👤',
            items: [
              'Personal empowerment and opportunities',
              'Better decision-making abilities',
              'Increased earning potential',
              'Enhanced critical thinking skills',
              'Greater life satisfaction'
            ]
          },
          after: {
            title: 'Societal Level',
            icon: '🌍',
            items: [
              'Breaking cycles of poverty',
              'Stronger communities and economies',
              'Better governance and democracy',
              'Scientific and technological advancement',
              'Collective human progress'
            ]
          }
        }
      }
    },
    {
      id: 'slide-5',
      type: 'content',
      title: 'The Modern Learning Revolution',
      layout: 'visual',
      content: `Today's digital age has transformed how we access and share knowledge, creating unprecedented opportunities for global learning:`,
      visualElements: {
        icon: '🚀',
        gradient: 'from-cyan-50 to-blue-100',
        cards: [
          {
            title: 'Global Access',
            description: 'Internet connects learners worldwide, breaking down geographic barriers',
            icon: '🌐',
            color: 'blue'
          },
          {
            title: 'Personalized Learning',
            description: 'AI adapts content to individual needs and learning styles',
            icon: '🎯',
            color: 'green'
          },
          {
            title: 'Collaborative Education',
            description: 'Peer-to-peer learning communities share knowledge globally',
            icon: '👥',
            color: 'purple'
          },
          {
            title: 'Instant Information',
            description: 'Knowledge is available on-demand, anytime, anywhere',
            icon: '⚡',
            color: 'yellow'
          }
        ]
      }
    },
    {
      id: 'slide-6',
      type: 'content',
      title: 'Overcoming Learning Barriers',
      layout: 'grid',
      content: `Despite its importance, quality education still faces significant challenges that we must address:`,
      visualElements: {
        cards: [
          {
            title: 'Economic Inequality',
            description: 'Solution: Free and low-cost educational resources, scholarships, and public education',
            icon: '🔓',
            color: 'red'
          },
          {
            title: 'Geographic Isolation',
            description: 'Solution: Online learning platforms, mobile education, and satellite internet',
            icon: '🗺️',
            color: 'blue'
          },
          {
            title: 'Language Barriers',
            description: 'Solution: Multilingual content, translation tools, and native language instruction',
            icon: '🗣️',
            color: 'green'
          },
          {
            title: 'Cultural Restrictions',
            description: 'Solution: Inclusive educational approaches that respect diverse backgrounds',
            icon: '🤝',
            color: 'purple'
          },
          {
            title: 'Technological Gaps',
            description: 'Solution: Infrastructure development, device access programs, and digital literacy',
            icon: '📱',
            color: 'cyan'
          },
          {
            title: 'Information Gatekeeping',
            description: 'Solution: Open educational resources, transparency, and democratized access',
            icon: '🚪',
            color: 'orange'
          }
        ]
      }
    },
    {
      id: 'slide-7',
      type: 'content',
      title: 'The Future of Human Learning',
      layout: 'visual',
      content: `The future of learning holds incredible promise for unlocking human potential on a global scale:`,
      visualElements: {
        icon: '🎓',
        gradient: 'from-indigo-50 to-purple-100',
        cards: [
          {
            title: 'AI-Powered Personalization',
            description: 'Every learner gets a customized education path',
            icon: '🤖',
            color: 'indigo'
          },
          {
            title: 'Immersive Technologies',
            description: 'VR/AR makes abstract concepts tangible and engaging',
            icon: '🥽',
            color: 'pink'
          },
          {
            title: 'Verifiable Credentials',
            description: 'Blockchain creates portable, tamper-proof qualifications',
            icon: '🏅',
            color: 'yellow'
          },
          {
            title: 'Universal Access',
            description: 'Quality education available to every person on Earth',
            icon: '🌍',
            color: 'green'
          }
        ]
      }
    }
  ],
  quizPool: [
    {
      id: 'q1',
      question: 'What has been the single most powerful force driving human civilization forward throughout history?',
      options: [
        'Military conquest and warfare',
        'Learning and the accumulation of knowledge',
        'Natural resource discovery',
        'Population growth'
      ],
      correctAnswer: 1,
      explanation: 'Learning has been the fundamental driver of human progress. Every major breakthrough, from agriculture to the digital age, emerged from humanity\'s capacity to learn, adapt, and build upon previous knowledge.',
      requiresSlides: [0]
    },
    {
      id: 'q2',
      question: 'Which historical development first enabled knowledge to persist across generations?',
      options: [
        'The discovery of fire',
        'The agricultural revolution',
        'The development of written language',
        'The industrial revolution'
      ],
      correctAnswer: 2,
      explanation: 'Written language, developed around 3200 BCE, was crucial because it allowed information and knowledge to be recorded and passed down across generations, rather than relying solely on oral tradition.',
      requiresSlides: [1]
    },
    {
      id: 'q3',
      question: 'What is the "learning multiplier effect"?',
      options: [
        'The ability to learn multiple subjects at once',
        'How education creates exponential benefits that ripple through society',
        'A mathematical formula for measuring learning speed',
        'The process of teaching multiple students simultaneously'
      ],
      correctAnswer: 1,
      explanation: 'The learning multiplier effect describes how education creates benefits that extend far beyond the individual learner, rippling through families, communities, and entire societies to create exponential positive change.',
      requiresSlides: [3]
    },
    {
      id: 'q4',
      question: 'How has the digital age transformed learning?',
      options: [
        'It has made learning more expensive and exclusive',
        'It has eliminated the need for traditional education',
        'It has democratized access to knowledge and enabled global connectivity',
        'It has made learning slower and less efficient'
      ],
      correctAnswer: 2,
      explanation: 'The digital age has revolutionized learning by providing global access to information, enabling personalized learning experiences, fostering collaborative education, and making knowledge available on-demand.',
      requiresSlides: [4]
    },
    {
      id: 'q5',
      question: 'What is one major barrier to learning that technology can help overcome?',
      options: [
        'The human brain\'s limited capacity',
        'Geographic isolation and distance from educational institutions',
        'The finite amount of knowledge in the world',
        'People\'s natural resistance to learning'
      ],
      correctAnswer: 1,
      explanation: 'Geographic isolation has traditionally limited access to quality education, but online learning platforms, mobile education, and satellite internet are breaking down these geographic barriers.',
      requiresSlides: [5]
    },
    {
      id: 'q6',
      question: 'According to the module, what role will AI play in the future of learning?',
      options: [
        'Replace human teachers entirely',
        'Make learning unnecessary',
        'Personalize learning experiences for every individual',
        'Limit access to education'
      ],
      correctAnswer: 2,
      explanation: 'AI will revolutionize education by personalizing learning experiences, adapting content to individual needs and learning styles, making education more effective and accessible for everyone.',
      requiresSlides: [6]
    }
  ]
};

const consequencesEducationalAbsenceModule: ModuleData = {
  id: 'consequences-educational-absence',
  title: 'What Happens Without Education',
  description: 'Why keeping people from learning hurts everyone.',
  level: 'Beginner',
  category: 'Why Learning Matters',
  categoryIndex: 2,
  moduleIndex: 1,
  slides: [
    {
      id: 'slide-1',
      type: 'content',
      title: 'When Education is Absent: The Human Cost',
      layout: 'visual',
      content: `The absence of quality education creates devastating ripple effects that extend far beyond individual lives, impacting families, communities, and entire nations. Understanding these consequences reveals why educational access is not just a personal benefit, but a fundamental human right essential for societal progress.`,
      visualElements: {
        icon: '⚠️',
        gradient: 'from-red-50 to-orange-100',
        cards: [
          {
            title: 'Individual Impact',
            description: 'Personal costs of educational absence',
            icon: '👤',
            color: 'red'
          },
          {
            title: 'Economic Consequences',
            description: 'Financial impact on society and nations',
            icon: '💰',
            color: 'orange'
          },
          {
            title: 'Social Breakdown',
            description: 'How communities suffer without education',
            icon: '🏘️',
            color: 'yellow'
          },
          {
            title: 'Global Crisis',
            description: 'Worldwide implications of educational gaps',
            icon: '🌍',
            color: 'purple'
          }
        ]
      }
    },
    {
      id: 'slide-2',
      type: 'content',
      title: 'Individual Impact: The Personal Cost',
      layout: 'grid',
      content: `Without education, individuals face a cascade of disadvantages that affect every aspect of their lives:`,
      visualElements: {
        cards: [
          {
            title: 'Limited Economic Opportunities',
            description: 'Adults without basic education earn 42% less on average. Restricted job prospects and lower earning potential.',
            icon: '💸',
            color: 'red'
          },
          {
            title: 'Reduced Critical Thinking',
            description: 'Higher susceptibility to misinformation and manipulation. Limited analytical skills and decision-making abilities.',
            icon: '🧠',
            color: 'blue'
          },
          {
            title: 'Health Disparities',
            description: 'Lower life expectancy and higher disease rates. Educational absence correlates with poorer health outcomes.',
            icon: '❤️',
            color: 'pink'
          },
          {
            title: 'Social Exclusion',
            description: 'Reduced civic engagement and community involvement. Barriers to full participation in society.',
            icon: '🚫',
            color: 'gray'
          },
          {
            title: 'Intergenerational Poverty',
            description: '75% of children in poverty have parents with limited education. The cycle perpetuates across generations.',
            icon: '📉',
            color: 'orange'
          },
          {
            title: 'Digital Divide',
            description: 'Missing out on digital economy benefits. Lack of digital literacy excludes from modern opportunities.',
            icon: '💻',
            color: 'purple'
          }
        ]
      }
    },
    {
      id: 'slide-3',
      type: 'content',
      title: 'Economic Consequences: The Financial Toll',
      layout: 'comparison',
      content: `Educational absence creates massive economic costs that affect entire nations:`,
      visualElements: {
        comparison: {
          before: {
            title: 'National Economic Losses',
            icon: '📊',
            items: [
              'Countries lose 1-2% annual GDP growth due to educational gaps',
              'Unskilled workforce limits innovation and efficiency',
              'More social support needed for undereducated populations',
              'Lower incomes mean less tax contribution',
              'Fewer educated minds to solve complex problems'
            ]
          },
          after: {
            title: 'Regional Impact',
            icon: '🏢',
            items: [
              'Educated individuals leave areas with poor educational systems',
              'Reduced foreign investment in undereducated regions',
              'Limited development of knowledge-based industries',
              'Decreased competitiveness in global markets',
              'Perpetual cycle of economic underdevelopment'
            ]
          }
        }
      }
    },
    {
      id: 'slide-4',
      type: 'content',
      title: 'Social Breakdown: When Communities Suffer',
      layout: 'feature-cards',
      content: `Educational absence undermines the very fabric of society:`,
      visualElements: {
        features: [
          {
            icon: '🚨',
            title: 'Increased Crime Rates',
            description: 'Lack of education correlates with higher criminal activity and social unrest'
          },
          {
            icon: '⚖️',
            title: 'Political Instability',
            description: 'Uneducated populations are more susceptible to extremism and authoritarian manipulation'
          },
          {
            icon: '📊',
            title: 'Social Inequality',
            description: 'Educational gaps widen wealth and opportunity disparities, creating social tension'
          },
          {
            icon: '🗳️',
            title: 'Weakened Democracy',
            description: 'Uninformed citizenry undermines democratic processes and civic participation'
          }
        ]
      }
    },
    {
      id: 'slide-5',
      type: 'content',
      title: 'Global Educational Crisis: By the Numbers',
      layout: 'visual',
      content: `The scale of educational absence worldwide is staggering:`,
      visualElements: {
        icon: '🌍',
        gradient: 'from-orange-50 to-red-100',
        cards: [
          {
            title: '244 Million',
            description: 'Children and youth out of school globally',
            icon: '🚸',
            color: 'red'
          },
          {
            title: '771 Million',
            description: 'Adults lack basic literacy skills worldwide',
            icon: '📖',
            color: 'orange'
          },
          {
            title: '57%',
            description: 'Of adults cannot explain basic financial concepts',
            icon: '💰',
            color: 'yellow'
          },
          {
            title: '$5 Trillion',
            description: 'Annual global economic loss from educational gaps',
            icon: '💸',
            color: 'purple'
          }
        ]
      }
    },
    {
      id: 'slide-6',
      type: 'content',
      title: 'Historical Examples: When Education is Denied',
      layout: 'grid',
      content: `History shows us the devastating consequences when education is deliberately restricted:`,
      visualElements: {
        cards: [
          {
            title: 'Apartheid South Africa (1948-1994)',
            description: 'Deliberate educational inequality created lasting economic and social disparities that persist today. Educational segregation perpetuates systemic inequality.',
            icon: '🚫',
            color: 'red'
          },
          {
            title: 'Taliban Education Bans (1996-2001, 2021-present)',
            description: 'Prohibiting female education devastated Afghanistan\'s human capital and economic development. Gender-based educational exclusion harms entire societies.',
            icon: '👩‍🎓',
            color: 'purple'
          },
          {
            title: 'Cultural Revolution China (1966-1976)',
            description: 'Closing schools and persecuting intellectuals created a \'lost generation\' with lasting economic impact. Anti-intellectual policies destroy societal progress.',
            icon: '📚',
            color: 'orange'
          }
        ]
      }
    },
    {
      id: 'slide-7',
      type: 'content',
      title: 'Breaking the Cycle: Solutions and Hope',
      layout: 'comparison',
      content: `Despite the challenges, there are proven ways to address educational absence:`,
      visualElements: {
        comparison: {
          before: {
            title: 'Immediate Interventions',
            icon: '⚡',
            items: [
              'Free primary education programs',
              'Adult literacy campaigns',
              'Mobile education initiatives',
              'Community learning centers',
              'Digital literacy programs'
            ]
          },
          after: {
            title: 'Long-term Solutions',
            icon: '🌱',
            items: [
              'Universal basic education policies',
              'Teacher training and support',
              'Educational infrastructure development',
              'Culturally relevant curricula',
              'Technology-enabled learning'
            ]
          }
        }
      }
    },
    {
      id: 'slide-8',
      type: 'content',
      title: 'The Urgency of Action',
      layout: 'visual',
      content: `We must act now because the consequences of educational absence are not inevitable. Through deliberate action and collective commitment, we can build a world where every person has the opportunity to learn, grow, and contribute to human advancement.`,
      visualElements: {
        icon: '🎯',
        gradient: 'from-indigo-50 to-purple-100',
        cards: [
          {
            title: 'Compounding Effects',
            description: 'Every day of educational absence compounds future disadvantages',
            icon: '📈',
            color: 'red'
          },
          {
            title: 'Technology Gap',
            description: 'Technology is accelerating the gap between educated and uneducated',
            icon: '💻',
            color: 'blue'
          },
          {
            title: 'Global Challenges',
            description: 'Complex problems require educated populations to solve',
            icon: '🌍',
            color: 'green'
          },
          {
            title: 'Hope and Promise',
            description: 'Education unlocks human potential and strengthens communities',
            icon: '✨',
            color: 'purple'
          }
        ]
      }
    }
  ],
  quizPool: [
    {
      id: 'q1',
      question: 'According to the module, how much less do adults without basic education earn on average?',
      options: [
        '32% less than educated adults',
        '42% less than educated adults',
        '52% less than educated adults',
        '62% less than educated adults'
      ],
      correctAnswer: 1,
      explanation: 'Adults without basic education earn 42% less on average, demonstrating the significant economic impact of educational absence on individual earning potential.',
      requiresSlides: [1]
    },
    {
      id: 'q2',
      question: 'How many children and youth are currently out of school globally?',
      options: [
        '144 million',
        '244 million',
        '344 million',
        '444 million'
      ],
      correctAnswer: 1,
      explanation: '244 million children and youth are out of school globally, representing a massive educational crisis that affects nearly a quarter of a billion young people.',
      requiresSlides: [4]
    },
    {
      id: 'q3',
      question: 'What percentage of children in poverty have parents with limited education?',
      options: [
        '65%',
        '70%',
        '75%',
        '80%'
      ],
      correctAnswer: 2,
      explanation: '75% of children in poverty have parents with limited education, demonstrating how educational absence creates intergenerational cycles of disadvantage.',
      requiresSlides: [1]
    },
    {
      id: 'q4',
      question: 'How much annual GDP growth do countries lose due to educational gaps?',
      options: [
        '0.5-1% annually',
        '1-2% annually',
        '2-3% annually',
        '3-4% annually'
      ],
      correctAnswer: 1,
      explanation: 'Countries lose 1-2% annual GDP growth due to educational gaps, representing a significant drag on national economic development and prosperity.',
      requiresSlides: [2]
    },
    {
      id: 'q5',
      question: 'What is the annual global economic loss from educational gaps?',
      options: [
        '$3 trillion',
        '$4 trillion',
        '$5 trillion',
        '$6 trillion'
      ],
      correctAnswer: 2,
      explanation: 'The annual global economic loss from educational gaps is $5 trillion, highlighting the massive worldwide cost of failing to provide quality education for all.',
      requiresSlides: [4]
    },
    {
      id: 'q6',
      question: 'Which historical example demonstrated how gender-based educational exclusion harms entire societies?',
      options: [
        'Apartheid South Africa',
        'Taliban education bans in Afghanistan',
        'Cultural Revolution in China',
        'Jim Crow laws in the United States'
      ],
      correctAnswer: 1,
      explanation: 'The Taliban\'s prohibition of female education in Afghanistan devastated the country\'s human capital and economic development, showing how gender-based educational exclusion harms entire societies.',
      requiresSlides: [5]
    }
  ]
};

const financialLiteracyGatekeepingModule: ModuleData = {
  id: 'financial-literacy-gatekeeping',
  title: 'Who Gets to Learn About Money?',
  description: 'How financial knowledge has been deliberately restricted throughout history to maintain power structures.',
  level: 'Intermediate',
  category: 'Why Learning Matters',
  categoryIndex: 2,
  moduleIndex: 2,
  slides: [
    {
      id: 'slide-1',
      type: 'content',
      title: 'The Hidden Barriers to Financial Knowledge',
      layout: 'visual',
      content: `Throughout history, financial knowledge has been deliberately restricted, creating artificial barriers that serve to maintain existing power structures.`,
      visualElements: {
        icon: '🔒',
        gradient: 'from-amber-50 to-orange-100',
        cards: [
          {
            title: 'Ancient Priesthoods',
            description: 'Religious leaders controlled mathematical and financial knowledge',
            icon: '⛩️',
            color: 'purple'
          },
          {
            title: 'Medieval Guilds',
            description: 'Trade secrets kept within exclusive member organizations',
            icon: '🏰',
            color: 'blue'
          },
          {
            title: 'Banking Houses',
            description: 'Wealthy families monopolized financial techniques',
            icon: '🏛️',
            color: 'green'
          },
          {
            title: 'Modern Complexity',
            description: 'Deliberate obfuscation through financial jargon',
            icon: '🧩',
            color: 'red'
          }
        ]
      }
    },
    {
      id: 'slide-2',
      type: 'content',
      title: 'Historical Financial Gatekeeping',
      layout: 'grid',
      content: `Let's trace how financial knowledge has been restricted across different eras:`,
      visualElements: {
        cards: [
          {
            title: 'Ancient Civilizations (3000 BCE - 500 CE)',
            description: 'Priestly classes controlled mathematical and financial knowledge, making it sacred and exclusive. Created dependency on temple institutions.',
            icon: '🏛️',
            color: 'purple'
          },
          {
            title: 'Medieval Europe (500 - 1500 CE)',
            description: 'Guild systems restricted financial knowledge to members, controlling commerce participation and limiting economic mobility.',
            icon: '⚔️',
            color: 'blue'
          },
          {
            title: 'Banking Renaissance (1400 - 1700 CE)',
            description: 'Wealthy families like the Medici kept financial techniques secret, creating banking oligarchies that influenced nations.',
            icon: '👑',
            color: 'yellow'
          },
          {
            title: 'Digital Age (1980 - Present)',
            description: 'Financial products became increasingly complex, requiring specialized knowledge and creating new forms of exclusion.',
            icon: '💻',
            color: 'green'
          }
        ]
      }
    },
    {
      id: 'slide-3',
      type: 'content',
      title: 'Modern Gatekeeping Mechanisms',
      layout: 'comparison',
      content: `Today's gatekeeping is more sophisticated but just as effective at maintaining barriers:`,
      visualElements: {
        comparison: {
          before: {
            title: 'Institutional Barriers',
            icon: '🏢',
            items: [
              'Minimum investment requirements exclude small investors',
              'Accredited investor rules limit advanced investments',
              'Complex financial jargon makes products difficult to understand',
              'High advisory fees price out average people',
              'Expensive business schools control knowledge access'
            ]
          },
          after: {
            title: 'Information Asymmetry',
            icon: '👁️‍🗨️',
            items: [
              'Hidden fees obscure true costs from consumers',
              'Insider information gives privileged access',
              'Deliberately confusing product structures',
              'Marketing manipulation over factual education',
              'Exclusive relationships and information sharing'
            ]
          }
        }
      }
    },
    {
      id: 'slide-4',
      type: 'content',
      title: 'The True Cost of Financial Gatekeeping',
      layout: 'feature-cards',
      content: `Financial gatekeeping creates massive societal costs that hurt everyone:`,
      visualElements: {
        features: [
          {
            icon: '📊',
            title: 'Wealth Concentration',
            description: 'Top 1% owns 32% of all wealth - gatekeeping concentrates wealth among the financially educated elite'
          },
          {
            icon: '😰',
            title: 'Financial Stress',
            description: '64% live paycheck to paycheck - lack of financial education creates chronic anxiety and poor decisions'
          },
          {
            icon: '👴',
            title: 'Retirement Crisis',
            description: '$3.68 trillion retirement shortfall - gatekeeping prevents effective long-term planning'
          }
        ]
      }
    },
    {
      id: 'slide-5',
      type: 'content',
      title: 'Who Benefits from Financial Gatekeeping?',
      layout: 'grid',
      content: `Understanding who profits from financial ignorance reveals why these barriers persist:`,
      visualElements: {
        cards: [
          {
            title: 'Financial Institutions',
            description: 'Higher fees from uninformed customers through information asymmetry that enables premium pricing.',
            icon: '🏦',
            color: 'blue'
          },
          {
            title: 'Wealthy Families',
            description: 'Reduced competition for investment opportunities through exclusive access to high-return investments.',
            icon: '💎',
            color: 'purple'
          },
          {
            title: 'Financial Advisors',
            description: 'Professional monopoly on financial guidance through licensing requirements that limit competition.',
            icon: '👔',
            color: 'green'
          },
          {
            title: 'Regulatory Capture',
            description: 'Industry influences rules to benefit established players while maintaining complexity barriers.',
            icon: '⚖️',
            color: 'red'
          }
        ]
      }
    },
    {
      id: 'slide-6',
      type: 'content',
      title: 'Breaking Down Financial Gatekeeping',
      layout: 'comparison',
      content: `The solution requires both technological innovation and educational reform:`,
      visualElements: {
        comparison: {
          before: {
            title: 'Technology Solutions',
            icon: '🚀',
            items: [
              'Online learning platforms democratize financial education',
              'Robo-advisors reduce advisory costs significantly',
              'Cryptocurrency enables direct peer-to-peer transactions',
              'Mobile apps provide accessible financial tools',
              'Open-source financial models increase transparency'
            ]
          },
          after: {
            title: 'Educational Reforms',
            icon: '📚',
            items: [
              'Mandatory financial literacy in school curricula',
              'Plain language requirements for financial products',
              'Free public financial education programs',
              'Community-based financial workshops',
              'Simplified investment platforms for beginners'
            ]
          }
        }
      }
    },
    {
      id: 'slide-7',
      type: 'content',
      title: 'The Path Forward',
      layout: 'visual',
      content: `Breaking financial gatekeeping requires recognizing it exists and taking action to democratize knowledge:`,
      visualElements: {
        icon: '🔓',
        gradient: 'from-indigo-50 to-purple-100',
        cards: [
          {
            title: 'Recognize Gatekeeping',
            description: 'Question complexity and seek simple explanations',
            icon: '👁️',
            color: 'blue'
          },
          {
            title: 'Seek Free Education',
            description: 'Use online resources and avoid expensive courses',
            icon: '🎓',
            color: 'green'
          },
          {
            title: 'Demand Transparency',
            description: 'Push for clear, simple financial product explanations',
            icon: '🔍',
            color: 'yellow'
          },
          {
            title: 'Share Knowledge',
            description: 'Help others overcome the same barriers you faced',
            icon: '🤝',
            color: 'purple'
          }
        ]
      }
    }
  ],
  quizPool: [
    {
      id: 'q1',
      question: 'What was the main method of financial gatekeeping in ancient civilizations?',
      options: [
        'High taxes on financial transactions',
        'Priestly classes controlling mathematical and financial knowledge',
        'Government monopoly on currency',
        'Banning foreign trade'
      ],
      correctAnswer: 1,
      explanation: 'In ancient civilizations, priestly classes controlled mathematical and financial knowledge, making it sacred and exclusive, which created dependency on temple institutions for financial transactions.',
      requiresSlides: [1]
    },
    {
      id: 'q2',
      question: 'Which modern gatekeeping mechanism creates barriers through complexity?',
      options: [
        'Government regulations only',
        'International trade laws',
        'Deliberately complex financial products with confusing jargon',
        'Currency exchange rates'
      ],
      correctAnswer: 2,
      explanation: 'Modern financial gatekeeping often uses deliberately complex products with confusing jargon to make financial services difficult to understand, maintaining information asymmetry.',
      requiresSlides: [2]
    },
    {
      id: 'q3',
      question: 'What percentage of Americans live paycheck to paycheck, largely due to financial illiteracy?',
      options: [
        '45%',
        '52%',
        '64%',
        '78%'
      ],
      correctAnswer: 2,
      explanation: '64% of Americans live paycheck to paycheck, which is largely attributed to lack of financial education and the resulting poor financial decision-making.',
      requiresSlides: [3]
    },
    {
      id: 'q4',
      question: 'Who primarily benefits from financial gatekeeping?',
      options: [
        'Government tax collectors',
        'Foreign investors only',
        'Financial institutions, wealthy families, and financial advisors',
        'Small business owners'
      ],
      correctAnswer: 2,
      explanation: 'Financial gatekeeping primarily benefits financial institutions (through higher fees), wealthy families (through reduced competition), and financial advisors (through professional monopolies).',
      requiresSlides: [4]
    },
    {
      id: 'q5',
      question: 'What is one key way technology can break down financial gatekeeping?',
      options: [
        'Making financial products more complex',
        'Increasing the cost of financial advice',
        'Online learning platforms that democratize financial education',
        'Limiting access to financial information'
      ],
      correctAnswer: 2,
      explanation: 'Online learning platforms democratize financial education by making quality financial knowledge accessible to everyone, regardless of their economic status or geographic location.',
      requiresSlides: [5]
    }
  ]
};

const colonialismMoneyTradeModule: ModuleData = {
  id: 'colonialism-money-trade',
  title: 'Money as Control',
  description: 'How powerful people have used money systems to control others throughout history.',
  level: 'Intermediate',
  category: 'Why Learning Matters',
  categoryIndex: 2,
  moduleIndex: 3,
  slides: [
    {
      id: 'slide-1',
      type: 'content',
      title: 'Money as a Tool of Control',
      layout: 'visual',
      content: `Throughout history, those in power have used control over money systems to maintain dominance over populations.`,
      visualElements: {
        icon: '⚖️',
        gradient: 'from-red-50 to-rose-100',
        cards: [
          {
            title: 'Colonial Exploitation',
            description: 'European powers used monetary control to extract wealth from colonies',
            icon: '🏴‍☠️',
            color: 'red'
          },
          {
            title: 'Debt Bondage',
            description: 'Creating financial dependency to control labor and resources',
            icon: '⛓️',
            color: 'gray'
          },
          {
            title: 'Currency Manipulation',
            description: 'Controlling local currencies to favor occupying powers',
            icon: '🎭',
            color: 'purple'
          },
          {
            title: 'Modern Parallels',
            description: 'How these patterns continue in contemporary finance',
            icon: '🌐',
            color: 'blue'
          }
        ]
      }
    },
    {
      id: 'slide-2',
      type: 'content',
      title: 'Colonial Monetary Systems',
      layout: 'comparison',
      content: `Colonial powers systematically replaced local economies with extractive monetary systems designed to benefit the colonizers.`,
      visualElements: {
        comparison: {
          before: {
            title: 'Before Colonialism',
            icon: '🌱',
            items: [
              'Local trade networks and currencies',
              'Community-controlled economic systems',
              'Wealth stayed within communities',
              'Diverse economic practices',
              'Self-sufficient local economies'
            ]
          },
          after: {
            title: 'After Colonial Control',
            icon: '🏭',
            items: [
              'Foreign currency systems imposed',
              'Economies restructured for extraction',
              'Wealth flowed to colonial powers',
              'Monoculture cash crop economies',
              'Dependency on foreign markets'
            ]
          }
        }
      }
    },
    {
      id: 'slide-3',
      type: 'content',
      title: 'The Mechanics of Financial Control',
      layout: 'feature-cards',
      content: `Colonial powers used sophisticated financial mechanisms to maintain control:`,
      visualElements: {
        features: [
          {
            icon: '🏦',
            title: 'Central Bank Control',
            description: 'Establishing colonial banks that controlled local currency and credit'
          },
          {
            icon: '💸',
            title: 'Tax Collection',
            description: 'Forcing payment of taxes in colonial currency, requiring participation in colonial economy'
          },
          {
            icon: '📊',
            title: 'Trade Monopolies',
            description: 'Controlling who could trade what, where, and for how much'
          },
          {
            icon: '⚖️',
            title: 'Legal Frameworks',
            description: 'Creating laws that favored colonial financial interests over local needs'
          }
        ]
      }
    },
    {
      id: 'slide-4',
      type: 'content',
      title: 'Case Study: British Colonial India',
      layout: 'grid',
      content: `The British systematically dismantled India's sophisticated economy and replaced it with an extractive system:`,
      visualElements: {
        cards: [
          {
            title: 'Before British Rule',
            description: 'India had 25% of global GDP and sophisticated banking systems including the Hundis (bills of exchange)',
            icon: '🕌',
            color: 'green'
          },
          {
            title: 'Currency Transformation',
            description: 'British replaced local currencies with the rupee system controlled by British banks',
            icon: '💱',
            color: 'blue'
          },
          {
            title: 'Wealth Extraction',
            description: 'An estimated $45 trillion was extracted from India during British rule',
            icon: '💰',
            color: 'red'
          },
          {
            title: 'Economic Collapse',
            description: 'India\'s share of global GDP fell from 25% to 2% by 1947',
            icon: '📉',
            color: 'orange'
          }
        ]
      }
    },
    {
      id: 'slide-5',
      type: 'content',
      title: 'Modern Financial Control',
      layout: 'comparison',
      content: `While colonialism has officially ended, many of the same financial control mechanisms persist in new forms:`,
      visualElements: {
        comparison: {
          before: {
            title: 'Colonial Era Control',
            icon: '🏴‍☠️',
            items: [
              'Direct political control over territories',
              'Military enforcement of economic policies',
              'Explicit resource extraction',
              'Overt currency manipulation',
              'Clear colonial administration'
            ]
          },
          after: {
            title: 'Modern Financial Control',
            icon: '🏢',
            items: [
              'Economic dependency through debt',
              'Structural adjustment programs',
              'Resource extraction through contracts',
              'Currency manipulation through markets',
              'International financial institutions'
            ]
          }
        }
      }
    },
    {
      id: 'slide-6',
      type: 'content',
      title: 'Breaking Free from Financial Control',
      layout: 'visual',
      content: `Understanding these patterns is the first step toward financial independence and creating more equitable systems:`,
      visualElements: {
        icon: '🗽',
        gradient: 'from-green-50 to-emerald-100',
        cards: [
          {
            title: 'Financial Education',
            description: 'Understanding how money systems work prevents exploitation',
            icon: '📚',
            color: 'blue'
          },
          {
            title: 'Local Economies',
            description: 'Supporting community-controlled economic systems',
            icon: '🏘️',
            color: 'green'
          },
          {
            title: 'Alternative Systems',
            description: 'Exploring cryptocurrencies and decentralized finance',
            icon: '₿',
            color: 'orange'
          },
          {
            title: 'Economic Justice',
            description: 'Advocating for fair and transparent financial systems',
            icon: '⚖️',
            color: 'purple'
          }
        ]
      }
    }
  ],
  quizPool: [
    {
      id: 'q1',
      question: 'What was one of the primary ways colonial powers used money to control populations?',
      options: [
        'By making money completely illegal',
        'By forcing tax payment in colonial currency, requiring participation in the colonial economy',
        'By giving away free money to everyone',
        'By allowing only local currencies'
      ],
      correctAnswer: 1,
      explanation: 'Colonial powers forced people to pay taxes in colonial currency, which meant they had to participate in the colonial economy to earn that currency, giving the colonizers control over local labor and resources.',
      requiresSlides: [2]
    },
    {
      id: 'q2',
      question: 'How much wealth was extracted from India during British colonial rule?',
      options: [
        '$15 trillion',
        '$25 trillion',
        '$35 trillion',
        '$45 trillion'
      ],
      correctAnswer: 3,
      explanation: 'An estimated $45 trillion was extracted from India during British rule, demonstrating the massive scale of wealth transfer from colonized to colonizing nations.',
      requiresSlides: [3]
    },
    {
      id: 'q3',
      question: 'What happened to India\'s share of global GDP during British rule?',
      options: [
        'It increased from 15% to 30%',
        'It stayed the same at 25%',
        'It fell from 25% to 2%',
        'It doubled from 10% to 20%'
      ],
      correctAnswer: 2,
      explanation: 'India\'s share of global GDP fell dramatically from 25% to just 2% by 1947, showing how colonial financial control devastated local economies.',
      requiresSlides: [3]
    },
    {
      id: 'q4',
      question: 'Which of these is a modern form of financial control similar to colonial mechanisms?',
      options: [
        'Free international trade',
        'Structural adjustment programs that force economic policy changes',
        'Local community banks',
        'Cryptocurrency adoption'
      ],
      correctAnswer: 1,
      explanation: 'Structural adjustment programs imposed by international financial institutions often force developing countries to adopt economic policies that benefit wealthy nations, similar to colonial-era financial control.',
      requiresSlides: [4]
    },
    {
      id: 'q5',
      question: 'What is one way individuals can help break free from exploitative financial systems?',
      options: [
        'Ignoring all financial systems completely',
        'Only using cash for everything',
        'Financial education to understand how money systems work',
        'Moving to a different country'
      ],
      correctAnswer: 2,
      explanation: 'Financial education helps people understand how money systems work, enabling them to make informed decisions and avoid exploitation while working toward more equitable systems.',
      requiresSlides: [5]
    }
  ]
};

const globalEducationStatisticsModule: ModuleData = {
  id: 'global-education-statistics',
  title: 'Education Around the World',
  description: 'Who gets financial education and who doesn\'t - the statistics might surprise you.',
  level: 'Advanced',
  category: 'Why Learning Matters',
  categoryIndex: 2,
  moduleIndex: 4,
  slides: [
    {
      id: 'slide-1',
      type: 'content',
      title: 'The Global Education Crisis',
      layout: 'visual',
      content: `Education access varies dramatically around the world. Let's look at the real numbers behind educational inequality.`,
      visualElements: {
        icon: '🌍',
        gradient: 'from-red-50 to-orange-100',
        cards: [
          {
            title: '244 Million',
            description: 'Children and youth are out of school worldwide',
            icon: '📚',
            color: 'red'
          },
          {
            title: '771 Million',
            description: 'Adults lack basic literacy skills globally',
            icon: '📝',
            color: 'orange'
          },
          {
            title: '617 Million',
            description: 'Children can\'t read or do basic math despite being in school',
            icon: '🧮',
            color: 'yellow'
          }
        ]
      }
    },
    {
      id: 'slide-2',
      type: 'content',
      title: 'Financial Literacy: The Hidden Crisis',
      layout: 'grid',
      content: `Financial education is even more scarce than basic literacy. Here's the global picture:`,
      visualElements: {
        cards: [
          {
            title: 'Global Average',
            description: 'Only 33% of adults worldwide understand basic financial concepts',
            icon: '📊',
            color: 'blue'
          },
          {
            title: 'Developing Countries',
            description: 'As low as 15-25% financial literacy in many regions',
            icon: '📉',
            color: 'red'
          },
          {
            title: 'Gender Gap',
            description: 'Women score 5% lower globally, with bigger gaps in developing countries',
            icon: '👩‍💼',
            color: 'purple'
          },
          {
            title: 'Youth Crisis',
            description: '76% of millennials lack basic financial knowledge',
            icon: '👨‍🎓',
            color: 'orange'
          }
        ]
      }
    },
    {
      id: 'slide-3',
      type: 'content',
      title: 'Regional Education Gaps',
      layout: 'comparison',
      content: `Educational access isn't just about money - it varies dramatically by region and circumstances.`,
      visualElements: {
        comparison: {
          before: {
            title: 'High Access Regions',
            icon: '✅',
            items: [
              'North America & Europe: 99% primary enrollment',
              'Rich countries: Universal basic education',
              'Urban areas: Better schools and resources',
              'Stable countries: Consistent education systems',
              'Digital access: Online learning available'
            ]
          },
          after: {
            title: 'Low Access Regions',
            icon: '❌',
            items: [
              'Sub-Saharan Africa: 64% primary enrollment',
              'Conflict zones: Schools destroyed or unsafe',
              'Rural areas: Limited schools and teachers',
              'Extreme poverty: Children work instead of studying',
              'No internet: Can\'t access digital education'
            ]
          }
        }
      }
    },
    {
      id: 'slide-4',
      type: 'content',
      title: 'The Digital Education Divide',
      layout: 'visual',
      content: `The internet age has created new educational opportunities - but also new forms of inequality.`,
      visualElements: {
        icon: '💻',
        gradient: 'from-blue-50 to-purple-100',
        cards: [
          {
            title: 'Internet Access',
            description: 'Developed: 87% vs Least Developed: 19%',
            icon: '🌐',
            color: 'blue'
          },
          {
            title: 'Device Ownership',
            description: 'Developed: 76% vs Least Developed: 22%',
            icon: '📱',
            color: 'green'
          },
          {
            title: 'Digital Skills',
            description: 'Developed: 70% vs Least Developed: 15%',
            icon: '⌨️',
            color: 'purple'
          }
        ]
      }
    },
    {
      id: 'slide-5',
      type: 'content',
      title: 'Gender in Education: The Numbers',
      layout: 'feature-cards',
      content: `Women and girls face additional barriers to education worldwide. These gaps affect entire generations.`,
      visualElements: {
        features: [
          {
            icon: '👧',
            title: 'Girls Out of School',
            description: '53% of out-of-school children are girls, with Chad at 74%'
          },
          {
            icon: '📖',
            title: 'Women\'s Literacy',
            description: '83% globally vs 90% for men, with Niger at just 19% for women'
          },
          {
            icon: '🏦',
            title: 'Financial Exclusion',
            description: '84% of women in Sub-Saharan Africa lack access to banking'
          },
          {
            icon: '🔬',
            title: 'STEM Participation',
            description: 'Only 28% of engineering students globally are women'
          }
        ]
      }
    },
    {
      id: 'slide-6',
      type: 'content',
      title: 'Quality Crisis: In School but Not Learning',
      layout: 'grid',
      content: `Being in school doesn't guarantee learning. Many children attend school but don't gain basic skills.`,
      visualElements: {
        cards: [
          {
            title: 'Sub-Saharan Africa',
            description: '89% of children can\'t read properly despite being in school',
            icon: '📖',
            color: 'red'
          },
          {
            title: 'South Asia',
            description: '76% lack basic reading skills, 78% struggle with math',
            icon: '🧮',
            color: 'orange'
          },
          {
            title: 'Latin America',
            description: '51% below reading proficiency, 62% below math standards',
            icon: '📚',
            color: 'yellow'
          },
          {
            title: 'Global Average',
            description: '617 million children in school but not learning basics',
            icon: '🌍',
            color: 'gray'
          }
        ]
      }
    },
    {
      id: 'slide-7',
      type: 'content',
      title: 'The Economic Cost of Education Gaps',
      layout: 'visual',
      content: `Poor education doesn't just hurt individuals - it damages entire economies and societies.`,
      visualElements: {
        icon: '💰',
        gradient: 'from-orange-50 to-red-100',
        cards: [
          {
            title: '$5 Trillion Lost',
            description: 'Annual global loss from educational gaps and poor productivity',
            icon: '📉',
            color: 'red'
          },
          {
            title: '$130 Trillion',
            description: 'Lifetime earnings lost to learning poverty for current generation',
            icon: '⏳',
            color: 'orange'
          },
          {
            title: '1.2% GDP Loss',
            description: 'Annual economic growth lost per country from inadequate education',
            icon: '🏦',
            color: 'yellow'
          }
        ]
      }
    },
    {
      id: 'slide-8',
      type: 'content',
      title: 'Success Stories: What Works',
      layout: 'feature-cards',
      content: `Despite challenges, some countries and programs have made remarkable progress in expanding education access.`,
      visualElements: {
        features: [
          {
            icon: '🇰🇷',
            title: 'South Korea\'s Transformation',
            description: 'Went from war-torn to 100% literacy in just 40 years through massive education investment'
          },
          {
            icon: '🇧🇷',
            title: 'Brazil\'s Literacy Campaign',
            description: 'Reduced adult illiteracy from 25% to 7% through nationwide programs'
          },
          {
            icon: '🇷🇼',
            title: 'Rwanda\'s Recovery',
            description: 'Rebuilt education system after genocide, now has 85% primary enrollment'
          },
          {
            icon: '📱',
            title: 'Mobile Learning Programs',
            description: 'Kenya\'s M-Shule uses SMS to deliver education, reaching rural areas'
          }
        ]
      }
    },
    {
      id: 'slide-9',
      type: 'content',
      title: 'Solutions That Scale',
      layout: 'comparison',
      content: `Real solutions to global education inequality require both immediate action and long-term thinking.`,
      visualElements: {
        comparison: {
          before: {
            title: 'What Doesn\'t Work',
            icon: '❌',
            items: [
              'Building schools without training teachers',
              'One-size-fits-all curricula',
              'Ignoring local languages and cultures',
              'Technology without electricity/internet',
              'Short-term funding cycles'
            ]
          },
          after: {
            title: 'What Actually Works',
            icon: '✅',
            items: [
              'Teacher training and ongoing support',
              'Culturally relevant, local content',
              'Community involvement and ownership',
              'Sustainable, long-term funding',
              'Technology that works offline'
            ]
          }
        }
      }
    },
    {
      id: 'slide-10',
      type: 'content',
      title: 'Your Role in Global Education',
      layout: 'visual',
      content: `Global education inequality might seem overwhelming, but everyone can contribute to solutions.`,
      visualElements: {
        icon: '🤝',
        gradient: 'from-green-50 to-blue-100',
        cards: [
          {
            title: 'Support Organizations',
            description: 'Fund groups working on education access in developing countries',
            icon: '💝',
            color: 'green'
          },
          {
            title: 'Share Knowledge',
            description: 'Help spread financial literacy in your own community',
            icon: '📢',
            color: 'blue'
          },
          {
            title: 'Advocate for Policy',
            description: 'Support politicians who prioritize education funding',
            icon: '🗳️',
            color: 'purple'
          },
          {
            title: 'Use Your Skills',
            description: 'Volunteer to teach, create content, or build educational tools',
            icon: '🛠️',
            color: 'orange'
          }
        ]
      }
    }
  ],
  quizPool: [
    {
      id: 'q1',
      question: 'How many children and youth are currently out of school worldwide?',
      options: [
        '124 million',
        '244 million', 
        '344 million',
        '444 million'
      ],
      correctAnswer: 1,
      explanation: '244 million children and youth are out of school worldwide - roughly equivalent to the entire population of Indonesia.',
      requiresSlides: [0]
    },
    {
      id: 'q2',
      question: 'What percentage of adults worldwide are financially literate?',
      options: [
        '23%',
        '33%',
        '43%', 
        '53%'
      ],
      correctAnswer: 1,
      explanation: 'Only 33% of adults worldwide are financially literate, highlighting the massive global education gap in financial knowledge.',
      requiresSlides: [1]
    },
    {
      id: 'q3',
      question: 'Which region has the lowest primary education enrollment rates?',
      options: [
        'South Asia',
        'Latin America',
        'Sub-Saharan Africa',
        'Middle East'
      ],
      correctAnswer: 2,
      explanation: 'Sub-Saharan Africa has the lowest primary education enrollment at just 64%, with 97.3 million children out of school.',
      requiresSlides: [2]
    },
    {
      id: 'q4',
      question: 'What percentage of internet access do people in least developed countries have?',
      options: [
        '9%',
        '19%',
        '29%',
        '39%'
      ],
      correctAnswer: 1,
      explanation: 'Only 19% of people in least developed countries have internet access, compared to 87% in developed countries.',
      requiresSlides: [3]
    },
    {
      id: 'q5',
      question: 'What percentage of out-of-school children globally are girls?',
      options: [
        '43%',
        '48%',
        '53%',
        '58%'
      ],
      correctAnswer: 2,
      explanation: '53% of out-of-school children are girls, with some countries like Chad reaching as high as 74%.',
      requiresSlides: [4]
    },
    {
      id: 'q6',
      question: 'In Sub-Saharan Africa, what percentage of children in school cannot read properly?',
      options: [
        '69%',
        '79%',
        '89%',
        '99%'
      ],
      correctAnswer: 2,
      explanation: '89% of children in Sub-Saharan Africa cannot read properly despite being in school, highlighting the quality crisis.',
      requiresSlides: [5]
    },
    {
      id: 'q7',
      question: 'How much money is lost globally each year due to educational gaps?',
      options: [
        '$1 trillion',
        '$5 trillion',
        '$10 trillion',
        '$15 trillion'
      ],
      correctAnswer: 1,
      explanation: '$5 trillion is lost annually worldwide due to educational gaps, representing massive lost productivity and innovation.',
      requiresSlides: [6]
    },
    {
      id: 'q8',
      question: 'Which approach is most effective for sustainable education improvement?',
      options: [
        'Building more schools quickly',
        'Providing tablets to all students',
        'Training teachers and involving communities',
        'Using only international curricula'
      ],
      correctAnswer: 2,
      explanation: 'Training teachers and involving local communities has proven most effective for sustainable education improvement.',
      requiresSlides: [8]
    }
  ]
};

const democratizingFinancialKnowledgeModule: ModuleData = {
  id: 'democratizing-financial-knowledge',
  title: 'Making Learning Free for All',
  description: 'How to break down barriers and teach everyone about money.',
  level: 'Advanced',
  category: 'Why Learning Matters',
  categoryIndex: 2,
  moduleIndex: 5,
  slides: [
    {
      id: 'slide-1',
      type: 'content',
      title: 'Breaking Down Educational Barriers',
      layout: 'visual',
      content: `True progress means ensuring everyone has access to quality financial education, regardless of their background.`,
      visualElements: {
        icon: '🚀',
        gradient: 'from-purple-50 to-pink-100',
        cards: [
          {
            title: 'Universal Access',
            description: 'Education should be available to everyone, everywhere',
            icon: '🌍',
            color: 'blue'
          },
          {
            title: 'Technology Solutions',
            description: 'Digital platforms can reach underserved populations',
            icon: '💻',
            color: 'green'
          },
          {
            title: 'Community Programs',
            description: 'Local initiatives can bridge formal education gaps',
            icon: '🤝',
            color: 'orange'
          },
          {
            title: 'Policy Changes',
            description: 'Government action can mandate financial education',
            icon: '📜',
            color: 'purple'
          }
        ]
      }
    }
  ],
  quizPool: [
    {
      id: 'q1',
      question: 'What is the most effective way to democratize financial education?',
      options: [
        'Only through traditional schools',
        'Combining technology, community programs, and policy changes',
        'Only through government programs',
        'Only through private companies'
      ],
      correctAnswer: 1,
      explanation: 'Democratizing financial education requires a multi-pronged approach combining technology, community programs, and supportive policies.',
      requiresSlides: [0]
    }
  ]
};

export const allModules: ModuleData[] = [
  moneyAsControlModule,
  whatIsMoneyModule,
  moneyThroughTimeModule,
  whereMoneyLivesModule,
  cryptoPlaceInMoneyModule,
  wealthEmpowermentModule,
  financialStrategyModule,
  cryptoFundamentalsModule,
  digitalOwnershipModule,
  tokensTokenizationModule,
  blockchainTechnologyModule,
  defiBankingModule,
  advancedWeb3Module,
  learningChangesWorldModule,
  consequencesEducationalAbsenceModule,
  financialLiteracyGatekeepingModule,
  colonialismMoneyTradeModule,
  globalEducationStatisticsModule,
  democratizingFinancialKnowledgeModule
];
