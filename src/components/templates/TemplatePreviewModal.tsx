import { CheckCircle2 } from 'lucide-react'
import { StatusBadge } from '@/components/tasks/badges'
import { Dialog, Modal } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDateShort } from '@/lib/date'
import type { TaskTemplate } from '@/types'

export function TemplatePreviewModal({ template, onOpenChange }: { template: TaskTemplate | null; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={!!template} onOpenChange={onOpenChange}>
      {template && (
        <Modal title={template.name} description={template.description} size="lg">
          <Tabs defaultValue="steps">
            <TabsList>
              <TabsTrigger value="steps">Checklist steps</TabsTrigger>
              <TabsTrigger value="history">Completion history</TabsTrigger>
            </TabsList>
            <TabsContent value="steps">
              <ol className="space-y-2">
                {template.checklist.map((step, i) => (
                  <li key={step.id} className="flex items-start gap-3 rounded-lg border border-ink-100 px-3 py-2.5 text-sm text-ink-800">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-ink-100 text-xs font-semibold text-ink-500">{i + 1}</span>
                    {step.text}
                  </li>
                ))}
              </ol>
            </TabsContent>
            <TabsContent value="history">
              {template.usageHistory.length === 0 ? (
                <p className="py-8 text-center text-sm text-ink-400">This template hasn&apos;t been used yet.</p>
              ) : (
                <ul className="space-y-2">
                  {template.usageHistory.map((u) => (
                    <li key={u.id} className="flex items-center justify-between gap-3 rounded-lg border border-ink-100 px-3 py-2.5 text-sm">
                      <div className="min-w-0">
                        <p className="font-medium text-ink-800">{formatDateShort(u.date)}</p>
                        <p className="text-xs text-ink-500">
                          Assigned to {u.assignedTo}
                          {u.completedBy && u.completedAt ? ` · completed by ${u.completedBy}` : ''}
                        </p>
                      </div>
                      <StatusBadge status={u.status} />
                    </li>
                  ))}
                </ul>
              )}
              {template.usageHistory.some((u) => u.status === 'Completed') && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700">
                  <CheckCircle2 className="size-3.5" />
                  {template.usageHistory.filter((u) => u.status === 'Completed').length} completed of {template.usageHistory.length} uses
                </p>
              )}
            </TabsContent>
          </Tabs>
        </Modal>
      )}
    </Dialog>
  )
}
