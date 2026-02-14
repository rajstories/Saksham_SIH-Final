import { CheckSquare, Home, NotebookPen, Plus, UserRound } from 'lucide-react'
import { Link, useLocation } from 'wouter'
import clsx from 'clsx'

interface Props {
  onAdd?: () => void
  addHref?: string
}

export function BottomNav({ onAdd, addHref = '/events/new' }: Props) {
  const [location] = useLocation()

  const left = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/events', label: 'Events', icon: NotebookPen },
  ]
  const right = [
    { path: '/attendance', label: 'Attendance', icon: CheckSquare },
    { path: '/profile', label: 'Profile', icon: UserRound },
  ]

  const renderItem = (path: string, label: string, Icon: any) => {
    const active = location === path
    return (
      <Link key={path} href={path} className="flex-1">
        <div
          className={clsx(
            'mx-2 flex flex-col items-center justify-center gap-1 rounded-2xl py-2 text-[13px] font-semibold transition',
            active ? 'text-indianBlue' : 'text-gray-500 hover:text-indianBlue',
          )}
        >
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </div>
      </Link>
    )
  }

  const AddButton = onAdd ? (
    <button
      type="button"
      onClick={onAdd}
      className="relative -mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-warm-gradient text-white shadow-mic active:scale-95"
      aria-label="Add event"
    >
      <Plus className="h-7 w-7" />
    </button>
  ) : (
    <Link
      href={addHref}
      className="relative -mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-warm-gradient text-white shadow-mic active:scale-95"
      aria-label="Add event"
    >
      <Plus className="h-7 w-7" />
    </Link>
  )

  return (
    <nav className="fixed bottom-0 left-0 z-30 flex h-[80px] w-full items-center justify-between bg-white px-2 shadow-nav">
      <div className="flex flex-1 items-center justify-evenly">{left.map((item) => renderItem(item.path, item.label, item.icon))}</div>
      <div className="flex flex-none items-center justify-center px-2">{AddButton}</div>
      <div className="flex flex-1 items-center justify-evenly">{right.map((item) => renderItem(item.path, item.label, item.icon))}</div>
    </nav>
  )
}
