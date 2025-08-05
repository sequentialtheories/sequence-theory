import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create admin Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const testEmail = 'devin-ai-test@sequencetheory.com'
    const testPassword = 'DevinAI_Test_2024!'

    console.log('Creating test user for Devin AI...')

    // Check if test user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    let testUser = existingUsers.users.find(user => user.email === testEmail)

    if (!testUser) {
      // Create test user
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email: testEmail,
        password: testPassword,
        email_confirm: true,
        user_metadata: {
          name: 'Devin AI Test'
        }
      })

      if (userError) {
        throw new Error(`Failed to create test user: ${userError.message}`)
      }

      testUser = userData.user
      console.log('Test user created:', testUser.id)
    } else {
      console.log('Test user already exists:', testUser.id)
    }

    // Check if profile exists
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', testUser.id)
      .single()

    if (!existingProfile) {
      // Create profile
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          user_id: testUser.id,
          email: testEmail,
          name: 'Devin AI Test'
        })

      if (profileError) {
        throw new Error(`Failed to create profile: ${profileError.message}`)
      }
      console.log('Profile created for test user')
    }

    // Check if wallet exists
    const { data: existingWallet } = await supabaseAdmin
      .from('user_wallets')
      .select('*')
      .eq('user_id', testUser.id)
      .single()

    if (!existingWallet) {
      // Create wallet
      const { error: walletError } = await supabaseAdmin
        .from('user_wallets')
        .insert({
          user_id: testUser.id,
          wallet_address: '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          network: 'polygon',
          email: testEmail
        })

      if (walletError) {
        throw new Error(`Failed to create wallet: ${walletError.message}`)
      }
      console.log('Wallet created for test user')
    }

    // Generate API key
    const { data: apiKeyString, error: keyGenError } = await supabaseAdmin.rpc('generate_api_key')
    
    if (keyGenError || !apiKeyString) {
      throw new Error(`Failed to generate API key: ${keyGenError?.message}`)
    }

    // Hash the API key
    const { data: keyHash, error: hashError } = await supabaseAdmin.rpc('hash_api_key', { 
      api_key: apiKeyString 
    })
    
    if (hashError || !keyHash) {
      throw new Error(`Failed to hash API key: ${hashError?.message}`)
    }

    // Store API key
    const { data: apiKeyRecord, error: storeError } = await supabaseAdmin
      .from('api_keys')
      .insert({
        user_id: testUser.id,
        name: 'Devin AI Test Key',
        key_hash: keyHash,
        key_prefix: apiKeyString.substring(0, 7),
        permissions: { read_wallet: true },
        is_active: true
      })
      .select()
      .single()

    if (storeError) {
      throw new Error(`Failed to store API key: ${storeError.message}`)
    }

    console.log('API key created successfully')

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Test API key created successfully for Devin AI',
        data: {
          user_id: testUser.id,
          api_key: apiKeyString,
          key_prefix: apiKeyString.substring(0, 7),
          permissions: { read_wallet: true },
          endpoint: `${Deno.env.get('SUPABASE_URL')}/functions/v1/external-api/user-wallets`,
          usage_instructions: {
            method: 'GET',
            headers: {
              'x-api-key': apiKeyString,
              'Content-Type': 'application/json'
            }
          }
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error creating test API key:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})