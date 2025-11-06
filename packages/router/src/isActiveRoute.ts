import type { RouteIdType } from '@trello/router/routes';

import type { useRoute } from './useRoute';

/**
 * Type predicate to safely determine if the route is active.
 * You can use this in conjunction with useRoute so that if you are using the hook
 * with multiple routes, like const route = useRoute<typeof RouteId.CARD | RouteId.BOARD>(), then you can
 * determine which route is active by doing isRoute(route, RouteId.CARD) and then using the route
 * with type safety implied.
 * @param route the return value of useRoute
 * @param id the id of the route. Ie, RouteId.CARD
 * @returns Boolean
 */
export function isActiveRoute<T extends RouteIdType>(
  route: Pick<ReturnType<typeof useRoute>, 'id'>,
  id: T,
): route is ReturnType<typeof useRoute<T>> {
  return route.id === id;
}
