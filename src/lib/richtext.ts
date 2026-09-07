// Minimal Markdown-subset renderer for policy & handbook content.
// Supports: # / ## / ### headings, bold **, italic *, links [text](url),
// images ![alt](url), bullet lists (-), numbered lists (1.), checklists (- [ ] / - [x]),
// and blank-line separated paragraphs. Deliberately simple and safe (escapes HTML first).

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function renderInline(text: string): string {
  let out = escapeHtml(text)
  out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="my-2 max-h-64 rounded-lg border border-ink-200 object-cover" />')
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer" class="text-brand-700 underline underline-offset-2 hover:text-brand-800">$1</a>')
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  out = out.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
  return out
}

interface Block {
  type: 'h1' | 'h2' | 'h3' | 'ul' | 'ol' | 'checklist' | 'p'
  lines: string[]
}

export function renderRichText(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const blocks: Block[] = []
  let current: Block | null = null

  const flush = () => {
    if (current) blocks.push(current)
    current = null
  }

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (!line.trim()) {
      flush()
      continue
    }
    const h3 = /^###\s+(.*)/.exec(line)
    const h2 = /^##\s+(.*)/.exec(line)
    const h1 = /^#\s+(.*)/.exec(line)
    const checklist = /^[-*]\s+\[( |x|X)\]\s+(.*)/.exec(line)
    const bullet = /^[-*]\s+(.*)/.exec(line)
    const numbered = /^\d+[.)]\s+(.*)/.exec(line)

    if (h1) {
      flush()
      blocks.push({ type: 'h1', lines: [h1[1]] })
    } else if (h2) {
      flush()
      blocks.push({ type: 'h2', lines: [h2[1]] })
    } else if (h3) {
      flush()
      blocks.push({ type: 'h3', lines: [h3[1]] })
    } else if (checklist) {
      const checked = checklist[1].toLowerCase() === 'x'
      if (!current || current.type !== 'checklist') {
        flush()
        current = { type: 'checklist', lines: [] }
      }
      current.lines.push((checked ? '[x] ' : '[ ] ') + checklist[2])
    } else if (bullet) {
      if (!current || current.type !== 'ul') {
        flush()
        current = { type: 'ul', lines: [] }
      }
      current.lines.push(bullet[1])
    } else if (numbered) {
      if (!current || current.type !== 'ol') {
        flush()
        current = { type: 'ol', lines: [] }
      }
      current.lines.push(numbered[1])
    } else {
      if (!current || current.type !== 'p') {
        flush()
        current = { type: 'p', lines: [] }
      }
      current.lines.push(line)
    }
  }
  flush()

  const html = blocks
    .map((b) => {
      switch (b.type) {
        case 'h1':
          return `<h2 class="mt-6 mb-2 text-xl font-bold text-ink-900 first:mt-0">${renderInline(b.lines[0])}</h2>`
        case 'h2':
          return `<h3 class="mt-5 mb-2 text-lg font-bold text-ink-900 first:mt-0">${renderInline(b.lines[0])}</h3>`
        case 'h3':
          return `<h4 class="mt-4 mb-1.5 text-base font-semibold text-ink-900 first:mt-0">${renderInline(b.lines[0])}</h4>`
        case 'ul':
          return `<ul class="my-3 list-disc space-y-1 pl-5 text-ink-700">${b.lines.map((l) => `<li>${renderInline(l)}</li>`).join('')}</ul>`
        case 'ol':
          return `<ol class="my-3 list-decimal space-y-1 pl-5 text-ink-700">${b.lines.map((l) => `<li>${renderInline(l)}</li>`).join('')}</ol>`
        case 'checklist':
          return `<ul class="my-3 space-y-1.5">${b.lines
            .map((l) => {
              const checked = l.startsWith('[x] ')
              const text = l.replace(/^\[( |x)\]\s/, '')
              return `<li class="flex items-start gap-2 text-ink-700"><span class="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border ${checked ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-ink-300'}">${checked ? '✓' : ''}</span><span>${renderInline(text)}</span></li>`
            })
            .join('')}</ul>`
        case 'p':
        default:
          return `<p class="my-3 leading-relaxed text-ink-700 first:mt-0">${b.lines.map(renderInline).join('<br/>')}</p>`
      }
    })
    .join('')

  return html
}

export function plainTextExcerpt(markdown: string, maxLength = 140): string {
  const stripped = markdown
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*_>-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return stripped.length > maxLength ? `${stripped.slice(0, maxLength).trim()}…` : stripped
}
