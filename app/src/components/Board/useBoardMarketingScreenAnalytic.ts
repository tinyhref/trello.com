import { useEffect } from 'react';

import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { getMemberId } from '@trello/authentication';
import { checkIsTemplate } from '@trello/business-logic/board';
import { hasCover } from '@trello/business-logic/card';
import {
  customFieldsId as CUSTOM_FIELDS_POWER_UP_ID,
  mapPowerUpId as MAP_POWER_UP_ID,
} from '@trello/config';
import { PremiumFeatures } from '@trello/entitlements';
import { useFeatureGate } from '@trello/feature-gate-client';
import { client } from '@trello/graphql';
import { showLabelsState } from '@trello/labels/showLabelsState';
import { getScreenFromUrl } from '@trello/marketing-screens';
import { splitScreenSharedState } from '@trello/split-screen';
import { getGlobalTheme } from '@trello/theme';
import { workspaceNavigationState } from '@trello/workspace-navigation';

// eslint-disable-next-line no-restricted-imports
import { Controller } from 'app/scripts/controller';
import { BUTLER_POWER_UP_ID } from 'app/scripts/data/butler-id';
import { collapsedListsState } from 'app/src/components/CollapsedListsState';
import { DEFAULT_LIST_COLOR } from 'app/src/components/ListColorPicker/ListColor.constants';
import { getMarketingScreenInfo } from 'app/src/getMarketingScreenInfo';
import type {
  BoardMarketingAnalyticDataQuery,
  BoardMarketingAnalyticDataQueryVariables,
} from './BoardMarketingAnalyticDataQuery.generated';
import { BoardMarketingAnalyticDataDocument } from './BoardMarketingAnalyticDataQuery.generated';
import { boardSidebarState } from './boardSidebarState';

type Board = BoardMarketingAnalyticDataQuery['board'];
type Member = BoardMarketingAnalyticDataQuery['member'];

interface MemberAttributes {
  areKeyboardShortcutsEnabled: boolean;
  isColorBlindModeEnabled: boolean;
  isFirstTimeViewingBoard: boolean;
  viewerIsBoardCreator: boolean;
}

const getMemberAttributes = (member: Member, board: Board) => {
  return {
    areKeyboardShortcutsEnabled:
      member?.prefs?.keyboardShortcutsEnabled ?? false,
    isColorBlindModeEnabled: member?.prefs?.colorBlind ?? false,
    isFirstTimeViewingBoard: Controller.isFirstTimeViewingBoard,
    viewerIsBoardCreator: board?.idMemberCreator === getMemberId(),
  } as MemberAttributes;
};

interface BoardAttributes {
  isBoardCanvasModernizationEnabled: boolean;
  areCardCoversDisabled: boolean;
  hasBackgroundImage: boolean;
  isTemplate: boolean;
  isShowingSidebar?: boolean;
  isShowingWorkspaceNavigation?: boolean;
  numPowerups: number;
  visibility?: string;
}

const getBoardAttributes = (board: Board, isSplitScreenEnabled: boolean) => {
  if (!board) {
    return {};
  }

  const numPowerups = (board.boardPlugins ?? []).filter(
    (plugin) =>
      plugin.idPlugin !== BUTLER_POWER_UP_ID &&
      plugin.idPlugin !== MAP_POWER_UP_ID &&
      plugin.idPlugin !== CUSTOM_FIELDS_POWER_UP_ID,
  ).length;

  const prefs = board.prefs;

  const hasBackgroundImage = Boolean(prefs?.backgroundImage);
  const hasBackgroundGradient = Boolean(
    prefs?.background.startsWith('gradient-'),
  );

  const attrs: BoardAttributes = {
    isBoardCanvasModernizationEnabled: true,
    areCardCoversDisabled: prefs?.cardCovers === false,
    hasBackgroundImage: hasBackgroundImage && !hasBackgroundGradient,
    isTemplate: checkIsTemplate(board),
    visibility: prefs?.permissionLevel,
    numPowerups,
  };

  if (!isSplitScreenEnabled) {
    attrs.isShowingSidebar = boardSidebarState.value;
    attrs.isShowingWorkspaceNavigation =
      workspaceNavigationState.value.expanded;
  }

  return attrs;
};

interface ListAttributes {
  numOpenLists: number;
  numOpenCardsPerList: number[];
  hasColoredLists?: boolean;
  hasCollapsedLists?: boolean;
}

