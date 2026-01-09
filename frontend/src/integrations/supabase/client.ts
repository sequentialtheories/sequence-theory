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

// Supabase project configuration
const SUPABASE_URL = "https://qldjhlnsphlixmzzrdwi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsZGpobG5zcGhsaXhtenpyZHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMTQyNjgsImV4cCI6MjA2ODU5MDI2OH0.mIYpRjdBedu6VQl4wBUIbNM1WwOAN_vHdKNhF5l4g9o";

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
