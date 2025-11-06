import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';

import type { Notification } from '../generated';
import type { NotificationGroupNotificationsFragment } from './NotificationGroupNotificationsFragment.generated';
import { NotificationGroupNotificationsFragmentDoc } from './NotificationGroupNotificationsFragment.generated';

export const syncNotificationToNotificationGroups = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  notification: Notification,
) => {
  const idNotificationGroup = notification?.data?.card
    ? `NotificationGroup:Card:${notification.data.card.id}`
    : `NotificationGroup:Notification:${notification.id}`;

  const data =
    apolloClient.readFragment<NotificationGroupNotificationsFragment>({
      fragment: NotificationGroupNotificationsFragmentDoc,
      id: idNotificationGroup,
    });

  if (!data?.notifications) {
    return;
  }

  const notifications = [notification, ...data.notifications];

  apolloClient.writeFragment<NotificationGroupNotificationsFragment>({
    fragment: NotificationGroupNotificationsFragmentDoc,
    id: idNotificationGroup,
    data: {
      notifications,
      __typename: 'NotificationGroup',
    },
  });
};
