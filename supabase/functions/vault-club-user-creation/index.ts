import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-vault-club-api-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
    const requestApiKey = req.headers.get('x-vault-club-api-key');
    if (!vaultClubApiKey || requestApiKey !== vaultClubApiKey) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Unauthorized: Invalid Vault Club API key' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
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

    console.log('Creating Sequence Theory user:', email);

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

    // Create wallet for the user
    const { createWalletForUser } = await import('../../../src/lib/sequenceWaas.ts');
    const walletResult = await createWalletForUser(userId, email);

    if (!walletResult.success) {
      console.error('Wallet creation failed:', walletResult.error);
      // Don't fail the entire request if wallet creation fails
    }

    // Generate API key for the user
    const { data: apiKeyData, error: apiKeyError } = await supabase.rpc('generate_api_key');
    
    let generatedApiKey = null;
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

    console.log('✅ Sequence Theory user created successfully:', {
      userId,
      email,
      walletAddress: walletResult.walletAddress,
      hasApiKey: !!generatedApiKey
    });

    return new Response(JSON.stringify({ 
      success: true,
      data: {
        user: {
          id: userId,
          email: authData.user.email,
          name,
          created_at: authData.user.created_at
        },
        wallet: {
          address: walletResult.walletAddress,
          network: 'polygon'
        },
        api_key: generatedApiKey,
        credentials: {
          email,
          // Don't return password for security
          user_id: userId
        }
      }
    }), {
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
