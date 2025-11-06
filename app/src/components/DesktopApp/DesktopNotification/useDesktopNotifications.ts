import { useCallback, useEffect, useState } from 'react';

import type { NotificationResponse } from '@trello/realtime-updater';

import type { Deleted } from 'app/scripts/init/live-updater';
import { useSocketUpdate } from 'app/scripts/init/useSocketUpdate';
import { useDesktopNotificationBoardQuery } from 'app/src/components/DesktopApp/DesktopNotification/DesktopNotificationBoardQuery.generated';
import { useDesktopNotificationCardQuery } from 'app/src/components/DesktopApp/DesktopNotification/DesktopNotificationCardQuery.generated';
import { useDesktopNotificationOrganizationQuery } from 'app/src/components/DesktopApp/DesktopNotification/DesktopNotificationOrganizationQuery.generated';
import { setNotificationGroupRead } from 'app/src/components/NotificationsMenu/setNotificationGroupRead';
import { DesktopNotification } from './DesktopNotification';

const getIdGroup = (notification: NotificationResponse) =>
  notification.data?.card
    ? `Card:${notification.data.card.id}`
    : `Notification:${notification.id}`;

export const useDesktopNotifications = () => {
  const [notification, setNotification] = useState<NotificationResponse>();

  useSocketUpdate<'Notification'>({
    modelName: 'Notification',
    onMessage: useCallback(({ delta }) => {
      if (
        (delta as Deleted)?.deleted === true ||
        (delta as NotificationResponse)?.unread === false ||
        !DesktopNotification.isEnabled()
      ) {
        return;
      }

      setNotification(delta as NotificationResponse);
    }, []),
  });

  const { data: card } = useDesktopNotificationCardQuery({
    variables: { idCard: notification?.data?.card?.id || '' },
    skip: !notification?.data?.card?.id,
    waitOn: ['None'],
  });

  const { data: board } = useDesktopNotificationBoardQuery({
    variables: { id: notification?.data?.board?.id || '' },
    skip: !notification?.data?.board?.id,
    waitOn: ['None'],
  });

  const { data: organization } = useDesktopNotificationOrganizationQuery({
    variables: { orgId: notification?.data?.organization?.id || '' },
    skip: !notification?.data?.organization?.id,
    waitOn: ['None'],
  });

  useEffect(() => {
    if (!notification) {
      return;
    }

    new DesktopNotification({
      id: notification.id,
      type: notification.type || '',
      unread: !!notification.unread,
      data: notification.data || {},
      memberCreator: notification.memberCreator,
      display: notification.display,
      markRead: () =>
        setNotificationGroupRead({
          idGroup: getIdGroup(notification),
          read: true,
        }),
      getUrl: () =>
        (card?.card?.url ||
          board?.board?.url ||
          organization?.organization?.url) as string,
    });
  }, [
    notification,
    card?.card?.url,
    board?.board?.url,
    organization?.organization?.url,
  ]);
};
