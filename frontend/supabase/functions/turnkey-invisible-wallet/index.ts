import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * Turnkey Invisible Wallet Edge Function
 * 
 * This function provisions Turnkey wallets for users automatically.
 * It supports two invocation methods:
 * 
 * 1. Database Trigger (preferred): Called automatically when a new user is created
 *    - Uses service role key authorization
 *    - Receives user_id and email in request body
 * 
 * 2. Frontend Hook: Called by useInvisibleWallet hook on first login
 *    - Uses user JWT authorization
 *    - User info extracted from JWT
 * 
 * Turnkey credentials are stored in Supabase Vault:
 * - TURNKEY_API_PUBLIC_KEY
 * - TURNKEY_API_PRIVATE_KEY (use Deno.env.get())
 * - TURNKEY_ORGANIZATION_ID (use Deno.env.get())
 */

// Deno-compatible API key stamper using Web Crypto API
class DenoApiKeyStamper {
  private apiPublicKey: string;
  private apiPrivateKey: string;

  constructor(config: { apiPublicKey: string; apiPrivateKey: string }) {
    this.apiPublicKey = config.apiPublicKey;
    this.apiPrivateKey = config.apiPrivateKey;
  }

  async stamp(payload: string): Promise<{ publicKey: string; signature: string; scheme: string }> {
    const privateKeyBuffer = this.base64UrlToBuffer(this.apiPrivateKey);
    
    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      privateKeyBuffer,
      {
        name: 'ECDSA',
        namedCurve: 'P-256',
      },
      false,
      ['sign']
    );

    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    
    const signature = await crypto.subtle.sign(
      {
        name: 'ECDSA',
        hash: { name: 'SHA-256' },
      },
      cryptoKey,
      data
    );

    const signatureBase64 = this.bufferToBase64Url(new Uint8Array(signature));

    return {
      publicKey: this.apiPublicKey,
      signature: signatureBase64,
      scheme: 'SIGNATURE_SCHEME_TK_API_P256',
    };
  }

  private base64UrlToBuffer(base64url: string): ArrayBuffer {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private bufferToBase64Url(buffer: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < buffer.length; i++) {
      binary += String.fromCharCode(buffer[i]);
    }
    const base64 = btoa(binary);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }
}

// Allowed origins for CORS - Both platforms for two-way sync
const ALLOWED_ORIGINS = [
  'https://vaultclub.io',
  'https://www.vaultclub.io',
  'https://sequencetheory.com',
  'https://www.sequencetheory.com',
  'https://sequence-theory.lovable.app'
];

const isAllowedOrigin = (origin: string | null): boolean => {
  if (!origin) return true; // Allow server-to-server calls
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (origin.endsWith('.lovableproject.com')) return true;
  if (origin.endsWith('.emergentagent.com')) return true;
  if (origin.startsWith('http://localhost:')) return true;
  return false;
};

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = isAllowedOrigin(origin) ? (origin || '*') : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
};

/**
 * Core wallet provisioning logic
 */
