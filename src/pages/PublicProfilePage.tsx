/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import supabase from '../lib/supabase';
import { toast } from 'react-hot-toast';
import Logo from '../atoms/Logo';
import FooterSimple from '../organisms/Shared/FooterSimple';
import WhisprSubmissionForm from '../organisms/PublicProfile/WhisprSubmissionForm';

// Define API endpoints for edge functions
const API_ENDPOINTS = {
  updateViews: `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/update-profile-views`,
  updateWhisprCount: `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/update-whispr-count`,
  submitWhispr: `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/submit-whispr`
};

interface PublicProfileData {
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  totalWhisprs: number;
  displaySocialLinks: boolean;
  socialLinks: Array<{
    id: string;
    platform: string;
    url: string;
    displayOrder: number;
  }>;
  allowAnonymous: boolean;
  showQuestionTypes: boolean;
  selectedTheme: string;
  selectedBackground: string;
}

const PublicProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PublicProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [viewUpdated, setViewUpdated] = useState(false);
  
  // Get background color based on the profile's selectedBackground
  const getBackgroundColor = (backgroundType: string) => {
    switch (backgroundType) {
      case 'black': return 'bg-black';
      case 'dark-gray': return 'bg-zinc-900';
      case 'navy': return 'bg-blue-950';
      case 'dark-purple': return 'bg-purple-950';
      default: return 'bg-[#101027]'; // Default dark navy background
    }
  };
  
  // Get background color CSS value based on the profile's selectedBackground
  const getBackgroundColorValue = (backgroundType: string) => {
    switch (backgroundType) {
      case 'black': return '#000000';
      case 'dark-gray': return '#18181b'; // Tailwind zinc-900
      case 'navy': return '#172554'; // Tailwind blue-950
      case 'dark-purple': return '#581c87'; // Tailwind purple-950
      default: return '#101027'; // Default dark navy background
    }
  };
  
  // Update profile views when page loads
  const updateProfileViews = async (username: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.updateViews, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Failed to update profile views:', data.error);
        return;
      }
      
      console.log('Profile views updated:', data);
      setViewUpdated(true);
    } catch (error) {
      console.error('Error updating profile views:', error);
    }
  };
  
  // Update whispr count after submission
  const updateWhisprCount = async (username: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.updateWhisprCount, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Failed to update whispr count:', data.error);
        return null;
      }
      
      console.log('Whispr count updated:', data);
      return data.whisprs; // Return the new whispr count
    } catch (error) {
      console.error('Error updating whispr count:', error);
      return null;
    }
  };
  
  // Submit a whispr via edge function
  const submitWhispr = async (username: string, content: string, type: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.submitWhispr, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, content, type })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Failed to submit whispr:', data.error);
        throw new Error(data.error || 'Failed to submit whispr');
      }
      
      console.log('Whispr submitted successfully:', data);
      return data;
    } catch (error) {
      console.error('Error submitting whispr:', error);
      throw error;
    }
  };
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) {
        setError('Username not provided');
        setIsLoading(false);
        return;
      }
      
      try {
        // Fetch the profile
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            username,
            display_name,
            avatar_url,
            bio,
            user_id,
            total_whisprs,
            display_social_links,
            allow_anonymous,
            show_question_types,
            selected_theme,
            selected_background
          `)
          .eq('username', username)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          setError('Profile not found');
          setIsLoading(false);
          return;
        }
        
        // If profile exists, fetch social links if enabled
        let socialLinks = [];
        if (data && data.display_social_links) {
          const { data: links, error: linksError } = await supabase
            .from('social_links')
            .select('*')
            .eq('user_id', data.user_id)
            .order('display_order', { ascending: true });
          
          if (!linksError && links) {
            socialLinks = links;
          }
        }
        
        // Set the profile data
        setProfile({
          username: data.username,
          displayName: data.display_name,
          avatarUrl: data.avatar_url,
          bio: data.bio,
          totalWhisprs: data.total_whisprs || 0,
          displaySocialLinks: data.display_social_links,
          socialLinks,
          allowAnonymous: data.allow_anonymous,
          showQuestionTypes: data.show_question_types,
          selectedTheme: data.selected_theme,
          selectedBackground: data.selected_background
        });
        
        // Set body background color based on the user's selected background
        document.body.style.backgroundColor = getBackgroundColorValue(data.selected_background);
        
        setIsLoading(false);
        
        // Update profile views once profile is fetched
        if (!viewUpdated) {
          updateProfileViews(data.username);
        }
      } catch (error) {
        console.error('Error in fetchProfile:', error);
        setError('Error loading profile');
        setIsLoading(false);
      }
    };
    
    fetchProfile();
    
    // Reset body background color when component unmounts
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [username, viewUpdated]);
  
  // Handle successful whispr submission
  const handleSubmitSuccess = async () => {
    setSubmitSuccess(true);
    toast.success('Your whispr has been sent!');
    
    // Update whispr count via edge function
    if (profile) {
      const newWhisprCount = await updateWhisprCount(profile.username);
      
      if (newWhisprCount !== null) {
        // Update the profile state with the new count
        setProfile({
          ...profile,
          totalWhisprs: newWhisprCount
        });
      } else {
        // If edge function failed, just increment locally
        setProfile({
          ...profile,
          totalWhisprs: profile.totalWhisprs + 1
        });
      }
    }
    
    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 3000);
  };
  
  // Handle error in whispr submission
  const handleSubmitError = (error: any) => {
    toast.error('Failed to send whispr');
    console.error('Whispr submission error:', error);
  };
  
  // Get theme gradient class based on selected theme
  const getThemeGradient = (theme: string) => {
    switch (theme) {
      case 'purple-pink': return 'bg-gradient-to-r from-purple-600 to-pink-500';
      case 'blue-teal': return 'bg-gradient-to-r from-blue-500 to-teal-400';
      case 'orange-red': return 'bg-gradient-to-r from-orange-500 to-red-500';
      case 'green-cyan': return 'bg-gradient-to-r from-green-500 to-cyan-400';
      case 'indigo-purple': return 'bg-gradient-to-r from-indigo-500 to-purple-500';
      default: return 'bg-gradient-to-r from-purple-600 to-pink-500';
    }
  };
  
  // Background color to use throughout the page
  const pageBackground = profile ? getBackgroundColor(profile.selectedBackground) : 'bg-[#101027]';
  
  // Loading state
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${pageBackground}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }
  
  // Error state
  if (error || !profile) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${pageBackground} text-white p-6`}>
        <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
        <p className="text-gray-400 mb-6">This username doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-white text-black rounded-lg font-medium"
        >
          Go Home
        </button>
      </div>
    );
  }
  
  // Profile found but anonymous messages disabled
  if (!profile.allowAnonymous) {
    return (
      <div className={`min-h-screen flex flex-col ${pageBackground}`}>
        {/* Header with Logo */}
        <header className="py-4 px-6 flex justify-between items-center">
          <Logo />
          <Link to="/" className="text-text-muted hover:text-text-bright text-sm">
            Create your own
          </Link>
        </header>
        
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-xl overflow-hidden bg-background-card border border-overlay-light">
            <div className={`h-20 ${getThemeGradient(profile.selectedTheme)}`}></div>
            <div className="p-6 relative">
              <div className="absolute -top-10 left-6">
                <div className="w-20 h-20 rounded-full border-4 border-background-card overflow-hidden bg-background-highlight">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={profile.displayName || profile.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl text-white">
                      {(profile.displayName || profile.username).charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-10">
                <h1 className="text-xl font-bold text-text-bright">{profile.displayName || profile.username}</h1>
                <p className="text-text-muted">@{profile.username}</p>
                
                {profile.bio && (
                  <p className="mt-4 text-text-bright">{profile.bio}</p>
                )}
                
                <div className="mt-6 text-center">
                  <p className="text-text-bright mb-2">Anonymous messages are disabled</p>
                  <p className="text-text-muted text-sm">
                    {profile.displayName || profile.username} is not accepting anonymous whisprs at this time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <FooterSimple />
      </div>
    );
  }
  
  // Normal profile view with submission form
  return (
    <div className={`min-h-screen flex flex-col ${pageBackground}`}>
      {/* Header with Logo */}
      <header className="py-4 px-6 flex justify-between items-center">
        <Logo />
        <Link to="/" className="text-text-muted hover:text-text-bright text-sm">
          Create your own
        </Link>
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full rounded-xl overflow-hidden bg-background-card border border-overlay-light mb-6">
          <div className={`h-20 ${getThemeGradient(profile.selectedTheme)}`}></div>
          <div className="p-6 relative">
            <div className="absolute -top-10 left-6">
              <div className="w-20 h-20 rounded-full border-4 border-background-card overflow-hidden bg-background-highlight">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.displayName || profile.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl text-white">
                    {(profile.displayName || profile.username).charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-10">
              <h1 className="text-xl font-bold text-text-bright">{profile.displayName || profile.username}</h1>
              <p className="text-text-muted">@{profile.username}</p>
              
              {profile.bio && (
                <p className="mt-4 text-text-bright">{profile.bio}</p>
              )}
              
              <div className="mt-4 text-text-muted text-sm">
                {profile.totalWhisprs} {profile.totalWhisprs === 1 ? 'whispr' : 'whisprs'} received
              </div>
              
              {profile.displaySocialLinks && profile.socialLinks.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-text-muted mb-2">Connect with me</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.socialLinks.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-full text-sm bg-background-highlight text-text-bright hover:bg-background-lighter transition-colors"
                      >
                        {link.platform}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Submission Form */}
        {submitSuccess ? (
          <div className="max-w-md w-full bg-background-card rounded-xl border border-overlay-light p-6 text-center">
            <div className="text-4xl mb-4">✓</div>
            <h2 className="text-lg font-semibold text-text-bright mb-2">Whispr Sent!</h2>
            <p className="text-text-muted">Your anonymous message has been delivered successfully.</p>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="mt-4 px-4 py-2 bg-gradient-primary text-white rounded-lg"
            >
              Send Another
            </button>
          </div>
        ) : (
          <WhisprSubmissionForm
            username={profile.username}
            onSuccess={handleSubmitSuccess}
            onError={handleSubmitError}
            className="max-w-md w-full"
            submitWhispr={submitWhispr}
          />
        )}
      </div>
      
      <FooterSimple />
    </div>
  );
};

export default PublicProfilePage;