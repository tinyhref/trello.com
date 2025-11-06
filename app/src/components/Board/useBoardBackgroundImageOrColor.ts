import { useEffect, useMemo, useRef, useState } from 'react';

import { isMemberLoggedIn } from '@trello/authentication';
import {
  Backgrounds,
  type Background,
  type ModernGradientBackground,
} from '@trello/boards';
import { isEmbeddedDocument } from '@trello/browser';
import { useCurrentBoardBackground } from '@trello/dynamic-tokens/dynamic-board-tokens';
import { FavIcon } from '@trello/favicon';
import {
  biggestPreview,
  smallestPreviewBiggerThan,
} from '@trello/image-previews';
import { useSplitScreenSharedState } from '@trello/split-screen';
import { useGlobalTheme, type EffectiveColorMode } from '@trello/theme';
import { UnsplashTracker } from '@trello/unsplash';

import {
  BOARD_VIEW_BACKGROUND_CLASSES,
  CUSTOM_BOARD_BACKGROUND_CLASS,
  CUSTOM_BOARD_BACKGROUND_TILED_CLASS,
  DARK_BOARD_BACKGROUND_CLASS,
  GRADIENT_BOARD_BACKGROUND_CLASS,
  LIGHT_BOARD_BACKGROUND_CLASS,
  STATIC_COLOR_BACKGROUND_CLASS,
} from 'app/scripts/views/board/boardViewBackgroundClasses';

/**
 * new backgrounds are based on ADS color values.
 */
const isModernGradient = (
  background?: Background,
): background is ModernGradientBackground =>
  Boolean(background?.type === 'gradient' && background.version! >= 2);

export const getBoardBackgroundUrl = (
  prefs: Pick<
    ReturnType<typeof useCurrentBoardBackground>,
    | 'background'
    | 'backgroundDarkImage'
    | 'backgroundImage'
    | 'backgroundImageScaled'
    | 'backgroundTile'
  > & { effectiveColorMode?: EffectiveColorMode },
): {
  /**
   * URL for the background image
   */
  url?: string | null;
  /**
   * Background image variant that is smaller than or equal to the original.
   */
  smallUrl?: string | null;
} => {
  const backgroundImage =
    isModernGradient(Backgrounds[prefs.background]) &&
    prefs.effectiveColorMode === 'dark'
      ? prefs.backgroundDarkImage
      : prefs.backgroundImage;

  let url = backgroundImage;
  if (Object.prototype.hasOwnProperty.call(Backgrounds, prefs.background)) {
    // Special handling for our default backgrounds, to avoid using the
    // really huge versions
    url =
      smallestPreviewBiggerThan(prefs.backgroundImageScaled, 640, 480)?.url ||
      url;
  } else {
    url =
      biggestPreview(prefs.backgroundImageScaled, backgroundImage)?.url || url;
  }

  let smallUrl = url;
  if (!prefs.backgroundTile) {
    smallUrl =
      smallestPreviewBiggerThan(prefs.backgroundImageScaled, 300, 300)?.url ||
      backgroundImage;
  }

  return { url, smallUrl };
};

/**
 * When split screen is enabled, we render the board within a panel rather
 * than at full screen, even if it is the only panel open. So when split
 * screen is enabled, we need to attach to the board panel root element.
 * Otherwise continue to attach to the #trello-root element
 */
const useTrelloRootElementId = () => {
  const { isSplitScreenEnabled } = useSplitScreenSharedState();
  const [rootElementId, setRootElementId] = useState<
    'trello-board-root' | 'trello-root'
  >('trello-root');

  useEffect(() => {
    // This should match the render conditions in SplitScreenManager.tsx
    if (!isEmbeddedDocument() && isSplitScreenEnabled && isMemberLoggedIn()) {
      setRootElementId('trello-board-root');
    } else {
      setRootElementId('trello-root');
    }
  }, [isSplitScreenEnabled]);

  return rootElementId;
};

/**
 * Manages the global CSS classes from core.less applied to the
 * #trello-root element based on the current board background
 */
