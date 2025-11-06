import { useCallback } from 'react';

import { useFeatureGate } from '@trello/feature-gate-client';
import { useIsInboxPanelOpen } from '@trello/split-screen';

import {
  addQuickCaptureNotifications,
  type QuickCaptureCard,
} from './quickCaptureNotificationsState';
import { useDismissQuickCaptureNotifications } from './useDismissQuickCaptureNotifications';

export const useQuickCaptureNotificationsAddedToState = () => {
  const { value: isQuickCaptureInboxNotificationsEnabled } = useFeatureGate(
    'ghost_qc_inbox_notifications',
  );

  const inboxOpen = useIsInboxPanelOpen();
  const dismissQuickCaptureNotifications =
    useDismissQuickCaptureNotifications();

  const handleQuickCaptureNotifications = useCallback(
    (notifications: QuickCaptureCard[]) => {
      if (!inboxOpen) {
        addQuickCaptureNotifications(notifications);
      } else {
        dismissQuickCaptureNotifications();
      }
    },
    [dismissQuickCaptureNotifications, inboxOpen],
  );
  if (!isQuickCaptureInboxNotificationsEnabled) {
    return;
  }

  return handleQuickCaptureNotifications;
};
