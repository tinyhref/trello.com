import { useCallback, useEffect, useMemo, useState } from 'react';

import { useCrossFlow } from '@atlassiansox/cross-flow-support';
import { isDesktop } from '@trello/browser';
import { useFeatureGate } from '@trello/feature-gate-client';

import type { JiraTemplateIdType } from '../JiraTemplateId.types';
import type { TouchpointSourceType } from '../TouchpointSourceType';
import { trelloCrossFlowOpen } from '../TrelloCrossFlow';
import { useHasEligibleWorkspaces } from './runtimeEligibilityChecks/useHasEligibleWorkspaces';
import { useHasNoAvailableSites } from './runtimeEligibilityChecks/useHasNoAvailableSites';
import { useIsCrossFlowMemberConfirmed } from './runtimeEligibilityChecks/useIsCrossFlowMemberConfirmed';
import { useIsNotProductivityUserOrIsEligible } from './runtimeEligibilityChecks/useIsNotProductivityUserOrIsEligible';
import { useSignedUpMoreThan21DaysAgo } from './runtimeEligibilityChecks/useSignedUpMoreThan21DaysAgo';
import { useIsCrossFlowExperienceEligible } from './useIsCrossFlowExperienceEligible';

interface PaidUsersExperienceParams {
  source: TouchpointSourceType;
  workspaceId?: string;
  boardId?: string;
  hasValidAaSession: boolean;
  jiraTemplateId?: JiraTemplateIdType;
}

const EXPERIENCE_KEY = 'paidUsersExperience';

export const useCrossFlowForPaidUsersExperience = ({
  source,
  workspaceId,
  boardId,
  hasValidAaSession,
  jiraTemplateId,
}: PaidUsersExperienceParams) => {
  const crossFlow = useCrossFlow();

  // 1. Check that the member is confirmed
  const { isEligible: isMemberConfirmed } = useIsCrossFlowMemberConfirmed();
  // 2. Check that the member has eligible workspaces
  const { isEligible: hasEligibleWorkspaces, eligibleWorkspaceOptions } =
    useHasEligibleWorkspaces({
      workspaceId,
      entitlementRequired: 'standardOrPremium',
      treatFreeTrialAsFree: true,
    });
  // 3. Check that the user is not on desktop
  const isWeb = !isDesktop();

  const [
    isImmediateRuntimeEligibilityChecksPassed,
    setIsImmediateRuntimeEligibilityChecksPassed,
  ] = useState(false);

  // 4. Check that the member has no available sites
  const { isEligible: hasNoAvailableSites } = useHasNoAvailableSites({
    doLoadAvailableSites: isImmediateRuntimeEligibilityChecksPassed,
  });

  // 5. Check that the user is more than 21 days old
  const { signedUpMoreThan21DaysAgo } = useSignedUpMoreThan21DaysAgo();

  // 6. Is not in personal productivity or passes the "ads for personal productivity" check
  const { isEligible: isPersonalProductivityEligible } =
    useIsNotProductivityUserOrIsEligible(source);

  // 7. Check that *HomeScreen placements are rolled out for the user
  const { value: isHomeScreenPlacementsEnabled } = useFeatureGate(
    'ghost_ungate_template_placement',
  );

  const isHomeScreenPlacement =
    source === 'memberBoardsHomeScreen' ||
    source === 'workspaceBoardsHomeScreen';
  const isIneligibleHomeScreenPlacement =
    isHomeScreenPlacement && !isHomeScreenPlacementsEnabled;

  const experience = useIsCrossFlowExperienceEligible({
    experience: EXPERIENCE_KEY,
    source,
    eligibilityCheckResults: [
      crossFlow.isEnabled,
      signedUpMoreThan21DaysAgo,
      hasEligibleWorkspaces,
      isMemberConfirmed,
      isWeb,
      // This PP check is only applicable for non-home screen placements
      !isHomeScreenPlacement ? isPersonalProductivityEligible : true,
      !isIneligibleHomeScreenPlacement,
    ],
    deferredEligibilityCheckResults: [hasNoAvailableSites],
  });

  useEffect(() => {
    setIsImmediateRuntimeEligibilityChecksPassed(
      experience.isImmediateRuntimeEligibilityChecksPassed,
    );
  }, [experience.isImmediateRuntimeEligibilityChecksPassed]);

  const getIsTargeted = useCallback(() => {
    return signedUpMoreThan21DaysAgo;
  }, [signedUpMoreThan21DaysAgo]);

  return useMemo(
    () => ({
      experience: experience.experience,
      isEligible: experience.isEligible,
      open: trelloCrossFlowOpen(
        crossFlow,
        source,
        eligibleWorkspaceOptions,
        hasValidAaSession,
        {
          workspaceId,
          boardId,
          jiraTemplateId,
        },
      ),
      getIsTargeted,
    }),
    [
      experience.experience,
      experience.isEligible,
      crossFlow,
      source,
      eligibleWorkspaceOptions,
      hasValidAaSession,
      workspaceId,
      boardId,
      jiraTemplateId,
      getIsTargeted,
    ],
  );
};
