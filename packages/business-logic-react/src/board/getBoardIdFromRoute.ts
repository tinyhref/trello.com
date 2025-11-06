import { checkId, idCache } from '@trello/id-cache';
import { getLocation, getRouteParamsFromPathname } from '@trello/router';
import type { RouteId } from '@trello/router/routes';

/**
 * Retrieves the board id from the user's URL. Helpful for when we want to retrieve
 * the board id outside of a <BoardIdProvider>, e.g. Planner or Inbox.
 *
 * @returns The board id of the actively loaded board
 */
export const getBoardIdFromRoute = () => {
  const routeParams = getRouteParamsFromPathname<typeof RouteId.BOARD>(
    getLocation().pathname,
  );
  const { shortLink } = routeParams;

  return checkId(shortLink) ? shortLink : idCache.getBoardId(shortLink);
};
