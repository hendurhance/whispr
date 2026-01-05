import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/context/auth';
import { User } from '@supabase/supabase-js';
import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  BIO_MAX_LENGTH,
  validateUsername,
  sanitizeUsername
} from '@/utils/validation';

const supabase = createClient();

export const useProfileSetup = () => {
  const router = useRouter();
  const { user: authUser } = useAuth();

  // Form state
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');

  // UI state
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Debounce timer ref
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check if user is authenticated and redirect if needed
  useEffect(() => {
    const checkUserAndRedirect = async () => {
      // First check for user from auth context
      if (authUser) {
        setUser(authUser);

        // If user already has profile setup, redirect to dashboard
        if (authUser.user_metadata?.profile_setup) {
          router.replace('/dashboard');
          return;
        }
      } else {
        // Fallback to direct Supabase call if not available in context
        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user) {
          // If no user, redirect to auth page
          router.replace('/auth');
          return;
        }

        setUser(data.user);

        // If user already has profile setup, redirect to dashboard
        if (data.user.user_metadata?.profile_setup) {
          router.replace('/dashboard');
        }
      }
    };

    checkUserAndRedirect();
  }, [router, authUser]);

  // Initialize default avatar when component mounts
  useEffect(() => {
    generateDefaultAvatar();
  }, []);

  // Generate a random avatar using Dicebear API
  const generateDefaultAvatar = useCallback((seed?: string) => {
    const avatarSeed = seed || Math.random().toString(36).substring(2, 10);
    const dicebearUrl = `https://api.dicebear.com/9.x/personas/svg?seed=${avatarSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
    setAvatarPreview(dicebearUrl);
    setAvatarUrl(dicebearUrl);
  }, []);

  // Check username availability in the database
  const checkAvailability = useCallback(async (value: string) => {
    const normalizedValue = value.toLowerCase().trim();

    // Use shared validation
    const validation = validateUsername(normalizedValue);
    if (!validation.valid) {
      setIsAvailable(false);
      return;
    }

    setIsChecking(true);
    try {
      // Check if username exists in database
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', normalizedValue)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
        throw error;
      }

      // Username is available if no data returned
      setIsAvailable(!data);
    } catch (error) {
      console.error('Error checking username:', error);
      setIsAvailable(false);
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Debounced username check
  const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeUsername(e.target.value);
    setUsername(sanitizedValue);

    if (sanitizedValue.length === 0) {
      setIsAvailable(null);
      return;
    }

    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce check to avoid too many API calls
    debounceTimerRef.current = setTimeout(() => {
      checkAvailability(sanitizedValue);
    }, 500);
  }, [checkAvailability]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Handle bio change with length validation
  const handleBioChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Enforce max length
    if (value.length <= BIO_MAX_LENGTH) {
      setBio(value);
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAvailable || !username || !user) return;

    // Validate username using shared validation
    const normalizedUsername = username.toLowerCase().trim();
    const usernameValidation = validateUsername(normalizedUsername);
    if (!usernameValidation.valid) {
      setError(usernameValidation.error || 'Invalid username');
      return;
    }

    // Validate bio length
    if (bio.length > BIO_MAX_LENGTH) {
      setError(`Bio must be ${BIO_MAX_LENGTH} characters or less`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // First, insert the profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: user.id,
            username: normalizedUsername,
            display_name: username,
            bio: bio.trim(),
            avatar_url: avatarUrl,
            created_at: new Date().toISOString()
          }
        ]);

      if (profileError) throw profileError;

      // Then, update user metadata to mark profile as set up
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          profile_setup: true,
          username: username.toLowerCase(),
          avatar_url: avatarUrl
        }
      });

      if (updateError) throw updateError;

      // Update local storage
      localStorage.setItem('profile_setup', 'true');

      // Redirect to dashboard on success
      router.replace('/dashboard');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to set up profile. Please try again.';
      console.error('Error setting up profile:', error);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // Form state
    username,
    bio,
    avatarUrl,
    avatarPreview,

    // UI state
    isAvailable,
    isChecking,
    isSubmitting,
    error,

    // Handlers
    setUsername,
    setBio,
    handleUsernameChange,
    handleBioChange,
    generateDefaultAvatar,
    handleSubmit,

    // Constants (for UI display)
    USERNAME_MIN_LENGTH,
    USERNAME_MAX_LENGTH,
    BIO_MAX_LENGTH
  };
};