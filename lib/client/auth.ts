import { createClient } from '@/utils/supabase/client';

export async function signOutUser(): Promise<boolean> {
  try {
    const supabase = createClient();
    
    await supabase.auth.signOut();

    localStorage.removeItem('auth_token');
    localStorage.removeItem('profile_setup');
    
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    return false;
  }
}

export async function signInWithMagicLink(email: string, redirectUrl: string): Promise<{ error: Error | null }> {
  try {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if (!email || !emailRegex.test(email.toLowerCase())) {
      return { error: new Error('Please enter a valid email address') };
    }
    
    const supabase = createClient();
    
    let finalRedirectUrl = redirectUrl;
    if (finalRedirectUrl && !finalRedirectUrl.startsWith('http://') && !finalRedirectUrl.startsWith('https://')) {
      finalRedirectUrl = `https://${finalRedirectUrl}`;
    }
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: finalRedirectUrl,
      },
    });

    return { error };
  } catch (error) {
    console.error('Error signing in:', error);
    return { error: error as Error };
  }
}
