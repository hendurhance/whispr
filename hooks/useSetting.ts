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

export const useSetting = ({ initialUser, initialProfile }: UseSettingProps) => {
    const router = useRouter();
    const supabase = createClient();

    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [emailNotifications, setEmailNotifications] = useState(true);

    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const prevAvatarUrlRef = useRef('');
    const usernameDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const initializedRef = useRef(false);

    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;

        setUsername(initialUser.user_metadata?.username || '');
        setAvatarUrl(initialUser.user_metadata?.avatar_url || '');
        prevAvatarUrlRef.current = initialUser.user_metadata?.avatar_url || '';

        if (initialProfile) {
            setUsername(initialProfile.username || '');
            setDisplayName(initialProfile.display_name || '');
            setBio(initialProfile.bio || '');
            setAvatarUrl(initialProfile.avatar_url || '');
            prevAvatarUrlRef.current = initialProfile.avatar_url || '';

            setEmailNotifications(initialProfile.email_notifications ?? true);
        }
    }, [initialUser, initialProfile]);

    useEffect(() => {
        return () => {
            if (usernameDebounceRef.current) {
                clearTimeout(usernameDebounceRef.current);
            }
        };
    }, []);

    const checkUsernameAvailability = async (value: string) => {
        const currentUsername = (initialProfile?.username || initialUser.user_metadata?.username)?.toLowerCase().trim();
        const normalizedValue = value.toLowerCase().trim();

        if (!normalizedValue || normalizedValue === currentUsername) {
            setIsUsernameAvailable(null);
            return;
        }

        const validation = validateUsername(normalizedValue);
        if (!validation.valid) {
            setIsUsernameAvailable(false);
            return;
        }

        setIsCheckingUsername(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('username')
                .eq('username', normalizedValue)
                .neq('user_id', initialUser.id)
                .single();

            setIsUsernameAvailable(error?.code === 'PGRST116' || !data);
        } catch (error) {
            console.error('Error checking username:', error);
            setIsUsernameAvailable(false);
        } finally {
            setIsCheckingUsername(false);
        }
    };

    const handleUsernameChange = (value: string) => {
        const sanitizedValue = sanitizeUsername(value);
        setUsername(sanitizedValue);

        if (usernameDebounceRef.current) {
            clearTimeout(usernameDebounceRef.current);
        }

        usernameDebounceRef.current = setTimeout(() => {
            checkUsernameAvailability(sanitizedValue);
        }, 500);
    };

    const handleBioChange = (value: string) => {
        const nextBio = value.length > BIO_MAX_LENGTH ? value.slice(0, BIO_MAX_LENGTH) : value;
        setBio(nextBio);
    };

    const refreshProfile = async () => {
        router.refresh();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const currentUsername = (initialProfile?.username || initialUser.user_metadata?.username)?.toLowerCase().trim();
        const normalizedUsername = username.toLowerCase().trim();

        const usernameValidation = validateUsername(normalizedUsername);
        if (!usernameValidation.valid) {
            setError(usernameValidation.error || 'Invalid username');
            return;
        }

        if (!isUsernameAvailable && normalizedUsername !== currentUsername) {
            setError('Username is not available');
            return;
        }

        const trimmedBio = bio.trim();
        if (trimmedBio.length > BIO_MAX_LENGTH) {
            setError(`Bio must be ${BIO_MAX_LENGTH} characters or less`);
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccessMessage(null);

        try {
            if (avatarUrl !== prevAvatarUrlRef.current) {
                const { error: updateUserError } = await supabase.auth.updateUser({
                    data: { avatar_url: avatarUrl }
                });

                if (updateUserError) throw updateUserError;
            }

            if (initialProfile) {
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

            const { error: userUpdateError } = await supabase.auth.updateUser({
                data: {
                    profile_setup: true,
                    username: username.toLowerCase(),
                    avatar_url: avatarUrl
                }
            });

            if (userUpdateError) throw userUpdateError;

            localStorage.setItem('profile_setup', 'true');
            prevAvatarUrlRef.current = avatarUrl;
            await refreshProfile();

            setSuccessMessage('Profile updated successfully!');

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

    const handleToggleNotifications = async () => {
        setEmailNotifications(!emailNotifications);
        setTimeout(() => {
            refreshProfile();
        }, 500);
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        setError(null);

        try {
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
        username,
        displayName,
        bio,
        avatarUrl,
        emailNotifications,

        isCheckingUsername,
        isUsernameAvailable,
        isSubmitting,
        isDeleting,
        error,
        successMessage,

        handleUsernameChange,
        setDisplayName,
        setBio,
        handleBioChange,
        setAvatarUrl,
        handleToggleNotifications,
        handleSubmit,
        handleDeleteAccount,

        USERNAME_MIN_LENGTH,
        USERNAME_MAX_LENGTH,
        BIO_MAX_LENGTH
    };
};
