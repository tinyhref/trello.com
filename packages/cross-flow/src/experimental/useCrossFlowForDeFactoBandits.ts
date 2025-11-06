import { useEffect, useMemo, useState } from 'react';

import { useCrossFlow } from '@atlassiansox/cross-flow-support';
import { isDesktop } from '@trello/browser';
import type { TouchpointSourceType } from '@trello/cross-flow';
import type { ExperimentVariations } from '@trello/feature-gates';

import { trelloCrossFlowOpen, type TrelloCrossFlow } from '../TrelloCrossFlow';
import { useHasEligibleWorkspaces } from './runtimeEligibilityChecks/useHasEligibleWorkspaces';
import { useHasNoAvailableSites } from './runtimeEligibilityChecks/useHasNoAvailableSites';
import { useHasNoPaidWorkspaces } from './runtimeEligibilityChecks/useHasNoPaidWorkspaces';
import { useIsNotProductivityUserOrIsEligible } from './runtimeEligibilityChecks/useIsNotProductivityUserOrIsEligible';
import { useSignedUpMoreThan21DaysAgo } from './runtimeEligibilityChecks/useSignedUpMoreThan21DaysAgo';
import { useTrelloCrossFlowExperiment } from './useTrelloCrossFlowExperiment';

const experimentFeatureKey =
  'xf_de_facto_bandits_grs_trello_feature_integration';

export type CrossFlowForDefactoBanditsExperimentVariations =
  ExperimentVariations<typeof experimentFeatureKey, 'cohort'>;

export interface CrossFlowForDeFactoBanditsParams {
  source: TouchpointSourceType;
  workspaceId?: string;
  boardId?: string;
  hasValidAaSession: boolean;
}

/**
 * Eligibility criteria:
 * 0. Cross-flow enabled
 * 1. Signed up more than 21 days ago
 * 2. Web MAU
 * 3. No paid workspace
 * 4. No other Atlassian products
 * 5. Member job function is not engineering, marketing or operations
 * 6. Not > 10 users in a workspace (captured in targeting gate)
 * 7. Has not seen any other ads except New User Onboarding or New User Nudge ads (captured in targeting gate)
 */
export const useCrossFlowForDeFactoBandits = ({
  source,
  workspaceId,
  hasValidAaSession,
}: CrossFlowForDeFactoBanditsParams): TrelloCrossFlow<CrossFlowForDefactoBanditsExperimentVariations> => {
  // 0. Cross-flow is enabled
  const crossFlow = useCrossFlow();

  // 1. Check that the user is an existing user (i.e. they signed up more than 21 days ago)
  const { signedUpMoreThan21DaysAgo } = useSignedUpMoreThan21DaysAgo();

  // 2. Check that the user is not on desktop
  const isWeb = !isDesktop();

  // 3. No paid workspace (standard, premium or enterprise)
  const { hasNoPaidWorkspaces } = useHasNoPaidWorkspaces();

  // 4a. Has no linked Jira site
  const {
    isEligible: hasNoLinkedJiraSite,
    eligibleWorkspaceOptions: freeWorkspaceOptions,
  } = useHasEligibleWorkspaces({
    workspaceId,
    entitlementRequired: 'free',
  });

  const [
    isImmediateRuntimeEligibilityChecksPassed,
    setIsImmediateRuntimeEligibilityChecksPassed,
  ] = useState(false);

  // 4b. No other Atlassian products
  const { isEligible: hasNoAvailableSites } = useHasNoAvailableSites({
    doLoadAvailableSites: isImmediateRuntimeEligibilityChecksPassed,
  });

  // 5. Is not in personal productivity or passes the "ads for personal productivity" check
  const { isEligible: isPersonalProductivityEligible } =
    useIsNotProductivityUserOrIsEligible(source);

  const experiment = useTrelloCrossFlowExperiment({
    experimentFeatureKey,
    source,
    eligibilityCheckResults: [
      crossFlow.isEnabled,
      isWeb,
      signedUpMoreThan21DaysAgo,
      hasNoLinkedJiraSite,
      hasNoPaidWorkspaces,
      isPersonalProductivityEligible,
    ],
    deferredEligibilityCheckResults: [hasNoAvailableSites],
  });

  useEffect(() => {
    setIsImmediateRuntimeEligibilityChecksPassed(
      experiment.isImmediateRuntimeEligibilityChecksPassed,
    );
  }, [experiment.isImmediateRuntimeEligibilityChecksPassed]);

  return useMemo(
    () => ({
      ...experiment,
      open: trelloCrossFlowOpen(
        crossFlow,
        source,
        freeWorkspaceOptions,
        hasValidAaSession,
        {
          workspaceId,
        },
      ),
    }),
    [
      experiment,
      crossFlow,
      source,
      freeWorkspaceOptions,
      workspaceId,
      hasValidAaSession,
    ],
  );
};
