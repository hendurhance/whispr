import React, { useState } from 'react';
import DeleteAccountModal from '../../molecules/DeleteAccountModal';
import supabase from '../../lib/supabase';
import SignOutEverywhereModal from '../../molecules/SignoutEverywhere';

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  const handleDeleteRequest = () => {
    setIsDeleteModalOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    onDeleteAccount();
    // Modal will be closed after the delete operation completes
  };
  
  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const handleSignOutRequest = () => {
    setIsSignOutModalOpen(true);
  };

  const handleSignOutConfirm = async () => {
    setIsSigningOut(true);
    try {
      // Sign out from all devices using the global scope
      await supabase.auth.signOut({ scope: 'global' });
      onSignOutEverywhere();
      setIsSignOutModalOpen(false);
    } catch (error) {
      console.error('Error signing out from all devices:', error);
      alert('Failed to sign out from all devices. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleSignOutCancel = () => {
    setIsSignOutModalOpen(false);
  };

  return (
    <div className={`bg-background-card rounded-xl border border-overlay-light p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-text-bright mb-4">Account Management</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-text-bright font-medium mb-1">Log out from all devices</h3>
          <p className="text-text-muted text-sm mb-3">
            This will log you out from all devices where you're currently signed in.
          </p>
          <button
            className="text-primary hover:text-primary-light transition-colors font-medium"
            onClick={handleSignOutRequest}
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
            className="text-accent-pink hover:text-accent-pink/80 transition-colors font-medium"
            onClick={handleDeleteRequest}
          >
            Delete my account
          </button>
        </div>
      </div>
      
      {isDeleteModalOpen && (
        <DeleteAccountModal
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeleting}
        />
      )}

      {isSignOutModalOpen && (
        <SignOutEverywhereModal
          onClose={handleSignOutCancel}
          onConfirm={handleSignOutConfirm}
          isLoading={isSigningOut}
        />
      )}
    </div>
  );
};

export default AccountManagement;