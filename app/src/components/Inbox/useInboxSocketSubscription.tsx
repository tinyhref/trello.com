import { useMemberInboxIds } from '@trello/personal-workspace';

import { useSocketSubscription } from 'app/scripts/init/useSocketSubscription';

/*
 * Set up websocket subscription for the inbox board to receive updates
 */
export const useInboxSocketSubscription = () => {
  const { idBoard: inboxBoardId } = useMemberInboxIds();
  useSocketSubscription('Board', inboxBoardId, !inboxBoardId);
};
