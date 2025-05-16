import React from 'react';
import GenericModal from '../atoms/GenericModal';

interface SignOutEverywhereModalProps {
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const SignOutEverywhereModal: React.FC<SignOutEverywhereModalProps> = ({ 
  onClose, 
  onConfirm,
  isLoading = false
}) => {
  return (
    <GenericModal
      title="Sign Out Everywhere"
      onCancel={onClose}
      onConfirm={onConfirm}
      confirmText="Sign Out Everywhere"
      isConfirmLoading={isLoading}
    >
      <div className="space-y-4">
        <p className="text-text-bright">
          This will sign you out from all devices where you're currently logged in, including:
        </p>
        
        <ul className="list-disc list-inside text-text-muted space-y-2">
          <li>All web browsers</li>
          <li>Mobile applications</li>
          <li>Any other sessions</li>
        </ul>
        
        <p className="text-text-muted text-sm">
          You will need to sign in again on each device after this action.
        </p>
      </div>
    </GenericModal>
  );
};

export default SignOutEverywhereModal;