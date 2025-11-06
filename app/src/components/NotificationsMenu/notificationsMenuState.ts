import { getMemberId } from '@trello/authentication';
import { PersistentSharedState } from '@trello/shared-state';

interface NotificationsMenuState {
  visibilityFilter: 'VISIBILITY_ALL' | 'VISIBILITY_UNREAD';
}

export const getNotificationFilterStateKey =
  (): `notificationFilterState-${string}` => {
    return `notificationFilterState-${getMemberId()}`;
  };

const initialState: NotificationsMenuState = {
  visibilityFilter: 'VISIBILITY_UNREAD',
};

export const notificationsMenuState =
  new PersistentSharedState<NotificationsMenuState>(initialState, {
    storageKey: getNotificationFilterStateKey(),
  });

export const isNotificationFilterVisibilityAll = () =>
  notificationsMenuState.value.visibilityFilter === 'VISIBILITY_ALL';

export const isFilteringByUnreadNotifications = () =>
  !notificationsMenuState.value ||
  notificationsMenuState.value.visibilityFilter === 'VISIBILITY_UNREAD';
