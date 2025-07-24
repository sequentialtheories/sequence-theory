import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();
    
    if (!user_id) {
      throw new Error('User ID is required');
    }

    console.log('Processing wallet request for user:', user_id);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user email from profiles table
    let userEmail: string;
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('user_id', user_id)
      .maybeSingle();

    if (profile?.email) {
      userEmail = profile.email;
      console.log('Found user email in profiles:', userEmail);
    } else {
      // Fallback: get email from auth.users (using service role)
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(user_id);
      
      if (authError || !authUser.user?.email) {
        throw new Error(`Unable to get user email: ${authError?.message || 'Email not found'}`);
      }
      
      userEmail = authUser.user.email;
      console.log('Found user email in auth:', userEmail);
    }

    // Check if wallet already exists in our database
    const { data: existingWallet } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', user_id)
      .maybeSingle();

    if (existingWallet && !existingWallet.wallet_address.startsWith('pending_')) {
      console.log('Valid wallet already exists:', existingWallet.wallet_address);
      return new Response(
        JSON.stringify({ 
          success: true, 
          wallet_address: existingWallet.wallet_address,
          message: 'Wallet already connected'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sequenceApiKey = Deno.env.get('SEQUENCE_API_KEY');
    if (!sequenceApiKey) {
      throw new Error('Sequence API key not configured');
    }

    let walletAddress: string;
    
    console.log('Checking for existing Sequence wallet for:', userEmail);
    
    try {
      // First, try to get existing wallet using Sequence API
      const getWalletResponse = await fetch('https://api.sequence.app/rpc/Wallet/GetWallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sequenceApiKey}`,
        },
        body: JSON.stringify({
          network: 'polygon',
          email: userEmail
        }),
      });

      const getWalletText = await getWalletResponse.text();
      console.log('Get wallet response:', getWalletResponse.status, getWalletText.substring(0, 200));

      if (getWalletResponse.ok) {
        // Existing wallet found
        try {
          const existingWalletData = JSON.parse(getWalletText);
          if (existingWalletData.address) {
            walletAddress = existingWalletData.address;
            console.log('Found existing Sequence wallet:', walletAddress);
          } else {
            throw new Error('No address in wallet response');
          }
        } catch (parseError) {
          console.error('Failed to parse get wallet response:', parseError);
          throw new Error('Invalid response from Sequence API');
        }
      } else {
        // No existing wallet, create a new one
        console.log('No existing wallet found, creating new one');
        
        const createWalletResponse = await fetch('https://api.sequence.app/rpc/Wallet/Create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sequenceApiKey}`,
          },
          body: JSON.stringify({
            network: 'polygon',
            email: userEmail
          }),
        });

        const createWalletText = await createWalletResponse.text();
        console.log('Create wallet response:', createWalletResponse.status, createWalletText.substring(0, 200));

        if (createWalletResponse.ok) {
          try {
            const walletData = JSON.parse(createWalletText);
            if (walletData.address) {
              walletAddress = walletData.address;
              console.log('New wallet created:', walletAddress);
            } else {
              throw new Error('No address in create response');
            }
          } catch (parseError) {
            console.error('Failed to parse create wallet response:', parseError);
            throw new Error('Invalid response from Sequence API');
          }
        } else if (createWalletText.includes('already exists') || createWalletText.includes('duplicate')) {
          // Wallet was created between our get and create calls, try to get it again
          console.log('Wallet was created concurrently, attempting to retrieve it');
          
          const retryResponse = await fetch('https://api.sequence.app/rpc/Wallet/GetWallet', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sequenceApiKey}`,
            },
            body: JSON.stringify({
              network: 'polygon',
              email: userEmail
            }),
          });

          if (retryResponse.ok) {
            try {
              const retryData = JSON.parse(await retryResponse.text());
              if (retryData.address) {
                walletAddress = retryData.address;
                console.log('Retrieved wallet after concurrent creation:', walletAddress);
              } else {
                throw new Error('No address in retry response');
              }
            } catch (parseError) {
              throw new Error('Failed to parse retry response');
            }
          } else {
            throw new Error('Failed to retrieve wallet after concurrent creation');
          }
        } else {
          throw new Error(`Failed to create wallet: ${createWalletText}`);
        }
      }
    } catch (apiError) {
      console.error('Sequence API error:', apiError);
      throw new Error(`Sequence API error: ${apiError.message}`);
    }

    // Validate wallet address
    if (!walletAddress || walletAddress.length < 10) {
      throw new Error('Invalid wallet address received from Sequence');
    }

    // Save or update wallet in database
    const walletConfig = {
      email: userEmail,
      network: 'polygon',
      created_at: new Date().toISOString()
    };

    if (existingWallet) {
      // Update existing pending wallet
      const { error: updateError } = await supabase
        .from('user_wallets')
        .update({
          wallet_address: walletAddress,
          wallet_config: walletConfig,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user_id);

      if (updateError) {
        console.error('Failed to update wallet:', updateError);
        throw new Error(`Failed to update wallet: ${updateError.message}`);
      }
      
      console.log('Updated existing wallet record');
    } else {
      // Insert new wallet
      const { error: insertError } = await supabase
        .from('user_wallets')
        .insert({
          user_id,
          wallet_address: walletAddress,
          wallet_config: walletConfig,
          network: 'polygon'
        });

      if (insertError) {
        console.error('Failed to insert wallet:', insertError);
        throw new Error(`Failed to save wallet: ${insertError.message}`);
      }
      
      console.log('Created new wallet record');
    }

    console.log('Wallet successfully connected for user:', user_id, 'Address:', walletAddress);

    return new Response(
      JSON.stringify({ 
        success: true, 
        wallet_address: walletAddress,
        message: 'Wallet connected successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in create-wallet function:', error);
    
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
