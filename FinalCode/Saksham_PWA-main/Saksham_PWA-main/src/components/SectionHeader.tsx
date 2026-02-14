import type { ReactNode } from 'react'

interface Props {
  title: string
  action?: ReactNode
  subtitle?: string
}

export function SectionHeader({ title, action, subtitle }: Props) {
  return (
    <div className="mb-2 flex items-start justify-between gap-2">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
