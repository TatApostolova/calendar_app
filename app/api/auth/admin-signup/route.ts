import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Admin client with service role - bypasses RLS and email confirmation
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Check if any families exist (only allow admin signup if no families yet)
    const { count, error: countError } = await supabaseAdmin
      .from('families')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('[v0] Error checking families:', countError)
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      )
    }

    if (count && count > 0) {
      return NextResponse.json(
        { error: 'Admin account already exists. Use invitation link to join.' },
        { status: 403 }
      )
    }

    // Create user with admin API (bypasses email confirmation)
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm the email
      user_metadata: { name },
    })

    if (createError) {
      console.error('[v0] Error creating user:', createError)
      return NextResponse.json(
        { error: createError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      user: { id: userData.user.id, email: userData.user.email } 
    })
  } catch (error) {
    console.error('[v0] Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
