import { RouteNames_DO_NOT_USE } from './RouteNames';
import type { RouteContext } from './Router.types';

export const pathnameToRouteContext = (
  pathname: string,
  origin: string = window.location.origin,
): RouteContext => {
  const firstPathSegment = pathname.split('/')[1];
  let routeName;
  let url = null;

  if (pathname === '/') {
    routeName = RouteNames_DO_NOT_USE.ROOT;
  } else if (firstPathSegment === 'b') {
    routeName = RouteNames_DO_NOT_USE.BOARD;
  } else if (firstPathSegment === 'c') {
    routeName = RouteNames_DO_NOT_USE.CARD;
  } else if (firstPathSegment === 'u') {
    routeName = RouteNames_DO_NOT_USE.PROFILE;
  } else if (firstPathSegment === 'w') {
    routeName = RouteNames_DO_NOT_USE.WORKSPACE;
  } else if (firstPathSegment === 'shortcuts') {
    routeName = RouteNames_DO_NOT_USE.SHORTCUTS;
  } else if (firstPathSegment === 'power-ups') {
    routeName = RouteNames_DO_NOT_USE.POWER_UPS;
  } else if (/^search/.test(firstPathSegment)) {
    routeName = RouteNames_DO_NOT_USE.SEARCH;
  } else {
    routeName = RouteNames_DO_NOT_USE.UNKNOWN;
  }

  // We have a quick-board route - i.e. "//board-name" - that will cause an
  // error if the route doesn't include a board name / search term (we can't
  // construct a URL instance from this because it's not valid). In that case,
  // we suppress the error and let the URL instance be null (the
  // quick-boards.js#quickBoard method will redirect back to "/")
  try {
    url = new URL(pathname, origin);
  } catch (e) {
    // We can't really do anything here... we need to retire the "//board-name"
    // routes, but that's a much larger problem.
  }

  return {
    routeName,
    routePath: pathname,
    url,
  };
};
