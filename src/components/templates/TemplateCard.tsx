import { Camera, ClipboardCheck, Clock, Copy, Eye, ListChecks, Pencil, Repeat, Send } from 'lucide-react'
import { PriorityBadge } from '@/components/tasks/badges'
import { Button } from '@/components/ui/button'
import { formatDuration } from '@/lib/date'
import { assignmentLabel, recurrenceSummary } from '@/lib/task-helpers'
import { findEmployee } from '@/data/employees'
import type { TaskTemplate } from '@/types'

export function TemplateCard({
  template,
  onPreview,
  onEdit,
  onDuplicate,
  onAssign,
}: {
  template: TaskTemplate
  onPreview: () => void
  onEdit: () => void
  onDuplicate: () => void
  onAssign: () => void
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-ink-200 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-ink-900">{template.name}</h3>
          <p className="mt-0.5 text-xs text-ink-500">{template.department}</p>
        </div>
        <PriorityBadge priority={template.defaultPriority} />
      </div>

      <p className="text-sm text-ink-600">{template.description}</p>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-500">
        <span className="flex items-center gap-1">
          <Clock className="size-3.5" /> {formatDuration(template.estimatedDurationMinutes)}
        </span>
        <span className="flex items-center gap-1">
          <ListChecks className="size-3.5" /> {template.checklist.length} steps
        </span>
        {template.recurring && (
          <span className="flex items-center gap-1">
            <Repeat className="size-3.5" /> Recurring
          </span>
        )}
        {template.requireApproval && (
          <span className="flex items-center gap-1">
            <ClipboardCheck className="size-3.5" /> Approval required
          </span>
        )}
        {template.requirePhoto && (
          <span className="flex items-center gap-1">
            <Camera className="size-3.5" /> Photo required
          </span>
        )}
      </div>

      <div className="rounded-lg bg-ink-50 px-3 py-2 text-xs text-ink-600">
        <p>
          Default: {assignmentLabel({ assignment: template.defaultAssignment }, (id) => findEmployee(id)?.name ?? 'Unknown')} · due {template.defaultDueTime}
        </p>
        {template.recurring && template.recurrence && <p className="mt-0.5 text-ink-500">{recurrenceSummary(template)}</p>}
      </div>

      <div className="mt-1 flex flex-wrap gap-2">
        <Button size="sm" onClick={onAssign}>
          <Send className="size-3.5" />
          Assign
        </Button>
        <Button size="sm" variant="secondary" onClick={onPreview}>
          <Eye className="size-3.5" />
          Preview
        </Button>
        <Button size="sm" variant="secondary" onClick={onEdit}>
          <Pencil className="size-3.5" />
          Edit
        </Button>
        <Button size="sm" variant="ghost" onClick={onDuplicate}>
          <Copy className="size-3.5" />
          Duplicate
        </Button>
      </div>
    </div>
  )
}
