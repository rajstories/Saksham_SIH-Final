export type TrainingType =
  | 'Fire Drill'
  | 'Earthquake Drill'
  | 'Flood Response'
  | 'Medical Emergency'
  | 'Evacuation'
  | 'Search & Rescue'
  | 'General Drill'

export type EventStatus = 'scheduled' | 'active' | 'completed'

export interface LocationPoint {
  latitude: number
  longitude: number
  accuracy?: number
}

export interface EventRecord {
  id: string
  name: string
  trainingType: TrainingType
  status: EventStatus
  locationName: string
  location: LocationPoint
  allowedLocation?: LocationPoint
  description?: string
  endTime?: number
  expectedTrainees: number
  startTime: number
  lastUpdated: number
  // day-wise reports would be stored separately; keep space for future
}

export interface ActivityLog {
  id: string
  eventId: string
  label: string
  timestamp: number
  location?: LocationPoint
}

export interface Trainee {
  id: string
  name: string
  photo?: string
  status: 'present' | 'absent' | 'pending'
  lastSeen?: number
}

export interface MediaItem {
  id: string
  eventId: string
  type: 'photo' | 'video'
  uri: string
  status: 'pending' | 'synced' | 'failed'
  timestamp: number
  location?: LocationPoint
  sizeKb?: number
}

export interface SyncQueueItem {
  id: string
  kind: 'event' | 'photo' | 'attendance' | 'activity'
  refId: string
  status: 'pending' | 'syncing' | 'failed' | 'done'
  retries: number
  updatedAt: number
}

export interface Profile {
  name: string
  id: string
  phone: string
  organization: string
  role: string
  language: string
}
