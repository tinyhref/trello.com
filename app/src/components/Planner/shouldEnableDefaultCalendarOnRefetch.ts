import { SharedState } from '@trello/shared-state';

/**
 * Used to enable default calendar in planner during planner data refetch.
 * Currently only used when an enterprise member gets a new planner provisioned,
 * and receives a planner update from {@link TrelloMemberUpdatedSubscription}
 */
export const shouldEnableDefaultCalendarOnRefetch = new SharedState<boolean>(
  false,
);
