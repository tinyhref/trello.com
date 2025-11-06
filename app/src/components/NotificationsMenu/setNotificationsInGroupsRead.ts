import type { FormattedNotificationGroups } from './NotificationsMenu.types';
import { setNotificationsInGroupRead } from './setNotificationsInGroupRead';

export const setNotificationsInGroupsRead = (
  notificationGroups: FormattedNotificationGroups,
  read: boolean,
  id?: string[] | string,
  notificationsIds?: string[],
): FormattedNotificationGroups =>
  notificationGroups.map((notificationGroup) =>
    id === undefined ||
    (typeof id === 'string' && notificationGroup.id === id) ||
    (Array.isArray(id) && id.includes(notificationGroup.id))
      ? setNotificationsInGroupRead(notificationGroup, read, notificationsIds)
      : notificationGroup,
  );
