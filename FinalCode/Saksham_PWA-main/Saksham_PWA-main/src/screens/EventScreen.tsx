import { useEffect, useMemo, useRef, useState } from 'react'
import { Activity, FileEdit, Mic, StickyNote, Timer } from 'lucide-react'
import type { ActivityLog, EventRecord } from '../types'
import { SectionHeader } from '../components/SectionHeader'
import { useVoiceInput } from '../hooks/useVoiceInput'
import { DayWiseReport } from '../components/DayWiseReport'

interface Props {
  event?: EventRecord
  activities: ActivityLog[]
  onLogActivity: (label: string) => Promise<void>
  events: EventRecord[]
  onSelectEvent: (id: string) => void
  onDayReport: (args: { dayIndex: number; attendance: number; notes: string }) => Promise<void> | void
}

export function EventScreen({
  event,
  activities,
  onLogActivity,
  events,
  onSelectEvent,
  onDayReport,
}: Props) {
  const { listening, transcript, start, stop, supported } = useVoiceInput()
  const [activityText, setActivityText] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [notesOpen, setNotesOpen] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [notes, setNotes] = useState<string[]>([])

  useEffect(() => {
    if (listening && transcript) {
      setActivityText(transcript)
    }
  }, [listening, transcript])

  useEffect(() => {
    if (event) {
      const saved = localStorage.getItem(`notes-${event.id}`)
      if (saved) {
        try {
          setNotes(JSON.parse(saved))
        } catch {
          setNotes([])
        }
      } else {
        setNotes([])
      }
    }
  }, [event])

  const saveNotes = (next: string[]) => {
    if (!event) return
    setNotes(next)
    localStorage.setItem(`notes-${event.id}`, JSON.stringify(next))
  }

  const days = useMemo(() => {
    if (!event) return []
    const start = event.startTime
    const end = event.endTime || event.startTime
    const dayCount = Math.max(1, Math.ceil((end - start) / (24 * 60 * 60 * 1000)))
    return Array.from({ length: dayCount })
  }, [event])

  if (!event) {
    return (
      <div className="space-y-3">
        <SectionHeader title="Events" subtitle="Select or create an event" />
        <div className="rounded-card border border-dashed border-borderGray bg-white px-4 py-6 text-center text-sm text-gray-500">
          Start or select an event to view timeline and reports.
        </div>
        <div className="space-y-2">
          {events.map((evt) => (
            <button
              key={evt.id}
              onClick={() => onSelectEvent(evt.id)}
              className="flex w-full items-center justify-between rounded-card border border-borderGray bg-white px-3 py-3 text-left shadow-sm"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">{evt.name}</p>
                <p className="text-xs text-gray-500">
                  {evt.trainingType} • {evt.locationName}
                </p>
              </div>
              <span className="text-xs font-semibold capitalize text-gray-600">{evt.status}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const durationMinutes = Math.floor((Date.now() - event.startTime) / (1000 * 60))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activityText.trim()) return
    await onLogActivity(activityText)
    setActivityText('')
  }

  const handleAddNote = () => {
    if (!noteText.trim()) return
    const next = [noteText.trim(), ...notes]
    saveNotes(next)
    setNoteText('')
    setNotesOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-card border border-borderGray bg-white px-4 py-4 shadow-card">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {events.map((evt) => (
            <button
              key={evt.id}
              onClick={() => onSelectEvent(evt.id)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                evt.id === event.id
                  ? 'border-indianBlue bg-indianBlue text-white'
                  : 'border-borderGray bg-slateBg text-gray-700'
              }`}
            >
              {evt.name}
            </button>
          ))}
        </div>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-successGreen flex items-center gap-2">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-successGreen" />
              Active
            </p>
            <h2 className="text-2xl font-bold text-gray-900">{event.name}</h2>
            <p className="text-sm text-gray-600">
              {event.trainingType} • {event.locationName}
            </p>
          </div>
          <div className="rounded-xl bg-slateBg px-3 py-2 text-xs text-gray-600">
            <p className="font-semibold text-gray-800 flex items-center gap-1">
              <Timer className="h-4 w-4 text-indianBlue" /> {durationMinutes} mins
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Log Activity', icon: FileEdit, tone: 'bg-warm-gradient', onClick: () => inputRef.current?.focus() },
          { label: 'Add Notes', icon: StickyNote, tone: 'bg-amber text-white', onClick: () => setNotesOpen(true) },
        ].map((card) => (
          <button
            key={card.label}
            type="button"
            onClick={card.onClick}
            className={`rounded-card px-3 py-4 text-center text-sm font-semibold text-white shadow-card ${card.tone}`}
          >
            <card.icon className="mx-auto mb-2 h-6 w-6" />
            {card.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-card border border-borderGray bg-white px-3 py-3 shadow-card"
      >
        <SectionHeader
          title="Log Activity"
          subtitle="Voice or type to add to timeline"
          action={
            <button
              type="button"
              onClick={() => (listening ? stop() : start('hi-IN'))}
              className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                listening ? 'border-dangerRed bg-dangerRed/10 text-dangerRed' : 'border-borderGray'
              }`}
            >
              <Mic className="h-5 w-5" />
            </button>
          }
        />
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            value={activityText}
            onChange={(e) => setActivityText(e.target.value)}
            placeholder="e.g., Search & rescue team deployed to east wing"
            className="h-12 flex-1 rounded-lg border-2 border-borderGray px-3 text-base focus:border-indianBlue focus:outline-none focus:ring-2 focus:ring-indianBlue/20"
          />
          <button
            type="submit"
            className="h-12 rounded-button bg-indianBlue px-5 text-white shadow-button active:scale-95"
          >
            Save
          </button>
        </div>
        {supported ? (
          <p className="mt-1 text-xs text-gray-500">
            🎙️ {listening ? 'Listening…' : 'Tap mic to dictate (Hindi/English)'}
          </p>
        ) : (
          <p className="mt-1 text-xs text-dangerRed">Voice not supported.</p>
        )}
      </form>

      <section className="space-y-2">
        <SectionHeader title="Event Timeline" subtitle="Chronological activity log" />
        <div className="space-y-2">
          {activities.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between rounded-card border border-borderGray bg-white px-3 py-3 shadow-sm"
            >
              <div className="flex gap-3">
                <div className="mt-1 h-10 w-10 rounded-full bg-amber/10 text-amber-700 flex items-center justify-center">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Timer className="h-4 w-4" />
                    {new Date(item.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {!activities.length && (
            <div className="rounded-card border border-dashed border-borderGray bg-white px-3 py-4 text-sm text-gray-500">
              No activities yet. Log the first update.
            </div>
          )}
        </div>
      </section>

      <section className="space-y-2">
        <SectionHeader title="Day-wise Reports" subtitle="Submit attendance, photos, notes with geofence validation" />
        {days.map((_, idx) => (
          <DayWiseReport
            key={idx}
            dayIndex={idx}
            startDate={new Date(event.startTime + idx * 24 * 60 * 60 * 1000).toISOString()}
            endDate={new Date((event.endTime || event.startTime) + idx * 24 * 60 * 60 * 1000).toISOString()}
            allowedLocation={event.allowedLocation || event.location}
            onSubmit={({ dayIndex, attendance, notes }) =>
              onDayReport({ dayIndex, attendance, notes })
            }
          />
        ))}
      </section>

      {notesOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-card">
            <SectionHeader title="Add Personal Note" subtitle={event.name} />
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={4}
              className="w-full rounded-lg border-2 border-borderGray px-3 py-2 text-base focus:border-indianBlue focus:outline-none focus:ring-2 focus:ring-indianBlue/20"
              placeholder="Type your note here"
            />
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setNotesOpen(false)}
                className="rounded-button border border-borderGray px-4 py-2 text-sm font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddNote}
                className="rounded-button bg-indianBlue px-4 py-2 text-sm font-semibold text-white shadow-button disabled:opacity-60"
                disabled={!noteText.trim()}
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {!!notes.length && (
        <section className="space-y-2">
          <SectionHeader title="Saved Notes" subtitle="Private notes for this event (local only)" />
          <div className="space-y-2">
            {notes.map((note, idx) => (
              <div
                key={`${note}-${idx}`}
                className="rounded-card border border-borderGray bg-white px-3 py-3 text-sm text-gray-800 shadow-sm"
              >
                {note}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
