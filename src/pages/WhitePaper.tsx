import Navigation from "@/components/Navigation";
const WhitePaper = () => {
  // The Vault Club white paper
  const whitePaperImages = [
    "/lovable-uploads/d8372ecb-aec5-4100-91b7-2d3ab780aac0.png", // Title page with Abstract
    "/lovable-uploads/7777d3fa-2e63-4ff8-8f51-fef1d409214b.png", // Phase 1: The Mega Vault
    "/lovable-uploads/97e92095-fa8d-48f0-a2de-2c9159837b11.png", // Deposit Schedule, Allocation & Rigor
    "/lovable-uploads/db293bd7-c78e-4c2e-829e-e08dedbdd504.png", // Group Structure & Projected Outcomes
    "/lovable-uploads/0acc7886-63ae-4b2b-b4da-5d8fd7e1e0d5.png", // Profit Model & Why Choose The Vault Club
    "/lovable-uploads/81b6c19f-d83a-488b-82af-52d2f371d981.png", // Weekly & Biweekly Loan Schedule & Key Advantages
    "/lovable-uploads/1be687b7-1726-44f2-abd1-ae3acab3d5fd.png", // Technical Infrastructure & Risk Management
    "/lovable-uploads/913c999c-a1ad-4d49-b4b3-0c91ab827114.png"  // Conclusion & Additional Remarks
  ];
  return <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-6 pt-24 pb-8">
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