import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.0';
import { ethers } from 'https://esm.sh/ethers@6.15.0';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

// Get allowed origins from environment
const getAllowedOrigins = () => {
  const origins = Deno.env.get('ALLOWED_ORIGINS') || 'https://vaultclub.io';
  return origins.split(',').map(origin => origin.trim());
};

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigins = getAllowedOrigins();
  const allowedOrigin = origin && allowedOrigins.includes(origin) ? origin : 'https://vaultclub.io';
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-vault-club-api-key',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache'
  };
};

// Input validation schemas
const UpdateUserSchema = z.object({
  user_id: z.string().uuid(),
  email: z.string().email().max(254).optional(),
  name: z.string().max(100).optional(),
  metadata: z.record(z.unknown()).optional().default({})
});

const MigrateUserSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
  name: z.string().max(100).optional(),
  metadata: z.record(z.unknown()).optional().default({})
});

const MigrateUsersSchema = z.object({
  users: z.array(MigrateUserSchema)
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
    
    // Rate limiting
    const clientIp = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitIdentifier = `vault-user-sync:${clientIp}`;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
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
    
    // Validate Vault Club API key
    const apiKey = req.headers.get('x-vault-club-api-key');
    if (!vaultClubApiKey || apiKey !== vaultClubApiKey) {
      await logAccess(supabase, null, 'vault-club-user-sync', clientIp, req.headers.get('user-agent'), null, 401);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Unauthorized: Invalid Vault Club API key' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'get';

    if (req.method === 'GET' && action === 'get') {
      // Get user data by email or user_id
      const email = url.searchParams.get('email');
      const userId = url.searchParams.get('user_id');

      if (!email && !userId) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Email or user_id is required' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      let user = null;
      if (email) {
        const { data, error } = await supabase.auth.admin.listUsers();
        if (!error) {
          user = data.users.find(u => u.email === email);
        }
      } else if (userId) {
        const { data, error } = await supabase.auth.admin.getUserById(userId);
        if (!error) {
          user = data.user;
        }
      }

      if (!user) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'User not found' 
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get additional user data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const { data: wallet } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      await logAccess(supabase, null, 'vault-club-user-sync:get', clientIp, req.headers.get('user-agent'), { email: '***', user_id: user.id }, 200);
      
      return new Response(JSON.stringify({ 
        success: true,
        data: {
          user: {
            id: user.id,
            name: profile?.name || user.user_metadata?.name || 'Unknown User',
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at,
            metadata: user.user_metadata
          },
          wallet: wallet ? {
            address: wallet.wallet_address,
            network: wallet.network
          } : null
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (req.method === 'POST' && action === 'update') {
      // Parse and validate input with Zod
      let validatedInput;
      try {
        const rawBody = await req.json();
        validatedInput = UpdateUserSchema.parse(rawBody);
      } catch (validationError) {
        console.error('Input validation error:', validationError);
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Invalid input: Please check user_id (UUID) and optional email/name fields' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { user_id, email, name, metadata } = validatedInput;

      // Update auth user metadata
      const updateData: any = {};
      if (email) updateData.email = email;
      if (name || Object.keys(metadata).length > 0) {
        updateData.user_metadata = {
          name,
          ...metadata
        };
      }

      const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
        user_id,
        updateData
      );

      if (updateError) {
        console.error('User update error:', updateError);
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Failed to update user' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Update profile if name is provided
      if (name) {
        await supabase
          .from('profiles')
          .upsert({
            user_id,
            name,
            email: email || updatedUser.user.email
          }, {
            onConflict: 'user_id'
          });
      }

      return new Response(JSON.stringify({ 
        success: true,
        data: {
          user: updatedUser.user
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (req.method === 'POST' && action === 'migrate') {
      // Parse and validate input with Zod
      let validatedInput;
      try {
        const rawBody = await req.json();
        validatedInput = MigrateUsersSchema.parse(rawBody);
      } catch (validationError) {
        console.error('Input validation error:', validationError);
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Invalid input: users must be an array of valid user objects with email (required), password (8-128 chars), and optional name/metadata' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { users } = validatedInput;
      const results = [];
      
      for (const userData of users) {
        try {
          const { email, password, name, metadata } = userData;
          
          // Create user
          const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            user_metadata: {
              name,
              created_via: 'vault_club_migration',
              ...metadata
            },
            email_confirm: true
          });

          if (authError) {
            results.push({
              email,
              success: false,
              error: 'Failed to create user account'
            });
            console.error('Migration auth error for', email, authError);
            continue;
          }

          // Create a deterministic wallet address and store it
          const seed = ethers.keccak256(ethers.toUtf8Bytes(`${authData.user!.id}-${email}`));
          const deterministicAddress = ethers.getAddress(seed.slice(0, 42));
          const { error: walletUpsertError } = await supabase
            .from('user_wallets')
            .upsert(
              {
                user_id: authData.user!.id,
                wallet_address: deterministicAddress,
                network: 'polygon'
              },
              { onConflict: 'user_id' }
            );
          if (walletUpsertError) {
            console.error('Wallet upsert failed for', email, walletUpsertError.message || walletUpsertError);
          }

          results.push({
            email,
            success: true,
            user_id: authData.user!.id,
            wallet_address: deterministicAddress
          });

        } catch (error) {
          console.error('Migration error for user:', userData.email, error);
          results.push({
            email: userData.email,
            success: false,
            error: 'An unexpected error occurred'
          });
        }
      }

      return new Response(JSON.stringify({ 
        success: true,
        data: {
          migrated: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length,
          results
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Invalid action or method' 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in vault-club-user-sync:', error);
    const corsHeaders = getCorsHeaders(req.headers.get('origin'));
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'An internal error occurred' 
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
