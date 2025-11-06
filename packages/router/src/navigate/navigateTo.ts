import { getLocation } from '@trello/router';
import type { BackboneHistoryNavigateOptions } from '@trello/router/legacy-router';
import type { RouteIdType, Routes } from '@trello/router/routes';
import { routeDefinitions } from '@trello/router/routes';

import { navigate } from './navigate';

function mergeSearchParams(current: URLSearchParams, next: URLSearchParams) {
  const keys = new Set([...current.keys(), ...next.keys()]);
  const merged = new URLSearchParams();
  for (const key of keys) {
    const value = next.get(key) ?? current.get(key);
    if (value) {
      merged.set(key, value);
    }
  }

  return merged;
}

interface NavigateOptions<T extends RouteIdType> {
  routeParams: ReturnType<Routes[T]['getRouteParams']> | null | undefined;
  searchParams?: Record<string, string> | null | undefined;
  navigateOptions: BackboneHistoryNavigateOptions;
  replaceSearchParams?: boolean;
}

/**
 * Will navigate to the url for a given route. For example:
 * navigateTo(RouteId.BOARD, {
     routeParams: { shortLink: board.shortLink, path: '/table', },
     navigateOptions: {
       replace: true
     },
     searchParams: {
       openCardComposerInFirstList: true,
     },
   })
 * This is to help ensure that search params are not overridden without explicitly
 * stating you want that using the replaceSearchParams = true option.
 * @param routeId RouteId, e.g. Board, Card, etc.
 * @param options.routeParams Set of params to create the pathname for the route
 * @param options.searchParams Optional set of search params to append to the url
 * @param options.navigateOptions Options to use when calling navigate function
 * @param options.navigateOptions.replace To update the URL without creating an entry in the browser's history,
 * set the replace option to true.
 * @param options.navigateOptions.trigger Using trigger = true will cause the route function to be called. Using
 * false will go to the route without calling the router function. (in Controller).
 * @param options.replaceSearchParams Whether to override current query params
 */
export function navigateTo<T extends RouteIdType>(
  routeId: T,
  options: NavigateOptions<T>,
) {
  const route = routeDefinitions[routeId];
  // @ts-expect-error The ts error makes no sense to me, and I would like to come back to it.
  // if you know how to fix this please have a go :).
  const pathname = route.routeParamsToPathname(options.routeParams);
  let nextUrl = `${pathname}`;

  if (options.searchParams) {
    let completeSearchParams;
    const searchParams = new URLSearchParams(options.searchParams);
    if (options.replaceSearchParams) {
      completeSearchParams = searchParams.toString();
    } else {
      const currentSearchParams = new URLSearchParams(getLocation().search);
      completeSearchParams = mergeSearchParams(
        currentSearchParams,
        searchParams,
      );
    }

    completeSearchParams = completeSearchParams.toString();
    if (completeSearchParams.length) {
      nextUrl += `?${completeSearchParams}`;
    }
  }

  navigate(nextUrl, options.navigateOptions);
}
