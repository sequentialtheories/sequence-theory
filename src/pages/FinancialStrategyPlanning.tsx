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

        {/* Quiz Section */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Brain className="h-6 w-6 text-primary" />
              Financial Strategy & Planning Quiz 🧠
            </CardTitle>
            <p className="text-muted-foreground">
              Test your understanding of financial strategy and planning concepts. Each question is based on key takeaways from the sections above.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              
              {/* Question 1 - SMART Goals */}
              <div className="p-4 border rounded-lg bg-card">
                <div className="flex items-start gap-3 mb-3">
                  <Badge variant="outline" className="mt-1">1</Badge>
                  <div className="flex-1">
                    <p className="font-medium mb-2">What does the "S" in SMART goals stand for in financial planning?</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q1" value="a" className="w-4 h-4" />
                        <label>Simple</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q1" value="b" className="w-4 h-4" />
                        <label>Specific</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q1" value="c" className="w-4 h-4" />
                        <label>Strategic</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q1" value="d" className="w-4 h-4" />
                        <label>Stable</label>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">Source: Financial Goal Setting section - "SMART Goals Framework: Specific, Measurable, Achievable, Relevant, Time-bound objectives"</p>
                  </div>
                </div>
              </div>

              {/* Question 2 - Emergency Fund */}
              <div className="p-4 border rounded-lg bg-card">
                <div className="flex items-start gap-3 mb-3">
                  <Badge variant="outline" className="mt-1">2</Badge>
                  <div className="flex-1">
                    <p className="font-medium mb-2">How many months of expenses should an emergency fund typically cover?</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q2" value="a" className="w-4 h-4" />
                        <label>1-2 months</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q2" value="b" className="w-4 h-4" />
                        <label>3-6 months</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q2" value="c" className="w-4 h-4" />
                        <label>8-12 months</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q2" value="d" className="w-4 h-4" />
                        <label>12-18 months</label>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">Source: Risk Management Framework section - "Emergency Fund: 3-6 months of expenses in liquid assets"</p>
                  </div>
                </div>
              </div>

              {/* Question 3 - Asset Classes */}
              <div className="p-4 border rounded-lg bg-card">
                <div className="flex items-start gap-3 mb-3">
                  <Badge variant="outline" className="mt-1">3</Badge>
                  <div className="flex-1">
                    <p className="font-medium mb-2">Which asset class is typically considered to provide "stability and income generation"?</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q3" value="a" className="w-4 h-4" />
                        <label>Stocks</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q3" value="b" className="w-4 h-4" />
                        <label>Bonds</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q3" value="c" className="w-4 h-4" />
                        <label>Real Estate</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q3" value="d" className="w-4 h-4" />
                        <label>Alternative Investments</label>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">Source: Asset Allocation Strategy section - "Bonds: Stability and income generation"</p>
                  </div>
                </div>
              </div>

              {/* Question 4 - Time Horizons */}
              <div className="p-4 border rounded-lg bg-card">
                <div className="flex items-start gap-3 mb-3">
                  <Badge variant="outline" className="mt-1">4</Badge>
                  <div className="flex-1">
                    <p className="font-medium mb-2">What time frame is considered "medium-term" for financial goals?</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q4" value="a" className="w-4 h-4" />
                        <label>1-2 years</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q4" value="b" className="w-4 h-4" />
                        <label>3-10 years</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q4" value="c" className="w-4 h-4" />
                        <label>10-15 years</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q4" value="d" className="w-4 h-4" />
                        <label>15+ years</label>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">Source: Financial Goal Setting section - "Medium-term (3-10 years): Home purchase, education funding"</p>
                  </div>
                </div>
              </div>

              {/* Question 5 - Tax Strategies */}
              <div className="p-4 border rounded-lg bg-card">
                <div className="flex items-start gap-3 mb-3">
                  <Badge variant="outline" className="mt-1">5</Badge>
                  <div className="flex-1">
                    <p className="font-medium mb-2">Which tax optimization strategy involves "offsetting gains with losses"?</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q5" value="a" className="w-4 h-4" />
                        <label>Asset Location</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q5" value="b" className="w-4 h-4" />
                        <label>Tax-Loss Harvesting</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q5" value="c" className="w-4 h-4" />
                        <label>Timing Strategies</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q5" value="d" className="w-4 h-4" />
                        <label>Tax-Advantaged Accounts</label>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">Source: Tax Optimization Strategies section - "Tax-Loss Harvesting: Offsetting gains with losses"</p>
                  </div>
                </div>
              </div>

              {/* Question 6 - Investment Philosophy */}
              <div className="p-4 border rounded-lg bg-card">
                <div className="flex items-start gap-3 mb-3">
                  <Badge variant="outline" className="mt-1">6</Badge>
                  <div className="flex-1">
                    <p className="font-medium mb-2">What is a key challenge associated with market timing mentioned in investment philosophy development?</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q6" value="a" className="w-4 h-4" />
                        <label>It requires too much capital</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q6" value="b" className="w-4 h-4" />
                        <label>It's difficult to predict market movements</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q6" value="c" className="w-4 h-4" />
                        <label>It's only for professional investors</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q6" value="d" className="w-4 h-4" />
                        <label>It requires special licenses</label>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">Source: Investment Philosophy Development section - "Market Timing: Recognizing the challenges of timing markets"</p>
                  </div>
                </div>
              </div>

              {/* Question 7 - Estate Planning */}
              <div className="p-4 border rounded-lg bg-card">
                <div className="flex items-start gap-3 mb-3">
                  <Badge variant="outline" className="mt-1">7</Badge>
                  <div className="flex-1">
                    <p className="font-medium mb-2">What are the primary estate planning documents for asset distribution?</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q7" value="a" className="w-4 h-4" />
                        <label>Insurance policies and beneficiary forms</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q7" value="b" className="w-4 h-4" />
                        <label>Wills and Trusts</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q7" value="c" className="w-4 h-4" />
                        <label>Investment accounts and retirement plans</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q7" value="d" className="w-4 h-4" />
                        <label>Tax returns and financial statements</label>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">Source: Estate Planning Fundamentals section - "Wills and Trusts: Legal documents for asset distribution"</p>
                  </div>
                </div>
              </div>

              {/* Question 8 - Cash Flow Management */}
              <div className="p-4 border rounded-lg bg-card">
                <div className="flex items-start gap-3 mb-3">
                  <Badge variant="outline" className="mt-1">8</Badge>
                  <div className="flex-1">
                    <p className="font-medium mb-2">In cash flow management, what should be prioritized for debt strategy?</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q8" value="a" className="w-4 h-4" />
                        <label>Paying off all debts equally</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q8" value="b" className="w-4 h-4" />
                        <label>High-interest debt elimination</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q8" value="c" className="w-4 h-4" />
                        <label>Mortgage payments first</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q8" value="d" className="w-4 h-4" />
                        <label>Largest balance debts</label>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">Source: Cash Flow Management section - "Debt Strategy: Prioritizing high-interest debt elimination"</p>
                  </div>
                </div>
              </div>

              {/* Question 9 - Behavioral Finance */}
              <div className="p-4 border rounded-lg bg-card">
                <div className="flex items-start gap-3 mb-3">
                  <Badge variant="outline" className="mt-1">9</Badge>
                  <div className="flex-1">
                    <p className="font-medium mb-2">What behavioral bias involves "seeking information that confirms beliefs"?</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q9" value="a" className="w-4 h-4" />
                        <label>Loss Aversion</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q9" value="b" className="w-4 h-4" />
                        <label>Confirmation Bias</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q9" value="c" className="w-4 h-4" />
                        <label>Overconfidence</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q9" value="d" className="w-4 h-4" />
                        <label>Herd Mentality</label>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">Source: Reality Check section - "Confirmation Bias: Seeking information that confirms beliefs"</p>
                  </div>
                </div>
              </div>

              {/* Question 10 - Financial Technology */}
              <div className="p-4 border rounded-lg bg-card">
                <div className="flex items-start gap-3 mb-3">
                  <Badge variant="outline" className="mt-1">10</Badge>
                  <div className="flex-1">
                    <p className="font-medium mb-2">What fintech tool provides "automated portfolio management"?</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q10" value="a" className="w-4 h-4" />
                        <label>Financial Apps</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q10" value="b" className="w-4 h-4" />
                        <label>Investment Platforms</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q10" value="c" className="w-4 h-4" />
                        <label>Robo-Advisors</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q10" value="d" className="w-4 h-4" />
                        <label>Financial Analytics</label>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">Source: Financial Technology Integration section - "Robo-Advisors: Automated portfolio management"</p>
                  </div>
                </div>
              </div>

              {/* Question 11 - Review Frequency */}
              <div className="p-4 border rounded-lg bg-card">
                <div className="flex items-start gap-3 mb-3">
                  <Badge variant="outline" className="mt-1">11</Badge>
                  <div className="flex-1">
                    <p className="font-medium mb-2">According to the strategy review section, how often should financial plans be comprehensively reviewed?</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q11" value="a" className="w-4 h-4" />
                        <label>Monthly</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q11" value="b" className="w-4 h-4" />
                        <label>Quarterly</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q11" value="c" className="w-4 h-4" />
                        <label>Annually</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q11" value="d" className="w-4 h-4" />
                        <label>Every 5 years</label>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">Source: Regular Strategy Review section - "Annual comprehensive plan reviews"</p>
                  </div>
                </div>
              </div>

              {/* Question 12 - Alternative Investments */}
              <div className="p-4 border rounded-lg bg-card">
                <div className="flex items-start gap-3 mb-3">
                  <Badge variant="outline" className="mt-1">12</Badge>
                  <div className="flex-1">
                    <p className="font-medium mb-2">Which of the following is NOT mentioned as an alternative investment?</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q12" value="a" className="w-4 h-4" />
                        <label>Private equity</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q12" value="b" className="w-4 h-4" />
                        <label>Hedge funds</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q12" value="c" className="w-4 h-4" />
                        <label>Government bonds</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q12" value="d" className="w-4 h-4" />
                        <label>Crypto</label>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">Source: Asset Allocation Strategy section - "Alternative Investments: Private equity, hedge funds, crypto"</p>
                  </div>
                </div>
              </div>

              {/* Question 13 - Insurance Types */}
              <div className="p-4 border rounded-lg bg-card">
                <div className="flex items-start gap-3 mb-3">
                  <Badge variant="outline" className="mt-1">13</Badge>
                  <div className="flex-1">
                    <p className="font-medium mb-2">Which insurance types are mentioned in the risk management framework?</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q13" value="a" className="w-4 h-4" />
                        <label>Life, health, auto, home</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q13" value="b" className="w-4 h-4" />
                        <label>Life, disability, property, liability</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q13" value="c" className="w-4 h-4" />
                        <label>Term, whole, universal, variable</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q13" value="d" className="w-4 h-4" />
                        <label>Personal, commercial, professional, travel</label>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">Source: Risk Management Framework section - "Insurance Coverage: Life, disability, property, liability protection"</p>
                  </div>
                </div>
              </div>

              {/* Question 14 - Long-term Focus */}
              <div className="p-4 border rounded-lg bg-card">
                <div className="flex items-start gap-3 mb-3">
                  <Badge variant="outline" className="mt-1">14</Badge>
                  <div className="flex-1">
                    <p className="font-medium mb-2">What does "long-term focus" help avoid in investment philosophy?</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q14" value="a" className="w-4 h-4" />
                        <label>High fees</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q14" value="b" className="w-4 h-4" />
                        <label>Emotional decision-making</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q14" value="c" className="w-4 h-4" />
                        <label>Tax implications</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q14" value="d" className="w-4 h-4" />
                        <label>Market volatility</label>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">Source: Investment Philosophy Development section - "Long-term Focus: Avoiding emotional decision-making"</p>
                  </div>
                </div>
              </div>

              {/* Question 15 - Real Estate Benefits */}
              <div className="p-4 border rounded-lg bg-card">
                <div className="flex items-start gap-3 mb-3">
                  <Badge variant="outline" className="mt-1">15</Badge>
                  <div className="flex-1">
                    <p className="font-medium mb-2">What two main benefits does real estate provide according to the asset allocation section?</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q15" value="a" className="w-4 h-4" />
                        <label>High returns and low volatility</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q15" value="b" className="w-4 h-4" />
                        <label>Inflation hedge and cash flow</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q15" value="c" className="w-4 h-4" />
                        <label>Tax advantages and liquidity</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q15" value="d" className="w-4 h-4" />
                        <label>Diversification and stability</label>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">Source: Asset Allocation Strategy section - "Real Estate: Inflation hedge and cash flow"</p>
                  </div>
                </div>
              </div>

              {/* Question 16 - Beneficiary Planning */}
              <div className="p-4 border rounded-lg bg-card">
                <div className="flex items-start gap-3 mb-3">
                  <Badge variant="outline" className="mt-1">16</Badge>
                  <div className="flex-1">
                    <p className="font-medium mb-2">What is emphasized about beneficiary designations in estate planning?</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q16" value="a" className="w-4 h-4" />
                        <label>They should be changed annually</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q16" value="b" className="w-4 h-4" />
                        <label>They should be kept updated</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q16" value="c" className="w-4 h-4" />
                        <label>They are only for retirement accounts</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q16" value="d" className="w-4 h-4" />
                        <label>They can't be changed once set</label>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">Source: Estate Planning Fundamentals section - "Beneficiary Planning: Keeping designations updated"</p>
                  </div>
                </div>
              </div>

              {/* Question 17 - Savings Rate */}
              <div className="p-4 border rounded-lg bg-card">
                <div className="flex items-start gap-3 mb-3">
                  <Badge variant="outline" className="mt-1">17</Badge>
                  <div className="flex-1">
                    <p className="font-medium mb-2">What aspect of savings rate is emphasized in cash flow management?</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q17" value="a" className="w-4 h-4" />
                        <label>Saving a fixed dollar amount</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q17" value="b" className="w-4 h-4" />
                        <label>Maximizing the percentage of income saved</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q17" value="c" className="w-4 h-4" />
                        <label>Saving only when income increases</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q17" value="d" className="w-4 h-4" />
                        <label>Saving based on market conditions</label>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">Source: Cash Flow Management section - "Savings Rate: Maximizing the percentage of income saved"</p>
                  </div>
                </div>
              </div>

              {/* Question 18 - Loss Aversion */}
              <div className="p-4 border rounded-lg bg-card">
                <div className="flex items-start gap-3 mb-3">
                  <Badge variant="outline" className="mt-1">18</Badge>
                  <div className="flex-1">
                    <p className="font-medium mb-2">How is loss aversion defined in behavioral finance?</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q18" value="a" className="w-4 h-4" />
                        <label>Fear of making any investments</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q18" value="b" className="w-4 h-4" />
                        <label>Tendency to avoid losses more than seeking gains</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q18" value="c" className="w-4 h-4" />
                        <label>Avoiding high-risk investments only</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q18" value="d" className="w-4 h-4" />
                        <label>Preference for guaranteed returns</label>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">Source: Reality Check section - "Loss Aversion: Tendency to avoid losses more than seeking gains"</p>
                  </div>
                </div>
              </div>

              {/* Question 19 - Asset Location */}
              <div className="p-4 border rounded-lg bg-card">
                <div className="flex items-start gap-3 mb-3">
                  <Badge variant="outline" className="mt-1">19</Badge>
                  <div className="flex-1">
                    <p className="font-medium mb-2">What does "asset location" refer to in tax optimization?</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q19" value="a" className="w-4 h-4" />
                        <label>Geographic location of investments</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q19" value="b" className="w-4 h-4" />
                        <label>Placing investments in optimal account types</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q19" value="c" className="w-4 h-4" />
                        <label>Choosing investment sectors</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q19" value="d" className="w-4 h-4" />
                        <label>Timing of investment purchases</label>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">Source: Tax Optimization Strategies section - "Asset Location: Placing investments in optimal account types"</p>
                  </div>
                </div>
              </div>

              {/* Question 20 - Key Takeaway Integration */}
              <div className="p-4 border rounded-lg bg-card">
                <div className="flex items-start gap-3 mb-3">
                  <Badge variant="outline" className="mt-1">20</Badge>
                  <div className="flex-1">
                    <p className="font-medium mb-2">According to the key takeaways, what should be the foundation of financial planning?</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q20" value="a" className="w-4 h-4" />
                        <label>Maximizing returns at all costs</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q20" value="b" className="w-4 h-4" />
                        <label>Following market trends</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q20" value="c" className="w-4 h-4" />
                        <label>Clear goals and consistent strategy</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="radio" name="q20" value="d" className="w-4 h-4" />
                        <label>Complex investment products</label>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">Source: Key Takeaways section - "Successful financial planning starts with clear, specific goals and consistent strategy"</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  <strong>Answer Key:</strong> 1-b, 2-b, 3-b, 4-b, 5-b, 6-b, 7-b, 8-b, 9-b, 10-c, 11-c, 12-c, 13-b, 14-b, 15-b, 16-b, 17-b, 18-b, 19-b, 20-c
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ArticleLayout>
  );
};

export default FinancialStrategyPlanning;