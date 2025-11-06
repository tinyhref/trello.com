import {
  reloadedToUpdateStorageKey,
  shouldReloadToUpdate,
  startTime,
} from '@trello/client-updater';
import { clientVersion } from '@trello/config';
import { getLocation } from '@trello/router';
import { getRouteIdFromPathname } from '@trello/router/routes';
import { TrelloStorage } from '@trello/storage';

import type { MiddlewareFunction } from './MiddlewareFunction';

/**
 * If we're due for an update, refresh the page instead of routing client-side.
 *
 * `react-router` port of [reloadIfPassiveUpdatePending()](../../registerLegacyRouterMiddleware.ts)
 */
export const passiveClientUpdaterMiddleware: MiddlewareFunction = async (
  args,
  next,
): Promise<void> => {
  const nextUrl = new URL(args.request.url);
  if (shouldReloadToUpdate(nextUrl.pathname)) {
    // Write info about the current session to local storage, so that we can
    // pick it up on the next page load and send an operational event
    try {
      TrelloStorage.set(reloadedToUpdateStorageKey, {
        fromClientVersion: clientVersion,
        fromRoute: getRouteIdFromPathname(getLocation().pathname),
        toRoute: getRouteIdFromPathname(nextUrl.pathname),
        sessionLengthInSeconds: (Date.now() - startTime) / 1000,
      });
    } catch (e) {
      // We can't do anything for storage write errors at this point, we're
      // about to reload anyhow
    }

    window.location.href = nextUrl.href;
    return;
  } else {
    await next();
  }
};
