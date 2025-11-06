import { useFeatureGate } from '@trello/feature-gate-client';

import { useIsInboxBoard } from './useMemberInboxIds';

/**
 * Determines whether or not labels are available for the current context.
 * This hook is expected to be called within a board context (not necessarily on an individual card).
 * @returns True if labels are available on this board; false otherwise.
 */
export const useAreLabelsAvailable = (): boolean => {
  const { value: inboxLabelsEnabled } = useFeatureGate('phx_inbox_labels');
  const isInbox = useIsInboxBoard();

  // The feature gate overrides the normal behavior of hiding the label UI on inbox cards
  if (inboxLabelsEnabled) {
    return true;
  }

  return !isInbox;
};
