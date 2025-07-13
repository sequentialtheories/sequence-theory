import ArticleLayout from "@/components/ArticleLayout";

const TokensTokenization = () => {
  return (
    <ArticleLayout title="Tokens & Tokenization" level="Intermediate">
      <div className="prose prose-lg max-w-none">
        <h2>Understanding Tokens and Tokenization</h2>
        <p>Tokens represent digital assets on blockchain networks, enabling new forms of value creation and exchange.</p>
        
        <h3>Types of Tokens</h3>
        <ul>
          <li><strong>Utility Tokens:</strong> Provide access to services or platforms</li>
          <li><strong>Security Tokens:</strong> Represent ownership in assets or companies</li>
          <li><strong>Governance Tokens:</strong> Enable voting rights in decentralized protocols</li>
          <li><strong>Non-Fungible Tokens (NFTs):</strong> Unique digital assets</li>
        </ul>

        <h3>Tokenization Benefits</h3>
        <ul>
          <li>Increased liquidity for traditionally illiquid assets</li>
          <li>Fractional ownership opportunities</li>
          <li>Global accessibility and 24/7 trading</li>
          <li>Reduced intermediaries and costs</li>
        </ul>
      </div>
    </ArticleLayout>
  );
};

export default TokensTokenization;