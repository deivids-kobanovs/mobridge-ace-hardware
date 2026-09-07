import { renderRichText } from '@/lib/richtext'
import { cn } from '@/lib/utils'

export function RichTextViewer({ content, className }: { content: string; className?: string }) {
  return <div className={cn('text-sm', className)} dangerouslySetInnerHTML={{ __html: renderRichText(content) }} />
}
