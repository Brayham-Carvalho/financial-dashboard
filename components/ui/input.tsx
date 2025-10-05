import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground/70 selection:bg-primary selection:text-primary-foreground h-11 w-full min-w-0 rounded-2xl border border-white/55 bg-white/85 px-4 text-sm shadow-[0_18px_46px_-32px_rgba(16,27,55,0.35)] outline-none transition-all duration-200 file:inline-flex file:h-8 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:text-xs file:font-semibold disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-card/70',
        'focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-background',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
