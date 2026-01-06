import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { FUNCTIONS } from '@/configs';
import { signOutUser } from '@/lib/client/auth';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/types';
import {
    USERNAME_MIN_LENGTH,
    USERNAME_MAX_LENGTH,
    BIO_MAX_LENGTH,
    validateUsername,
    sanitizeUsername
} from '@/utils/validation';

interface UseSettingProps {
    initialUser: User;
    initialProfile: Profile | null;
}

/**
 * Hook for managing user settings without AuthProvider dependency
 * Uses server-provided data passed as props
 */
export const useSetting = ({ initialUser, initialProfile }: UseSettingProps) => {
    const router = useRouter();
    const supabase = createClient();

    // Form state
    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [emailNotifications, setEmailNotifications] = useState(true);

    // UI state
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Keep track of previous avatar URL to detect changes
    const prevAvatarUrlRef = useRef('');
    // Store debounce timer for username availability check
    const usernameDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Keep reference to initial data to avoid re-initialization
    const initializedRef = useRef(false);

    // Initialize form with server-provided data (only once)
    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;

        // Use user metadata as fallback
        setUsername(initialUser.user_metadata?.username || '');
        setAvatarUrl(initialUser.user_metadata?.avatar_url || '');
        prevAvatarUrlRef.current = initialUser.user_metadata?.avatar_url || '';

        // If profile exists, use that data
        if (initialProfile) {
            setUsername(initialProfile.username || '');
            setDisplayName(initialProfile.display_name || '');
            setBio(initialProfile.bio || '');
            setAvatarUrl(initialProfile.avatar_url || '');
            prevAvatarUrlRef.current = initialProfile.avatar_url || '';

            // Set email notification preference
            setEmailNotifications(initialProfile.email_notifications ?? true);
        }
    }, [initialUser, initialProfile]);

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (usernameDebounceRef.current) {
                clearTimeout(usernameDebounceRef.current);
            }
        };
    }, []);

    // Function to check username availability
    const checkUsernameAvailability = async (value: string) => {
        const currentUsername = (initialProfile?.username || initialUser.user_metadata?.username)?.toLowerCase().trim();
        const normalizedValue = value.toLowerCase().trim();

        if (!normalizedValue || normalizedValue === currentUsername) {
            setIsUsernameAvailable(null);
            return;
        }

        // Use shared validation
        const validation = validateUsername(normalizedValue);
        if (!validation.valid) {
            setIsUsernameAvailable(false);
            return;
        }

        setIsCheckingUsername(true);
        try {
            // Check if username exists in database
            const { data, error } = await supabase
                .from('profiles')
                .select('username')
                .eq('username', normalizedValue)
                .neq('user_id', initialUser.id)
                .single();

            // Username is available if no data returned or error is "no rows returned"
            setIsUsernameAvailable(error?.code === 'PGRST116' || !data);
        } catch (error) {
            console.error('Error checking username:', error);
            setIsUsernameAvailable(false);
        } finally {
            setIsCheckingUsername(false);
        }
    };

    // Handle username change with debounce and sanitization
    const handleUsernameChange = (value: string) => {
        const sanitizedValue = sanitizeUsername(value);
        setUsername(sanitizedValue);

        // Debounce check - clear previous timer then set a new one
        if (usernameDebounceRef.current) {
            clearTimeout(usernameDebounceRef.current);
        }

        usernameDebounceRef.current = setTimeout(() => {
            checkUsernameAvailability(sanitizedValue);
        }, 500);
    };

    // Handle bio change with length validation
    const handleBioChange = (value: string) => {
        // Enforce max length by truncating any excess characters
        const nextBio = value.length > BIO_MAX_LENGTH ? value.slice(0, BIO_MAX_LENGTH) : value;
        setBio(nextBio);
    };

    // Refresh profile - triggers server-side refetch
    const refreshProfile = async () => {
        router.refresh();
    };

    // Save profile changes
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const currentUsername = (initialProfile?.username || initialUser.user_metadata?.username)?.toLowerCase().trim();
        const normalizedUsername = username.toLowerCase().trim();

        // Validate username using shared validation
        const usernameValidation = validateUsername(normalizedUsername);
        if (!usernameValidation.valid) {
            setError(usernameValidation.error || 'Invalid username');
            return;
        }

        if (!isUsernameAvailable && normalizedUsername !== currentUsername) {
            setError('Username is not available');
            return;
        }

        // Trim bio and validate length (check trimmed length to prevent whitespace-only bios)
        const trimmedBio = bio.trim();
        if (trimmedBio.length > BIO_MAX_LENGTH) {
            setError(`Bio must be ${BIO_MAX_LENGTH} characters or less`);
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccessMessage(null);

        try {
            // Check if avatar URL has changed
            if (avatarUrl !== prevAvatarUrlRef.current) {
                const { error: updateUserError } = await supabase.auth.updateUser({
                    data: { avatar_url: avatarUrl }
                });

                if (updateUserError) throw updateUserError;
            }

            // If profile exists, update it
            if (initialProfile) {
                // Update profile in database
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({
                        username: normalizedUsername,
                        display_name: displayName || normalizedUsername,
                        bio: trimmedBio,
                        avatar_url: avatarUrl,
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_id', initialUser.id);

                if (updateError) throw updateError;
            } else {
                // Create profile if it doesn't exist
                const { error: insertError } = await supabase
                    .from('profiles')
                    .insert([{
                        user_id: initialUser.id,
                        username: normalizedUsername,
                        display_name: displayName || username,
                        bio: trimmedBio,
                        avatar_url: avatarUrl,
                        created_at: new Date().toISOString()
                    }]);

                if (insertError) throw insertError;
            }

            // Always update user metadata
            const { error: userUpdateError } = await supabase.auth.updateUser({
                data: {
                    profile_setup: true,
                    username: username.toLowerCase(),
                    avatar_url: avatarUrl
                }
            });

            if (userUpdateError) throw userUpdateError;

            // Update local storage
            localStorage.setItem('profile_setup', 'true');

            // Update ref to new avatar URL
            prevAvatarUrlRef.current = avatarUrl;

            // Force refresh to get latest data from server
            await refreshProfile();

            setSuccessMessage('Profile updated successfully!');

            // Hide success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update profile. Please try again.';
            console.error('Error updating profile:', errorMessage);
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Toggle email notifications
    const handleToggleNotifications = async () => {
        setEmailNotifications(!emailNotifications);
        // Actual database update is handled in the EmailSettings component

        // Refresh profile to get updated notification preferences
        setTimeout(() => {
            refreshProfile();
        }, 500);
    };

    // Delete account
    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        setError(null);

        try {
            // Get the current session token
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                throw new Error('Not authenticated');
            }

            const response = await fetch(
                FUNCTIONS.DELETE_USER,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.access_token}`
                    },
                    method: 'POST',
                }
            );

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || `Server responded with ${response.status}`);
            }

            // Sign out and redirect
            await signOutUser();
            router.push('/');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete account. Please try again.';
            console.error('Error deleting account:', error);
            setError(errorMessage);
            setIsDeleting(false);
        }
    };

    return {
        // Form values
        username,
        displayName,
        bio,
        avatarUrl,
        emailNotifications,

        // UI state
        isCheckingUsername,
        isUsernameAvailable,
        isSubmitting,
        isDeleting,
        error,
        successMessage,

        // Handlers
        handleUsernameChange,
        setDisplayName,
        setBio,
        handleBioChange,
        setAvatarUrl,
        handleToggleNotifications,
        handleSubmit,
        handleDeleteAccount,

        // Constants (for UI display)
        USERNAME_MIN_LENGTH,
        USERNAME_MAX_LENGTH,
        BIO_MAX_LENGTH
    };
};