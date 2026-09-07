import { AlertCircle, Plus, Search, Settings2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CategoryManageModal } from '@/components/policies/CategoryManageModal'
import { PolicyCard } from '@/components/policies/PolicyCard'
import { PolicyDetailView } from '@/components/policies/PolicyDetailView'
import { PolicyEditorModal } from '@/components/policies/PolicyEditorModal'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { policyAckStats } from '@/lib/policy-helpers'
import { useApp } from '@/store/AppContext'

export function Policies({ initialPolicyId }: { initialPolicyId?: string | null }) {
  const { role, policies, policyCategories, policyAcknowledgements } = useApp()
  const [selectedId, setSelectedId] = useState<string | null>(initialPolicyId ?? null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')
  const [needsAttentionOnly, setNeedsAttentionOnly] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const isManager = role === 'manager'

  const visiblePolicies = useMemo(() => {
    return policies
      .filter((p) => !p.archived)
      .filter((p) => isManager || p.status === 'Published')
      .filter((p) => category === 'All' || p.categoryId === category)
      .filter((p) => status === 'All' || p.status === status)
      .filter((p) => !search.trim() || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
      .filter((p) => {
        if (!needsAttentionOnly) return true
        if (!p.requiresAcknowledgement || p.status !== 'Published') return false
        return policyAckStats(p, policyAcknowledgements).pendingIds.length > 0
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }, [policies, isManager, category, status, search, needsAttentionOnly, policyAcknowledgements])

  if (selectedId) {
    return <PolicyDetailView policyId={selectedId} onBack={() => setSelectedId(null)} />
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-ink-900">Policies & Procedures</h1>
          <p className="text-sm text-ink-500">The company's digital operational manual — how work gets done, step by step.</p>
        </div>
        {isManager && (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setCategoriesOpen(true)}>
              <Settings2 className="size-4" />
              Categories
            </Button>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" />
              Add Policy
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="relative min-w-[14rem] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search policies…"
            className="h-9 w-full rounded-lg border border-ink-200 bg-card pl-9 pr-3 text-sm placeholder:text-ink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
        </label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-9 w-auto min-w-[10rem] bg-card text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All categories</SelectItem>
            {policyCategories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isManager && (
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-auto min-w-[8rem] bg-card text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All statuses</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
            </SelectContent>
          </Select>
        )}
        <button
          onClick={() => setNeedsAttentionOnly((v) => !v)}
          className={`flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors ${
            needsAttentionOnly ? 'border-amber-300 bg-amber-50 text-amber-800' : 'border-ink-200 bg-card text-ink-500 hover:bg-ink-50'
          }`}
        >
          <AlertCircle className="size-3.5" />
          Needs attention
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visiblePolicies.map((p) => (
          <PolicyCard
            key={p.id}
            policy={p}
            category={policyCategories.find((c) => c.id === p.categoryId)}
            stats={policyAckStats(p, policyAcknowledgements)}
            onOpen={() => setSelectedId(p.id)}
          />
        ))}
        {visiblePolicies.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed border-ink-200 p-10 text-center text-sm text-ink-400">No policies match these filters.</p>
        )}
      </div>

      <PolicyEditorModal open={createOpen} onOpenChange={setCreateOpen} policy={null} />
      <CategoryManageModal open={categoriesOpen} onOpenChange={setCategoriesOpen} />
    </div>
  )
}
