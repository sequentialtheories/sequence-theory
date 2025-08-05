import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-vault-club-api-key',
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
        .single();

      const { data: wallet } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      return new Response(JSON.stringify({ 
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
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
      // Update user data
      const { user_id, email, name, metadata = {} } = await req.json();

      if (!user_id) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'user_id is required' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Update auth user metadata
      const updateData: any = {};
      if (email) updateData.email = email;
      if (name || metadata) {
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
        return new Response(JSON.stringify({ 
          success: false, 
          error: updateError.message 
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
      // Migrate users from Vault Club to Sequence Theory
      const { users } = await req.json();

      if (!Array.isArray(users)) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'users must be an array' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const results = [];
      
      for (const userData of users) {
        try {
          const { email, password, name, metadata = {} } = userData;
          
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
              error: authError.message
            });
            continue;
          }

          // Create wallet
          const { createWalletForUser } = await import('../../../src/lib/sequenceWaas.ts');
          const walletResult = await createWalletForUser(authData.user!.id, email);

          results.push({
            email,
            success: true,
            user_id: authData.user!.id,
            wallet_address: walletResult.walletAddress
          });

        } catch (error) {
          results.push({
            email: userData.email,
            success: false,
            error: error.message
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
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});