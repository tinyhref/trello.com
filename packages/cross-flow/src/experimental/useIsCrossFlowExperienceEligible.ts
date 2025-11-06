import { useMemo } from 'react';

import type { TouchpointSourceType } from '@trello/cross-flow';
import { useFeatureGate } from '@trello/feature-gate-client';

import {
  type CrossFlowExperience,
  isSourceTargetedByExperience,
} from './isSourceTargetedByExperience';

export interface CrossFlowExperienceParams {
  experience: CrossFlowExperience;
  source: TouchpointSourceType;
  eligibilityCheckResults: boolean[];
  deferredEligibilityCheckResults?: boolean[];
}

export const useIsCrossFlowExperienceEligible = ({
  source,
  experience,
  eligibilityCheckResults,
  deferredEligibilityCheckResults = [],
}: CrossFlowExperienceParams) => {
  const isSourceTargeted = isSourceTargetedByExperience(experience, source);

  /**
   * This exists as a short circuit to prevent the experience from being shown
   * in cases of specific exclucion criteria.
   **/

  const { value: isDiscoveryAdExperienceEnabled } = useFeatureGate(
    'trello_xf_discovery_ads_control',
  );

  const isImmediateRuntimeEligibilityChecksPassed = useMemo(
    () =>
      [...eligibilityCheckResults, isSourceTargeted].every(
        (result) => result === true,
      ),
    [eligibilityCheckResults, isSourceTargeted],
  );

  const isDeferredRuntimeEligibilityChecksPassed = useMemo(() => {
    return deferredEligibilityCheckResults.every((result) => result === true);
  }, [deferredEligibilityCheckResults]);

  const isEligible =
    Boolean(isDiscoveryAdExperienceEnabled) &&
    isImmediateRuntimeEligibilityChecksPassed &&
    isDeferredRuntimeEligibilityChecksPassed;

  return {
    experience,
    isImmediateRuntimeEligibilityChecksPassed,
    isEligible,
  };
};
