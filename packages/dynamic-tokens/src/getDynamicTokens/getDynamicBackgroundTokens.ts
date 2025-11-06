import { hasValidContrastRatio } from '@trello/a11y';
import {
  darkenHSL,
  getHSLFunctionArgs,
  getHSLNumbersFromHSLString,
  hexToHSL,
  HSLToHex,
  lightenHSL,
  makeHSL,
} from '@trello/colors';
import { token } from '@trello/theme';

import type { Background } from '../DynamicTokenConfig.types';
import { getDynamicTextTokens } from './getDynamicTextTokens';
import type { GetDynamicTokens, GetFallbackTokens } from './getDynamicTokens';

const BACKGROUND_TRANSPARENCY = 0.9;
const CONTRAST_RATIO_LEVEL_AA = 4.5;
const CONTRAST_RATIO_LEVEL_AAA = 7;
const CONTRAST_RATIO_LEVEL_BETWEEN_AA_AND_AAA =
  (CONTRAST_RATIO_LEVEL_AA + CONTRAST_RATIO_LEVEL_AAA) / 2;
const FALLBACK_VALUES = {
  'dynamic.background': token('elevation.surface', '#FFFFFF'),
  'dynamic.background.transparent': '',
} as const;

const validateContrastRatio = (backgroundColor: string, textColor: string) =>
  hasValidContrastRatio(
    backgroundColor,
    textColor,
    14,
    false,
    CONTRAST_RATIO_LEVEL_BETWEEN_AA_AND_AAA,
  );

const cachedBackgroundsWithValidContrast: Record<
  string,
  ReturnType<typeof makeHSL>
> = {};

/**
 * Given a background and text color, brighten or darken the background color
 * until the text color has a valid contrast against it.
 */
const getBackgroundColorWithValidContrast = (
  { backgroundBrightness, backgroundColor }: Required<Background>,
  textColor: string,
) => {
  if (cachedBackgroundsWithValidContrast[backgroundColor]) {
    return cachedBackgroundsWithValidContrast[backgroundColor];
  }

  let hsl = hexToHSL(backgroundColor);
  const { isValid, contrastRatio } = validateContrastRatio(
    backgroundColor,
    textColor,
  );
  if (isValid || !contrastRatio) {
    cachedBackgroundsWithValidContrast[backgroundColor] = hsl;
    return hsl;
  }

  let count = 0;
  let hasValidContrast = false;
  // For performance, only do this 10 times or until lightness hits 0% or 100%.
  while (count < 10 && !hasValidContrast) {
    count++;

    // Split out HSL so we can tweak L.
    const [h, s, l] = getHSLNumbersFromHSLString(hsl);

    let newLightness = l;
    if (backgroundBrightness === 'dark') {
      // Decrease lightness by 20%.
      newLightness *= 0.8;
      // Lightness below 0 is meaningless, so set to 0% and break out of the loop.
      if (newLightness <= 0) {
        const result = makeHSL(h, s, 0);
        cachedBackgroundsWithValidContrast[backgroundColor] = result;
        return result;
      }
    }

    if (backgroundBrightness === 'light') {
      // Increase lightness value by 20%.
      newLightness *= 1.2;
      // Lightness above 1 is meaningless, so set to 100% and break out of the loop.
      if (newLightness >= 1) {
        const result = makeHSL(h, s, 1);
        cachedBackgroundsWithValidContrast[backgroundColor] = result;
        return result;
      }
    }

    hsl = makeHSL(h, s, newLightness);

    const hexToCheck = HSLToHex(h, s, newLightness);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { isValid, contrastRatio } = validateContrastRatio(
      hexToCheck,
      textColor,
    );
    if (isValid && contrastRatio) {
      // Valid contrast found, exit loop.
      hasValidContrast = true;
    }
  }

  cachedBackgroundsWithValidContrast[backgroundColor] = hsl;
  return hsl;
};

/**
 * Distinguish global header background color ('dynamic.background') from
 * workspace navigation background color ('dynamic.background.transparent')
 * by adding 5% lightness if brightness is light or removing 5% lightness
 * if brightness is dark.
 */
const distinguishBackgroundColors = ({
  backgroundBrightness,
  backgroundColor,
}: Required<Pick<Background, 'backgroundBrightness' | 'backgroundColor'>>) => {
  if (backgroundBrightness === 'dark') {
    return darkenHSL(backgroundColor, 0.05);
  }

  if (backgroundBrightness === 'light') {
    return lightenHSL(backgroundColor, 0.05);
  }

  return backgroundColor;
};

export const getFallbackBackgroundTokens: GetFallbackTokens<
  'dynamic.background'
> = (config) => FALLBACK_VALUES;

export const getDynamicBackgroundTokens: GetDynamicTokens<
  'dynamic.background'
> = (config) => {
  const {
    background,
    colorMode,
    shouldUseDarkThemeOverride,
    shouldUseADSOverride,
  } = config;
  if (shouldUseADSOverride) {
    return getFallbackBackgroundTokens(config);
  }

  if (colorMode === 'dark' && shouldUseDarkThemeOverride) {
    const hsl = '206,13.7%,10%';
    return {
      'dynamic.background': token('elevation.surface', '#FFFFFF'),
      // Output of the `elevation.surface` token in dark mode with 0.9 alpha.
      'dynamic.background.transparent': `hsla(${hsl},${BACKGROUND_TRANSPARENCY})`,
    };
  }

  const { backgroundBrightness, backgroundColor } = background;

  if (!backgroundColor || backgroundBrightness === 'unknown') {
    return FALLBACK_VALUES;
  }

  try {
    const textColor = getDynamicTextTokens(config)['dynamic.text'];
    const backgroundColorWithValidContrast =
      getBackgroundColorWithValidContrast(
        background as Required<Background>,
        textColor,
      );
    const hsl = getHSLFunctionArgs(backgroundColorWithValidContrast);

    return {
      'dynamic.background': distinguishBackgroundColors({
        ...background,
        backgroundColor: backgroundColorWithValidContrast,
      }),
      'dynamic.background.transparent': `hsla(${hsl},${BACKGROUND_TRANSPARENCY})`,
    };
  } catch (e) {
    return FALLBACK_VALUES;
  }
};
