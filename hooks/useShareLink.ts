import { useState, useCallback } from 'react';

interface ShareLinkOptions {
    title?: string;
    text?: string;
    copyFallback?: boolean;
}

export const useShareLink = () => {
    const [copied, setCopied] = useState(false);
    const [shareError, setShareError] = useState<string | null>(null);

    const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
        if (typeof window === 'undefined' || typeof navigator === 'undefined') {
            return false;
        }

        try {
            if (!text.startsWith('http://') && !text.startsWith('https://')) {
                text = 'https://' + text;
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                return true;
            }

            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                return true;
            } else {
                throw new Error('Copy command failed');
            }
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            setShareError('Failed to copy to clipboard');
            setTimeout(() => setShareError(null), 3000);
            return false;
        }
    }, []);

    const shareLink = useCallback(async (
        url: string,
        options: ShareLinkOptions = {}
    ): Promise<boolean> => {
        const { title = '', text = '', copyFallback = true } = options;

        try {
            setShareError(null);
            
            if (typeof window === 'undefined') {
                return false;
            }

            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            if (navigator?.share) {
                await navigator.share({
                    title,
                    text,
                    url: url
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
