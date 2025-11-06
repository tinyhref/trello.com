import { getRouteFromWindow, routerState } from '@trello/router';

import type { MiddlewareFunction } from './MiddlewareFunction';

/**
 * Update the {@link routerState} when react-router navigates to a new route.
 */
export const routerStateMiddleware: MiddlewareFunction = async (
  _args,
  next,
): Promise<void> => {
  await next();

  routerState.setValue(getRouteFromWindow());
};
