
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

  const ensureUserHasWallet = async (userId: string) => {
    try {
      console.log('Checking wallet for user:', userId);
      
      // Check if user already has a wallet
      const { data: existingWallet, error: walletError } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (walletError) {
        console.error('Error checking existing wallet:', walletError);
        return;
      }

      // If wallet exists and is not pending, we're good
      if (existingWallet && !existingWallet.wallet_address.startsWith('pending_')) {
        console.log('User already has a valid wallet:', existingWallet.wallet_address);
        return;
      }

      // Create or fix wallet
      console.log('Creating/fixing wallet for user:', userId);
      const { data, error } = await supabase.functions.invoke('create-wallet', {
        body: { user_id: userId },
      });

      if (error) {
        console.error('Error creating wallet:', error);
      } else if (data?.success) {
        console.log('Wallet created/connected successfully:', data.wallet_address);
      } else {
        console.error('Wallet creation failed:', data?.error);
      }
    } catch (error) {
      console.error('Error in ensureUserHasWallet:', error);
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
        if (session?.user?.id && event === 'SIGNED_IN') {
          // Use setTimeout to avoid blocking the auth state change
          setTimeout(() => {
            ensureUserHasWallet(session.user.id);
          }, 1000);
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
      if (session?.user?.id) {
        setTimeout(() => {
          ensureUserHasWallet(session.user.id);
        }, 1000);
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
