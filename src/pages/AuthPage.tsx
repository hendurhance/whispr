/* eslint-disable @typescript-eslint/no-explicit-any */
// AuthPage.tsx (Updated)
import React, { useState, useEffect, useRef } from 'react';
import AuthTemplate from '../templates/AuthTemplate';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

const AuthPage: React.FC = () => {
  const { signIn, user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const redirectChecked = useRef(false);
  
  // Handle the case where user is redirected here from an expired link
  const queryParams = new URLSearchParams(window.location.search);
  const redirectError = queryParams.get('error');
  const errorMessage = queryParams.get('error_description');
  
  // Set error from query params if present
  useEffect(() => {
    if (redirectError && errorMessage) {
      setError(decodeURIComponent(errorMessage.replace(/\+/g, ' ')));
    }
  }, [redirectError, errorMessage]);
  
  // If user is already logged in, redirect to appropriate page
  useEffect(() => {
    if (redirectChecked.current) return;
    
    // Skip redirect check if we're displaying an error from query params
    if (redirectError) {
      redirectChecked.current = true;
      return;
    }
    
    // Only check for redirect once loading is complete
    if (isLoading) return;
    
    redirectChecked.current = true;
    console.log("AuthPage: Redirect check, user:", !!user, "profile:", !!profile);
    
    if (user) {
      // User is authenticated, redirect based on profile status
      if (profile) {
        console.log("AuthPage: User has profile, redirecting to dashboard");
        navigate('/dashboard', { replace: true });
      } else {
        console.log("AuthPage: User needs profile setup, redirecting");
        navigate('/setup-profile', { replace: true });
      }
    }
  }, [user, profile, isLoading, navigate, redirectError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Send magic link using Supabase
      const { error } = await signIn(email);
      
      if (error) {
        throw error;
      }
      
      setIsEmailSent(true);
    } catch (error: any) {
      console.error('Error sending magic link:', error);
      setError(error.message || 'Failed to send magic link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking auth state (with a shorter timeout)
  if (isLoading && !redirectChecked.current) {
    return (
      <div className="min-h-screen bg-background-darkest flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <svg className="animate-spin h-full w-full text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-text-bright">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  // If already authenticated, we'll redirect in the effect above
  // Otherwise, show the login form
  return (
    <AuthTemplate>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-bright mb-2">Welcome to Whispr</h1>
        <p className="text-text-muted">Sign in or create an account to get started</p>
      </div>

      {!isEmailSent ? (
        <>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-bright mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-background-darkest border border-overlay-light focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-text-bright placeholder-text-muted"
                required
              />
            </div>
            
            {error && (
              <div className="bg-accent-pink/10 text-accent-pink rounded-lg p-3 text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 bg-gradient-primary text-white rounded-xl font-medium transition-all ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-glow'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Link...
                </span>
              ) : (
                'Send Magic Link'
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-overlay-light text-center">
            <p className="text-text-muted text-sm">
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and{' '}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </>
      ) : (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-semibold text-text-bright">Check your inbox</h2>
          
          <p className="text-text-muted">
            We've sent a magic link to <span className="text-text-bright font-medium">{email}</span>
          </p>
          
          <p className="text-text-muted text-sm">
            Click the link in the email to sign in to your account. If you don't see it, check your spam folder.
          </p>
          
          <button
            onClick={() => setIsEmailSent(false)}
            className="mt-4 text-primary hover:text-primary-light transition-colors"
          >
            Use a different email
          </button>
        </div>
      )}
    </AuthTemplate>
  );
};

export default AuthPage;