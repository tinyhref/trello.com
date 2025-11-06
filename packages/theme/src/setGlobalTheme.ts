import { globalThemeState } from './globalThemeState';
import type { ColorMode } from './theme.types';

/**
 * Sets the user's theme preference into the shared state and LocalStorage.
 */
export const setGlobalTheme = (colorMode: ColorMode) => {
  globalThemeState.setValue({
    colorMode,
    // If the color mode is auto, let it be assigned in `useGlobalThemeUpdater`.
    effectiveColorMode: colorMode !== 'auto' ? colorMode : 'light',
  });
};
