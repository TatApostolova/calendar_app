'use client'

import { Family, FamilyMember } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Calendar, Plus, LogOut, Users, Filter } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChickenMascot } from './chicken-visuals'

interface HeaderProps {
  family: Family
  currentMember: FamilyMember
  familyMembers: FamilyMember[]
  filterMemberId: string | null
  onFilterChange: (memberId: string | null) => void
  onCreateEvent: () => void
}

export function Header({
  family,
  currentMember,
  familyMembers,
  filterMemberId,
  onFilterChange,
  onCreateEvent,
}: HeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const filterMember = filterMemberId
    ? familyMembers.find((m) => m.id === filterMemberId)
    : null

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/92 backdrop-blur-md">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yolk shadow-yolk">
              <Calendar className="absolute h-5 w-5 translate-x-1 translate-y-1 text-primary-foreground/35" />
              <ChickenMascot size={46} className="-translate-x-0.5 -translate-y-0.5" />
            </div>
            <div className="hidden min-w-0 sm:block">
              <span className="block text-[11px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">
                The Coop
              </span>
              <span className="block truncate font-display text-xl font-bold leading-tight">{family.name}</span>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 rounded-full border-2 bg-card px-3 font-bold shadow-sm hover:bg-secondary">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {filterMember ? filterMember.name : 'All events'}
                  </span>
                  {filterMember && (
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: filterMember.color }}
                    />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by person</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onFilterChange(null)}>
                  <Users className="mr-2 h-4 w-4" />
                  All events
                </DropdownMenuItem>
                {familyMembers.map((member) => (
                  <DropdownMenuItem
                    key={member.id}
                    onClick={() => onFilterChange(member.id)}
                  >
                    <span
                      className="mr-2 h-3 w-3 rounded-full"
                      style={{ backgroundColor: member.color }}
                    />
                    {member.name}
                    {member.id === currentMember.id && ' (you)'}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Create Event */}
            <Button onClick={onCreateEvent} size="sm" className="gap-2 rounded-full bg-yolk px-4 font-extrabold text-primary-foreground shadow-yolk hover:brightness-105">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Event</span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full bg-card shadow-sm hover:bg-secondary">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback
                      style={{ backgroundColor: currentMember.color }}
                      className="text-xs font-extrabold text-white"
                    >
                      {getInitials(currentMember.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{currentMember.name}</span>
                    <span className="font-normal text-muted-foreground text-xs">
                      {currentMember.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {currentMember.is_admin && (
                  <DropdownMenuItem asChild>
                    <Link href="/settings/family">
                      <Users className="mr-2 h-4 w-4" />
                      Manage Family
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
