import React, { useRef } from 'react';
import { Whispr, formatDate, getWhisprTypeIcon } from '../types/whispr';
import TypeBadge from '../atoms/TypeBadge';
import GenericModal from '../atoms/GenericModal';
import { useWhisprImage } from '../hooks/useWhisprImage';

interface ViewWhisprModalProps {
  whispr: Whispr;
  isOpen: boolean;
  onClose: () => void;
  username: string;
  profileUrl: string;
}

/**
 * Modal for viewing and sharing a Whispr
 */
const ViewWhisprModal: React.FC<ViewWhisprModalProps> = ({
  whispr,
  isOpen,
  onClose,
  username,
  profileUrl
}) => {
  const whisprCardRef = useRef<HTMLDivElement>(null);
  const { isGeneratingImage, generateWhisprImage } = useWhisprImage({
    username,
    profileUrl
  });

  if (!isOpen) return null;

  /**
   * Button loading spinner component
   */
  const LoadingSpinner = () => (
    <span className="flex items-center justify-center">
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Generating...
    </span>
  );

  /**
   * Download button component
   */
  const DownloadButton = () => (
    <button
      onClick={() => generateWhisprImage(whispr, false)}
      disabled={isGeneratingImage}
      className="flex-1 py-2 px-4 bg-accent-blue/10 text-accent-blue rounded-lg hover:bg-accent-blue/20 transition-colors flex items-center justify-center gap-2"
    >
      {isGeneratingImage ? (
        <LoadingSpinner />
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Image
        </>
      )}
    </button>
  );

  /**
   * Share button component
   */
  const ShareButton = () => (
    <button
      onClick={() => generateWhisprImage(whispr, true)}
      disabled={isGeneratingImage}
      className="flex-1 py-2 px-4 bg-accent-purple/10 text-accent-purple rounded-lg hover:bg-accent-purple/20 transition-colors flex items-center justify-center gap-2"
    >
      {isGeneratingImage ? (
        <LoadingSpinner />
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </>
      )}
    </button>
  );

  /**
   * Whispr card preview component
   */
  const WhisprCardPreview = () => (
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
  );

  return (
    <GenericModal
      title="View Whispr"
      onCancel={onClose}
      cancelText="Close"
    >
      <div className="space-y-6">
        <WhisprCardPreview />
        
        <div className="flex flex-col sm:flex-row gap-3">
          <DownloadButton />
          <ShareButton />
        </div>
      </div>
    </GenericModal>
  );
};

export default ViewWhisprModal;