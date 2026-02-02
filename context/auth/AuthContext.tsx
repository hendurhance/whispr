'use client';

import React, { createContext, useEffect, useState, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { Profile } from '@/types';
import { createClient } from '@/utils/supabase/client';
import CONFIGURATIONS from '@/configs';

const supabase = createClient();

// Define context types
interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string) => Promise<{ error: unknown | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<Profile | null>;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchedProfileRef = useRef<boolean>(false);
  const lastUserIdRef = useRef<string | null>(null);
  const initialLoadRef = useRef<boolean>(true);

  const fetchProfile = async (userId: string) => {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
      );

      const queryPromise = supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      const { data, error } = await Promise.race([
        queryPromise,
        timeoutPromise.then(() => { throw new Error('Query timeout'); })
      ]);

      if (error) {
        // Check if error is "no rows returned" which means no profile
        if (error.code === 'PGRST116') {
          localStorage.setItem('profile_setup', 'false');
          return null;
        }
        throw error;
      }

      if (data) {
        setProfile(data as Profile);
        localStorage.setItem('profile_setup', 'true');
        return data as Profile;
      } else {
        setProfile(null);
        localStorage.setItem('profile_setup', 'false');
        return null;
      }
    } catch {
      return null;
    } finally {
      fetchedProfileRef.current = true;
    }
  };

  // Added refreshProfile function that can be called from components
  const refreshProfile = async () => {
    if (!user) {
      return null;
    }

    try {
      const profile = await fetchProfile(user.id);
      return profile;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        setIsLoading(true);

        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          lastUserIdRef.current = session.user.id;
          // Fetch user profile
          await fetchProfile(session.user.id);
        }
      } catch {
        // Silently handle error
      } finally {
        setIsLoading(false);
        initialLoadRef.current = false;
      }
    };

    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      initialLoadRef.current = false;
    }, 3000);

    getInitialSession();

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Ignore TOKEN_REFRESHED events - these happen frequently and don't need profile refetch
        if (event === 'TOKEN_REFRESHED') {
          return;
        }

        // Skip processing if this is a session refresh from tab focus and user hasn't changed
        const currentUserId = session?.user?.id;
        const isTabRefresh = event === 'SIGNED_IN' && !initialLoadRef.current &&
                           currentUserId && lastUserIdRef.current === currentUserId;

        if (isTabRefresh) {
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);

        if (event === 'SIGNED_IN' && session?.user) {
          lastUserIdRef.current = session.user.id;

          // Only set loading if this is not a tab focus refresh or initial load
          if (initialLoadRef.current || lastUserIdRef.current !== session.user.id) {
            setIsLoading(true);
          }

          await fetchProfile(session.user.id);

          if (initialLoadRef.current || lastUserIdRef.current !== session.user.id) {
            setIsLoading(false);
          }
        }

        if (event === 'SIGNED_OUT') {
          setProfile(null);
          lastUserIdRef.current = null;
          localStorage.removeItem('profile_setup');
        }
      }
    );

    // Clean up listener and timeout
    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Sign in with magic link
  const signIn = async (email: string) => {
    try {
      const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!email || !emailRegex.test(email.toLowerCase())) {
        return { error: new Error('Please enter a valid email address') };
      }

      // Get the redirect URL from config or fallback to window.location.origin (client-side only)
      let redirectUrl = CONFIGURATIONS.APP_URL || (typeof window !== 'undefined' ? window.location.origin : '');

      // Ensure the URL has a protocol
      if (redirectUrl && !redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
        redirectUrl = `https://${redirectUrl}`;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${redirectUrl}/auth/confirm`,
        },
      });

      return { error };
    } catch (error) {
      return { error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();

      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('profile_setup');

      // Reset state
      setSession(null);
      setUser(null);
      setProfile(null);
    } catch {
      // Silently handle error
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    signIn,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;