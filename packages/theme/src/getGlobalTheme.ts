import type { GlobalThemeState } from './globalThemeState';
import { globalThemeState } from './globalThemeState';

/**
 * Returns the current global theme as a cloned object.
 */
export const getGlobalTheme = (): GlobalThemeState => ({
  ...globalThemeState.value,
});
