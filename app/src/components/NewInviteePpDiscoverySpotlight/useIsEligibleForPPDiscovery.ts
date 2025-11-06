import { differenceInCalendarDays } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

import {
  SEGMENT_TRELLO_HAS_USED_INBOX_QUICK_CAPTURE_REAL_TIME_AAID,
  TRELLO_TRACK_CARD_ADDED_QUICK_CAPTURE_CHANGED_BATCH,
  TRELLO_UI_BUTTON_CLICKED_CONNECTACCOUNTBUTTON_PLANNERSCREEN_CHANGED,
  TRELLO_UI_FLAG_VIEWED_INVITEEBOARDWELCOMEMESSAGE_BOARDCREATIONSCREEN_FIRST_TIME,
  TRELLO_UI_SECTION_VIEWED_WORKSPACEWELCOMEMESSAGE_WORKSPACEBOARDSHOMESCREEN_FIRST_TIME,
  useUserTrait,
} from '@trello/atlassian-personalization';
import { isAndroid, isIos } from '@trello/browser';
import { useGetExperimentValue } from '@trello/feature-gate-client';

export const useIsEligibleForPPDiscovery = () => {
  // Check if user has used quick capture
  const {
    value: hasUsedQuickCaptureRealtime,
    loading: hasUsedQuickCaptureLoading,
  } = useUserTrait(SEGMENT_TRELLO_HAS_USED_INBOX_QUICK_CAPTURE_REAL_TIME_AAID);
  const {
    value: hasUsedQuickCaptureHistorical,
    loading: hasUsedQuickCaptureHistoricalLoading,
  } = useUserTrait(TRELLO_TRACK_CARD_ADDED_QUICK_CAPTURE_CHANGED_BATCH);
  const hasUsedQuickCapture =
    hasUsedQuickCaptureRealtime || hasUsedQuickCaptureHistorical;

  // Check if user has clicked the planner CTA
  const { value: hasClickedPlannerCta, loading: hasClickedPlannerCtaLoading } =
    useUserTrait(
      TRELLO_UI_BUTTON_CLICKED_CONNECTACCOUNTBUTTON_PLANNERSCREEN_CHANGED,
    );

  const hasUsedQuickCaptureAndClickedPlannerCta =
    hasUsedQuickCapture && hasClickedPlannerCta;

  // Exclude mobile users: !isIos() && !isAndroid()
  const isNotMobile = !isIos() && !isAndroid();

  const {
    value: workspaceWelcomeMessageViewed,
    loading: workspaceWelcomeMessageViewedLoading,
  } = useUserTrait(
    TRELLO_UI_SECTION_VIEWED_WORKSPACEWELCOMEMESSAGE_WORKSPACEBOARDSHOMESCREEN_FIRST_TIME,
  );
  const {
    value: boardWelcomeMessageViewed,
    loading: boardWelcomeMessageViewedLoading,
  } = useUserTrait(
    TRELLO_UI_FLAG_VIEWED_INVITEEBOARDWELCOMEMESSAGE_BOARDCREATIONSCREEN_FIRST_TIME,
  );

  const [isTimeBasedEligible, setIsTimeBasedEligible] = useState(false);

  // check if either the workspace welcome message or the board welcome message has been dismissed
  // and it has been more than 1 day since the dismissal
  useEffect(() => {
    if (
      (workspaceWelcomeMessageViewed &&
        differenceInCalendarDays(
          new Date(),
          new Date(String(workspaceWelcomeMessageViewed)),
        ) >= 1) ||
      (boardWelcomeMessageViewed &&
        differenceInCalendarDays(
          new Date(),
          new Date(String(boardWelcomeMessageViewed)),
        ) >= 1)
    ) {
      setIsTimeBasedEligible(true);
    } else {
      setIsTimeBasedEligible(false);
    }
  }, [workspaceWelcomeMessageViewed, boardWelcomeMessageViewed]);

  const isEligibleForExperiment = useMemo(() => {
    return (
      !hasUsedQuickCaptureAndClickedPlannerCta &&
      isNotMobile &&
      isTimeBasedEligible
    );
  }, [
    hasUsedQuickCaptureAndClickedPlannerCta,
    isNotMobile,
    isTimeBasedEligible,
  ]);

  // Check experiment cohort
  const { cohort: experimentCohort, loading: experimentCohortLoading } =
    useGetExperimentValue({
      experimentName: 'ghost_pp_discovery_for_trello_invitees_d1',
      parameter: 'cohort',
      fireExposureEvent: isEligibleForExperiment,
    });
  const isVariantB =
    !experimentCohortLoading && experimentCohort === 'variant-b';
  const isVariantC =
    !experimentCohortLoading && experimentCohort === 'variant-c';

  // Check if all loading states are complete
  const isLoading =
    hasUsedQuickCaptureLoading ||
    hasUsedQuickCaptureHistoricalLoading ||
    hasClickedPlannerCtaLoading ||
    workspaceWelcomeMessageViewedLoading ||
    boardWelcomeMessageViewedLoading;

  // Main eligibility check
  const isEligibleForCombinedPPDiscovery = useMemo(() => {
    if (isLoading) {
      return false;
    }

    return isVariantB && isEligibleForExperiment;
  }, [isLoading, isVariantB, isEligibleForExperiment]);

  const isEligibleForStaggeredPPDiscovery = useMemo(() => {
    if (isLoading) {
      return false;
    }
    return isVariantC && isEligibleForExperiment;
  }, [isLoading, isVariantC, isEligibleForExperiment]);

  return {
    isEligibleForCombinedPPDiscovery,
    isEligibleForStaggeredPPDiscovery,
  };
};
