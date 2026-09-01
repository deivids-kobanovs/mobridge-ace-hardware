import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger

const Overlay = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Overlay>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn('fixed inset-0 z-50 bg-ink-950/50 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out', className)}
      {...props}
    />
  ),
)
Overlay.displayName = 'Overlay'

interface ModalProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  title: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const Modal = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, ModalProps>(
  ({ className, children, title, description, size = 'md', ...props }, ref) => {
    const sizeClasses = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
    return (
      <DialogPrimitive.Portal>
        <Overlay />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            'fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white shadow-popover focus:outline-none',
            sizeClasses[size],
            className,
          )}
          {...props}
        >
          <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-ink-100 bg-white px-6 py-4">
            <div>
              <DialogPrimitive.Title className="text-base font-semibold text-ink-900">{title}</DialogPrimitive.Title>
              {description && <DialogPrimitive.Description className="mt-0.5 text-sm text-ink-500">{description}</DialogPrimitive.Description>}
            </div>
            <DialogPrimitive.Close className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>
          <div className="px-6 py-5">{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    )
  },
)
Modal.displayName = 'Modal'

interface SidePanelProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  title: string
  description?: string
  width?: 'md' | 'lg' | 'xl'
  headerExtra?: React.ReactNode
}

export const SidePanel = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, SidePanelProps>(
  ({ className, children, title, description, width = 'lg', headerExtra, ...props }, ref) => {
    const widthClasses = { md: 'max-w-md', lg: 'max-w-xl', xl: 'max-w-2xl' }
    return (
      <DialogPrimitive.Portal>
        <Overlay />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            'fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col overflow-y-auto border-l border-ink-200 bg-white shadow-popover focus:outline-none',
            'data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right',
            widthClasses[width],
            className,
          )}
          {...props}
        >
          <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-ink-100 bg-white px-6 py-4">
            <div className="min-w-0">
              <DialogPrimitive.Title className="truncate text-base font-semibold text-ink-900">{title}</DialogPrimitive.Title>
              {description && <DialogPrimitive.Description className="mt-0.5 text-sm text-ink-500">{description}</DialogPrimitive.Description>}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {headerExtra}
              <DialogPrimitive.Close className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </div>
          </div>
          <div className="flex-1 px-6 py-5">{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    )
  },
)
SidePanel.displayName = 'SidePanel'
