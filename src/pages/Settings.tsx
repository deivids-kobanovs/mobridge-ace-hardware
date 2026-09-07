import { Mail, RotateCcw, Send } from 'lucide-react'
import { useState } from 'react'
import { EmailPreviewModal } from '@/components/content/EmailPreviewModal'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/checkbox'
import { FieldGroup, Textarea } from '@/components/ui/input'
import { COMPANY_NAME, MANAGER } from '@/data/employees'
import { timeAgo } from '@/lib/date'
import { languageLabel } from '@/lib/translate'
import { useApp } from '@/store/AppContext'
import type { SimulatedEmail } from '@/types'

export function Settings() {
  const { addAnnouncement, announcements, emailLog } = useApp()
  const [message, setMessage] = useState('')
  const [prefs, setPrefs] = useState({ overdueAlerts: true, approvalAlerts: true, dailySummary: false })
  const [previewEmail, setPreviewEmail] = useState<SimulatedEmail | null>(null)

  function handleReset() {
    if (confirm('Reset all demo data? This clears saved changes on this device and reloads the app.')) {
      localStorage.removeItem('mah_state_v3')
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
            <p className="text-sm font-semibold text-ink-900">{COMPANY_NAME}</p>
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
          <CardTitle>Email activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-ink-500">
            Simulated outbound emails from policy publishing and reminders — automatically translated into each employee&apos;s preferred language. Nothing is
            actually sent in this demo.
          </p>
          {emailLog.length === 0 ? (
            <p className="rounded-lg border border-dashed border-ink-200 p-4 text-center text-sm text-ink-400">No emails sent yet. Publish a policy update to see one.</p>
          ) : (
            <div className="space-y-1.5">
              {emailLog.slice(0, 8).map((e) => (
                <button
                  key={e.id}
                  onClick={() => setPreviewEmail(e)}
                  className="flex w-full items-center gap-3 rounded-lg border border-ink-100 px-3 py-2 text-left text-sm hover:bg-ink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <Mail className="size-4 shrink-0 text-ink-400" />
                  <span className="min-w-0 flex-1 truncate text-ink-800">{e.subject}</span>
                  <span className="shrink-0 text-xs text-ink-400">{languageLabel(e.language)}</span>
                  <span className="shrink-0 text-xs text-ink-400">{timeAgo(e.sentAt)}</span>
                </button>
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

      <EmailPreviewModal email={previewEmail} onOpenChange={(v) => !v && setPreviewEmail(null)} />
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
