import { useCallback, useEffect, useMemo, useState } from 'react';

import { useCrossFlow } from '@atlassiansox/cross-flow-support';
import type { TouchpointSourceType } from '@trello/cross-flow';

import type { JiraTemplateIdType } from '../JiraTemplateId.types';
import { trelloCrossFlowOpen } from '../TrelloCrossFlow';
import { useHasEligibleWorkspaces } from './runtimeEligibilityChecks/useHasEligibleWorkspaces';
import { useHasNoAvailableSites } from './runtimeEligibilityChecks/useHasNoAvailableSites';
import { useIsNewUser } from './runtimeEligibilityChecks/useIsNewUser';
import { isSourceTargetedByExperience } from './isSourceTargetedByExperience';
import { useIsCrossFlowExperienceEligible } from './useIsCrossFlowExperienceEligible';

interface NewUserExperienceParams {
  source: TouchpointSourceType;
  boardId?: string;
  workspaceId?: string;
  hasValidAaSession: boolean;
  jiraTemplateId?: JiraTemplateIdType;
}

const EXPERIENCE_KEY = 'newUserExperience';

export const useCrossFlowForNewUserExperience = ({
  source,
  workspaceId,
  boardId,
  jiraTemplateId,
  hasValidAaSession,
}: NewUserExperienceParams) => {
  const crossFlow = useCrossFlow();
  const { isEligible: isNewUserEligible } = useIsNewUser();
  const [
    isImmediateRuntimeEligibilityChecksPassed,
    setIsImmediateRuntimeEligibilityChecksPassed,
  ] = useState(false);

  const { isEligible: hasNoAvailableSites } = useHasNoAvailableSites({
    doLoadAvailableSites: isImmediateRuntimeEligibilityChecksPassed,
  });

  const { isEligible: hasEligibleWorkspaces, eligibleWorkspaceOptions } =
    useHasEligibleWorkspaces({
      entitlementRequired: 'free',
      workspaceId,
      treatFreeTrialAsFree: true,
    });

  const { isEligible: hasPaidWorkspaces } = useHasEligibleWorkspaces({
    workspaceId,
    entitlementRequired: 'standardOrPremium',
    treatFreeTrialAsFree: true,
  });

  const eligibilityCheckResults = useMemo(() => {
    if (source === 'currentWorkspaceNavigationDrawer') {
      return [
        crossFlow.isEnabled,
        isNewUserEligible,
        hasEligibleWorkspaces,
        !!workspaceId,
      ];
    }
    return [
      crossFlow.isEnabled,
      isNewUserEligible,
      hasEligibleWorkspaces,
      !hasPaidWorkspaces,
    ];
  }, [
    source,
    crossFlow.isEnabled,
    isNewUserEligible,
    hasEligibleWorkspaces,
    workspaceId,
    hasPaidWorkspaces,
  ]);

  const experience = useIsCrossFlowExperienceEligible({
    experience: EXPERIENCE_KEY,
    source,
    eligibilityCheckResults,
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
      open: trelloCrossFlowOpen(
        crossFlow,
        source,
        eligibleWorkspaceOptions,
        hasValidAaSession,
        {
          workspaceId,
          boardId,
          jiraTemplateId,
          isNewTrelloUser: true,
          shouldSkipMarketingPage:
            source === 'currentWorkspaceNavigationDrawer',
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
