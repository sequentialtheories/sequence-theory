
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LearnMore from "./pages/LearnMore";
import LearnNow from "./pages/LearnNow";
import NotFound from "./pages/NotFound";
import WhitePaper from "./pages/WhitePaper";
import FinancialBasics from "./pages/FinancialBasics";
import DigitalAssetFundamentals from "./pages/DigitalAssetFundamentals";
import VaultClubContracts from "./pages/VaultClubContracts";
import DigitalAssetExposure from "./pages/DigitalAssetExposure";
import DeFiProtocols from "./pages/DeFiProtocols";
import ExpandingBeyondVaultClub from "./pages/ExpandingBeyondVaultClub";
import UnderstandingMarkets from "./pages/UnderstandingMarkets";
import ShortfallsOfCrypto from "./pages/ShortfallsOfCrypto";
import ConceptPurposeMoney from "./pages/ConceptPurposeMoney";
import HistoricalEvolutionMoney from "./pages/HistoricalEvolutionMoney";
import TypesFinancialMarkets from "./pages/TypesFinancialMarkets";
import CryptoMarketRole from "./pages/CryptoMarketRole";
import WealthSocietalEmpowerment from "./pages/WealthSocietalEmpowerment";
import FinancialStrategyPlanning from "./pages/FinancialStrategyPlanning";
import CryptocurrenciesFundamentals from "./pages/CryptocurrenciesFundamentals";
import DigitalOwnershipEmpowerment from "./pages/DigitalOwnershipEmpowerment";
import TokensTokenization from "./pages/TokensTokenization";
import LearningHumanProgressFoundation from "./pages/LearningHumanProgressFoundation";
import BlockchainTechnologyDeepDive from "./pages/BlockchainTechnologyDeepDive";
import AdvancedWeb3Innovations from "./pages/AdvancedWeb3Innovations";
import FinanceQuiz from "./pages/FinanceQuiz";
import Web3Quiz from "./pages/Web3Quiz";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/learn-now" element={<LearnNow />} />
          <Route path="/finance-quiz" element={<FinanceQuiz />} />
          <Route path="/web3-quiz" element={<Web3Quiz />} />
          <Route path="/white-paper" element={<WhitePaper />} />
          <Route path="/learn/financial-basics" element={<FinancialBasics />} />
          <Route path="/learn/digital-asset-fundamentals" element={<DigitalAssetFundamentals />} />
          <Route path="/learn/vault-club-contracts" element={<VaultClubContracts />} />
          <Route path="/learn/digital-asset-exposure" element={<DigitalAssetExposure />} />
          <Route path="/learn/decentralized-finance-defi" element={<DeFiProtocols />} />
          <Route path="/learn/expanding-beyond-vault-club" element={<ExpandingBeyondVaultClub />} />
          <Route path="/learn/understanding-markets" element={<UnderstandingMarkets />} />
          <Route path="/learn/shortfalls-of-crypto" element={<ShortfallsOfCrypto />} />
          <Route path="/learn/concept-purpose-money" element={<ConceptPurposeMoney />} />
          <Route path="/learn/historical-evolution-money" element={<HistoricalEvolutionMoney />} />
          <Route path="/learn/types-financial-markets" element={<TypesFinancialMarkets />} />
          <Route path="/learn/crypto-market-role" element={<CryptoMarketRole />} />
          <Route path="/learn/wealth-societal-empowerment" element={<WealthSocietalEmpowerment />} />
          <Route path="/learn/financial-strategy-planning" element={<FinancialStrategyPlanning />} />
          <Route path="/learn/cryptocurrencies-fundamentals" element={<CryptocurrenciesFundamentals />} />
          <Route path="/learn/digital-ownership-empowerment" element={<DigitalOwnershipEmpowerment />} />
          <Route path="/learn/tokens-tokenization" element={<TokensTokenization />} />
          <Route path="/learn/blockchain-technology-deep-dive" element={<BlockchainTechnologyDeepDive />} />
          <Route path="/learn/advanced-web3-innovations" element={<AdvancedWeb3Innovations />} />
          <Route path="/learn/learning-human-progress-foundation" element={<LearningHumanProgressFoundation />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
