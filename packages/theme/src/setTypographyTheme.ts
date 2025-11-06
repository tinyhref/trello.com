import { globalThemeState } from './globalThemeState';
import type { TypographyMode } from './theme.types';

/**
 * Sets the user's theme preference into the shared state and LocalStorage.
 */
export const setTypographyTheme = (typography: TypographyMode) => {
  globalThemeState.setValue({
    typography,
  });
};
