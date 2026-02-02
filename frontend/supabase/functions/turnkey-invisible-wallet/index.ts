import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

/**
 * DEPRECATED - Turnkey Invisible Wallet Edge Function
 * 
 * ⚠️ THIS FUNCTION HAS BEEN DISABLED FOR SECURITY REASONS
 * 
 * All wallet creation MUST go through Sequence Theory's FastAPI backend
 * which enforces OTP/passkey verification before wallet creation.
 * 
 * Use the following endpoints instead:
 * - POST /api/turnkey/init-email-auth
 * - POST /api/turnkey/verify-email-otp
 * - POST /api/turnkey/create-wallet
 * 
 * See: https://docs.turnkey.com/concepts/policies/delegated-access-backend
 */

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://vaultclub.io',
  'https://www.vaultclub.io',
  'https://sequencetheory.com',
  'https://www.sequencetheory.com',
  'https://sequence-theory.lovable.app'
];

const isAllowedOrigin = (origin: string | null): boolean => {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (origin.endsWith('.lovableproject.com')) return true;
  if (origin.endsWith('.emergentagent.com')) return true;
  if (origin.startsWith('http://localhost:')) return true;
  return false;
};

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = isAllowedOrigin(origin) ? (origin || '*') : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
};

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // SECURITY: All wallet creation must go through ST API with OTP verification
  console.error('[turnkey-invisible-wallet] BLOCKED: Direct wallet creation is disabled. Use ST API.');
  
  return new Response(
    JSON.stringify({ 
      error: "Wallet creation must go through Sequence Theory API",
      message: "Direct wallet provisioning is disabled for security. Use /api/turnkey/init-email-auth, /api/turnkey/verify-email-otp, then /api/turnkey/create-wallet",
      success: false,
    }),
    { 
      status: 403, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
});
