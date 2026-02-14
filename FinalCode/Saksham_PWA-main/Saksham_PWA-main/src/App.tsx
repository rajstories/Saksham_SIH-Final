import { useEffect, useMemo, useState } from 'react'
import { Route, Switch, useLocation } from 'wouter'
import './index.css'
import { Header } from './components/Header'
import { BottomNav } from './components/BottomNav'
import { LogoMark } from './components/LogoMark'
import { MenuDrawer } from './components/MenuDrawer'
import { ChatFab } from './components/ChatFab'
import { ChatWidget } from './components/ChatWidget'
import { OfflineBanner } from './components/OfflineBanner'
import { HomeScreen } from './screens/HomeScreen'
import { EventScreen } from './screens/EventScreen'
import { AttendanceScreen } from './screens/AttendanceScreen'
import { MediaScreen } from './screens/MediaScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { CreateEventForm } from './components/CreateEventForm'
import { useOnlineStatus } from './hooks/useOnlineStatus'
import { registerServiceWorker } from './lib/sw'
import { useGeolocation } from './hooks/useGeolocation'
import { useVoiceInput } from './hooks/useVoiceInput'
import {
  addActivity,
  listActivities,
  listEvents,
  listMedia,
  listSyncQueue,
  listTrainees,
  seedDemoData,
  upsertEvent,
  updateTraineeStatus,
} from './lib/db'
import type {
  ActivityLog,
  EventRecord,
  MediaItem,
  Profile,
  SyncQueueItem,
  Trainee,
  TrainingType,
} from './types'

