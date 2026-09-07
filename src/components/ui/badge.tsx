import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

export const badgeVariants = cva('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium', {
  variants: {
    variant: {
      neutral: 'bg-ink-100 text-ink-700',
      brand: 'bg-brand-100 text-brand-700',
      danger: 'bg-rose-600 text-white',
      warning: 'bg-amber-100 text-amber-800',
      success: 'bg-emerald-100 text-emerald-700',
      info: 'bg-sky-100 text-sky-700',
      outline: 'border border-ink-200 text-ink-600',
      violet: 'bg-violet-100 text-violet-700',
    },
  },
  defaultVariants: { variant: 'neutral' },
})

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
