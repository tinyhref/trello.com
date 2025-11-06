import {
  addDays,
  differenceInCalendarDays,
  differenceInMilliseconds,
  startOfDay,
} from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import {
  TRELLO_OPERATIONAL_PLANNERDISCOVERYSPOTLIGHTELIGIBILITY_EXCLUDED_CHANGED,
  TRELLO_UI_BUTTON_CLICKED_CONNECTACCOUNTBUTTON_PLANNERSCREEN_CHANGED,
  TRELLO_UI_BUTTON_CLICKED_ONBOARDINGLISTSPOTLIGHTDONEBUTTON_ONBOARDINGLISTSPOTLIGHT_FIRST_TIME,
  useUserTrait,
} from '@trello/atlassian-personalization';
import { useMemberId } from '@trello/authentication';
import {
  useCachedMemberEnterpriseData,
  useOneTimeMessagesDismissed,
} from '@trello/business-logic-react/member';
import { Poller } from '@trello/poller';
import { useSplitScreenSharedState } from '@trello/split-screen';

import { useUserCampaignsFragment } from './UserCampaignsFragment.generated';

export const PLANNER_DISCOVERY_SPOTLIGHT_MESSAGE_ID =
  'planner-discovery-spotlight';

const POLLING_INTERVAL_MS = 86_400_000; // 24 hours

export const useIsEligibleForPlannerDiscoverySpotlight = () => {
  const memberId = useMemberId();
  const { inRealEnterprise } = useCachedMemberEnterpriseData(memberId);

  const { isOneTimeMessageDismissed } = useOneTimeMessagesDismissed();
  const { panels } = useSplitScreenSharedState();

  const { data: memberData } = useUserCampaignsFragment({
    from: { id: memberId },
  });
  const campaigns = memberData?.campaigns ?? [];
  const newUserOnboardingCampaign = campaigns?.find(
    (c: { name: string }) => c.name === 'splitscreen',
  );
  const isDirectSignup = !!newUserOnboardingCampaign?.dateDismissed;

  const { value: didClickPlannerCta } = useUserTrait(
    TRELLO_UI_BUTTON_CLICKED_CONNECTACCOUNTBUTTON_PLANNERSCREEN_CHANGED,
  );

  const { value: hasBeenExcludedFromPlannerDiscoverySpotlight } = useUserTrait(
    TRELLO_OPERATIONAL_PLANNERDISCOVERYSPOTLIGHTELIGIBILITY_EXCLUDED_CHANGED,
  );

  const { value: timeOnboardingSpotlightDoneButtonClicked } = useUserTrait(
    TRELLO_UI_BUTTON_CLICKED_ONBOARDINGLISTSPOTLIGHTDONEBUTTON_ONBOARDINGLISTSPOTLIGHT_FIRST_TIME,
  );

  const [isTimeBasedEligible, setIsTimeBasedEligible] = useState(false);
  const [isExcludedDueToPlannerOpen, setIsExcludedDueToPlannerOpen] =
    useState(false);

  /**
   * Eligibility Criteria:
   * - User is not in a real enterprise
   * - User has not already seen the spotlight (one time message dismissed)
   * - Did not click the planner CTA
   * - Has completed the onboarding spotlight
   * - Signed up as a direct signup
   */
  const satisfiesEligibilityCriteria = useMemo(
    () =>
      !inRealEnterprise &&
      !isOneTimeMessageDismissed(PLANNER_DISCOVERY_SPOTLIGHT_MESSAGE_ID) &&
      !didClickPlannerCta &&
      isDirectSignup,
    [
      inRealEnterprise,
      isOneTimeMessageDismissed,
      didClickPlannerCta,
      isDirectSignup,
    ],
  );

  /**
   * Eligibility Criteria:
   * - It has been >1 calendar day since the onboarding spotlight done button was clicked
   */
  const checkTimeBasedEligibility = useCallback(() => {
    if (
      timeOnboardingSpotlightDoneButtonClicked &&
      differenceInCalendarDays(
        new Date(),
        new Date(String(timeOnboardingSpotlightDoneButtonClicked)),
      ) >= 1
    ) {
      setIsTimeBasedEligible(true);
    } else {
      setIsTimeBasedEligible(false);
    }
  }, [timeOnboardingSpotlightDoneButtonClicked]);

  /**
   * Eligibility Criteria:
   * - Does not have planner open
   */
  useEffect(() => {
    if (hasBeenExcludedFromPlannerDiscoverySpotlight) {
      setIsExcludedDueToPlannerOpen(true);
    } else if (satisfiesEligibilityCriteria && isTimeBasedEligible) {
      // If the planner being open is the ONLY unsatisfied criterium, then we send an event to track that.
      if (panels.planner) {
        Analytics.sendOperationalEvent({
          action: 'excluded',
          actionSubject: 'plannerDiscoverySpotlightEligibility',
          source: 'boardScreen',
        });
        setIsExcludedDueToPlannerOpen(true);
      }
    }
  }, [
    isTimeBasedEligible,
    panels.planner,
    satisfiesEligibilityCriteria,
    hasBeenExcludedFromPlannerDiscoverySpotlight,
  ]);

  useEffect(() => {
    // check the time-based eligibility once now.
    checkTimeBasedEligibility();

    // When all other conditions are met, instantiate a poller that will check the time-based eligibility every day.
    const poller = new Poller(
      async () => {
        checkTimeBasedEligibility();
      },
      {
        staging: POLLING_INTERVAL_MS,
        prod: POLLING_INTERVAL_MS,
      },
    );

    const dailyCheckDelay = differenceInMilliseconds(
      startOfDay(addDays(new Date(), 1)),
      new Date(),
    );

    // Ensure the poller waits til the start of the next day to start.
    const timeout = setTimeout(() => {
      poller.start();
    }, dailyCheckDelay);

    return () => {
      if (poller) {
        poller.stop();
      }
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [checkTimeBasedEligibility]);

  const isEligible =
    satisfiesEligibilityCriteria &&
    isTimeBasedEligible &&
    !isExcludedDueToPlannerOpen;

  /**
   * This is to prevent users who are eligible for this experiment
   * regardless of whether they have dismissed the spotlight or not
   * and regardless of control or treatment from seeing other spotlights
   */
  const isEligibleForExperiment = useMemo(() => {
    return (
      !inRealEnterprise &&
      !didClickPlannerCta &&
      isDirectSignup &&
      !isExcludedDueToPlannerOpen
    );
  }, [
    inRealEnterprise,
    didClickPlannerCta,
    isDirectSignup,
    isExcludedDueToPlannerOpen,
  ]);

  return {
    isEligible,
    isEligibleForExperiment,
  };
};
