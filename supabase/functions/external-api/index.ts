import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(identifier: string, limit: number = 100, windowMs: number = 3600000): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return false;
  }
  
  if (entry.count >= limit) {
    return true;
  }
  
  entry.count++;
  return false;
}

function getClientIP(req: Request): string {
  return req.headers.get('cf-connecting-ip') || 
         req.headers.get('x-forwarded-for')?.split(',')[0] || 
         req.headers.get('x-real-ip') || 
         'unknown';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract API key from header
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key required' }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate API key
    const { data: keyData, error: keyError } = await supabase.rpc('validate_api_key', { input_api_key: apiKey });
    
    if (keyError || !keyData || keyData.length === 0 || !keyData[0].is_valid) {
      console.log('Invalid API key attempt:', { apiKey: apiKey.substring(0, 8) + '...', error: keyError });
      return new Response(
        JSON.stringify({ error: 'Invalid API key' }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const validatedKey = keyData[0];
    const clientIP = getClientIP(req);
    
    // Rate limiting by API key
    if (isRateLimited(validatedKey.key_id, 1000, 3600000)) { // 1000 requests per hour
      await logAccess(supabase, validatedKey.key_id, req.url, clientIP, req.headers.get('user-agent'), null, 429);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }), 
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    let requestData = null;
    try {
      if (req.body) {
        requestData = await req.json();
      }
    } catch (e) {
      // Body parsing failed, continue without request data
    }

    const url = new URL(req.url);
    const endpoint = url.pathname;

    // Handle different endpoints
    if (endpoint === '/external-api/user-wallets' && req.method === 'GET') {
      // Check permissions
      if (!validatedKey.permissions?.read_wallet) {
        await logAccess(supabase, validatedKey.key_id, endpoint, clientIP, req.headers.get('user-agent'), requestData, 403);
        return new Response(
          JSON.stringify({ error: 'Insufficient permissions' }), 
          { 
            status: 403, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const email = url.searchParams.get('email');
      const userId = url.searchParams.get('user_id');

      let walletQuery = supabase
        .from('user_wallets')
        .select('wallet_address, network, email, created_at, updated_at, user_id');

      // If specific email or user_id is requested, filter accordingly
      if (email) {
        walletQuery = walletQuery.eq('email', email);
      } else if (userId) {
        walletQuery = walletQuery.eq('user_id', userId);
      } else {
        // Default: return wallets for the API key owner
        walletQuery = walletQuery.eq('user_id', validatedKey.user_id);
      }

      const { data: wallets, error: walletsError } = await walletQuery;

      if (walletsError) {
        console.error('Error fetching wallets:', walletsError);
        await logAccess(supabase, validatedKey.key_id, endpoint, clientIP, req.headers.get('user-agent'), requestData, 500);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch wallet data' }), 
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // For Vault Club integration, also include user profile data
      if (validatedKey.permissions?.vault_club_access && wallets && wallets.length > 0) {
        const userIds = wallets.map(w => w.user_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, name, email')
          .in('user_id', userIds);

        // Merge profile data with wallet data
        const enrichedWallets = wallets.map(wallet => {
          const profile = profiles?.find(p => p.user_id === wallet.user_id);
          return {
            ...wallet,
            user_name: profile?.name || 'Unknown User'
          };
        });

        // Update last used timestamp
        await supabase
          .from('api_keys')
          .update({ last_used_at: new Date().toISOString() })
          .eq('id', validatedKey.key_id);

        // Log successful access
        await logAccess(supabase, validatedKey.key_id, endpoint, clientIP, req.headers.get('user-agent'), { email, user_id: userId }, 200);

        return new Response(
          JSON.stringify({ 
            success: true,
            data: enrichedWallets 
          }), 
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Standard response for non-Vault Club requests
      if (!wallets || wallets.length === 0) {
        await logAccess(supabase, validatedKey.key_id, endpoint, clientIP, req.headers.get('user-agent'), requestData, 404);
        return new Response(
          JSON.stringify({ error: 'Wallet not found' }), 
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Update last used timestamp
      await supabase
        .from('api_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', validatedKey.key_id);

      // Log successful access
      await logAccess(supabase, validatedKey.key_id, endpoint, clientIP, req.headers.get('user-agent'), { email, user_id: userId }, 200);

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: wallets.length === 1 ? wallets[0] : wallets
        }), 
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Unknown endpoint
    await logAccess(supabase, validatedKey.key_id, endpoint, clientIP, req.headers.get('user-agent'), requestData, 404);
    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }), 
      { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in external-api function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function logAccess(
  supabase: any, 
  apiKeyId: string, 
  endpoint: string, 
  ipAddress: string, 
  userAgent: string | null, 
  requestData: any, 
  responseStatus: number
) {
  try {
    await supabase
      .from('api_access_logs')
      .insert({
        api_key_id: apiKeyId,
        endpoint,
        ip_address: ipAddress,
        user_agent: userAgent,
        request_data: requestData,
        response_status: responseStatus
      });
  } catch (error) {
    console.error('Failed to log access:', error);
  }
}