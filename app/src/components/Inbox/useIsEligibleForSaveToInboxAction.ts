import { useEffect, useState } from 'react';

import { useGetExperimentValue } from '@trello/feature-gate-client';

import { useIsEligibleForPlannerDiscoverySpotlight } from 'app/src/components/PlannerDiscoverySpotlight/useIsEligibleForPlannerDiscoverySpotlight';

/**
 * This hook is used to check if the user is eligible for display of "Add to Inbox" button.
 */
export const useIsEligibleForSaveToInboxAction = () => {
  const [fireExposureEvent, setFireExposureEvent] = useState(false);
  const { cohort: addToInboxCohort, loading: addToInboxCohortLoading } =
    useGetExperimentValue({
      experimentName: 'ghost_add_to_inbox',
      parameter: 'cohort',
      fireExposureEvent,
    });

  const { isEligibleForExperiment: isEligibleForPlannerDiscoverySpotlight } =
    useIsEligibleForPlannerDiscoverySpotlight();

  const isIncludedCohort = ['treatment-a', 'treatment-b'].includes(
    addToInboxCohort,
  );

  useEffect(() => {
    if (
      isEligibleForPlannerDiscoverySpotlight &&
      !fireExposureEvent &&
      addToInboxCohort !== 'not-enrolled'
    ) {
      setFireExposureEvent(true);
    }
  }, [
    addToInboxCohort,
    addToInboxCohortLoading,
    isEligibleForPlannerDiscoverySpotlight,
    fireExposureEvent,
  ]);

  return isEligibleForPlannerDiscoverySpotlight && isIncludedCohort;
};
