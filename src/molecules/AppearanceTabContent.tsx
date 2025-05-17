import React from 'react';
import useProfileTheme from '../hooks/useProfileTheme';

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
  // Use the hook to get theme functions
  const { getThemeGradient, getBackgroundColor } = useProfileTheme({
    theme: selectedTheme,
    background: selectedBackground
  });

  // Theme options using the hook's getThemeGradient function
  const themeOptions = [
    { id: 'purple-pink', className: getThemeGradient('purple-pink') },
    { id: 'blue-teal', className: getThemeGradient('blue-teal') },
    { id: 'orange-red', className: getThemeGradient('orange-red') },
    { id: 'green-cyan', className: getThemeGradient('green-cyan') },
    { id: 'indigo-purple', className: getThemeGradient('indigo-purple') }
  ];

  // Background options using the hook's getBackgroundColor function
  const backgroundOptions = [
    { id: 'black', className: getBackgroundColor('black') },
    { id: 'dark-gray', className: getBackgroundColor('dark-gray') },
    { id: 'navy', className: getBackgroundColor('navy') },
    { id: 'dark-purple', className: getBackgroundColor('dark-purple') },
    { id: 'default', className: getBackgroundColor('default') }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-text-bright font-medium mb-2">Theme</h3>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-5">
          {themeOptions.map(theme => (
            <button 
              key={theme.id}
              className={`h-12 rounded-lg ${theme.className} ${
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
              className={`h-12 rounded-lg ${bg.className} ${
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