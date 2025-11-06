import { useGetExperimentValue } from '@trello/feature-gate-client';

/**
 * Hook to determine if the user is in the Add to Inbox experiment cohort.
 *
 * This hook checks if the user is enrolled in the 'ghost_add_to_inbox' experiment
 * and specifically in one of the treatment cohorts ('treatment-a' or 'treatment-b').
 * Users in the control cohort or not enrolled are not considered part of the experiment.
 *
 * @returns An object containing:
 * - `isInAddToInboxExperimentCohort`: Boolean indicating if the user is in a treatment cohort and not loading
 * - `addToInboxCohort`: The actual cohort value from the experiment ('treatment-a', 'treatment-b', 'control', 'not-enrolled', etc.)
 *
 * @example
 * ```tsx
 * const { isInAddToInboxExperimentCohort, addToInboxCohort } = useIsInAddToInboxExperimentCohort();
 *
 * if (isInAddToInboxExperimentCohort) {
 *   // Show Add to Inbox functionality
 *   console.log(`User is in cohort: ${addToInboxCohort}`);
 * }
 * ```
 *
 * @since 1.0.0
 */
export const useIsInAddToInboxExperimentCohort = () => {
  const { cohort: addToInboxCohort, loading: addToInboxCohortLoading } =
    useGetExperimentValue({
      experimentName: 'ghost_add_to_inbox',
      parameter: 'cohort',
      fireExposureEvent: false,
    });

  const isIncludedCohort = ['treatment-a', 'treatment-b'].includes(
    addToInboxCohort,
  );

  return {
    isInAddToInboxExperimentCohort:
      !addToInboxCohortLoading && isIncludedCohort,
    addToInboxCohort,
  };
};
