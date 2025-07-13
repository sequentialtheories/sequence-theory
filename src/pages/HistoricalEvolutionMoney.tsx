import ArticleLayout from "@/components/ArticleLayout";

const HistoricalEvolutionMoney = () => {
  return (
    <ArticleLayout
      title="Historical Evolution of Money"
      level="Beginner"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">The Journey of Money Through Time</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Money's evolution reveals humanity's greatest financial triumphs and catastrophic mistakes. 
            Understanding this history is crucial for navigating today's monetary landscape.
          </p>
        </div>

        {/* Historical Eras */}
        <div className="grid gap-6">
          
          {/* Barter System */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-8 bg-primary rounded-full"></div>
              <div>
                <h3 className="text-xl font-semibold">The Barter System</h3>
                <p className="text-sm text-muted-foreground">Pre-3000 BCE</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              Direct trade of goods and services. Simple but severely limited.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-muted/50 p-4 rounded">
                <h4 className="font-medium text-destructive mb-2">Double Coincidence Problem</h4>
                <p className="text-sm text-muted-foreground">You want my cow, but I need your grain - not your tools</p>
              </div>
              <div className="bg-muted/50 p-4 rounded">
                <h4 className="font-medium text-destructive mb-2">No Fair Pricing</h4>
                <p className="text-sm text-muted-foreground">How many chickens equal one cow?</p>
              </div>
              <div className="bg-muted/50 p-4 rounded">
                <h4 className="font-medium text-destructive mb-2">No Savings</h4>
                <p className="text-sm text-muted-foreground">Can't store perishable goods for future use</p>
              </div>
            </div>
          </div>

          {/* Commodity Money */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-8 bg-primary rounded-full"></div>
              <div>
                <h3 className="text-xl font-semibold">Commodity Money Era</h3>
                <p className="text-sm text-muted-foreground">3000 BCE - 600 BCE</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              Items with intrinsic value became the first "money" - but came with their own problems.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-primary mb-3">Popular Commodities</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Cattle (where "capital" comes from)</li>
                  <li>• Salt (Roman soldiers' "salary")</li>
                  <li>• Shells and rare stones</li>
                  <li>• Precious metals</li>
                </ul>
              </div>
              <div className="bg-destructive/10 p-4 rounded border border-destructive/20">
                <h4 className="font-medium text-destructive mb-2">The Problems</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Heavy and hard to transport</li>
                  <li>• Spoilage and deterioration</li>
                  <li>• Difficult to divide</li>
                  <li>• Easy to counterfeit</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Coined Money */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-8 bg-primary rounded-full"></div>
              <div>
                <h3 className="text-xl font-semibold">The Coin Revolution</h3>
                <p className="text-sm text-muted-foreground">650 BCE - 1000 CE</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              Lydia's first coins solved many problems but created new ones.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-primary/10 p-4 rounded border border-primary/20">
                <h4 className="font-medium text-primary mb-2">Major Innovations</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Standardized weight and purity</li>
                  <li>• Government authentication</li>
                  <li>• Portable and durable</li>
                  <li>• Divisible into smaller units</li>
                </ul>
              </div>
              <div className="bg-destructive/10 p-4 rounded border border-destructive/20">
                <h4 className="font-medium text-destructive mb-2">The Dark Side</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Coin clipping and debasement</li>
                  <li>• Roman inflation from silver debasement</li>
                  <li>• Still heavy for large transactions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Paper Money */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-8 bg-primary rounded-full"></div>
              <div>
                <h3 className="text-xl font-semibold">Paper Money & Banking</h3>
                <p className="text-sm text-muted-foreground">1000 CE - 1971</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              China's paper money innovation spread globally, but governments couldn't resist the printing press.
            </p>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-primary/10 p-4 rounded border border-primary/20">
                  <h4 className="font-medium text-primary mb-2">Revolutionary Benefits</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Lightweight and portable</li>
                    <li>• Enabled modern banking</li>
                    <li>• Facilitated international trade</li>
                    <li>• Gold standard provided stability</li>
                  </ul>
                </div>
                <div className="bg-destructive/10 p-4 rounded border border-destructive/20">
                  <h4 className="font-medium text-destructive mb-2">Historic Failures</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• France's assignats (1790s) - 99% loss</li>
                    <li>• Confederate dollars - worthless</li>
                    <li>• Germany's Weimar hyperinflation</li>
                    <li>• Government printing to fund wars</li>
                  </ul>
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded border border-amber-200 dark:border-amber-800">
                <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">⚠️ The Inflation Lesson</h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Every government that gained control of money printing eventually abused it. 
                  The pattern is consistent: war spending, deficit financing, and currency collapse.
                </p>
              </div>
            </div>
          </div>

          {/* Fiat Era */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-8 bg-primary rounded-full"></div>
              <div>
                <h3 className="text-xl font-semibold">The Fiat Experiment</h3>
                <p className="text-sm text-muted-foreground">1971 - Present</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              Nixon ended gold backing in 1971. We're now 50+ years into the first global fiat experiment.
            </p>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-primary/10 p-4 rounded border border-primary/20">
                  <h4 className="font-medium text-primary mb-2">Fiat Advantages</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Flexible monetary policy</li>
                    <li>• Digital transactions possible</li>
                    <li>• Quick crisis response</li>
                    <li>• Global payment systems</li>
                  </ul>
                </div>
                <div className="bg-destructive/10 p-4 rounded border border-destructive/20">
                  <h4 className="font-medium text-destructive mb-2">The Cost</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Persistent inflation erodes savings</li>
                    <li>• Currency wars and devaluations</li>
                    <li>• Boom-bust cycles amplified</li>
                    <li>• Growing wealth inequality</li>
                  </ul>
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded border border-orange-200 dark:border-orange-800">
                <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">📊 The Numbers Don't Lie</h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Since 1971, the US dollar has lost 85% of its purchasing power. 
                  What cost $1 then costs $6.50+ today. This is the "hidden tax" of inflation.
                </p>
              </div>
            </div>
          </div>

          {/* Digital Era */}
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-8 bg-primary rounded-full"></div>
              <div>
                <h3 className="text-xl font-semibold">The Digital Revolution</h3>
                <p className="text-sm text-muted-foreground">2008 - Present</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              Bitcoin emerged from the 2008 financial crisis, offering an alternative to traditional money.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-muted/50 p-4 rounded">
                <h4 className="font-medium mb-2">Payment Innovation</h4>
                <p className="text-sm text-muted-foreground">Digital wallets, instant transfers, global reach</p>
              </div>
              <div className="bg-muted/50 p-4 rounded">
                <h4 className="font-medium mb-2">Programmable Money</h4>
                <p className="text-sm text-muted-foreground">Smart contracts, DeFi, automated systems</p>
              </div>
              <div className="bg-muted/50 p-4 rounded">
                <h4 className="font-medium mb-2">Monetary Choice</h4>
                <p className="text-sm text-muted-foreground">Fixed supply vs. infinite printing debate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Lessons */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 border">
          <h3 className="text-xl font-semibold mb-4 text-center">Critical Lessons from Monetary History</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-primary mb-3">What We've Learned</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Money always evolves with technology</li>
                <li>• Trust is the foundation of any monetary system</li>
                <li>• Governments can't resist printing money</li>
                <li>• Inflation is theft from savers</li>
                <li>• Monopoly money always fails eventually</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-secondary mb-3">Why This Matters Today</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Central banks printed $20+ trillion since 2008</li>
                <li>• We're in the longest fiat experiment ever</li>
                <li>• Digital alternatives are emerging</li>
                <li>• Understanding history helps predict the future</li>
                <li>• Your wealth depends on these choices</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ArticleLayout>
  );
};

export default HistoricalEvolutionMoney;