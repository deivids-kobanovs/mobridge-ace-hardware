import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { Check } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer size-5 shrink-0 rounded-md border-2 border-ink-300 bg-card shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 data-[state=checked]:border-brand-600 data-[state=checked]:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-ink-50">
      <Check className="size-3.5" strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = 'Checkbox'

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-ink-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 data-[state=checked]:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb className="pointer-events-none block size-5 rounded-full bg-ink-900 shadow-sm ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0.5" />
  </SwitchPrimitive.Root>
))
Switch.displayName = 'Switch'
