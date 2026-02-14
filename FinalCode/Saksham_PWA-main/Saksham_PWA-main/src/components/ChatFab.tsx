import { Bot } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  open: boolean
  onToggle: () => void
}

export function ChatFab({ open, onToggle }: Props) {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={onToggle}
        className={clsx(
          'relative flex h-14 w-14 items-center justify-center rounded-full bg-indianBlue text-white shadow-mic transition active:scale-95',
          open && 'ring-4 ring-indigo-200',
        )}
      >
        <Bot className="h-7 w-7" />
      </button>
      <p className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow">
        {open ? 'Close AI Assistant' : 'Chat with AI'}
      </p>
    </div>
  )
}
