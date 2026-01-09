import { useEffect, useRef, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

const BACKEND_URL = import.meta.env.REACT_APP_BACKEND_URL || '';

/**
 * Hook that silently provisions a Turnkey wallet for authenticated users
 * who don't have one yet. Completely invisible to the user.
 * 
 * This calls the backend API which handles Turnkey wallet creation.
 */
export const useInvisibleWallet = (session: Session | null) => {
  const provisioningRef = useRef(false);
  const checkedRef = useRef(false);

  const provisionWallet = useCallback(async (userSession: Session) => {
    // Prevent duplicate calls
    if (provisioningRef.current) return;
    provisioningRef.current = true;

    try {
      console.log('[InvisibleWallet] Checking wallet for user:', userSession.user.id);

      // Check if profile already has eth_address
      const { data: profile } = await supabase
        .from('profiles')
        .select('eth_address')
        .eq('user_id', userSession.user.id)
        .maybeSingle();

      if (profile?.eth_address) {
        console.log('[InvisibleWallet] Wallet already exists:', profile.eth_address.slice(0, 10) + '...');
        return;
      }

      // Also check user_wallets table
      const { data: wallet } = await supabase
        .from('user_wallets')
        .select('wallet_address')
        .eq('user_id', userSession.user.id)
        .maybeSingle();

      if (wallet?.wallet_address) {
        console.log('[InvisibleWallet] Wallet exists in user_wallets:', wallet.wallet_address.slice(0, 10) + '...');
        // Sync to profile if missing there
        await supabase
          .from('profiles')
          .update({ eth_address: wallet.wallet_address })
          .eq('user_id', userSession.user.id);
        return;
      }

      console.log('[InvisibleWallet] No wallet found, provisioning via backend...');

      // Call the BACKEND API to provision wallet
      const response = await fetch(`${BACKEND_URL}/api/provision-wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userSession.access_token}`,
        },
        body: JSON.stringify({
          user_id: userSession.user.id,
          email: userSession.user.email || ''
        })
      });

      const data = await response.json();

      if (data.success) {
        console.log('[InvisibleWallet] Wallet provisioned:', data.wallet_address?.slice(0, 10) + '...');
      } else {
        console.error('[InvisibleWallet] Provisioning failed:', data.error);
      }
    } catch (err) {
      console.error('[InvisibleWallet] Error:', err);
    } finally {
      provisioningRef.current = false;
    }
  }, []);

  useEffect(() => {
    // Only run once per session
    if (!session || checkedRef.current) return;
    checkedRef.current = true;

    // Defer to avoid blocking auth flow
    const timer = setTimeout(() => {
      provisionWallet(session);
    }, 500);

    return () => clearTimeout(timer);
  }, [session, provisionWallet]);
};