const getListAttributes = (board: Board) => {
  const lists = board?.lists;
  const cards = board?.cards ?? [];

  if (!lists) {
    return {};
  }

  const isCollapsibleListsEnabled =
    board?.premiumFeatures?.includes(PremiumFeatures.collapsibleLists) ?? false;

  const hasCollapsedLists = isCollapsibleListsEnabled
    ? Object.values(collapsedListsState.value[board.id] || {}).some(Boolean)
    : undefined;

  const isListColorsEnabled =
    board?.premiumFeatures?.includes(PremiumFeatures.listColors) ?? false;

  const attrs: ListAttributes = {
    numOpenLists: lists.length,
    numOpenCardsPerList: [],
    hasCollapsedLists,
  };

  if (isListColorsEnabled) {
    attrs.hasColoredLists = false;
  }

  const numOpenCardsPerListMap = new Map<string, number>();
  cards.forEach((card) => {
    const openCardsInList = numOpenCardsPerListMap.get(card.idList) ?? 0;
    numOpenCardsPerListMap.set(card.idList, openCardsInList + 1);
  });

  attrs.numOpenCardsPerList = lists.map(
    (list) => numOpenCardsPerListMap.get(list.id) ?? 0,
  );

  lists.forEach((list) => {
    if (
      isListColorsEnabled &&
      Boolean(list.color) &&
      list.color !== DEFAULT_LIST_COLOR
    ) {
      attrs.hasColoredLists = true;
    }
  });

  return attrs;
};

interface CardAttributes {
  numDoneCards: number;
  numOpenCards: number;
  numOpenMirrorCards: number;
  numOpenCardsWithCover: number;
  numOpenCardsWithLabels: number;
  numOpenCardsWithStickers: number;
}

const getCardAttributes = (board: Board) => {
  const cards = board?.cards;

  if (!cards) {
    return {};
  }

  const attrs: CardAttributes = {
    numOpenCards: cards.length,
    numDoneCards: 0,
    numOpenMirrorCards: 0,
    numOpenCardsWithCover: 0,
    numOpenCardsWithLabels: 0,
    numOpenCardsWithStickers: 0,
  };

  cards.forEach((card) => {
    if (card.dueComplete) {
      attrs.numDoneCards++;
    }
    if (card.cardRole === 'mirror') {
      attrs.numOpenMirrorCards++;
    }
    if (hasCover(card.cover)) {
      attrs.numOpenCardsWithCover++;
    }
    if (card.labels.length) {
      attrs.numOpenCardsWithLabels++;
    }
    if (card.stickers.length) {
      attrs.numOpenCardsWithStickers++;
    }
  });

  return attrs;
};

export const useBoardMarketingScreenAnalytic = (boardId: string) => {
  const { value: isSplitScreenEnabled } = useFeatureGate(
    'trello_personal_productivity_release',
  );

  useEffect(() => {
    /**
     * Use an idle callback to avoid any expensive logic for watching queries
     * or other attributes taking time while we render the board. This isn't high
     * priority, so we can defer it.
     */
    const idleCallbackId = window.requestIdleCallback(() => {
      const data = client.readQuery<
        BoardMarketingAnalyticDataQuery,
        BoardMarketingAnalyticDataQueryVariables
      >({
        query: BoardMarketingAnalyticDataDocument,
        variables: {
          memberId: getMemberId() ?? '', // can be null on a public board
          boardId,
        },
      });

      const board = data?.board;
      const member = data?.member;

      // Analytics migration -- move this to controller to capture all URL changes
      const { url, referrerUrl, referrerScreenName } = getMarketingScreenInfo();
      const { colorMode, effectiveColorMode } = getGlobalTheme();

      const memberAttributes = getMemberAttributes(member, board);
      const boardAttributes = getBoardAttributes(board, isSplitScreenEnabled);
      const listAttributes = getListAttributes(board);
      const cardAttributes = getCardAttributes(board);

      const labelsState = showLabelsState.value.showText
        ? 'expanded'
        : 'collapsed';

      const mirrorCardState = board?.myPrefs?.showCompactMirrorCards
        ? 'compact'
        : 'expanded';

      // We only want to include these attributes when SplitScreen is enabled
      const splitScreenState = isSplitScreenEnabled
        ? {
            isBoardOpen: splitScreenSharedState.value.board,
            isInboxOpen: splitScreenSharedState.value.inbox,
            isPlannerOpen: splitScreenSharedState.value.planner,
            isSwitcherOpen: splitScreenSharedState.value.switcher,
          }
        : {};

      Analytics.sendMarketingScreenEvent({
        url,
        referrerUrl,
        referrerScreenName,
        event: {
          source: 'boardScreen',
          name: 'boardScreenV2',
          attributes: {
            screen: getScreenFromUrl(),
            colorMode,
            effectiveColorMode,
            ...memberAttributes,
            ...boardAttributes,
            ...listAttributes,
            ...cardAttributes,
            ...splitScreenState,
            labelsState,
            mirrorCardState,
          },
          containers: formatContainers({
            idBoard: board?.id,
            idOrganization: board?.idOrganization,
          }),
        },
      });
    });

    return () => {
      window.cancelIdleCallback(idleCallbackId);
    };
    // We only want this to run once when the boardId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);
};
