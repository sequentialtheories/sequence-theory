import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Get allowed origins from environment
const getAllowedOrigins = () => {
  const origins = Deno.env.get('ALLOWED_ORIGINS') || 'https://sequence-theory.lovable.app';
  return origins.split(',').map(origin => origin.trim());
};

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigins = getAllowedOrigins();
  const allowedOrigin = origin && allowedOrigins.includes(origin) ? origin : 'https://sequence-theory.lovable.app';
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache'
  };
};

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIp = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitIdentifier = `delete-account:${clientIp}`;
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    const rateLimitOk = await supabaseAdmin.rpc('check_enhanced_rate_limit', {
      p_identifier: rateLimitIdentifier,
      p_limit: 10,
      p_window_minutes: 60,
      p_burst_limit: 5,
      p_burst_window_minutes: 10
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
    
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Create regular client to verify the user
    const supabaseClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      auth: {
        persistSession: false,
      },
    });

    // Get user from token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    console.log('Deleting account for user:', user.id);

    // Delete user's data first (profiles and wallets)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('user_id', user.id);
    
    if (profileError) {
      console.error('Error deleting profile:', profileError);
      throw profileError;
    }

    const { error: walletError } = await supabaseAdmin
      .from('user_wallets')
      .delete()
      .eq('user_id', user.id);
    
    if (walletError) {
      console.error('Error deleting wallet:', walletError);
      throw walletError;
    }

    // Delete the user account
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    
    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      throw deleteError;
    }

    console.log('Successfully deleted account for user:', user.id);
    await logAccess(supabaseAdmin, null, 'delete-account', clientIp, req.headers.get('user-agent'), { user_id: user.id }, 200);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Account deleted successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in delete-account function:', error);
    const corsHeaders = getCorsHeaders(req.headers.get('origin'));
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
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