'use client'

import { EventWithAttendees, FamilyMember } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Clock, MapPin, CalendarDays } from 'lucide-react'
import { format, parseISO, isSameDay, isToday, isTomorrow } from 'date-fns'
import { cn } from '@/lib/utils'

interface EventListProps {
  events: EventWithAttendees[]
  selectedDate: Date
  familyMembers: FamilyMember[]
  currentMember: FamilyMember
  onEventClick: (event: EventWithAttendees) => void
  onCreateEvent: () => void
}

export function EventList({
  events,
  selectedDate,
  currentMember,
  onEventClick,
  onCreateEvent,
}: EventListProps) {
  const dayEvents = events.filter((event) => {
    const eventDate = parseISO(event.start_time)
    return isSameDay(eventDate, selectedDate)
  })

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    return format(date, 'EEEE, MMMM d')
  }

  const getStatusBadge = (event: EventWithAttendees) => {
    const myAttendance = event.event_attendees.find(
      (a) => a.member_id === currentMember.id
    )
    if (!myAttendance) return null

    switch (myAttendance.status) {
      case 'going':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Going
          </Badge>
        )
      case 'not_going':
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            Not going
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            Pending
          </Badge>
        )
    }
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">{getDateLabel(selectedDate)}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onCreateEvent}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {dayEvents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-3">No events scheduled</p>
            <Button variant="outline" size="sm" onClick={onCreateEvent}>
              <Plus className="h-4 w-4 mr-2" />
              Add an event
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {dayEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg border transition-colors',
                    'hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring'
                  )}
                >
                  {/* Attendee color bar */}
                  <div className="flex gap-0.5 mb-2">
                    {event.event_attendees.slice(0, 5).map((attendee) => (
                      <span
                        key={attendee.id}
                        className="h-1 flex-1 rounded-full"
                        style={{ backgroundColor: attendee.family_member.color }}
                      />
                    ))}
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-sm leading-tight">
                      {event.title}
                    </h3>
                    {getStatusBadge(event)}
                  </div>

                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {event.all_day ? (
                        'All day'
                      ) : (
                        <>
                          {format(parseISO(event.start_time), 'h:mm a')} -{' '}
                          {format(parseISO(event.end_time), 'h:mm a')}
                        </>
                      )}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                    )}
                  </div>

                  {/* Attendees */}
                  <div className="mt-3 flex items-center gap-1">
                    {event.event_attendees.slice(0, 4).map((attendee) => (
                      <span
                        key={attendee.id}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-medium text-white"
                        style={{ backgroundColor: attendee.family_member.color }}
                        title={attendee.family_member.name}
                      >
                        {attendee.family_member.name.charAt(0).toUpperCase()}
                      </span>
                    ))}
                    {event.event_attendees.length > 4 && (
                      <span className="text-xs text-muted-foreground">
                        +{event.event_attendees.length - 4}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
