
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const WhitePaper = () => {
  // All pages of The Vault Club white paper
  const whitePaperImages = [
    "/lovable-uploads/ba89813f-6e52-48b8-b2cf-67601c222f5c.png", // Original first page
    "/lovable-uploads/d38c61a0-3264-4b0e-9610-86c9153e0422.png", // Title page with Abstract
    "/lovable-uploads/178702e4-ff76-4d27-87cb-cfa58ec0f1ad.png", // Phase 1: The Engine Pool
    "/lovable-uploads/c64d525c-a91b-41b8-997c-fedbd6fac5e8.png", // Deposit Schedule, Allocation & Rigor
    "/lovable-uploads/1e85a2c5-3e2f-44bd-8a0f-7e7ed444bfab.png", // Group Structure & Projected Outcomes
    "/lovable-uploads/f51fdc1c-fa90-4531-a2f1-f8f3ac2918b2.png", // Profit Model & Why Choose The Vault Club
    "/lovable-uploads/c6184467-35cc-4678-8ca8-45e7c32e942e.png", // Weekly Loan Schedule & Key Advantages
    "/lovable-uploads/5867b7a0-1998-49ae-8346-034082a27873.png", // Technical Infrastructure & Risk Management
    "/lovable-uploads/328b964b-1ee4-4408-9c7a-0fc5611b7adc.png", // Conclusion
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
