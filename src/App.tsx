
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { WalletProvider, useWallet } from "@/components/WalletProvider";
import { NetworkBanner } from "@/components/NetworkBanner";
import { DebugPanel } from "@/components/DebugPanel";
import { HealthPanel } from "@/components/HealthPanel";
import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SecurityHeaders } from "@/components/SecurityHeaders";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import { Admin } from "./pages/Admin";
import Index from "./pages/Index";
import LearnMore from "./pages/LearnMore";
import LearnNow from "./pages/LearnNow";
import NotFound from "./pages/NotFound";
import WhitePaper from "./pages/WhitePaper";
import FinancialBasics from "./pages/FinancialBasics";
import DigitalAssetFundamentals from "./pages/DigitalAssetFundamentals";
import VaultClubContracts from "./pages/VaultClubContracts";
import DigitalAssetExposure from "./pages/DigitalAssetExposure";

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

import BlockchainTechnologyDeepDive from "./pages/BlockchainTechnologyDeepDive";

import FinanceQuiz from "./pages/FinanceQuiz";
import Web3Quiz from "./pages/Web3Quiz";
import EducationQuiz from "./pages/EducationQuiz";
import ComprehensiveExam from "./pages/ComprehensiveExam";


import ColonialismMoneyTrade from "./pages/ColonialismMoneyTrade";
import GlobalEducationStatistics from "./pages/GlobalEducationStatistics";
import DemocratizingFinancialKnowledge from "./pages/DemocratizingFinancialKnowledge";
import InteractiveLearning from "./pages/InteractiveLearning";
import ApiKeys from "./pages/ApiKeys";
import TestApiCreation from "./components/TestApiCreation";
import ApiKeyTester from "./components/ApiKeyTester";

const queryClient = new QueryClient();

function AppContent() {
  const { wallet } = useWallet();
  const [showNetworkBanner, setShowNetworkBanner] = useState(false);

  useEffect(() => {
    if (wallet && wallet.isCorrectNetwork === false) {
      setShowNetworkBanner(true);
    } else {
      setShowNetworkBanner(false);
    }
  }, [wallet]);

  return (
    <>
      <SecurityHeaders />
      <NetworkBanner 
        isVisible={showNetworkBanner} 
        onDismiss={() => setShowNetworkBanner(false)} 
      />
      <DebugPanel />
      <HealthPanel />
      <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/learn-more" element={<LearnMore />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/api-keys" element={
              <ProtectedRoute>
                <ApiKeys />
              </ProtectedRoute>
            } />
            <Route path="/test-api" element={<TestApiCreation />} />
            <Route path="/api-test" element={<ApiKeyTester />} />
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
          <Route path="/learn/decentralized-finance-defi" element={<InteractiveLearning />} />
          <Route path="/learn/expanding-beyond-vault-club" element={<ExpandingBeyondVaultClub />} />
          <Route path="/learn/understanding-markets" element={<UnderstandingMarkets />} />
          <Route path="/learn/shortfalls-of-crypto" element={<ShortfallsOfCrypto />} />
          
          <Route path="/learn/what-is-money-really" element={<InteractiveLearning />} />
          <Route path="/learn/historical-evolution-money" element={<InteractiveLearning />} />
          <Route path="/learn/types-financial-markets" element={<InteractiveLearning />} />
          <Route path="/learn/crypto-market-role" element={<InteractiveLearning />} />
          <Route path="/learn/wealth-societal-empowerment" element={<InteractiveLearning />} />
          <Route path="/learn/financial-strategy-planning" element={<InteractiveLearning />} />
          <Route path="/learn/cryptocurrencies-fundamentals" element={<InteractiveLearning />} />
          <Route path="/learn/digital-ownership-empowerment" element={<InteractiveLearning />} />
           <Route path="/learn/tokens-tokenization" element={<InteractiveLearning />} />
           <Route path="/learn/blockchain-technology-deep-dive" element={<InteractiveLearning />} />
          <Route path="/learn/advanced-web3-innovations" element={<InteractiveLearning />} />
          <Route path="/learn/learning-human-progress-foundation" element={<InteractiveLearning />} />
          <Route path="/learn/consequences-educational-absence" element={<InteractiveLearning />} />
          <Route path="/learn/financial-literacy-gatekeeping" element={<InteractiveLearning />} />
          <Route path="/learn/colonialism-money-trade" element={<InteractiveLearning />} />
          <Route path="/learn/global-education-statistics" element={<InteractiveLearning />} />
          <Route path="/learn/democratizing-financial-knowledge" element={<InteractiveLearning />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </>
    );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <WalletProvider>
            <AppContent />
          </WalletProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
