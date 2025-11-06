import { SharedState } from '@trello/shared-state';

export const visibleCardIdsSharedState = new SharedState<Set<string>>(
  new Set(),
);
