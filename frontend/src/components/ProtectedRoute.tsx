import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { useWallet } from '@/contexts/WalletContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireWallet?: boolean;
}

export const ProtectedRoute = ({ children, requireWallet = true }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { state: walletState } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect to auth if not logged in
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    // If wallet is required and user doesn't have one, redirect to wallet setup
    // (except if already on wallet-setup page)
    if (
      requireWallet && 
      !authLoading && 
      user && 
      walletState.isInitialized && 
      !walletState.hasWallet &&
      location.pathname !== '/wallet-setup'
    ) {
      navigate('/wallet-setup');
    }
  }, [user, authLoading, walletState.isInitialized, walletState.hasWallet, navigate, location.pathname, requireWallet]);

  if (authLoading || !walletState.isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // If wallet required but not present, don't render (redirect will happen)
  if (requireWallet && !walletState.hasWallet && location.pathname !== '/wallet-setup') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};