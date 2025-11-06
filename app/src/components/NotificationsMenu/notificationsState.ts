import { SharedState } from '@trello/shared-state';

import { getNotificationSeenStateGroupCount } from './notificationSeenState';
import type {
  FormattedNotificationGroups,
  NotificationsCountModel,
} from './NotificationsMenu.types';

export const notificationsState = new SharedState<{
  notificationGroups: FormattedNotificationGroups;
  unreadCount: NotificationsCountModel;
  seenUnreadCount: NotificationsCountModel;
  hideNotificationsMenu: () => void;
}>({
  notificationGroups: [],
  unreadCount: {},
  seenUnreadCount: getNotificationSeenStateGroupCount(),
  hideNotificationsMenu: () => {},
});