function App() {
  const online = useOnlineStatus()
  const geo = useGeolocation()
  const [, setLocation] = useLocation()
  const { transcript: globalTranscript } = useVoiceInput()

  const [events, setEvents] = useState<EventRecord[]>([])
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [media, setMedia] = useState<MediaItem[]>([])
  const [trainees, setTrainees] = useState<Trainee[]>([])
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([])
  const [activeEventId, setActiveEventId] = useState<string | null>(null)
  const [voiceNote, setVoiceNote] = useState('')
  const [profile, setProfile] = useState<Profile>({
    name: 'Amit Verma',
    id: 'NDMA-5471',
    phone: '+91 98765 43210',
    organization: 'NDMA',
    role: 'Ground Staff Instructor',
    language: 'English',
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    registerServiceWorker()
    ;(async () => {
      await seedDemoData()
      await loadData()
    })()
  }, [])

  useEffect(() => {
    if (globalTranscript) setVoiceNote(globalTranscript)
  }, [globalTranscript])

  useEffect(() => {
    if (activeEventId) {
      ;(async () => {
        setActivities(await listActivities(activeEventId))
        setMedia(await listMedia(activeEventId))
      })()
    }
  }, [activeEventId])

  const activeEvent = useMemo(
    () => events.find((e) => e.id === activeEventId) || events.find((e) => e.status === 'active'),
    [events, activeEventId],
  )

  const lastSynced = useMemo(() => {
    const done = syncQueue.filter((s) => s.status === 'done')
    if (!done.length) return undefined
    const latest = new Date(Math.max(...done.map((d) => d.updatedAt)))
    return latest.toLocaleTimeString()
  }, [syncQueue])

  const loadData = async () => {
    const evts = await listEvents()
    setEvents(evts)
    const active = evts.find((e) => e.status === 'active') || evts[0]
    setActiveEventId(active?.id || null)
    if (active?.id) {
      setActivities(await listActivities(active.id))
      setMedia(await listMedia(active.id))
    }
    setTrainees(await listTrainees())
    setSyncQueue(await listSyncQueue())
  }

  const handleStartEvent = async (payload: {
    name: string
    trainingType: TrainingType
    locationName: string
    expected: number
    when: Date
    location?: { latitude: number; longitude: number; accuracy?: number } | null
  }) => {
    const now = Date.now()
    const event: EventRecord = {
      id: `evt-${now}`,
      name: payload.name,
      trainingType: payload.trainingType,
      status: 'active',
      locationName: payload.locationName,
      expectedTrainees: payload.expected,
      location: payload.location || { latitude: 0, longitude: 0 },
      startTime: payload.when.getTime(),
      lastUpdated: now,
    }
    await upsertEvent(event)
    setEvents((prev) => [event, ...prev])
    setActiveEventId(event.id)
    setSyncQueue(await listSyncQueue())
  }

  const handleLogActivity = async (label: string) => {
    if (!activeEvent) return
    const now = Date.now()
    const activity: ActivityLog = {
      id: `act-${now}`,
      eventId: activeEvent.id,
      label,
      timestamp: now,
      location: geo.location || activeEvent.location,
    }
    await addActivity(activity)
    setActivities(await listActivities(activeEvent.id))
    setSyncQueue(await listSyncQueue())
    setVoiceNote('')
  }

  const handleMarkAttendance = async (id: string, status: Trainee['status']) => {
    await updateTraineeStatus(id, status)
    setTrainees(await listTrainees())
    setSyncQueue(await listSyncQueue())
  }

  const handleLanguageChange = (lang: string) => {
    setProfile((prev) => ({ ...prev, language: lang }))
  }

  const handleCreateEvent = async (payload: {
    title: string
    description: string
    trainingType: TrainingType
    startDate: string
    endDate: string
    traineeCount: number
    locationName: string
    allowedLocation: { latitude: number; longitude: number; accuracy?: number }
  }) => {
    const now = Date.now()
    const start = new Date(payload.startDate).getTime()
    const end = new Date(payload.endDate).getTime()
    const event: EventRecord = {
      id: `evt-${now}`,
      name: payload.title,
      trainingType: payload.trainingType,
      status: 'active',
      locationName: payload.locationName || 'Unnamed site',
      expectedTrainees: payload.traineeCount,
      location: payload.allowedLocation,
      allowedLocation: payload.allowedLocation,
      startTime: start,
      endTime: end > start ? end : start + 60 * 60 * 1000,
      lastUpdated: now,
      description: payload.description,
    }
    await upsertEvent(event)
    await loadData()
    setActiveEventId(event.id)
    setLocation('/events')
  }

  const handleDayReport = async ({
    dayIndex,
    attendance,
    notes,
  }: {
    dayIndex: number
    attendance: number
    notes: string
  }) => {
    if (!activeEvent) return
    const now = Date.now()
    const label = `Day ${dayIndex + 1} report: ${attendance} present. ${notes || ''}`
    const activity: ActivityLog = {
      id: `act-${now}`,
      eventId: activeEvent.id,
      label,
      timestamp: now,
      location: geo.location || activeEvent.location,
    }
    await addActivity(activity)
    setActivities(await listActivities(activeEvent.id))
    setSyncQueue(await listSyncQueue())
  }

  const contentPadding = online ? 'pt-[76px]' : 'pt-[120px]'

  return (
    <div className="pb-28">
      <Header
        online={online}
        pendingSyncs={syncQueue.filter((s) => s.status === 'pending').length}
        lastSynced={lastSynced}
        onMenuToggle={() => setMenuOpen((v) => !v)}
      />
      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onLogout={() => {
          setProfile((prev) => ({ ...prev, name: 'Guest', id: 'NDMA-0000' }))
          setEvents([])
          setActiveEventId(null)
        }}
      />
      <OfflineBanner visible={!online} />
      <main className={`relative mx-auto max-w-5xl px-4 ${contentPadding}`}>
        <div className="pointer-events-none fixed bottom-10 right-6 -z-10 opacity-5">
          <LogoMark size={420} />
        </div>
        <Switch>
          <Route path="/">
            <HomeScreen
              instructorName={profile.name}
              events={events}
              trainees={trainees}
              syncQueue={syncQueue}
              location={geo.location}
              online={online}
              onStartEvent={handleStartEvent}
            />
          </Route>
          <Route path="/events">
            <EventScreen
              event={activeEvent || undefined}
              activities={activities}
              onLogActivity={handleLogActivity}
              onSelectEvent={(id) => setActiveEventId(id)}
              events={events}
              onDayReport={handleDayReport}
            />
          </Route>
          <Route path="/events/new">
            <div className="mt-4 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Create Training Event</h2>
              <p className="text-sm text-gray-600">
                Capture title, dates, trainees, and lock the allowed GPS location (geofence).
              </p>
              <CreateEventForm
                currentLocation={geo.location}
                onSubmit={handleCreateEvent}
                onGeocodeLocation={async () => geo.location || null}
              />
            </div>
          </Route>
          <Route path="/attendance">
            <AttendanceScreen
              trainees={trainees}
              onMark={handleMarkAttendance}
              online={online}
            />
          </Route>
          <Route path="/media">
            <MediaScreen media={media} />
          </Route>
          <Route path="/profile">
            <ProfileScreen profile={profile} onLanguageChange={handleLanguageChange} />
          </Route>
        </Switch>
      </main>

      {voiceNote && (
        <div className="fixed bottom-36 left-4 right-4 z-30 rounded-card border border-borderGray bg-white px-4 py-3 shadow-card">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-gray-500">आपने कहा / You said</p>
              <p className="text-sm font-semibold text-gray-900">{voiceNote}</p>
            </div>
            <button
              onClick={() => handleLogActivity(voiceNote)}
              className="rounded-button bg-successGreen px-3 py-2 text-xs font-semibold text-white shadow-button"
            >
              Save to Timeline
            </button>
          </div>
          <button
            onClick={() => setVoiceNote('')}
            className="mt-2 text-xs font-semibold text-gray-500 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <ChatFab open={chatOpen} onToggle={() => setChatOpen((v) => !v)} />
      <ChatWidget open={chatOpen} onClose={() => setChatOpen(false)} />
      <BottomNav />
    </div>
  )
}

export default App
