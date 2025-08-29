import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What is Sequence Theory?",
      answer: "Sequence Theory helps everyday people learn about money and investing. We make it easy to understand and get started, even if you've never invested before."
    },
    {
      question: "What is The Vault Club?",
      answer: "The Vault Club is our investment system that automatically grows your money over time. You contribute regularly, and our system reinvests your funds to help them compound and grow."
    },
    {
      question: "How does it work exactly?",
      answer: "You set up regular contributions (like $50 a week), and our system automatically invests that money across different opportunities. It's designed to grow slowly and steadily over time without you having to manage it daily."
    },
    {
      question: "Who is this for?",
      answer: "This is for people who want to build wealth but don't know where to start, or those who want steady growth without the stress of day trading or managing complex investments."
    },
    {
      question: "Is this safe?",
      answer: "All investing has risks, but our approach focuses on steady, long-term growth rather than risky quick gains. We spread investments across multiple areas to reduce risk, and you maintain control over your contributions."
    },
    {
      question: "Do I need to know about crypto or investing?",
      answer: "Not at all! We teach you everything you need to know through simple lessons and modules. Our community also helps newcomers learn and feel confident."
    },
    {
      question: "How do I start?",
      answer: "Create an account, go through our 'Learn Now' section to understand the basics, then choose how much and how often you want to contribute. Join our Discord community for support along the way."
    },
    {
      question: "Is this financial advice?",
      answer: "No, everything we provide is for education only. We teach you how to think about money and investing, but you should talk to a financial advisor before making any major decisions."
    },
    {
      question: "What does it cost?",
      answer: "Sequence Theory provides educational content & community completely for free! While The Vault Club charges minimal utility fees, there is no upfront fee at all!"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-secondary py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about Sequence Theory and The Vault Club
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