export const useTrelloRootGlobalClasses = (
  rootElement: HTMLElement | null,
  {
    background,
    backgroundBrightness,
    backgroundColor,
    backgroundTile,
    isBackgroundImage,
  }: ReturnType<typeof useCurrentBoardBackground>,
) => {
  useEffect(() => {
    if (!rootElement) {
      return;
    }

    rootElement.classList.toggle(
      LIGHT_BOARD_BACKGROUND_CLASS,
      backgroundBrightness === 'light',
    );
    rootElement.classList.toggle(
      DARK_BOARD_BACKGROUND_CLASS,
      backgroundBrightness === 'dark',
    );
    rootElement.classList.toggle(
      CUSTOM_BOARD_BACKGROUND_TILED_CLASS,
      backgroundTile,
    );
    rootElement.classList.toggle(
      CUSTOM_BOARD_BACKGROUND_CLASS,
      isBackgroundImage,
    );
    /**
     * This class only has an effect when the user is in dark mode,
     * and will not be used for new gradients.
     */
    rootElement.classList.toggle(
      GRADIENT_BOARD_BACKGROUND_CLASS,
      Boolean(
        background.startsWith('gradient-') &&
          backgroundColor &&
          !isModernGradient(Backgrounds[background]),
      ),
    );
    rootElement.classList.toggle(
      STATIC_COLOR_BACKGROUND_CLASS,
      Boolean(
        !background.startsWith('gradient-') &&
          !isBackgroundImage &&
          backgroundColor,
      ),
    );

    return () => {
      BOARD_VIEW_BACKGROUND_CLASSES.forEach((className) => {
        rootElement?.classList?.remove(className);
      });
    };
  }, [
    background,
    backgroundColor,
    backgroundBrightness,
    backgroundTile,
    isBackgroundImage,
    rootElement,
  ]);
};

/**
 * Update the favicon background based on the current
 * board background
 */
export const useFaviconBackground = ({
  background,
  backgroundColor,
  backgroundImage,
  backgroundImageScaled,
  backgroundTile,
  backgroundTopColor,
  backgroundBottomColor,
}: ReturnType<typeof useCurrentBoardBackground>) => {
  const { smallUrl } = getBoardBackgroundUrl({
    background,
    backgroundImage,
    backgroundTile,
    backgroundImageScaled,
  });

  useEffect(() => {
    if (background.startsWith('gradient-') && backgroundColor) {
      FavIcon.setBackground({
        color: backgroundColor,
        topColor: backgroundTopColor,
        bottomColor: backgroundBottomColor,
      });
    } else if (smallUrl) {
      FavIcon.setBackground({
        url: smallUrl,
        tiled: backgroundTile,
      });
    } else if (backgroundColor) {
      FavIcon.setBackground({ color: backgroundColor });
    }

    return () => {
      FavIcon.resetBackground();
    };
  }, [
    background,
    backgroundBottomColor,
    backgroundColor,
    backgroundTile,
    backgroundTopColor,
    smallUrl,
  ]);
};

export const computePreviewElementId = (id: string) =>
  `${id}-low-res-background-preview`;

/**
 * This hook creates a temporary div behind the #trello-root element
 * with a low-res image preview of the background. It then triggers
 * a fetch of the full image and sets it as the background on the
 * #trello-root element and removes the temporary div after a delay.
 */
