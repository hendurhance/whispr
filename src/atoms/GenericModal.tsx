import React, { ReactNode } from 'react';

interface GenericModalProps {
  title: string;
  titleColor?: string;
  children: ReactNode;
  onCancel: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  isConfirmLoading?: boolean;
}

const GenericModal: React.FC<GenericModalProps> = ({
  title,
  titleColor = 'text-text-bright',
  children,
  onCancel,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = 'bg-primary hover:bg-primary-light',
  isConfirmLoading = false
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background-card rounded-xl p-6 max-w-md w-full mx-4 animate-fadeIn">
        <h3 className={`text-xl font-bold ${titleColor} mb-4`}>{title}</h3>
        
        <div className="mb-6">
          {children}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
          <button
            onClick={onCancel}
            className="py-2 px-4 bg-background-highlight text-text-bright rounded-lg hover:bg-overlay-light transition-colors"
          >
            {cancelText}
          </button>
          
          {onConfirm && (
            <button
              onClick={onConfirm}
              disabled={isConfirmLoading}
              className={`py-2 px-4 text-white rounded-lg transition-colors ${isConfirmLoading ? 'opacity-70 cursor-not-allowed' : ''} ${confirmButtonClass}`}
            >
              {isConfirmLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                confirmText
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenericModal;