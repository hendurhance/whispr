/* eslint-disable @typescript-eslint/no-explicit-any */
// AuthCallbackPage.tsx (Updated)
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabase';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log("AuthCallback: Processing auth redirect");
      
      try {
        // Get auth parameters from URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("AuthCallback: Error getting session", error);
          throw error;
        }
        
        if (!data?.session?.user) {
          console.error("AuthCallback: No user found in session");
          throw new Error("Authentication failed. Please try again.");
        }
        
        console.log("AuthCallback: User authenticated successfully");
        
        // Check if user has a profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.session.user.id)
          .single();
        
        console.log("AuthCallback: Profile check complete", profileData, profileError);
        
        // Set profile setup flag in localStorage
        if (profileData) {
          localStorage.setItem('profile_setup', 'true');
          // Redirect to dashboard
          navigate('/dashboard', { replace: true });
        } else {
          localStorage.setItem('profile_setup', 'false');
          // Redirect to profile setup
          navigate('/setup-profile', { replace: true });
        }
      } catch (error: any) {
        console.error("AuthCallback: Error processing callback", error);
        setError(error.message || "Authentication failed");
        // Redirect to auth page with error
        navigate(`/auth?error=auth_callback_error&error_description=${encodeURIComponent(error.message || "Authentication failed")}`, { replace: true });
      }
    };
    
    handleAuthCallback();
  }, [navigate]);

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