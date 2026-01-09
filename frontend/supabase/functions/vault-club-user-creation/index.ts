import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.0';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

/**
 * Vault Club User Creation - Creates user and provisions REAL Turnkey wallet
 * 
 * This function:
 * 1. Creates user in shared Supabase Auth
 * 2. Calls turnkey-invisible-wallet to provision a REAL Turnkey wallet
 * 3. Returns user data with wallet address
 * 
 * Users created here can login to BOTH Sequence Theory AND Vault Club
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
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-vault-club-api-key',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
};

// Input validation schema
const CreateUserSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
  name: z.string().max(100).optional(),
  metadata: z.record(z.unknown()).optional().default({})
});

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const vaultClubApiKey = Deno.env.get('VAULT_CLUB_API_KEY');
    
    // Validate Vault Club API key (for server-to-server calls)
    const apiKey = req.headers.get('x-vault-club-api-key');
    if (vaultClubApiKey && apiKey !== vaultClubApiKey) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Unauthorized: Invalid API key' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Rate limiting
    const clientIp = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitIdentifier = `vault-user-creation:${clientIp}`;
    
    const rateLimitOk = await supabase.rpc('check_enhanced_rate_limit', {
      p_identifier: rateLimitIdentifier,
      p_limit: 5,
      p_window_minutes: 60,
      p_burst_limit: 2,
      p_burst_window_minutes: 1
    });
    
    if (rateLimitOk.error || !rateLimitOk.data) {
      console.warn('Rate limit exceeded for:', clientIp);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Rate limit exceeded. Please try again later.' 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Parse and validate input
    let validatedInput;
    try {
      const rawBody = await req.json();
      validatedInput = CreateUserSchema.parse(rawBody);
    } catch (validationError) {
      console.error('Input validation error:', validationError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid input: Please check email and password requirements' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { email, password, name, metadata } = validatedInput;
    const originSite = req.headers.get('origin')?.includes('vaultclub') ? 'vault_club' : 'sequence_theory';

    console.log(`Creating user from ${originSite}:`, email);

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name,
        created_via: originSite,
        ...metadata
      },
      email_confirm: true
    });

    if (authError) {
      console.error('Auth creation error:', authError);
      let userMessage = 'Failed to create user account';
      if (authError.message?.includes('already registered')) {
        userMessage = 'An account with this email already exists. You can login with your existing credentials.';
      }
      return new Response(JSON.stringify({ 
        success: false, 
        error: userMessage 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = authData.user?.id;
    if (!userId) {
      console.error('User ID not found after creation');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to create user account' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Provision REAL Turnkey wallet by calling the invisible wallet function internally
    console.log('Provisioning Turnkey wallet for user:', userId);
    
    let walletAddress: string | null = null;
    let walletError: string | null = null;
    
    try {
      // Call turnkey-invisible-wallet Edge Function
      const walletResponse = await fetch(`${supabaseUrl}/functions/v1/turnkey-invisible-wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          user_id: userId,
          email: email,
          trigger_source: `${originSite}_signup`
        }),
      });

      const walletResult = await walletResponse.json();
      
      if (walletResult.success && walletResult.wallet_address) {
        walletAddress = walletResult.wallet_address;
        console.log('✅ Turnkey wallet provisioned:', walletAddress);
      } else {
        walletError = walletResult.error || 'Wallet provisioning failed';
        console.error('Wallet provisioning failed:', walletError);
      }
    } catch (walletErr) {
      console.error('Error calling turnkey-invisible-wallet:', walletErr);
      walletError = 'Wallet service unavailable';
    }

    // Generate API key for cross-platform access
    let generatedApiKey: string | null = null;
    try {
      const { data: apiKeyData, error: apiKeyError } = await supabase.rpc('generate_api_key');
      
      if (!apiKeyError && apiKeyData) {
        const keyHash = await supabase.rpc('hash_api_key', { api_key: apiKeyData });
        
        const { error: insertError } = await supabase
          .from('api_keys')
          .insert({
            user_id: userId,
            name: 'Cross-Platform Access Key',
            key_hash: keyHash.data,
            key_prefix: apiKeyData.substring(0, 8),
            permissions: {
              read_wallet: true,
              read_profile: true,
              vault_club_access: true,
              sequence_theory_access: true
            }
          });

        if (!insertError) {
          generatedApiKey = apiKeyData;
        }
      }
    } catch (keyErr) {
      console.error('API key generation failed:', keyErr);
    }

    console.log('✅ User created successfully:', {
      userId,
      email,
      walletAddress,
      hasApiKey: !!generatedApiKey,
      createdVia: originSite
    });

    return new Response(JSON.stringify({ 
      success: true,
      data: {
        user: {
          id: userId,
          email: authData.user.email,
          name,
          created_at: authData.user.created_at,
          created_via: originSite
        },
        wallet: walletAddress ? {
          address: walletAddress,
          network: 'polygon',
          provider: 'turnkey'
        } : null,
        wallet_provisioning: walletAddress ? 'complete' : 'pending',
        wallet_error: walletError,
        api_key: generatedApiKey,
        message: 'Account created! You can now login to both Sequence Theory and Vault Club with these credentials.'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in vault-club-user-creation:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'An internal error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
