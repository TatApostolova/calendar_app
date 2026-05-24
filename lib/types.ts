export interface Family {
  id: string
  name: string
  ical_url: string | null
  last_synced_at: string | null
  created_at: string
}

export interface FamilyMember {
  id: string
  family_id: string
  user_id: string | null
  name: string
  email: string | null
  color: string
  is_admin: boolean
  created_at: string
}

export interface Event {
  id: string
  family_id: string
  ical_uid: string | null
  title: string
  description: string | null
  start_time: string
  end_time: string
  location: string | null
  all_day: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface EventAttendee {
  id: string
  event_id: string
  member_id: string
  status: 'pending' | 'going' | 'not_going'
  note: string | null
  created_at: string
  updated_at: string
}

// Extended types with joins
export interface EventWithAttendees extends Event {
  event_attendees: (EventAttendee & { family_member: FamilyMember })[]
  creator?: FamilyMember
}

export interface AttendeeWithMember extends EventAttendee {
  family_member: FamilyMember
}

export interface Invitation {
  id: string
  family_id: string
  email: string
  invited_by: string
  token: string
  member_name: string
  member_color: string
  accepted_at: string | null
  created_at: string
}

export interface InvitationWithFamily extends Invitation {
  family: Family
  inviter: FamilyMember
}
