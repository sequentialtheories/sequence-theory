import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.0';

const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-vault-club-api-key, idempotency-key, Idempotency-Key, x-idempotency-key, X-Idempotency-Key',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400'
};

serve(async (req) => {
  const origin = req.headers.get('origin') || '';
  const allowedOrigins = new Set([
    'https://staging.sequencetheory.com',
    'https://staging.vaultclub.app',
    'http://localhost:5173',
    'http://localhost:3000',
  ]);
  const allowOrigin = allowedOrigins.has(origin) ? origin : 'null';
  const headers = { ...corsHeaders, 'Access-Control-Allow-Origin': allowOrigin, Vary: 'Origin' };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const vaultClubApiKey = Deno.env.get('VAULT_CLUB_API_KEY');
    
    // Validate Vault Club API key
    const apiKey = req.headers.get('x-vault-club-api-key');
    const request_id = crypto.randomUUID();
    if (!vaultClubApiKey || apiKey !== vaultClubApiKey) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Unauthorized: Invalid Vault Club API key',
        request_id
      }), {
        status: 401,
        headers: { ...headers, 'Content-Type': 'application/json' },
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
    const idempotencyKey = req.headers.get('idempotency-key') || req.headers.get('Idempotency-Key') || req.headers.get('x-idempotency-key') || req.headers.get('X-Idempotency-Key');

    let existingIdempotent: { key: string; request_hash: string } | null = null;
    if (idempotencyKey) {
      const enc = new TextEncoder();
      const digest = await crypto.subtle.digest('SHA-256', enc.encode(`${email}`));
      const hashHex = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');

      const { data: idem, error: idemErr } = await supabase
        .from('idempotency_keys')
        .select('status, response_snapshot')
        .eq('function_name', 'vault-club-auth-sync')
        .eq('key', idempotencyKey)
        .eq('request_hash', hashHex)
        .maybeSingle();

      if (!idemErr && idem && (idem as any).status === 'in_flight') {
        return new Response(JSON.stringify({ success: false, error: 'conflict_idempotency_in_flight', request_id }), { status: 409, headers: { ...headers, 'Content-Type': 'application/json' } });
      }
      if (!idemErr && idem && (idem as any).status === 'success' && (idem as any).response_snapshot) {
        return new Response(JSON.stringify((idem as any).response_snapshot), { headers: { ...headers, 'Content-Type': 'application/json' } });
      }

      await supabase
        .from('idempotency_keys')
        .upsert({
          function_name: 'vault-club-auth-sync',
          key: idempotencyKey,
          user_id: null,
          request_hash: hashHex,
          status: 'in_flight'
        }, { onConflict: 'function_name,key' });

      existingIdempotent = { key: idempotencyKey, request_hash: hashHex };
    }

    if (!email || !password) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Email and password are required',
        request_id
      }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
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
        error: 'Invalid credentials',
        request_id
      }), {
        status: 401,
        headers: { ...headers, 'Content-Type': 'application/json' },
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

    const responsePayload = { 
      success: true,
      request_id,
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

    if (existingIdempotent) {
      await supabase
        .from('idempotency_keys')
        .upsert({
          function_name: 'vault-club-auth-sync',
          key: existingIdempotent.key,
          user_id: userId,
          request_hash: existingIdempotent.request_hash,
          status: 'success',
          response_snapshot: responsePayload
        }, { onConflict: 'function_name,key' });
    }

    const clientIP = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent');
    try {
      await supabase.from('api_access_logs').insert({
        endpoint: '/vault-club-auth-sync',
        ip_address: clientIP,
        user_agent: userAgent,
        request_data: { email },
        response_status: 200
      });
    } catch (_e) {}

    await supabase
      .from('idempotency_keys')
      .upsert({
        function_name: 'vault-club-auth-sync',
        key: idempotencyKey || '',
        user_id: userId,
        request_hash: null,
        status: 'success',
        response_snapshot: responsePayload
      }, { onConflict: 'function_name,key' });

    return new Response(JSON.stringify(responsePayload), {
      headers: { ...headers, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in vault-club-auth-sync:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }
});
