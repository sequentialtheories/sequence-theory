import ArticleLayout from "@/components/ArticleLayout";

const FinancialBasics = () => {
  return (
    <ArticleLayout title="Financial Basics" level="Beginner">
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900">Understanding Money and Wealth</h2>
        
        <div className="bg-cyan-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-cyan-800">What is Money, Really?</h3>
          <p className="text-gray-700 mb-4">
            Think of money like a tool - just like a hammer helps you build things, money helps you get what you need and want. 
            But here's the thing: money sitting in your piggy bank doesn't grow by itself. It's like having seeds that never get planted.
          </p>
          <p className="text-gray-700">
            The key is understanding that money has a special power called "purchasing power." This means how much stuff you can buy with your money. 
            Unfortunately, because of something called inflation (prices going up over time), your money can actually buy less stuff each year if you just keep it under your mattress.
          </p>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">The Magic of Making Your Money Work</h3>
        
        <p className="text-gray-700">
          Imagine you have a helper who works for you 24/7, even while you sleep. That's what investing is like! 
          When you invest your money, you're essentially hiring it to go out and make more money for you.
        </p>

        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-purple-800">The Compound Interest Superpower</h4>
          <p className="text-gray-700 mb-4">
            Here's where it gets really exciting. Let's say you plant a magic seed (invest $100) that grows 10% each year:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Year 1: Your $100 becomes $110</li>
            <li>Year 2: Your $110 becomes $121 (not just $120!)</li>
            <li>Year 3: Your $121 becomes $133</li>
            <li>After 10 years: Your $100 becomes $259!</li>
          </ul>
          <p className="text-gray-700 mt-4">
            This is compound interest - you earn money not just on your original investment, but also on the money your investment already made. 
            It's like your money having babies, and then those babies having babies!
          </p>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Risk: The Price of Opportunity</h3>
        
        <p className="text-gray-700 mb-4">
          Every investment has risk - that's just the entrance fee for the possibility of making money. 
          Think of it like crossing a street: there's always some risk, but you can look both ways and cross at the crosswalk to be safer.
        </p>

        <div className="bg-yellow-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-yellow-800">The Risk-Reward Seesaw</h4>
          <p className="text-gray-700">
            Generally, the more risk you take, the more reward you might get - but you might also lose more. 
            It's like a seesaw: high risk on one side usually means high potential reward on the other. 
            The trick is finding the right balance for your situation.
          </p>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Building Your Financial Foundation</h3>
        
        <p className="text-gray-700 mb-4">
          Before you start investing, you need a solid foundation - like building a house. Here's your financial foundation checklist:
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 text-green-800">Emergency Fund</h4>
            <p className="text-gray-700">
              Keep 3-6 months of expenses in a savings account. This is your financial safety net - 
              like having a spare tire in your car. You hope you never need it, but you'll be glad it's there when you do.
            </p>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 text-blue-800">Clear Goals</h4>
            <p className="text-gray-700">
              Know what you're saving for. Are you building wealth for retirement? Saving for a house? 
              Different goals need different strategies - like using different tools for different jobs.
            </p>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Why This Matters for Digital Assets</h3>
        
        <p className="text-gray-700 mb-4">
          Digital assets (like cryptocurrencies) follow the same basic principles as traditional investing, but they can be much more volatile. 
          That means the prices go up and down like a roller coaster - much more than stocks or bonds.
        </p>

        <div className="bg-red-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-red-800">The Digital Asset Reality Check</h4>
          <p className="text-gray-700">
            Many people jump into digital assets without understanding basic financial principles. 
            It's like trying to run before you can walk. By understanding these fundamentals first, 
            you'll be much better prepared to navigate the exciting but challenging world of digital assets.
          </p>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Your Next Steps</h3>
        
        <p className="text-gray-700 mb-4">
          Now that you understand the basics, you're ready to learn about digital assets specifically. 
          Remember: investing is a marathon, not a sprint. Take your time, keep learning, and never invest money you can't afford to lose.
        </p>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">Key Takeaways</h4>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Money is a tool that should work for you, not just sit idle</li>
            <li>Compound interest is your best friend - start early and be consistent</li>
            <li>All investments have risk - the key is managing it wisely</li>
            <li>Build your emergency fund before you start investing</li>
            <li>Have clear goals for your money</li>
          </ul>
        </div>
      </div>
    </ArticleLayout>
  );
};

export default FinancialBasics;
