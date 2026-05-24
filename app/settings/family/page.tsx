import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FamilySettings } from '@/components/settings/family-settings'

export default async function FamilySettingsPage() {
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

  if (!membership || !membership.is_admin) {
    redirect('/dashboard')
  }

  // Get all family members
  const { data: familyMembers } = await supabase
    .from('family_members')
    .select('*')
    .eq('family_id', membership.family_id)
    .order('created_at')

  return (
    <FamilySettings
      family={membership.families}
      familyMembers={familyMembers || []}
      currentMember={membership}
    />
  )
}
