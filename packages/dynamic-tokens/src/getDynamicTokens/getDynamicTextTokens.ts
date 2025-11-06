import {
  IconDefaultColor,
  IconLightColor,
  TextDefaultColor,
  TextLightColor,
} from '@trello/nachos/tokens';
import { token } from '@trello/theme';

import type { GetDynamicTokens, GetFallbackTokens } from './getDynamicTokens';

const TEXT_TRANSPARENCY = 0.16;

export const getFallbackTextTokens: GetFallbackTokens<'dynamic.text'> = ({
  colorMode,
}) => {
  return {
    'dynamic.icon': token('color.icon.subtle', '#626F86'),
    'dynamic.text': token('color.text.subtle', '#44546F'),
    'dynamic.text.transparent':
      colorMode === 'dark'
        ? `hsla(0,0%,100%,${TEXT_TRANSPARENCY})`
        : `hsla(218,54%,19.6%,${TEXT_TRANSPARENCY})`,
  };
};

export const getDynamicTextTokens: GetDynamicTokens<'dynamic.text'> = ({
  background: { backgroundBrightness },
  colorMode,
  shouldUseDarkThemeOverride,
  shouldUseADSOverride,
}) => {
  if (shouldUseADSOverride) {
    return getFallbackTextTokens({ background: null, colorMode });
  }
  if (colorMode === 'dark' && shouldUseDarkThemeOverride) {
    return {
      'dynamic.icon': token('color.icon.subtle', '#626F86'),
      'dynamic.text': token('color.text.subtle', '#44546F'),
      // Output of the `color.text.subtle` token in dark mode with transparency.
      'dynamic.text.transparent': `hsla(211,18%,68%,${TEXT_TRANSPARENCY})`,
    };
  } else if (backgroundBrightness === 'dark') {
    return {
      'dynamic.icon': IconLightColor,
      'dynamic.text': TextLightColor,
      'dynamic.text.transparent': `hsla(0,0%,100%,${TEXT_TRANSPARENCY})`,
    };
  }
  return {
    'dynamic.icon': IconDefaultColor,
    'dynamic.text': TextDefaultColor,
    // HSL evaluates to the value of TextDefaultColor.
    'dynamic.text.transparent': `hsla(218,54%,19.6%,${TEXT_TRANSPARENCY})`,
  };
};
