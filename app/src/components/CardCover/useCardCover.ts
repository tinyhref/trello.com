import type { CSSProperties } from 'react';
import { useEffect, useMemo } from 'react';
import { useContextSelector } from 'use-context-selector';

import type {
  BackgroundColor,
  TextColor,
} from '@atlaskit/tokens/css-type-schema';
import { hasMaliciousCoverAttachment } from '@trello/business-logic-react/card';
import { hasCover } from '@trello/business-logic/card';
import { useFeatureGate } from '@trello/feature-gate-client';
import { useBoardId, useCardId } from '@trello/id-context';
import { addIdleTask, clearIdleTask } from '@trello/idle-task-scheduler';
import type { Preview } from '@trello/image-previews';
import {
  biggestPreview,
  smallestPreviewBiggerThan,
} from '@trello/image-previews';
import { token } from '@trello/theme';
import { UnsplashTracker } from '@trello/unsplash';

import { BoardPreferencesContext } from 'app/src/components/BoardPreferencesContext/BoardPreferencesContext';
import { useCardCoverBoardFragment } from './CardCoverBoardFragment.generated';
import type { CardCoverFragment } from './CardCoverFragment.generated';
import { useCardCoverFragment } from './CardCoverFragment.generated';
import type { CoverColor } from './CoverColor.types';
import { useImageCoverStyles } from './useImageCoverStyles';

export type CardCover = NonNullable<CardCoverFragment>['cover'];

const DEFAULT_PREVIEW_HEIGHT_MULTIPLIER = 265;

type CardCoverBrightness = NonNullable<
  NonNullable<CardCoverFragment>['cover']
>['brightness'];

interface UseCardCoverResult {
  attachmentId?: string | null;
  brightness: CardCoverBrightness;
  calculatedCoverHeight: number | undefined;
  cardCoversEnabled?: boolean;
  colorCover: CoverColor;
  hasAttachmentCover: boolean;
  hasColorCover: boolean;
  hasCover: boolean;
  hasImageCover: boolean;
  hasUploadedBackgroundCover: boolean;
  hasVisibleCover: boolean;
  imageCoverStyles: CSSProperties;
  isFullCover: boolean;
  preview?: Preview | null;
  stickerCount: number;
  stickerLimit: number;
  colorCoverBackgroundColor?: BackgroundColor;
  colorCoverTextColor?: Exclude<TextColor, 'transparent'>;
}

const colorCoverIconMap = {
  green: {
    backgroundColor: token('color.background.accent.green.subtle', '#4bce97'),
    color: token('color.text.accent.green.bolder', '#164b35'),
  },
  yellow: {
    backgroundColor: token('color.background.accent.yellow.subtle', '#e2b203'),
    color: token('color.text.accent.yellow.bolder', '#533f04'),
  },
  orange: {
    backgroundColor: token('color.background.accent.orange.subtle', '#faa53d'),
    color: token('color.text.accent.orange.bolder', '#5f3811'),
  },
  red: {
    backgroundColor: token('color.background.accent.red.subtle', '#f87462'),
    color: token('color.text.accent.red.bolder', '#601e16'),
  },
  purple: {
    backgroundColor: token('color.background.accent.purple.subtle', '#9f8fef'),
    color: token('color.text.accent.purple.bolder', '#352c63'),
  },
  blue: {
    backgroundColor: token('color.background.accent.blue.subtle', '#579dff'),
    color: token('color.text.accent.blue.bolder', '#09326c'),
  },
  sky: {
    backgroundColor: token('color.background.accent.teal.subtle', '#60c6d2'),
    color: token('color.text.accent.teal.bolder', '#1d474c'),
  },
  lime: {
    backgroundColor: token('color.background.accent.lime.subtle', '#94c748'),
    color: token('color.text.accent.lime.bolder', '#5b7f24'),
  },
  pink: {
    backgroundColor: token('color.background.accent.magenta.subtle', '#e774bb'),
    color: token('color.text.accent.magenta.bolder', '#50253f'),
  },
  black: {
    backgroundColor: token('color.background.accent.gray.subtle', '#8590a2'),
    color: token('color.text.accent.gray.bolder', '#091e42'),
  },
};

interface UseCardCoverProps {
  previewHeightMultiplier?: number;
  isCardBack?: boolean;
  isPlannerCard?: boolean;
}

