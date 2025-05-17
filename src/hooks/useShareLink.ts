import { useState, useCallback } from 'react';

interface ShareLinkOptions {
    title?: string;
    text?: string;
    copyFallback?: boolean;
}

export const useShareLink = () => {
    const [copied, setCopied] = useState(false);
    const [shareError, setShareError] = useState<string | null>(null);

    // Copy text to clipboard
    const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            return true;
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            setShareError('Failed to copy to clipboard');
            setTimeout(() => setShareError(null), 3000);
            return false;
        }
    }, []);

    // Share link using Web Share API with clipboard fallback
    const shareLink = useCallback(async (
        url: string,
        options: ShareLinkOptions = {}
    ): Promise<boolean> => {
        const { title = '', text = '', copyFallback = true } = options;

        try {
            setShareError(null);

            // Check if Web Share API is available
            if (navigator.share) {
                await navigator.share({
                    title,
                    text,
                    url
                });
                return true;
            } else if (copyFallback) {
                return await copyToClipboard(url);
            } else {
                setShareError('Sharing not supported on this device');
                setTimeout(() => setShareError(null), 3000);
                return false;
            }
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') {
                return false;
            }

            console.error('Error sharing:', error);
            setShareError(`Couldn't share: ${(error && typeof error === 'object' && 'message' in error) ? error.message : 'Unknown error'}`);
            setTimeout(() => setShareError(null), 3000);
            return false;
        }
    }, [copyToClipboard]);

    return {
        copied,
        shareError,
        copyToClipboard,
        shareLink
    };
};