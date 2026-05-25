'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Family, FamilyMember, EventWithAttendees } from '@/lib/types'
import { CalendarView } from './calendar-view'
import { EventList } from './event-list'
import { EventModal } from './event-modal'
import { Header } from './header'
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths } from 'date-fns'

interface DashboardContentProps {
  family: Family
  currentMember: FamilyMember
  familyMembers: FamilyMember[]
}

export function DashboardContent({ family, currentMember, familyMembers }: DashboardContentProps) {
  const [events, setEvents] = useState<EventWithAttendees[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<EventWithAttendees | null>(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [filterMemberId, setFilterMemberId] = useState<string | null>(null)

  const supabase = createClient()

  const fetchEvents = useCallback(async () => {
    setIsLoading(true)
    
    // Get date range for the current month view (including overflow days)
    const monthStart = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 })
    const monthEnd = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 })

    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        event_attendees (
          *,
          family_member:family_members (*)
        ),
        creator:family_members!events_created_by_fkey (*)
      `)
      .eq('family_id', family.id)
      .gte('start_time', monthStart.toISOString())
      .lte('start_time', monthEnd.toISOString())
      .order('start_time')

    if (error) {
      console.error('[v0] Error fetching events:', error)
    } else {
      setEvents(data || [])
    }
    
    setIsLoading(false)
  }, [supabase, family.id, currentMonth])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  // Real-time subscriptions
  useEffect(() => {
    const eventsChannel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: `family_id=eq.${family.id}`,
        },
        () => {
          fetchEvents()
        }
      )
      .subscribe()

    const attendeesChannel = supabase
      .channel('attendees-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_attendees',
        },
        () => {
          fetchEvents()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(eventsChannel)
      supabase.removeChannel(attendeesChannel)
    }
  }, [supabase, family.id, fetchEvents])

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleCreateEvent = () => {
    setSelectedEvent(null)
    setIsEventModalOpen(true)
  }

  const handleEditEvent = (event: EventWithAttendees) => {
    setSelectedEvent(event)
    setIsEventModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsEventModalOpen(false)
    setSelectedEvent(null)
  }

  // Filter events by member if filter is active
  const filteredEvents = filterMemberId
    ? events.filter((event) =>
        event.event_attendees.some((a) => a.member_id === filterMemberId)
      )
    : events

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        family={family}
        currentMember={currentMember}
        familyMembers={familyMembers}
        filterMemberId={filterMemberId}
        onFilterChange={setFilterMemberId}
        onCreateEvent={handleCreateEvent}
      />
      
      <main className="container mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:py-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2">
            <CalendarView
              events={filteredEvents}
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              familyMembers={familyMembers}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-1">
            <EventList
              events={filteredEvents}
              selectedDate={selectedDate}
              familyMembers={familyMembers}
              currentMember={currentMember}
              onEventClick={handleEditEvent}
              onCreateEvent={handleCreateEvent}
            />
          </div>
        </div>
      </main>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={handleCloseModal}
        event={selectedEvent}
        familyId={family.id}
        familyMembers={familyMembers}
        currentMember={currentMember}
        selectedDate={selectedDate}
        onSave={fetchEvents}
      />
    </div>
  )
}
