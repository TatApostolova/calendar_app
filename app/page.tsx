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
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/92 backdrop-blur-md">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yolk shadow-yolk">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">Chicken Calendar</span>
            </div>
            <div className="flex items-center gap-3">
              {isFirstTimeSetup ? (
                <Button asChild className="rounded-full bg-yolk px-5 font-extrabold text-primary-foreground shadow-yolk hover:brightness-105">
                  <Link href="/auth/sign-up">Round up the flock</Link>
                </Button>
              ) : (
                <Button asChild className="rounded-full bg-yolk px-5 font-extrabold text-primary-foreground shadow-yolk hover:brightness-105">
                  <Link href="/auth/login">Sign in</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-yolk shadow-yolk">
              <Calendar className="h-12 w-12 text-primary-foreground" />
            </div>
            <p className="mb-3 text-[12px] font-extrabold uppercase tracking-[0.2em] text-destructive">
              Welcome to the coop
            </p>
            <h1 className="font-display text-5xl font-extrabold tracking-normal text-balance md:text-7xl">
              Herding humans is hard
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg font-semibold text-muted-foreground md:text-xl">
              Built for busy families, chaotic schedules, and &lsquo;wait, who&rsquo;s taking her?&rsquo;
            </p>
            <div className="mt-10">
              {isFirstTimeSetup ? (
                <Button size="lg" asChild className="rounded-full bg-yolk px-8 py-6 font-display text-base font-extrabold text-primary-foreground shadow-yolk hover:brightness-105">
                  <Link href="/auth/sign-up">
                    Round up the flock
                  </Link>
                </Button>
              ) : (
                <Button size="lg" asChild className="rounded-full bg-yolk px-8 py-6 font-display text-base font-extrabold text-primary-foreground shadow-yolk hover:brightness-105">
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
      <section className="bg-secondary/70 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-[1.5rem] border-2 bg-card p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-display text-xl font-bold">The whole flock</h3>
              <p className="font-semibold text-muted-foreground">
                Everyone gets their own colour so you can instantly see who&rsquo;s flying where.
              </p>
            </div>
            <div className="rounded-[1.5rem] border-2 bg-card p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-display text-xl font-bold">No more &lsquo;I thought you knew&rsquo;</h3>
              <p className="font-semibold text-muted-foreground">
                Track who&rsquo;s coming, who&rsquo;s driving, and who forgot to mention the schedule changed.
              </p>
            </div>
            <div className="rounded-[1.5rem] border-2 bg-card p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-display text-xl font-bold">Updates fly fast</h3>
              <p className="font-semibold text-muted-foreground">
                Keep the flock coordinated, even when plans go sideways.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/80 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-yolk">
                <Calendar className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-sm font-bold">Chicken Calendar</span>
            </div>
            <p className="text-sm font-semibold text-muted-foreground">
              Made for flocks on the fly
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
