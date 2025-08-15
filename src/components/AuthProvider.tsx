import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

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

const createWalletForUser = async (userId: string, email: string) => {
  try {
    logger.info('Auto-creating wallet for user', { userId });
    
    // Import the frontend wallet creation function
    const { getOrCreateSequenceWallet } = await import('@/lib/sequenceWaas');
    const result = await getOrCreateSequenceWallet(userId, email);

    if (result.success) {
      logger.info('Wallet auto-created successfully', { walletAddress: result.walletAddress });
    } else {
      logger.error('Failed to auto-create wallet', { error: result.error });
    }
  } catch (error) {
    logger.error('Failed to auto-create wallet', error);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        logger.info('Auth state changed', { event, userId: session?.user?.id });
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Auto-create wallet after successful authentication
        if (session?.user?.email && event === 'SIGNED_IN') {
          logger.info('User authenticated, auto-creating wallet');
          setTimeout(() => {
            createWalletForUser(session.user.id, session.user.email!);
          }, 1000);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      logger.info('Initial session check', { userId: session?.user?.id });
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
