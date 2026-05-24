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
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={onPrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectDate(new Date())}
            >
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={onNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Day names */}
        <div className="grid grid-cols-7 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
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
                  'relative aspect-square p-1 rounded-lg transition-colors',
                  'hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring',
                  !isCurrentMonth && 'text-muted-foreground/50',
                  isSelected && 'bg-primary text-primary-foreground hover:bg-primary',
                  isDayToday && !isSelected && 'ring-2 ring-primary'
                )}
              >
                <span
                  className={cn(
                    'text-sm font-medium',
                    isSelected && 'text-primary-foreground'
                  )}
                >
                  {format(day, 'd')}
                </span>
                
                {/* Event dots */}
                {dayEvents.length > 0 && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {dayEvents.slice(0, 3).map((event) => {
                      // Get the first attendee's color or default
                      const firstAttendee = event.event_attendees[0]?.family_member
                      const color = firstAttendee?.color || '#3B82F6'
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
                      <span className="text-[10px] text-muted-foreground">
                        +{dayEvents.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
