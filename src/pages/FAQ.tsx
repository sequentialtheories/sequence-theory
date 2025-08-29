import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What is Sequence Theory?",
      answer: "Sequence Theory is an educational platform designed to ease people into investing through comprehensive financial education and practical tools."
    },
    {
      question: "How does The Vault Club work?",
      answer: "The Vault Club provides members with access to educational resources, investment tools, and a community of learners focused on building financial literacy and wealth."
    },
    {
      question: "Is this financial advice?",
      answer: "No, the content provided by Sequence Theory is for educational purposes only and should not be considered as financial advice. Always consult with a qualified financial advisor before making investment decisions."
    },
    {
      question: "How do I get started?",
      answer: "You can get started by signing up for The Vault Club through our platform. Once registered, you'll have access to our educational modules and learning resources."
    },
    {
      question: "What kind of education do you provide?",
      answer: "We provide comprehensive financial education covering topics from basic financial literacy to advanced investment strategies, blockchain technology, and digital assets."
    },
    {
      question: "Is there a cost to join?",
      answer: "Please contact us for current pricing information and membership options."
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
              Contact us through The Vault Club
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;