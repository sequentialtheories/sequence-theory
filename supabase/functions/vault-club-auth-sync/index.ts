import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://vaultclub.io',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-vault-club-api-key',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const vaultClubApiKey = Deno.env.get('VAULT_CLUB_API_KEY');
    
    // Validate Vault Club API key
    const apiKey = req.headers.get('x-vault-club-api-key');
    if (!vaultClubApiKey || apiKey !== vaultClubApiKey) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Unauthorized: Invalid Vault Club API key' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Email and password are required' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Validating Sequence Theory credentials for:', email);

    // Attempt to sign in with the provided credentials
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.log('Authentication failed:', authError.message);
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
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    // Get user wallet
    const { data: wallet, error: walletError } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    // Get or create API key for Vault Club access
    let { data: existingApiKey, error: apiKeyFetchError } = await supabase
      .from('api_keys')
      .select('key_prefix')
      .eq('user_id', userId)
      .eq('name', 'Vault Club Access Key')
      .eq('is_active', true)
      .maybeSingle();

    let generatedApiKey: string | null = null;
    if (!existingApiKey && !apiKeyFetchError) {
      // Create new API key
      const { data: newApiKeyData, error: newApiKeyError } = await supabase.rpc('generate_api_key');
      
      if (!newApiKeyError && newApiKeyData) {
        const keyHash = await supabase.rpc('hash_api_key', { api_key: newApiKeyData });
        
        const { error: insertError } = await supabase
          .from('api_keys')
          .insert({
            user_id: userId,
            name: 'Vault Club Access Key',
            key_hash: keyHash.data,
            key_prefix: newApiKeyData.substring(0, 8),
            permissions: {
              read_wallet: true,
              read_profile: true,
              vault_club_access: true
            }
          });

        if (!insertError) {
          generatedApiKey = newApiKeyData;
        }
      }
    }

    console.log('✅ Authentication successful for:', email);

    // SECURITY: Don't return refresh tokens to external systems
    return new Response(JSON.stringify({ 
      success: true,
      data: {
        user: {
          id: userId,
          email: authData.user.email,
          name: profile?.name || 'Unknown User',
          created_at: authData.user.created_at
        },
        wallet: wallet ? {
          address: wallet.wallet_address,
          network: wallet.network
        } : null,
        api_key: generatedApiKey,
        session: {
          access_token: authData.session?.access_token,
          expires_at: authData.session?.expires_at
          // refresh_token removed for security
        }
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
    console.error('Error in vault-club-auth-sync:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});