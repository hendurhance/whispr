import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-xl bg-secondary motion-reduce:animate-none', className)} />
}

export function SidebarSkeleton() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-2 border-r border-border bg-paper p-3.5 lg:flex">
      <Skeleton className="mb-4 h-8 w-28" />
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </aside>
  )
}
