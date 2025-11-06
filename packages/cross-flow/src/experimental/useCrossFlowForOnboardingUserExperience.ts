import { useCallback, useEffect, useMemo, useState } from 'react';

import { useCrossFlow } from '@atlassiansox/cross-flow-support';
import type { TouchpointSourceType } from '@trello/cross-flow';

import { trelloCrossFlowOpen } from '../TrelloCrossFlow';
import { useHasNoAvailableSites } from './runtimeEligibilityChecks/useHasNoAvailableSites';
import { isSourceTargetedByExperience } from './isSourceTargetedByExperience';
import { useIsCrossFlowExperienceEligible } from './useIsCrossFlowExperienceEligible';

const EXPERIENCE_KEY = 'onboardingUserExperience';

interface OnboardingUserExperienceParams {
  source: TouchpointSourceType;
  hasValidAaSession: boolean;
}

export const useCrossFlowForOnboardingUserExperience = ({
  source,
  hasValidAaSession,
}: OnboardingUserExperienceParams) => {
  const crossFlow = useCrossFlow();
  const [
    isImmediateRuntimeEligibilityChecksPassed,
    setIsImmediateRuntimeEligibilityChecksPassed,
  ] = useState(false);

  const { isEligible: hasNoAvailableSites } = useHasNoAvailableSites({
    doLoadAvailableSites: isImmediateRuntimeEligibilityChecksPassed,
  });

  const experience = useIsCrossFlowExperienceEligible({
    source,
    experience: EXPERIENCE_KEY,
    eligibilityCheckResults: [crossFlow.isEnabled, hasValidAaSession],
    deferredEligibilityCheckResults: [hasNoAvailableSites],
  });

  useEffect(() => {
    setIsImmediateRuntimeEligibilityChecksPassed(
      experience.isImmediateRuntimeEligibilityChecksPassed,
    );
  }, [experience.isImmediateRuntimeEligibilityChecksPassed]);

  const isSourceTargeted = isSourceTargetedByExperience(EXPERIENCE_KEY, source);
  const getIsTargeted = useCallback(() => {
    // For experiences not gated by a TAP audience, use source-check as definition of targeted.
    return isSourceTargeted;
  }, [isSourceTargeted]);

  return useMemo(
    () => ({
      experience: experience.experience,
      isEligible: experience.isEligible,
      open: trelloCrossFlowOpen(crossFlow, source, [], hasValidAaSession, {
        isNewTrelloUser: true,
      }),
      getIsTargeted,
    }),
    [
      crossFlow,
      experience.experience,
      experience.isEligible,
      hasValidAaSession,
      source,
      getIsTargeted,
    ],
  );
};
