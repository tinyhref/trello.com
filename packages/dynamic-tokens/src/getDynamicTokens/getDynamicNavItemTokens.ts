import { token } from '@trello/theme';

import type { GetDynamicTokens, GetFallbackTokens } from './getDynamicTokens';

export const getDynamicNavItemTokens: GetDynamicTokens<'dynamic.navitem'> = ({
  background: { backgroundBrightness },
  colorMode,
  shouldUseDarkThemeOverride,
}) => {
  if (colorMode === 'dark' && shouldUseDarkThemeOverride) {
    return {
      'dynamic.navitem': token(
        'color.background.neutral.subtle',
        'transparent',
      ),
      'dynamic.navitem.interactable': token(
        'color.background.neutral.subtle.hovered',
        '#a1bdd914',
      ),
      'dynamic.navitem.hovered': token(
        'color.background.neutral.subtle.hovered',
        '#a1bdd914',
      ),
      'dynamic.navitem.interactable.hovered': token(
        'color.background.neutral.hovered',
        '#a6c5e229',
      ),
      'dynamic.navitem.interactable.pressed': token(
        'color.background.neutral.pressed',
        '#bfdbf847',
      ),
      'dynamic.navitem.pressed': token(
        'color.background.neutral.subtle.pressed',
        '#a6c5e229',
      ),
    };
  }
  if (backgroundBrightness === 'dark') {
    return {
      'dynamic.navitem.interactable': 'rgba(255, 255, 255, 0.2)',
      'dynamic.navitem': 'transparent',
      // Equivalent to --ds-background-neutral-subtle-hovered in ADS dark mode:
      'dynamic.navitem.hovered': '#A1BDD914',

      'dynamic.navitem.interactable.hovered': 'rgba(255, 255, 255, 0.3)',
      // Equivalent to --ds-background-neutral-subtle-pressed in ADS dark mode:
      'dynamic.navitem.pressed': '#A6C5E229',

      'dynamic.navitem.interactable.pressed': 'rgba(255, 255, 255, 0.3)',
    };
  } else {
    return {
      // Equivalent to --ds-background-neutral-subtle-hovered in ADS light mode:
      'dynamic.navitem.interactable': '#091E420F',
      'dynamic.navitem': 'transparent',
      // Equivalent to --ds-background-neutral-subtle-hovered in ADS light mode:
      'dynamic.navitem.hovered': '#091E420F',
      // Equivalent to --ds-background-neutral-subtle-pressed in ADS light mode:
      'dynamic.navitem.pressed': '#091E4224',
      // Equivalent to --ds-background-neutral-pressed in ADS light mode:
      'dynamic.navitem.interactable.pressed': '#091E424F',
      // Equivalent to --ds-background-neutral-hovered in ADS light mode:
      'dynamic.navitem.interactable.hovered': '#091E4224',
    };
  }
};

export const getFallbackNavItemTokens: GetFallbackTokens<'dynamic.navitem'> = (
  config,
) => {
  return {
    'dynamic.navitem.interactable': '',
    'dynamic.navitem': '',
    'dynamic.navitem.hovered': '',
    'dynamic.navitem.pressed': '',
    'dynamic.navitem.interactable.pressed': '',
    'dynamic.navitem.interactable.hovered': '',
  };
};
