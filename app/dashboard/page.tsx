import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardContent } from '@/components/dashboard/dashboard-content'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Get the user's family membership
  const { data: membership } = await supabase
    .from('family_members')
    .select('*, families(*)')
    .eq('user_id', user.id)
    .single()

  // If user has no family, redirect to setup
  if (!membership) {
    redirect('/setup')
  }

  // Get all family members
  const { data: familyMembers } = await supabase
    .from('family_members')
    .select('*')
    .eq('family_id', membership.family_id)
    .order('name')

  return (
    <DashboardContent
      family={membership.families}
      currentMember={membership}
      familyMembers={familyMembers || []}
    />
  )
}
