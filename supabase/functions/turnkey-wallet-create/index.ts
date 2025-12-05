import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Deno-compatible API key stamper using Web Crypto API
class DenoApiKeyStamper {
  private apiPublicKey: string;
  private apiPrivateKey: string;

  constructor(config: { apiPublicKey: string; apiPrivateKey: string }) {
    this.apiPublicKey = config.apiPublicKey;
    this.apiPrivateKey = config.apiPrivateKey;
  }

  async stamp(payload: string): Promise<{ publicKey: string; signature: string; scheme: string }> {
    // Import the private key for signing
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

    // Sign the payload
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

    // Convert signature to base64url
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

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://vaultclub.io',
  'https://sequence-theory.lovable.app',
  'https://sequencetheory.com'
];

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
};

interface TurnkeyAttestation {
  credentialId: string;
  clientDataJson: string;
  attestationObject: string;
  transports: string[];
}

interface TurnkeyCreateSubOrgRequest {
  subOrganizationName: string;
  rootUsers: Array<{
    userName: string;
    userEmail: string;
    apiKeys?: never[];
    authenticators: Array<{
      authenticatorName: string;
      challenge: string;
      attestation: TurnkeyAttestation;
    }>;
    oauthProviders?: never[];
  }>;
  rootQuorumThreshold: number;
  wallet: {
    walletName: string;
    accounts: Array<{
      curve: string;
      pathFormat: string;
      path: string;
      addressFormat: string;
    }>;
  };
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      throw new Error('Unauthorized');
    }

    const { email, attestation, challenge } = await req.json();

    console.log('Creating Turnkey wallet for user:', user.id);

    // Get Turnkey credentials
    const turnkeyApiPublicKey = Deno.env.get('TURNKEY_API_PUBLIC_KEY');
    const turnkeyApiPrivateKey = Deno.env.get('TURNKEY_API_PRIVATE_KEY');
    const turnkeyOrgId = Deno.env.get('TURNKEY_ORGANIZATION_ID');

    if (!turnkeyApiPublicKey || !turnkeyApiPrivateKey || !turnkeyOrgId) {
      throw new Error('Turnkey credentials not configured');
    }

    // Create Turnkey client with Deno-compatible stamper
    const stamper = new DenoApiKeyStamper({
      apiPublicKey: turnkeyApiPublicKey,
      apiPrivateKey: turnkeyApiPrivateKey,
    });

    // Make direct API call to Turnkey with stamped request
    const timestamp = Date.now().toString();

    // Prepare Turnkey API request with proper structure
    const createSubOrgPayload: TurnkeyCreateSubOrgRequest = {
      subOrganizationName: `User-${user.id.slice(0, 8)}`,
      rootUsers: [{
        userName: email.split('@')[0],
        userEmail: email,
        apiKeys: [],
        authenticators: [{
          authenticatorName: "Primary Passkey",
          challenge: challenge,
          attestation: attestation,
        }],
        oauthProviders: [],
      }],
      rootQuorumThreshold: 1,
      wallet: {
        walletName: "Polygon Wallet",
        accounts: [{
          curve: "CURVE_SECP256K1",
          pathFormat: "PATH_FORMAT_BIP32",
          path: "m/44'/60'/0'/0/0", // Ethereum/Polygon derivation path
          addressFormat: "ADDRESS_FORMAT_ETHEREUM",
        }],
      },
    };

    // Prepare signed request payload
    const requestBody = {
      type: 'ACTIVITY_TYPE_CREATE_SUB_ORGANIZATION_V4',
      organizationId: turnkeyOrgId,
      timestampMs: timestamp,
      parameters: createSubOrgPayload,
    };

    const payloadString = JSON.stringify(requestBody);
    const stampResult = await stamper.stamp(payloadString);

    console.log('Calling Turnkey API with signed request for user:', user.id);

    // Make the API call with signed headers
    const turnkeyResponse = await fetch('https://api.turnkey.com/public/v1/submit/create_sub_organization', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Stamp-WebAuthn': JSON.stringify(stampResult),
      },
      body: payloadString,
    });

    if (!turnkeyResponse.ok) {
      const errorText = await turnkeyResponse.text();
      console.error('Turnkey API error:', errorText);
      throw new Error(`Turnkey API error: ${turnkeyResponse.status} - ${errorText}`);
    }

    const turnkeyData = await turnkeyResponse.json();
    
    console.log('Turnkey API success:', {
      subOrgId: turnkeyData.activity?.result?.createSubOrganizationResultV4?.subOrganizationId,
      walletId: turnkeyData.activity?.result?.createSubOrganizationResultV4?.wallet?.walletId,
    });

    // Extract wallet info from response
    const subOrgId = turnkeyData.activity?.result?.createSubOrganizationResultV4?.subOrganizationId;
    const walletId = turnkeyData.activity?.result?.createSubOrganizationResultV4?.wallet?.walletId;
    const walletAddress = turnkeyData.activity?.result?.createSubOrganizationResultV4?.wallet?.addresses?.[0];

    if (!subOrgId || !walletAddress) {
      console.error('Missing data in Turnkey response:', {
        hasSubOrg: !!subOrgId,
        hasWalletAddress: !!walletAddress,
        fullResponse: JSON.stringify(turnkeyData, null, 2)
      });
      throw new Error('Failed to extract wallet data from Turnkey response');
    }

    console.log('Wallet created successfully:', {
      address: walletAddress,
      subOrgId,
      walletId,
      userId: user.id
    });

    // Store in database
    const { error: upsertError } = await supabaseAdmin
      .from('user_wallets')
      .upsert({
        user_id: user.id,
        wallet_address: walletAddress,
        network: 'polygon',
        provider: 'turnkey',
        provenance: 'user_generated',
        created_via: 'passkey',
        turnkey_sub_org_id: subOrgId,
        turnkey_wallet_id: walletId,
        last_used_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (upsertError) {
      console.error('Database upsert error:', upsertError);
      throw upsertError;
    }

    // Update profile with eth_address
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ eth_address: walletAddress })
      .eq('user_id', user.id);

    if (profileError) {
      console.error('Profile update error:', profileError);
      // Don't throw, this is not critical
    }

    return new Response(
      JSON.stringify({
        success: true,
        wallet_address: walletAddress,
        sub_org_id: subOrgId,
        wallet_id: walletId,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    // Log detailed error server-side for debugging
    console.error('Error creating Turnkey wallet:', error);
    console.error('Error details:', error.toString());
    
    // Return generic error to client
    return new Response(
      JSON.stringify({ 
        error: 'Wallet creation failed. Please try again.',
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
