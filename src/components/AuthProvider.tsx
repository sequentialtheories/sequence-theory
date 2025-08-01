
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { sequenceWalletService } from '@/lib/sequenceWallet';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Custom wallet creation function for non-custodial Sequence wallets
  const handleWalletCreation = async (email: string) => {
    try {
      console.log('🚀 Creating non-custodial Sequence wallet for email:', email);
      
      const userId = session?.user?.id;
      if (!userId) {
        console.error('❌ No user ID available for wallet creation');
        return;
      }

      // Check if user already has a wallet
      const { data: existingWallet } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (existingWallet && 
          existingWallet.wallet_address && 
          !existingWallet.wallet_address.startsWith('0x0000') && 
          !existingWallet.wallet_address.startsWith('pending_')) {
        console.log('✅ User already has a valid non-custodial wallet:', existingWallet.wallet_address);
        return;
      }

      // Create non-custodial wallet using Sequence edge function
      console.log('📝 Creating new non-custodial Sequence wallet...');
      const { data, error } = await supabase.functions.invoke('create-sequence-wallet', {
        body: {
          email,
          userId,
          flowStage: 'auto-create', // Use auto-create for seamless non-custodial wallet
          nonCustodial: true // Ensure non-custodial wallet creation
        }
      });

      if (error) {
        console.error('❌ Error creating non-custodial wallet:', error);
        return;
      }

      if (data?.success && data?.walletAddress) {
        console.log('✅ Non-custodial Sequence wallet created successfully:', data.walletAddress);
        
        // Save wallet to database with non-custodial flag
        const walletConfig = {
          email,
          network: 'polygon',
          non_custodial: true,
          sequence_account: true,
          user_controlled: true,
          status: 'active',
          created_at: new Date().toISOString()
        };

        await supabase
          .from('user_wallets')
          .upsert({
            user_id: userId,
            wallet_address: data.walletAddress,
            wallet_config: walletConfig,
            network: 'polygon'
          });

        console.log('✅ Non-custodial wallet saved to database with full user control');
      } else {
        console.error('❌ Failed to create non-custodial wallet:', data?.error || 'Unknown error');
      }
    } catch (error) {
      console.error('💥 Error in handleWalletCreation:', error);
    }
  };

  const ensureUserHasWallet = async (userId: string, userEmail: string) => {
    try {
      console.log('🚀 Starting wallet check for user:', userId, userEmail);
      
      // Check if user already has a wallet
      const { data: existingWallet, error: walletError } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (walletError) {
        console.error('❌ Error checking existing wallet:', walletError);
        return;
      }

      // If wallet exists and is not a placeholder or pending, we're good
      if (existingWallet && 
          existingWallet.wallet_address && 
          !existingWallet.wallet_address.startsWith('0x0000') && 
          !existingWallet.wallet_address.startsWith('pending_')) {
        console.log('✅ User already has a valid wallet:', existingWallet.wallet_address);
        return;
      }

      // Call your custom wallet creation function
      console.log('📝 Calling custom handleWalletCreation function...');
      await handleWalletCreation(userEmail);
      
    } catch (error) {
      console.error('💥 Error in ensureUserHasWallet:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Automatically ensure wallet exists for authenticated users
        if (session?.user?.id && session?.user?.email && event === 'SIGNED_IN') {
          // Use setTimeout to avoid blocking the auth state change
          setTimeout(() => {
            ensureUserHasWallet(session.user.id, session.user.email!);
          }, 500);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Ensure existing authenticated users have wallets
      if (session?.user?.id && session?.user?.email) {
        setTimeout(() => {
          ensureUserHasWallet(session.user.id, session.user.email!);
        }, 500);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
