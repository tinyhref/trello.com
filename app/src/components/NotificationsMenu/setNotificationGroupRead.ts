import { client } from '@trello/graphql';

import { setNotificationSeenStateGroupCount } from './notificationSeenState';
import { isFilteringByUnreadNotifications } from './notificationsMenuState';
import { notificationsState } from './notificationsState';
import type {
  ReadNotificationsMutation,
  ReadNotificationsMutationVariables,
} from './ReadNotificationsMutation.generated';
import { ReadNotificationsDocument } from './ReadNotificationsMutation.generated';
import { setNotificationsInGroupsRead } from './setNotificationsInGroupsRead';
import { updateSeenUnreadCount } from './updateSeenUnreadCount';
import { updateUnreadCount } from './updateUnreadCount';

// Takes an id like Card:5c2d1616e23b680add1cf24d and converts it
// to the id form which would be 5c2d1616e23b680add1cf24d removing
// the type prefix of Card
const convertIdGroupToId = (idGroup: string) => idGroup.split(':')[1];

const getNotificationsByGroupId = (idNotificationGroup: string) => {
  const notificationGroup = notificationsState.value.notificationGroups.find(
    (ng) => ng.id === idNotificationGroup,
  );

  return notificationGroup ? notificationGroup.notifications : [];
};

const setNotificationGroupReadRequest = ({
  idGroup,
  read,
  notificationIds,
}: {
  idGroup: string;
  read: boolean;
  notificationIds?: string[];
}) => {
  const id = convertIdGroupToId(idGroup);

  let numNotifications = 0;
  const existingGroup = notificationsState.value.notificationGroups.find(
    (notificationGroup) => notificationGroup.idGroup === idGroup,
  );
  if (existingGroup) {
    for (const notification of existingGroup.notifications) {
      if (
        (!notificationIds || notificationIds.includes(notification.id)) &&
        notification.unread === read
      ) {
        numNotifications++;
      }
    }
  }
  const unreadDelta = read ? -numNotifications : numNotifications;
  const newUnreadCount = updateUnreadCount(
    notificationsState.value.unreadCount,
    idGroup,
    unreadDelta,
  );

  const newSeenUnreadCount = updateSeenUnreadCount(
    notificationsState.value.seenUnreadCount,
    newUnreadCount,
  );

  notificationsState.setValue({
    unreadCount: newUnreadCount,
    seenUnreadCount: newSeenUnreadCount,
    notificationGroups: setNotificationsInGroupsRead(
      notificationsState.value.notificationGroups,
      read,
      id,
      notificationIds,
    ),
  });
};

const setNotificationGroupReadSuccess = ({
  isFilteringByUnread,
  idGroup,
  read,
}: {
  isFilteringByUnread: boolean;
  idGroup: string;
  read: boolean;
}) => {
  const id = convertIdGroupToId(idGroup);

  if (isFilteringByUnread && read) {
    // If we mark a notification group as read and we
    // are filtering, remove the notification group
    notificationsState.setValue({
      ...notificationsState.value,
      notificationGroups: notificationsState.value.notificationGroups.filter(
        (notificationGroup) => notificationGroup.id !== id,
      ),
    });
  }
};

export const setNotificationGroupRead = async ({
  idGroup,
  read,
  notificationIds,
}: {
  idGroup: string;
  read: boolean;
  notificationIds?: string[];
}) => {
  const id = convertIdGroupToId(idGroup);

  setNotificationGroupReadRequest({
    idGroup,
    read,
    notificationIds,
  });

  const ids = notificationIds || getNotificationsByGroupId(id).map((n) => n.id);

  try {
    await client.mutate<
      ReadNotificationsMutation,
      ReadNotificationsMutationVariables
    >({
      mutation: ReadNotificationsDocument,
      variables: {
        ids,
        read,
      },
    });
  } catch (err) {
    setNotificationGroupReadRequest({
      idGroup,
      read: !read,
      notificationIds,
    }); // undo the change
    throw err;
  }
  const isFilteringByUnread = isFilteringByUnreadNotifications();

  setNotificationGroupReadSuccess({
    idGroup,
    read,
    isFilteringByUnread,
  });

  setNotificationSeenStateGroupCount(notificationsState.value.seenUnreadCount);
};
