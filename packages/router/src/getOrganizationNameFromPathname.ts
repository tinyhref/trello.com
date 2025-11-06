import {
  getRouteIdFromPathname,
  isOrganizationRoute,
  routeDefinitions,
} from '@trello/router/routes';

/**
 * Returns the organization name contained in a provided URL pathname.
 * Will return undefined if pathname is not an organization pathname
 * or if the pathname does not contain a organization name.
 *
 * @example
 * // returns 'teamplates'
 * getBoardShortLinkFromPathname('/w/teamplates/tables');
 */
export function getOrganizationNameFromPathname(pathname: string) {
  const routeId = getRouteIdFromPathname(pathname);
  const route = routeDefinitions[routeId];

  if (!isOrganizationRoute(route.id)) {
    return undefined;
  }

  const [, orgname] = route.regExp.exec(pathname.slice(1)) ?? [];
  return orgname;
}
