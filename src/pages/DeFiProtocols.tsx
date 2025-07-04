
import ArticleLayout from "@/components/ArticleLayout";

const DeFiProtocols = () => {
  return (
    <ArticleLayout title="DeFi & Protocols" level="Advanced">
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900">What Is DeFi Really?</h2>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-blue-800">Traditional Finance vs. DeFi</h3>
          <p className="text-gray-700 mb-4">
            Imagine traditional banking like a big building with lots of employees handling your money. 
            You trust them to keep your savings safe, give you loans, and manage your investments.
          </p>
          <p className="text-gray-700">
            DeFi (Decentralized Finance) is like having all those banking services, but instead of people 
            running them, computer programs called "smart contracts" handle everything automatically. 
            No building, no employees - just code that everyone can see and verify.
          </p>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Staking: Earning Rewards for Helping Networks</h3>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-green-800">What Is Staking?</h4>
          <p className="text-gray-700 mb-4">
            Think of staking like putting money in a special savings account that helps keep a blockchain network secure. 
            Here's how it works:
          </p>
          <div className="space-y-3">
            <div>
              <h5 className="font-semibold text-green-700">The Simple Version:</h5>
              <p className="text-gray-700">
                You "lock up" your digital assets (like putting them in a time-locked safe) to help validate 
                transactions on a blockchain. In return, you earn rewards - like interest on a savings account.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-green-700">Why Networks Need Stakers:</h5>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Blockchain networks need people to verify transactions are legitimate</li>
                <li>Stakers put their own money at risk, so they're motivated to be honest</li>
                <li>If they try to cheat, they lose their staked money (like a security deposit)</li>
                <li>Honest stakers get rewarded with new tokens</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-purple-800">Types of Staking</h4>
          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-purple-700">Direct Staking</h5>
              <p className="text-gray-700">
                You stake your tokens directly with the blockchain network. Like depositing money directly 
                with the bank instead of going through a middleman.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-purple-700">Delegated Staking</h5>
              <p className="text-gray-700">
                You give your tokens to a "validator" (like a professional money manager) who stakes them for you. 
                You keep ownership but they do the technical work and share the rewards.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-purple-700">Liquid Staking</h5>
              <p className="text-gray-700">
                You stake your tokens but get a "receipt token" that you can still trade or use elsewhere. 
                It's like getting a certificate for money in a CD that you can still sell to others.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Liquidity Farming: Being the Bank</h3>
        
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-yellow-800">What Is Liquidity Farming?</h4>
          <p className="text-gray-700 mb-4">
            Imagine you and your friend want to start a currency exchange booth. You both put in equal amounts 
            of two different currencies, and people come to trade between them. You earn fees from every trade.
          </p>
          <p className="text-gray-700 mb-4">
            That's essentially liquidity farming (also called yield farming or providing liquidity). You provide 
            pairs of tokens to decentralized exchanges so other people can trade, and you earn fees from their trades.
          </p>
          <div className="space-y-3">
            <div>
              <h5 className="font-semibold text-yellow-700">How It Works:</h5>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>You deposit two tokens in equal dollar amounts (like $100 of ETH + $100 of USDC)</li>
                <li>These go into a "liquidity pool" - like a shared pot that traders use</li>
                <li>When people trade between these tokens, they pay small fees</li>
                <li>Those fees get distributed to everyone who provided liquidity</li>
                <li>You also often get bonus "reward tokens" from the protocol</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-red-800">Impermanent Loss: The Hidden Risk</h4>
          <p className="text-gray-700 mb-3">
            Here's the tricky part that catches many people off guard:
          </p>
          <div className="space-y-3">
            <div>
              <h5 className="font-semibold text-red-700">The Problem:</h5>
              <p className="text-gray-700">
                When you provide liquidity, you're essentially betting that both tokens will move in price together. 
                If one token goes up much more than the other, you end up with less of the valuable token.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-red-700">Simple Example:</h5>
              <p className="text-gray-700">
                You put in $100 ETH + $100 USDC. ETH doubles in price. The pool automatically rebalances, 
                so you now have less ETH and more USDC. You missed out on some of ETH's gains compared 
                to just holding ETH directly.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-red-700">Why "Impermanent"?</h5>
              <p className="text-gray-700">
                It's only a loss if you withdraw when prices are different. If prices return to where they started, 
                the "loss" disappears - but you still earned fees while providing liquidity.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Lending Protocols: The DeFi Bank</h3>
        
        <div className="bg-teal-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-teal-800">How AAVE Works</h4>
          <p className="text-gray-700 mb-4">
            AAVE is like a bank, but run by computer code instead of people. Here's how the magic works:
          </p>
          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-teal-700">For Lenders (Depositors):</h5>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>You deposit tokens (like USDC) into AAVE's smart contract</li>
                <li>You get "aTokens" (like aUSDC) as a receipt</li>
                <li>These aTokens slowly increase in number - that's your interest</li>
                <li>You can withdraw anytime by trading your aTokens back</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-teal-700">For Borrowers:</h5>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>They deposit valuable collateral (like ETH worth $150)</li>
                <li>They can borrow less valuable assets (like $100 worth of USDC)</li>
                <li>They pay interest on what they borrow</li>
                <li>If their collateral value drops too much, it gets sold automatically</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-teal-700">The Interest Rate Magic:</h5>
              <p className="text-gray-700">
                When lots of people want to borrow, interest rates go up (more demand). 
                When there's lots of money to lend, rates go down (more supply). 
                It's all automatic based on supply and demand.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Automated Market Makers (AMMs)</h3>
        
        <div className="bg-indigo-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-indigo-800">How Quickswap (and Uniswap) Work</h4>
          <p className="text-gray-700 mb-4">
            Traditional exchanges match buyers and sellers directly. AMMs work differently - they use math 
            instead of order books.
          </p>
          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-indigo-700">The Constant Product Formula:</h5>
              <p className="text-gray-700 mb-2">
                AMMs use a simple rule: <strong>Token A × Token B = Constant Number</strong>
              </p>
              <p className="text-gray-700">
                If someone buys Token A, there's less of it in the pool, so its price goes up. 
                The math automatically adjusts prices based on how much of each token is left.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-indigo-700">Example Trade:</h5>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Pool has 100 ETH and 200,000 USDC (so 1 ETH = 2,000 USDC)</li>
                <li>Someone buys 10 ETH with USDC</li>
                <li>Pool now has 90 ETH and more USDC</li>
                <li>The price of ETH automatically increases because there's less of it</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-indigo-700">Why This Is Revolutionary:</h5>
              <p className="text-gray-700">
                No company needed, no employees, no downtime. The math works 24/7 automatically, 
                and anyone can trade anytime without waiting for someone else to place a matching order.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Yield Strategies: Stacking the Returns</h3>
        
        <div className="bg-orange-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-orange-800">How Protocols Stack Rewards</h4>
          <p className="text-gray-700 mb-4">
            Smart DeFi strategies often combine multiple earning methods. Here's how it works:
          </p>
          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-orange-700">Layer 1: Base Lending</h5>
              <p className="text-gray-700">
                Deposit USDC in AAVE, earn 3% interest from borrowers.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-orange-700">Layer 2: Liquidity Provision</h5>
              <p className="text-gray-700">
                Take your aUSDC receipt token and pair it with another token to provide liquidity, 
                earning trading fees on top of the lending interest.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-orange-700">Layer 3: Reward Tokens</h5>
              <p className="text-gray-700">
                Many protocols give bonus tokens to liquidity providers. These can be staked for more rewards 
                or sold for additional income.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-orange-700">Layer 4: Compound Interest</h5>
              <p className="text-gray-700">
                Automatically reinvest all earnings back into the strategy, so your returns generate their own returns.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Understanding the Risks</h3>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">What Can Go Wrong</h4>
          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-gray-700">Smart Contract Risk</h5>
              <p className="text-gray-700">
                Code can have bugs. If there's a problem with the smart contract, funds could be lost. 
                That's why audited, established protocols are safer.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-700">Liquidation Risk</h5>
              <p className="text-gray-700">
                If you're borrowing against collateral and prices move against you, your collateral 
                can be automatically sold to repay the loan.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-700">Token Risk</h5>
              <p className="text-gray-700">
                Reward tokens from newer protocols might lose value quickly. Sometimes the "high yields" 
                come from tokens that are inflating rapidly.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-700">Complexity Risk</h5>
              <p className="text-gray-700">
                The more complex a strategy, the more things can go wrong. Simple strategies are often safer 
                than elaborate yield farming schemes.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-cyan-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-cyan-800">Key Takeaways</h4>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>DeFi replaces traditional financial intermediaries with automated smart contracts</li>
            <li>Staking helps secure networks and earns rewards, but locks up your tokens</li>
            <li>Liquidity farming earns trading fees but exposes you to impermanent loss</li>
            <li>Lending protocols like AAVE work through over-collateralized loans</li>
            <li>AMMs use mathematical formulas instead of order books for trading</li>
            <li>Complex yield strategies can stack multiple earning methods</li>
            <li>Higher yields usually mean higher risks - understand what you're getting into</li>
            <li>Stick to audited, established protocols for safety</li>
          </ul>
        </div>
      </div>
    </ArticleLayout>
  );
};

export default DeFiProtocols;
