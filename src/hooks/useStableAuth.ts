import { useAuth } from '../context/auth';

/**
 * Hook to provide stable auth state that doesn't trigger unnecessary re-renders
 * on tab focus events. This prevents auth pages from reloading when users switch tabs.
 * 
 * For now, this just returns the auth context directly, but can be extended
 * in the future to add memoization or other optimizations.
 */
export const useStableAuth = () => {
  return useAuth();
};
