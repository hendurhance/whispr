'use client';

/**
 * Layout for authenticated pages (dashboard, profile, settings)
 * This layout wraps children with StaticAuthProvider which uses
 * server-provided data instead of fetching client-side.
 * 
 * This eliminates the 2-4s navigation delay caused by AuthProvider.
 */
export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No provider needed - server components pass data directly as props
  return <>{children}</>;
}
