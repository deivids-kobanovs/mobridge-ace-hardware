import { cn } from '@/lib/utils'

export function Avatar({ initials, color, size = 'md', className }: { initials: string; color: string; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = { sm: 'size-7 text-xs', md: 'size-9 text-sm', lg: 'size-12 text-base' }
  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white', color, sizeClasses[size], className)}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}
