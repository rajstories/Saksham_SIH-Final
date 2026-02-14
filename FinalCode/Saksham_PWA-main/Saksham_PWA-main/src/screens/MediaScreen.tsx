import { Camera, Film, ImageUp, RefreshCcw, Upload } from 'lucide-react'
import type { MediaItem } from '../types'
import { SectionHeader } from '../components/SectionHeader'

interface Props {
  media: MediaItem[]
}

export function MediaScreen({ media }: Props) {
  const pending = media.filter((m) => m.status === 'pending')
  const synced = media.filter((m) => m.status === 'synced')

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Camera', icon: Camera, tone: 'bg-indianBlue text-white' },
          { label: 'Gallery', icon: ImageUp, tone: 'bg-saffron text-white' },
          { label: 'Video (2m)', icon: Film, tone: 'bg-successGreen text-white' },
        ].map((item) => (
          <button
            key={item.label}
            className={`flex flex-col items-center justify-center rounded-card px-3 py-4 text-center text-sm font-semibold shadow-card ${item.tone}`}
          >
            <item.icon className="h-6 w-6" />
            {item.label}
          </button>
        ))}
      </div>

      <section className="rounded-card border border-borderGray bg-white px-3 py-3 shadow-card">
        <SectionHeader
          title="Upload Queue"
          subtitle="Pending uploads auto-sync when online"
          action={
            <button className="flex items-center gap-2 rounded-full border border-borderGray px-3 py-1 text-xs font-semibold text-gray-700">
              <RefreshCcw className="h-4 w-4" />
              Retry Failed
            </button>
          }
        />
        <div className="space-y-2">
          {pending.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-card border border-borderGray bg-slateBg px-3 py-2"
            >
              <div className="flex items-center gap-2 text-sm">
                <Upload className="h-4 w-4 text-indianBlue" />
                <span className="font-semibold text-gray-800">
                  {item.type.toUpperCase()} • {new Date(item.timestamp).toLocaleTimeString()}
                </span>
                {item.sizeKb && (
                  <span className="text-xs text-gray-500">{item.sizeKb} KB</span>
                )}
              </div>
              <span className="text-xs font-semibold text-amber-700">Pending</span>
            </div>
          ))}
          {!pending.length && (
            <div className="rounded-card border border-dashed border-borderGray bg-white px-3 py-3 text-sm text-gray-500">
              No pending uploads.
            </div>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeader title="Media Gallery" subtitle="Recent captures (tap to preview)" />
        <div className="grid grid-cols-3 gap-2">
          {synced.map((item) => (
            <div
              key={item.id}
              className="group relative h-28 overflow-hidden rounded-xl border border-borderGray bg-slateBg"
            >
              <img
                src={item.uri}
                alt="Media"
                className="h-full w-full object-cover transition group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="absolute bottom-1 left-1 rounded-full bg-black/60 px-2 py-1 text-[10px] text-white">
                {new Date(item.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
          {!synced.length && (
            <div className="col-span-3 rounded-card border border-dashed border-borderGray bg-white px-3 py-3 text-sm text-gray-500">
              No media yet. Capture photos or videos to see them here.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
