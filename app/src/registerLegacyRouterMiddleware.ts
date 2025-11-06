import {
  reloadedToUpdateStorageKey,
  shouldReloadToUpdate,
  startTime,
} from '@trello/client-updater';
import { clientVersion } from '@trello/config';
import { getLocation } from '@trello/router';
import { addLegacyMiddleware } from '@trello/router/navigate';
import { getRouteIdFromPathname } from '@trello/router/routes';
import { TrelloStorage } from '@trello/storage';

export const registerLegacyRouterMiddleware = (): void => {
  addLegacyMiddleware(function reloadIfPassiveUpdatePending({ path, next }) {
    // If we're due for an update, refresh the page instead of routing client-
    // side.
    if (shouldReloadToUpdate(path)) {
      const nextUrl = new URL(path, window.location.origin);
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
      next();
    }
  });
};
