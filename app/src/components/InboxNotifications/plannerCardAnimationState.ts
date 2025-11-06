import { SharedState } from '@trello/shared-state';

export interface PlannerCardAnimationState {
  showInboxAnimation: boolean;
}

export const plannerCardAnimationState =
  new SharedState<PlannerCardAnimationState>({
    showInboxAnimation: false,
  });

export const triggerInboxAnimation = () => {
  plannerCardAnimationState.setValue({
    showInboxAnimation: true,
  });
};

export const resetInboxAnimation = () => {
  plannerCardAnimationState.setValue({
    showInboxAnimation: false,
  });
};
