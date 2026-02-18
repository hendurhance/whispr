import { useState } from 'react';
import html2canvas from 'html2canvas-pro';
import { toast } from 'react-hot-toast';
import { Whispr, getWhisprTypeLabel, formatDate, WhisprType } from '@/types/whispr';
import { APP_LOGO_URI } from '@/types';
import { APP_URL_CLEAN } from '@/configs';

// SVG icon paths for image generation (since we can't render React components in DOM)
const getWhisprTypeIconSvg = (type: WhisprType): string => {
  const iconPaths: Record<WhisprType, string> = {
    question: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="0.5"/>',
    compliment: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    roast: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    confession: '<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',
    rumor: '<path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0"/><path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4"/>',
    suggestion: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    secret: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    hot_take: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    dare: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>'
  };
  return iconPaths[type] || '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>';
};

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

    container.appendChild(createHeaderElement());
    container.appendChild(createCardContentElement(whispr));
    container.appendChild(createFooterElement());

    return container;
  };

  /**
   * Creates the header element for the image
   */
  const createHeaderElement = () => {
    const header = document.createElement('div');
    Object.assign(header.style, {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      alignItems: 'center',
      width: '100%',
      marginBottom: '8px',
    });

    const logoContainer = document.createElement('div');
    Object.assign(logoContainer.style, {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      height: '32px',
    });

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

    const logoImg = document.createElement('img');
    logoImg.src = APP_LOGO_URI;
    logoImg.alt = 'Logo';
    Object.assign(logoImg.style, {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    });
    logo.appendChild(logoImg);

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

    const spacer = document.createElement('div');

    const usernameElement = document.createElement('span');
    usernameElement.textContent = `@${username}`;
    Object.assign(usernameElement.style, {
      fontSize: '14px',
      color: '#94a3b8',
      lineHeight: '32px',
      textAlign: 'right',
    });

    header.appendChild(logoContainer);
    header.appendChild(spacer);
    header.appendChild(usernameElement);

    return header;
  };

  /**
   * Creates the card content element for the image
   */
  const createCardContentElement = (whispr: Whispr) => {
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

    const cardInner = document.createElement('div');
    Object.assign(cardInner.style, {
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
      width: '100%',
    });

    const typeIconContainer = document.createElement('div');
    Object.assign(typeIconContainer.style, {
      width: '44px',
      height: '44px',
      borderRadius: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: '0',
    });

    const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgIcon.setAttribute('width', '24');
    svgIcon.setAttribute('height', '24');
    svgIcon.setAttribute('viewBox', '0 0 24 24');
    svgIcon.setAttribute('fill', 'none');
    svgIcon.setAttribute('stroke', '#a78bfa');
    svgIcon.setAttribute('stroke-width', '2');
    svgIcon.setAttribute('stroke-linecap', 'round');
    svgIcon.setAttribute('stroke-linejoin', 'round');
    svgIcon.innerHTML = getWhisprTypeIconSvg(whispr.type);
    typeIconContainer.appendChild(svgIcon);

    const contentArea = document.createElement('div');
    Object.assign(contentArea.style, {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      minWidth: '0',
    });

    const contentHeader = document.createElement('div');
    Object.assign(contentHeader.style, {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      height: '24px',
    });

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

    contentArea.appendChild(contentHeader);
    contentArea.appendChild(contentText);

    cardInner.appendChild(typeIconContainer);
    cardInner.appendChild(contentArea);

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
      const container = createWhisprImageElements(whispr);
      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        backgroundColor: '#1e293b',
        scale: 2,
        logging: false,
        allowTaint: true,
        useCORS: true,
        removeContainer: false,
      });

      document.body.removeChild(container);

      const imageData = canvas.toDataURL('image/png');

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