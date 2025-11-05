'use client';

import { AuthProvider } from "@/context/auth";

/**
 * Layout for public pages that need AuthProvider
 * (auth, landing, public profiles)
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
