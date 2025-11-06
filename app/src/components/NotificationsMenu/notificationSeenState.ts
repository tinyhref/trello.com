/* eslint-disable @trello/export-matches-filename */
import { getMemberId, isMemberLoggedIn } from '@trello/authentication';
import { TrelloStorage, type StorageKey } from '@trello/storage';

import type { NotificationsCountModel } from './NotificationsMenu.types';

const NOTIFICATION_SEEN_STATE_KEY_PREFIX = 'NotificationsSeenState';

export interface NotificationSeenState {
  lastSeenNotificationGroup: NotificationsCountModel;
}

const initialState: NotificationSeenState = {
  lastSeenNotificationGroup: {},
};

export const getNotificationSeenStateKey = (): StorageKey<'localStorage'> => {
  return `${NOTIFICATION_SEEN_STATE_KEY_PREFIX}-${getMemberId()}`;
};

export const getNotificationSeenStateGroupCount =
  (): NotificationsCountModel => {
    if (!TrelloStorage.isEnabled() || !isMemberLoggedIn()) {
      return initialState.lastSeenNotificationGroup;
    }

    const key = getNotificationSeenStateKey();
    const notificationSeenState = TrelloStorage.get(key);

    if (!notificationSeenState) {
      TrelloStorage.set(key, initialState);

      return initialState.lastSeenNotificationGroup;
    }

    return notificationSeenState.lastSeenNotificationGroup;
  };

// We take the current members NotificationsCountModel and
// store this in localstorage, this is expected to happen
// when the member opens the notification pane so whatever
// the count is at the time of opening the pane is their
// 'seen' notifications, which are then used to compare to
// their actual notification count (from the sever) to see
// if there are any notifications they haven't seen.
export const setNotificationSeenStateGroupCount = (
  value: NotificationsCountModel,
) => {
  if (!TrelloStorage.isEnabled() || !isMemberLoggedIn()) {
    return;
  }

  const key = getNotificationSeenStateKey();
  TrelloStorage.set(key, {
    ...(TrelloStorage.get(key) || initialState),
    lastSeenNotificationGroup: value,
  });
};
