'use client';

import React from 'react';

interface AppearanceTabContentProps {
  selectedTheme: string;
  selectedBackground: string;
  onThemeChange: (themeId: string) => void;
  onBackgroundChange: (backgroundId: string) => void;
  isLoading?: boolean;
}

const AppearanceTabContent: React.FC<AppearanceTabContentProps> = ({
  selectedTheme,
  selectedBackground,
  onThemeChange,
  onBackgroundChange,
  isLoading = false
}) => {
  // Theme options with inline gradient styles
  const themeOptions = [
    { 
      id: 'purple-pink', 
      style: { background: 'linear-gradient(to right, #9333ea, #ec4899)' }
    },
    { 
      id: 'blue-teal', 
      style: { background: 'linear-gradient(to right, #3b82f6, #2dd4bf)' }
    },
    { 
      id: 'orange-red', 
      style: { background: 'linear-gradient(to right, #f97316, #ef4444)' }
    },
    { 
      id: 'green-cyan', 
      style: { background: 'linear-gradient(to right, #22c55e, #22d3ee)' }
    },
    { 
      id: 'indigo-purple', 
      style: { background: 'linear-gradient(to right, #6366f1, #a855f7)' }
    }
  ];

  // Background options with inline background colors
  const backgroundOptions = [
    { id: 'black', style: { backgroundColor: '#000000' } },
    { id: 'dark-gray', style: { backgroundColor: '#18181b' } },
    { id: 'navy', style: { backgroundColor: '#172554' } },
    { id: 'dark-purple', style: { backgroundColor: '#581c87' } },
    { id: 'default', style: { backgroundColor: '#101027' } }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-text-bright font-medium mb-2">Theme</h3>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-5">
          {themeOptions.map(theme => (
            <button 
              key={theme.id}
              style={theme.style}
              className={`h-12 rounded-lg ${
                selectedTheme === theme.id ? 'border-2 border-white' : 'border border-transparent'
              } ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'
              }`}
              onClick={() => !isLoading && onThemeChange(theme.id)}
              disabled={isLoading}
              aria-label={`Select ${theme.id} theme`}
              title={`${theme.id.replace('-', ' ')} theme`}
            />
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-text-bright font-medium mb-2">Page Background</h3>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-5">
          {backgroundOptions.map(bg => (
            <button 
              key={bg.id}
              style={bg.style}
              className={`h-12 rounded-lg ${
                selectedBackground === bg.id ? 'border-2 border-white' : 'border border-transparent'
              } ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'
              }`}
              onClick={() => !isLoading && onBackgroundChange(bg.id)}
              disabled={isLoading}
              aria-label={`Select ${bg.id} background`}
              title={`${bg.id.replace('-', ' ')} background`}
            />
          ))}
        </div>
      </div>
      
      <div className="pt-2">
        <p className="text-text-muted text-sm">
          Upgrade to Whispr Pro to unlock more themes and customization options.
        </p>
      </div>
    </div>
  );
};

export default AppearanceTabContent;