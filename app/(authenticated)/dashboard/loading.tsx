import { Skeleton, SidebarSkeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background" aria-busy="true" aria-label="Loading inbox">
      <SidebarSkeleton />
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-border px-5 py-3.5">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-10 flex-1 sm:max-w-xs" />
        </div>
        <div className="px-5 py-5">
          <Skeleton className="mb-4 h-5 w-64 rounded-md" />
          <div className="mb-4 flex gap-1.5">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
          <div className="space-y-2">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
