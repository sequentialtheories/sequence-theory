import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TurnkeyCreateSubOrgRequest {
  subOrganizationName: string;
  rootUsers: Array<{
    userName: string;
    userEmail: string;
    authenticators: Array<{
      authenticatorName: string;
      challenge: string;
      attestation: {
        credentialId: string;
        clientDataJson: string;
        attestationObject: string;
        transports: string[];
      };
    }>;
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

    // Prepare Turnkey API request
    const createSubOrgPayload: TurnkeyCreateSubOrgRequest = {
      subOrganizationName: `User-${user.id.slice(0, 8)}`,
      rootUsers: [{
        userName: email.split('@')[0],
        userEmail: email,
        authenticators: [{
          authenticatorName: "Primary Passkey",
          challenge: challenge,
          attestation: attestation,
        }],
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

    // Call Turnkey API to create sub-organization
    console.log('Calling Turnkey API...');
    const turnkeyResponse = await fetch('https://api.turnkey.com/public/v1/submit/create_sub_organization', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': turnkeyApiPublicKey,
      },
      body: JSON.stringify({
        organizationId: turnkeyOrgId,
        parameters: createSubOrgPayload,
        timestampMs: Date.now().toString(),
        type: 'ACTIVITY_TYPE_CREATE_SUB_ORGANIZATION_V4',
      }),
    });

    if (!turnkeyResponse.ok) {
      const errorText = await turnkeyResponse.text();
      console.error('Turnkey API error:', errorText);
      throw new Error(`Turnkey API error: ${turnkeyResponse.status} - ${errorText}`);
    }

    const turnkeyData = await turnkeyResponse.json();
    console.log('Turnkey response:', JSON.stringify(turnkeyData, null, 2));

    // Extract wallet info from response
    const subOrgId = turnkeyData.activity?.result?.createSubOrganizationResultV4?.subOrganizationId;
    const walletId = turnkeyData.activity?.result?.createSubOrganizationResultV4?.wallet?.walletId;
    const walletAddress = turnkeyData.activity?.result?.createSubOrganizationResultV4?.wallet?.addresses?.[0];

    if (!subOrgId || !walletAddress) {
      console.error('Missing data in Turnkey response:', turnkeyData);
      throw new Error('Failed to extract wallet data from Turnkey response');
    }

    console.log('Wallet created:', walletAddress);

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
    console.error('Error creating Turnkey wallet:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString(),
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
