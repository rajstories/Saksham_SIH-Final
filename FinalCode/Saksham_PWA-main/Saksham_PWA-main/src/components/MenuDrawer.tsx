import { LogOut, MessageCircleQuestion, Settings, User } from 'lucide-react'
import { Link } from 'wouter'

interface Props {
  open: boolean
  onClose: () => void
  onLogout: () => void
}

export function MenuDrawer({ open, onClose, onLogout }: Props) {
  if (!open) return null

  const items = [
    { label: 'Profile', icon: User, href: '/profile' },
    { label: 'Settings', icon: Settings, href: '#' },
    { label: 'Help & Support', icon: MessageCircleQuestion, href: '#' },
  ]

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/20 backdrop-blur-sm">
      <div className="h-full w-64 bg-white shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-borderGray">
          <p className="text-sm font-semibold text-gray-800">Menu</p>
          <button onClick={onClose} className="text-sm text-gray-500">Close</button>
        </div>
        <div className="divide-y divide-gray-100">
          {items.map((item) => (
            <Link key={item.label} href={item.href}>
              <div
                className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-slateBg"
                onClick={onClose}
              >
                <item.icon className="h-5 w-5 text-indianBlue" />
                {item.label}
              </div>
            </Link>
          ))}
          <button
            onClick={() => {
              onLogout()
              onClose()
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-dangerRed hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
