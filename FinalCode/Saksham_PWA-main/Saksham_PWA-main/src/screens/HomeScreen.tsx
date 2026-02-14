import { useEffect, useMemo, useState } from 'react'
import { MapPin, Mic, Play, RefreshCcw } from 'lucide-react'
import type {
  EventRecord,
  LocationPoint,
  SyncQueueItem,
  Trainee,
  TrainingType,
} from '../types'
import { StatCard } from '../components/StatCard'
import { SectionHeader } from '../components/SectionHeader'
import { useVoiceInput } from '../hooks/useVoiceInput'

interface Props {
  instructorName: string
  events: EventRecord[]
  trainees: Trainee[]
  syncQueue: SyncQueueItem[]
  location?: LocationPoint | null
  online: boolean
  onStartEvent: (payload: {
    name: string
    trainingType: TrainingType
    locationName: string
    expected: number
    when: Date
    location?: LocationPoint | null
  }) => Promise<void>
}

type VoiceTarget = 'name' | 'location' | null

const trainingOptions: TrainingType[] = [
  'Fire Drill',
  'Earthquake Drill',
  'Flood Response',
  'Medical Emergency',
  'Evacuation',
  'Search & Rescue',
]

export function HomeScreen({
  instructorName,
  events,
  trainees,
  syncQueue,
  location,
  online,
  onStartEvent,
}: Props) {
  const [voiceTarget, setVoiceTarget] = useState<VoiceTarget>(null)
  const { listening, transcript, start, stop, supported, error } = useVoiceInput()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    trainingType: trainingOptions[1],
    locationName: '',
    expected: 30,
    when: new Date(),
  })

  useEffect(() => {
    if (!voiceTarget || !transcript) return
    setForm((prev) => ({
      ...prev,
      name: voiceTarget === 'name' ? transcript : prev.name,
      locationName: voiceTarget === 'location' ? transcript : prev.locationName,
    }))
  }, [transcript, voiceTarget])

  const stats = useMemo(() => {
    const activeEvents = events.filter((e) => e.status === 'active').length
    const present = trainees.filter((t) => t.status === 'present').length
    const pendingUploads = syncQueue.filter((s) => s.status === 'pending').length
    const photos = syncQueue.filter((s) => s.kind === 'photo').length
    return { activeEvents, present, pendingUploads, photos }
  }, [events, trainees, syncQueue])

  const recentEvents = [...events]
    .sort((a, b) => b.startTime - a.startTime)
    .slice(0, 5)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name) return
    setSubmitting(true)
    await onStartEvent({
      name: form.name,
      trainingType: form.trainingType as TrainingType,
      locationName: form.locationName || 'Unnamed site',
      expected: form.expected || 0,
      when: form.when,
      location,
    })
    setForm((prev) => ({ ...prev, name: '', locationName: '' }))
    setSubmitting(false)
  }

  const handleVoice = (target: VoiceTarget) => {
    if (!supported) return
    if (listening && voiceTarget === target) {
      stop()
      setVoiceTarget(null)
    } else {
      setVoiceTarget(target)
      start('hi-IN')
    }
  }

  return (
    <div className="space-y-6">
      <div className="glass-card mt-2 rounded-card px-5 py-4 shadow-card">
        <p className="text-sm text-gray-600">नमस्ते, {instructorName} 🙏</p>
        <h1 className="text-2xl font-bold text-gray-900">Ground Drill Dashboard</h1>
        <p className="text-sm text-gray-500">
          Offline-ready logging, GPS tagging, and voice-first inputs for NDMA drills.
        </p>
        {!online && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber px-3 py-1 text-xs font-semibold text-white">
            <RefreshCcw className="h-4 w-4" />
            Offline — will auto-sync when online
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Active Events Today"
          value={stats.activeEvents}
          sub="Across your assigned districts"
        />
        <StatCard
          title="Trainees Present"
          value={stats.present}
          sub="Based on attendance logs"
          tone="success"
        />
        <StatCard
          title="Photos Uploaded"
          value={stats.photos}
          sub="Pending + synced"
          tone="warning"
        />
        <StatCard
          title="Pending Syncs"
          value={stats.pendingUploads}
          sub={online ? 'Auto-sync in progress' : 'Queued for network'}
          tone={online ? 'default' : 'warning'}
        />
      </div>

      <section className="glass-card rounded-card border border-borderGray px-4 py-4 shadow-card">
        <SectionHeader title="Start New Event" subtitle="Voice-first & GPS tagged" />
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Event Name
            <div className="mt-1 flex items-center gap-2">
              <input
                required
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="h-12 w-full rounded-lg border-2 border-borderGray px-3 text-base focus:border-indianBlue focus:outline-none focus:ring-2 focus:ring-indianBlue/20"
                placeholder="e.g. Earthquake drill Gurgaon"
              />
              <button
                type="button"
                onClick={() => handleVoice('name')}
                className={`flex h-12 w-12 items-center justify-center rounded-full border ${
                  listening && voiceTarget === 'name'
                    ? 'border-dangerRed bg-dangerRed/10 text-dangerRed'
                    : 'border-borderGray text-gray-600'
                }`}
                aria-label="Voice input"
              >
                <Mic className="h-5 w-5" />
              </button>
            </div>
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Training Type
            <select
              value={form.trainingType}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  trainingType: e.target.value as TrainingType,
                }))
              }
              className="mt-1 h-12 w-full rounded-lg border-2 border-borderGray px-3 text-base focus:border-indianBlue focus:outline-none focus:ring-2 focus:ring-indianBlue/20"
            >
              {trainingOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block text-sm font-medium text-gray-700">
              Location Name
              <div className="mt-1 flex items-center gap-2">
                <input
                  value={form.locationName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, locationName: e.target.value }))
                  }
                  className="h-12 w-full rounded-lg border-2 border-borderGray px-3 text-base focus:border-indianBlue focus:outline-none focus:ring-2 focus:ring-indianBlue/20"
                  placeholder="Village / school / site"
                />
                <button
                  type="button"
                  onClick={() => handleVoice('location')}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border ${
                    listening && voiceTarget === 'location'
                      ? 'border-dangerRed bg-dangerRed/10 text-dangerRed'
                      : 'border-borderGray text-gray-600'
                  }`}
                  aria-label="Voice location"
                >
                  <Mic className="h-5 w-5" />
                </button>
              </div>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-medium text-gray-700">
                Expected Trainees
                <input
                  type="number"
                  min={0}
                  value={form.expected}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, expected: Number(e.target.value) }))
                  }
                  className="mt-1 h-12 w-full rounded-lg border-2 border-borderGray px-3 text-base focus:border-indianBlue focus:outline-none focus:ring-2 focus:ring-indianBlue/20"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Date & Time
                <input
                  type="datetime-local"
                  value={new Date(form.when).toISOString().slice(0, 16)}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      when: new Date(e.target.value),
                    }))
                  }
                  className="mt-1 h-12 w-full rounded-lg border-2 border-borderGray px-3 text-base focus:border-indianBlue focus:outline-none focus:ring-2 focus:ring-indianBlue/20"
                />
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-borderGray bg-slateBg px-3 py-3 text-sm text-gray-700">
            <MapPin className="h-5 w-5 text-indianBlue" />
            {location ? (
              <div>
                <p className="font-semibold">
                  GPS locked: {location.latitude.toFixed(4)}° N,{' '}
                  {location.longitude.toFixed(4)}° E
                </p>
                {location.accuracy && (
                  <p className="text-xs text-gray-500">Accuracy ±{location.accuracy} m</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Detecting GPS… enable location services</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-button bg-warm-gradient px-4 py-3 text-lg font-semibold text-white shadow-button transition active:scale-95"
          >
            <Play className="h-5 w-5" />
            {submitting ? 'Starting…' : 'Start Event'}
          </button>
          {supported ? (
            <p className="text-xs text-gray-500">
              🎙️ Voice ready: Hindi + English auto detection.{' '}
              {listening && 'Listening… speak clearly.'}
            </p>
          ) : (
            <p className="text-xs text-dangerRed">
              Voice input not supported on this device/browser.
            </p>
          )}
          {error && <p className="text-xs text-dangerRed">Voice error: {error}</p>}
        </form>
      </section>

      <section className="space-y-3">
        <SectionHeader title="Recent Events" subtitle="Last 5 records" />
        <div className="space-y-2">
          {recentEvents.map((evt) => (
            <div
              key={evt.id}
              className="flex items-center justify-between rounded-card border border-borderGray bg-white px-3 py-3 shadow-sm"
            >
              <div>
                <p className="text-lg font-semibold text-gray-900">{evt.name}</p>
                <p className="text-xs text-gray-500">
                  {evt.trainingType} • {evt.locationName}
                </p>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p className="font-semibold capitalize">{evt.status}</p>
                <p>{new Date(evt.startTime).toLocaleString()}</p>
              </div>
            </div>
          ))}
          {!recentEvents.length && (
            <div className="rounded-card border border-dashed border-borderGray bg-white px-4 py-4 text-sm text-gray-500">
              No events yet. Start the first drill to track live data.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
