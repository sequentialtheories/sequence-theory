import ArticleLayout from "@/components/ArticleLayout";

const TypesFinancialMarkets = () => {
  return (
    <ArticleLayout
      title="Types of Financial Markets"
      level="Intermediate"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">The Financial Markets Ecosystem</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Financial markets are the highways of the global economy, where trillions flow daily. 
            Understanding each type helps you navigate opportunities and avoid pitfalls.
          </p>
        </div>

        {/* Market Types Grid */}
        <div className="grid gap-6">
          
          {/* Stock Markets */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">📈</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Stock Markets</h3>
                <p className="text-sm text-muted-foreground">Own pieces of companies</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              Where companies sell ownership stakes to raise money and investors bet on future success.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="bg-primary/10 p-3 rounded border border-primary/20">
                  <h4 className="font-medium text-primary mb-1">Primary Markets</h4>
                  <p className="text-sm text-muted-foreground">IPOs - Companies going public for the first time</p>
                </div>
                <div className="bg-secondary/10 p-3 rounded border border-secondary/20">
                  <h4 className="font-medium text-secondary mb-1">Secondary Markets</h4>
                  <p className="text-sm text-muted-foreground">Daily trading - NYSE, NASDAQ, global exchanges</p>
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded">
                <h4 className="font-medium mb-2">Reality Check</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 90% of day traders lose money</li>
                  <li>• Market can stay irrational longer than you can stay solvent</li>
                  <li>• Insider trading gives institutions massive advantages</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bond Markets */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">🏛️</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Bond Markets</h3>
                <p className="text-sm text-muted-foreground">Lending to governments & corporations</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              You lend money, they pay you interest. Sounds safe until inflation or defaults happen.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-muted/50 p-4 rounded">
                <h4 className="font-medium mb-2">Government Bonds</h4>
                <p className="text-sm text-muted-foreground">Treasuries, considered "risk-free" (until they're not)</p>
              </div>
              <div className="bg-muted/50 p-4 rounded">
                <h4 className="font-medium mb-2">Corporate Bonds</h4>
                <p className="text-sm text-muted-foreground">Higher yield, higher risk - companies can fail</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded border border-amber-200 dark:border-amber-800">
                <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">⚠️ Inflation Risk</h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">Fixed interest loses value when money printing accelerates</p>
              </div>
            </div>
          </div>

          {/* Commodity Markets */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">🌾</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Commodity Markets</h3>
                <p className="text-sm text-muted-foreground">Raw materials & energy</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              Physical stuff that powers civilization - oil, gold, wheat. Real assets in an increasingly digital world.
            </p>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded border border-orange-200 dark:border-orange-800">
                <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">Energy</h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">Oil, gas, electricity</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Precious Metals</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">Gold, silver, platinum</p>
              </div>
              <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded border border-green-200 dark:border-green-800">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Agriculture</h4>
                <p className="text-sm text-green-700 dark:text-green-300">Wheat, corn, coffee</p>
              </div>
              <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded border border-red-200 dark:border-red-800">
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Industrial</h4>
                <p className="text-sm text-red-700 dark:text-red-300">Copper, steel, lumber</p>
              </div>
            </div>
          </div>

          {/* Forex Markets */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">💱</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Foreign Exchange (Forex)</h3>
                <p className="text-sm text-muted-foreground">Currency trading - $7+ trillion daily</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              The biggest, most liquid market on Earth. Also where retail traders get absolutely destroyed.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-primary mb-3">Market Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 24/7 trading across time zones</li>
                  <li>• Major pairs: EUR/USD, GBP/USD, USD/JPY</li>
                  <li>• Central bank interventions move markets</li>
                  <li>• Economic data releases cause volatility</li>
                </ul>
              </div>
              <div className="bg-destructive/10 p-4 rounded border border-destructive/20">
                <h4 className="font-medium text-destructive mb-2">Brutal Reality</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• 80%+ of retail traders lose money</li>
                  <li>• High leverage = quick account wipeouts</li>
                  <li>• Massive institutional advantages</li>
                  <li>• Currency wars between nations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Derivatives Markets */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Derivatives Markets</h3>
                <p className="text-sm text-muted-foreground">Bets on bets - the casino layer</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              Financial instruments derived from other assets. Useful for hedging, devastating for speculation.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="bg-muted/50 p-3 rounded">
                  <h4 className="font-medium mb-1">Options</h4>
                  <p className="text-sm text-muted-foreground">Right to buy/sell at specific prices</p>
                </div>
                <div className="bg-muted/50 p-3 rounded">
                  <h4 className="font-medium mb-1">Futures</h4>
                  <p className="text-sm text-muted-foreground">Contracts for future delivery</p>
                </div>
                <div className="bg-muted/50 p-3 rounded">
                  <h4 className="font-medium mb-1">Swaps</h4>
                  <p className="text-sm text-muted-foreground">Exchange different cash flows</p>
                </div>
              </div>
              <div className="bg-destructive/10 p-4 rounded border border-destructive/20">
                <h4 className="font-medium text-destructive mb-2">Warning Signs</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Can lose more than you invested</li>
                  <li>• Complexity hides risks</li>
                  <li>• Time decay works against you</li>
                  <li>• Options expire worthless 80% of the time</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Money Markets */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-500/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">🏦</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Money Markets</h3>
                <p className="text-sm text-muted-foreground">Short-term debt - "safe" parking</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              Where institutions park cash short-term. Low risk, low reward - until counterparty risk hits.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-muted/50 p-4 rounded">
                <h4 className="font-medium mb-2">Common Instruments</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Treasury bills (T-bills)</li>
                  <li>• Commercial paper</li>
                  <li>• Certificates of deposit</li>
                  <li>• Repurchase agreements</li>
                </ul>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded border border-amber-200 dark:border-amber-800">
                <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Hidden Risks</h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  "Safe" until 2008 when money markets broke and needed government bailouts
                </p>
              </div>
            </div>
          </div>

          {/* Cryptocurrency Markets */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">₿</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Cryptocurrency Markets</h3>
                <p className="text-sm text-muted-foreground">The new wild west</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              24/7 global markets with extreme volatility. Revolutionary technology meets speculative mania.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-primary/10 p-4 rounded border border-primary/20">
                <h4 className="font-medium text-primary mb-2">Revolutionary Features</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• 24/7/365 trading</li>
                  <li>• Global, permissionless access</li>
                  <li>• Programmable money (smart contracts)</li>
                  <li>• No central authority control</li>
                </ul>
              </div>
              <div className="bg-destructive/10 p-4 rounded border border-destructive/20">
                <h4 className="font-medium text-destructive mb-2">Wild West Risks</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Extreme volatility (50%+ swings)</li>
                  <li>• Scams and rug pulls</li>
                  <li>• Regulatory uncertainty</li>
                  <li>• Technical complexity</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Market Functions */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 border">
          <h3 className="text-xl font-semibold mb-4 text-center">What All Markets Really Do</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-primary mb-3">The Theory</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Price discovery through supply & demand</li>
                <li>• Provide liquidity for easy trading</li>
                <li>• Allocate capital efficiently</li>
                <li>• Enable risk management</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-destructive mb-3">The Reality</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Markets can be manipulated by large players</li>
                <li>• Liquidity disappears when you need it most</li>
                <li>• Capital often flows to speculation, not productivity</li>
                <li className="bg-gradient-to-r from-primary/10 to-secondary/10 p-3 rounded-md border border-primary/20 font-medium text-foreground">
                  💡 Markets are efficient at transferring money from the impatient to the patient
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="text-xl font-semibold mb-4 text-center">Essential Truths About Financial Markets</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="bg-primary/10 p-4 rounded border border-primary/20">
                <h4 className="font-medium text-primary mb-2">What Works</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Long-term investing in productive assets</li>
                  <li>• Diversification across uncorrelated markets</li>
                  <li>• Understanding what you're buying</li>
                  <li>• Position sizing and risk management</li>
                </ul>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-destructive/10 p-4 rounded border border-destructive/20">
                <h4 className="font-medium text-destructive mb-2">What Destroys Wealth</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Trading without understanding</li>
                  <li>• Chasing performance and hot markets</li>
                  <li>• Using excessive leverage</li>
                  <li>• Believing you can time markets consistently</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ArticleLayout>
  );
};

export default TypesFinancialMarkets;