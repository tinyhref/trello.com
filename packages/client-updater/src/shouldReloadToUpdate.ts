/* eslint-disable @typescript-eslint/no-use-before-define */
import { getLocation } from '@trello/router';
import {
  getRouteIdFromPathname,
  isBoardRoute,
  isCardRoute,
} from '@trello/router/routes';

import { oneDayInMs } from './constants';

export const startTime = Date.now();

export type ReloadCheckResult =
  | 'BOARD_TO_CARD_TRANSITION'
  | 'CARD_TO_BOARD_TRANSITION'
  | 'NOT_TIME_YET'
  | 'RELOAD'
  | 'SAME_BOARD';

export const shouldReloadToUpdate = (path: string) => {
  try {
    return getReloadCheckResult(getLocation().pathname, path) === 'RELOAD';
  } catch (err) {
    return false;
  }
};

/**
 * Returns a reason to update or not. This could theoretically be a boolean
 * value, but using an enum of outcomes lets us unit test with confidence (each
 * return value is unique, which lets us avoid false negatives when testing each
 * possible branch of code).
 */
export const getReloadCheckResult = (
  currentPath: string,
  nextPath: string,
): ReloadCheckResult => {
  const currentRoute = getRouteIdFromPathname(currentPath);
  const nextRoute = getRouteIdFromPathname(nextPath);
  const nextPathName = new URL(nextPath, window.location.origin).pathname;
  if (isBoardRoute(currentRoute) && isCardRoute(nextRoute)) {
    return 'BOARD_TO_CARD_TRANSITION';
  }

  if (isCardRoute(currentRoute) && isBoardRoute(nextRoute)) {
    return 'CARD_TO_BOARD_TRANSITION';
  }

  if (isBoardRoute(currentRoute) && currentPath === nextPathName) {
    return 'SAME_BOARD';
  }

  if (Date.now() - startTime <= oneDayInMs) {
    return 'NOT_TIME_YET';
  }

  // We should reload to pick up the latest version
  return 'RELOAD';
};
