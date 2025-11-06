import { useCallback, useState } from 'react';

import { useGetExperimentValue } from '@trello/feature-gate-client';
import type { ExperimentVariations } from '@trello/feature-gates';

import type { TouchpointSourceType } from '../TouchpointSourceType';
import { type TrelloCrossFlow } from '../TrelloCrossFlow';
import type { CrossFlowFeatureKeys } from './isSourceTargetedByFeatureKey';
import { isSourceTargetedByFeatureKey } from './isSourceTargetedByFeatureKey';

export interface CrossFlowExperimentParams<T> {
  experimentFeatureKey: T;
  source: TouchpointSourceType;
  eligibilityCheckResults: boolean[];
  deferredEligibilityCheckResults?: boolean[];
}

type CrossFlowExperimentReturnType<T extends CrossFlowFeatureKeys> = Omit<
  TrelloCrossFlow<ExperimentVariations<T, 'cohort'>>,
  'open'
> & {
  isImmediateRuntimeEligibilityChecksPassed: boolean;
  cohort: ExperimentVariations<T, 'cohort'>;
};

export const useTrelloCrossFlowExperiment = <T extends CrossFlowFeatureKeys>({
  experimentFeatureKey,
  source,
  eligibilityCheckResults,
  deferredEligibilityCheckResults = [],
}: CrossFlowExperimentParams<T>): CrossFlowExperimentReturnType<T> => {
  const [fireExposureEvent, setFireExposureEvent] = useState(false);

  const { cohort } = useGetExperimentValue({
    experimentName: experimentFeatureKey,
    parameter: 'cohort',
    fireExposureEvent,
  });

  const isSourceTargeted = isSourceTargetedByFeatureKey({
    featureKey: experimentFeatureKey,
    source,
  });

  const getIsTargeted = useCallback(() => {
    return cohort !== 'not-enrolled';
  }, [cohort]);

  const isImmediateRuntimeEligibilityChecksPassed = [
    ...eligibilityCheckResults,
    isSourceTargeted,
    getIsTargeted(),
  ].every((result) => result === true);

  const isDeferredRuntimeEligibilityChecksPassed =
    deferredEligibilityCheckResults.every((result) => result === true);

  const isEligible =
    isImmediateRuntimeEligibilityChecksPassed &&
    isDeferredRuntimeEligibilityChecksPassed;

  const getExperimentCohort = useCallback(() => {
    if (isEligible) {
      setFireExposureEvent(true);
      return cohort;
    }

    return 'not-enrolled';
  }, [cohort, isEligible]);

  const enrolledCohort = isEligible ? cohort : 'not-enrolled';

  return {
    experimentName: experimentFeatureKey,
    cohort: enrolledCohort,
    isImmediateRuntimeEligibilityChecksPassed,
    isEligible,
    getIsTargeted,
    getExperimentCohort,
  };
};
