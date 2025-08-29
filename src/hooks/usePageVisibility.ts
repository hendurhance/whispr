import { useEffect, useState } from 'react';

/**
 * Hook to detect when the page becomes visible or hidden
 * Useful for optimizing behavior when users switch tabs
 */
export const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(!document.hidden);
  const [lastVisibilityChange, setLastVisibilityChange] = useState(Date.now());

  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      setIsVisible(visible);
      setLastVisibilityChange(Date.now());
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Page visibility changed: ${visible ? 'visible' : 'hidden'}`);
      }
    };

    // Add event listener for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return {
    isVisible,
    lastVisibilityChange,
  };
};
