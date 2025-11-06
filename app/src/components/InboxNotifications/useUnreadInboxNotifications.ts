import { useFeatureGate } from '@trello/feature-gate-client';

import { useQuickCaptureNotifications } from './quickCaptureNotificationsState';
import { useUnreadDiscoveryCardsInboxNotifications } from './useUnreadDiscoveryCardsInboxNotifications';

export const useUnreadInboxNotifications = () => {
  const unreadDiscoveryCardsInboxNotifications =
    useUnreadDiscoveryCardsInboxNotifications();

  const quickCaptureCards = useQuickCaptureNotifications();
  const { value: isQuickCaptureInboxNotificationsEnabled } = useFeatureGate(
    'ghost_qc_inbox_notifications',
  );

  const quickCaptureCardIds = isQuickCaptureInboxNotificationsEnabled
    ? quickCaptureCards.map((card) => card.card?.id)
    : [];

  // If there are no discovery cards and no quick capture cards, return null
  if (
    !unreadDiscoveryCardsInboxNotifications &&
    quickCaptureCardIds.length === 0
  ) {
    return null;
  }

  return [
    ...(unreadDiscoveryCardsInboxNotifications ?? []),
    ...quickCaptureCardIds,
  ];
};
