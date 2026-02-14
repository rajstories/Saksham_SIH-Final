import type { ReactNode } from 'react'
import clsx from 'clsx'

interface Props {
  title: string
  value: ReactNode
  sub?: string
  tone?: 'default' | 'success' | 'warning' | 'danger'
}

export function StatCard({ title, value, sub, tone = 'default' }: Props) {
  const toneClass =
    tone === 'success'
      ? 'border-successGreen/30 bg-green-50 text-successGreen'
      : tone === 'warning'
        ? 'border-amber/40 bg-amber-50 text-amber-700'
        : tone === 'danger'
          ? 'border-dangerRed/30 bg-red-50 text-dangerRed'
          : 'border-borderGray bg-white text-gray-900'

  return (
    <div
      className={clsx(
        'glass-card flex flex-col gap-1 border px-4 py-3 shadow-card',
        toneClass,
      )}
    >
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <div className="text-2xl font-semibold leading-tight">{value}</div>
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
    </div>
  )
}
