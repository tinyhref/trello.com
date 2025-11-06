import { isHighDPI } from '@trello/browser';
import {
  biggestPreview,
  makePreviewCachable,
  smallestPreviewBetween,
  smallestPreviewBiggerThan,
} from '@trello/image-previews';

const HIGH_DPI_MIN_WIDTH = 600;
const LOW_DPI_MIN_WIDTH = 300;

//we export CARD_BACK_MAX_HEIGHT for use with card back stickers
export const CARD_BACK_MAX_HEIGHT = 160;
export const PLANNER_CARD_COVER_HEIGHT = 80;
const CARD_FRONT_MAX_HEIGHT = 260;
const MIN_HEIGHT = 116;
const MAX_WIDTH = 730;

type Preview = {
  width: number;
  height: number;
  url: string;
  scaled: boolean | null;
};

interface GetImageCoverStylesProps {
  isCardBack: boolean;
  scaled: Preview[];
  isFullCover: boolean;
  edgeColor: string;
  previewHeightMultiplier: number;
  isPlannerCard?: boolean;
}

// eslint-disable-next-line @eslint-react/no-unnecessary-use-prefix
export const useImageCoverStyles = ({
  isCardBack,
  scaled,
  isFullCover,
  edgeColor,
  previewHeightMultiplier,
  isPlannerCard,
}: GetImageCoverStylesProps) => {
  const defaultMaxHeight = isCardBack
    ? CARD_BACK_MAX_HEIGHT
    : CARD_FRONT_MAX_HEIGHT;

  const getBrightnessForImageCover = () => {
    if (edgeColor !== 'transparent') {
      const [r, g, b] = Array.from(
        (edgeColor.match(/[0-9a-f]{2}/gi) ?? []).map((v) => parseInt(v, 16)),
      );

      const avg = (r + g + b) / 3;
      if (avg >= 140) {
        return 'light' as const;
      } else {
        return 'dark' as const;
      }
    }
  };

  const getPreview = () => {
    if (!scaled) {
      return null;
    }

    const minWidth = isHighDPI() ? HIGH_DPI_MIN_WIDTH : LOW_DPI_MIN_WIDTH;

    if (isCardBack) {
      return (
        smallestPreviewBetween(
          scaled,
          minWidth,
          CARD_BACK_MAX_HEIGHT,
          MAX_WIDTH,
          Infinity,
        ) ?? biggestPreview(scaled)
      );
    } else {
      return (
        smallestPreviewBiggerThan(scaled, minWidth) || biggestPreview(scaled)
      );
    }
  };

  const preview = getPreview();

  const calculatedImagePreviewHeight = isCardBack
    ? Math.max(MIN_HEIGHT, Math.min(preview?.height ?? defaultMaxHeight))
    : ((preview?.height ?? 0) * previewHeightMultiplier) /
      (preview?.width ?? 1);

  const maxHeight = Math.min(
    preview?.height || defaultMaxHeight,
    defaultMaxHeight,
  );

  const calculatedCoverHeight = Math.min(
    calculatedImagePreviewHeight,
    maxHeight,
  );

  const backgroundColor = edgeColor ?? 'transparent';

  const brightness = isCardBack ? getBrightnessForImageCover() : undefined;

  const defaultImageStyles = {
    backgroundImage: `url("${makePreviewCachable(preview?.url)}")`,
    backgroundColor,
    brightness,
  };

  let calculatedCoverImageStyles;

  if (isCardBack) {
    let backgroundSize: string;

    if (isFullCover) {
      backgroundSize = 'cover';
    } else if (preview && preview?.height < calculatedImagePreviewHeight) {
      backgroundSize = 'initial';
    } else {
      backgroundSize = 'contain';
    }

    calculatedCoverImageStyles = {
      ...defaultImageStyles,
      backgroundSize,
      minHeight: isPlannerCard
        ? PLANNER_CARD_COVER_HEIGHT
        : Math.min(calculatedImagePreviewHeight, MIN_HEIGHT),
      height: isPlannerCard
        ? PLANNER_CARD_COVER_HEIGHT
        : Math.min(calculatedImagePreviewHeight, maxHeight),
      maxHeight: isPlannerCard
        ? PLANNER_CARD_COVER_HEIGHT
        : Math.min(calculatedImagePreviewHeight, maxHeight),
    };
  } else {
    calculatedCoverImageStyles = {
      ...defaultImageStyles,
      height: isFullCover ? undefined : `${calculatedCoverHeight}px`,
      maxHeight: isFullCover ? undefined : `${maxHeight}px`,
      backgroundSize:
        isFullCover || calculatedImagePreviewHeight <= maxHeight
          ? 'cover'
          : 'contain',
      minHeight: isFullCover ? `${calculatedCoverHeight}px` : '',
    };
  }

  return {
    calculatedCoverImageStyles,
    calculatedCoverHeight,
    brightness,
  };
};
