import { useState } from 'react';
import html2canvas from 'html2canvas-pro';
import { toast } from 'react-hot-toast';
import { Whispr, getWhisprTypeIcon, getWhisprTypeLabel, formatDate } from '../types/whispr';
import { APP_LOGO_URI } from '../types';
import { APP_URL_CLEAN } from '../configs';

interface UseWhisprImageProps {
  username: string;
  profileUrl: string;
}

/**
 * Custom hook for generating and sharing whispr images
 */
export const useWhisprImage = ({ username, profileUrl }: UseWhisprImageProps) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  /**
   * Converts a data URL to a File object
   */
  const dataURLtoFile = (dataUrl: string, filename: string): File => {
    const blobBin = atob(dataUrl.split(',')[1]);
    const array = [];
    for (let i = 0; i < blobBin.length; i++) {
      array.push(blobBin.charCodeAt(i));
    }
    const file = new Blob([new Uint8Array(array)], { type: 'image/png' });
    return new File([file], filename, { type: 'image/png' });
  };

  /**
   * Downloads the image to the user's device
   */
  const downloadImage = (imageUrl: string, whisprId: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `whispr-${whisprId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Shares the image via Web Share API or downloads it as fallback
   */
  const shareImage = async (imageData: string, whisprId: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Whispr from @${username}`,
          text: 'Check out this anonymous whispr!',
          files: [dataURLtoFile(imageData, 'whispr.png')],
        });
        toast.success('Ready to share!');
        return true;
      } catch (error) {
        console.error('Error sharing:', error);
        downloadImage(imageData, whisprId);
        return false;
      }
    } else {
      downloadImage(imageData, whisprId);
      toast.success('Image downloaded successfully!');
      return true;
    }
  };

  /**
   * Creates DOM elements for the whispr image rendering
   */
  const createWhisprImageElements = (whispr: Whispr) => {
    // Container
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

    // Render header with app logo and username
    container.appendChild(createHeaderElement());
    
    // Render content with whispr details
    container.appendChild(createCardContentElement(whispr));
    
    // Render footer with sharing URL
    container.appendChild(createFooterElement());

    return container;
  };

  /**
   * Creates the header element for the image
   */
  const createHeaderElement = () => {
    // Header with grid layout
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

    // Logo element
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

    // Logo image
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
    domainText.textContent = APP_URL_CLEAN;
    Object.assign(domainText.style, {
      fontSize: '18px',
      fontWeight: 'bold',
      color: 'white',
      lineHeight: '32px',
    });

    logoContainer.appendChild(logo);
    logoContainer.appendChild(domainText);

    // Spacer
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

    return header;
  };

  /**
   * Creates the card content element for the image
   */
  const createCardContentElement = (whispr: Whispr) => {
    // Card content container
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

    // Card inner layout
    const cardInner = document.createElement('div');
    Object.assign(cardInner.style, {
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
      width: '100%',
    });

    // Type icon container
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

    // Content header
    const contentHeader = document.createElement('div');
    Object.assign(contentHeader.style, {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      height: '24px',
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

    // Assemble content area
    contentArea.appendChild(contentHeader);
    contentArea.appendChild(contentText);

    // Assemble card inner
    cardInner.appendChild(typeIconContainer);
    cardInner.appendChild(contentArea);

    // Add inner to card
    cardContent.appendChild(cardInner);

    return cardContent;
  };

  /**
   * Creates the footer element for the image
   */
  const createFooterElement = () => {
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
    footer.textContent = `Want to send your own anonymous message? Visit ${profileUrl || `${APP_URL_CLEAN}/${username}`}`;
    
    return footer;
  };

  /**
   * Generates an image from a whispr and handles sharing/downloading
   * @param whispr - The whispr to generate an image for
   * @param forSharing - Whether to share the image (true) or download it (false)
   * @returns Promise that resolves when the operation is complete
   */
  const generateWhisprImage = async (whispr: Whispr, forSharing: boolean = false): Promise<boolean> => {
    setIsGeneratingImage(true);
    const loadingToast = toast.loading('Generating image...');

    try {
      // Create elements for rendering
      const container = createWhisprImageElements(whispr);
      
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
        return await shareImage(imageData, whispr.id);
      } else {
        downloadImage(imageData, whispr.id);
        toast.success('Image downloaded successfully!');
        return true;
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image');
      return false;
    } finally {
      toast.dismiss(loadingToast);
      setIsGeneratingImage(false);
    }
  };

  return {
    isGeneratingImage,
    generateWhisprImage
  };
};