import React from 'react';

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({ enabled, onToggle, disabled = false, className = '' }) => {
  return (
    <button
      type="button"
      className={`${className} ${
        enabled ? 'bg-primary' : 'bg-overlay-light'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      role="switch"
      aria-checked={enabled}
      onClick={onToggle}
      disabled={disabled}
    >
      <span className="sr-only">{enabled ? 'Enable' : 'Disable'}</span>
      <span
        aria-hidden="true"
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  );
};

export default Toggle;