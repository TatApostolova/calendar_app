'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Family, FamilyMember, Invitation } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ArrowLeft, Check, Copy, Mail, Plus, Trash2, Users } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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

interface FamilySettingsProps {
  family: Family
  familyMembers: FamilyMember[]
  currentMember: FamilyMember
}

export function FamilySettings({ family, familyMembers, currentMember }: FamilySettingsProps) {
  const [members, setMembers] = useState(familyMembers)
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [familyName, setFamilyName] = useState(family.name)
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [selectedColor, setSelectedColor] = useState(COLORS[0])
  const [isLoading, setIsLoading] = useState(false)
  const [copiedInviteId, setCopiedInviteId] = useState<string | null>(null)
  const [inviteLink, setInviteLink] = useState<string | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  // Fetch pending invitations
  useEffect(() => {
    const fetchInvitations = async () => {
      const { data } = await supabase
        .from('invitations')
        .select('*')
        .eq('family_id', family.id)
        .is('accepted_at', null)

      if (data) {
        setInvitations(data)
      }
    }

    fetchInvitations()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('invitations-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invitations' }, () => {
        fetchInvitations()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [family.id, supabase])

  const handleUpdateFamilyName = async () => {
    if (!familyName.trim() || familyName === family.name) return
    
    await supabase
      .from('families')
      .update({ name: familyName })
      .eq('id', family.id)
    
    router.refresh()
  }

  const handleInviteMember = async () => {
    if (!newMemberName.trim() || !newMemberEmail.trim()) return

    setIsLoading(true)
    
    const { data: invitation, error } = await supabase
      .from('invitations')
      .insert({
        family_id: family.id,
        email: newMemberEmail,
        invited_by: currentMember.id,
        member_name: newMemberName,
        member_color: selectedColor,
      })
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating invitation:', error)
    } else if (invitation) {
      setInvitations([...invitations, invitation])
      const link = `${window.location.origin}/invite?token=${invitation.token}`
      setInviteLink(link)
    }

    setIsLoading(false)
  }

  const copyInviteLink = async (invitation: Invitation) => {
    const link = `${window.location.origin}/invite?token=${invitation.token}`
    await navigator.clipboard.writeText(link)
    setCopiedInviteId(invitation.id)
    setTimeout(() => setCopiedInviteId(null), 2000)
  }

  const handleCancelInvitation = async (invitationId: string) => {
    const { error } = await supabase
      .from('invitations')
      .delete()
      .eq('id', invitationId)

    if (!error) {
      setInvitations(invitations.filter((i) => i.id !== invitationId))
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (memberId === currentMember.id) return

    setIsLoading(true)
    
    const { error } = await supabase
      .from('family_members')
      .delete()
      .eq('id', memberId)

    if (!error) {
      setMembers(members.filter((m) => m.id !== memberId))
    }

    setIsLoading(false)
  }

  const handleUpdateMemberColor = async (memberId: string, color: string) => {
    await supabase
      .from('family_members')
      .update({ color })
      .eq('id', memberId)

    setMembers(members.map((m) => (m.id === memberId ? { ...m, color } : m)))
  }

  const resetInviteForm = () => {
    setNewMemberName('')
    setNewMemberEmail('')
    setSelectedColor(COLORS[(members.length + invitations.length) % COLORS.length])
    setInviteLink(null)
    setIsAddingMember(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex h-16 items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="font-semibold">Family Settings</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
        {/* Family name */}
        <Card>
          <CardHeader>
            <CardTitle>Family Name</CardTitle>
            <CardDescription>
              This is how your family calendar will appear
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
              />
              <Button
                onClick={handleUpdateFamilyName}
                disabled={!familyName.trim() || familyName === family.name}
              >
                Save
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Family members */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Family Members
                </CardTitle>
                <CardDescription>
                  Manage who can access this calendar
                </CardDescription>
              </div>
              <Dialog open={isAddingMember} onOpenChange={(open) => {
                if (!open) resetInviteForm()
                else {
                  setSelectedColor(COLORS[(members.length + invitations.length) % COLORS.length])
                  setIsAddingMember(true)
                }
              }}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Invite member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Family Member</DialogTitle>
                  </DialogHeader>
                  
                  {inviteLink ? (
                    <div className="space-y-4 pt-4">
                      <div className="rounded-lg bg-muted p-4 text-center">
                        <Check className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="font-medium">Invitation created!</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Share this link with {newMemberName}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={inviteLink}
                          readOnly
                          className="text-sm"
                        />
                        <Button
                          onClick={() => {
                            navigator.clipboard.writeText(inviteLink)
                            setCopiedInviteId('new')
                            setTimeout(() => setCopiedInviteId(null), 2000)
                          }}
                        >
                          {copiedInviteId === 'new' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <Button className="w-full" onClick={resetInviteForm}>
                        Done
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={newMemberName}
                          onChange={(e) => setNewMemberName(e.target.value)}
                          placeholder="e.g., John"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newMemberEmail}
                          onChange={(e) => setNewMemberEmail(e.target.value)}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Color</Label>
                        <div className="flex gap-2 flex-wrap">
                          {COLORS.map((color) => (
                            <button
                              key={color}
                              type="button"
                              className={`h-8 w-8 rounded-full transition-all ${
                                selectedColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => setSelectedColor(color)}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button
                          variant="outline"
                          onClick={resetInviteForm}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleInviteMember}
                          disabled={!newMemberName.trim() || !newMemberEmail.trim() || isLoading}
                        >
                          {isLoading ? 'Creating...' : 'Create invitation'}
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Active members */}
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 rounded-lg border"
                >
                  <div className="relative">
                    <button
                      className="h-10 w-10 rounded-full flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </button>
                    <select
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      value={member.color}
                      onChange={(e) => handleUpdateMemberColor(member.id, e.target.value)}
                    >
                      {COLORS.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{member.name}</p>
                      {member.is_admin && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          Admin
                        </span>
                      )}
                      {member.id === currentMember.id && (
                        <span className="text-xs text-muted-foreground">
                          (you)
                        </span>
                      )}
                    </div>
                    {member.email && (
                      <p className="text-sm text-muted-foreground truncate">
                        {member.email}
                      </p>
                    )}
                  </div>

                  {member.id !== currentMember.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              {/* Pending invitations */}
              {invitations.length > 0 && (
                <>
                  <div className="pt-2">
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Pending Invitations
                    </p>
                  </div>
                  {invitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-dashed"
                    >
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center text-white font-medium opacity-60"
                        style={{ backgroundColor: invitation.member_color }}
                      >
                        {invitation.member_name.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-muted-foreground">{invitation.member_name}</p>
                          <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded">
                            Pending
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {invitation.email}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyInviteLink(invitation)}
                        title="Copy invite link"
                      >
                        {copiedInviteId === invitation.id ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleCancelInvitation(invitation.id)}
                        title="Cancel invitation"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
