import ArticleLayout from "@/components/ArticleLayout";

const TypesFinancialMarkets = () => {
  return (
    <ArticleLayout
      title="Types of Financial Markets"
      level="Intermediate"
    >
      <div className="prose prose-lg max-w-none">
        <h2>Understanding Financial Markets</h2>
        <p>
          Financial markets are platforms where buyers and sellers trade financial instruments.
          These markets facilitate capital allocation, price discovery, and risk management across the economy.
        </p>

        <h3>Stock Markets</h3>
        <p>
          Stock markets enable the trading of company shares, allowing businesses to raise capital
          and investors to own portions of companies.
        </p>
        <ul>
          <li><strong>Primary Markets:</strong> Where new securities are issued (IPOs)</li>
          <li><strong>Secondary Markets:</strong> Where existing securities are traded</li>
          <li><strong>Major Exchanges:</strong> NYSE, NASDAQ, LSE, Tokyo Stock Exchange</li>
        </ul>

        <h3>Bond Markets</h3>
        <p>
          Bond markets facilitate the trading of debt securities, where investors lend money
          to governments or corporations in exchange for interest payments.
        </p>
        <ul>
          <li>Government bonds (treasuries)</li>
          <li>Corporate bonds</li>
          <li>Municipal bonds</li>
          <li>International bonds</li>
        </ul>

        <h3>Commodity Markets</h3>
        <p>
          These markets trade raw materials and primary products, including:
        </p>
        <ul>
          <li><strong>Energy:</strong> Oil, natural gas, electricity</li>
          <li><strong>Metals:</strong> Gold, silver, copper, platinum</li>
          <li><strong>Agricultural:</strong> Wheat, corn, soybeans, coffee</li>
          <li><strong>Livestock:</strong> Cattle, pork bellies</li>
        </ul>

        <h3>Foreign Exchange (Forex) Markets</h3>
        <p>
          The largest financial market globally, where currencies are traded 24/7:
        </p>
        <ul>
          <li>Spot market for immediate delivery</li>
          <li>Forward and futures markets for future delivery</li>
          <li>Major currency pairs: EUR/USD, GBP/USD, USD/JPY</li>
          <li>Central bank interventions and monetary policy impacts</li>
        </ul>

        <h3>Derivatives Markets</h3>
        <p>
          Markets for financial instruments whose value derives from underlying assets:
        </p>
        <ul>
          <li><strong>Options:</strong> Rights to buy or sell at specific prices</li>
          <li><strong>Futures:</strong> Contracts for future delivery at predetermined prices</li>
          <li><strong>Swaps:</strong> Agreements to exchange cash flows</li>
          <li><strong>CFDs:</strong> Contracts for difference</li>
        </ul>

        <h3>Money Markets</h3>
        <p>
          Short-term debt markets for highly liquid, low-risk instruments:
        </p>
        <ul>
          <li>Treasury bills</li>
          <li>Commercial paper</li>
          <li>Certificates of deposit</li>
          <li>Repurchase agreements</li>
        </ul>

        <h3>Cryptocurrency Markets</h3>
        <p>
          The newest addition to financial markets, featuring:
        </p>
        <ul>
          <li>24/7 trading across global exchanges</li>
          <li>High volatility and emerging regulation</li>
          <li>Decentralized finance (DeFi) protocols</li>
          <li>New asset classes and trading mechanisms</li>
        </ul>

        <h3>Market Functions</h3>
        <p>
          All financial markets serve several key functions:
        </p>
        <ul>
          <li><strong>Price Discovery:</strong> Determining fair value through supply and demand</li>
          <li><strong>Liquidity:</strong> Enabling easy buying and selling of assets</li>
          <li><strong>Capital Allocation:</strong> Directing funds to their most productive uses</li>
          <li><strong>Risk Management:</strong> Providing tools to hedge against various risks</li>
        </ul>

        <h3>Key Takeaways</h3>
        <ul>
          <li>Different markets serve different economic functions and participants</li>
          <li>Markets are interconnected and influence each other</li>
          <li>Understanding market types helps in investment decision-making</li>
          <li>Each market has unique characteristics, risks, and opportunities</li>
        </ul>
      </div>
    </ArticleLayout>
  );
};

export default TypesFinancialMarkets;