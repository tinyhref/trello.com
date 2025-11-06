import type { GetDynamicTokens, GetFallbackTokens } from './getDynamicTokens';

/**
 * This will invert the logo so that it is equivalent
 * to the ADS subtle text color in dark mode
 */
const DARK_MODE_FILTER =
  'brightness(0) saturate(100%) invert(66%) sepia(20%) saturate(225%) hue-rotate(170deg) brightness(101%) contrast(85%)';

/**
 * This will invert the logo so that it is equivalent
 * to the ADS subtle text color in light mode
 */
const LIGHT_MODE_FILTER =
  'brightness(0) saturate(100%) invert(30%) sepia(53%) saturate(323%) hue-rotate(179deg) brightness(91%) contrast(88%)';

/**
 * If not in dark mode, but the board background is of
 * a dark brightness, just unset the filter so the logo
 * will appear white
 */
const UNSET_FILTER = 'unset';

export const getFallbackLogoTokens: GetFallbackTokens<'dynamic.logo'> = ({
  colorMode,
}) => {
  return colorMode === 'dark'
    ? {
        'dynamic.logo.filter': DARK_MODE_FILTER,
      }
    : {
        'dynamic.logo.filter': LIGHT_MODE_FILTER,
      };
};

export const getDynamicLogoTokens: GetDynamicTokens<'dynamic.logo'> = ({
  background: { backgroundBrightness },
  colorMode,
  shouldUseADSOverride,
}) => {
  if (shouldUseADSOverride) {
    return getFallbackLogoTokens({ background: null, colorMode });
  }
  if (colorMode === 'dark') {
    return {
      'dynamic.logo.filter': DARK_MODE_FILTER,
    };
  }
  if (backgroundBrightness === 'dark') {
    return { 'dynamic.logo.filter': UNSET_FILTER };
  }
  return {
    'dynamic.logo.filter': LIGHT_MODE_FILTER,
  };
};
