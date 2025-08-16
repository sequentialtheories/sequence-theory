import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';
import { switchToRequiredNetwork, getRequiredChainId } from '@/lib/chain';
import { CFG } from '@/lib/config';
import { toast } from '@/hooks/use-toast';

interface NetworkBannerProps {
  isVisible: boolean;
  onDismiss?: () => void;
}

export function NetworkBanner({ isVisible, onDismiss }: NetworkBannerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isVisible || isDismissed || CFG.WALLET_PROVIDER !== 'metamask') return null;

  const handleSwitchNetwork = async () => {
    setIsLoading(true);
    try {
      const success = await switchToRequiredNetwork();
      if (success) {
        toast({
          title: "Network Switched",
          description: "Successfully switched to the required network",
        });
        setIsDismissed(true);
        onDismiss?.();
      } else {
        toast({
          title: "Switch Failed",
          description: "Failed to switch network. Please try manually in your wallet.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while switching networks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  const requiredChainId = getRequiredChainId();

  return (
    <Alert className="border-orange-200 bg-orange-50 text-orange-800">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>
          You're connected to the wrong network. Please switch to Chain ID {requiredChainId} to use testnet features.
        </span>
        <div className="flex items-center gap-2 ml-4">
          <Button
            onClick={handleSwitchNetwork}
            disabled={isLoading}
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {isLoading ? 'Switching...' : 'Switch to Testnet'}
          </Button>
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className="text-orange-600 hover:text-orange-700 hover:bg-orange-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
