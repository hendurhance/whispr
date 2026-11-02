'use client'

import { Button } from '@/components/ui/button'

export default function AuthenticatedError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-6 text-center">
      <h1 className="font-display text-xl font-bold text-ink">Could not load this page</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-faint">Check your connection and try again. Your whisprs are safe.</p>
      <Button variant="flame" className="mt-5" onClick={reset}>
        Try again
      </Button>
    </div>
  )
}
