import { Bold, CheckSquare, Heading2, Image, Italic, Link2, List, ListOrdered } from 'lucide-react'
import { useRef, useState } from 'react'
import { RichTextViewer } from '@/components/content/RichTextViewer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const TOOLS: { icon: typeof Bold; label: string; wrap?: [string, string]; linePrefix?: string }[] = [
  { icon: Heading2, label: 'Heading', linePrefix: '## ' },
  { icon: Bold, label: 'Bold', wrap: ['**', '**'] },
  { icon: Italic, label: 'Italic', wrap: ['*', '*'] },
  { icon: List, label: 'Bullet list', linePrefix: '- ' },
  { icon: ListOrdered, label: 'Numbered list', linePrefix: '1. ' },
  { icon: CheckSquare, label: 'Checklist', linePrefix: '- [ ] ' },
  { icon: Link2, label: 'Link', wrap: ['[', '](https://)'] },
  { icon: Image, label: 'Image', wrap: ['![', '](https://)'] },
]

export function RichTextEditor({ value, onChange, minRows = 10 }: { value: string; onChange: (v: string) => void; minRows?: number }) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [tab, setTab] = useState('write')

  function applyTool(tool: (typeof TOOLS)[number]) {
    const el = ref.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = value.slice(start, end)

    if (tool.wrap) {
      const [before, after] = tool.wrap
      const next = value.slice(0, start) + before + selected + after + value.slice(end)
      onChange(next)
      requestAnimationFrame(() => {
        el.focus()
        el.setSelectionRange(start + before.length, start + before.length + selected.length)
      })
    } else if (tool.linePrefix) {
      const lineStart = value.lastIndexOf('\n', start - 1) + 1
      const next = value.slice(0, lineStart) + tool.linePrefix + value.slice(lineStart)
      onChange(next)
      requestAnimationFrame(() => {
        el.focus()
        el.setSelectionRange(start + tool.linePrefix!.length, end + tool.linePrefix!.length)
      })
    }
  }

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-ink-200 bg-ink-50 p-1">
          {TOOLS.map((tool) => (
            <button
              key={tool.label}
              type="button"
              title={tool.label}
              onClick={() => applyTool(tool)}
              className="flex size-8 items-center justify-center rounded-md text-ink-500 hover:bg-card hover:text-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <tool.icon className="size-4" />
            </button>
          ))}
        </div>
        <TabsList>
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="write" className="mt-2">
        <Textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={minRows}
          className="font-mono text-[13px] leading-relaxed"
          placeholder={'## Heading\n\nWrite the procedure here…\n\n1. First step\n2. Second step\n\n- [ ] Checklist item'}
        />
      </TabsContent>
      <TabsContent value="preview" className={cn('mt-2 rounded-lg border border-ink-200 bg-card p-4', !value && 'text-sm text-ink-400')}>
        {value ? <RichTextViewer content={value} /> : 'Nothing to preview yet.'}
      </TabsContent>
    </Tabs>
  )
}
