import type { NotificationsCountModel } from './NotificationsMenu.types';

export const updateSeenUnreadCount = (
  seenUnreadCount: NotificationsCountModel,
  unreadCount: NotificationsCountModel,
): NotificationsCountModel => {
  return Object.keys(seenUnreadCount).reduce<NotificationsCountModel>(
    (newSeenUnreadCount, key) => {
      if (unreadCount[key]) {
        return {
          [key]: seenUnreadCount[key],
          ...newSeenUnreadCount,
        };
      }
      return newSeenUnreadCount;
    },
    {},
  );
};
