import { useCallback } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { useFeatureGate } from '@trello/feature-gate-client';
import { getScreenFromUrl } from '@trello/marketing-screens';

import {
  clearQuickCaptureNotifications,
  useQuickCaptureNotifications,
} from './quickCaptureNotificationsState';
import { useTrelloMarkInboxNotificationsReadMutation } from './TrelloMarkInboxNotificationsReadMutation.generated';

const source = getScreenFromUrl();
const taskName = 'dismiss-inboxNotifications/quickCapture';
export const useDismissQuickCaptureNotifications = () => {
  const quickCaptureNotifications = useQuickCaptureNotifications();
  const [markInboxNotificationsRead] =
    useTrelloMarkInboxNotificationsReadMutation();
  const { value: isQuickCaptureNotificationMutationEnabled } = useFeatureGate(
    'ghost_notification_inbox_read_mutation',
  );

  const dismissQuickCaptureNotifications = useCallback(async () => {
    if (
      !isQuickCaptureNotificationMutationEnabled ||
      quickCaptureNotifications.length < 1
    ) {
      return;
    }
    const traceId = Analytics.startTask({
      taskName,
      source,
    });
    // Optimistically update quickCaptureNotificationsState
    clearQuickCaptureNotifications();

    try {
      await markInboxNotificationsRead();
      Analytics.taskSucceeded({
        taskName,
        traceId,
        source,
      });
    } catch (error) {
      Analytics.taskFailed({
        taskName,
        traceId,
        source,
        error,
      });
    }
  }, [
    quickCaptureNotifications,
    markInboxNotificationsRead,
    isQuickCaptureNotificationMutationEnabled,
  ]);

  return dismissQuickCaptureNotifications;
};
