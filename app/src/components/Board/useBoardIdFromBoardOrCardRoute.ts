import { isActiveRoute, useRoute } from '@trello/router';
import { RouteId } from '@trello/router/routes';

import { useNativeBoardQuickloadAndSubscription } from 'app/src/components/App/useNativeBoardQuickloadAndSubscription';
import { useBoardShortLinkForBoardIdQuery } from './BoardShortLinkForBoardIdQuery.generated';
import { useCardShortLinkForBoardIdQuery } from './CardShortLinkForBoardIdQuery.generated';
import { useTrelloBoardObjectIdByShortLinkQuery } from './TrelloBoardObjectIdByShortLinkQuery.generated';

/**
 * Will get the object id for the board based on the route you are on
 * @returns object id for board
 */
export const useBoardIdFromBoardOrCardRoute = () => {
  const route = useRoute<typeof RouteId.BOARD | typeof RouteId.CARD>();

  const nativeQuickloadAndSubscriptionsEnabled =
    useNativeBoardQuickloadAndSubscription();

  // Reading from Native GraphQL cache first
  // eslint-disable-next-line @trello/no-cache-only-queries
  const { data: trelloBoardData } = useTrelloBoardObjectIdByShortLinkQuery({
    variables: {
      shortLink: isActiveRoute(route, RouteId.BOARD)
        ? route.params.shortLink
        : '',
    },
    skip:
      !isActiveRoute(route, RouteId.BOARD) ||
      !nativeQuickloadAndSubscriptionsEnabled,
    fetchPolicy: 'cache-only',
    waitOn: ['TrelloCurrentBoardInfo'],
  });
  const trelloBoardObjectId =
    trelloBoardData?.trello.boardByShortLink?.objectId;

  // Reading from client-side cache for a fallback
  // eslint-disable-next-line @trello/no-cache-only-queries
  const { data: boardData } = useBoardShortLinkForBoardIdQuery({
    variables: {
      boardId: isActiveRoute(route, RouteId.BOARD)
        ? route.params.shortLink
        : '',
    },
    skip:
      !isActiveRoute(route, RouteId.BOARD) ||
      nativeQuickloadAndSubscriptionsEnabled,
    fetchPolicy: 'cache-only',
    waitOn: ['CurrentBoardInfo'],
  });
  const boardId = boardData?.board?.id ?? null;

  // eslint-disable-next-line @trello/no-cache-only-queries
  const { data: cardData } = useCardShortLinkForBoardIdQuery({
    variables: {
      cardId: isActiveRoute(route, RouteId.CARD) ? route.params.shortLink : '',
    },
    skip: !isActiveRoute(route, RouteId.CARD),
    fetchPolicy: 'cache-only',
    waitOn: ['PreloadCard'],
  });

  return trelloBoardObjectId ?? boardId ?? cardData?.card?.idBoard ?? null;
};
