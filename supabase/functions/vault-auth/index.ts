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
    const endpoint = url.pathname;

    if (endpoint === '/vault-auth/login' && req.method === 'POST') {
      return await handleLogin(supabase, req);
    }
    
    if (endpoint === '/vault-auth/refresh' && req.method === 'POST') {
      return await handleRefresh(supabase, req);
    }
    
    if (endpoint === '/vault-auth/exchange-token' && req.method === 'POST') {
      return await handleExchangeToken(supabase, req);
    }

    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Endpoint not found' 
    }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in vault-auth function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleLogin(supabase: any, req: Request) {
  try {
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

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
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

    const { data: wallet, error: walletError } = await supabase
      .from('user_wallets')
      .select('wallet_address, network')
      .eq('user_id', userId)
      .single();

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('name, email')
      .eq('user_id', userId)
      .single();

    return new Response(JSON.stringify({ 
      success: true,
      data: {
        user: {
          id: userId,
          email: authData.user.email,
          name: profile?.name || 'Unknown User'
        },
        wallet: wallet ? {
          address: wallet.wallet_address,
          network: wallet.network
        } : null,
        session: {
          access_token: authData.session?.access_token,
          refresh_token: authData.session?.refresh_token,
          expires_at: authData.session?.expires_at
        }
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in handleLogin:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleRefresh(supabase: any, req: Request) {
  try {
    const { refresh_token } = await req.json();

    if (!refresh_token) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Refresh token is required' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: authData, error: authError } = await supabase.auth.refreshSession({
      refresh_token
    });

    if (authError) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid refresh token' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: true,
      data: {
        session: {
          access_token: authData.session?.access_token,
          refresh_token: authData.session?.refresh_token,
          expires_at: authData.session?.expires_at
        }
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in handleRefresh:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleExchangeToken(supabase: any, req: Request) {
  try {
    const { st_token } = await req.json();

    if (!st_token) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Sequence Theory token is required' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: userData, error: userError } = await supabase.auth.getUser(st_token);

    if (userError || !userData.user) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid Sequence Theory token' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = userData.user.id;
    
    const { data: wallet, error: walletError } = await supabase
      .from('user_wallets')
      .select('wallet_address, network')
      .eq('user_id', userId)
      .single();

    return new Response(JSON.stringify({ 
      success: true,
      data: {
        vault_session: st_token,
        wallet: wallet ? {
          address: wallet.wallet_address,
          network: wallet.network
        } : null,
        user_id: userId
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in handleExchangeToken:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
