import { useEffect, useRef, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

const BACKEND_URL = import.meta.env.REACT_APP_BACKEND_URL || '';

/**
 * Hook that silently provisions a Turnkey wallet for authenticated users
 * who don't have one yet. Completely invisible to the user.
 */
export const useInvisibleWallet = (session: Session | null) => {
  const provisioningRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);

  const provisionWallet = useCallback(async (userSession: Session) => {
    const userId = userSession.user.id;
    
    // Prevent duplicate calls for same user
    if (provisioningRef.current) {
      console.log('[InvisibleWallet] Already provisioning, skipping');
      return;
    }
    
    provisioningRef.current = true;

    try {
      console.log('[InvisibleWallet] Checking wallet for user:', userId);

      // Small delay to ensure profile is created by database trigger
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if profile already has eth_address
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('eth_address')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('[InvisibleWallet] Error fetching profile:', profileError);
      }

      if (profile?.eth_address) {
        console.log('[InvisibleWallet] Wallet already exists:', profile.eth_address.slice(0, 10) + '...');
        return;
      }

      // Also check user_wallets table
      const { data: wallet } = await supabase
        .from('user_wallets')
        .select('wallet_address')
        .eq('user_id', userId)
        .maybeSingle();

      if (wallet?.wallet_address) {
        console.log('[InvisibleWallet] Wallet exists in user_wallets, syncing to profile');
        await supabase
          .from('profiles')
          .update({ eth_address: wallet.wallet_address })
          .eq('user_id', userId);
        return;
      }

      console.log('[InvisibleWallet] No wallet found, provisioning via backend...');
      console.log('[InvisibleWallet] Backend URL:', BACKEND_URL);

      // Call the BACKEND API to provision wallet
      const response = await fetch(`${BACKEND_URL}/api/provision-wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userSession.access_token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          email: userSession.user.email || ''
        })
      });

      if (!response.ok) {
        console.error('[InvisibleWallet] Backend error:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('[InvisibleWallet] Error details:', errorText);
        return;
      }

      const data = await response.json();

      if (data.success) {
        console.log('[InvisibleWallet] ✅ Wallet provisioned:', data.wallet_address);
        
        // Update the profile with the wallet address (in case backend didn't)
        if (data.wallet_address) {
          await supabase
            .from('profiles')
            .update({ eth_address: data.wallet_address })
            .eq('user_id', userId);
        }
      } else {
        console.error('[InvisibleWallet] ❌ Provisioning failed:', data.error);
      }
    } catch (err) {
      console.error('[InvisibleWallet] Error:', err);
    } finally {
      provisioningRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!session?.user?.id) {
      // Reset when user logs out
      lastUserIdRef.current = null;
      return;
    }

    const userId = session.user.id;
    
    // Only provision if this is a new user session
    if (lastUserIdRef.current === userId) {
      console.log('[InvisibleWallet] Same user, skipping');
      return;
    }
    
    lastUserIdRef.current = userId;
    console.log('[InvisibleWallet] New session detected for user:', userId);

    // Defer to avoid blocking auth flow
    const timer = setTimeout(() => {
      provisionWallet(session);
    }, 500);

    return () => clearTimeout(timer);
  }, [session, provisionWallet]);
};
