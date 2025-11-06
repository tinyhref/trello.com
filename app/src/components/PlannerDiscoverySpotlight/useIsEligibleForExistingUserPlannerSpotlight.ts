import { differenceInCalendarDays } from 'date-fns';
import { useMemo } from 'react';

import { useMemberId } from '@trello/authentication';
import {
  useMemberNodeId,
  useOneTimeMessagesDismissed,
} from '@trello/business-logic-react/member';
import { useFeatureGate } from '@trello/feature-gate-client';
import { useSplitScreenSharedState } from '@trello/split-screen';

import { usePlannerWorkspacePremiumFeaturesFragment } from 'app/src/components/Planner/PlannerWorkspacePremiumFeaturesFragment.generated';
import { useUpsellData } from 'app/src/components/Planner/useUpsellData';
import { PLANNER_DISCOVERY_SPOTLIGHT_MESSAGE_ID } from './useIsEligibleForPlannerDiscoverySpotlight';
import { useUserCampaignsFragment } from './UserCampaignsFragment.generated';

const MAX_TRIAL_DAYS_FOR_SPOTLIGHT = 8;

/**
 * Determines eligibility for the planner discovery spotlight for existing trial users.
 *
 * This is separate from the new user spotlight (useIsEligibleForPlannerDiscoverySpotlight)
 * and targets existing users who start a trial.
 *
 * IMPORTANT: This is a PRE-ALLOCATION discovery spotlight that shows to ALL trial users
 * (both control and treatment) to prompt them to open planner. It uses generic messaging.
 *
 * Flow:
 * 1. User sees this generic spotlight → clicks "Open" → planner opens
 * 2. Allocation happens in Planner.tsx (50/50 control vs treatment)
 * 3. Treatment users then see enhanced experience (copy + multi-account spotlight)
 * 4. Control users see standard experience
 *
 * Eligibility Criteria:
 * - Feature gate 'ghost_planner_existing_user_discovery' is enabled
 * - User has Planner workspace access (planner.workspace exists)
 * - User is NOT currently in new user onboarding (checks if campaign dismissed in this trial)
 * - User is in an active free trial (ANY workspace has active trial)
 * - Trial started less than 8 days ago
 * - Planner is not already open
 * - User has not dismissed this specific spotlight
 *
 * Implementation details:
 * - Reuses trialStartDate from useUpsellData (avoids duplicate workspace iteration)
 * - Checks Planner workspace access via PlannerWorkspacePremiumFeaturesFragment (ensures user can actually use Planner)
 * - Checks idMemberReferrer to exclude invited users (avoids conflict with invitee experiments)
 * - Invited users are explicitly excluded from this spotlight
 *
 * Note: Users who completed new user onboarding in a PREVIOUS trial will still be eligible
 * (e.g. user who signed up weeks ago, trial ended, then started a new trial on a new workspace).
 */
export const useIsEligibleForExistingUserPlannerSpotlight = () => {
  const { value: isExistingUserSpotlightEnabled } = useFeatureGate(
    'ghost_planner_existing_user_discovery',
  );

  const memberId = useMemberId();
  const memberNodeId = useMemberNodeId();
  const { isOneTimeMessageDismissed } = useOneTimeMessagesDismissed();
  const { panels } = useSplitScreenSharedState();

  // Get trial data from useUpsellData (reuses existing workspace iteration)
  // Note: We only use trialStartDate, not upsellCohort (not needed for this spotlight)
  const { trialStartDate } = useUpsellData();

  // Get the current Planner workspace data to check if user has Planner access
  const { data: plannerWorkspaceData } =
    usePlannerWorkspacePremiumFeaturesFragment({
      from: { id: memberNodeId },
      optimistic: true,
    });

  // Check if user has Planner workspace access (must have Planner enabled to use it)
  const hasPlannerWorkspaceAccess = Boolean(
    plannerWorkspaceData?.planner?.workspace,
  );

  // Check if user has an active trial (trialStartDate exists if any workspace has active trial)
  const isTrialActive = trialStartDate !== null;

  // Check if user is going through new user onboarding in this trial
  const { data: memberData } = useUserCampaignsFragment({
    from: { id: memberId },
  });
  const campaigns = memberData?.campaigns ?? [];
  const newUserOnboardingCampaign = campaigns.find(
    (c) => c?.name === 'splitscreen' || c?.name === 'moonshot',
  );
  const isInvitedUser = memberData?.idMemberReferrer !== null;

  // Calculate days since trial start
  const daysSinceTrialStart = useMemo(() => {
    return trialStartDate
      ? differenceInCalendarDays(new Date(), trialStartDate)
      : null;
  }, [trialStartDate]);

  // Check if campaign was dismissed during this trial
  // Returns true if user is currently going through new user onboarding OR is an invited user
  const isCurrentlyNewUserOrInvitee = useMemo(() => {
    if (!trialStartDate) {
      return true;
    }

    // Exclude invited users to avoid conflicts with invitee experiments
    if (isInvitedUser) {
      return true; // Exclude from existing user spotlight
    }

    // No campaign = existing user
    if (!newUserOnboardingCampaign) {
      return false; // Treat as existing user (eligible)
    }

    // Has campaign but not dismissed = currently in new user onboarding
    if (!newUserOnboardingCampaign.dateDismissed) {
      return true;
    }

    // Has campaign and dismissed - check if dismissed during THIS trial
    const campaignDismissedDate = new Date(
      newUserOnboardingCampaign.dateDismissed,
    );
    const daysBetween = differenceInCalendarDays(
      campaignDismissedDate,
      trialStartDate,
    );
    return daysBetween >= 0 && daysBetween <= 1;
  }, [isInvitedUser, newUserOnboardingCampaign, trialStartDate]);

  const isEligible = useMemo(() => {
    if (!isExistingUserSpotlightEnabled) {
      return false;
    }

    return (
      hasPlannerWorkspaceAccess && // User must have Planner workspace access
      !isCurrentlyNewUserOrInvitee && // Exclude new users in onboarding AND invited users
      isTrialActive &&
      daysSinceTrialStart !== null &&
      daysSinceTrialStart < MAX_TRIAL_DAYS_FOR_SPOTLIGHT &&
      !panels.planner && // Planner not already open
      !isOneTimeMessageDismissed(PLANNER_DISCOVERY_SPOTLIGHT_MESSAGE_ID)
    );
  }, [
    isExistingUserSpotlightEnabled,
    hasPlannerWorkspaceAccess,
    isCurrentlyNewUserOrInvitee,
    isTrialActive,
    daysSinceTrialStart,
    panels.planner,
    isOneTimeMessageDismissed,
  ]);

  return {
    isEligible,
  };
};
