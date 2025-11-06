import { makeRGB } from '@trello/colors';

/**
 * Get the brightness of a specified color (hex)
 * using algorithm from https://www.w3.org/TR/AERT/#color-contrast
 */
export const getBrightness = (hexColor: string): 'dark' | 'light' => {
  // ignore the leading # character
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  if (brightness > 127.5) {
    return 'light';
  }
  return 'dark';
};

/**
 * Get the relative luminance value
 * using algorithm from http://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
export const getRelativeLuminance = (hexColor: string): number | null => {
  const rgbValues = makeRGB(hexColor);
  if (!rgbValues) {
    return null;
  }
  const [r, g, b] = rgbValues;

  const luminanceRefined = (channel: number): number => {
    channel /= 255;
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  };

  const newR = luminanceRefined(r);
  const newG = luminanceRefined(g);
  const newB = luminanceRefined(b);

  const luminance = 0.2126 * newR + 0.7152 * newG + 0.0722 * newB;

  // the luminance value, ranges from 0 to 1
  return luminance;
};

/**
 * From https://github.com/dequelabs/axe-core (get-contrast.js)
 * Get the contrast of two hex colors
 */
export const getContrast = (
  backgroundColor: string,
  foregroundColor: string,
): number | null => {
  if (!foregroundColor || !backgroundColor) {
    return null;
  }

  const backgroundLuminance = getRelativeLuminance(backgroundColor);
  const foregroundLuminance = getRelativeLuminance(foregroundColor);

  if (foregroundLuminance !== null && backgroundLuminance !== null) {
    const contrast =
      (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
      (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);

    return contrast;
  }

  return null;
};

/**
 * From https://github.com/dequelabs/axe-core (has-valid-contrast-ratio.js)
 * Check whether two hex colors meet an accessible contrast ratio (WCAG AA as default)
 * https://www.w3.org/TR/WCAG21/#contrast-minimum
 */
export const hasValidContrastRatio = (
  backgroundColor: string,
  foregroundColor: string,
  fontSize: number,
  isBold: boolean,
  contrastRatioOverride?: number,
): {
  isValid: boolean | 0 | null;
  contrastRatio: number | null;
  expectedContrastRatio: number;
} => {
  const contrast = getContrast(backgroundColor, foregroundColor);
  const contrastRatioLevelAA = 4.5;
  const largeFontContrastRatio = 3;

  const isSmallFont =
    (isBold && Math.ceil(fontSize * 72) / 96 < 14) ||
    (!isBold && Math.ceil(fontSize * 72) / 96 < 18);

  const expectedContrastRatio = isSmallFont
    ? contrastRatioOverride
      ? contrastRatioOverride
      : contrastRatioLevelAA
    : largeFontContrastRatio;

  return {
    isValid: contrast && contrast > expectedContrastRatio,
    contrastRatio: contrast,
    expectedContrastRatio,
  };
};
