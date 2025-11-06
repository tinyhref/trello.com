import { useCallback } from 'react';

import { useMemberId } from '@trello/authentication';
import { useIsMemberOfOrganization } from '@trello/business-logic-react/organization';
import { useFeatureGate } from '@trello/feature-gate-client';
import { useSharedStateSelector } from '@trello/shared-state';
import { workspaceState } from '@trello/workspace-state';

import { useHasReverseTrialExperienceQuery } from './HasReverseTrialExperienceQuery.generated';
import { useFreeTrialEligibilityRules } from './useFreeTrialEligibilityRules';

export const useHasReverseTrialExperience = (): boolean => {
  const { value: reverseTrialsEnabled } = useFeatureGate(
    'trello_reverse_trials',
  );

  const workspaceId =
    useSharedStateSelector(
      workspaceState,
      useCallback((state) => state?.workspaceId, []),
    ) || '';

  const { data } = useHasReverseTrialExperienceQuery({
    variables: { workspaceId },
    skip: !workspaceId,
    waitOn: [],
  });
  const workspace = data?.organization;
  const {
    isExpired: isFreeTrialExpired,
    loading: loadingFreeTrialEligibilityRules,
  } = useFreeTrialEligibilityRules(workspace?.id, { skip: !workspace?.id });
  const memberId = useMemberId();
  const isMemberOfWorkspace = useIsMemberOfOrganization({
    idMember: memberId,
    idOrganization: workspace?.id,
  });

  if (!reverseTrialsEnabled) {
    return false;
  }

  if (!workspace?.id) {
    return false;
  }

  if (!isMemberOfWorkspace) {
    return false;
  }

  // workspace does NOT have a premium trial created via reverse trial
  if (
    !workspace?.credits?.some(
      (credit) => credit.type === 'freeTrial' && credit.via === 'reverse-trial',
    )
  ) {
    return false;
  }

  if (isFreeTrialExpired || loadingFreeTrialEligibilityRules) {
    return false;
  }
  return true;
};
