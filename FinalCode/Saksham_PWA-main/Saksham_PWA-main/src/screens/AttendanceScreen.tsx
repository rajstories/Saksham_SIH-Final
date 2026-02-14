import { useEffect, useMemo, useState } from 'react'
import { Mic, QrCode, Search, Users } from 'lucide-react'
import type { Trainee } from '../types'
import { SectionHeader } from '../components/SectionHeader'
import { useVoiceInput } from '../hooks/useVoiceInput'

interface Props {
  trainees: Trainee[]
  onMark: (id: string, status: Trainee['status']) => Promise<void>
  online: boolean
}

type Mode = 'manual' | 'qr'
type Filter = 'all' | 'present' | 'absent'

export function AttendanceScreen({ trainees, onMark, online }: Props) {
  const [mode, setMode] = useState<Mode>('manual')
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const { listening, transcript, start, stop, supported } = useVoiceInput()

  useEffect(() => {
    if (listening && transcript) setQuery(transcript)
  }, [listening, transcript])

  const filtered = useMemo(() => {
    return trainees.filter((t) => {
      const matchesQuery = t.name.toLowerCase().includes(query.toLowerCase())
      const matchesFilter =
        filter === 'all' ? true : filter === 'present' ? t.status === 'present' : t.status === 'absent'
      return matchesQuery && matchesFilter
    })
  }, [trainees, query, filter])

  const presentCount = trainees.filter((t) => t.status === 'present').length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-card bg-white px-3 py-3 shadow-card">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <Users className="h-5 w-5 text-indianBlue" />
          {presentCount}/{trainees.length} Present
          <span className="rounded-full bg-green-50 px-2 py-1 text-xs text-successGreen">
            {trainees.length ? Math.round((presentCount / trainees.length) * 100) : 0}%
          </span>
        </div>
        <div className="flex gap-2 text-xs text-gray-500">
          <button
            onClick={() => setMode('manual')}
            className={`rounded-full px-3 py-1 font-semibold ${
              mode === 'manual' ? 'bg-indianBlue text-white' : 'bg-slateBg'
            }`}
          >
            Manual
          </button>
          <button
            onClick={() => setMode('qr')}
            className={`rounded-full px-3 py-1 font-semibold ${
              mode === 'qr' ? 'bg-saffron text-white' : 'bg-slateBg'
            }`}
          >
            QR Scan
          </button>
        </div>
      </div>

      {mode === 'manual' ? (
        <section className="space-y-3">
          <div className="flex items-center gap-2 rounded-card border border-borderGray bg-white px-3 py-2 shadow-sm">
            <Search className="h-5 w-5 text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search trainee by name"
              className="h-10 flex-1 border-none bg-transparent text-sm focus:outline-none"
            />
            <button
              type="button"
              onClick={() => (listening ? stop() : start('hi-IN'))}
              className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                listening ? 'border-dangerRed bg-dangerRed/10 text-dangerRed' : 'border-borderGray'
              }`}
            >
              <Mic className="h-4 w-4" />
            </button>
          </div>
          {supported ? (
            <p className="text-xs text-gray-500">Voice search: Hindi or English names.</p>
          ) : (
            <p className="text-xs text-dangerRed">Voice search not supported.</p>
          )}

          <div className="flex gap-2">
            {(['all', 'present', 'absent'] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  filter === f
                    ? 'border-indianBlue bg-indianBlue text-white'
                    : 'border-borderGray bg-white text-gray-700'
                }`}
              >
                {f === 'all' ? 'All' : f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-card border border-borderGray bg-white px-3 py-3 shadow-sm"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">ID: {t.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      t.status === 'present'
                        ? 'bg-green-50 text-successGreen'
                        : t.status === 'absent'
                          ? 'bg-red-50 text-dangerRed'
                          : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {t.status}
                  </span>
                  <button
                    onClick={() => onMark(t.id, 'present')}
                    className="rounded-button bg-successGreen px-3 py-2 text-xs font-semibold text-white shadow-button"
                  >
                    Mark Present
                  </button>
                  <button
                    onClick={() => onMark(t.id, 'absent')}
                    className="rounded-button border border-borderGray px-3 py-2 text-xs font-semibold text-gray-700"
                  >
                    Mark Absent
                  </button>
                </div>
              </div>
            ))}
            {!filtered.length && (
              <div className="rounded-card border border-dashed border-borderGray bg-white px-3 py-4 text-sm text-gray-500">
                No trainees match your search.
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="rounded-card border border-borderGray bg-white px-4 py-4 text-center shadow-card">
          <SectionHeader
            title="QR Scan Mode"
            subtitle="Use camera overlay to mark presence in under 2 seconds"
            action={
              <span className="rounded-full bg-amber px-3 py-1 text-xs font-semibold text-white">
                Offline ready
              </span>
            }
          />
          <div className="mb-4 flex items-center justify-center">
            <div className="flex h-48 w-full max-w-sm flex-col items-center justify-center rounded-2xl border-2 border-dashed border-borderGray bg-slateBg text-gray-500">
              <QrCode className="h-12 w-12 text-indianBlue" />
              <p className="text-sm font-semibold text-gray-700">Scan QR Code</p>
              <p className="text-xs text-gray-500">Camera overlay with guide box</p>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            This is a UI stub. Wire html5-qrcode / instascan for fast QR reads and call
            markPresent(). Works offline & queues sync when online.
          </p>
        </section>
      )}

      {!online && (
        <div className="rounded-card border border-amber/50 bg-amber px-3 py-2 text-xs font-semibold text-white shadow">
          Offline mode — attendance changes are saved locally and queued.
        </div>
      )}
    </div>
  )
}
