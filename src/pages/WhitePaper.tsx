import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const WhitePaper = () => {
  // The Vault Club white paper
  const whitePaperImages = [
    "/lovable-uploads/39a7de16-86e0-4173-91b6-c457c89d2631.png", // Title page with Abstract
    "/lovable-uploads/e1d78388-2c73-4bcf-8204-9946501c8cc6.png", // Phase 1: The Mega Vault
    "/lovable-uploads/6e78cc40-e54d-4d9e-8b65-dfc36bf14b59.png", // Deposit Schedule, Allocation & Rigor
    "/lovable-uploads/4fdedbcf-8d7c-4548-8c91-fa253885e8bc.png", // Group Structure & Projected Outcomes
    "/lovable-uploads/7eefc3c0-0f47-46f6-aa84-39fdfbe58c20.png", // Profit Model & Why Choose The Vault Club
    "/lovable-uploads/643fdb42-1202-406c-8376-c4f5d89fa2a5.png", // Weekly Loan Schedule & Key Advantages
    "/lovable-uploads/386bbfd1-b200-49f0-947e-6e817a1dfafb.png", // Technical Infrastructure & Risk Management
    "/lovable-uploads/91c3b23f-9022-4551-b57f-778410388c5e.png"  // Conclusion & Additional Remarks
  ];
  return <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Link to="/">
            <Button variant="outline" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">The Vault Club - White Paper</h1>
          
          
          <div className="space-y-8">
            {whitePaperImages.map((imagePath, index) => <div key={index} className="bg-white rounded-lg shadow-lg p-4">
                <img src={imagePath} alt={`White Paper Page ${index + 1}`} className="w-full h-auto rounded" />
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};
export default WhitePaper;