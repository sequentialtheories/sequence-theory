import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { useWallet } from './WalletProvider';
import { sequenceConfig } from '@/lib/config';

/**
 * Auto-creates Sequence wallets for new users after successful authentication
 * This component runs silently in the background and doesn't render any UI
 */
export const AutoWalletCreator = () => {
  const { user } = useAuth();
  const { wallet, loading, createWallet } = useWallet();
  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    const autoCreateWallet = async () => {
      // Guard: Only run once per session
      if (hasAttempted) {
        console.log('AutoWalletCreator: Already attempted, skipping');
        return;
      }

      // Guard: Check if Sequence keys are configured
      if (!sequenceConfig.isConfigured) {
        console.log('AutoWalletCreator: Sequence not configured, skipping', {
          projectKey: sequenceConfig.projectAccessKeySource,
          waasKey: sequenceConfig.waasConfigKeySource
        });
        return;
      }

      // Guard: Only create wallet if user is authenticated, no wallet exists, and not currently loading
      if (user && !wallet && !loading) {
        setHasAttempted(true);
        try {
          console.log('=== AUTO WALLET CREATION TRIGGERED ===');
          console.log('AutoWalletCreator: Creating wallet for user:', user.id);
          await createWallet();
          console.log('AutoWalletCreator: ✅ Wallet creation completed');
        } catch (error) {
          // Silently handle errors - don't break the user experience
          console.warn('AutoWalletCreator: ❌ Failed to auto-create wallet:', error);
        }
      } else {
        console.log('AutoWalletCreator: Skipping wallet creation', {
          hasUser: !!user,
          hasWallet: !!wallet,
          isLoading: loading,
          configured: sequenceConfig.isConfigured
        });
      }
    };

    // Add a small delay to ensure user session is fully established
    const timeoutId = setTimeout(autoCreateWallet, 1000);

    return () => clearTimeout(timeoutId);
  }, [user, wallet, loading, createWallet, hasAttempted]);

  // Reset attempt flag when user changes
  useEffect(() => {
    if (user?.id) {
      setHasAttempted(false);
    }
  }, [user?.id]);

  // This component doesn't render anything
  return null;
};