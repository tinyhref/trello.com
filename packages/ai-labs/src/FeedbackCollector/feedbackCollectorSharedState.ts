import { SharedState } from '@trello/shared-state';

interface FeedbackCollectorSharedState {
  isOpen: boolean;
  traceId?: string;
}

const defaultFeedbackCollectorSharedState: FeedbackCollectorSharedState = {
  isOpen: true,
  traceId: undefined,
};

export const feedbackCollectorSharedState =
  new SharedState<FeedbackCollectorSharedState>(
    defaultFeedbackCollectorSharedState,
  );
