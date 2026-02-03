import { ArrowLeft, AlertTriangle, TrendingDown, Shield, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ArticleLayout from "@/components/ArticleLayout";

const ShortfallsOfCrypto = () => {
  return (
    <ArticleLayout
      title="Shortfalls of Crypto"
      level="Advanced · Understanding Risks"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Important Context:</strong> The blockchain and cryptocurrency technology itself is revolutionary and sound. However, like any powerful technology, it has been exploited by bad actors for quick profits at the expense of others.
          </AlertDescription>
        </Alert>

        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed">
            While blockchain technology represents one of the most significant innovations in modern finance, its rapid adoption has also attracted opportunists looking to exploit uninformed investors. Understanding these pitfalls is crucial for making informed decisions.
          </p>
        </div>

        {/* Memecoin Frenzy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              The Memecoin Frenzy
            </CardTitle>
            <CardDescription>
              How joke currencies became speculation vehicles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose max-w-none">
              <h4>What Are Memecoins?</h4>
              <p>
                Memecoins are cryptocurrencies created based on internet memes or jokes, often with no underlying utility or serious development team. While some started as harmless fun, they've become vehicles for speculation and market manipulation.
              </p>
              
              <h4>The Problem</h4>
              <ul>
                <li><strong>Pump and Dump Schemes:</strong> Coordinated efforts to artificially inflate prices before selling</li>
                <li><strong>Celebrity Endorsements:</strong> Influencers promoting tokens they don't understand</li>
                <li><strong>FOMO Marketing:</strong> Creating artificial urgency and fear of missing out</li>
                <li><strong>Lack of Utility:</strong> No real-world use case beyond speculation</li>
              </ul>
              
              <h4>Red Flags to Watch For</h4>
              <ul>
                <li>Promises of guaranteed returns</li>
                <li>Anonymous development teams</li>
                <li>Heavy social media promotion without substance</li>
                <li>Pressure to "buy now before it's too late"</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* NFT Bubble */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              The NFT Bubble
            </CardTitle>
            <CardDescription>
              How digital ownership technology was turned into speculation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose max-w-none">
              <h4>NFT Technology vs. NFT Speculation</h4>
              <p>
                Non-Fungible Tokens (NFTs) represent a legitimate breakthrough in digital ownership and provenance. The technology enables verifiable ownership of digital assets, which has applications in gaming, art, music, and intellectual property.
              </p>
              
              <h4>How It Was Exploited</h4>
              <ul>
                <li><strong>Artificial Scarcity:</strong> Creating perceived value through limited quantities</li>
                <li><strong>Celebrity Cash Grabs:</strong> Famous people launching projects without ongoing commitment</li>
                <li><strong>Wash Trading:</strong> Fake sales to inflate apparent market value</li>
                <li><strong>Utility Promises:</strong> Vague promises of future benefits that never materialized</li>
              </ul>
              
              <h4>Legitimate Use Cases (The Real Potential)</h4>
              <ul>
                <li><strong>Digital Identity:</strong> Verified credentials and certificates</li>
                <li><strong>Gaming Assets:</strong> True ownership of in-game items across platforms</li>
                <li><strong>Intellectual Property:</strong> Proof of creation and ownership</li>
                <li><strong>Event Tickets:</strong> Preventing fraud and enabling resale markets</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Why the Technology Remains Sound */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Shield className="h-5 w-5" />
              Why the Underlying Technology Remains Sound
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose max-w-none text-green-800">
              <h4>Separating Technology from Speculation</h4>
              <p>
                The key is understanding that blockchain technology's fundamental properties—decentralization, transparency, and immutability—remain revolutionary regardless of how they've been misused.
              </p>
              
              <h4>Legitimate Applications Continuing to Develop</h4>
              <ul>
                <li><strong>DeFi Protocols:</strong> Providing real financial services without intermediaries</li>
                <li><strong>Supply Chain Tracking:</strong> Ensuring authenticity and reducing fraud</li>
                <li><strong>Cross-border Payments:</strong> Enabling faster, cheaper international transfers</li>
                <li><strong>Smart Contracts:</strong> Automating agreements and reducing legal costs</li>
              </ul>
              
              <h4>How to Distinguish Good from Bad</h4>
              <ul>
                <li>Look for projects solving real problems</li>
                <li>Evaluate the team's experience and track record</li>
                <li>Understand the actual utility of the token or service</li>
                <li>Be skeptical of get-rich-quick promises</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Key Takeaways */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              Key Takeaways
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Remember These Principles:</h4>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-1 flex-shrink-0" />
                    Blockchain technology is fundamentally sound and revolutionary
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-1 flex-shrink-0" />
                    Bad actors exploit new technologies—this doesn't invalidate the technology
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-1 flex-shrink-0" />
                    Focus on utility and real-world applications, not speculation
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-1 flex-shrink-0" />
                    Education and due diligence are your best defenses
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Learning */}
        <Card className="bg-gradient-to-r from-purple-50 to-cyan-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-900">Continue Your Learning Journey</CardTitle>
            <CardDescription className="text-purple-700">
              You've completed the core learning modules! Understanding both the potential and pitfalls of crypto gives you the knowledge to make informed decisions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/learn/understanding-markets" className="flex-1">
                <Button variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50">
                  Explore Market Analysis
                </Button>
              </Link>
              <Link to="/learn-now" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white">
                  Return to Learning Hub
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Ready to Practice */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">Ready to Put This Into Practice?</CardTitle>
            <CardDescription className="text-green-700">
              With a complete understanding of both opportunities and risks, you're prepared to make informed decisions about digital assets.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/" className="flex-1">
                <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
                  Explore TVC
                </Button>
              </Link>
              <Link to="/white-paper" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                  Read Our White Paper
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-gray-200">
          <Link to="/learn/understanding-markets">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Previous: Understanding Markets
            </Button>
          </Link>
          <Link to="/learn-now">
            <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white">
              Back to Learning Hub
            </Button>
          </Link>
        </div>
      </div>
    </ArticleLayout>
  );
};

export default ShortfallsOfCrypto;