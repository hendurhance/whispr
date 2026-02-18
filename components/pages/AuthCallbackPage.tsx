'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const AuthCallbackPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (!data?.session?.user) {
          throw new Error("Authentication failed. Please try again.");
        }
        
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.session.user.id)
          .single();
        
        if (profileData) {
          localStorage.setItem('profile_setup', 'true');
          router.replace('/dashboard');
        } else {
          localStorage.setItem('profile_setup', 'false');
          router.replace('/setup-profile');
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Authentication failed";
        setError(errorMessage);
        router.replace(`/auth?error=auth_callback_error&error_description=${encodeURIComponent(errorMessage || "Authentication failed")}`);
      }
    };
    
    handleAuthCallback();
  }, [router, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-darkest">
      <div className="text-center">
        {error ? (
          <div className="text-accent-pink">
            <h2 className="text-xl font-bold mb-2">Authentication Error</h2>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-4">
              <svg className="animate-spin h-full w-full text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-text-bright">Finalizing authentication...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallbackPage;