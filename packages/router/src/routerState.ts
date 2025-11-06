import type { RouteIdType } from '@trello/router/routes';
import { getRouteIdFromPathname } from '@trello/router/routes';
import { SharedState } from '@trello/shared-state';

import { getRouteParamsFromPathname } from './getRouteParamsFromPathname';
import type { BackboneHistoryNavigateOptions } from './legacy-router';

export interface LocationState {
  hostname: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
}

export interface RouterState<T extends RouteIdType> {
  id: RouteIdType;
  params: ReturnType<typeof getRouteParamsFromPathname<T>>;
  location: LocationState;
  options?: BackboneHistoryNavigateOptions;
}

class RouterSharedState<
  TValue extends RouterState<RouteIdType>,
> extends SharedState<TValue> {
  /**
   * Sets a new value and updates all listeners if the next value differs from the current value.
   */
  setValue(nextValue: Parameters<SharedState<TValue>['setValue']>[0]): void {
    const previousValue = JSON.stringify(this.value);
    const nextComputedValue = JSON.stringify(this.computeNextValue(nextValue));

    if (nextComputedValue !== previousValue) {
      super.setValue(nextValue);
    }
  }
}

export const getRouteFromWindow = (): RouterState<RouteIdType> => {
  const { pathname, search, hash, hostname, origin } = window.location;
  const nextLocation = { pathname, search, hash, hostname, origin };
  return {
    id: getRouteIdFromPathname(pathname),
    params: getRouteParamsFromPathname(pathname),
    location: nextLocation,
  };
};

export const routerState = new RouterSharedState<RouterState<RouteIdType>>(
  getRouteFromWindow(),
);
