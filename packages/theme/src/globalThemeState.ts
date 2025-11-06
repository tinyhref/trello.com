import { PersistentSharedState } from '@trello/shared-state';

import type {
  ColorMode,
  EffectiveColorMode,
  TypographyMode,
} from './theme.types';

export interface GlobalThemeState {
  /**
   * The color mode used across the app, inclusive of 'auto'.
   * @default 'auto'
   */
  colorMode: ColorMode;
  /**
   * The effective color mode used across the app, exclusive of 'auto'.
   * @default 'light'
   */
  effectiveColorMode: EffectiveColorMode;
  /**
   * The typography mode used across the app.
   * @default 'typography-modernized'
   */
  typography?: TypographyMode;
}

export const globalThemeState = new PersistentSharedState<GlobalThemeState>(
  {
    colorMode: 'auto',
    effectiveColorMode: 'light',
    typography: undefined,
  },
  { storageKey: 'global-theme' },
);
