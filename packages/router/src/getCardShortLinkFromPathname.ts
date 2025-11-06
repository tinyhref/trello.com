import {
  getRouteIdFromPathname,
  routeDefinitions,
  RouteId,
} from '@trello/router/routes';

/**
 * Returns the card shortlink contained in a provided URL pathname.
 * Will return undefined if pathname is not a card pathname
 * or if the pathname does not contain a shortlink.
 *
 * @example
 * // returns 'dSmI3Mww'
 * getCardShortLinkFromPathname('/c/dSmI3Mww/card-title');
 */
export function getCardShortLinkFromPathname(pathname: string) {
  const routeId = getRouteIdFromPathname(pathname);
  const route = routeDefinitions[routeId];

  if (routeId !== RouteId.CARD) {
    return undefined;
  }

  const [, shortLink] = route.regExp.exec(pathname.slice(1)) ?? [];
  return shortLink;
}
