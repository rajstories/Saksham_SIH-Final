import { useEffect, useState } from 'react'
import { CalendarRange, MapPin, Mic, Navigation, Target } from 'lucide-react'
import type { LocationPoint, TrainingType } from '../types'
import { useVoiceInput } from '../hooks/useVoiceInput'

interface Props {
  currentLocation?: LocationPoint | null
  onSubmit: (payload: {
    title: string
    description: string
    trainingType: TrainingType
    startDate: string
    endDate: string
    traineeCount: number
    locationName: string
    allowedLocation: LocationPoint
  }) => void | Promise<void>
  onGeocodeLocation?: (text: string) => Promise<LocationPoint | null>
}

const trainingOptions: TrainingType[] = [
  'Earthquake Drill',
  'Flood Response',
  'Fire Drill',
  'Evacuation',
]

export function CreateEventForm({ currentLocation, onSubmit, onGeocodeLocation }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [trainingType, setTrainingType] = useState<TrainingType>('Earthquake Drill')
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().slice(0, 16))
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().slice(0, 16))
  const [traineeCount, setTraineeCount] = useState(0)
  const [locationName, setLocationName] = useState('')
  const [allowedLocation, setAllowedLocation] = useState<LocationPoint | null>(null)
  const [locStatus, setLocStatus] = useState<string>('Waiting for location…')
  const [submitting, setSubmitting] = useState(false)
  const [formMessage, setFormMessage] = useState<string | null>(null)
  const { listening, start, stop, transcript, supported } = useVoiceInput()

  useEffect(() => {
    if (listening && transcript) setLocationName(transcript)
  }, [listening, transcript])

  useEffect(() => {
    if (currentLocation && !allowedLocation) {
      setAllowedLocation(currentLocation)
      setLocStatus('GPS locked at current position')
    }
  }, [currentLocation, allowedLocation])

  const handleLocationConfirm = async () => {
    setLocStatus('Capturing location…')
    if (onGeocodeLocation && locationName.trim()) {
      const geo = await onGeocodeLocation(locationName.trim())
      if (geo) {
        setAllowedLocation(geo)
        setLocStatus('Location resolved from text')
        return
      }
    }
    if (currentLocation) {
      setAllowedLocation(currentLocation)
      setLocStatus('Locked to current GPS (fallback)')
    } else {
      setLocStatus('Unable to capture location. Enable GPS.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!allowedLocation) {
      setLocStatus('Capture location before creating event.')
      return
    }
    setSubmitting(true)
    setFormMessage(null)
    try {
      await onSubmit({
        title,
        description,
        trainingType,
        startDate,
        endDate,
        traineeCount,
        locationName,
        allowedLocation,
      })
      setFormMessage('Event created. Redirecting…')
    } catch (err: any) {
      setFormMessage(err?.message || 'Failed to create event.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div>
        <label className="text-sm font-semibold text-gray-800">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 h-12 w-full rounded-lg border-2 border-borderGray px-3 text-base focus:border-indianBlue focus:outline-none focus:ring-2 focus:ring-indianBlue/20"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-800">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border-2 border-borderGray px-3 py-2 text-base focus:border-indianBlue focus:outline-none focus:ring-2 focus:ring-indianBlue/20"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-gray-800">Training Type</label>
          <select
            value={trainingType}
            onChange={(e) => setTrainingType(e.target.value as TrainingType)}
            className="mt-1 h-12 w-full rounded-lg border-2 border-borderGray px-3 text-base focus:border-indianBlue focus:outline-none focus:ring-2 focus:ring-indianBlue/20"
          >
            {trainingOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt.replace('Drill', '').trim() || opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-800">Trainee Count</label>
          <input
            type="number"
            min={0}
            value={traineeCount}
            onChange={(e) => setTraineeCount(Number(e.target.value))}
            className="mt-1 h-12 w-full rounded-lg border-2 border-borderGray px-3 text-base focus:border-indianBlue focus:outline-none focus:ring-2 focus:ring-indianBlue/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <CalendarRange className="h-4 w-4 text-indianBlue" />
            Start Date
          </label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 h-12 w-full rounded-lg border-2 border-borderGray px-3 text-base focus:border-indianBlue focus:outline-none focus:ring-2 focus:ring-indianBlue/20"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <CalendarRange className="h-4 w-4 text-indianBlue" />
            End Date
          </label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 h-12 w-full rounded-lg border-2 border-borderGray px-3 text-base focus:border-indianBlue focus:outline-none focus:ring-2 focus:ring-indianBlue/20"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-indianBlue" />
          Target Location (allowed)
        </label>
        <div className="mt-1 flex items-center gap-2">
          <input
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="District 4 Community Hall"
            className="h-12 flex-1 rounded-lg border-2 border-borderGray px-3 text-base focus:border-indianBlue focus:outline-none focus:ring-2 focus:ring-indianBlue/20"
          />
          <button
            type="button"
            onClick={() => (listening ? stop() : start('hi-IN'))}
            className={`flex h-12 w-12 items-center justify-center rounded-full border ${
              listening ? 'border-dangerRed bg-dangerRed/10 text-dangerRed' : 'border-borderGray'
            }`}
            title="Voice location"
          >
            <Mic className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleLocationConfirm}
            className="flex items-center gap-2 rounded-button bg-indianBlue px-3 py-2 text-xs font-semibold text-white shadow-button active:scale-95"
          >
            <Navigation className="h-4 w-4" />
            Capture location
          </button>
          {currentLocation && (
            <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-successGreen">
              GPS ready
            </span>
          )}
          <span className="text-xs text-gray-600">{locStatus}</span>
        </div>
        {allowedLocation && (
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-borderGray bg-slateBg px-3 py-2 text-xs text-gray-800">
            <Target className="h-4 w-4 text-indianBlue" />
            Locked: {allowedLocation.latitude.toFixed(5)}° N, {allowedLocation.longitude.toFixed(5)}° E
            {allowedLocation.accuracy && (
              <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] text-successGreen">
                ±{Math.round(allowedLocation.accuracy)} m
              </span>
            )}
          </div>
        )}
        {!supported && (
          <p className="mt-1 text-xs text-dangerRed">Voice input not supported on this browser.</p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-button bg-warm-gradient px-4 py-3 text-lg font-semibold text-white shadow-button active:scale-95 disabled:opacity-60"
      >
        {submitting ? 'Creating…' : 'Create Training Event'}
      </button>
      {formMessage && (
        <p className="text-sm font-semibold text-gray-700">{formMessage}</p>
      )}
    </form>
  )
}
