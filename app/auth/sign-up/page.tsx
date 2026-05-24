'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import Link from 'next/link'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      // Use admin API route to create user (bypasses email confirmation)
      const response = await fetch('/api/auth/admin-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to create account' })
        setIsLoading(false)
        return
      }

      // User created successfully, now sign them in
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setMessage({ type: 'error', text: signInError.message })
        setIsLoading(false)
        return
      }

      // Redirect to setup
      router.push('/setup')
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md rounded-[1.75rem] border-2 bg-card shadow-yolk">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yolk shadow-yolk">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-destructive">Welcome to the coop</p>
          <CardTitle className="font-display text-3xl font-bold">Create admin account</CardTitle>
          <CardDescription className="font-semibold text-muted-foreground">
            Set up your family calendar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Your name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-2xl border-2 bg-secondary font-semibold"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-2xl border-2 bg-secondary font-semibold"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="rounded-2xl border-2 bg-secondary font-semibold"
              />
            </div>
            
            {message && (
              <div
                className={`rounded-lg p-3 text-sm ${
                  message.type === 'success'
                    ? 'bg-[#e4f1d6] text-[#3d6020]'
                    : 'bg-[#ffd9c2] text-[#9a4710]'
                }`}
              >
                {message.text}
              </div>
            )}

            <Button type="submit" className="w-full rounded-full bg-yolk py-6 font-display text-base font-extrabold text-primary-foreground shadow-yolk hover:brightness-105" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm font-semibold text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-extrabold text-destructive hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
