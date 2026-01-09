import ArticleLayout from "@/components/ArticleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, Shield, Calculator, Lightbulb, Building2, PiggyBank, BarChart3, Brain, Smartphone, RefreshCw, AlertTriangle, CheckCircle, Coins, Home, Calendar } from "lucide-react";

const FinancialStrategyPlanning = () => {
  return (
    <ArticleLayout
      title="Financial Strategy & Planning"
      level="Advanced"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Strategic Financial Planning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">
              Effective financial planning is the foundation of wealth building. It involves setting clear goals,
              understanding your resources, and creating actionable strategies to achieve financial success.
            </p>
          </CardContent>
        </Card>

        {/* Financial Goal Setting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Financial Goal Setting 🎯
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Successful financial planning starts with clear, measurable objectives:</p>
            <div className="grid gap-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg border">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  🎯 SMART Goals Framework
                </h4>
                <p className="text-sm">Specific, Measurable, Achievable, Relevant, Time-bound objectives</p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-900/20 rounded-lg border">
                  <h5 className="font-semibold text-green-700 dark:text-green-300 mb-1">📅 Short-term (1-2 years)</h5>
                  <p className="text-sm">Emergency fund, debt reduction</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-950/20 dark:to-orange-900/20 rounded-lg border">
                  <h5 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-1">🏠 Medium-term (3-10 years)</h5>
                  <p className="text-sm">Home purchase, education funding</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/20 dark:to-violet-900/20 rounded-lg border">
                  <h5 className="font-semibold text-purple-700 dark:text-purple-300 mb-1">🌅 Long-term (10+ years)</h5>
                  <p className="text-sm">Retirement, generational wealth</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Asset Allocation Strategy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Asset Allocation Strategy 📊
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Diversifying across different asset classes to optimize risk-adjusted returns:</p>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border">
                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <strong className="text-blue-700 dark:text-blue-300">📈 Stocks:</strong>
                  <p className="text-sm mt-1">Growth potential with higher volatility</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <strong className="text-green-700 dark:text-green-300">🏦 Bonds:</strong>
                  <p className="text-sm mt-1">Stability and income generation</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-lg border">
                <Home className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <strong className="text-orange-700 dark:text-orange-300">🏘️ Real Estate:</strong>
                  <p className="text-sm mt-1">Inflation hedge and cash flow</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-lg border">
                <Coins className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <strong className="text-purple-700 dark:text-purple-300">💎 Alternative Investments:</strong>
                  <p className="text-sm mt-1">Private equity, hedge funds, crypto</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Management Framework */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Risk Management Framework 🛡️
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Protecting wealth through comprehensive risk assessment:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-red-50 to-pink-100 dark:from-red-950/20 dark:to-pink-900/20 rounded-lg border">
                <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">🛡️ Insurance Coverage</h4>
                <p className="text-sm">Life, disability, property, liability protection</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-900/20 rounded-lg border">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">💰 Emergency Fund</h4>
                <p className="text-sm">3-6 months of expenses in liquid assets</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-teal-100 dark:from-green-950/20 dark:to-teal-900/20 rounded-lg border">
                <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">🌐 Diversification</h4>
                <p className="text-sm">Spreading risk across investments</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/20 dark:to-violet-900/20 rounded-lg border">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">🔄 Regular Review</h4>
                <p className="text-sm">Adjusting strategy as circumstances change</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax Optimization Strategies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Tax Optimization Strategies 💸
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Minimizing tax burden through legal strategies:</p>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <strong>Tax-Advantaged Accounts:</strong> 401(k), IRA, HSA contributions
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <strong>Tax-Loss Harvesting:</strong> Offsetting gains with losses
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <strong>Asset Location:</strong> Placing investments in optimal account types
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <strong>Timing Strategies:</strong> Managing when to realize gains and losses
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Philosophy Development */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Investment Philosophy Development 💡
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Creating a consistent approach to investment decisions:</p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-3 border rounded-lg">
                <strong>📊 Value vs. Growth</strong>
                <p className="text-sm text-muted-foreground">Understanding different investment styles</p>
              </div>
              <div className="p-3 border rounded-lg">
                <strong>🤖 Active vs. Passive</strong>
                <p className="text-sm text-muted-foreground">Choosing management approaches</p>
              </div>
              <div className="p-3 border rounded-lg">
                <strong>⏰ Market Timing</strong>
                <p className="text-sm text-muted-foreground">Recognizing the challenges of timing markets</p>
              </div>
              <div className="p-3 border rounded-lg">
                <strong>🎯 Long-term Focus</strong>
                <p className="text-sm text-muted-foreground">Avoiding emotional decision-making</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estate Planning Fundamentals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Estate Planning Fundamentals 🏛️
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Ensuring wealth transfer and legacy protection:</p>
            <div className="grid gap-4">
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-lg border">
                <Building2 className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-700 dark:text-amber-300">Wills and Trusts</h4>
                  <p className="text-sm">Legal documents for asset distribution</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border">
                <Target className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-700 dark:text-green-300">Beneficiary Planning</h4>
                  <p className="text-sm">Keeping designations updated</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border">
                <Calculator className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300">Tax Minimization</h4>
                  <p className="text-sm">Strategies to reduce estate taxes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cash Flow Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-primary" />
              Cash Flow Management 💰
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Optimizing income and expenses for wealth building:</p>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Calculator className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <strong>Budget Creation:</strong> Understanding income and expense patterns
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Target className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <strong>Debt Strategy:</strong> Prioritizing high-interest debt elimination
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <PiggyBank className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <strong>Savings Rate:</strong> Maximizing the percentage of income saved
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <strong>Income Growth:</strong> Strategies for increasing earning potential
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reality Check - Behavioral Finance */}
        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
              <AlertTriangle className="h-5 w-5" />
              Reality Check: Behavioral Finance Awareness 🧠
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-orange-800 dark:text-orange-200">
              Understanding psychological biases that affect financial decisions:
            </p>
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <strong>Loss Aversion:</strong> Tendency to avoid losses more than seeking gains
              </div>
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <strong>Confirmation Bias:</strong> Seeking information that confirms beliefs
              </div>
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <strong>Overconfidence:</strong> Overestimating ability to predict outcomes
              </div>
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <strong>Herd Mentality:</strong> Following crowd behavior in markets
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Technology Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              Financial Technology Integration 📱
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Leveraging technology for better financial management:</p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
                <span className="font-medium">🤖 Robo-Advisors</span>
                <p className="text-sm text-muted-foreground">Automated portfolio management</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
                <span className="font-medium">📱 Financial Apps</span>
                <p className="text-sm text-muted-foreground">Budgeting and expense tracking tools</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
                <span className="font-medium">💻 Investment Platforms</span>
                <p className="text-sm text-muted-foreground">Low-cost trading and investing</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
                <span className="font-medium">📊 Financial Analytics</span>
                <p className="text-sm text-muted-foreground">Data-driven decision making</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regular Strategy Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Regular Strategy Review 🔄
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Maintaining and updating your financial plan:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 rounded-lg border">
                <Calendar className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <strong className="text-indigo-700 dark:text-indigo-300">Annual Review</strong>
                  <p className="text-sm">Comprehensive plan evaluation</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border">
                <Target className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <strong className="text-green-700 dark:text-green-300">Goal Adjustment</strong>
                  <p className="text-sm">Updating objectives as needed</p>
                </div>
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
                <span>Strategic planning is essential for long-term financial success</span>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs px-2 py-1 mt-0.5">2</Badge>
                <span>Diversification and risk management protect and grow wealth</span>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs px-2 py-1 mt-0.5">3</Badge>
                <span>Tax optimization can significantly impact long-term returns</span>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs px-2 py-1 mt-0.5">4</Badge>
                <span>Behavioral awareness helps avoid costly psychological mistakes</span>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs px-2 py-1 mt-0.5">5</Badge>
                <span>Regular review and adjustment keep plans on track for success</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ArticleLayout>
  );
};

export default FinancialStrategyPlanning;