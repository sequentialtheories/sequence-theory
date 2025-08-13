

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.0';
import { ethers } from 'https://esm.sh/ethers@6.15.0';

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
    const { email, password, name, metadata = {} } = await req.json();

    const idempotencyKey = req.headers.get('idempotency-key') || req.headers.get('Idempotency-Key') || req.headers.get('x-idempotency-key') || req.headers.get('X-Idempotency-Key');
    let _idem: { key: string; request_hash: string } | null = null;
    if (idempotencyKey) {
      const enc = new TextEncoder();
      const digest = await crypto.subtle.digest('SHA-256', enc.encode(`${email}:${name || ''}`));
      const hashHex = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');

      const { data: idem, error: idemErr } = await supabase
        .from('idempotency_keys')
        .select('status, response_snapshot')
        .eq('function_name', 'vault-club-user-creation')
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
          function_name: 'vault-club-user-creation',
          key: idempotencyKey,
          user_id: null,
          request_hash: hashHex,
          status: 'in_flight'
        }, { onConflict: 'function_name,key' });

      _idem = { key: idempotencyKey, request_hash: hashHex };
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

    console.log('Creating Sequence Theory user for Vault Club:', email);

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name,
        created_via: 'vault_club',
        ...metadata
      },
      email_confirm: true // Auto-confirm email for Vault Club users
    });

    if (authError) {
      console.error('Auth creation error:', authError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: `Failed to create user: ${authError.message}`,
        request_id
      }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    const userId = authData.user?.id;
    if (!userId) {
      throw new Error('User ID not found after creation');
    }

    // Create a deterministic wallet address (server-side) and store it
    const seed = ethers.keccak256(ethers.toUtf8Bytes(`${userId}-${email}`));
    const deterministicAddress = ethers.getAddress(seed.slice(0, 42));
    const { data: walletUpsertData, error: walletUpsertError } = await supabase
      .from('user_wallets')
      .upsert(
        {
          user_id: userId,
          wallet_address: deterministicAddress,
          network: 'polygon',
          email
        },
        { onConflict: 'user_id' }
      )
      .select()
      .maybeSingle();

    if (walletUpsertError) {
      console.error('Wallet upsert failed:', walletUpsertError.message || walletUpsertError);
    }

    // Generate API key for the user
    const { data: apiKeyData, error: apiKeyError } = await supabase.rpc('generate_api_key');
    
    let generatedApiKey: string | null = null;
    if (!apiKeyError && apiKeyData) {
      const keyHash = await supabase.rpc('hash_api_key', { api_key: apiKeyData });
      
      const { error: insertError } = await supabase
        .from('api_keys')
        .insert({
          user_id: userId,
          name: 'Vault Club Access Key',
          key_hash: keyHash.data,
          key_prefix: apiKeyData.substring(0, 8),
          permissions: {
            read_wallet: true,
            read_profile: true,
            vault_club_access: true
          }
        });

      if (!insertError) {
        generatedApiKey = apiKeyData;
      }
    }

    console.log('✅ User created successfully:', {
      userId,
      email,
      walletAddress: deterministicAddress,
      hasApiKey: !!generatedApiKey
    });

    const responsePayload = { 
      success: true,
      request_id,
      data: {
        user: {
          id: userId,
          email: authData.user.email,
          name,
          created_at: authData.user.created_at
        },
        wallet: {
          address: deterministicAddress,
          network: 'polygon'
        },
        api_key: generatedApiKey,
        credentials: {
          email,
          user_id: userId
        }
      }
    };
    
    if (_idem) {
      await supabase
        .from('idempotency_keys')
        .upsert({
          function_name: 'vault-club-user-creation',
          key: _idem.key,
          user_id: userId,
          request_hash: _idem.request_hash,
          status: 'success',
          response_snapshot: responsePayload
        }, { onConflict: 'function_name,key' });
    }
    
    const clientIP = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent');
    try {
      await supabase.from('api_access_logs').insert({
        endpoint: '/vault-club-user-creation',
        ip_address: clientIP,
        user_agent: userAgent,
        request_data: { email },
        response_status: 200
      });
    } catch (_e) {}
    
    return new Response(JSON.stringify(responsePayload), {
      headers: { ...headers, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in vault-club-user-creation:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }
});
