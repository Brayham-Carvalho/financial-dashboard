import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold tracking-tight transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-[0_22px_46px_-24px_rgba(255,56,92,0.55)] hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_28px_52px_-24px_rgba(255,56,92,0.6)] active:translate-y-0 active:shadow-[0_16px_34px_-20px_rgba(255,56,92,0.45)]',
        destructive:
          'bg-destructive text-destructive-foreground shadow-[0_20px_40px_-24px_rgba(217,56,66,0.45)] hover:-translate-y-0.5 hover:bg-destructive/90 hover:shadow-[0_26px_52px_-26px_rgba(217,56,66,0.55)] focus-visible:ring-destructive/30 dark:focus-visible:ring-destructive/40',
        outline:
          'border border-white/50 bg-white/70 text-foreground shadow-none backdrop-blur hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-[0_18px_40px_-28px_rgba(31,27,26,0.25)] dark:border-white/10 dark:bg-card/70 dark:hover:bg-card/90',
        secondary:
          'bg-secondary text-secondary-foreground shadow-[0_20px_42px_-28px_rgba(170,150,130,0.45)] hover:-translate-y-0.5 hover:bg-secondary/85',
        ghost:
          'text-foreground/80 hover:bg-primary/5 hover:text-foreground dark:hover:bg-primary/10',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-6 has-[>svg]:px-5',
        sm: 'h-9 gap-1.5 px-4 text-sm has-[>svg]:px-3.5',
        lg: 'h-12 px-7 text-base has-[>svg]:px-5',
        icon: 'size-11 rounded-full',
        'icon-sm': 'size-9 rounded-full',
        'icon-lg': 'size-12 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
