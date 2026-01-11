/**
 * FAQ PREVIEW COMPONENT
 * 
 * Shows 2-3 common questions on the home page with a CTA to view all FAQs.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, HelpCircle, ArrowRight } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQPreview: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "What is The Vault Club?",
      answer: "The Vault Club is a private, automated investment system designed for long-term capital growth. It's a 'Set & Forget' approach — you make regular contributions and the system handles everything else, from compounding to wealth preservation."
    },
    {
      question: "Is my money safe? Who controls my funds?",
      answer: "You maintain full control of your funds at all times. The system acts as an automated coordinator — not a custodian or bank. Your investments work for you automatically while you retain complete ownership."
    },
    {
      question: "How much does it cost?",
      answer: "Simple, transparent pricing: $1.50 per user per week ($0.50 for gas fees + $1.00 utility fee). No hidden costs, no percentage-based fees on your gains."
    }
  ];

  return (
    <div className="space-y-6">
      {/* FAQ Items */}
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div 
            key={index}
            className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/30"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <span className="font-medium text-foreground pr-4">{faq.question}</span>
              <div className="flex-shrink-0">
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-primary" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-5 pb-5 pt-0">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* CTA Button */}
      <div className="text-center">
        <Link to="/faq">
          <Button className="rounded-full px-8" variant="outline">
            <HelpCircle className="mr-2 h-4 w-4" />
            View All FAQs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FAQPreview;