async function provisionWallet(
  supabaseAdmin: any,
  userId: string,
  userEmail: string
): Promise<{ success: boolean; wallet_address?: string; sub_org_id?: string; wallet_id?: string; already_exists?: boolean; error?: string }> {
  
  console.log('[provisionWallet] Starting for user:', userId);

  // Check if wallet already exists
  const { data: existingWallet } = await supabaseAdmin
    .from('user_wallets')
    .select('wallet_address')
    .eq('user_id', userId)
    .maybeSingle();

  if (existingWallet?.wallet_address) {
    console.log('[provisionWallet] Wallet already exists for user:', userId);
    return {
      success: true,
      wallet_address: existingWallet.wallet_address,
      already_exists: true,
    };
  }

  // Get Turnkey credentials from environment (Supabase Vault)
  const turnkeyApiPublicKey = Deno.env.get('TURNKEY_API_PUBLIC_KEY');
  const turnkeyApiPrivateKey = Deno.env.get('TURNKEY_API_PRIVATE_KEY');
  const turnkeyOrgId = Deno.env.get('TURNKEY_ORGANIZATION_ID');

  if (!turnkeyApiPublicKey || !turnkeyApiPrivateKey || !turnkeyOrgId) {
    console.error('[provisionWallet] Missing Turnkey credentials');
    return { success: false, error: 'Turnkey credentials not configured' };
  }

  const stamper = new DenoApiKeyStamper({
    apiPublicKey: turnkeyApiPublicKey,
    apiPrivateKey: turnkeyApiPrivateKey,
  });

  const timestamp = Date.now().toString();
  const email = userEmail || `user-${userId.slice(0, 8)}@sequencetheory.com`;

  // Create sub-organization WITHOUT authenticators (invisible/server-side only)
  const createSubOrgPayload = {
    subOrganizationName: `User-${userId.slice(0, 8)}`,
    rootUsers: [{
      userName: email.split('@')[0],
      userEmail: email,
      apiKeys: [],
      authenticators: [], // No authenticators = invisible wallet
      oauthProviders: [],
    }],
    rootQuorumThreshold: 1,
    wallet: {
      walletName: "Polygon Wallet",
      accounts: [{
        curve: "CURVE_SECP256K1",
        pathFormat: "PATH_FORMAT_BIP32",
        path: "m/44'/60'/0'/0/0",
        addressFormat: "ADDRESS_FORMAT_ETHEREUM",
      }],
    },
  };

  const requestBody = {
    type: 'ACTIVITY_TYPE_CREATE_SUB_ORGANIZATION_V7',
    organizationId: turnkeyOrgId,
    timestampMs: timestamp,
    parameters: createSubOrgPayload,
  };

  const payloadString = JSON.stringify(requestBody);
  const stampResult = await stamper.stamp(payloadString);

  console.log('[provisionWallet] Calling Turnkey API for user:', userId);

  const turnkeyResponse = await fetch('https://api.turnkey.com/public/v1/submit/create_sub_organization', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Stamp': JSON.stringify(stampResult),
    },
    body: payloadString,
  });

  if (!turnkeyResponse.ok) {
    const errorText = await turnkeyResponse.text();
    console.error('[provisionWallet] Turnkey API error:', errorText);
    return { success: false, error: `Turnkey API error: ${turnkeyResponse.status}` };
  }

  const turnkeyData = await turnkeyResponse.json();
  
  // Extract wallet info - handle both V4 and V7 response formats
  const resultV7 = turnkeyData.activity?.result?.createSubOrganizationResultV7;
  const resultV4 = turnkeyData.activity?.result?.createSubOrganizationResultV4;
  const result = resultV7 || resultV4;

  const subOrgId = result?.subOrganizationId;
  const walletId = result?.wallet?.walletId;
  const walletAddress = result?.wallet?.addresses?.[0];

  if (!subOrgId || !walletAddress) {
    console.error('[provisionWallet] Missing data in Turnkey response');
    return { success: false, error: 'Failed to extract wallet data from Turnkey response' };
  }

  console.log('[provisionWallet] Wallet created:', { address: walletAddress, subOrgId, userId });

  // Store in database with turnkey_invisible provenance
  const { error: upsertError } = await supabaseAdmin
    .from('user_wallets')
    .upsert({
      user_id: userId,
      wallet_address: walletAddress,
      network: 'polygon',
      provider: 'turnkey',
      provenance: 'turnkey_invisible',
      created_via: 'invisible_api',
      turnkey_sub_org_id: subOrgId,
      turnkey_wallet_id: walletId,
      last_used_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (upsertError) {
    console.error('[provisionWallet] Database upsert error:', upsertError);
    return { success: false, error: 'Failed to save wallet to database' };
  }

  // Update profile with eth_address
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({ eth_address: walletAddress })
    .eq('user_id', userId);

  if (profileError) {
    console.error('[provisionWallet] Profile update error:', profileError);
    // Non-critical, continue
  }

  return {
    success: true,
    wallet_address: walletAddress,
    sub_org_id: subOrgId,
    wallet_id: walletId,
  };
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization');
    let userId: string;
    let userEmail: string;
    let triggerSource: string = 'frontend_hook';

    // Check if this is a trigger-based call (service role key) or frontend call (user JWT)
    if (authHeader?.includes(supabaseServiceKey)) {
      // Database trigger call - get user info from request body
      const body = await req.json();
      userId = body.user_id;
      userEmail = body.email || '';
      triggerSource = body.trigger_source || 'database_trigger';
      
      console.log(`[turnkey-invisible-wallet] Trigger call: ${triggerSource} for user:`, userId);
      
      if (!userId) {
        throw new Error('Missing user_id in trigger payload');
      }
    } else if (authHeader) {
      // Frontend call - verify user JWT
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
      
      if (authError || !user) {
        console.error('[turnkey-invisible-wallet] Auth error:', authError);
        throw new Error('Unauthorized');
      }
      
      userId = user.id;
      userEmail = user.email || '';
      console.log('[turnkey-invisible-wallet] Frontend call for user:', userId);
    } else {
      throw new Error('Missing authorization header');
    }

    // Provision the wallet
    const result = await provisionWallet(supabaseAdmin, userId, userEmail);

    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, error: result.error }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[turnkey-invisible-wallet] Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Wallet provisioning failed',
        success: false,
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