export const useBoardImagePreviewer = (
  rootElement: HTMLElement | null,
  {
    background,
    backgroundColor,
    backgroundDarkColor,
    backgroundDarkImage,
    backgroundImage,
    backgroundImageScaled,
    backgroundTile,
  }: ReturnType<typeof useCurrentBoardBackground>,
) => {
  const imageAbortControllerRef = useRef<AbortController | null>(null);
  const { effectiveColorMode } = useGlobalTheme();
  const isDarkMode = effectiveColorMode === 'dark';
  const computedBackgroundColor = useMemo(() => {
    return background.startsWith('gradient-') &&
      isModernGradient(Backgrounds[background]) &&
      isDarkMode
      ? backgroundDarkColor
      : backgroundColor;
  }, [background, isDarkMode, backgroundDarkColor, backgroundColor]);

  useEffect(() => {
    const { smallUrl, url } = getBoardBackgroundUrl({
      background,
      backgroundImage,
      backgroundTile,
      backgroundImageScaled,
      backgroundDarkImage,
      effectiveColorMode,
    });

    let timeout: number | null = null;
    if (!rootElement) {
      return;
    }

    const imagePreviewId = computePreviewElementId(rootElement.id);
    rootElement.style.backgroundColor = computedBackgroundColor ?? '';

    if (url) {
      imageAbortControllerRef.current?.abort();

      const previewElement = document.createElement('div');
      previewElement.id = imagePreviewId;
      previewElement.style.position = 'absolute';
      previewElement.style.top = '0';
      previewElement.style.left = '0';
      previewElement.style.right = '0';
      previewElement.style.bottom = '0';
      previewElement.style.background = `url(${smallUrl})`;
      previewElement.style.backgroundSize = backgroundTile ? 'auto' : 'cover';
      previewElement.style.backgroundRepeat = backgroundTile ? 'repeat' : '';
      previewElement.style.backgroundPosition = 'center';
      previewElement.style.zIndex = '0';
      rootElement.parentElement!.insertBefore(previewElement, rootElement);

      const controller = new AbortController();
      imageAbortControllerRef.current = controller;
      const startTime = Date.now();

      // eslint-disable-next-line @trello/fetch-includes-client-version
      fetch(url, {
        signal: controller.signal,
        cache: 'force-cache',
      })
        .then((response) => response.blob())
        .then((blob) => {
          rootElement.style.backgroundImage = `url("${url}")`;
          rootElement.style.backgroundSize = backgroundTile ? 'auto' : 'cover';
          rootElement.style.backgroundRepeat = backgroundTile ? 'repeat' : '';
          rootElement.style.backgroundPosition = 'center';

          if (Date.now() - startTime < 50) {
            // We have retrieved the image from the browsers cache. Lets display it immediately
            document.getElementById(imagePreviewId)?.remove();
          } else {
            // The image was downloaded from the server, and as a result it will be the browsers first time
            // rendering it. It will take longer to render, so we want to keep the blurry background there for
            // longer while the full image renders behind it. Without this, users would see the image slowly
            // rendering down the screen, which is a bit jarring when rendering a board.
            // Use blob.size / 8 to map a 16k blob to 2s delay.
            timeout = window.setTimeout(() => {
              document.getElementById(imagePreviewId)?.remove();
            }, blob.size / 8);
          }
        })
        .catch(() => {
          // Do nothing if image loading fails
        });

      UnsplashTracker.trackOncePerInterval(url);
    }

    return () => {
      if (timeout) {
        window.clearTimeout(timeout);
      }
      document.getElementById(imagePreviewId)?.remove();
      imageAbortControllerRef.current?.abort();
      rootElement.style.backgroundImage = '';
      rootElement.style.backgroundSize = '';
      rootElement.style.backgroundRepeat = '';
      rootElement.style.backgroundPosition = '';
      rootElement.style.backgroundColor = '';
    };
  }, [
    background,
    backgroundColor,
    backgroundDarkImage,
    backgroundImage,
    backgroundImageScaled,
    backgroundTile,
    effectiveColorMode,
    rootElement,
    backgroundDarkColor,
    computedBackgroundColor,
  ]);
};

export function useBoardBackgroundImageOrColor({
  skip = false,
}: {
  skip?: boolean;
} = {}) {
  const rootElementId = useTrelloRootElementId();
  const rootElement = document.getElementById(rootElementId);

  const currentBoardBackground = useCurrentBoardBackground({ skip });
  useFaviconBackground(currentBoardBackground);
  useBoardImagePreviewer(rootElement, currentBoardBackground);
  useTrelloRootGlobalClasses(rootElement, currentBoardBackground);
}
