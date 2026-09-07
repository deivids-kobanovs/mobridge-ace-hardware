import { AlertCircle, CheckCircle2, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDateShort } from '@/lib/date'
import { plainTextExcerpt } from '@/lib/richtext'
import type { AckStats } from '@/lib/policy-helpers'
import { cn } from '@/lib/utils'
import type { Policy, PolicyCategory } from '@/types'

export function PolicyCard({ policy, category, stats, onOpen }: { policy: Policy; category?: PolicyCategory; stats: AckStats; onOpen: () => void }) {
  const isRecent = Date.now() - new Date(policy.updatedAt).getTime() < 7 * 24 * 3600000

  return (
    <button
      onClick={onOpen}
      className="flex flex-col gap-3 rounded-xl border border-ink-200 bg-card p-5 text-left shadow-card transition-shadow hover:shadow-popover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <FileText className="size-5" />
        </span>
        <div className="flex flex-wrap justify-end gap-1.5">
          {category && (
            <Badge variant="neutral" className="whitespace-nowrap">
              {category.name}
            </Badge>
          )}
          <Badge variant={policy.status === 'Published' ? 'success' : 'outline'}>{policy.status}</Badge>
          {isRecent && policy.status === 'Published' && <Badge variant="info">Recently updated</Badge>}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-ink-900">{policy.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-ink-500">{policy.description || plainTextExcerpt(policy.content)}</p>
      </div>

      <div className="mt-auto space-y-2 border-t border-ink-100 pt-3 text-xs text-ink-500">
        <div className="flex items-center justify-between">
          <span>
            v{policy.version} · Updated {formatDateShort(policy.updatedAt.slice(0, 10))}
          </span>
          <span>{policy.updatedBy}</span>
        </div>
        {policy.requiresAcknowledgement && policy.status === 'Published' && (
          <div className={cn('flex items-center gap-1.5 font-medium', stats.percent === 100 ? 'text-emerald-600' : 'text-amber-600')}>
            {stats.percent === 100 ? <CheckCircle2 className="size-3.5" /> : <AlertCircle className="size-3.5" />}
            {stats.acknowledgedCount}/{stats.total} acknowledged ({stats.percent}%)
          </div>
        )}
      </div>
    </button>
  )
}
