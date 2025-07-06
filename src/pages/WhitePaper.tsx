
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const WhitePaper = () => {
  // All pages of The Vault Club white paper
  const whitePaperImages = [
    "/lovable-uploads/01cbc19b-885c-42a9-ba8e-8a05afbd4878.png", // Title page with Abstract
    "/lovable-uploads/27191609-8b8e-4895-9a1a-e32c6da8ae90.png", // Phase 1: The Engine Pool
    "/lovable-uploads/11d1db7b-4331-423f-8628-bd7f7ff434f6.png", // Deposit Schedule, Allocation & Rigor
    "/lovable-uploads/41fec537-23e3-4f49-9598-9e47a8dae0d6.png", // Group Structure & Projected Outcomes
    "/lovable-uploads/c8fe8d34-db48-40f6-9f2d-bd94ed6713c9.png", // Profit Model & Why Choose The Vault Club
    "/lovable-uploads/1c6febbe-2a15-452b-9bde-74ceddfa4809.png", // Weekly Loan Schedule & Key Advantages
    "/lovable-uploads/ce8728c1-e2a5-4d54-88d0-1d9fbbbc2af9.png", // Technical Infrastructure & Risk Management
    "/lovable-uploads/1ffbb3ed-d777-404f-bb76-17468a6873f2.png", // Conclusion
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
          <p className="text-center text-gray-600 mb-8">A Compounding Plan to Accelerate Wealth by Sequence Theory</p>
          
          <div className="space-y-8">
            {whitePaperImages.map((imagePath, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-4">
                <img
                  src={imagePath}
                  alt={`White Paper Page ${index + 1}`}
                  className="w-full h-auto rounded"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhitePaper;