export function useCardCover({
  previewHeightMultiplier = DEFAULT_PREVIEW_HEIGHT_MULTIPLIER,
  isCardBack = false,
  isPlannerCard = false,
}: UseCardCoverProps = {}): UseCardCoverResult {
  const boardId = useBoardId();
  const cardId = useCardId();

  const { value: useContextForCardCoverPref } = useFeatureGate(
    'ghost_use_context_for_card_cover_pref',
  );

  const { data: cardData } = useCardCoverFragment({
    from: { id: cardId },
    optimistic: true,
  });

  const cover = cardData?.cover;
  const coverAttachmentId = cover?.idAttachment;
  const isFullCover = cover?.size === 'full';
  const edgeColor = cover?.edgeColor ?? 'transparent';

  const stickerCount = cardData?.stickers?.length ?? 0;
  const stickerLimit = cardData?.limits?.stickers?.perCard?.disableAt ?? 70; // default to 70 stickers on a card

  const { data: boardPrefData } = useCardCoverBoardFragment({
    from: useContextForCardCoverPref ? null : { id: boardId },
    optimistic: true,
  });

  const showCardCovers = useContextSelector(
    BoardPreferencesContext,
    (value) => value.showCardCovers,
  );

  const isCoverAttachmentMalicious = hasMaliciousCoverAttachment(cardData);

  const hasImageCover = useMemo(() => {
    if (!cover) {
      return false;
    }

    return Boolean(
      coverAttachmentId || cover.idUploadedBackground || cover.idPlugin,
    );
  }, [cover, coverAttachmentId]);

  const {
    brightness: imageBrightness,
    calculatedCoverHeight,
    calculatedCoverImageStyles,
  } = useImageCoverStyles({
    isCardBack,
    isFullCover,
    scaled: cover?.scaled ?? [],
    edgeColor,
    previewHeightMultiplier,
    isPlannerCard,
  });

  const cardCoversEnabled = useContextForCardCoverPref
    ? showCardCovers
    : (boardPrefData?.prefs?.cardCovers ?? false);

  /**
   * If we have a sharedSourceUrl, we know we need to send attribution to Unsplash. sharedSourceUrl
   * is the actual Unsplash URL, which this method will extract the ID from for proper attribution.
   * We do this behind an idle task so it doesn't take up main thread work when loading a board.
   */
  useEffect(() => {
    if (!cover?.sharedSourceUrl) return;
    const { sharedSourceUrl } = cover;

    const taskId = addIdleTask(() => {
      UnsplashTracker.trackOncePerInterval(sharedSourceUrl);
    }, 5000);
    return () => clearIdleTask(taskId);
  }, [cover]);

  if ((!hasCover(cover) || !cardCoversEnabled) && stickerCount === 0) {
    return {
      brightness: undefined,
      calculatedCoverHeight: undefined,
      cardCoversEnabled,
      colorCover: null,
      hasAttachmentCover: false,
      hasColorCover: false,
      hasCover: false,
      hasImageCover: false,
      hasUploadedBackgroundCover: false,
      hasVisibleCover: false,
      imageCoverStyles: {},
      isFullCover: false,
      preview: null,
      stickerCount: 0,
      stickerLimit: 0,
    };
  }

  const colorCover = cover?.color as CoverColor;

  const preview =
    cover?.scaled && !isCoverAttachmentMalicious
      ? smallestPreviewBiggerThan(cover.scaled, 86, 64) ||
        biggestPreview(cover.scaled)
      : null;

  const hasColorCover = !!cover?.color;
  const hasAttachmentCover = !!coverAttachmentId;
  const hasUploadedBackgroundCover = !!cover?.idUploadedBackground;

  return {
    attachmentId: coverAttachmentId,
    brightness:
      hasImageCover && isCardBack ? imageBrightness : cover?.brightness,
    calculatedCoverHeight,
    cardCoversEnabled,
    colorCover,
    colorCoverBackgroundColor: colorCover
      ? colorCoverIconMap[colorCover]?.backgroundColor
      : undefined,
    colorCoverTextColor: colorCover
      ? colorCoverIconMap[colorCover]?.color
      : undefined,
    hasAttachmentCover,
    hasColorCover,
    hasCover: hasCover(cover) && !isCoverAttachmentMalicious,
    hasImageCover,
    hasUploadedBackgroundCover,
    hasVisibleCover:
      hasCover(cover) && !isCoverAttachmentMalicious && cardCoversEnabled,
    imageCoverStyles: hasImageCover ? calculatedCoverImageStyles : {},
    isFullCover,
    preview,
    stickerCount,
    stickerLimit,
  };
}
