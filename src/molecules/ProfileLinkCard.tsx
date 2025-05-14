import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { APP_LOGO_URI } from '../types';
interface ProfileLinkCardProps {
  username: string;
  profileLink: string;
  className?: string;
}

const ProfileLinkCard: React.FC<ProfileLinkCardProps> = ({
  username,
  profileLink,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const [qrSize, setQrSize] = useState(200);
  const qrCodeRef = useRef<SVGSVGElement>(null);

  // Adjust QR code size for smaller screens
  useEffect(() => {
    const handleResize = () => {
      setQrSize(window.innerWidth < 375 ? 150 : 200);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle copy link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle share link
  const handleShareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: `Send me anonymous messages`,
        text: `Send me anonymous messages on Whispr`,
        url: profileLink
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      handleCopyLink();
    }
  };

  // Handle QR code download
  const handleDownloadQR = () => {
    if (qrCodeRef.current) {
      // Get the SVG element
      const svgElement = qrCodeRef.current;

      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Set canvas dimensions (with some padding)
      canvas.width = qrSize + 16;  // 8px padding on each side
      canvas.height = qrSize + 16;

      if (ctx) {
        // Fill with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Convert SVG to a data URL
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);

        // Create an image from the SVG
        const img = new Image();
        img.onload = () => {
          // Draw the image onto the canvas (with padding)
          ctx.drawImage(img, 8, 8, qrSize, qrSize);

          // Convert canvas to a data URL
          const dataUrl = canvas.toDataURL('image/png');

          // Create a download link
          const downloadLink = document.createElement('a');
          downloadLink.href = dataUrl;
          downloadLink.download = `${username}-whispr-qr.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);

          // Clean up
          URL.revokeObjectURL(svgUrl);
        };
        img.src = svgUrl;
      }
    }
  };

  return (
    <div className={`bg-background-card rounded-xl border border-overlay-light p-6 ${className}`}>
      <div className="flex flex-col items-center mb-6">
        <div className="bg-white p-4 rounded-lg mb-4">
          <QRCodeSVG
            ref={qrCodeRef}
            value={profileLink}
            size={qrSize}
            level="H" // High error correction capability
            marginSize={0}
            bgColor="#FFFFFF"
            fgColor="#000000"
            imageSettings={
              {
                src: APP_LOGO_URI,
                height: 64,
                width: 64,
                excavate: true
              }
            }
          />
        </div>

        <div className="text-center">
          <p className="text-sm text-text-muted mb-1">Scan to access</p>
          <p className="text-text-bright font-medium">{username}'s Whispr</p>
        </div>
      </div>

      <div className="border-t border-overlay-light pt-6">
        <div className="relative mb-6">
          <input
            type="text"
            value={profileLink}
            readOnly
            className="w-full pl-4 pr-24 py-3 rounded-xl bg-background-darkest border border-overlay-light text-text-bright focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleCopyLink}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gradient-primary text-white rounded-lg text-sm"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <button
            onClick={handleShareLink}
            className="flex items-center justify-center gap-2 px-3 py-3 bg-background-highlight hover:bg-overlay-light transition-colors text-text-bright rounded-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.32l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            Share
          </button>

          <button
            onClick={() => window.open(profileLink, '_blank')}
            className="flex items-center justify-center gap-2 px-3 py-3 bg-background-highlight hover:bg-overlay-light transition-colors text-text-bright rounded-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Open
          </button>

          <button
            onClick={handleDownloadQR}
            className="flex items-center justify-center gap-2 px-3 py-3 bg-background-highlight hover:bg-overlay-light transition-colors text-text-bright rounded-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileLinkCard;