import React from 'react';
import Toggle from '../../atoms/Toggle';
import EmailChangeModal from '../../molecules/EmailChangeModal';
import { useEmailSettings } from '../../hooks/useEmailSettings';

interface EmailSettingsProps {
  email: string;
  enableNotifications: boolean;
  onToggleNotifications: () => void;
  userId?: string;
  className?: string;
}

const EmailSettings: React.FC<EmailSettingsProps> = ({
  email,
  enableNotifications,
  onToggleNotifications,
  userId,
  className = ''
}) => {
  const {
    // States
    isEmailModalOpen,
    isUpdatingNotification,
    notificationState,
    error,
    
    // Actions
    openEmailModal,
    closeEmailModal,
    toggleNotifications
  } = useEmailSettings({
    userId,
    enableNotifications,
    onToggleNotifications
  });

  return (
    <div className={`bg-background-card rounded-xl border border-overlay-light p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-text-bright mb-4">Email Settings</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-accent-pink/10 text-accent-pink rounded-lg text-sm" role="alert">
          {error}
        </div>
      )}

      {/* Email Display and Change Button */}
      <div className="mb-6">
        <p className="text-text-muted mb-2">Your account email</p>
        <div className="flex items-center justify-center">
          <p className="text-text-bright truncate mr-2" title={email}>
            {email || 'Loading...'}
          </p>
          <button
            className="text-primary hover:text-primary-light transition-colors focus:outline-none focus:underline"
            onClick={openEmailModal}
            aria-label="Change email address"
          >
            Change
          </button>
        </div>
      </div>

      {/* Email Notifications Toggle */}
      <div className="border-t border-overlay-light pt-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-text-bright font-medium">Email Notifications</h3>
            <p className="text-text-muted text-sm">
              Receive emails about new whisprs and account updates
            </p>
          </div>
          
          <div className={isUpdatingNotification ? 'opacity-70' : ''}>
            <Toggle 
              enabled={notificationState} 
              onToggle={toggleNotifications} 
              disabled={isUpdatingNotification}
              aria-label="Toggle email notifications"
            />
          </div>
        </div>
      </div>
      
      {/* Email Change Modal */}
      {isEmailModalOpen && (
        <EmailChangeModal onClose={closeEmailModal} />
      )}
    </div>
  );
};

export default EmailSettings;