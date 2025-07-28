
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

      // If wallet is pending, try to retry it
      if (existingWallet && existingWallet.wallet_address.startsWith('pending_')) {
        console.log('🔄 Found pending wallet, attempting retry...');
        await sequenceWalletService.retryPendingWallets();
        return;
      }

      console.log('📝 Creating new wallet for user...');
      
      // Create wallet using Sequence service
      const walletResult = await sequenceWalletService.createWalletForUser(userEmail, userId);
      
      if (!walletResult.success) {
        console.error('❌ Failed to create wallet:', walletResult.error);
        
        // Create a pending wallet record for manual retry
        const pendingWalletConfig = {
          email: userEmail,
          status: 'pending',
          created_at: Date.now(),
          error: walletResult.error
        };

        if (existingWallet) {
          await supabase
            .from('user_wallets')
            .update({
              wallet_address: `pending_${userId}`,
              wallet_config: pendingWalletConfig,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);
        } else {
          await supabase
            .from('user_wallets')
            .insert({
              user_id: userId,
              wallet_address: `pending_${userId}`,
              wallet_config: pendingWalletConfig,
              network: 'polygon'
            });
        }
        return;
      }

      // Save successful wallet to database
      const walletConfig = {
        email: userEmail,
        network: 'polygon',
        auto_created: true,
        status: 'active',
        created_at: new Date().toISOString()
      };

      if (existingWallet) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('user_wallets')
          .update({
            wallet_address: walletResult.address,
            wallet_config: walletConfig,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (updateError) {
          console.error('❌ Failed to update wallet:', updateError);
        } else {
          console.log('✅ Wallet updated successfully for user:', userId);
        }
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('user_wallets')
          .insert({
            user_id: userId,
            wallet_address: walletResult.address,
            wallet_config: walletConfig,
            network: 'polygon'
          });

        if (insertError) {
          console.error('❌ Failed to insert wallet:', insertError);
        } else {
          console.log('✅ Wallet created successfully for user:', userId);
        }
      }
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
