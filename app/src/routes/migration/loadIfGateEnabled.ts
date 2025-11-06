import { type LazyRouteFunction, type RouteObject } from 'react-router';

import { isRouteModernized } from '@trello/router/migration';
import { type RouteIdType } from '@trello/router/routes';

const noopLazy = async () => ({
  Component: () => null,
});

/**
 * Given a routeId and a lazy function, only load the route module if the feature gate is enabled.
 * @param routeId - The id for the route we're checking the gate for
 * @param lazyFn - The lazy function to load the route if the gate is enabled
 */
export const loadIfGateEnabled = async (
  routeId: RouteIdType,
  lazyFn: LazyRouteFunction<RouteObject>,
): ReturnType<LazyRouteFunction<RouteObject>> => {
  const shouldLoad = isRouteModernized(routeId);
  return shouldLoad ? lazyFn() : noopLazy();
};
