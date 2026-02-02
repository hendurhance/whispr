import { redirect } from 'next/navigation';
import { getUserSession, getProfileData } from '@/lib/server/profile-data';
import { StaticAuthProvider } from '@/context/StaticAuthContext';

/**
 * Layout for authenticated pages (dashboard, profile, settings)
 * This layout wraps children with StaticAuthProvider which uses
 * server-provided data instead of fetching client-side.
 * 
 */
export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch user and profile data server-side
  const user = await getUserSession();
  const profile = await getProfileData();
  
  // Redirect to auth if not logged in
  if (!user) {
    redirect('/auth');
  }
  
  // Wrap children with StaticAuthProvider to provide auth context
  return (
    <StaticAuthProvider user={user} profile={profile}>
      {children}
    </StaticAuthProvider>
  );
}
