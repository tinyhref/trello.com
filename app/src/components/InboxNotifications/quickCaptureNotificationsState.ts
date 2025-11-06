import { TrelloCardAri } from '@atlassian/ari';
import { SharedState, useSharedStateSelector } from '@trello/shared-state';

export interface QuickCaptureCard {
  card?: {
    id: string;
  } | null;
}

export const quickCaptureNotificationsState = new SharedState<{
  quickCaptureCards: QuickCaptureCard[];
}>({
  quickCaptureCards: [],
});

export const useQuickCaptureNotifications = () => {
  return useSharedStateSelector(
    quickCaptureNotificationsState,
    (state) => state.quickCaptureCards,
  );
};

export const addQuickCaptureNotifications = (
  notifications: QuickCaptureCard[],
) => {
  quickCaptureNotificationsState.setValue({
    quickCaptureCards: [
      ...quickCaptureNotificationsState.value.quickCaptureCards,
      ...notifications
        .filter((notification) => notification.card?.id)
        .map((notification) => ({
          ...notification,
          card: {
            id: TrelloCardAri.parse(notification.card!.id).cardId,
          },
        })),
    ],
  });
};

export const removeQuickCaptureNotifications = (notifications: string[]) => {
  const newNotifications = new Set(notifications);
  quickCaptureNotificationsState.setValue({
    quickCaptureCards:
      quickCaptureNotificationsState.value.quickCaptureCards.filter(
        (card) => card.card?.id && !newNotifications.has(card.card.id),
      ),
  });
};

export const clearQuickCaptureNotifications = () => {
  quickCaptureNotificationsState.setValue({
    quickCaptureCards: [],
  });
};
