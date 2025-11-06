import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { useGetExperimentValue } from '@trello/feature-gate-client';

import { useIsNewBoardInvitee } from './useIsNewBoardInvitee';

/**
 * Hook to check if the user is in a treatment cohort for the Trello Board Invitee Onboarding experiment.
 *
 * @returns {boolean} - Whether the user is in a treatment cohort for the Trello Board Invitee Onboarding experiment.
 *
 */
export const useIsEligibleForBoardInviteeOnboarding = () => {
  const { isOneTimeMessageDismissed } = useOneTimeMessagesDismissed();
  const { isEligible: isNewBoardInvitee } = useIsNewBoardInvitee();
  const isDismissed = isOneTimeMessageDismissed('d0-invitee-board-welcome');

  const { cohort, loading } = useGetExperimentValue({
    experimentName: 'ghost_pp_discovery_for_trello_invitees_d0',
    parameter: 'cohort',
    fireExposureEvent: isNewBoardInvitee,
  });

  return (
    !loading && cohort === 'treatment' && isNewBoardInvitee && !isDismissed
  );
};
