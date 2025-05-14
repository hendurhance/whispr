import React, { useState } from 'react';
import Toggle from '../../atoms/Toggle';
import EmailChangeModal from '../../molecules/EmailChangeModal';
import supabase from '../../lib/supabase';

interface EmailSettingsProps {
  email: string;
  enableNotifications: boolean;
  onToggleNotifications: () => void;
  onChangeEmail: () => void;
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
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isUpdatingNotification, setIsUpdatingNotification] = useState(false);
  const [notificationState, setNotificationState] = useState(enableNotifications);

  const handleEmailChangeRequest = () => {
    setIsEmailModalOpen(true);
  };

  const handleCloseEmailModal = () => {
    setIsEmailModalOpen(false);
  };

  const handleToggleNotifications = async () => {
    if (!userId) return;
    
    setIsUpdatingNotification(true);
    try {
      // Toggle the notification state locally first for immediate feedback
      const newState = !notificationState;
      setNotificationState(newState);
      
      // Update the notification preference in the profiles table
      const { error } = await supabase
        .from('profiles')
        .update({
          email_notifications: newState,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
        
      if (error) throw error;
      
      // Call the parent handler
      onToggleNotifications();
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      // Revert state if update fails
      setNotificationState(notificationState);
      alert('Failed to update notification preferences. Please try again.');
    } finally {
      setIsUpdatingNotification(false);
    }
  };

  return (
    <div className={`bg-background-card rounded-xl border border-overlay-light p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-text-bright mb-4">Email Settings</h2>

      <div className="mb-6">
        <p className="text-text-muted mb-2">Your account email</p>
        <div className="flex items-center justify-center gap-2">
          <p className="text-text-bright">{email || 'Loading...'}</p>
          <button
            className="text-primary hover:text-primary-light transition-colors"
            onClick={handleEmailChangeRequest}
          >
            Change
          </button>
        </div>
      </div>

      <div className="border-t border-overlay-light pt-6">
        <div className="flex items-center justify-center gap-4">
          <div>
            <h3 className="text-text-bright font-medium">Email Notifications</h3>
            <p className="text-text-muted text-sm">Receive emails about new whisprs and account updates</p>
          </div>
          
          <div className={isUpdatingNotification ? 'opacity-70' : ''}>
            <Toggle 
              enabled={notificationState} 
              onToggle={handleToggleNotifications} 
              disabled={isUpdatingNotification}
            />
          </div>
        </div>
      </div>
      
      {isEmailModalOpen && (
        <EmailChangeModal onClose={handleCloseEmailModal} />
      )}
    </div>
  );
};

export default EmailSettings;