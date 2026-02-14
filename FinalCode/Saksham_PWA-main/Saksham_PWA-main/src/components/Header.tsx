import { Menu, WifiOff, Wifi } from 'lucide-react'
import { LogoMark } from './LogoMark'

interface Props {
  online: boolean
  pendingSyncs: number
  lastSynced?: string
  onMenuToggle: () => void
}

export function Header({ online, pendingSyncs, lastSynced, onMenuToggle }: Props) {
  return (
    <header className="fixed left-0 top-0 z-30 flex h-[64px] w-full items-center justify-between bg-white/90 px-4 shadow-header backdrop-blur-md">
      <div className="flex items-center gap-3">
        <LogoMark size={48} />
        <div className="leading-tight">
          <p className="text-base font-extrabold text-[#0A1024]">Saksham</p>
          <p className="text-xs font-medium text-gray-500">NDMA Training Monitor</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
            online ? 'bg-green-50 text-successGreen' : 'bg-amber-100 text-amber-700'
          }`}
        >
          {online ? (
            <Wifi className="h-4 w-4" />
          ) : (
            <WifiOff className="h-4 w-4" />
          )}
          {online ? 'Online' : 'Offline'}
        </div>
        <div className="rounded-xl border border-borderGray px-3 py-1 text-xs text-gray-600">
          Pending syncs: <span className="font-semibold">{pendingSyncs}</span>
          {lastSynced && <span className="ml-2 text-[11px]">Last: {lastSynced}</span>}
        </div>
        <button
          type="button"
          onClick={onMenuToggle}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-borderGray bg-white hover:shadow-sm"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </header>
  )
}
