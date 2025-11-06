import {
  IconBlueColor,
  IconDarkColor,
  IconDefaultColor,
  IconDisabledColor,
  IconGreenColor,
  IconLightColor,
  IconPinkColor,
  IconPurpleColor,
  IconQuietColor,
  IconRedColor,
  IconYellowColor,
} from '@trello/nachos/tokens';
import { token } from '@trello/theme';

/**
 * Storybook utility for rendering icons with many different color presets.
 * Avoid using this in production code.
 */
export const IconColorMap = {
  default: token('color.icon', IconDefaultColor),
  light: token('color.icon.inverse', IconLightColor),
  dark: token('color.text.accent.gray.bolder', IconDarkColor),
  disabled: token('color.icon.disabled', IconDisabledColor),
  quiet: token('color.icon.subtle', IconQuietColor),
  red: token('color.icon.accent.red', IconRedColor),
  green: token('color.icon.accent.green', IconGreenColor),
  yellow: token('color.icon.accent.yellow', IconYellowColor),
  blue: token('color.icon.accent.blue', IconBlueColor),
  purple: token('color.icon.accent.purple', IconPurpleColor),
  pink: token('color.icon.accent.magenta', IconPinkColor),
  gray: token('color.icon.accent.gray', IconDefaultColor),
};
