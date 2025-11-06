import { useGlobalTheme } from './useGlobalTheme';

/**
 * A React hook that returns whether the current effective color mode is dark.
 *
 * @returns true if the effective color mode is 'dark', false otherwise.
 */
export const useIsDarkMode = (): boolean => {
  const { effectiveColorMode } = useGlobalTheme();
  return effectiveColorMode === 'dark';
};
