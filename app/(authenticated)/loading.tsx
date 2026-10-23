import { Skeleton, SidebarSkeleton } from '@/components/ui/skeleton'

export default function AuthenticatedLoading() {
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background" aria-busy="true" aria-label="Loading">
      <SidebarSkeleton />
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-border px-5 py-3.5">
          <Skeleton className="h-7 w-28" />
        </div>
        <div className="mx-auto w-full max-w-3xl space-y-6 px-5 py-6">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </main>
    </div>
  )
}
