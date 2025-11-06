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
import { useIsCrossFlowExperienceEligible } from './useIsCrossFlowExperienceEligible';

interface AllUsersExperienceParams {
  source: TouchpointSourceType;
  workspaceId?: string;
  boardId?: string;
  hasValidAaSession: boolean;
  jiraTemplateId?: JiraTemplateIdType;
}

const EXPERIENCE_KEY = 'allUsersExperience';

export const useCrossFlowForAllUsersExperience = ({
  source,
  workspaceId,
  boardId,
  hasValidAaSession,
  jiraTemplateId,
}: AllUsersExperienceParams) => {
  const crossFlow = useCrossFlow();

  // 1. Check that the member is confirmed
  const { isEligible: isMemberConfirmed } = useIsCrossFlowMemberConfirmed();
  // 2. Check that the member has eligible workspaces
  const { isEligible: hasEligibleWorkspaces, eligibleWorkspaceOptions } =
    useHasEligibleWorkspaces({
      workspaceId,
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

  // 5. Check that this hook is rolled out for the user
  const { value: isHookEnabled } = useFeatureGate(
    'ghost_cross_flow_all_users_experience',
  );

  const experience = useIsCrossFlowExperienceEligible({
    experience: EXPERIENCE_KEY,
    source,
    eligibilityCheckResults: [
      crossFlow.isEnabled,
      hasEligibleWorkspaces,
      isMemberConfirmed,
      isWeb,
      isHookEnabled,
    ],
    deferredEligibilityCheckResults: [hasNoAvailableSites],
  });

  useEffect(() => {
    setIsImmediateRuntimeEligibilityChecksPassed(
      experience.isImmediateRuntimeEligibilityChecksPassed,
    );
  }, [experience.isImmediateRuntimeEligibilityChecksPassed]);

  const getIsTargeted = useCallback(() => {
    return (
      source === 'memberBoardsHomeScreen' ||
      source === 'workspaceBoardsHomeScreen'
    );
  }, [source]);

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
