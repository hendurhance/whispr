import { useEffect } from 'react';

type ThemeType = 'purple-pink' | 'blue-teal' | 'orange-red' | 'green-cyan' | 'indigo-purple';
type BackgroundType = 'black' | 'dark-gray' | 'navy' | 'dark-purple' | 'default';

interface UseProfileThemeProps {
  theme?: string;
  background?: string;
  applyBodyBackground?: boolean;
}

/**
 * Hook to handle profile theme and background styles
 */
export const useProfileTheme = ({
  theme = 'purple-pink',
  background = 'default',
  applyBodyBackground = false
}: UseProfileThemeProps) => {
  
  // Apply body background color if requested
  useEffect(() => {
    if (applyBodyBackground) {
      document.body.style.backgroundColor = getBackgroundColorValue(background as BackgroundType);
      
      // Reset body background color when component unmounts
      return () => {
        document.body.style.backgroundColor = '';
      };
    }
  }, [background, applyBodyBackground]);

  /**
   * Get theme gradient class based on selected theme
   */
  const getThemeGradient = (themeType: ThemeType) => {
    switch (themeType) {
      case 'purple-pink': return 'bg-gradient-to-r from-purple-600 to-pink-500';
      case 'blue-teal': return 'bg-gradient-to-r from-blue-500 to-teal-400';
      case 'orange-red': return 'bg-gradient-to-r from-orange-500 to-red-500';
      case 'green-cyan': return 'bg-gradient-to-r from-green-500 to-cyan-400';
      case 'indigo-purple': return 'bg-gradient-to-r from-indigo-500 to-purple-500';
      default: return 'bg-gradient-to-r from-purple-600 to-pink-500';
    }
  };
  
  /**
   * Get background color class based on the profile's selectedBackground
   */
  const getBackgroundColor = (backgroundType: BackgroundType) => {
    switch (backgroundType) {
      case 'black': return 'bg-black';
      case 'dark-gray': return 'bg-zinc-900';
      case 'navy': return 'bg-blue-950';
      case 'dark-purple': return 'bg-purple-950';
      default: return 'bg-[#101027]'; // Default dark navy background
    }
  };
  
  /**
   * Get background color CSS value based on the profile's selectedBackground
   */
  const getBackgroundColorValue = (backgroundType: BackgroundType) => {
    switch (backgroundType) {
      case 'black': return '#000000';
      case 'dark-gray': return '#18181b'; // Tailwind zinc-900
      case 'navy': return '#172554'; // Tailwind blue-950
      case 'dark-purple': return '#581c87'; // Tailwind purple-950
      default: return '#101027'; // Default dark navy background
    }
  };
  
  // The current theme gradient and background class
  const themeGradientClass = getThemeGradient(theme as ThemeType);
  const backgroundClass = getBackgroundColor(background as BackgroundType);
  
  return {
    themeGradientClass,
    backgroundClass,
    getThemeGradient,
    getBackgroundColor,
    getBackgroundColorValue
  };
};

export default useProfileTheme;