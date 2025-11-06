import { SharedState, useSharedState } from '@trello/shared-state';

export type InboxActiveButton =
  | 'chrome'
  | 'email'
  | 'mobile'
  | 'slack'
  | 'teams'
  | null;

interface InboxActiveButtonSharedState {
  activeButton: InboxActiveButton;
}

export const inboxActiveButtonSharedState =
  new SharedState<InboxActiveButtonSharedState>({
    activeButton: null,
  });

export const useInboxActiveButtonSharedState = () => {
  return useSharedState(inboxActiveButtonSharedState);
};
