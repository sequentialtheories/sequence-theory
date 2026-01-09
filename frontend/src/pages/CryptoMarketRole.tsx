import ArticleLayout from "@/components/ArticleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Globe, Clock, Shield, Users, Zap, AlertTriangle, Target, Building2, Coins, ChartBar, Lightbulb } from "lucide-react";

const CryptoMarketRole = () => {
  return (
    <ArticleLayout
      title="The Crypto Market's Role"
      level="Intermediate"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Cryptocurrency's Place in Finance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">
              The cryptocurrency market represents a paradigm shift in how we think about money, value transfer,
              and financial systems. Understanding its role helps us grasp its potential impact on the global economy.
            </p>
          </CardContent>
        </Card>

        {/* A New Asset Class */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              A New Asset Class 🚀
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Cryptocurrencies have emerged as a distinct asset class with unique characteristics:</p>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Zap className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <strong>Digital Native:</strong> Born in the internet age, designed for digital transactions
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Globe className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <strong>Decentralized:</strong> Not controlled by any single government or institution
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Target className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <strong>Programmable:</strong> Can embed complex rules and conditions
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <strong>Global:</strong> Accessible 24/7 from anywhere in the world
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complementing Traditional Markets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartBar className="h-5 w-5 text-primary" />
              Complementing Traditional Markets 🤝
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Rather than replacing traditional finance, crypto markets often complement existing systems:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg border">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">📊 Portfolio Diversification</h4>
                <p className="text-sm">Offering uncorrelated returns to traditional assets</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg border">
                <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">🛡️ Inflation Hedge</h4>
                <p className="text-sm">Some cryptocurrencies serve as digital gold</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg border">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">⚡ Innovation Driver</h4>
                <p className="text-sm">Pushing traditional finance to modernize</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 rounded-lg border">
                <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">🌍 Financial Inclusion</h4>
                <p className="text-sm">Providing services to the unbanked population</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Structure Differences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Market Structure Differences ⚖️
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Crypto markets operate differently from traditional financial markets:</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Badge variant="secondary">24/7</Badge>
                <span><strong>Always Open:</strong> Never closes, unlike traditional markets</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Badge variant="secondary">📈</Badge>
                <span><strong>High Volatility:</strong> Greater price swings than most traditional assets</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Badge variant="secondary">🚪</Badge>
                <span><strong>Lower Barriers:</strong> Easier access for retail investors</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Badge variant="secondary">🌐</Badge>
                <span><strong>Global Participation:</strong> Anyone with internet access can participate</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Institutional Adoption */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Institutional Adoption 🏢
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Traditional financial institutions are increasingly embracing cryptocurrencies:</p>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Corporate treasury allocations (Tesla, MicroStrategy)
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Investment products (ETFs, futures)
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Payment processing integration
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Custody services for institutions
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regulatory Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Regulatory Integration ⚖️
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Governments worldwide are working to integrate crypto into existing regulatory frameworks:</p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-3 border rounded-lg">
                <strong>📊 CBDCs</strong>
                <p className="text-sm text-muted-foreground">Central Bank Digital Currencies</p>
              </div>
              <div className="p-3 border rounded-lg">
                <strong>🏦 Stablecoin Rules</strong>
                <p className="text-sm text-muted-foreground">Regulatory frameworks</p>
              </div>
              <div className="p-3 border rounded-lg">
                <strong>💰 Tax Compliance</strong>
                <p className="text-sm text-muted-foreground">Clear requirements</p>
              </div>
              <div className="p-3 border rounded-lg">
                <strong>🛡️ Consumer Protection</strong>
                <p className="text-sm text-muted-foreground">Safety measures</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Economic Functions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Economic Functions 💼
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Crypto markets serve several important economic functions:</p>
            <div className="grid gap-4">
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border">
                <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300">Value Transfer</h4>
                  <p className="text-sm">Enabling fast, low-cost international transactions</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-700 dark:text-green-300">Store of Value</h4>
                  <p className="text-sm">Providing an alternative to traditional savings</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-lg border">
                <Lightbulb className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-purple-700 dark:text-purple-300">Capital Formation</h4>
                  <p className="text-sm">Funding innovation through token sales and DeFi</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-lg border">
                <Target className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-orange-700 dark:text-orange-300">Price Discovery</h4>
                  <p className="text-sm">Determining fair value for digital assets</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reality Check - Challenges */}
        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
              <AlertTriangle className="h-5 w-5" />
              Reality Check: Challenges & Limitations ⚠️
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-orange-800 dark:text-orange-200">
              Despite their potential, crypto markets face several challenges that investors must understand:
            </p>
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Regulatory uncertainty across jurisdictions
              </div>
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Scalability limitations affecting transaction speeds
              </div>
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Environmental concerns with energy consumption
              </div>
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Security risks and sophisticated scam operations
              </div>
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Market manipulation concerns in less regulated spaces
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Future Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Future Integration 🔮
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">The future likely holds deeper integration between crypto and traditional finance:</p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
                <span className="font-medium">🔗 Hybrid financial products</span>
              </div>
              <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
                <span className="font-medium">📜 Blockchain-based securities</span>
              </div>
              <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
                <span className="font-medium">🌉 Cross-chain interoperability</span>
              </div>
              <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
                <span className="font-medium">📋 Improved regulatory clarity</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Takeaways */}
        <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <Target className="h-5 w-5" />
              Key Takeaways 🎯
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs px-2 py-1 mt-0.5">1</Badge>
                <span>Crypto markets complement rather than replace traditional finance</span>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs px-2 py-1 mt-0.5">2</Badge>
                <span>They offer unique characteristics and opportunities for diversification</span>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs px-2 py-1 mt-0.5">3</Badge>
                <span>Institutional adoption is driving mainstream acceptance and legitimacy</span>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs px-2 py-1 mt-0.5">4</Badge>
                <span>Integration with traditional finance is accelerating across all sectors</span>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs px-2 py-1 mt-0.5">5</Badge>
                <span>Understanding both systems is crucial for modern financial literacy</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ArticleLayout>
  );
};

export default CryptoMarketRole;