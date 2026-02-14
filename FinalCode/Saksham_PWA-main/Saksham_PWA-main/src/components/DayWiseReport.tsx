import { useMemo, useState } from 'react'
import { CheckCircle2, FileText, MapPin, Upload } from 'lucide-react'
import type { LocationPoint } from '../types'

interface ReportPayload {
  dayIndex: number
  attendance: number
  notes: string
  files: FileList | null
}

interface Props {
  dayIndex: number
  startDate: string
  endDate: string
  allowedLocation: LocationPoint
  onSubmit: (payload: ReportPayload) => Promise<void> | void
}

export function DayWiseReport({ dayIndex, startDate, endDate, allowedLocation, onSubmit }: Props) {
  const [attendance, setAttendance] = useState(0)
  const [notes, setNotes] = useState('')
  const [files, setFiles] = useState<FileList | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [distance, setDistance] = useState<number | null>(null)

  const dayLabel = useMemo(() => `Day ${dayIndex + 1}`, [dayIndex])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const currentGps = await getCurrentLocation()
      const dist = validateGeofence(currentGps, allowedLocation)
      setDistance(dist)

      if (dist > 200) {
        setError('You are not at the training location. Submission rejected.')
        setSubmitting(false)
        return
      }

      await onSubmit({ dayIndex, attendance, notes, files })
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch location.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="space-y-3 rounded-card border border-borderGray bg-white px-4 py-3 shadow-card" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-800">{dayLabel}</p>
          <p className="text-xs text-gray-500">
            {new Date(startDate).toLocaleDateString()} — {new Date(endDate).toLocaleDateString()}
          </p>
        </div>
        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-successGreen flex items-center gap-1">
          <CheckCircle2 className="h-4 w-4" /> GPS validation on submit
        </span>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-800">Attendance Count</label>
        <input
          type="number"
          min={0}
          value={attendance}
          onChange={(e) => setAttendance(Number(e.target.value))}
          className="mt-1 h-12 w-full rounded-lg border-2 border-borderGray px-3 text-base focus:border-indianBlue focus:outline-none focus:ring-2 focus:ring-indianBlue/20"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <FileText className="h-4 w-4 text-indianBlue" />
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border-2 border-borderGray px-3 py-2 text-base focus:border-indianBlue focus:outline-none focus:ring-2 focus:ring-indianBlue/20"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <Upload className="h-4 w-4 text-indianBlue" />
          Photos / Media
        </label>
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={(e) => setFiles(e.target.files)}
          className="mt-1 w-full text-sm text-gray-700"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-borderGray bg-slateBg px-3 py-2 text-xs text-gray-800">
        <MapPin className="h-4 w-4 text-indianBlue" />
        Allowed location: {allowedLocation.latitude.toFixed(5)}° N, {allowedLocation.longitude.toFixed(5)}° E
        {distance !== null && (
          <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] text-amber-700">
            Current distance: {distance.toFixed(1)} m
          </span>
        )}
      </div>

      {error && <p className="text-xs font-semibold text-dangerRed">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-button bg-indianBlue px-4 py-3 text-sm font-semibold text-white shadow-button active:scale-95 disabled:opacity-60"
      >
        Submit Day Report
      </button>
    </form>
  )
}

async function getCurrentLocation(): Promise<LocationPoint> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation not supported'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords
        resolve({ latitude, longitude, accuracy })
      },
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 2000 },
    )
  })
}

export function validateGeofence(current: LocationPoint, allowed: LocationPoint): number {
  const distanceMeters = haversine(current, allowed)
  return distanceMeters
}

function haversine(a: LocationPoint, b: LocationPoint): number {
  const R = 6371000 // meters
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(b.latitude - a.latitude)
  const dLon = toRad(b.longitude - a.longitude)
  const lat1 = toRad(a.latitude)
  const lat2 = toRad(b.latitude)

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
  return R * c
}
