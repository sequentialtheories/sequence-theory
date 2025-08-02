import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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

  // Use Supabase edge function for proper Sequence WaaS wallet creation
  const handleWalletCreation = async (email: string) => {
    try {
      console.log('🚀 Creating wallet using Sequence WaaS via edge function for email:', email);
      
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
        console.log('✅ User already has a valid wallet:', existingWallet.wallet_address);
        return;
      }

      // Use Supabase edge function for proper WaaS wallet creation
      console.log('📝 Calling Sequence WaaS edge function...');
      const { data, error } = await supabase.functions.invoke('create-sequence-wallet', {
        body: {
          email,
          userId,
          flowStage: 'auto-create'
        }
      });

      if (error) {
        console.error('❌ Edge function error:', error);
        throw new Error(`Wallet creation failed: ${error.message}`);
      }

      if (!data?.success) {
        console.error('❌ Wallet creation failed:', data?.error);
        throw new Error(`Wallet creation failed: ${data?.error || 'Unknown error'}`);
      }

      console.log('✅ Wallet created successfully via edge function:', data.walletAddress);

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