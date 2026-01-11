/**
 * VAULT ADDRESS DISPLAY
 * 
 * Displays the user's non-custodial wallet information.
 * 
 * SECURITY NOTICE:
 * - This wallet is 100% non-custodial
 * - Sequence Theory has NO access to private keys
 * - Only the user controls their funds
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Copy, Check, Shield, Key, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';
import { WalletSetup } from '@/components/wallet/WalletSetup';
import { WalletManager } from '@/components/wallet/WalletManager';

interface VaultAddressDisplayProps {
  compact?: boolean;
}

export const VaultAddressDisplay = ({ compact = false }: VaultAddressDisplayProps) => {
  const { state } = useWallet();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  const walletAddress = state.address;

  const copyToClipboard = async () => {
    if (!walletAddress) return;
    
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy address to clipboard",
        variant: "destructive",
      });
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Compact version for headers/nav
  if (compact) {
    if (!state.isInitialized) {
      return null;
    }

    if (!state.hasWallet) {
      return (
        <button
          onClick={() => setShowSetup(true)}
          className="flex items-center gap-2 text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors"
        >
          <Plus className="h-3 w-3" />
          <span>Create Wallet</span>
        </button>
      );
    }

    if (walletAddress) {
      return (
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 text-sm font-mono bg-secondary/50 px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors"
        >
          <Wallet className="h-3 w-3" />
          <span>{formatAddress(walletAddress)}</span>
          {copied ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <Copy className="h-3 w-3 opacity-50" />
          )}
        </button>
      );
    }

    return null;
  }

  // Show wallet setup if no wallet exists
  if (!state.hasWallet) {
    return <WalletSetup />;
  }

  // Show wallet manager if wallet exists
  return <WalletManager />;
};

export default VaultAddressDisplay;
