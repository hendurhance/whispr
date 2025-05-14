import React from 'react';
import Toggle from '../atoms/Toggle';

interface SettingOption {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

interface SettingsTabContentProps {
  options: SettingOption[];
  isLoading?: boolean;
}

const SettingsTabContent: React.FC<SettingsTabContentProps> = ({ 
  options,
  isLoading = false
}) => {
  return (
    <div className="space-y-4">
      {options.map((option, index) => (
        <div key={index} className="flex items-center justify-center gap-6">
          <div>
            <h3 className="text-text-bright font-medium">{option.title}</h3>
            <p className="text-text-muted text-sm">{option.description}</p>
          </div>
          <Toggle 
            enabled={option.enabled} 
            onToggle={option.onToggle} 
            disabled={isLoading}
          />
        </div>
      ))}
    </div>
  );
};

export default SettingsTabContent;