
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const WhitePaper = () => {
  // You can add more white paper images here as they become available
  const whitePaperImages = [
    "/lovable-uploads/ba89813f-6e52-48b8-b2cf-67601c222f5c.png",
    // Add more image paths here when you have additional pages
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
          <h1 className="text-3xl font-bold text-center mb-8">Sequence Theory White Paper</h1>
          
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
          
          {whitePaperImages.length === 1 && (
            <div className="text-center mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-700">
                More pages will be added as they become available.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhitePaper;
