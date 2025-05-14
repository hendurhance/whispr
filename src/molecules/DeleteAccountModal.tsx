import React from 'react';

interface DeleteAccountModalProps {
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  onCancel,
  onConfirm,
  isDeleting = false
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-background-card rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-accent-pink mb-4">Delete Account</h3>
        <p className="text-text-bright mb-4">
          Are you sure you want to delete your account? This will:
        </p>
        <ul className="list-disc list-inside text-text-muted mb-6 space-y-1">
          <li>Delete your profile and all settings</li>
          <li>Delete all whisprs you've received</li>
          <li>Make your username available for others to use</li>
          <li>Permanently end your access to your account</li>
        </ul>
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
          <button
            onClick={onCancel}
            className="py-2 px-4 bg-background-highlight text-text-bright rounded-lg hover:bg-overlay-light transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className={`py-2 px-4 bg-accent-pink text-white rounded-lg transition-colors ${isDeleting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-accent-pink/80'}`}
          >
            {isDeleting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </span>
            ) : (
              'Delete Permanently'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;