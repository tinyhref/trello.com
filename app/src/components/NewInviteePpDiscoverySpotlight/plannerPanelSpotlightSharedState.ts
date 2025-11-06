import { SharedState, useSharedState } from '@trello/shared-state';

export const plannerPanelSpotlightSharedState = new SharedState<{
  wasPlannerPanelSpotlightDismissed: boolean;
}>({
  wasPlannerPanelSpotlightDismissed: false,
});

export const usePlannerPanelSpotlightSharedState = () => {
  return useSharedState(plannerPanelSpotlightSharedState);
};
