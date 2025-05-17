import React, { createContext, useEffect, useState, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { Profile } from '../../types';
import supabase from '../../lib/supabase';

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

  const fetchProfile = async (userId: string) => {
    try {
      console.log("AuthProvider: Fetching profile for user:", userId);

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

      console.log("AuthProvider: Raw response:", { data, error });

      if (error) {
        console.error('Error fetching profile:', error);
        // Check if error is "no rows returned" which means no profile
        if (error.code === 'PGRST116') {
          localStorage.setItem('profile_setup', 'false');
          return null;
        }
        throw error;
      }

      if (data) {
        console.log("AuthProvider: Profile found", data);
        setProfile(data as Profile);
        localStorage.setItem('profile_setup', 'true');
        return data as Profile;
      } else {
        console.log("AuthProvider: No profile found");
        setProfile(null);
        localStorage.setItem('profile_setup', 'false');
        return null;
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    } finally {
      fetchedProfileRef.current = true;
    }
  };

  // Added refreshProfile function that can be called from components
  const refreshProfile = async () => {
    if (!user) {
      console.warn("AuthProvider: Cannot refresh profile, no user is logged in");
      return null;
    }
    
    console.log("AuthProvider: Manually refreshing profile");
    try {
      const profile = await fetchProfile(user.id);
      return profile;
    } catch (error) {
      console.error('Error in refreshProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log("AuthProvider: Initializing");

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log("AuthProvider: Getting initial session");
        setIsLoading(true);

        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          console.log("AuthProvider: User found in session, fetching profile");
          // Fetch user profile
          await fetchProfile(session.user.id);
        } else {
          console.log("AuthProvider: No user in session");
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        console.log("AuthProvider: Initial auth check complete");
        setIsLoading(false);
      }
    };

    timeoutRef.current = setTimeout(() => {
      console.log("AuthProvider: Loading timeout triggered");
      setIsLoading(false);
    }, 3000);

    getInitialSession();

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`AuthProvider: Auth state changed: ${event}`);
        setSession(session);
        setUser(session?.user ?? null);

        if (event === 'SIGNED_IN' && session?.user) {
          console.log("AuthProvider: User signed in, fetching profile");
          setIsLoading(true);
          await fetchProfile(session.user.id);
          setIsLoading(false);
        }

        if (event === 'SIGNED_OUT') {
          console.log("AuthProvider: User signed out, clearing profile");
          setProfile(null);
          localStorage.removeItem('profile_setup');
        }
      }
    );

    // Clean up listener and timeout
    return () => {
      console.log("AuthProvider: Cleaning up");
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
      
      console.log("AuthProvider: Sending magic link to:", email);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      return { error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      console.log("AuthProvider: Signing out");
      await supabase.auth.signOut();

      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('profile_setup');

      // Reset state
      setSession(null);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
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