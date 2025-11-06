import { type NavigateFunction } from 'react-router';

import { getRouteIdFromPathname } from '@trello/router/routes';

import type { BackboneHistoryNavigateOptions } from '../legacy-router';
import { isRouteModernized } from '../migration';
import type { RouteIdType } from '../routes';

interface LegacyMiddlewareArguments {
  path: string;
  options?: BackboneHistoryNavigateOptions;
  next: () => void;
}

type LegacyMiddlewareFunction = (
  callbackArguments: LegacyMiddlewareArguments,
) => void;

const legacyMiddlewareFunctions: LegacyMiddlewareFunction[] = [];

/***
 * @deprecated This function should not be used. It was only introduced to remove circular dependencies.
 */
export const addLegacyMiddleware = (middlewareFn: LegacyMiddlewareFunction) => {
  if (!legacyMiddlewareFunctions.includes(middlewareFn)) {
    legacyMiddlewareFunctions.push(middlewareFn);
  }
};

const runLegacyMiddleware = (
  callbackList: LegacyMiddlewareFunction[],
  currentCallbackIndex: number,
  callbackArguments: Omit<LegacyMiddlewareArguments, 'next'>,
  done: () => void,
): void => {
  callbackList[currentCallbackIndex]({
    ...callbackArguments,
    next: callbackList[currentCallbackIndex + 1]
      ? () => {
          runLegacyMiddleware(
            callbackList,
            currentCallbackIndex + 1,
            callbackArguments,
            done,
          );
        }
      : done,
  });
};

type LegacyNavigateFunction = (
  path: string,
  options?: BackboneHistoryNavigateOptions,
) => void;

const navigateWithHistoryOnly: LegacyNavigateFunction = (path, options) => {
  const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  let normalizedPath = path;
  if (path?.charAt(0) !== '/') {
    normalizedPath = `/${path}`;
  }

  if (currentPath !== normalizedPath) {
    if (options?.replace) {
      history.replaceState(options, '', normalizedPath);
    } else {
      history.pushState(options, '', normalizedPath);
    }
  }
};

let reactRouterNavigateFunction: NavigateFunction | null = null;
/**
 * Store the React Router navigate function at the module level, so we can call it from our legacy navigate function.
 */
export const setReactRouterNavigateFunction = (func: NavigateFunction) => {
  reactRouterNavigateFunction = func;
};

/**
 * Legacy function that selectively forwards calls to React Router's navigate, or the legacy navigate function,
 * depending on whether the destination has been modernized.
 */
export const navigate = (
  path: string,
  options?: BackboneHistoryNavigateOptions,
): void => {
  const routeId: RouteIdType = getRouteIdFromPathname(path);

  // If the route is modernized, use React Router's navigate function
  if (isRouteModernized(routeId) && reactRouterNavigateFunction) {
    // Creating new opts object, since not all backbone navigate options have an equivalent in react router
    const reactRouterOpts = { replace: options?.replace };
    reactRouterNavigateFunction(path, reactRouterOpts);
    return;
  }

  // Legacy navigate
  if (legacyMiddlewareFunctions.length > 0) {
    runLegacyMiddleware(
      legacyMiddlewareFunctions,
      0,
      {
        path,
        options,
      },
      () => {
        navigateWithHistoryOnly(path, options);
      },
    );
  } else {
    navigateWithHistoryOnly(path, options);
  }
};
