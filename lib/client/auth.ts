import { createClient } from '@/utils/supabase/client';

/**
 * Client-side utilities for authentication without AuthProvider
 * These functions don't trigger context re-renders
 */

/**
 * Sign out the current user
 * Returns true if successful, false otherwise
 */
export async function signOutUser(): Promise<boolean> {
  try {
    const supabase = createClient();
    
    await supabase.auth.signOut();
    
    // Clear local storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('profile_setup');
    
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    return false;
  }
}

/**
 * Sign in with magic link
 * Returns error if any
 */
export async function signInWithMagicLink(email: string, redirectUrl: string): Promise<{ error: Error | null }> {
  try {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if (!email || !emailRegex.test(email.toLowerCase())) {
      return { error: new Error('Please enter a valid email address') };
    }
    
    const supabase = createClient();
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    return { error };
  } catch (error) {
    console.error('Error signing in:', error);
    return { error: error as Error };
  }
}
