import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar, Users, Bell, CheckCircle } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If user is logged in, check if they have a family
  if (user) {
    const { data: membership } = await supabase
      .from('family_members')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (membership) {
      redirect('/dashboard')
    } else {
      redirect('/setup')
    }
  }

  // Check if any families exist (if not, show admin setup)
  const { count } = await supabase
    .from('families')
    .select('*', { count: 'exact', head: true })

  const isFirstTimeSetup = count === 0

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">Family Calendar</span>
            </div>
            <div className="flex items-center gap-3">
              {isFirstTimeSetup ? (
                <Button asChild>
                  <Link href="/auth/sign-up">Set up your calendar</Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/auth/login">Sign in</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
              Keep your family in sync
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              A simple, beautiful calendar for families. Create events, track who&apos;s going, 
              and never miss an important moment together.
            </p>
            <div className="mt-10">
              {isFirstTimeSetup ? (
                <Button size="lg" asChild>
                  <Link href="/auth/sign-up">
                    Set up your calendar
                  </Link>
                </Button>
              ) : (
                <Button size="lg" asChild>
                  <Link href="/auth/login">
                    Sign in to your calendar
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">For the whole family</h3>
              <p className="text-muted-foreground">
                Each family member gets their own color. See at a glance who needs to be where.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Track attendance</h3>
              <p className="text-muted-foreground">
                Everyone can confirm if they&apos;re going and add notes. No more group chat chaos.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Real-time updates</h3>
              <p className="text-muted-foreground">
                Changes sync instantly across all devices. Always stay up to date.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                <Calendar className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-medium text-sm">Family Calendar</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Made with care for families everywhere
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
