import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navigation from "@/components/Navigation";

const FAQ = () => {
  const faqs = [
    {
      question: "What is Sequence Theory?",
      answer: "Sequence Theory is focused on building accessible tools and services that onboard everyday users into decentralized finance. Our flagship platform, TVC (The Vault Club), bridges DeFi and long-term retail wealth building."
    },
    {
      question: "What is TVC (The Vault Club)?",
      answer: "TVC is a decentralized software coordination platform — the 'subscription to your future.' It transforms 'managerial effort' into 'deterministic code,' offering Web2 ease with Web3 infrastructure. Users select Risk & Rigor levels, and smart contracts handle the rest automatically."
    },
    {
      question: "Is TVC non-custodial?",
      answer: "Yes, 100% non-custodial. Your private keys are generated client-side and are never accessible to Sequence Theory. You maintain complete control of your funds at all times. Your Money. Your Power."
    },
    {
      question: "How does TVC work?",
      answer: "Users don't 'trade' — they select Risk & Rigor levels that dictate fund distribution across established DeFi protocols. Conservative uses Aave V3 for stablecoin lending, Medium uses sUSDC for savings rates, and Risky accesses Morpho's institutional-grade vaults. Once deployed, contract logic is deterministic and immutable."
    },
    {
      question: "Who is TVC for?",
      answer: "TVC is designed for the next generation of 'set-and-forget' investors who want to build long-term wealth through DeFi without the complexity. It's not a tool for speculation — it's a tool for structured discipline."
    },
    {
      question: "What does it cost?",
      answer: "Simple, transparent pricing: $1.50 per user per week ($0.50 for gas fees + $1.00 utility fee). No hidden costs, no percentage-based fees on your gains."
    },
    {
      question: "Do I need to understand crypto to use TVC?",
      answer: "No! TVC provides a Web2 feel with Web3 infrastructure. Sign in with Email or Passkey — no seed phrases to manage. Our 'Earn While You Learn' approach embeds education directly into the experience through integrations with LearnWeb3, Coinbase Education, and other platforms."
    },
    {
      question: "Can I withdraw my funds?",
      answer: "Emergency liquidity is built in. However, profits are not earned if deposits are withdrawn before contract conclusion. TVC encourages structured, long-term participation."
    },
    {
      question: "Is this financial advice?",
      answer: "No. Everything we provide is for education only. We teach you how to think about decentralized finance and empower self-directed financial decisions."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navigation />
      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about Sequence Theory and TVC
            </p>
          </div>

          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl text-center">FAQ</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-primary/20">
                    <AccordionTrigger className="text-left hover:text-primary transition-smooth">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Have a question that's not answered here?
            </p>
            <button 
              onClick={() => document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-primary hover:text-primary-glow transition-smooth font-medium"
            >
              Contact us at sequencetheoryinc@gmail.com
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;