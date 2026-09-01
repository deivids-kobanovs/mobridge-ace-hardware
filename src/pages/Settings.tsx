import { RotateCcw, Send } from 'lucide-react'
import { useState } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/checkbox'
import { FieldGroup, Textarea } from '@/components/ui/input'
import { MANAGER } from '@/data/employees'
import { useApp } from '@/store/AppContext'

export function Settings() {
  const { addAnnouncement, announcements } = useApp()
  const [message, setMessage] = useState('')
  const [prefs, setPrefs] = useState({ overdueAlerts: true, approvalAlerts: true, dailySummary: false })

  function handleReset() {
    if (confirm('Reset all demo data? This clears saved changes on this device and reloads the app.')) {
      localStorage.removeItem('mah_state_v2')
      window.location.reload()
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-lg font-bold text-ink-900">Settings</h1>
        <p className="text-sm text-ink-500">Store profile, notification preferences, and demo controls.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Store profile</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar initials={MANAGER.initials} color={MANAGER.color} size="lg" />
          <div>
            <p className="text-sm font-semibold text-ink-900">Mobridge Ace Hardware</p>
            <p className="text-xs text-ink-500">
              Managed by {MANAGER.name} · {MANAGER.role}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PrefRow label="Overdue task alerts" checked={prefs.overdueAlerts} onChange={(v) => setPrefs({ ...prefs, overdueAlerts: v })} />
          <PrefRow label="Approval request alerts" checked={prefs.approvalAlerts} onChange={(v) => setPrefs({ ...prefs, approvalAlerts: v })} />
          <PrefRow label="Daily summary email (simulated)" checked={prefs.dailySummary} onChange={(v) => setPrefs({ ...prefs, dailySummary: v })} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Post an announcement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <FieldGroup label="Message" hint="Shown to all employees on their dashboard.">
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Share an update with the team…" />
          </FieldGroup>
          <Button
            disabled={!message.trim()}
            onClick={() => {
              addAnnouncement(message.trim())
              setMessage('')
            }}
          >
            <Send className="size-4" />
            Post Announcement
          </Button>
          {announcements.length > 0 && (
            <div className="space-y-2 border-t border-ink-100 pt-3">
              {announcements.slice(0, 3).map((a) => (
                <p key={a.id} className="text-xs text-ink-500">
                  <span className="font-semibold text-ink-700">{a.author}:</span> {a.message}
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Demo controls</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-ink-500">Changes you make are saved to this browser. Reset to restore the original demo data.</p>
          <Button variant="danger" onClick={handleReset}>
            <RotateCcw className="size-4" />
            Reset Demo Data
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function PrefRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span className="text-sm font-medium text-ink-800">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  )
}
