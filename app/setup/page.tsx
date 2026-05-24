'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users } from 'lucide-react'

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

export default function SetupPage() {
  const [step, setStep] = useState<'family' | 'members'>('family')
  const [familyName, setFamilyName] = useState('')
  const [members, setMembers] = useState<{ name: string; email: string; color: string }[]>([])
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleCreateFamily = async () => {
    if (!familyName.trim()) return
    setStep('members')
  }

  const handleAddMember = () => {
    if (!newMemberName.trim()) return
    
    const color = COLORS[members.length % COLORS.length]
    setMembers([...members, { name: newMemberName, email: newMemberEmail, color }])
    setNewMemberName('')
    setNewMemberEmail('')
  }

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index))
  }

  const handleFinishSetup = async () => {
    setIsLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    // Use API route to bypass RLS for initial setup
    const response = await fetch('/api/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        familyName,
        userId: user.id,
        userName: user.user_metadata?.name,
        userEmail: user.email,
        members,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('[v0] Setup failed:', result.error)
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    router.push('/dashboard')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md rounded-[1.75rem] border-2 bg-card shadow-yolk">
        {step === 'family' ? (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yolk shadow-yolk">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="font-display text-3xl font-bold">Create your family calendar</CardTitle>
              <CardDescription className="font-semibold text-muted-foreground">
                Give your family calendar a name to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="family-name" className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Family name</Label>
                <Input
                  id="family-name"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  placeholder="e.g., The Smiths"
                  className="rounded-2xl border-2 bg-secondary font-semibold"
                />
              </div>
              <Button
                className="w-full rounded-full bg-yolk py-6 font-display text-base font-extrabold text-primary-foreground shadow-yolk hover:brightness-105"
                onClick={handleCreateFamily}
                disabled={!familyName.trim()}
              >
                Continue
              </Button>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yolk shadow-yolk">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="font-display text-3xl font-bold">Add family members</CardTitle>
              <CardDescription className="font-semibold text-muted-foreground">
                Add the people who will use this calendar. You can add more later.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current members */}
              {members.length > 0 && (
                <div className="space-y-2">
                  {members.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-2xl bg-secondary p-2"
                    >
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-extrabold text-white"
                        style={{ backgroundColor: member.color }}
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-sm font-bold">{member.name}</p>
                        {member.email && (
                          <p className="text-xs text-muted-foreground truncate">
                            {member.email}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(index)}
                        className="rounded-full font-bold"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new member */}
              <div className="space-y-3 rounded-3xl border-2 border-dashed bg-secondary/60 p-4">
                <div className="space-y-2">
                  <Label htmlFor="member-name" className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Name</Label>
                  <Input
                    id="member-name"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="e.g., John"
                    className="rounded-2xl border-2 bg-card font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-email" className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
                    Email <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="member-email"
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="rounded-2xl border-2 bg-card font-semibold"
                  />
                </div>
                <Button
                  variant="secondary"
                  className="w-full rounded-full font-extrabold"
                  onClick={handleAddMember}
                  disabled={!newMemberName.trim()}
                >
                  Add member
                </Button>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setStep('family')} className="rounded-full border-2 bg-card font-extrabold">
                  Back
                </Button>
                <Button
                  className="flex-1 rounded-full bg-yolk font-display font-extrabold text-primary-foreground shadow-yolk hover:brightness-105"
                  onClick={handleFinishSetup}
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Finish setup'}
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </main>
  )
}
