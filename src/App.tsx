
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Auth from "./pages/Auth";
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
import EducationQuiz from "./pages/EducationQuiz";
import ComprehensiveExam from "./pages/ComprehensiveExam";
import ConsequencesEducationalAbsence from "./pages/ConsequencesEducationalAbsence";
import FinancialLiteracyGatekeeping from "./pages/FinancialLiteracyGatekeeping";
import ColonialismMoneyTrade from "./pages/ColonialismMoneyTrade";
import GlobalEducationStatistics from "./pages/GlobalEducationStatistics";
import DemocratizingFinancialKnowledge from "./pages/DemocratizingFinancialKnowledge";
import InteractiveLearning from "./pages/InteractiveLearning";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/learn-more" element={<LearnMore />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/learn-now" element={
              <ProtectedRoute>
                <LearnNow />
              </ProtectedRoute>
            } />
            <Route path="/interactive-learn/:moduleId" element={
              <ProtectedRoute>
                <InteractiveLearning />
              </ProtectedRoute>
            } />
          <Route path="/finance-quiz" element={<FinanceQuiz />} />
          <Route path="/web3-quiz" element={<Web3Quiz />} />
          <Route path="/education-quiz" element={<EducationQuiz />} />
          <Route path="/comprehensive-exam" element={<ComprehensiveExam />} />
          <Route path="/white-paper" element={<WhitePaper />} />
          <Route path="/learn/financial-basics" element={<FinancialBasics />} />
          <Route path="/learn/digital-asset-fundamentals" element={<DigitalAssetFundamentals />} />
          <Route path="/learn/vault-club-contracts" element={<VaultClubContracts />} />
          <Route path="/learn/digital-asset-exposure" element={<DigitalAssetExposure />} />
          <Route path="/learn/decentralized-finance-defi" element={<DeFiProtocols />} />
          <Route path="/learn/expanding-beyond-vault-club" element={<ExpandingBeyondVaultClub />} />
          <Route path="/learn/understanding-markets" element={<UnderstandingMarkets />} />
          <Route path="/learn/shortfalls-of-crypto" element={<ShortfallsOfCrypto />} />
          
          <Route path="/learn/what-is-money-really" element={<InteractiveLearning />} />
          <Route path="/learn/historical-evolution-money" element={<InteractiveLearning />} />
          <Route path="/learn/types-financial-markets" element={<InteractiveLearning />} />
          <Route path="/learn/crypto-market-role" element={<InteractiveLearning />} />
          <Route path="/learn/wealth-societal-empowerment" element={<InteractiveLearning />} />
          <Route path="/learn/financial-strategy-planning" element={<InteractiveLearning />} />
          <Route path="/learn/cryptocurrencies-fundamentals" element={<CryptocurrenciesFundamentals />} />
          <Route path="/learn/digital-ownership-empowerment" element={<DigitalOwnershipEmpowerment />} />
          <Route path="/learn/tokens-tokenization" element={<TokensTokenization />} />
          <Route path="/learn/blockchain-technology-deep-dive" element={<BlockchainTechnologyDeepDive />} />
          <Route path="/learn/advanced-web3-innovations" element={<AdvancedWeb3Innovations />} />
          <Route path="/learn/learning-human-progress-foundation" element={<LearningHumanProgressFoundation />} />
          <Route path="/learn/consequences-educational-absence" element={<ConsequencesEducationalAbsence />} />
          <Route path="/learn/financial-literacy-gatekeeping" element={<FinancialLiteracyGatekeeping />} />
          <Route path="/learn/colonialism-money-trade" element={<ColonialismMoneyTrade />} />
          <Route path="/learn/global-education-statistics" element={<GlobalEducationStatistics />} />
          <Route path="/learn/democratizing-financial-knowledge" element={<DemocratizingFinancialKnowledge />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
