
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LearnMore from "./pages/LearnMore";
import LearnNow from "./pages/LearnNow";
import NotFound from "./pages/NotFound";
import FinancialBasics from "./pages/FinancialBasics";
import DigitalAssetFundamentals from "./pages/DigitalAssetFundamentals";
import VaultClubContracts from "./pages/VaultClubContracts";
import ExpandingBeyondVaultClub from "./pages/ExpandingBeyondVaultClub";

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
          <Route path="/learn/financial-basics" element={<FinancialBasics />} />
          <Route path="/learn/digital-asset-fundamentals" element={<DigitalAssetFundamentals />} />
          <Route path="/learn/vault-club-contracts" element={<VaultClubContracts />} />
          <Route path="/learn/expanding-beyond-vault-club" element={<ExpandingBeyondVaultClub />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
