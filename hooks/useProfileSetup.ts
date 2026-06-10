import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useStaticAuth } from '@/context/StaticAuthContext';
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
  const { user: authUser } = useStaticAuth();

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');

  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRequestIdRef = useRef<number>(0);

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      if (authUser) {
        setUser(authUser);

        if (authUser.user_metadata?.profile_setup) {
          router.replace('/dashboard');
          return;
        }
      } else {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user) {
          router.replace('/auth');
          return;
        }

        setUser(data.user);

        if (data.user.user_metadata?.profile_setup) {
          router.replace('/dashboard');
        }
      }
    };

    checkUserAndRedirect();
  }, [router, authUser]);

  useEffect(() => {
    generateDefaultAvatar();
  }, []);

  const generateDefaultAvatar = useCallback((seed?: string) => {
    const avatarSeed = seed || Math.random().toString(36).substring(2, 10);
    const dicebearUrl = `https://api.dicebear.com/9.x/personas/svg?seed=${avatarSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
    setAvatarPreview(dicebearUrl);
    setAvatarUrl(dicebearUrl);
  }, []);

  const checkAvailability = useCallback(async (value: string) => {
    const normalizedValue = value.toLowerCase().trim();

    const validation = validateUsername(normalizedValue);
    if (!validation.valid) {
      setIsAvailable(false);
      return;
    }

    const requestId = ++latestRequestIdRef.current;

    setIsChecking(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', normalizedValue)
        .single();

      if (requestId !== latestRequestIdRef.current) {
        return;
      }

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setIsAvailable(!data);
    } catch (error) {
      if (requestId === latestRequestIdRef.current) {
        console.error('Error checking username:', error);
        setIsAvailable(false);
      }
    } finally {
      if (requestId === latestRequestIdRef.current) {
        setIsChecking(false);
      }
    }
  }, []);

  const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeUsername(e.target.value);
    setUsername(sanitizedValue);

    if (sanitizedValue.length === 0) {
      setIsAvailable(null);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      checkAvailability(sanitizedValue);
    }, 500);
  }, [checkAvailability]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleBioChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const nextBio = value.length > BIO_MAX_LENGTH ? value.slice(0, BIO_MAX_LENGTH) : value;
    setBio(nextBio);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAvailable || !username || !user) return;

    const normalizedUsername = username.toLowerCase().trim();
    const usernameValidation = validateUsername(normalizedUsername);
    if (!usernameValidation.valid) {
      setError(usernameValidation.error || 'Invalid username');
      return;
    }

    const trimmedBio = bio.trim();
    if (trimmedBio.length > BIO_MAX_LENGTH) {
      setError(`Bio must be ${BIO_MAX_LENGTH} characters or less`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: user.id,
            username: normalizedUsername,
            display_name: normalizedUsername,
            bio: trimmedBio,
            avatar_url: avatarUrl,
            created_at: new Date().toISOString()
          }
        ]);

      if (profileError) throw profileError;

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          profile_setup: true,
          username: username.toLowerCase(),
          avatar_url: avatarUrl
        }
      });

      if (updateError) throw updateError;

      localStorage.setItem('profile_setup', 'true');
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
    username,
    bio,
    avatarUrl,
    avatarPreview,

    isAvailable,
    isChecking,
    isSubmitting,
    error,

    setUsername,
    setBio,
    handleUsernameChange,
    handleBioChange,
    generateDefaultAvatar,
    handleSubmit,

    USERNAME_MIN_LENGTH,
    USERNAME_MAX_LENGTH,
    BIO_MAX_LENGTH
  };
};
