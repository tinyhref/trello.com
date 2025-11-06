import type {
  FormattedNotification,
  FormattedNotificationGroup,
} from './NotificationsMenu.types';

export const setNotificationsInGroupRead = (
  notificationGroup: FormattedNotificationGroup,
  read: boolean,
  notificationsIds?: string[],
): FormattedNotificationGroup => ({
  ...notificationGroup,

  notifications: notificationGroup.notifications.map(
    (notification) =>
      (notificationsIds && !notificationsIds.includes(notification.id)
        ? notification
        : {
            ...notification,
            dateRead: read
              ? notification.dateRead || new Date().toISOString()
              : null,
            unread: !read,
          }) as FormattedNotification,
  ),
});
