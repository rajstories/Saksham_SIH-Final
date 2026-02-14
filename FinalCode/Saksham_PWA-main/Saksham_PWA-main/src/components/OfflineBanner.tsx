import { WifiOff } from 'lucide-react'

interface Props {
  visible: boolean
  message?: string
}

export function OfflineBanner({
  visible,
  message = 'Offline Mode - Data will sync when online',
}: Props) {
  if (!visible) return null
  return (
    <div className="fixed left-0 top-[60px] z-20 flex w-full items-center justify-center bg-amber text-white px-4 py-3 text-sm font-semibold shadow">
      <WifiOff className="mr-2 h-5 w-5" />
      {message}
    </div>
  )
}
