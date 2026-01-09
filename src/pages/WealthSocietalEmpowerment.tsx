import ArticleLayout from "@/components/ArticleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Users, Lightbulb, Heart, TrendingUp, Shield, Globe, Zap, AlertTriangle, Target, Building2, Coins, Handshake, GraduationCap, Briefcase } from "lucide-react";

const WealthSocietalEmpowerment = () => {
  return (
    <ArticleLayout
      title="Wealth & Societal Empowerment"
      level="Advanced"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              The Power of Wealth in Society
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">
              Wealth is more than personal prosperity—it's a tool for societal transformation and individual empowerment.
              Understanding this relationship is crucial for creating positive change in the world.
            </p>
          </CardContent>
        </Card>

        {/* Individual Empowerment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Individual Empowerment Through Wealth 💪
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Financial resources provide individuals with fundamental freedoms:</p>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg border">
                <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <strong className="text-blue-700 dark:text-blue-300">Time Freedom:</strong>
                  <p className="text-sm mt-1">Ability to choose how to spend your most valuable resource</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg border">
                <Target className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <strong className="text-green-700 dark:text-green-300">Choice Freedom:</strong>
                  <p className="text-sm mt-1">More options in life decisions and career paths</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg border">
                <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <strong className="text-purple-700 dark:text-purple-300">Risk-Taking Ability:</strong>
                  <p className="text-sm mt-1">Capacity to pursue opportunities without fear</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 rounded-lg border">
                <GraduationCap className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <strong className="text-orange-700 dark:text-orange-300">Education Access:</strong>
                  <p className="text-sm mt-1">Ability to invest in learning and skill development</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 rounded-lg border">
                <Shield className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <strong className="text-red-700 dark:text-red-300">Health Security:</strong>
                  <p className="text-sm mt-1">Access to better healthcare and wellness options</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wealth as a Vehicle for Change */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Wealth as a Vehicle for Change 🌍
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Accumulated wealth can be channeled toward positive societal impact:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-950/20 dark:to-rose-900/20 rounded-lg border">
                <h4 className="font-semibold text-pink-700 dark:text-pink-300 mb-2 flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  💝 Philanthropy
                </h4>
                <p className="text-sm">Direct charitable giving to meaningful causes</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950/20 dark:to-cyan-900/20 rounded-lg border">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  🏢 Social Enterprise
                </h4>
                <p className="text-sm">Businesses that solve social problems</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-900/20 rounded-lg border">
                <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  📈 Impact Investing
                </h4>
                <p className="text-sm">Investments that generate positive outcomes</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/20 dark:to-violet-900/20 rounded-lg border">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  🏛️ Policy Influence
                </h4>
                <p className="text-sm">Supporting legislation and advocacy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Breaking Cycles of Poverty */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Handshake className="h-5 w-5 text-primary" />
              Breaking Cycles of Poverty 🔗
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Wealth creation can help break intergenerational cycles of poverty:</p>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Providing educational opportunities for children
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Building financial literacy within families
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Creating generational wealth transfer
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Investing in community development
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Supporting local entrepreneurship
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Economic Multiplier Effects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Economic Multiplier Effects 📊
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Individual wealth creation has broader economic benefits:</p>
            <div className="grid gap-4">
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-lg border">
                <Briefcase className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-emerald-700 dark:text-emerald-300">Job Creation</h4>
                  <p className="text-sm">Wealthy individuals often create employment opportunities</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border">
                <Coins className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300">Consumer Spending</h4>
                  <p className="text-sm">Increased purchasing power drives economic demand</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 rounded-lg border">
                <Building2 className="h-5 w-5 text-violet-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-violet-700 dark:text-violet-300">Tax Revenue</h4>
                  <p className="text-sm">Higher incomes generate more public funds for services</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-lg border">
                <Lightbulb className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-orange-700 dark:text-orange-300">Innovation Support</h4>
                  <p className="text-sm">Resources to fund research and breakthrough development</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Democratizing Wealth Creation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Democratizing Wealth Creation 🌐
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Modern technology is making wealth creation more accessible:</p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-3 border rounded-lg">
                <strong>💎 Digital Assets</strong>
                <p className="text-sm text-muted-foreground">Lower barriers to investment participation</p>
              </div>
              <div className="p-3 border rounded-lg">
                <strong>📚 Online Education</strong>
                <p className="text-sm text-muted-foreground">Accessible financial literacy resources</p>
              </div>
              <div className="p-3 border rounded-lg">
                <strong>💰 Micro-Investing</strong>
                <p className="text-sm text-muted-foreground">Small amounts can grow over time</p>
              </div>
              <div className="p-3 border rounded-lg">
                <strong>🌍 Global Markets</strong>
                <p className="text-sm text-muted-foreground">Access to worldwide opportunities</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reality Check - Challenges */}
        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
              <AlertTriangle className="h-5 w-5" />
              Reality Check: Challenges & Responsibilities ⚠️
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-orange-800 dark:text-orange-200">
              With wealth comes responsibility and potential challenges that must be addressed:
            </p>
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Avoiding concentration of power in few hands
              </div>
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Ensuring fair distribution of opportunities
              </div>
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Preventing exploitation of others for personal gain
              </div>
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Managing wealth for long-term societal benefit
              </div>
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Addressing inequality and social justice issues
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Systemic Change */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Systemic Change Through Wealth 🔄
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Wealthy individuals and organizations can drive systemic improvements:</p>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <strong>Education Reform:</strong> Funding innovative educational approaches
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <strong>Healthcare Access:</strong> Supporting medical research and accessibility
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Globe className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <strong>Environmental Solutions:</strong> Investing in sustainable technologies
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Handshake className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <strong>Financial Inclusion:</strong> Creating access to financial services
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Building Wealth Communities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Building Wealth Communities 🤝
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Creating networks that support collective wealth building:</p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
                <span className="font-medium">📊 Investment clubs and groups</span>
              </div>
              <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
                <span className="font-medium">👥 Mentorship programs</span>
              </div>
              <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
                <span className="font-medium">🏘️ Community development initiatives</span>
              </div>
              <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
                <span className="font-medium">🤝 Cooperative business models</span>
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
                <span>Wealth is a tool for both individual freedom and societal transformation</span>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs px-2 py-1 mt-0.5">2</Badge>
                <span>Responsible wealth building benefits entire communities and ecosystems</span>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs px-2 py-1 mt-0.5">3</Badge>
                <span>Technology is democratizing access to wealth creation opportunities</span>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs px-2 py-1 mt-0.5">4</Badge>
                <span>With wealth comes the responsibility to create positive societal impact</span>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="text-xs px-2 py-1 mt-0.5">5</Badge>
                <span>Collective wealth building can address systemic inequalities effectively</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ArticleLayout>
  );
};

export default WealthSocietalEmpowerment;