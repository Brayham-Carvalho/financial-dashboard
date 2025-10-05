'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'

import { cn } from '@/lib/utils'

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'inline-flex w-fit items-center justify-center gap-1.5 rounded-2xl border border-white/55 bg-white/80 p-1.5 shadow-[0_18px_50px_-28px_rgba(16,27,55,0.4)] backdrop-blur-xl text-muted-foreground dark:border-white/10 dark:bg-card/70',
        className,
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-[26px] border border-transparent px-5 text-sm font-semibold tracking-tight text-muted-foreground transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-[linear-gradient(135deg,rgba(99,91,255,0.95),rgba(127,138,255,0.9))] data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_24px_60px_-32px_rgba(99,91,255,0.55)] hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-background",
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
