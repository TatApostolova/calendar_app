'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
      setIsLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md rounded-[1.75rem] border-2 bg-card shadow-yolk">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yolk shadow-yolk">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="font-display text-3xl font-bold">Welcome back</CardTitle>
          <CardDescription className="font-semibold text-muted-foreground">
            Sign in to your family calendar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
