import { useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { useWallet } from './WalletProvider';

/**
 * Auto-creates Sequence wallets for new users after successful authentication
 * This component runs silently in the background and doesn't render any UI
 */
export const AutoWalletCreator = () => {
  const { user } = useAuth();
  const { wallet, loading, createWallet } = useWallet();

  useEffect(() => {
    const autoCreateWallet = async () => {
      // Only create wallet if user is authenticated, no wallet exists, and not currently loading
      if (user && !wallet && !loading) {
        try {
          console.log('Auto-creating Sequence wallet for user:', user.id);
          await createWallet();
        } catch (error) {
          // Silently handle errors - don't break the user experience
          console.warn('Failed to auto-create wallet:', error);
        }
      }
    };

    // Add a small delay to ensure user session is fully established
    const timeoutId = setTimeout(autoCreateWallet, 1000);

    return () => clearTimeout(timeoutId);
  }, [user, wallet, loading, createWallet]);

  // This component doesn't render anything
  return null;
};