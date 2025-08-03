import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useOpenConnectModal } from '@0xsequence/connect';
import { useAccount } from 'wagmi';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  connectWallet: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  connectWallet: () => {},
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
  
  const { setOpenConnectModal } = useOpenConnectModal();
  const { isConnected, address } = useAccount();

  const connectWallet = () => {
    setOpenConnectModal(true);
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Trigger wallet connection after successful authentication
        if (session?.user?.email && event === 'SIGNED_IN') {
          console.log('User authenticated, triggering wallet connection...');
          setTimeout(() => {
            connectWallet();
          }, 1000);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Log wallet connection status
  useEffect(() => {
    if (isConnected && address) {
      console.log("✅ Wallet connected:", address);
    }
  }, [isConnected, address]);

  return (
    <AuthContext.Provider value={{ user, session, loading, connectWallet }}>
      {children}
    </AuthContext.Provider>
  );
};