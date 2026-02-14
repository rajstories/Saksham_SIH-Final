import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type {
  ActivityLog,
  EventRecord,
  MediaItem,
  SyncQueueItem,
  Trainee,
} from '../types'

interface SakshamDB extends DBSchema {
  events: {
    key: string
    value: EventRecord
  }
  activities: {
    key: string
    value: ActivityLog
    indexes: { byEvent: string }
  }
  trainees: {
    key: string
    value: Trainee
  }
  media: {
    key: string
    value: MediaItem
    indexes: { byEvent: string }
  }
  syncQueue: {
    key: string
    value: SyncQueueItem
    indexes: { byKind: string }
  }
}

const DB_NAME = 'saksham-db'
const DB_VERSION = 1

let cachedDb: IDBPDatabase<SakshamDB> | null = null

async function getDb() {
  if (cachedDb) return cachedDb
  cachedDb = await openDB<SakshamDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('events')) {
        db.createObjectStore('events', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('activities')) {
        const store = db.createObjectStore('activities', { keyPath: 'id' })
        store.createIndex('byEvent', 'eventId')
      }
      if (!db.objectStoreNames.contains('trainees')) {
        db.createObjectStore('trainees', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('media')) {
        const store = db.createObjectStore('media', { keyPath: 'id' })
        store.createIndex('byEvent', 'eventId')
      }
      if (!db.objectStoreNames.contains('syncQueue')) {
        const store = db.createObjectStore('syncQueue', { keyPath: 'id' })
        store.createIndex('byKind', 'kind')
      }
    },
  })
  return cachedDb
}

export async function upsertEvent(event: EventRecord) {
  const db = await getDb()
  await db.put('events', event)
  await enqueueSync({
    id: `sync-${event.id}`,
    kind: 'event',
    refId: event.id,
    status: 'pending',
    retries: 0,
    updatedAt: Date.now(),
  })
}

export async function listEvents() {
  const db = await getDb()
  return db.getAll('events')
}

export async function listActivities(eventId: string) {
  const db = await getDb()
  return db.getAllFromIndex('activities', 'byEvent', eventId)
}

export async function addActivity(activity: ActivityLog) {
  const db = await getDb()
  await db.put('activities', activity)
  await enqueueSync({
    id: `sync-act-${activity.id}`,
    kind: 'activity',
    refId: activity.id,
    status: 'pending',
    retries: 0,
    updatedAt: Date.now(),
  })
}

export async function listMedia(eventId: string) {
  const db = await getDb()
  return db.getAllFromIndex('media', 'byEvent', eventId)
}

export async function addMedia(item: MediaItem) {
  const db = await getDb()
  await db.put('media', item)
  await enqueueSync({
    id: `sync-media-${item.id}`,
    kind: 'photo',
    refId: item.id,
    status: 'pending',
    retries: 0,
    updatedAt: Date.now(),
  })
}

export async function setTrainees(trainees: Trainee[]) {
  const db = await getDb()
  const tx = db.transaction('trainees', 'readwrite')
  for (const t of trainees) {
    tx.store.put(t)
  }
  await tx.done
}

export async function listTrainees() {
  const db = await getDb()
  return db.getAll('trainees')
}

export async function updateTraineeStatus(id: string, status: Trainee['status']) {
  const db = await getDb()
  const trainee = await db.get('trainees', id)
  if (!trainee) return
  trainee.status = status
  trainee.lastSeen = Date.now()
  await db.put('trainees', trainee)
  await enqueueSync({
    id: `sync-att-${id}`,
    kind: 'attendance',
    refId: id,
    status: 'pending',
    retries: 0,
    updatedAt: Date.now(),
  })
}

export async function enqueueSync(item: SyncQueueItem) {
  const db = await getDb()
  await db.put('syncQueue', item)
}

export async function listSyncQueue() {
  const db = await getDb()
  return db.getAll('syncQueue')
}

export async function seedDemoData() {
  const db = await getDb()
  const existing = await db.getAll('events')
  if (existing.length) return

  const now = Date.now()
  const demoEvent: EventRecord = {
    id: 'evt-001',
    name: 'Earthquake Drill - Gurgaon',
    trainingType: 'Earthquake Drill',
    status: 'active',
    locationName: 'Sector 45 Community Hall',
    location: { latitude: 28.4595, longitude: 77.0266, accuracy: 12 },
    allowedLocation: { latitude: 28.4595, longitude: 77.0266, accuracy: 12 },
    expectedTrainees: 30,
    startTime: now - 45 * 60 * 1000,
    endTime: now + 3 * 60 * 60 * 1000,
    lastUpdated: now - 2 * 60 * 1000,
  }

  const activities: ActivityLog[] = [
    {
      id: 'act-1',
      eventId: demoEvent.id,
      label: 'Briefing trainees and assigning roles',
      timestamp: now - 40 * 60 * 1000,
      location: demoEvent.location,
    },
    {
      id: 'act-2',
      eventId: demoEvent.id,
      label: 'Evacuation drill initiated',
      timestamp: now - 25 * 60 * 1000,
      location: demoEvent.location,
    },
    {
      id: 'act-3',
      eventId: demoEvent.id,
      label: 'First-aid triage checkpoint setup',
      timestamp: now - 10 * 60 * 1000,
      location: demoEvent.location,
    },
  ]

  const trainees: Trainee[] = Array.from({ length: 12 }).map((_, idx) => ({
    id: `T-${100 + idx}`,
    name: idx % 3 === 0 ? 'राम कुमार' : `Trainee ${idx + 1}`,
    status: idx % 4 === 0 ? 'absent' : 'present',
    lastSeen: now - idx * 5 * 60 * 1000,
  }))

  const media: MediaItem[] = [
    {
      id: 'media-1',
      eventId: demoEvent.id,
      type: 'photo',
      uri: '/placeholder-photo.png',
      status: 'pending',
      timestamp: now - 15 * 60 * 1000,
      location: demoEvent.location,
      sizeKb: 420,
    },
    {
      id: 'media-2',
      eventId: demoEvent.id,
      type: 'photo',
      uri: '/placeholder-photo.png',
      status: 'synced',
      timestamp: now - 35 * 60 * 1000,
      location: demoEvent.location,
      sizeKb: 380,
    },
  ]

  const syncQueue: SyncQueueItem[] = [
    {
      id: 'sync-evt-001',
      kind: 'event',
      refId: demoEvent.id,
      status: 'pending',
      retries: 0,
      updatedAt: now - 5 * 60 * 1000,
    },
    {
      id: 'sync-media-1',
      kind: 'photo',
      refId: 'media-1',
      status: 'pending',
      retries: 1,
      updatedAt: now - 3 * 60 * 1000,
    },
  ]

  const tx = db.transaction(
    ['events', 'activities', 'trainees', 'media', 'syncQueue'],
    'readwrite',
  )
  tx.objectStore('events').put(demoEvent)
  activities.forEach((act) => tx.objectStore('activities').put(act))
  trainees.forEach((t) => tx.objectStore('trainees').put(t))
  media.forEach((m) => tx.objectStore('media').put(m))
  syncQueue.forEach((s) => tx.objectStore('syncQueue').put(s))
  await tx.done
}
