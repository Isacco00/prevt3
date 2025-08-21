import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the request data
    const { email, password, firstName, lastName, role = 'user' } = await req.json()

    console.log('Creating user:', { email, firstName, lastName, role })

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate role
    if (!['admin', 'user'].includes(role)) {
      return new Response(
        JSON.stringify({ error: 'Invalid role. Must be admin or user' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create user with admin API
    const { data: userData, error: userError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName
      }
    })

    if (userError) {
      console.error('Error creating user:', userError)
      return new Response(
        JSON.stringify({ error: userError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('User created successfully:', userData.user?.id)

    // Create profile
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .insert({
        user_id: userData.user!.id,
        first_name: firstName,
        last_name: lastName,
        email,
        role,
        active: true
      })

    if (profileError) {
      console.error('Error creating profile:', profileError)
      // Try to clean up the user if profile creation fails
      await supabaseClient.auth.admin.deleteUser(userData.user!.id)
      
      return new Response(
        JSON.stringify({ error: 'Failed to create user profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Profile created successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: {
          id: userData.user!.id,
          email: userData.user!.email,
          first_name: firstName,
          last_name: lastName,
          role
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})