'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Loader2 } from 'lucide-react'
import type { Invitation, Family } from '@/lib/types'

export default function AcceptInvitePage() {
  const [invitation, setInvitation] = useState<(Invitation & { families: Family }) | null>(null)
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isAccepting, setIsAccepting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    const fetchInvitation = async () => {
      if (!token) {
        setError('Invalid invitation link')
        setIsLoading(false)
        return
      }

      const supabase = createClient()
      const { data, error } = await supabase
        .from('invitations')
        .select('*, families(*)')
        .eq('token', token)
        .is('accepted_at', null)
        .single()

      if (error || !data) {
        setError('This invitation is invalid or has already been used')
        setIsLoading(false)
        return
      }

      setInvitation(data)
      setIsLoading(false)
    }

    fetchInvitation()
  }, [token])

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!invitation) return

    setIsAccepting(true)
    setError(null)

    const supabase = createClient()

    // Create account with email/password
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: invitation.email,
      password,
      options: {
        data: {
          name: invitation.member_name,
        },
      },
    })

    if (authError) {
      setError(authError.message)
      setIsAccepting(false)
      return
    }

    if (!authData.user) {
      setError('Failed to create account')
      setIsAccepting(false)
      return
    }

    // Sign in immediately
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: invitation.email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setIsAccepting(false)
      return
    }

    // Create family member record
    const { error: memberError } = await supabase
      .from('family_members')
      .insert({
        family_id: invitation.family_id,
        user_id: authData.user.id,
        name: invitation.member_name,
        email: invitation.email,
        color: invitation.member_color,
        is_admin: false,
      })

    if (memberError) {
      setError('Failed to join family: ' + memberError.message)
      setIsAccepting(false)
      return
    }

    // Mark invitation as accepted
    await supabase
      .from('invitations')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', invitation.id)

    router.push('/dashboard')
  }

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    )
  }

  if (error && !invitation) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-destructive">Invalid Invitation</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">{"You're invited!"}</CardTitle>
          <CardDescription>
            Join the <span className="font-medium text-foreground">{invitation?.families?.name}</span> family calendar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              {"You'll join as:"}
            </p>
            <div className="mt-2 flex items-center gap-3">
              <div
                className="h-8 w-8 rounded-full"
                style={{ backgroundColor: invitation?.member_color }}
              />
              <div>
                <p className="font-medium">{invitation?.member_name}</p>
                <p className="text-sm text-muted-foreground">{invitation?.email}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleAccept} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Create a password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Choose a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <p className="text-xs text-muted-foreground">
                At least 6 characters
              </p>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isAccepting}>
              {isAccepting ? 'Joining...' : 'Accept invitation'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
