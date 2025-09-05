import { createClient } from 'jsr:@supabase/supabase-js@2'

// Restrict CORS to specific origins based on environment
const ALLOWED_ORIGINS = new Set([
  'https://app.sequencetheory.com',
  'https://preview.lovable.dev', // dev only
  'https://id-preview--902c4709-595e-47f5-b881-6247d8b5fbf9.lovable.app' // current preview
]);

const getCorsHeaders = (origin: string | null) => {
  const baseHeaders = {
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Vary': 'Origin'
  };

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    return {
      ...baseHeaders,
      'Access-Control-Allow-Origin': origin
    };
  }
  
  return {
    ...baseHeaders,
    'Access-Control-Allow-Origin': 'https://app.sequencetheory.com'
  };
};

// PII redaction utility with peppered hash
async function redactPII(email: string): Promise<string> {
  const pepper = Deno.env.get('LOG_PEPPER') || 'default-pepper-change-me';
  const prefix = email.slice(0, 2);
  const encoder = new TextEncoder();
  const data = encoder.encode(pepper + email);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);
  const hashHex = Array.from(hashArray, b => b.toString(16).padStart(2, '0')).join('');
  
  return `${prefix}…#${hashHex.slice(0, 12)}`;
}

/**
 * Enhanced rate limiting using database function
 */
async function isRateLimited(supabase: any, identifier: string, limit: number = 10, windowMinutes: number = 60): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('check_enhanced_rate_limit', {
      p_identifier: identifier,
      p_limit: limit,
      p_window_minutes: windowMinutes,
      p_burst_limit: 3,
      p_burst_window_minutes: 1
    });

    if (error) {
      console.error('Rate limit check failed:', error);
      return true; // Fail closed - block on error
    }

    return !data; // Function returns true if allowed, false if rate limited
  } catch (err) {
    console.error('Rate limit error:', err);
    return true; // Fail closed
  }
}

function getClientIP(req: Request): string {
  return req.headers.get('cf-connecting-ip') || 
         req.headers.get('x-forwarded-for')?.split(',')[0] || 
         req.headers.get('x-real-ip') || 
         'unknown';
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
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
      console.log('⚠️ SECURITY: API request without key from IP:', getClientIP(req))
      return new Response(
        JSON.stringify({ error: 'API key required' }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Input validation
    if (apiKey.length > 100 || !/^[a-zA-Z0-9_-]+$/.test(apiKey)) {
      console.log('⚠️ SECURITY: Invalid API key format from IP:', getClientIP(req))
      return new Response(
        JSON.stringify({ error: 'Invalid API key format' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check rate limit BEFORE API key validation to prevent enumeration
    const clientIP = getClientIP(req);
    const rateLimitKey = `${clientIP}:${apiKey.substring(0, 8)}`;
    
    const isRateLimitExceeded = await isRateLimited(supabase, rateLimitKey, 10, 60); // 10 requests per hour per IP+key prefix
    if (isRateLimitExceeded) {
      console.log('⚠️ SECURITY: Rate limit exceeded for IP:', clientIP)
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }), 
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate API key
    const { data: keyData, error: keyError } = await supabase.rpc('validate_api_key', { input_api_key: apiKey });
    
    if (keyError || !keyData || keyData.length === 0 || !keyData[0].is_valid) {
      console.log('⚠️ SECURITY: Invalid API key attempt from IP:', clientIP)
      return new Response(
        JSON.stringify({ error: 'Invalid API key' }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const validatedKey = keyData[0];
    
    // Parse request body
    let requestData = null;
    try {
      if (req.body) {
        requestData = await req.json();
      }
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const url = new URL(req.url);
    const endpoint = url.pathname;

    // Handle different endpoints
    if (endpoint === '/external-api/user-wallets' && req.method === 'POST') {
      // Check basic wallet read permission
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

      // Parse request body for email/user_id lookup
      const { ownerEmail, ownerId } = requestData || {};
      
      // Require read_profile permission for any profile-based lookup
      if ((ownerEmail || ownerId) && !validatedKey.permissions?.read_profile) {
        await logAccess(supabase, validatedKey.key_id, endpoint, clientIP, req.headers.get('user-agent'), requestData, 403);
        return new Response(
          JSON.stringify({ error: 'read_profile permission required for user lookups' }), 
          { 
            status: 403, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      let walletQuery = supabase
        .from('user_wallets')
        .select('wallet_address, network, provenance, created_via, created_at, updated_at, user_id');

      // Determine which user's wallets to fetch
      let targetUserId = validatedKey.user_id; // default to API key owner
      
      if (ownerEmail) {
        // Email lookup requires join with profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('email', ownerEmail)
          .maybeSingle();
          
        if (!profile) {
          // Use redacted email for logging to prevent PII exposure
          const redactedEmail = await redactPII(ownerEmail);
          await logAccess(supabase, validatedKey.key_id, endpoint, clientIP, req.headers.get('user-agent'), 
            { ownerEmail: redactedEmail, ownerId }, 404);
          return new Response(
            JSON.stringify({ error: 'User not found' }), 
            { 
              status: 404, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
        targetUserId = profile.user_id;
      } else if (ownerId) {
        targetUserId = ownerId;
      }

      walletQuery = walletQuery.eq('user_id', targetUserId);
      const { data: wallets, error: walletsError } = await walletQuery;

      if (walletsError) {
        console.error('Error fetching wallets:', walletsError);
        const redactedEmail = ownerEmail ? await redactPII(ownerEmail) : null;
        await logAccess(supabase, validatedKey.key_id, endpoint, clientIP, req.headers.get('user-agent'), 
          { ownerEmail: redactedEmail, ownerId }, 500);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch wallet data' }), 
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Enhanced response for Vault Club access (with profile data)
      if (validatedKey.permissions?.vault_club_access && wallets && wallets.length > 0) {
        const userIds = wallets.map(w => w.user_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, name') // NO EMAIL in response
          .in('user_id', userIds);

        // Merge profile data with wallet data (no email exposure)
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

        // Log successful access with redacted PII
        const redactedEmail = ownerEmail ? await redactPII(ownerEmail) : null;
        await logAccess(supabase, validatedKey.key_id, endpoint, clientIP, req.headers.get('user-agent'), 
          { ownerEmail: redactedEmail, ownerId }, 200);

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
        const redactedEmail = ownerEmail ? await redactPII(ownerEmail) : null;
        await logAccess(supabase, validatedKey.key_id, endpoint, clientIP, req.headers.get('user-agent'), 
          { ownerEmail: redactedEmail, ownerId }, 404);
        return new Response(
          JSON.stringify({ error: 'Wallet not found' }), 
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Remove user_id from standard response for privacy
      const sanitizedWallets = wallets.map(({ user_id, ...wallet }) => wallet);

      // Update last used timestamp
      await supabase
        .from('api_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', validatedKey.key_id);

      // Log successful access with redacted PII
      const redactedEmail = ownerEmail ? await redactPII(ownerEmail) : null;
      await logAccess(supabase, validatedKey.key_id, endpoint, clientIP, req.headers.get('user-agent'), 
        { ownerEmail: redactedEmail, ownerId }, 200);

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: sanitizedWallets.length === 1 ? sanitizedWallets[0] : sanitizedWallets
        }), 
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Reject GET requests for security (force POST)
    if (endpoint === '/external-api/user-wallets' && req.method === 'GET') {
      return new Response(
        JSON.stringify({ error: 'Use POST method for wallet requests' }), 
        { 
          status: 405, 
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