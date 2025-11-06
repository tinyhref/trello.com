import { useEffect, useState } from 'react';

import { getBrightness } from '@trello/a11y';
import type { NullUnionOmit } from '@trello/model-types';
import { useGlobalTheme } from '@trello/theme';
import { usePreviousWhileLoading, useWorkspace } from '@trello/workspaces';

import type { BoardBackgroundQuery } from './BoardBackgroundQuery.generated';
import { useBoardBackgroundQuery } from './BoardBackgroundQuery.generated';

type BoardPrefs = NullUnionOmit<
  NonNullable<BoardBackgroundQuery['board']>['prefs'],
  '__typename'
>;

export interface BoardBackground
  extends Pick<
    NonNullable<BoardPrefs>,
    | 'background'
    | 'backgroundBottomColor'
    | 'backgroundBrightness'
    | 'backgroundDarkColor'
    | 'backgroundDarkImage'
    | 'backgroundImage'
    | 'backgroundImageScaled'
    | 'backgroundTile'
    | 'backgroundTopColor'
  > {
  backgroundColor: string | undefined;
  isBackgroundImage: boolean;
}

interface UseBoardBackgroundOptions {
  skip?: boolean;
}

export const emptyBoardBackground: BoardBackground = {
  background: '__empty__',
  backgroundImage: null,
  backgroundBrightness: 'unknown',
  backgroundColor: undefined,
  backgroundDarkColor: undefined,
  backgroundTopColor: '',
  backgroundTile: false,
  backgroundBottomColor: '',
  isBackgroundImage: false,
  backgroundImageScaled: [],
};

export const isEmptyBoardBackground = (background: BoardBackground) =>
  background.background === '__empty__';

/**
 * Given a board prefs object with background properties defined, get the
 * BoardBackground model in return. Extracted from `useBoardBackground` for
 * usage outside of React.
 */
export const getBoardBackground = (
  prefs: BoardPrefs | undefined,
  effectiveColorMode?: 'dark' | 'light',
): BoardBackground => {
  if (!prefs) {
    return emptyBoardBackground;
  }
  const {
    background,
    backgroundColor,
    backgroundDarkColor,
    backgroundTopColor,
    backgroundBottomColor,
    backgroundBrightness,
    backgroundImage,
    backgroundTile,
    backgroundImageScaled,
    backgroundDarkImage,
  } = prefs;

  let backgroundBrightnessComputed = backgroundBrightness;
  if (
    backgroundTopColor &&
    backgroundImage &&
    backgroundBrightness === 'unknown'
  ) {
    // It is possible for backgroundBrightness to be "unknown" in cases where the
    // image preview service times out or fails. Calculate it now.
    backgroundBrightnessComputed = getBrightness(backgroundTopColor);
  } else if (backgroundImage && !backgroundTopColor) {
    // If there is an image background, we need backgroundTopColor to compute
    // the color for nav. If missing, default to empty so text in nav is readable.
    return emptyBoardBackground;
  }

  /**
   * Old gradient backgrounds have a dark backgroundBrightness and
   * are just slightly tinted in dark mode. The new gradients have
   * a light version and a dark version that are very distinct from
   * eachother.
   *
   * Here we check if the background has a dedicated dark version and if
   * does, we use it and the global theme to determine the background brightness.
   *
   * In the future we may need to introduce more logic if we have light and
   * dark versions of a gradient that are still both overall dark or light.
   */
  if (backgroundDarkColor && effectiveColorMode) {
    backgroundBrightnessComputed = effectiveColorMode;
  }

  return {
    background,
    backgroundImage,
    backgroundColor: backgroundColor ?? undefined,
    backgroundDarkColor: backgroundDarkColor ?? undefined,
    backgroundTopColor,
    backgroundBottomColor,
    backgroundBrightness: backgroundBrightnessComputed,
    isBackgroundImage: Boolean(backgroundImage),
    backgroundTile,
    backgroundImageScaled,
    backgroundDarkImage,
  };
};

/**
 * Given a board ID, derive the values required to hydrate a usable
 * BoardBackground model. To get these values for the current board, refer to
 * `useCurrentBoardBackground` instead.
 */
export function useBoardBackground({
  idBoard,
  waitOn = ['None'],
  skip: skipUpdateBackground,
}: {
  idBoard: string | null;
  waitOn?: Parameters<typeof useBoardBackgroundQuery>[0]['waitOn'];
  skip?: boolean;
}) {
  const skip = !idBoard || skipUpdateBackground;
  // `/1/board/{idBoard}?fields=id,prefs&operationName=BoardBackground`
  const { data } = useBoardBackgroundQuery({
    skip,
    variables: { boardId: idBoard || '' },
    waitOn,
  });

  const { effectiveColorMode } = useGlobalTheme();

  const [boardBackground, setBoardBackground] =
    useState<BoardBackground>(emptyBoardBackground);

  useEffect(() => {
    setBoardBackground(
      getBoardBackground(data?.board?.prefs, effectiveColorMode),
    );
  }, [data?.board?.prefs, effectiveColorMode]);

  return boardBackground;
}

export function useCurrentBoardBackground({
  skip,
}: UseBoardBackgroundOptions = {}) {
  const workspace = useWorkspace();
  const idBoard = usePreviousWhileLoading(
    workspace.idBoard,
    workspace.isLoading,
    null,
  );
  return useBoardBackground({
    skip,
    idBoard,
    waitOn: ['CurrentBoardInfo'],
  });
}
