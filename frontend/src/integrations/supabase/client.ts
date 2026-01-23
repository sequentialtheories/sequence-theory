/**
 * Supabase Client Configuration
 * 
 * This client is configured for cross-domain session sharing between:
 * - Sequence Theory (sequencetheory.com)
 * - The Vault Club (vaultclub.io)
 * 
 * Both domains use the same Supabase project, enabling:
 * - Shared authentication
 * - Unified user profiles
 * - Automatic wallet provisioning
 * 
 * IMPORTANT: Ensure both domains are added to Supabase Dashboard:
 * Authentication > URL Configuration > Redirect URLs
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Supabase project configuration from environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY');
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    // Use localStorage for session persistence across page reloads
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    
    // Enable session persistence - critical for cross-domain sharing
    persistSession: true,
    
    // Automatically refresh tokens before expiry
    autoRefreshToken: true,
    
    // Detect session from URL (for OAuth redirects)
    detectSessionInUrl: true,
    
    // Flow type for OAuth
    flowType: 'pkce',
  },
  
  // Global settings
  global: {
    headers: {
      'X-Client-Info': 'sequence-theory-app',
    },
  },
});

// Export project URL for reference (useful for Edge Functions)
export const SUPABASE_PROJECT_URL = SUPABASE_URL;
