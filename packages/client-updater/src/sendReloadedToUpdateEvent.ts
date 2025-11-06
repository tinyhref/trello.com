import { Analytics } from '@trello/atlassian-analytics';
import { clientVersion } from '@trello/config';
import { getScreenFromUrl } from '@trello/marketing-screens';
import { TrelloStorage } from '@trello/storage';

import { reloadedToUpdateStorageKey } from './constants';

export const sendReloadedToUpdateEvent = () => {
  const reloadedToUpdateEventData = TrelloStorage.get(
    reloadedToUpdateStorageKey,
  );

  if (reloadedToUpdateEventData) {
    Analytics.sendOperationalEvent({
      action: 'reloaded',
      actionSubject: 'app',
      attributes: {
        reason: 'updateClientVersion',
        ...reloadedToUpdateEventData,
        toClientVersion: clientVersion,
      },
      source: getScreenFromUrl(),
    });

    // Remove the key, so that we don't send an errant event on the next load
    TrelloStorage.unset(reloadedToUpdateStorageKey);
  }
};
