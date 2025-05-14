import React, { useRef, useState } from 'react';
import { Whispr, formatDate, getWhisprTypeIcon, getWhisprTypeLabel } from '../types/whispr';
import TypeBadge from '../atoms/TypeBadge';
import html2canvas from 'html2canvas-pro';
import { toast } from 'react-hot-toast';
import GenericModal from '../atoms/GenericModal';
import { APP_LOGO_URI } from '../types';

interface ViewWhisprModalProps {
    whispr: Whispr;
    isOpen: boolean;
    onClose: () => void;
    username: string;
    profileUrl: string;
}

const ViewWhisprModal: React.FC<ViewWhisprModalProps> = ({
    whispr,
    isOpen,
    onClose,
    username,
    profileUrl
}) => {
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const whisprCardRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    // Generate image from card
    const generateImage = async (forSharing: boolean = false) => {
    if (!whisprCardRef.current) return;

    setIsGeneratingImage(true);
    const loadingToast = toast.loading('Generating image...');

    try {
        // Create a hidden container for rendering
        const container = document.createElement('div');
        Object.assign(container.style, {
            position: 'fixed',
            left: '-9999px',
            top: '-9999px',
            width: '400px',
            height: 'auto',
            padding: '20px',
            backgroundColor: '#1e293b',
            borderRadius: '0',
            color: 'white',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxSizing: 'border-box',
        });

        // Create the header using CSS Grid for precise alignment
        const header = document.createElement('div');
        Object.assign(header.style, {
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            alignItems: 'center',
            width: '100%',
            marginBottom: '8px',
        });

        // Logo container
        const logoContainer = document.createElement('div');
        Object.assign(logoContainer.style, {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            height: '32px',
        });

        // Create the W logo
        const logo = document.createElement('div');
        Object.assign(logo.style, {
            width: '32px',
            height: '32px',
            borderRadius: '4px',
            backgroundColor: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '18px',
            color: 'white',
            overflow: 'hidden',
        });

        // Add the logo image
        const logoImg = document.createElement('img');
        logoImg.src = APP_LOGO_URI;
        logoImg.alt = 'Logo';
        Object.assign(logoImg.style, {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
        });
        logo.appendChild(logoImg);

        // Domain text
        const domainText = document.createElement('span');
        domainText.textContent = 'trywhispr.me';
        Object.assign(domainText.style, {
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
            lineHeight: '32px', // Matches logo height for perfect vertical alignment
        });

        logoContainer.appendChild(logo);
        logoContainer.appendChild(domainText);

        // Empty middle column for spacing
        const spacer = document.createElement('div');

        // Username
        const usernameElement = document.createElement('span');
        usernameElement.textContent = `@${username}`;
        Object.assign(usernameElement.style, {
            fontSize: '14px',
            color: '#94a3b8',
            lineHeight: '32px',
            textAlign: 'right',
        });

        // Add elements to header
        header.appendChild(logoContainer);
        header.appendChild(spacer);
        header.appendChild(usernameElement);

        // Create the whispr card content
        const cardContent = document.createElement('div');
        Object.assign(cardContent.style, {
            padding: '16px',
            backgroundColor: '#0f172a',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
            boxSizing: 'border-box',
        });

        // Card inner content with strict flexbox alignment
        const cardInner = document.createElement('div');
        Object.assign(cardInner.style, {
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
            width: '100%',
        });

        // Type icon
        const typeIconContainer = document.createElement('div');
        Object.assign(typeIconContainer.style, {
            width: '44px',
            height: '44px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            flexShrink: '0',
        });
        typeIconContainer.textContent = getWhisprTypeIcon(whispr.type);

        // Content area
        const contentArea = document.createElement('div');
        Object.assign(contentArea.style, {
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minWidth: '0',
        });

        // Content header (type and date) with strict alignment
        const contentHeader = document.createElement('div');
        Object.assign(contentHeader.style, {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: '24px', // Fixed height for consistent alignment
        });

        // Type badge
        const typeBadge = document.createElement('span');
        Object.assign(typeBadge.style, {
            backgroundColor: 'rgba(124, 58, 237, 0.2)',
            color: '#a78bfa',
            borderRadius: '9999px',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: '500',
            textTransform: 'capitalize',
            lineHeight: '16px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
        });
        typeBadge.textContent = getWhisprTypeLabel(whispr.type);

        // Date
        const dateSpan = document.createElement('span');
        Object.assign(dateSpan.style, {
            fontSize: '12px',
            color: '#94a3b8',
            lineHeight: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
        });
        dateSpan.textContent = formatDate(whispr.createdAt);

        contentHeader.appendChild(typeBadge);
        contentHeader.appendChild(dateSpan);

        // Content text
        const contentText = document.createElement('p');
        Object.assign(contentText.style, {
            margin: '0',
            fontSize: '16px',
            lineHeight: '1.5',
            color: 'white',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
        });
        contentText.textContent = whispr.content;

        // Add elements to content area
        contentArea.appendChild(contentHeader);
        contentArea.appendChild(contentText);

        // Add elements to card inner
        cardInner.appendChild(typeIconContainer);
        cardInner.appendChild(contentArea);

        // Add inner to card
        cardContent.appendChild(cardInner);

        // Create the footer with call to action
        const footer = document.createElement('div');
        Object.assign(footer.style, {
            backgroundColor: '#0f172a',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#94a3b8',
            textAlign: 'center',
            wordBreak: 'break-all',
            width: '100%',
            boxSizing: 'border-box',
        });
        footer.textContent = `Want to send your own anonymous message? Visit ${profileUrl || 'trywhispr.me/' + username}`;

        // Add all elements to container
        container.appendChild(header);
        container.appendChild(cardContent);
        container.appendChild(footer);

        // Add to document for rendering
        document.body.appendChild(container);

        // Use html2canvas with specific settings
        const canvas = await html2canvas(container, {
            backgroundColor: '#1e293b',
            scale: 2,
            logging: false,
            allowTaint: true,
            useCORS: true,
            removeContainer: false,
        });

        // Clean up
        document.body.removeChild(container);

        // Convert canvas to image data
        const imageData = canvas.toDataURL('image/png');

        // Handle sharing or downloading
        if (forSharing) {
            if (navigator.share) {
                // Web Share API support
                try {
                    // Convert data URL to File
                    const blobBin = atob(imageData.split(',')[1]);
                    const array = [];
                    for (let i = 0; i < blobBin.length; i++) {
                        array.push(blobBin.charCodeAt(i));
                    }
                    const file = new Blob([new Uint8Array(array)], { type: 'image/png' });

                    await navigator.share({
                        title: `Whispr from @${username}`,
                        text: 'Check out this anonymous whispr!',
                        files: [new File([file], 'whispr.png', { type: 'image/png' })],
                    });

                    toast.success('Ready to share!');
                } catch (error) {
                    console.error('Error sharing:', error);
                    // Fallback to downloading
                    downloadImage(imageData);
                }
            } else {
                // Fallback to downloading if Web Share API not available
                downloadImage(imageData);
            }
        } else {
            // Just download the image
            downloadImage(imageData);
        }

        toast.dismiss(loadingToast);
        toast.success(forSharing ? 'Ready to share!' : 'Image downloaded successfully!');
    } catch (error) {
        console.error('Error generating image:', error);
        toast.dismiss(loadingToast);
        toast.error('Failed to generate image');
    } finally {
        setIsGeneratingImage(false);
    }
};

    // Function to handle downloading the image
    const downloadImage = (imageUrl: string) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `whispr-${whispr.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <GenericModal
            title="View Whispr"
            onCancel={onClose}
            cancelText="Close"
        >
            <div className="space-y-6">
                {/* Whispr card for viewing */}
                <div
                    ref={whisprCardRef}
                    className="p-5 bg-background-darkest rounded-xl border border-overlay-light"
                >
                    <div className="flex items-start gap-3">
                        <div className="bg-background-card rounded-lg p-2 text-xl">
                            {getWhisprTypeIcon(whispr.type)}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <TypeBadge type={whispr.type} />
                                <span className="text-xs text-text-muted">{formatDate(whispr.createdAt)}</span>
                            </div>
                            <p className="text-text-bright">{whispr.content}</p>
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => generateImage(false)}
                        disabled={isGeneratingImage}
                        className="flex-1 py-2 px-4 bg-accent-blue/10 text-accent-blue rounded-lg hover:bg-accent-blue/20 transition-colors flex items-center justify-center gap-2"
                    >
                        {isGeneratingImage ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </span>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download Image
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => generateImage(true)}
                        disabled={isGeneratingImage}
                        className="flex-1 py-2 px-4 bg-accent-purple/10 text-accent-purple rounded-lg hover:bg-accent-purple/20 transition-colors flex items-center justify-center gap-2"
                    >
                        {isGeneratingImage ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </span>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                Share
                            </>
                        )}
                    </button>
                </div>
            </div>
        </GenericModal>
    );
};

export default ViewWhisprModal;