import { useEffect, useRef } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { useFeatureGate } from '@trello/feature-gate-client';
import { getScreenFromUrl } from '@trello/marketing-screens';

import {
  addQuickCaptureNotifications,
  clearQuickCaptureNotifications,
} from './quickCaptureNotificationsState';
import { useTrelloNotificationsGetUnreadQuickCaptureQuery } from './TrelloNotificationsGetUnreadQuickCaptureQuery.generated';

const source = getScreenFromUrl();
const taskName = 'view-inboxNotifications/quickCapture';
export const useLoadQuickCaptureNotifications = () => {
  const { value: isQuickCaptureNotificationQueryEnabled } = useFeatureGate(
    'ghost_notification_quick_capture_query',
  );
  const traceIdRef = useRef<string | null>(null);

  const { data, error, loading } =
    useTrelloNotificationsGetUnreadQuickCaptureQuery({
      variables: { offset: 11 },
      skip: !isQuickCaptureNotificationQueryEnabled,
      waitOn: ['MemberHeader', 'CurrentBoardInfo', 'CurrentBoardListsCards'],
      fetchPolicy: 'no-cache',
    });

  useEffect(() => {
    if (loading) {
      if (traceIdRef.current) {
        Analytics.taskAborted({
          taskName,
          traceId: traceIdRef.current,
          source,
        });
      }
      traceIdRef.current = Analytics.startTask({
        taskName,
        source,
      });
    }
  }, [loading]);

  useEffect(() => {
    if (data && traceIdRef.current) {
      Analytics.taskSucceeded({
        taskName,
        traceId: traceIdRef.current,
        source,
      });
      traceIdRef.current = null;
    }
    if (data && data.trello.me?.notifications?.edges) {
      const quickCaptureCards = data.trello.me.notifications.edges
        .map((edge) => edge.node)
        .filter((node): node is NonNullable<typeof node> => !!node?.card?.id);

      if (quickCaptureCards.length > 0) {
        addQuickCaptureNotifications(quickCaptureCards);
      }
    }
    return () => {
      clearQuickCaptureNotifications();
    };
  }, [data]);

  useEffect(() => {
    if (error && traceIdRef.current) {
      Analytics.taskFailed({
        taskName,
        traceId: traceIdRef.current,
        source,
        error,
      });
      traceIdRef.current = null;
    }
  }, [error]);
};
