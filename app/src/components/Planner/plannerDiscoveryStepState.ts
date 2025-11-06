import { SharedState } from '@trello/shared-state';

export interface PlannerDiscoveryStep {
  currentStep: number;
  totalSteps: number;
}

// Shared state that holds the current discovery step and total steps
// for the planner multi-account discovery flow.
export const plannerDiscoveryStepState = new SharedState<PlannerDiscoveryStep>({
  currentStep: 0,
  totalSteps: 1,
});
