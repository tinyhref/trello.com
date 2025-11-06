import { differenceInCalendarDays } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  NEW_INVITEE_INBOX_BUTTON_SPOTLIGHT_VIEWED,
  NEW_INVITEE_INBOX_PANEL_SPOTLIGHT_VIEWED,
  NEW_INVITEE_PLANNER_BUTTON_SPOTLIGHT_VIEWED,
  NEW_INVITEE_PLANNER_PANEL_SPOTLIGHT_VIEWED,
  useUserTrait,
} from '@trello/atlassian-personalization';
import { Poller } from '@trello/poller';

const POLLING_INTERVAL_MS = 86_400_000; // 24 hours

export const useNewInviteeStaggeredPPDiscoveryTraits = () => {
  // Check if user has viewed the planner button spotlight or panel spotlight
  const { value: datePlannerButtonSpotlightViewed } = useUserTrait(
    NEW_INVITEE_PLANNER_BUTTON_SPOTLIGHT_VIEWED,
  );
  const { value: datePlannerPanelSpotlightViewed } = useUserTrait(
    NEW_INVITEE_PLANNER_PANEL_SPOTLIGHT_VIEWED,
  );
  const hasViewedPlannerSpotlight = useMemo(() => {
    return !!(
      datePlannerButtonSpotlightViewed || datePlannerPanelSpotlightViewed
    );
  }, [datePlannerButtonSpotlightViewed, datePlannerPanelSpotlightViewed]);

  // Check if user has viewed the inbox button spotlight or panel spotlight
  const { value: dateInboxButtonSpotlightViewed } = useUserTrait(
    NEW_INVITEE_INBOX_BUTTON_SPOTLIGHT_VIEWED,
  );
  const { value: dateInboxPanelSpotlightViewed } = useUserTrait(
    NEW_INVITEE_INBOX_PANEL_SPOTLIGHT_VIEWED,
  );

  const hasViewedInboxSpotlight = useMemo(() => {
    return !!(dateInboxButtonSpotlightViewed || dateInboxPanelSpotlightViewed);
  }, [dateInboxButtonSpotlightViewed, dateInboxPanelSpotlightViewed]);

  const [isD2TimeBasedEligible, setIsD2TimeBasedEligible] = useState(false);

  const checkTimeBasedEligibility = useCallback(() => {
    const eligible = !!(
      (datePlannerButtonSpotlightViewed &&
        differenceInCalendarDays(
          new Date(),
          new Date(String(datePlannerButtonSpotlightViewed)),
        ) >= 1) ||
      (datePlannerPanelSpotlightViewed &&
        differenceInCalendarDays(
          new Date(),
          new Date(String(datePlannerPanelSpotlightViewed)),
        ) >= 1) ||
      (dateInboxButtonSpotlightViewed &&
        differenceInCalendarDays(
          new Date(),
          new Date(String(dateInboxButtonSpotlightViewed)),
        ) >= 1) ||
      (dateInboxPanelSpotlightViewed &&
        differenceInCalendarDays(
          new Date(),
          new Date(String(dateInboxPanelSpotlightViewed)),
        ) >= 1)
    );

    setIsD2TimeBasedEligible(eligible);
  }, [
    dateInboxPanelSpotlightViewed,
    datePlannerPanelSpotlightViewed,
    datePlannerButtonSpotlightViewed,
    dateInboxButtonSpotlightViewed,
  ]);

  useEffect(() => {
    // Check the time-based eligibility once now.
    checkTimeBasedEligibility();

    // Set up a poller that will check the time-based eligibility every day.
    const poller = new Poller(
      async () => {
        checkTimeBasedEligibility();
      },
      {
        staging: POLLING_INTERVAL_MS,
        prod: POLLING_INTERVAL_MS,
      },
    );

    poller.start();

    return () => {
      if (poller) {
        poller.stop();
      }
    };
  }, [checkTimeBasedEligibility]);

  return {
    hasViewedPlannerSpotlight,
    hasViewedInboxSpotlight,
    isD2TimeBasedEligible,
  };
};
