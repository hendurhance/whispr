import React, { useState } from 'react';
import DeleteAccountModal from '../../molecules/DeleteAccountModal';
import SignOutEverywhereModal from '../../molecules/SignoutEverywhere';
import { useAccountManagement } from '../../hooks/useAccountManagement';

interface AccountManagementProps {
  onSignOutEverywhere: () => void;
  onDeleteAccount: () => void;
  isDeleting?: boolean;
  className?: string;
}

const AccountManagement: React.FC<AccountManagementProps> = ({
  onSignOutEverywhere,
  onDeleteAccount,
  isDeleting = false,
  className = ''
}) => {
  const [error, setError] = useState<string | null>(null);
  
  const {
    // Modal states
    isDeleteModalOpen,
    isSignOutModalOpen,
    isSigningOut,
    
    // Delete account methods
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    
    // Sign out methods
    openSignOutModal,
    closeSignOutModal,
    confirmSignOut
  } = useAccountManagement({
    onSignOutEverywhere,
    onDeleteAccount
  });
  
  // Handle sign out confirmation with error handling
  const handleSignOutConfirm = async () => {
    const signOutError = await confirmSignOut();
    if (signOutError) {
      setError(signOutError.message);
      setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
    }
  };

  return (
    <div className={`bg-background-card rounded-xl border border-overlay-light p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-text-bright mb-4">Account Management</h2>

      {error && (
        <div className="mb-4 p-3 bg-accent-pink/10 text-accent-pink rounded-lg text-sm" role="alert">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-text-bright font-medium mb-1">Log out from all devices</h3>
          <p className="text-text-muted text-sm mb-3">
            This will log you out from all devices where you're currently signed in.
          </p>
          <button
            className="text-primary hover:text-primary-light transition-colors font-medium focus:outline-none focus:underline"
            onClick={openSignOutModal}
            aria-label="Sign out from all devices"
          >
            Sign out everywhere
          </button>
        </div>

        <div className="border-t border-overlay-light pt-6">
          <h3 className="text-accent-pink font-medium mb-1">Delete account</h3>
          <p className="text-text-muted text-sm mb-3">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button
            className="text-accent-pink hover:text-accent-pink/80 transition-colors font-medium focus:outline-none focus:underline"
            onClick={openDeleteModal}
            aria-label="Delete my account"
          >
            Delete my account
          </button>
        </div>
      </div>
      
      {isDeleteModalOpen && (
        <DeleteAccountModal
          onCancel={closeDeleteModal}
          onConfirm={confirmDelete}
          isDeleting={isDeleting}
        />
      )}

      {isSignOutModalOpen && (
        <SignOutEverywhereModal
          onClose={closeSignOutModal}
          onConfirm={handleSignOutConfirm}
          isLoading={isSigningOut}
        />
      )}
    </div>
  );
};

export default AccountManagement;