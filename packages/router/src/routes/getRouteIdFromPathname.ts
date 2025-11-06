import { orderedRouteList } from './routeDefinitions';
import { type RouteIdType } from './RouteId';

/**
 * Returns the route id of a provided URL pathname. Will return undefined
 * if pathname does not match existing route regExp.
 *
 * @example
 * // returns 'powerUpPublicDirectory'
 * getRouteIdFromPathname('/power-ups');
 */
export const getRouteIdFromPathname = (path: string): RouteIdType => {
  const formattedPath = path.substring(1, path.length).replace(/\?(.*)$/, '');
  for (const route of orderedRouteList) {
    if (formattedPath.match(route.regExp)) {
      return route.id;
    }
  }

  throw new Error('Path name did not match any Route ID');
};
