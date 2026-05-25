'use client'

import { EventWithAttendees, FamilyMember } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from 'date-fns'
import { cn } from '@/lib/utils'
import { ChickenMascot, EggIcon, FeedSpecks } from './chicken-visuals'

interface CalendarViewProps {
  events: EventWithAttendees[]
  currentMonth: Date
  selectedDate: Date
  onSelectDate: (date: Date) => void
  onPrevMonth: () => void
  onNextMonth: () => void
  familyMembers: FamilyMember[]
  isLoading: boolean
}

export function CalendarView({
  events,
  currentMonth,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: CalendarViewProps) {
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventDate = parseISO(event.start_time)
      return isSameDay(eventDate, day)
    })
  }

  return (
    <Card className="overflow-hidden rounded-[1.75rem] border-2 bg-card shadow-sm">
      <CardHeader className="relative overflow-hidden bg-secondary/70 px-4 pb-4 pt-5 sm:px-6">
        <FeedSpecks className="absolute right-20 top-2 hidden opacity-70 sm:block" />
        <ChickenMascot size={72} className="absolute -right-2 -top-1 hidden rotate-6 sm:block" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">
              The flock calendar
            </p>
            <CardTitle className="font-display text-3xl font-bold tracking-normal">
            {format(currentMonth, 'MMMM yyyy')}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="icon" onClick={onPrevMonth} className="rounded-full border-2 bg-card">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectDate(new Date())}
              className="rounded-full border-2 bg-card px-4 font-extrabold"
            >
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={onNextMonth} className="rounded-full border-2 bg-card">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 py-4 sm:px-5 sm:py-5">
        {/* Day names */}
        <div className="mb-2 grid grid-cols-7">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="py-2 text-center text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((day) => {
            const dayEvents = getEventsForDay(day)
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isSelected = isSameDay(day, selectedDate)
            const isDayToday = isToday(day)

            return (
              <button
                key={day.toISOString()}
                onClick={() => onSelectDate(day)}
                className={cn(
                  'relative flex aspect-[0.92] flex-col items-center rounded-2xl p-1.5 transition-colors',
                  'hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring',
                  !isCurrentMonth && 'text-muted-foreground/50',
                  isSelected && 'bg-card text-foreground shadow-[inset_0_0_0_2px_#2b1810] hover:bg-card',
                  isDayToday && 'bg-yolk text-primary-foreground shadow-yolk hover:brightness-105'
                )}
              >
                <span
                  className={cn(
                    'font-display text-base font-bold leading-none',
                    isSelected && 'text-primary-foreground'
                  )}
                >
                  {format(day, 'd')}
                </span>
                {isDayToday && (
                  <span className="mt-0.5 text-[8px] font-extrabold uppercase tracking-wide">
                    Today
                  </span>
                )}
                
                {/* Event dots */}
                {dayEvents.length > 0 && (
                  <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-0.5">
                    {dayEvents.slice(0, 3).map((event) => {
                      // Get the first attendee who is going or pending (exclude declined)
                      const activeAttendee = event.event_attendees.find(
                        (a) => a.status !== 'not_going'
                      )?.family_member
                      const color = activeAttendee?.color || '#3B82F6'
                      return (
                        <span
                          key={event.id}
                          className={cn(
                            'h-1.5 w-1.5 rounded-full',
                            isSelected && 'ring-1 ring-primary-foreground'
                          )}
                          style={{ backgroundColor: color }}
                        />
                      )
                    })}
                    {dayEvents.length > 3 && (
                      <span className="text-[10px] font-extrabold text-muted-foreground">
                        +{dayEvents.length - 3}
                      </span>
                    )}
                  </div>
                )}
                {isSelected && dayEvents.length === 0 && (
                  <EggIcon size={16} className="absolute bottom-1.5 left-1/2 -translate-x-1/2 opacity-80" />
                )}
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
