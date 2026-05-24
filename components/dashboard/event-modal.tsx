'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { EventWithAttendees, FamilyMember } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trash2, Check, X, MessageSquare } from 'lucide-react'
import { format, parseISO, set } from 'date-fns'
import { cn } from '@/lib/utils'
import { ActivityBadge, ChickenMascot, FeedSpecks } from './chicken-visuals'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  event: EventWithAttendees | null
  familyId: string
  familyMembers: FamilyMember[]
  currentMember: FamilyMember
  selectedDate: Date
  onSave: () => void
}

export function EventModal({
  isOpen,
  onClose,
  event,
  familyId,
  familyMembers,
  currentMember,
  selectedDate,
  onSave,
}: EventModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [allDay, setAllDay] = useState(false)
  const [attendeeIds, setAttendeeIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('details')

  const supabase = createClient()
  const isEditing = !!event

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setDescription(event.description || '')
      setLocation(event.location || '')
      setStartDate(format(parseISO(event.start_time), 'yyyy-MM-dd'))
      setStartTime(format(parseISO(event.start_time), 'HH:mm'))
      setEndTime(format(parseISO(event.end_time), 'HH:mm'))
      setAllDay(event.all_day)
      setAttendeeIds(event.event_attendees.map((a) => a.member_id))
    } else {
      setTitle('')
      setDescription('')
      setLocation('')
      setStartDate(format(selectedDate, 'yyyy-MM-dd'))
      setStartTime('09:00')
      setEndTime('10:00')
      setAllDay(false)
      setAttendeeIds([currentMember.id])
    }
    setActiveTab('details')
  }, [event, selectedDate, currentMember.id])

  const handleSave = async () => {
    if (!title.trim()) return

    setIsLoading(true)

    const [startHour, startMinute] = startTime.split(':').map(Number)
    const [endHour, endMinute] = endTime.split(':').map(Number)
    const baseDate = parseISO(startDate)

    const startDateTime = set(baseDate, {
      hours: allDay ? 0 : startHour,
      minutes: allDay ? 0 : startMinute,
    })
    const endDateTime = set(baseDate, {
      hours: allDay ? 23 : endHour,
      minutes: allDay ? 59 : endMinute,
    })

    if (isEditing) {
      // Update event
      const { error: eventError } = await supabase
        .from('events')
        .update({
          title,
          description: description || null,
          location: location || null,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          all_day: allDay,
          updated_at: new Date().toISOString(),
        })
        .eq('id', event.id)

      if (eventError) {
        console.error('[v0] Error updating event:', eventError)
        setIsLoading(false)
        return
      }

      // Update attendees - remove old ones and add new ones
      const currentAttendeeIds = event.event_attendees.map((a) => a.member_id)
      const toRemove = currentAttendeeIds.filter((id) => !attendeeIds.includes(id))
      const toAdd = attendeeIds.filter((id) => !currentAttendeeIds.includes(id))

      if (toRemove.length > 0) {
        await supabase
          .from('event_attendees')
          .delete()
          .eq('event_id', event.id)
          .in('member_id', toRemove)
      }

      if (toAdd.length > 0) {
        await supabase.from('event_attendees').insert(
          toAdd.map((memberId) => ({
            event_id: event.id,
            member_id: memberId,
            status: 'pending',
          }))
        )
      }
    } else {
      // Create event
      const { data: newEvent, error: eventError } = await supabase
        .from('events')
        .insert({
          family_id: familyId,
          title,
          description: description || null,
          location: location || null,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          all_day: allDay,
          created_by: currentMember.id,
        })
        .select()
        .single()

      if (eventError || !newEvent) {
        console.error('[v0] Error creating event:', eventError)
        setIsLoading(false)
        return
      }

      // Add attendees
      if (attendeeIds.length > 0) {
        await supabase.from('event_attendees').insert(
          attendeeIds.map((memberId) => ({
            event_id: newEvent.id,
            member_id: memberId,
            status: memberId === currentMember.id ? 'going' : 'pending',
          }))
        )
      }
    }

    setIsLoading(false)
    onSave()
    onClose()
  }

  const handleDelete = async () => {
    if (!event) return

    setIsLoading(true)
    const { error } = await supabase.from('events').delete().eq('id', event.id)

    if (error) {
      console.error('[v0] Error deleting event:', error)
    }

    setIsLoading(false)
    onSave()
    onClose()
  }

  const handleStatusChange = async (status: 'going' | 'not_going') => {
    if (!event) return

    const myAttendance = event.event_attendees.find(
      (a) => a.member_id === currentMember.id
    )

    if (!myAttendance) return

    await supabase
      .from('event_attendees')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', myAttendance.id)

    onSave()
  }

  const handleNoteChange = async (note: string) => {
    if (!event) return

    const myAttendance = event.event_attendees.find(
      (a) => a.member_id === currentMember.id
    )

    if (!myAttendance) return

    await supabase
      .from('event_attendees')
      .update({ note: note || null, updated_at: new Date().toISOString() })
      .eq('id', myAttendance.id)

    onSave()
  }

  const myAttendance = event?.event_attendees.find(
    (a) => a.member_id === currentMember.id
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] max-w-lg flex-col rounded-[1.75rem] border-2 bg-background p-5 shadow-yolk sm:p-6">
        <DialogHeader className="relative overflow-hidden rounded-3xl bg-secondary px-4 py-4">
          <FeedSpecks className="absolute right-16 top-1 opacity-60" />
          <ChickenMascot size={62} className="absolute -right-1 -top-1 rotate-6" />
          <div className="relative flex items-center gap-3 pr-12">
            {event ? (
              <ActivityBadge event={event} />
            ) : (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-muted bg-yolk text-2xl shadow-yolk">
                🐣
              </span>
            )}
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">
                {isEditing ? 'Plan details' : 'Add to the coop'}
              </p>
              <DialogTitle className="font-display text-2xl font-bold">{isEditing ? 'Edit plan' : 'New plan'}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2 rounded-full bg-muted p-1">
            <TabsTrigger value="details" className="rounded-full font-extrabold">Details</TabsTrigger>
            <TabsTrigger value="attendees" disabled={!isEditing} className="rounded-full font-extrabold">
              Responses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4 flex-1 space-y-4 overflow-y-auto pr-1">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title"
                className="rounded-2xl border-2 bg-card font-display text-lg font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-2xl border-2 bg-card font-bold"
                />
              </div>
              <div className="flex items-center space-x-2 self-end rounded-2xl bg-secondary px-3 py-2">
                <Switch
                  id="all-day"
                  checked={allDay}
                  onCheckedChange={setAllDay}
                />
                <Label htmlFor="all-day" className="font-bold">All day</Label>
              </div>
            </div>

            {!allDay && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time" className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Start time</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="rounded-2xl border-2 bg-card font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time" className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">End time</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="rounded-2xl border-2 bg-card font-bold"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="location" className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Add a location"
                className="rounded-2xl border-2 bg-card font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details"
                rows={2}
                className="rounded-2xl border-2 bg-card font-semibold"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Who's coming?</Label>
              <div className="space-y-2 rounded-3xl border-2 bg-card p-3">
                {familyMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3 rounded-2xl bg-secondary px-3 py-2">
                    <Checkbox
                      id={`member-${member.id}`}
                      checked={attendeeIds.includes(member.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setAttendeeIds([...attendeeIds, member.id])
                        } else {
                          setAttendeeIds(attendeeIds.filter((id) => id !== member.id))
                        }
                      }}
                    />
                    <label
                      htmlFor={`member-${member.id}`}
                      className="flex cursor-pointer items-center gap-2 text-sm font-bold"
                    >
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: member.color }}
                      />
                      {member.name}
                      {member.id === currentMember.id && ' (you)'}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="attendees" className="mt-4 flex-1 space-y-4 overflow-y-auto pr-1">
            {event && (
              <>
                {/* My response */}
                {myAttendance && (
                  <div className="space-y-3 rounded-3xl border-2 bg-card p-4">
                    <Label className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Your response</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={myAttendance.status === 'going' ? 'default' : 'outline'}
                        size="sm"
                        className="gap-2 rounded-full font-extrabold"
                        onClick={() => handleStatusChange('going')}
                      >
                        <Check className="h-4 w-4" />
                        Going
                      </Button>
                      <Button
                        variant={myAttendance.status === 'not_going' ? 'destructive' : 'outline'}
                        size="sm"
                        className="gap-2 rounded-full font-extrabold"
                        onClick={() => handleStatusChange('not_going')}
                      >
                        <X className="h-4 w-4" />
                        Not going
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1 text-xs font-extrabold">
                        <MessageSquare className="h-3 w-3" />
                        Add a note
                      </Label>
                      <Textarea
                        value={myAttendance.note || ''}
                        onChange={(e) => handleNoteChange(e.target.value)}
                        placeholder="e.g., I'll bring snacks!"
                        rows={2}
                        className="rounded-2xl border-2 bg-secondary text-sm font-semibold"
                      />
                    </div>
                  </div>
                )}

                {/* All responses */}
                <div className="space-y-2">
                  <Label className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">All responses</Label>
                  <div className="space-y-2">
                    {event.event_attendees.map((attendee) => (
                      <div
                        key={attendee.id}
                        className={cn(
                          'flex items-start gap-3 rounded-3xl border-2 bg-card p-3',
                          attendee.status === 'going' && 'bg-[#e4f1d6] border-[#7bb069]/40',
                          attendee.status === 'not_going' && 'bg-[#ffd9c2] border-[#ff8a3d]/40'
                        )}
                      >
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
                          style={{ backgroundColor: attendee.family_member.color }}
                        >
                          {attendee.family_member.name.charAt(0).toUpperCase()}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-display text-sm font-bold">
                              {attendee.family_member.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {attendee.status === 'going' && 'Going'}
                              {attendee.status === 'not_going' && 'Not going'}
                              {attendee.status === 'pending' && 'Pending'}
                            </span>
                          </div>
                          {attendee.note && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {attendee.note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex shrink-0 justify-between border-t-2 pt-4">
          {isEditing ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isLoading}
              className="rounded-full font-extrabold"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading} className="rounded-full border-2 bg-card font-extrabold">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading || !title.trim()} className="rounded-full bg-yolk font-extrabold text-primary-foreground shadow-yolk hover:brightness-105">
              {isLoading ? 'Saving...' : isEditing ? 'Save changes' : 'Create event'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
