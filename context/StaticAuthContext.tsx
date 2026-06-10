'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/types';
import { signOutUser } from '@/lib/client/auth';
import { useRouter } from 'next/navigation';

interface StaticAuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<Profile | null>;
}

const StaticAuthContext = createContext<StaticAuthContextType | undefined>(undefined);

interface StaticAuthProviderProps {
  user: User | null;
  profile: Profile | null;
  children: React.ReactNode;
}

export const StaticAuthProvider: React.FC<StaticAuthProviderProps> = ({
  user,
  profile,
  children,
}) => {
  const router = useRouter();

  const signOut = useMemo(() => async () => {
    await signOutUser();
    router.push('/auth');
  }, [router]);

  const refreshProfile = useMemo(() => async () => {
    router.refresh();
    return profile;
  }, [router, profile]);

  const value = useMemo(
    () => ({
      user,
      profile,
      isLoading: false,
      signOut,
      refreshProfile,
    }),
    [user, profile, signOut, refreshProfile]
  );

  return (
    <StaticAuthContext.Provider value={value}>
      {children}
    </StaticAuthContext.Provider>
  );
};

export const useStaticAuth = () => {
  const context = useContext(StaticAuthContext);
  if (context === undefined) {
    throw new Error('useStaticAuth must be used within a StaticAuthProvider');
  }
  return context;
};
