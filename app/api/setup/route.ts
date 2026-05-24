import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const COLORS = [
  '#3B82F6', // blue
  '#EC4899', // pink
  '#10B981', // green
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EF4444', // red
  '#06B6D4', // cyan
  '#84CC16', // lime
]

export async function POST(request: NextRequest) {
  try {
    const { familyName, userId, userName, userEmail, members } = await request.json()

    if (!familyName || !userId || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Use service role to bypass RLS for initial setup
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // Create family
    const { data: family, error: familyError } = await supabaseAdmin
      .from('families')
      .insert({ name: familyName })
      .select()
      .single()

    if (familyError || !family) {
      console.error('[v0] Error creating family:', familyError)
      return NextResponse.json(
        { error: familyError?.message || 'Failed to create family' },
        { status: 500 }
      )
    }

    // Create current user as admin member
    const { error: adminError } = await supabaseAdmin.from('family_members').insert({
      family_id: family.id,
      user_id: userId,
      name: userName || userEmail.split('@')[0] || 'Me',
      email: userEmail,
      color: COLORS[0],
      is_admin: true,
    })

    if (adminError) {
      console.error('[v0] Error creating admin member:', adminError)
      // Rollback: delete the family we just created
      await supabaseAdmin.from('families').delete().eq('id', family.id)
      return NextResponse.json(
        { error: adminError.message || 'Failed to create admin member' },
        { status: 500 }
      )
    }

    // Create other family members if provided
    if (members && members.length > 0) {
      const memberInserts = members.map((member: { name: string; email?: string; color: string }, index: number) => ({
        family_id: family.id,
        name: member.name,
        email: member.email || null,
        color: COLORS[(index + 1) % COLORS.length],
        is_admin: false,
      }))

      const { error: membersError } = await supabaseAdmin
        .from('family_members')
        .insert(memberInserts)

      if (membersError) {
        console.error('[v0] Error creating members:', membersError)
        // Don't fail the whole setup, just log the error
      }
    }

    return NextResponse.json({ success: true, familyId: family.id })
  } catch (error) {
    console.error('[v0] Setup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
