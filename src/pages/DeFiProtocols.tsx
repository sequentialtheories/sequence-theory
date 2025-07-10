
import ArticleLayout from "@/components/ArticleLayout";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";

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

        <h3 className="text-2xl font-semibold text-gray-900">Why Decentralizing Banks Is Revolutionary</h3>
        
        <div className="bg-emerald-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-4 text-emerald-800">The Problems with Traditional Banks</h4>
          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-emerald-700">They Control Your Money</h5>
              <p className="text-gray-700">
                Banks can freeze your account, deny transactions, or even close your account entirely. 
                They decide when you can access your own money and how you can use it.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-emerald-700">High Fees and Poor Returns</h5>
              <p className="text-gray-700">
                Banks charge fees for almost everything while paying you nearly 0% interest on savings. 
                They make money by lending your deposits at much higher rates but share very little with you.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-emerald-700">Limited Access</h5>
              <p className="text-gray-700">
                Billions of people worldwide can't get bank accounts due to location, documentation requirements, 
                or minimum balance restrictions. Banks exclude people who need financial services most.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-emerald-700">Slow and Expensive Transfers</h5>
              <p className="text-gray-700">
                Sending money internationally takes days and costs significant fees. Banks use outdated 
                systems that haven't meaningfully improved in decades.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-4 text-green-800">How DeFi Solves These Problems</h4>
          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-green-700">You Own Your Money</h5>
              <p className="text-gray-700">
                With DeFi, you hold your own private keys. No one can freeze your account or stop you from 
                making transactions. You're the bank - you have complete control over your assets 24/7.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-green-700">Better Returns, Lower Costs</h5>
              <p className="text-gray-700">
                DeFi eliminates the middleman markup. When you lend money through protocols like AAVE, 
                you get most of the interest instead of the bank keeping it. Smart contracts are cheaper 
                to run than bank branches and employees.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-green-700">Global Access</h5>
              <p className="text-gray-700">
                Anyone with internet and a smartphone can access DeFi. No paperwork, no minimum balances, 
                no geographic restrictions. A farmer in rural Africa has the same access as a Wall Street trader.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-green-700">Instant, Cheap Transactions</h5>
              <p className="text-gray-700">
                DeFi transactions settle in minutes, not days. Cross-border payments cost pennies instead 
                of tens of dollars. The system works 24/7 without bank holidays or business hours.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-green-700">Transparent and Auditable</h5>
              <p className="text-gray-700">
                Every transaction is recorded on the blockchain for anyone to verify. Smart contract code 
                is open source - you can see exactly how your money is being handled instead of trusting 
                a bank's promises.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-green-700">Innovation Without Permission</h5>
              <p className="text-gray-700">
                Developers can build new financial products without asking banks for permission. 
                This creates rapid innovation and competition that benefits users, unlike the slow-moving 
                traditional banking sector.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-4 text-amber-800">Real-World Impact</h4>
          <div className="space-y-3">
            <div>
              <h5 className="font-semibold text-amber-700">Example 1: Remittances</h5>
              <p className="text-gray-700">
                Maria works in the US and sends $200 home to her family in El Salvador monthly. 
                Traditional services charge $15-20 in fees and take 2-3 days. With DeFi, she can 
                send the same amount for under $5 and it arrives in minutes.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-amber-700">Example 2: Savings</h5>
              <p className="text-gray-700">
                Ahmed's bank pays 0.5% interest on his savings while inflation is 8%. Through DeFi lending, 
                he earns 6% APY on stablecoins, actually preserving his purchasing power.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-amber-700">Example 3: Financial Inclusion</h5>
              <p className="text-gray-700">
                Priya runs a small business in rural India but can't get a bank loan due to lack of 
                credit history. DeFi protocols let her use her cryptocurrency as collateral to borrow 
                funds for expansion.
              </p>
            </div>
          </div>
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

        <h3 className="text-2xl font-semibold text-gray-900">CEX vs DEX: Two Different Worlds</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 text-blue-800">Centralized Exchanges (CEX)</h4>
            <p className="text-gray-700 mb-4">
              Traditional exchanges controlled by companies, like banks but for digital assets:
            </p>
            <div className="space-y-3">
              <div>
                <h5 className="font-semibold text-blue-700">Examples:</h5>
                <p className="text-gray-700">Coinbase, Binance, Kraken, Gemini</p>
              </div>
              <div>
                <h5 className="font-semibold text-blue-700">How They Work:</h5>
                <ul className="list-disc pl-4 text-gray-700 space-y-1">
                  <li>Company holds your assets in their wallets</li>
                  <li>Trades happen on their internal systems</li>
                  <li>You trust them to keep your money safe</li>
                  <li>Easy user interface and customer support</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-blue-700">Pros:</h5>
                <ul className="list-disc pl-4 text-gray-700 space-y-1">
                  <li>User-friendly for beginners</li>
                  <li>Customer support when things go wrong</li>
                  <li>Insurance on some deposits</li>
                  <li>Fiat currency on/off ramps</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-blue-700">Cons:</h5>
                <ul className="list-disc pl-4 text-gray-700 space-y-1">
                  <li>You don't truly own your crypto</li>
                  <li>Can freeze accounts or restrict access</li>
                  <li>Single point of failure (hacks, bankruptcy)</li>
                  <li>Higher fees</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 text-green-800">Decentralized Exchanges (DEX)</h4>
            <p className="text-gray-700 mb-4">
              No company in control - just smart contracts doing the work automatically:
            </p>
            <div className="space-y-3">
              <div>
                <h5 className="font-semibold text-green-700">Examples:</h5>
                <p className="text-gray-700">Uniswap, Quickswap, PancakeSwap, SushiSwap</p>
              </div>
              <div>
                <h5 className="font-semibold text-green-700">How They Work:</h5>
                <ul className="list-disc pl-4 text-gray-700 space-y-1">
                  <li>You keep control of your own wallet</li>
                  <li>Smart contracts handle the trading</li>
                  <li>Liquidity provided by other users</li>
                  <li>No company can stop you from trading</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-green-700">Pros:</h5>
                <ul className="list-disc pl-4 text-gray-700 space-y-1">
                  <li>You maintain control of your assets</li>
                  <li>No account creation or KYC required</li>
                  <li>Access to thousands of tokens</li>
                  <li>Transparent operations on blockchain</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-green-700">Cons:</h5>
                <ul className="list-disc pl-4 text-gray-700 space-y-1">
                  <li>More complex for beginners</li>
                  <li>No customer support</li>
                  <li>Higher transaction fees (gas)</li>
                  <li>Risk of user error (wrong address, etc.)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Decentralized Applications (dApps)</h3>
        
        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-purple-800">What Are dApps?</h4>
          <p className="text-gray-700 mb-4">
            Decentralized Applications are like regular apps (think Instagram or Uber), but instead of running 
            on company servers, they run on blockchain networks. No single company controls them.
          </p>
          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-purple-700">Key Characteristics:</h5>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>Open Source:</strong> Anyone can see and verify the code</li>
                <li><strong>Decentralized:</strong> No single point of control or failure</li>
                <li><strong>Blockchain-Based:</strong> All data and logic stored on blockchain</li>
                <li><strong>Token-Incentivized:</strong> Often use tokens for governance or utility</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-purple-700">Popular dApp Categories:</h5>
              <div className="grid md:grid-cols-2 gap-4 mt-3">
                <div>
                  <h6 className="font-medium text-purple-600">Finance (DeFi)</h6>
                  <ul className="list-disc pl-4 text-gray-700 space-y-1">
                    <li>Uniswap - Decentralized trading</li>
                    <li>AAVE - Lending and borrowing</li>
                    <li>Compound - Interest earning</li>
                  </ul>
                </div>
                <div>
                  <h6 className="font-medium text-purple-600">Gaming & NFTs</h6>
                  <ul className="list-disc pl-4 text-gray-700 space-y-1">
                    <li>Axie Infinity - Play-to-earn gaming</li>
                    <li>OpenSea - NFT marketplace</li>
                    <li>Decentraland - Virtual world</li>
                  </ul>
                </div>
                <div>
                  <h6 className="font-medium text-purple-600">Social & Identity</h6>
                  <ul className="list-disc pl-4 text-gray-700 space-y-1">
                    <li>ENS - Domain names (.eth)</li>
                    <li>Lens Protocol - Decentralized social</li>
                    <li>Mirror - Publishing platform</li>
                  </ul>
                </div>
                <div>
                  <h6 className="font-medium text-purple-600">Infrastructure</h6>
                  <ul className="list-disc pl-4 text-gray-700 space-y-1">
                    <li>Chainlink - Oracle services</li>
                    <li>IPFS - Decentralized storage</li>
                    <li>The Graph - Data indexing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900">Smart Contracts: The Building Blocks</h3>
        
        <div className="bg-teal-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-teal-800">Understanding Smart Contracts</h4>
          <p className="text-gray-700 mb-4">
            Smart contracts are self-executing agreements written in code. Think of them as digital vending machines - 
            you put in the right input, and you automatically get the expected output.
          </p>
          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-teal-700">Real-World Example:</h5>
              <p className="text-gray-700 mb-2">
                Traditional insurance claim: Submit paperwork → Wait weeks → Insurance company reviews → 
                Human decides → Maybe you get paid
              </p>
              <p className="text-gray-700">
                Smart contract insurance: Weather data shows hurricane → Contract automatically pays out 
                to affected areas → Money arrives in minutes
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-teal-700">Why They Matter:</h5>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>Automatic Execution:</strong> No humans needed to enforce the agreement</li>
                <li><strong>Transparent:</strong> Everyone can see exactly how they work</li>
                <li><strong>Immutable:</strong> Once deployed, the rules can't be changed arbitrarily</li>
                <li><strong>Global Access:</strong> Available 24/7 to anyone with internet</li>
                <li><strong>Reduced Costs:</strong> No middlemen taking fees</li>
              </ul>
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
              <h5 className="font-semibold text-gray-700">User Error Risk</h5>
              <p className="text-gray-700">
                With great power comes great responsibility. Send tokens to the wrong address? 
                They're gone forever. No customer service to call.
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
              <h5 className="font-semibold text-gray-700">Network Congestion</h5>
              <p className="text-gray-700">
                When networks get busy, transaction fees spike and confirmations slow down. 
                This can affect your ability to interact with dApps when you need to.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-cyan-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-cyan-800">Key Takeaways</h4>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>DeFi eliminates traditional banking intermediaries, giving you control and better returns</li>
            <li>Decentralization provides global access, transparency, and 24/7 availability</li>
            <li>Smart contracts reduce costs and enable innovation impossible in traditional finance</li>
            <li>Staking helps secure networks and earns rewards, but locks up your tokens</li>
            <li>Liquidity farming earns trading fees but exposes you to impermanent loss</li>
            <li>Lending protocols like AAVE work through over-collateralized loans</li>
            <li>AMMs use mathematical formulas instead of order books for trading</li>
            <li>Complex yield strategies can stack multiple earning methods</li>
            <li>Higher yields usually mean higher risks - understand what you're getting into</li>
            <li>Stick to audited, established protocols for safety</li>
          </ul>
        </div>

        {/* Continue Your Learning Journey */}
        <section className="bg-gray-50 rounded-xl p-8">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">Continue Your Learning Journey</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Link 
                to="/learn/expanding-beyond-vault-club"
                className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  <span className="font-semibold text-gray-900">Previous: Expanding Your Portfolio</span>
                </div>
                <p className="text-gray-600">Learn strategic approaches to diversifying beyond structured investment contracts.</p>
              </Link>
              
              <Link 
                to="/learn-now"
                className="block bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-semibold">Back to Learning Path</span>
                </div>
                <p className="text-gray-100">Explore all available learning modules and continue your education.</p>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </ArticleLayout>
  );
};

export default DeFiProtocols;
