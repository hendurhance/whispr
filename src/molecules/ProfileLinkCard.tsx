import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { APP_LOGO_URI } from '../types';
import { useShareLink } from '../hooks/useShareLink';
import { useQRCode } from '../hooks/useQRCode';

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
  // Use our custom hooks
  const { copied, copyToClipboard, shareLink, shareError } = useShareLink();
  const { qrSize, qrCodeRef, downloadQRCode } = useQRCode(200);

  // Handle copy link action
  const handleCopyLink = () => {
    copyToClipboard(profileLink);
  };

  // Handle share link action
  const handleShareLink = () => {
    shareLink(profileLink, {
      title: `Send me anonymous messages`,
      text: `Send me anonymous messages on Whispr`
    });
  };

  // Handle QR code download
  const handleDownloadQR = () => {
    downloadQRCode(`${username}-whispr-qr.png`, {
      padding: 16,
      backgroundColor: 'white'
    });
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
            imageSettings={{
              src: APP_LOGO_URI,
              height: Math.round(qrSize * 0.3), // Responsive logo size (30% of QR size)
              width: Math.round(qrSize * 0.3),
              excavate: true
            }}
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
            aria-label="Your profile link"
            className="w-full pl-4 pr-24 py-3 rounded-xl bg-background-darkest border border-overlay-light text-text-bright focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleCopyLink}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gradient-primary text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            aria-label="Copy link to clipboard"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {shareError && (
          <div className="mb-3 px-3 py-2 bg-red-500/10 text-red-500 rounded-lg text-sm">
            {shareError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <button
            onClick={handleShareLink}
            className="flex items-center justify-center gap-2 px-3 py-3 bg-background-highlight hover:bg-overlay-light transition-colors text-text-bright rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Share profile link"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.32l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            Share
          </button>

          <button
            onClick={() => window.open(profileLink, '_blank')}
            className="flex items-center justify-center gap-2 px-3 py-3 bg-background-highlight hover:bg-overlay-light transition-colors text-text-bright rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Open profile in new tab"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Open
          </button>

          <button
            onClick={handleDownloadQR}
            className="flex items-center justify-center gap-2 px-3 py-3 bg-background-highlight hover:bg-overlay-light transition-colors text-text-bright rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Download QR code"
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