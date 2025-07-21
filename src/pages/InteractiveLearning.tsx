import { useParams } from 'react-router-dom';
import InteractiveModule from '@/components/InteractiveModule';
import { allModules } from '@/data/moduleData';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InteractiveLearning() {
  const { moduleId } = useParams();
  const { completeModule, isModuleUnlocked } = useLearningProgress();

  // Handle direct routes by extracting moduleId from the current path
  const currentPath = window.location.pathname;
  let actualModuleId = moduleId;
  
  if (!actualModuleId && currentPath === '/learn/what-is-money-really') {
    actualModuleId = 'what-is-money-really';
  }
  if (!actualModuleId && currentPath === '/learn/historical-evolution-money') {
    actualModuleId = 'historical-evolution-money';
  }
  if (!actualModuleId && currentPath === '/learn/types-financial-markets') {
    actualModuleId = 'types-financial-markets';
  }
  if (!actualModuleId && currentPath === '/learn/crypto-market-role') {
    actualModuleId = 'crypto-market-role';
  }
  if (!actualModuleId && currentPath === '/learn/wealth-societal-empowerment') {
    actualModuleId = 'wealth-societal-empowerment';
  }
  if (!actualModuleId && currentPath === '/learn/financial-strategy-planning') {
    actualModuleId = 'financial-strategy-planning';
  }
  if (!actualModuleId && currentPath === '/learn/cryptocurrencies-fundamentals') {
    actualModuleId = 'cryptocurrencies-fundamentals';
  }
  if (!actualModuleId && currentPath === '/learn/digital-ownership-empowerment') {
    actualModuleId = 'digital-ownership-empowerment';
  }
  if (!actualModuleId && currentPath === '/learn/tokens-tokenization') {
    actualModuleId = 'tokens-tokenization';
  }
  if (!actualModuleId && currentPath === '/learn/blockchain-technology-deep-dive') {
    actualModuleId = 'blockchain-technology-deep-dive';
  }
  if (!actualModuleId && currentPath === '/learn/decentralized-finance-defi') {
    actualModuleId = 'decentralized-finance-defi';
  }
  if (!actualModuleId && currentPath === '/learn/advanced-web3-innovations') {
    actualModuleId = 'advanced-web3-innovations';
  }
  if (!actualModuleId && currentPath === '/learn/learning-human-progress-foundation') {
    actualModuleId = 'learning-human-progress-foundation';
  }
  if (!actualModuleId && currentPath === '/learn/consequences-educational-absence') {
    actualModuleId = 'consequences-educational-absence';
  }
  if (!actualModuleId && currentPath === '/learn/financial-literacy-gatekeeping') {
    actualModuleId = 'financial-literacy-gatekeeping';
  }
  if (!actualModuleId && currentPath === '/learn/colonialism-money-trade') {
    actualModuleId = 'money-as-control';
  }
  if (!actualModuleId && currentPath === '/learn/money-as-control') {
    actualModuleId = 'money-as-control';
  }
  if (!actualModuleId && currentPath === '/learn/global-education-statistics') {
    actualModuleId = 'global-education-statistics';
  }

  // Find the module by moduleId
  const moduleData = allModules.find(module => module.id === actualModuleId);

  if (!moduleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Module Not Found</h2>
            <p className="text-gray-600 mb-6">
              The requested learning module could not be found.
            </p>
            <Link to="/learn-now">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Learning Path
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleModuleComplete = (completedModuleId: string) => {
    console.log('Completing module:', completedModuleId, 'Category:', moduleData.categoryIndex, 'Module:', moduleData.moduleIndex);
    completeModule(completedModuleId, moduleData.categoryIndex, moduleData.moduleIndex);
  };

  const unlocked = isModuleUnlocked(moduleData.categoryIndex, moduleData.moduleIndex);

  return (
    <InteractiveModule
      moduleData={moduleData}
      isUnlocked={unlocked}
      onComplete={handleModuleComplete}
    />
  );
}