
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

  // Define your custom wallet creation function here
  const handleWalletCreation = async (email: string) => {
    // Your custom Sequence SDK logic will go here
    // This function should generate a smart contract wallet and save the address to Supabase
    console.log('🚀 Creating wallet for email:', email);
    
    // TODO: Implement your custom Sequence SDK wallet creation logic
    // Example structure:
    // 1. Use Sequence SDK to generate wallet
    // 2. Save wallet address to Supabase user_wallets table
    // 3. Handle any errors appropriately
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
