import { useState } from 'react'
import { motion } from 'framer-motion'
import { Moon, Bell, User, Shield, Loader2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useUIStore } from '../../store/uiStore'
import { PageHeader } from '../../components/common/PageHeader'
import { api } from '../../services/api'
import toast from 'react-hot-toast'

export function SettingsPage() {
  const { user, fetchMe } = useAuth()
  const { theme, setTheme } = useUIStore()
  const [saving, setSaving] = useState(false)
  const [pushEnabled, setPushEnabled] = useState(user?.preferences?.notifications?.push ?? true)

  const handleThemeToggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
  }

  const savePreferences = async () => {
    setSaving(true)
    try {
      await api.put('/auth/preferences', {
        preferences: {
          theme,
          notifications: { push: pushEnabled, email: false },
        },
      })
      await fetchMe()
      toast.success('Preferences saved')
    } catch {
      toast.error('Failed to save preferences')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <PageHeader title="Settings" description="Manage your account and preferences." />

      {/* Profile */}
      <Section icon={User} title="Profile">
        <div className="flex items-center gap-4">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full border-2 border-border" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-accent-violet/20 flex items-center justify-center text-accent-violet text-xl font-bold">
              {user?.name?.[0]}
            </div>
          )}
          <div>
            <p className="font-semibold text-text-primary">{user?.name}</p>
            <p className="text-text-secondary text-sm">{user?.email}</p>
            <p className="text-text-muted text-xs mt-0.5">Signed in with Google</p>
          </div>
        </div>
      </Section>

      {/* Appearance */}
      <Section icon={Moon} title="Appearance">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-primary">Theme</p>
            <p className="text-xs text-text-secondary mt-0.5">
              Currently {theme === 'dark' ? 'dark' : 'light'} mode
            </p>
          </div>
          <button
            onClick={handleThemeToggle}
            className={`relative w-12 h-6 rounded-full border transition-all ${
              theme === 'dark'
                ? 'bg-accent-violet border-accent-violet'
                : 'bg-background-elevated border-border'
            }`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
      </Section>

      {/* Notifications */}
      <Section icon={Bell} title="Notifications">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-primary">Push Notifications</p>
            <p className="text-xs text-text-secondary mt-0.5">Receive reminders on your device</p>
          </div>
          <button
            onClick={() => setPushEnabled(!pushEnabled)}
            className={`relative w-12 h-6 rounded-full border transition-all ${
              pushEnabled
                ? 'bg-accent-violet border-accent-violet'
                : 'bg-background-elevated border-border'
            }`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              pushEnabled ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
      </Section>

      {/* Security */}
      <Section icon={Shield} title="Security">
        <div className="space-y-2 text-sm text-text-secondary">
          <p>Authentication: <span className="text-text-primary">Google OAuth 2.0</span></p>
          <p>Session: <span className="text-text-primary">JWT (7-day access token)</span></p>
          <p>Member since: <span className="text-text-primary">
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' }) : '—'}
          </span></p>
        </div>
      </Section>

      <div className="flex justify-end">
        <button onClick={() => void savePreferences()} disabled={saving} className="btn-primary flex items-center gap-2">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Preferences
        </button>
      </div>
    </div>
  )
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background-surface border border-border rounded-xl p-5"
    >
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <Icon className="w-4 h-4 text-accent-violet" />
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      </div>
      {children}
    </motion.div>
  )
}