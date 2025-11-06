import { token } from '@trello/theme';

import { dynamicToken } from '../dynamicToken';
import type { GetDynamicTokens, GetFallbackTokens } from './getDynamicTokens';

/**
 * Transparent values from ADS light and dark modes. We can't use ADS tokens
 * as they are dependent on the active theme, and here we're setting them based
 * on dynamic board background brightness -- so we have to grab them manually
 */
const ADS = {
  light: {
    interaction: {
      hovered: 'rgba(0, 0, 0, 0.16)',
      pressed: 'rgba(0, 0, 0, 0.32)',
    },
  },
  dark: {
    interaction: {
      hovered: 'rgba(255, 255, 255, 0.20)',
      pressed: 'rgba(255, 255, 255, 0.36)',
    },
  },
};

export const getFallbackButtonTokens: GetFallbackTokens<'dynamic.button'> = ({
  colorMode,
}) => {
  return {
    'dynamic.button': 'transparent',
    'dynamic.button.hovered': token(
      'color.background.neutral.hovered',
      '#091E4224',
    ),
    'dynamic.button.pressed':
      colorMode === 'dark'
        ? token('color.background.neutral.hovered', '#091E4224')
        : token('color.background.selected', '#E9F2FF'),
    'dynamic.button.pressed.hovered':
      colorMode === 'dark'
        ? token('color.background.neutral.hovered', '#091E4224')
        : token('color.background.selected.hovered', '#CCE0FF'),
    'dynamic.button.pressed.text':
      colorMode === 'dark'
        ? dynamicToken('dynamic.text')
        : token('color.text.selected', '#0C66E4'),

    // primary buttons (global create)
    'dynamic.button.primary': token('color.background.brand.bold', '#0C66E4'),
    'dynamic.button.primary.text': token('color.text.inverse', '#FFFFFF'),
    'dynamic.button.primary.hovered': token(
      'color.background.brand.bold.hovered',
      '#0055CC',
    ),
    'dynamic.button.primary.pressed': token(
      'color.background.brand.bold.pressed',
      '#09326C',
    ),

    // highlighted buttons (inverted board header buttons)
    'dynamic.button.highlighted': token(
      'color.background.neutral.bold',
      '#44546F',
    ),
    'dynamic.button.highlighted.text': token('color.text.inverse', '#FFFFFF'),
    'dynamic.button.highlighted.hovered': token(
      'color.background.neutral.bold.hovered',
      '#2C3E5D',
    ),
  };
};

/**
 * Assign dynamic background colors for buttons that are rendered directly atop
 * a board background based on backgroundBrightness.
 *
 * Historically, we fetched data about board backgrounds in a variety of
 * different components to determine backgroundBrightness prior to rendering,
 * and bifurcating Nachos button appearance between `transparent` and
 * `transparent-dark` to suit the backgroundBrightness.
 *
 * Now that we have access to CSS variables, we can rely wholly on these, and
 * remove all of this type of logic from render flows. Moving forward, these
 * values can be used directly, and we can deprecate:
 *
 * - Nachos: transparent vs transparent-dark
 */
export const getDynamicButtonTokens: GetDynamicTokens<'dynamic.button'> = ({
  background: { backgroundBrightness },
  colorMode,
  shouldUseDarkThemeOverride,
  shouldUseADSOverride,
}) => {
  if (shouldUseADSOverride) {
    return getFallbackButtonTokens({
      background: null,
      colorMode,
    });
  }
  if (colorMode === 'dark' && shouldUseDarkThemeOverride) {
    return getFallbackButtonTokens({
      background: null,
      colorMode,
      shouldUseDarkThemeOverride,
    });
  }
  if (backgroundBrightness === 'dark') {
    return {
      // transparent buttons
      'dynamic.button': 'transparent',
      'dynamic.button.hovered': ADS.dark.interaction.hovered,
      'dynamic.button.pressed': ADS.dark.interaction.hovered,
      'dynamic.button.pressed.hovered': ADS.dark.interaction.hovered,
      'dynamic.button.pressed.text': dynamicToken('dynamic.text'),

      // transparent primary buttons
      'dynamic.button.primary': ADS.dark.interaction.hovered,
      'dynamic.button.primary.text': dynamicToken('dynamic.text'),
      'dynamic.button.primary.hovered': ADS.dark.interaction.pressed,
      'dynamic.button.primary.pressed': ADS.dark.interaction.pressed,

      // highlighted buttons (inverted board header buttons)
      'dynamic.button.highlighted': '#DCDFE4',
      'dynamic.button.highlighted.text': '#172B4D',
      'dynamic.button.highlighted.hovered': '#FFFFFF',
    };
  } else {
    return {
      // transparent buttons
      'dynamic.button': 'transparent',
      'dynamic.button.hovered': ADS.light.interaction.hovered,
      'dynamic.button.pressed': ADS.light.interaction.hovered,
      'dynamic.button.pressed.hovered': ADS.light.interaction.hovered,
      'dynamic.button.pressed.text': '#172B4D',

      // transparent primary buttons
      'dynamic.button.primary': ADS.light.interaction.hovered,
      'dynamic.button.primary.text': dynamicToken('dynamic.text'),
      'dynamic.button.primary.hovered': ADS.light.interaction.pressed,
      'dynamic.button.primary.pressed': ADS.light.interaction.pressed,

      // highlighted buttons (inverted board header buttons)
      'dynamic.button.highlighted':
        colorMode === 'light' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(9, 30, 66, 89%)',
      'dynamic.button.highlighted.text': '#FFFFFF',
      'dynamic.button.highlighted.hovered':
        colorMode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(9, 30, 66, 95%)',
    };
  }
};
