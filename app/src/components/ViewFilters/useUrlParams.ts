import { useCallback, useEffect, useState } from 'react';
import isEqual from 'react-fast-compare';

import {
  defaultRouter_DO_NOT_USE,
  RouteNames_DO_NOT_USE,
} from '@trello/router/legacy-router';
import { navigate } from '@trello/router/navigate';

export function useUrlParams() {
  const urlParamsFromRouteContext = useCallback(() => {
    const routeContext = defaultRouter_DO_NOT_USE.getRoute();
    const searchParams = routeContext.url?.searchParams;
    return searchParams ? Object.fromEntries(searchParams.entries()) : {};
  }, []);

  const [urlParams, setUrlParams] = useState(() => urlParamsFromRouteContext());

  useEffect(() => {
    return defaultRouter_DO_NOT_USE.subscribe((routeContext) => {
      // If we've navigated to e.g. a card on top of the board, we don't update
      // the URL params
      if (routeContext.routeName !== RouteNames_DO_NOT_USE.CARD) {
        setUrlParams((prevUrlParams) => {
          const newUrlParams = urlParamsFromRouteContext();

          if (isEqual(prevUrlParams, newUrlParams)) {
            return prevUrlParams; // Optimization: maintain reference equality to reduce re-renders
          }

          return newUrlParams;
        });
      }
    });
  }, [urlParamsFromRouteContext]);

  return urlParams;
}

export function useFixForBackboneNavigationBug() {
  useEffect(() => {
    // Our 8+ year old version of backbone doesn't handle querystrings
    // very well, and will sometimes strip them from the stored
    // fragment (e.g. if you use the back button to return to a URL
    // with a querystring). This can cause future calls to navigate
    // to be a no-op if you try to navigate to the same page without
    // any query params. Rather than trying to update
    // backbone (the current version includes the querystring when
    // computing the fragment), set replace:true to force backbone to
    // replace the current route with the correct one with a query
    // string, but without affecting browser history.
    const url = defaultRouter_DO_NOT_USE.getRoute().url;
    if (url) {
      navigate(`${url.pathname}${url.search}`, {
        replace: true,
      });
    }
  }, []);
}
