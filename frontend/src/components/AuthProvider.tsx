/**
 * AUTH PROVIDER
 * 
 * Handles authentication state and ensures profile exists.
 * 
 * The profiles table is the SINGLE SOURCE OF TRUTH for user data.
 * This provider ensures a profile record exists whenever a user logs in.
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: any | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  profile: null,
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
  const [profile, setProfile] = useState<any | null>(null);

  // Ensure profile exists in profiles table (single source of truth)
  const ensureProfile = async (session: Session) => {
    if (!session?.access_token) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/user/ensure-profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: session.user?.user_metadata?.name
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        console.log('Profile ensured:', data.profile?.email);
      }
    } catch (error) {
      console.warn('Failed to ensure profile:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        // Handle auth state changes
        if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'INITIAL_SESSION') {
          console.log('Auth state changed:', event, session?.user?.id);
          setSession(session);
          setUser(session?.user ?? null);
          
          // Ensure profile exists when user signs in
          if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
            // Use setTimeout to avoid blocking the auth flow
            setTimeout(() => ensureProfile(session), 100);
          } else if (event === 'SIGNED_OUT') {
            setProfile(null);
          }
        }
        setLoading(false);
      }
    );

    // Check for existing session with error handling
    supabase.auth.getSession()
      .then(async ({ data: { session }, error }) => {
        if (!mounted) return;
        
        if (error) {
          console.warn('Session check error:', error.message);
          if (error.message?.includes('network') || error.message?.includes('fetch')) {
            setSession(null);
            setUser(null);
          }
        } else {
          console.log('Initial session check:', session?.user?.id);
          setSession(session);
          setUser(session?.user ?? null);
          
          // Ensure profile exists for existing session
          if (session) {
            await ensureProfile(session);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        console.warn('Session check failed:', err);
        setLoading(false);
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, profile }}>
      {children}
    </AuthContext.Provider>
  );
};