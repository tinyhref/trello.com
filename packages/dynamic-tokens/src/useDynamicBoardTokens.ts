import {
  isEmptyBoardBackground,
  useCurrentBoardBackground,
} from './useBoardBackground';
import { useDynamicTokens } from './useDynamicTokens';

/**
 * Helper function for assigning dynamic tokens for the current board background
 * to a given element.
 */
export function useDynamicBoardTokens(
  props: Omit<Parameters<typeof useDynamicTokens>[0], 'background'>,
) {
  const background = useCurrentBoardBackground();

  useDynamicTokens({
    ...props,
    background: isEmptyBoardBackground(background)
      ? null
      : {
          backgroundBrightness: background.backgroundBrightness,
          backgroundColor: background.isBackgroundImage
            ? background.backgroundTopColor
            : background.backgroundColor,
          isBackgroundImage: background.isBackgroundImage,
        },
  });
}
