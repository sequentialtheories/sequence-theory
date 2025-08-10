import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-vault-club-api-key, idempotency-key',
};

serve(async (req) => {
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
    const idk = req.headers.get('Idempotency-Key') || null;
    const endpoint = 'vault-club-auth-sync';
    const method = 'POST';
    if (idk) {
      const { data: idem } = await supabase.from('api_idempotency').select('*').eq('idempotency_key', idk).eq('endpoint', endpoint).eq('method', method).limit(1).maybeSingle();
      if (idem) {
        return new Response(JSON.stringify(idem.response_body), { status: idem.status_code, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }
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

    const body = { 
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
          refresh_token: authData.session?.refresh_token,
          expires_at: authData.session?.expires_at
        }
      }
    };
    if (idk) {
      await supabase.from('api_idempotency').insert({ idempotency_key: idk, user_id: userId, endpoint, method, status_code: 200, response_body: body });
    }
    await supabase.from('api_audit_logs').insert({ user_id: userId, api_key_id: null, endpoint, method, status_code: 200, idempotency_key: idk, request_meta: {}, response_meta: body });
    return new Response(JSON.stringify(body), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
