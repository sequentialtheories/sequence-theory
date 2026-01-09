import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.0';
import { ethers } from 'https://esm.sh/ethers@6.15.0';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://vaultclub.io',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-vault-club-api-key',
};

// Input validation schema
const CreateUserSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
  name: z.string().max(100).optional(),
  metadata: z.record(z.unknown()).optional().default({})
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const vaultClubApiKey = Deno.env.get('VAULT_CLUB_API_KEY');
    
    // Validate Vault Club API key first
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
    
    // Parse and validate input with Zod
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
      email_confirm: true
    });

    if (authError) {
      console.error('Auth creation error:', authError);
      // Map specific errors to safe user messages
      let userMessage = 'Failed to create user account';
      if (authError.message?.includes('already registered')) {
        userMessage = 'An account with this email already exists';
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

    // Create a deterministic wallet address (server-side) and store it
    const seed = ethers.keccak256(ethers.toUtf8Bytes(`${userId}-${email}`));
    const deterministicAddress = ethers.getAddress(seed.slice(0, 42));
    const { data: walletUpsertData, error: walletUpsertError } = await supabase
      .from('user_wallets')
      .upsert({
        user_id: userId,
        wallet_address: deterministicAddress,
        network: 'polygon'
      }, {
        onConflict: 'user_id'
      })
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
          address: deterministicAddress,
          network: 'polygon'
        },
        api_key: generatedApiKey,
        credentials: {
          email,
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
      error: 'An internal error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
