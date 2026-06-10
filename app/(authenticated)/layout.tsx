import { redirect } from 'next/navigation';
import { getUserSession, getProfileData } from '@/lib/server/profile-data';
import { StaticAuthProvider } from '@/context/StaticAuthContext';

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserSession();
  const profile = await getProfileData();

  if (!user) {
    redirect('/auth');
  }

  return (
    <StaticAuthProvider user={user} profile={profile}>
      {children}
    </StaticAuthProvider>
  );
}
