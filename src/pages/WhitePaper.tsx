
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const WhitePaper = () => {
  // The Vault Club white paper
  const whitePaperImages = [
    "/lovable-uploads/12b92607-26ae-411e-be3c-f60e5bb51ed2.png", // New white paper
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
