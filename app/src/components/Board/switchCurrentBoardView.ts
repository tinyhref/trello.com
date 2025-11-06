import { client } from '@trello/graphql';
import { checkId, idCache } from '@trello/id-cache';
import {
  getLocation,
  getRouteParamsFromPathname,
  isActiveRoute,
  routerState,
} from '@trello/router';
import { navigateTo } from '@trello/router/navigate';
import type {
  BoardButlerViewParams,
  BoardCalendarPupViewParams,
  BoardCalendarViewParams,
  BoardDashboardViewParams,
  BoardMapViewParams,
  BoardPowerUpsViewParams,
  BoardPowerUpViewParams,
  BoardTableViewParams,
  BoardTimelineViewParams,
  BoardViewParams,
} from '@trello/router/routes';
import { getRouteIdFromPathname, RouteId } from '@trello/router/routes';
import { makeSlug } from '@trello/urls';

import type {
  SwitchToBoardCardDataQuery,
  SwitchToBoardCardDataQueryVariables,
} from './SwitchToBoardCardDataQuery.generated';
import { SwitchToBoardCardDataDocument } from './SwitchToBoardCardDataQuery.generated';
import type {
  SwitchToBoardDataQuery,
  SwitchToBoardDataQueryVariables,
} from './SwitchToBoardDataQuery.generated';
import { SwitchToBoardDataDocument } from './SwitchToBoardDataQuery.generated';

const getShortLinkAndNameForBoard = (
  pathname: string,
): { shortLink: string; shortName: string } => {
  const routeId = getRouteIdFromPathname(pathname);

  if (routeId === RouteId.BOARD) {
    const { shortLink, shortName } =
      getRouteParamsFromPathname<typeof RouteId.BOARD>(pathname);
    if (!shortLink) {
      return { shortLink: '', shortName: '' };
    }

    return { shortLink, shortName };
  }

  if (routeId === RouteId.CARD) {
    const { shortLink } =
      getRouteParamsFromPathname<typeof RouteId.CARD>(pathname);

    if (!shortLink) {
      return { shortLink: '', shortName: '' };
    }

    const cardId = checkId(shortLink)
      ? shortLink
      : idCache.getCardId(shortLink);

    if (!cardId) {
      return { shortLink: '', shortName: '' };
    }

    const cardData = client.readQuery<
      SwitchToBoardCardDataQuery,
      SwitchToBoardCardDataQueryVariables
    >({
      query: SwitchToBoardCardDataDocument,
      variables: {
        cardId,
      },
    });

    const boardData = client.readQuery<
      SwitchToBoardDataQuery,
      SwitchToBoardDataQueryVariables
    >({
      query: SwitchToBoardDataDocument,
      variables: {
        boardId: cardData?.card?.idBoard ?? '',
      },
    });

    return {
      shortLink: boardData?.board?.shortLink ?? '',
      shortName: makeSlug(boardData?.board?.name ?? null) ?? '',
    };
  }

  return { shortLink: '', shortName: '' };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DistributiveOmit<TType, TProps extends keyof any> = TType extends any
  ? Omit<TType, TProps>
  : never;

type BoardView =
  | BoardButlerViewParams
  | BoardCalendarPupViewParams
  | BoardCalendarViewParams
  | BoardDashboardViewParams
  | BoardMapViewParams
  | BoardPowerUpsViewParams
  | BoardPowerUpViewParams
  | BoardTableViewParams
  | BoardTimelineViewParams
  | BoardViewParams;

type NavigateToParams = Parameters<typeof navigateTo<typeof RouteId.BOARD>>[1];

type BoardRouteParams = DistributiveOmit<
  BoardView,
  'shortLink' | 'shortName'
> & {
  shortLink?: string | null | undefined;
  shortName?: string | null | undefined;
};

type SwitchCurrentBoardViewParams = {
  routeParams: BoardRouteParams;
} & Omit<NavigateToParams, 'routeParams'>;

export const switchCurrentBoardView = ({
  routeParams,
  searchParams,
  navigateOptions,
  replaceSearchParams,
}: SwitchCurrentBoardViewParams) => {
  // Users might choose to click a button on the board after they clicked to go to a different route.
  // If they do this, we have no way to abort/cancel the current navigation and change to this one.
  if (
    !isActiveRoute(routerState.value, RouteId.BOARD) &&
    !isActiveRoute(routerState.value, RouteId.CARD)
  ) {
    return;
  }

  let { shortLink, shortName } = routeParams;

  if (!shortLink || !shortName) {
    const pathname = getLocation().pathname;
    const results = getShortLinkAndNameForBoard(pathname);

    shortLink = results.shortLink;
    shortName = results.shortName;
  }

  if (!shortLink) {
    return;
  }

  navigateTo(RouteId.BOARD, {
    routeParams: {
      ...routeParams,
      shortLink,
      shortName,
    },
    searchParams,
    navigateOptions,
    replaceSearchParams,
  });
};
