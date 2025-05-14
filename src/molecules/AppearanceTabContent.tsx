import React from 'react';

interface ThemeOption {
  id: string;
  className: string;
}

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
  const themeOptions: ThemeOption[] = [
    { id: 'purple-pink', className: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 'blue-teal', className: 'bg-gradient-to-r from-blue-500 to-teal-500' },
    { id: 'orange-red', className: 'bg-gradient-to-r from-orange-500 to-red-500' }
  ];

  const backgroundOptions: ThemeOption[] = [
    { id: 'black', className: 'bg-black' },
    { id: 'gray', className: 'bg-gray-900' },
    { id: 'indigo', className: 'bg-indigo-900' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-text-bright font-medium mb-2">Theme</h3>
        <div className="grid grid-cols-3 gap-3">
          {themeOptions.map(theme => (
            <button 
              key={theme.id}
              className={`h-12 rounded-lg ${theme.className} ${selectedTheme === theme.id ? 'border-2 border-white' : ''} ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'
              }`}
              onClick={() => !isLoading && onThemeChange(theme.id)}
              disabled={isLoading}
            />
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-text-bright font-medium mb-2">Page Background</h3>
        <div className="grid grid-cols-3 gap-3">
          {backgroundOptions.map(bg => (
            <button 
              key={bg.id}
              className={`h-12 rounded-lg ${bg.className} ${selectedBackground === bg.id ? 'border-2 border-white' : ''} ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'
              }`}
              onClick={() => !isLoading && onBackgroundChange(bg.id)}
              disabled={isLoading}
            />
          ))}
        </div>
      </div>
      
      <p className="text-text-muted text-sm">
        Upgrade to Whispr Pro to unlock more themes and customization options.
      </p>
    </div>
  );
};

export default AppearanceTabContent;