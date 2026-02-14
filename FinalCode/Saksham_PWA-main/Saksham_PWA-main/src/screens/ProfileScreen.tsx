import { Globe2, LogOut, Phone, ShieldCheck } from 'lucide-react'
import type { Profile } from '../types'
import { SectionHeader } from '../components/SectionHeader'

interface Props {
  profile: Profile
  onLanguageChange: (lang: string) => void
}

const languages = ['English', 'Hindi', 'Bengali', 'Marathi', 'Tamil', 'Telugu']

export function ProfileScreen({ profile, onLanguageChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-card border border-borderGray bg-white px-4 py-4 shadow-card">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indianBlue text-white text-2xl font-bold">
          {profile.name[0]}
        </div>
        <div className="flex-1">
          <p className="text-lg font-semibold text-gray-900">{profile.name}</p>
          <p className="text-sm text-gray-600">{profile.role}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
            <span className="flex items-center gap-1 rounded-full bg-slateBg px-3 py-1">
              <ShieldCheck className="h-4 w-4 text-successGreen" />
              {profile.organization}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-slateBg px-3 py-1">
              <Phone className="h-4 w-4 text-indianBlue" />
              {profile.phone}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-slateBg px-3 py-1">
              ID: {profile.id}
            </span>
          </div>
        </div>
      </div>

      <section className="rounded-card border border-borderGray bg-white px-4 py-4 shadow-card">
        <SectionHeader title="Preferences" />
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-borderGray px-3 py-2">
            <div className="flex items-center gap-2 text-sm text-gray-800">
              <Globe2 className="h-5 w-5 text-indianBlue" />
              Language
            </div>
            <select
              value={profile.language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="rounded-lg border border-borderGray px-3 py-2 text-sm"
            >
              {languages.map((lang) => (
                <option key={lang}>{lang}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-borderGray px-3 py-2 text-sm text-gray-800">
            <span>Notifications</span>
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-successGreen">
              Enabled
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-borderGray px-3 py-2 text-sm text-gray-800">
            <span>GPS Accuracy</span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              High
            </span>
          </div>
        </div>
      </section>

      <div className="rounded-card border border-red-200 bg-red-50 px-4 py-3 text-dangerRed shadow-card">
        <button className="flex w-full items-center gap-2 text-sm font-semibold">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  )
}
