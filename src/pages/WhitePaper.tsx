import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const WhitePaper = () => {
  // The Vault Club white paper
  const whitePaperImages = ["/lovable-uploads/8e494fad-47f9-4c41-8cce-e7ddcdbd9806.png",
  // Title page with Abstract
  "/lovable-uploads/8313cfb8-e0e7-44a4-99fa-21d94ea52364.png",
  // Phase 1: The Mega Vault
  "/lovable-uploads/b9f47faf-6c66-40ca-b22b-16037ab7658b.png",
  // Deposit Schedule, Allocation & Rigor
  "/lovable-uploads/9a3c73cd-789e-4909-97ac-d0c0622c1a58.png",
  // Group Structure & Projected Outcomes
  "/lovable-uploads/7cc7e5b5-997f-4a43-910c-3fd96c5e160f.png",
  // Profit Model & Why Choose The Vault Club
  "/lovable-uploads/65ff8fe2-12e2-45fd-9d98-64c101bb5a66.png",
  // Weekly Loan Schedule & Key Advantages
  "/lovable-uploads/a8b540b6-ff08-4a3c-9eca-6b9c749b66fa.png",
  // Technical Infrastructure & Risk Management
  "/lovable-uploads/6989e28e-d046-4a8a-b3d5-7457578a6b2c.png" // Conclusion
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