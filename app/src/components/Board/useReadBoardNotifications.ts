import { useCallback, useEffect, useMemo } from 'react';

import { isFetchCancellationError } from '@trello/error-handling';
import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { getNetworkError } from '@trello/graphql-error-handling';
import { useSharedStateSelector } from '@trello/shared-state';

import { notificationsState } from 'app/src/components/NotificationsMenu';
import { useReadBoardNotificationsMutation } from './ReadBoardNotificationsMutation.generated';

// Sourced from NotificationSupplement.tsx
const boardAccessRequestNotificationTypes = [
  'requestAccessBoard',
  'requestAccessBoardWithoutOrganization',
  'requestAccessBoardNotInOrganization',
];

export function useReadBoardNotifications({ boardId }: { boardId?: string }) {
  const notificationGroups = useSharedStateSelector(
    notificationsState,
    useCallback((state) => state.notificationGroups, []),
  );
  const [readBoardNotifications] = useReadBoardNotificationsMutation();

  const notificationsToRead = useMemo(
    () =>
      notificationGroups.reduce((acc: string[], notificationGroup) => {
        notificationGroup.notifications.map((notification) => {
          if (
            notification.unread &&
            !notification.data?.card?.id &&
            notification.data?.board?.id === boardId &&
            !boardAccessRequestNotificationTypes.includes(notification.type)
          ) {
            acc.push(notification.id);
          }
        });
        return acc;
      }, []),
    [notificationGroups, boardId],
  );

  const markBoardNotificationsRead = useCallback(async () => {
    try {
      await readBoardNotifications({
        variables: { ids: notificationsToRead },
      });
    } catch (err) {
      if (err instanceof Error && isFetchCancellationError(err)) {
        return;
      }
      const networkError = getNetworkError(err);
      sendNetworkErrorEvent({
        status: networkError?.status || 0,
        response: networkError?.message,
        url: '/1/notifications/all/read',
      });
    }
  }, [notificationsToRead, readBoardNotifications]);

  useEffect(() => {
    if (notificationsToRead?.length) {
      markBoardNotificationsRead();
    }
  }, [boardId, markBoardNotificationsRead, notificationsToRead?.length]);
}
