import { SharedState } from '@trello/shared-state';

interface SpotlightTour {
  step: number | null;
  activeTarget: string | null;
}

export const personalProductivityOnboardingStepSharedState =
  new SharedState<SpotlightTour>({
    step: null,
    activeTarget: null,
  });
