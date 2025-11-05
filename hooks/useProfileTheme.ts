import { useEffect, useMemo } from 'react';

type ThemeType = 'purple-pink' | 'blue-teal' | 'orange-red' | 'green-cyan' | 'indigo-purple';
type BackgroundType = 'black' | 'dark-gray' | 'navy' | 'dark-purple' | 'default';

interface UseProfileThemeProps {
  theme?: string;
  background?: string;
  applyBodyBackground?: boolean;
}

/**
 * Hook to handle profile theme and background styles
 * Returns inline styles instead of dynamic classes for JIT compiler compatibility
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
   * Get theme gradient inline style based on selected theme
   */
  const getThemeGradientStyle = (themeType: ThemeType): React.CSSProperties => {
    switch (themeType) {
      case 'purple-pink':
        return { background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(236, 72, 153))' };
      case 'blue-teal':
        return { background: 'linear-gradient(to right, rgb(59, 130, 246), rgb(45, 212, 191))' };
      case 'orange-red':
        return { background: 'linear-gradient(to right, rgb(249, 115, 22), rgb(239, 68, 68))' };
      case 'green-cyan':
        return { background: 'linear-gradient(to right, rgb(34, 197, 94), rgb(34, 211, 238))' };
      case 'indigo-purple':
        return { background: 'linear-gradient(to right, rgb(99, 102, 241), rgb(168, 85, 247))' };
      default:
        return { background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(236, 72, 153))' };
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
  
  /**
   * Get background color inline style based on the profile's selectedBackground
   */
  const getBackgroundStyle = (backgroundType: BackgroundType): React.CSSProperties => {
    return { backgroundColor: getBackgroundColorValue(backgroundType) };
  };
  
  // Memoize the current theme gradient and background styles
  const themeGradientStyle = useMemo(
    () => getThemeGradientStyle(theme as ThemeType),
    [theme]
  );
  
  const backgroundStyle = useMemo(
    () => ({ backgroundColor: getBackgroundColorValue(background as BackgroundType) }),
    [background]
  );
  
  return {
    themeGradientStyle,
    backgroundStyle,
    getThemeGradientStyle,
    getBackgroundStyle,
    getBackgroundColorValue
  };
};

export default useProfileTheme;