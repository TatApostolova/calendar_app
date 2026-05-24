'use client'

import { EventWithAttendees, FamilyMember } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Clock, MapPin, CalendarDays } from 'lucide-react'
import { format, parseISO, isSameDay, isToday, isTomorrow } from 'date-fns'
import { cn } from '@/lib/utils'
import { ActivityBadge, ChickIcon, EggIcon, FeedSpecks } from './chicken-visuals'

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
          <Badge variant="secondary" className="rounded-full bg-[#e4f1d6] px-2.5 font-extrabold text-[#3d6020]">
            Going
          </Badge>
        )
      case 'not_going':
        return (
          <Badge variant="secondary" className="rounded-full bg-[#ffd9c2] px-2.5 font-extrabold text-[#9a4710]">
            Not going
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="rounded-full bg-muted px-2.5 font-extrabold text-muted-foreground">
            Pending
          </Badge>
        )
    }
  }

  return (
    <Card className="h-fit overflow-hidden rounded-[1.75rem] border-2 bg-card shadow-sm">
      <CardHeader className="relative overflow-hidden bg-secondary/70 px-4 pb-3 pt-5">
        <FeedSpecks className="absolute right-12 top-1 opacity-60" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
              {isToday(selectedDate) ? <ChickIcon size={34} /> : <CalendarDays className="h-4 w-4" />}
            </span>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">
                Today's plan
              </p>
              <CardTitle className="font-display text-xl font-bold">{getDateLabel(selectedDate)}</CardTitle>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onCreateEvent} className="rounded-full bg-yolk text-primary-foreground shadow-yolk hover:brightness-105">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pt-4">
        {dayEvents.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed bg-secondary/60 px-4 py-8 text-center">
            <EggIcon size={44} className="mx-auto mb-3" />
            <p className="mb-3 font-bold text-muted-foreground">No plans hatched yet</p>
            <Button variant="outline" size="sm" onClick={onCreateEvent} className="rounded-full border-2 bg-card font-extrabold">
              <Plus className="h-4 w-4 mr-2" />
              Add an event
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-[430px] pr-3">
            <div className="space-y-3 pb-2">
              {dayEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className={cn(
                    'w-full rounded-[1.35rem] border-2 bg-card p-3 text-left transition-colors',
                    'hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring'
                  )}
                >
                  {/* Attendee color bar */}
                  <div className="flex gap-0.5 mb-2">
                    {event.event_attendees.slice(0, 5).map((attendee) => (
                      <span
                        key={attendee.id}
                        className="h-1.5 flex-1 rounded-full"
                        style={{ backgroundColor: attendee.family_member.color }}
                      />
                    ))}
                  </div>

                  <div className="flex items-start gap-3">
                    <ActivityBadge event={event} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-base font-bold leading-tight">
                          {event.title}
                        </h3>
                        {getStatusBadge(event)}
                      </div>

                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
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
                          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Attendees */}
                  <div className="mt-3 flex items-center gap-1">
                    {event.event_attendees.slice(0, 4).map((attendee) => (
                      <span
                        key={attendee.id}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-extrabold text-white ring-2 ring-card"
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
