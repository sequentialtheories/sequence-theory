

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.0';
import { ethers } from 'https://esm.sh/ethers@6.15.0';

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
    const endpoint = 'vault-club-user-creation';
    const method = 'POST';
    if (idk) {
      const { data: idem } = await supabase.from('api_idempotency').select('*').eq('idempotency_key', idk).eq('endpoint', endpoint).eq('method', method).limit(1).maybeSingle();
      if (idem) {
        return new Response(JSON.stringify(idem.response_body), { status: idem.status_code, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }
    const { email, password, name, metadata = {} } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Email and password are required' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
        error: `Failed to create user: ${authError.message}` 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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

    const body = { 
      success: true,
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
    if (idk) {
      await supabase.from('api_idempotency').insert({ idempotency_key: idk, user_id: userId, endpoint, method, status_code: 200, response_body: body });
    }
    await supabase.from('api_audit_logs').insert({ user_id: userId, api_key_id: null, endpoint, method, status_code: 200, idempotency_key: idk, request_meta: {}, response_meta: body });
    return new Response(JSON.stringify(body), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in vault-club-user-creation:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
