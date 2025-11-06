import { SharedState } from '@trello/shared-state';

export const inboxActiveCardSharedState = new SharedState<string | null>(null);
