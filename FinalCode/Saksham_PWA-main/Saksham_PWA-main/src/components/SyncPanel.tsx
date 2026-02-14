import { RefreshCcw, Wifi } from 'lucide-react'
import type { SyncQueueItem } from '../types'

interface Props {
  syncQueue: SyncQueueItem[]
  online: boolean
}

export function SyncPanel({ syncQueue, online }: Props) {
  const pending = syncQueue.filter((s) => s.status === 'pending')
  const failed = syncQueue.filter((s) => s.status === 'failed')

  return (
    <div className="rounded-card border border-borderGray bg-white px-3 py-3 shadow-card">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">Sync Queue</p>
          <p className="text-xs text-gray-500">
            {pending.length} pending, {failed.length} failed
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-indianBlue px-3 py-1 text-xs font-semibold text-white shadow-button">
          <RefreshCcw className="h-4 w-4" />
          {online ? 'Sync Now' : 'Queued'}
        </button>
      </div>
      <div className="space-y-2">
        {syncQueue.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-xl border border-borderGray px-3 py-2 text-xs text-gray-700"
          >
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-indianBlue" />
              <span className="capitalize">{item.kind}</span>
            </div>
            <span
              className={`rounded-full px-2 py-1 font-semibold ${
                item.status === 'pending'
                  ? 'bg-amber-50 text-amber-700'
                  : item.status === 'failed'
                    ? 'bg-red-50 text-dangerRed'
                    : 'bg-green-50 text-successGreen'
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
        {!syncQueue.length && (
          <div className="rounded-xl border border-dashed border-borderGray px-3 py-2 text-xs text-gray-500">
            Queue is empty. You are synced.
          </div>
        )}
      </div>
    </div>
  )
}
