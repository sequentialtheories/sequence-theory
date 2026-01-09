import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

/**
 * Cross-Platform Auth Sync
 * 
 * Validates credentials and returns user data for cross-platform login.
 * Works for BOTH Sequence Theory and Vault Club - true two-way sync.
 * 
 * Users created on either platform can authenticate on both.
 */

// Allow both domains for true two-way sync
const ALLOWED_ORIGINS = [
  'https://vaultclub.io',
  'https://sequencetheory.com',
  'https://sequence-theory.lovable.app',
  'https://www.vaultclub.io',
  'https://www.sequencetheory.com'
];

const getCorsHeaders = (origin: string | null) => {
  const isAllowed = origin && (
    ALLOWED_ORIGINS.includes(origin) ||
    origin.endsWith('.lovableproject.com') ||
    origin.endsWith('.emergentagent.com') ||
    origin.startsWith('http://localhost:')
  );
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-vault-club-api-key, x-api-key',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };
};

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Rate limiting
    const clientIp = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitIdentifier = `auth-sync:${clientIp}`;
    
    const rateLimitOk = await supabase.rpc('check_enhanced_rate_limit', {
      p_identifier: rateLimitIdentifier,
      p_limit: 10,
      p_window_minutes: 60,
      p_burst_limit: 3,
      p_burst_window_minutes: 1
    });
    
    if (rateLimitOk.error || !rateLimitOk.data) {
      console.warn('Rate limit exceeded for:', clientIp);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Rate limit exceeded' 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Optional API key validation (for server-to-server calls)
    const vaultClubApiKey = Deno.env.get('VAULT_CLUB_API_KEY');
    const providedApiKey = req.headers.get('x-vault-club-api-key') || req.headers.get('x-api-key');
    
    // If API key is configured and provided, validate it
    if (vaultClubApiKey && providedApiKey && providedApiKey !== vaultClubApiKey) {
      await logAccess(supabase, null, 'auth-sync', clientIp, req.headers.get('user-agent'), null, 401);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Unauthorized: Invalid API key' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { email, password } = await req.json();
    const originSite = req.headers.get('origin')?.includes('vaultclub') ? 'vault_club' : 'sequence_theory';

    if (!email || !password) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Email and password are required' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Auth sync from ${originSite} for:`, email);

    // Attempt to sign in with the provided credentials
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.log('Authentication failed:', authError.message);
      await logAccess(supabase, null, 'auth-sync', clientIp, req.headers.get('user-agent'), { email: '***' }, 401);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid credentials' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = authData.user?.id;
    if (!userId) {
      throw new Error('User ID not found');
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    // Get user wallet
    const { data: wallet } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    // If no wallet exists, trigger provisioning
    if (!wallet?.wallet_address) {
      console.log('No wallet found, triggering provisioning for:', userId);
      
      try {
        await fetch(`${supabaseUrl}/functions/v1/turnkey-invisible-wallet`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            user_id: userId,
            email: email,
            trigger_source: `${originSite}_login`
          }),
        });
      } catch (err) {
        console.error('Wallet provisioning trigger failed:', err);
      }
    }

    // Get or create API key for cross-platform access
    let { data: existingApiKey } = await supabase
      .from('api_keys')
      .select('key_prefix')
      .eq('user_id', userId)
      .eq('name', 'Cross-Platform Access Key')
      .eq('is_active', true)
      .maybeSingle();

    let generatedApiKey: string | null = null;
    if (!existingApiKey) {
      const { data: newApiKeyData, error: newApiKeyError } = await supabase.rpc('generate_api_key');
      
      if (!newApiKeyError && newApiKeyData) {
        const keyHash = await supabase.rpc('hash_api_key', { api_key: newApiKeyData });
        
        const { error: insertError } = await supabase
          .from('api_keys')
          .insert({
            user_id: userId,
            name: 'Cross-Platform Access Key',
            key_hash: keyHash.data,
            key_prefix: newApiKeyData.substring(0, 8),
            permissions: {
              read_wallet: true,
              read_profile: true,
              vault_club_access: true,
              sequence_theory_access: true
            }
          });

        if (!insertError) {
          generatedApiKey = newApiKeyData;
        }
      }
    }

    console.log('✅ Auth sync successful for:', email, 'from:', originSite);
    await logAccess(supabase, null, 'auth-sync', clientIp, req.headers.get('user-agent'), { email: '***' }, 200);

    // Return user data (no refresh token for security)
    return new Response(JSON.stringify({
      success: true,
      data: {
        user: {
          id: userId,
          email: authData.user.email,
          name: profile?.name || authData.user.user_metadata?.name || 'User',
          created_at: authData.user.created_at,
          created_via: authData.user.user_metadata?.created_via || 'unknown'
        },
        wallet: wallet?.wallet_address ? {
          address: wallet.wallet_address,
          network: wallet.network || 'polygon',
          provider: wallet.provider || 'turnkey'
        } : null,
        wallet_status: wallet?.wallet_address ? 'ready' : 'provisioning',
        api_key: generatedApiKey,
        session: {
          access_token: authData.session?.access_token,
          expires_at: authData.session?.expires_at
          // refresh_token intentionally omitted for security
        },
        message: 'Login successful! Your account works on both Sequence Theory and Vault Club.'
      }
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      },
    });

  } catch (error) {
    console.error('Error in auth-sync:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Access logging helper
async function logAccess(supabase: any, apiKeyId: string | null, endpoint: string, ipAddress: string, userAgent: string | null, requestData: any, responseStatus: number) {
  try {
    await supabase.from('api_access_logs').insert({
      api_key_id: apiKeyId,
      endpoint: endpoint,
      ip_address: ipAddress,
      user_agent: userAgent,
      request_data: requestData,
      response_status: responseStatus
    });
  } catch (error) {
    console.error('Failed to log access:', error);
  }
}
