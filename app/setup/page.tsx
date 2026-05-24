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
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        {step === 'family' ? (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Create your family calendar</CardTitle>
              <CardDescription>
                Give your family calendar a name to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="family-name">Family name</Label>
                <Input
                  id="family-name"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  placeholder="e.g., The Smiths"
                />
              </div>
              <Button
                className="w-full"
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
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Add family members</CardTitle>
              <CardDescription>
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
                      className="flex items-center gap-3 p-2 rounded-lg bg-muted"
                    >
                      <span
                        className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                        style={{ backgroundColor: member.color }}
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{member.name}</p>
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
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new member */}
              <div className="space-y-3 p-4 rounded-lg border border-dashed">
                <div className="space-y-2">
                  <Label htmlFor="member-name">Name</Label>
                  <Input
                    id="member-name"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="e.g., John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-email">
                    Email <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="member-email"
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={handleAddMember}
                  disabled={!newMemberName.trim()}
                >
                  Add member
                </Button>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setStep('family')}>
                  Back
                </Button>
                <Button
                  className="flex-1"
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
