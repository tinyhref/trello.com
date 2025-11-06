import { useMemo } from 'react';

import { dontUpsell } from '@trello/browser';
import { useMemberNodeId } from '@trello/business-logic-react/member';
import { getFreeTrialProperties } from '@trello/business-logic/organization';
import { Entitlements } from '@trello/entitlements';
import type { UpsellCohortType } from '@trello/planner';

import { hasAlreadyUsedTrial } from 'app/src/components/FreeTrial/useStartFreeTrialForOrg';
import {
  useEligibleWorkspacesToUpgradeQuery,
  type EligibleWorkspaceToUpgrade,
} from 'app/src/components/SelectWorkspaceToUpgrade';
import { usePlannerWorkspacePremiumFeaturesFragment } from './PlannerWorkspacePremiumFeaturesFragment.generated';
import { useCanUseMultiAccount } from './useCanUseMultiAccount';

export const UpsellCohort = {
  CohortLoading: 'cohortLoading',
  FreeTrial: 'freeTrial',
  NoUpgradeAvailable: 'noUpgradeAvailable',
  PaidUser: 'paidUser',
  TrialAvailable: 'trialAvailable',
  UpgradeAvailable: 'upgradeAvailable',
  UpgradeAvailableWithoutUpsell: 'upgradeAvailableWithoutUpsell',
} as const;

const eligibilityFilter = (workspace: EligibleWorkspaceToUpgrade) =>
  Entitlements.isFree(workspace.offering);

const isEligibleForTrial = (workspace: EligibleWorkspaceToUpgrade) => {
  return !hasAlreadyUsedTrial(workspace.credits ?? []);
};

/**
 * This function is used to determine if we should place a user in the freeTrial cohort.
 * It returns true if the following conditions are met:
 *   - every workspace is either free or on a free trial
 *   - there is at least one workspace with a free trial
 */

const areAllWorkspacesUnpaidWithAtLeastOneTrial = (
  workspaces: EligibleWorkspaceToUpgrade[],
) => {
  let hasWorkspaceWithTrial = false;
  for (const workspace of workspaces) {
    const freeTrialProperties = getFreeTrialProperties(
      workspace.credits || [],
      workspace.offering,
    );
    const isFreeTrialActive = freeTrialProperties?.isActive;
    if (isFreeTrialActive) {
      hasWorkspaceWithTrial = true;
    }
    if (!Entitlements.isFree(workspace.offering) && !isFreeTrialActive) {
      return false;
    }
  }
  // If we haven't returned early yet, then all workspaces are either free or on a trial.
  // Because of this, simply return whether or not we've seen at least one trial.
  return hasWorkspaceWithTrial;
};

/**
 * Hook to determine the upsell cohort and eligibility for a user in the Planner.
 *
 * This hook evaluates the user's workspace status and eligibility for different upsell paths:
 * - Checks if the user has premium Planner features
 * - Determines trial eligibility for free workspaces
 * - Handles cases where upsells should not be shown
 *
 * @returns {Object} An object containing:
 *   - upsellCohort: The determined cohort with the following possible values:
 *     - `'cohortLoading'`: Data is still loading, cohort determination is pending
 *     - `'freeTrial'`: User has advanced planner features and all workspaces are unpaid with at least one active free trial (requires multi-account M2 feature flag)
 *     - `'noUpgradeAvailable'`: User has no workspaces available to upgrade or no workspaces at all (e.g., joined via board invite)
 *     - `'paidUser'`: User has advanced planner features and is on a paid plan
 *     - `'trialAvailable'`: User doesn't have advanced planner features but has at least one free workspace eligible for a free trial
 *     - `'upgradeAvailable'`: User doesn't have advanced planner features, has free workspaces, but their free trial has expired. We can show upsell prompts to this user in web only (not desktop)
 *     - `'upgradeAvailableWithoutUpsell'`: User doesn't have advanced planner features, has free workspaces, but trial has expired. We cannot show upgrade prompts to this user, only generic messaging
 *
 * @example
 * const { upsellCohort } = useUpsellData();
 * if (upsellCohort === UpsellCohort.TrialAvailable) {
 *   // Show "Try Premium free" CTA to user
 * } else if (upsellCohort === UpsellCohort.UpgradeAvailable) {
 *   // Show "View plans" CTA to user
 * } else if (upsellCohort === UpsellCohort.UpgradeAvailableWithoutUpsell) {
 *   // Hide direct upsell prompts, only show generic messaging
 * }
 */
export const useUpsellData: () => {
  upsellCohort: UpsellCohortType;
  trialStartDate: Date | null;
} = () => {
  const memberNodeId = useMemberNodeId();
  const canUseMultiAccount = useCanUseMultiAccount();

  const { data } = usePlannerWorkspacePremiumFeaturesFragment({
    from: { id: memberNodeId },
    optimistic: true,
  });

  const {
    workspaces,
    allWorkspaces,
    loading: workspacesLoading,
  } = useEligibleWorkspacesToUpgradeQuery({
    filter: eligibilityFilter,
  });

  const upsellCohort: UpsellCohortType = useMemo(() => {
    if (workspacesLoading) {
      return UpsellCohort.CohortLoading;
    }
    if (data?.planner?.workspace) {
      const hasAdvancedPlanner =
        data.planner.workspace.premiumFeatures?.includes('advancedPlanner');

      if (hasAdvancedPlanner) {
        if (
          canUseMultiAccount &&
          areAllWorkspacesUnpaidWithAtLeastOneTrial(allWorkspaces)
        ) {
          return UpsellCohort.FreeTrial;
        } else {
          return UpsellCohort.PaidUser;
        }
      } else {
        if (workspaces.some(isEligibleForTrial)) {
          return UpsellCohort.TrialAvailable;
        } else if (dontUpsell()) {
          // There are some situations where we want to indicate to the user that they don't have the full
          // Planner experience, but we are not allowed to explicitly show them upsells (e.g. desktop).
          return UpsellCohort.UpgradeAvailableWithoutUpsell;
        } else if (!workspaces.length) {
          // If the user joins Trello via a board invite link they won't have any workspaces available
          // that they can upgrade.
          return UpsellCohort.NoUpgradeAvailable;
        } else {
          return UpsellCohort.UpgradeAvailable;
        }
      }
    } else {
      return UpsellCohort.NoUpgradeAvailable;
    }
  }, [
    allWorkspaces,
    data?.planner?.workspace,
    canUseMultiAccount,
    workspaces,
    workspacesLoading,
  ]);

  const trialStartDate = useMemo(() => {
    // Get trial start date from the most recent workspace with an active trial
    const freeTrialData = allWorkspaces
      .map((workspace) =>
        getFreeTrialProperties(workspace.credits || [], workspace.offering),
      )
      .filter((trial) => trial?.isActive)
      .sort((a, b) => {
        // Sort by start date descending (newest first)
        if (!a?.startDate || !b?.startDate) return 0;
        return b.startDate.getTime() - a.startDate.getTime();
      })[0];

    return freeTrialData?.startDate ?? null;
  }, [allWorkspaces]);

  return { upsellCohort, trialStartDate };
};
