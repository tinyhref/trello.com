import { useMemo } from 'react';

import { useSharedState } from '@trello/shared-state';

import { plannerDiscoveryStepState } from './plannerDiscoveryStepState';
import { useCanUseMultiAccount } from './useCanUseMultiAccount';
import { useIsEligibleForPlannerFeaturesDiscovery } from './useIsEligibleForPlannerFeaturesDiscovery';

/**
 * Hook that manages the planner feature discovery flow and state.
 *
 * This hook determines which discovery step should be shown to the user based on their
 * eligibility for planner features and multi-account capabilities. It automatically
 * updates the discovery state when conditions change.
 *
 * @remarks
 * The hook handles two main scenarios:
 * - **Multi-account discovery**: When the user is eligible for planner features
 *  discovery AND can use multi-account,
 *   the discovery flow will have 2 steps starting from step 1.
 * - **Single-step discovery**: When the user is not eligible for planner feature discovery (step 1),
 *   the flow transitions to step 1 of 1 (completion state).
 *
 * @returns An object containing:
 * - `discoveryStep`: The current discovery state with `currentStep` and `totalSteps`
 * - `setDiscoveryStep`: Function to manually update the discovery state
 */
export const usePlannerDiscovery = () => {
  const [discoveryStep, setDiscoveryStep] = useSharedState(
    plannerDiscoveryStepState,
  );

  const isEligibleForPlannerFeaturesDiscovery =
    useIsEligibleForPlannerFeaturesDiscovery();
  const canUseMultiAccount = useCanUseMultiAccount();

  const discoveryStepValue = useMemo(() => {
    if (isEligibleForPlannerFeaturesDiscovery && canUseMultiAccount) {
      return {
        currentStep: 1,
        totalSteps: 2,
      };
    } else if (
      !isEligibleForPlannerFeaturesDiscovery &&
      discoveryStep.totalSteps === 1 &&
      discoveryStep.currentStep === 0
    ) {
      return {
        currentStep: 1,
        totalSteps: 1,
      };
    }
    return discoveryStep;
  }, [
    isEligibleForPlannerFeaturesDiscovery,
    canUseMultiAccount,
    discoveryStep,
  ]);

  return { discoveryStep: discoveryStepValue, setDiscoveryStep };
};
