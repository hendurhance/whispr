import React from 'react';
import GenericModal from '../atoms/GenericModal';

interface EmailChangeModalProps {
  onClose: () => void;
}

const EmailChangeModal: React.FC<EmailChangeModalProps> = ({ onClose }) => {
  return (
    <GenericModal
      title="Email Change Not Available"
      titleColor="text-text-bright"
      onCancel={onClose}
    >
      <div className="space-y-4">
        <p className="text-text-muted">
          Email changes are not currently supported through the user interface for security reasons.
        </p>
        
        <div className="bg-background-highlight p-4 rounded-lg">
          <h4 className="font-medium text-text-bright mb-2">Available Options:</h4>
          <ul className="list-disc list-inside text-text-muted space-y-2">
            <li>Contact our support team for assistance with your email change request</li>
            <li>Create a new account with your preferred email address</li>
          </ul>
        </div>
        
        <p className="text-text-muted text-sm">
          We apologize for any inconvenience. This limitation is in place to maintain the security of your account.
        </p>
      </div>
    </GenericModal>
  );
};

export default EmailChangeModal;