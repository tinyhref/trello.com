import { isBefore } from 'date-fns';
import { useCallback, useMemo } from 'react';

import { isDesktop } from '@trello/browser';
import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { useGetExperimentValue } from '@trello/feature-gate-client';
import { useSharedStateSelector } from '@trello/shared-state';
import { workspaceState } from '@trello/workspace-state';

import { useFreeTrialEligibilityRules } from 'app/src/components/FreeTrial';

const ELIGIBLE_TRIAL_START_DATE = new Date('2025-08-04');

export const useHasEndOfTrialFriction = () => {
  /* -- STATE -- */
  const { isOneTimeMessageDismissed } = useOneTimeMessagesDismissed();
  /* -- HOOKS -- */
  const workspaceId =
    useSharedStateSelector(
      workspaceState,
      useCallback((state) => state?.workspaceId, []),
    ) || '';

  const FREE_TRIAL_BANNER_DISMISS_MESSAGE = `free-trial-banner-${workspaceId}`;

  // Temporarily set a cutoff date for trial ended friction as part of experiment flag cleanup
  const TRIAL_ENDED_CUTOFF_DATE = useMemo(() => new Date('2025-01-13'), []);

  const {
    endDate,
    isAdmin,
    isStandard,
    isPremium,
    isTrialExtended,
    isEnterpriseWorkspace,
    startDate,
  } = useFreeTrialEligibilityRules(workspaceId, {
    skip: !workspaceId.length,
  });

  /* -- MEMOIZED STATE -- */

  const freeTrialBannerDismissed = isOneTimeMessageDismissed(
    FREE_TRIAL_BANNER_DISMISS_MESSAGE,
  );

  const hasEndedTrial = useMemo(() => {
    // do not show experience if the workspace is currently on a paid entitlement
    if (isStandard || isPremium) {
      return false;
    }
    // It handles the rare case in the email verification flow where, when we start the reverse-trial, `isPremium` is false.
    // we need to manually check if the end date is not in the past
    if (!endDate || !startDate) {
      return false;
    }

    // do not show experience if the trial started before 2025-08-04
    // This is to exclude users who started their trial before the monetization
    // refresh was completed for PP
    if (isBefore(startDate, ELIGIBLE_TRIAL_START_DATE)) {
      return false;
    }

    if (isBefore(new Date(Date.now()), endDate)) {
      return false;
    }

    // make sure we don't show the experience to all workspaces that have ended their trial.
    if (isBefore(endDate, TRIAL_ENDED_CUTOFF_DATE)) {
      return false;
    }

    // if the user has already extended their trial, they should not be eligible
    if (isTrialExtended) {
      return false;
    }
    // no desktop app
    if (isDesktop()) {
      return false;
    }
    // exclude users who have dismissed the free trial banner from being enrolled in the experiment
    if (freeTrialBannerDismissed) {
      return false;
    }
    // must be an admin
    if (!isAdmin) {
      return false;
    }
    // When workspace is in reverse trial being added into enterprise, the premium trial will be canceled
    // and we should not display end of trial friction model for that workspace.
    if (isEnterpriseWorkspace) {
      return false;
    }

    return true;
  }, [
    TRIAL_ENDED_CUTOFF_DATE,
    endDate,
    freeTrialBannerDismissed,
    isAdmin,
    isEnterpriseWorkspace,
    isPremium,
    isStandard,
    isTrialExtended,
    startDate,
  ]);

  const { cohort } = useGetExperimentValue({
    experimentName: 'ghost_eotf_with_pp',
    parameter: 'cohort',
    fireExposureEvent: hasEndedTrial,
  });

  const hasEndOfTrialFriction = hasEndedTrial && cohort === 'treatment';

  return hasEndOfTrialFriction;
};
