export default function AuthenticatedLoading() {
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background" aria-busy="true" aria-label="Loading">
      <aside className="hidden w-60 shrink-0 flex-col gap-2 border-r border-border bg-paper p-3.5 lg:flex">
        <SkeletonBlock className="mb-4 h-8 w-28" />
        {Array.from({ length: 4 }, (_, i) => (
          <SkeletonBlock key={i} className="h-10 w-full" />
        ))}
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-border px-5 py-3.5">
          <SkeletonBlock className="h-7 w-20" />
          <SkeletonBlock className="h-10 flex-1 sm:max-w-xs" />
        </div>
        <div className="px-5 py-5">
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <SkeletonBlock key={i} className="h-[78px]" />
            ))}
          </div>
          <div className="space-y-2">
            {Array.from({ length: 6 }, (_, i) => (
              <SkeletonBlock key={i} className="h-20" />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-secondary motion-reduce:animate-none ${className}`} />
}
