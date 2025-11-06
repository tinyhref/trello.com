import type { BaseLabelColor } from './labelColors';

/**
 * In some cases, we don't need the full label color spectrum, and only want
 * the base color. To that end, we can strip out everything succeeding an
 * underscore character to arrive at the base color, e.g. green_light -> green.
 */
export const flattenLabelColor = (color: string): NonNullable<BaseLabelColor> =>
  color.split('_')[0] as NonNullable<BaseLabelColor>;
