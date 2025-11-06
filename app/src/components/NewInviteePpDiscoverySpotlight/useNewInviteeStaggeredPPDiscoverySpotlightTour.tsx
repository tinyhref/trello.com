import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import {
  SEGMENT_TRELLO_HAS_USED_INBOX_QUICK_CAPTURE_REAL_TIME_AAID,
  TRELLO_TRACK_CARD_ADDED_QUICK_CAPTURE_CHANGED_BATCH,
  TRELLO_UI_BUTTON_CLICKED_CONNECTACCOUNTBUTTON_PLANNERSCREEN_CHANGED,
  useUserTrait,
} from '@trello/atlassian-personalization';
import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { intl } from '@trello/i18n';
import { Spotlight } from '@trello/nachos/experimental-onboarding';
import {
  useIsInboxPanelOpen,
  useIsPlannerPanelOpen,
  useSplitScreenSharedState,
} from '@trello/split-screen';
import { token } from '@trello/theme';

import { useInboxActiveButtonSharedState } from 'app/src/components/QuickCaptureDiscovery/useInboxActiveButtonSharedState';
import InboxImage from './Inbox.gif';
import {
  BUTTON_SPOTLIGHT_RADIUS,
  INBOX_BUTTON_SPOTLIGHT,
  INBOX_PANEL_SPOTLIGHT,
  NEW_INVITEE_STAGGERED_D1_PP_DISCOVERY_SPOTLIGHT_TOUR_MESSAGE_ID,
  NEW_INVITEE_STAGGERED_D2_PP_DISCOVERY_SPOTLIGHT_TOUR_MESSAGE_ID,
  PANEL_SPOTLIGHT_RADIUS,
  PLANNER_BUTTON_SPOTLIGHT,
  PLANNER_PANEL_SPOTLIGHT,
  SPOTLIGHT_WIDTH,
} from './NewInviteePpDiscoverySpotlight.constants';
import PlannerImage from './Planner.gif';
import { usePlannerPanelSpotlightSharedState } from './plannerPanelSpotlightSharedState';
import { useIsEligibleForPPDiscovery } from './useIsEligibleForPPDiscovery';
import { useNewInviteeStaggeredPPDiscoveryTraits } from './useNewInviteeStaggeredPPDiscoveryTraits';
import { usePreloadGifs } from './usePreloadGifs';

export const useNewInviteeStaggeredPPDiscoverySpotlightTour = () => {
  const { isEligibleForStaggeredPPDiscovery } = useIsEligibleForPPDiscovery();
  const { toggleInbox, togglePlanner } = useSplitScreenSharedState();
  const { isOneTimeMessageDismissed, dismissOneTimeMessage } =
    useOneTimeMessagesDismissed();
  const [, setInboxActiveButton] = useInboxActiveButtonSharedState();
  const {
    hasViewedInboxSpotlight,
    hasViewedPlannerSpotlight,
    isD2TimeBasedEligible,
  } = useNewInviteeStaggeredPPDiscoveryTraits();
  const [activeSpotlight, setActiveSpotlight] = useState<string | null>(null);
  const [, setWasPlannerPanelSpotlightDismissed] =
    usePlannerPanelSpotlightSharedState();

  const spotlightBGColor = token('color.background.input', '#FFFFFF');
  const inboxOpen = useIsInboxPanelOpen();
  const plannerOpen = useIsPlannerPanelOpen();

  usePreloadGifs();

  // Check if user has used quick capture
  const { value: hasUsedQuickCaptureRealtime } = useUserTrait(
    SEGMENT_TRELLO_HAS_USED_INBOX_QUICK_CAPTURE_REAL_TIME_AAID,
  );
  const { value: hasUsedQuickCaptureHistorical } = useUserTrait(
    TRELLO_TRACK_CARD_ADDED_QUICK_CAPTURE_CHANGED_BATCH,
  );

  const hasUsedInbox = useMemo(() => {
    return hasUsedQuickCaptureRealtime || hasUsedQuickCaptureHistorical;
  }, [hasUsedQuickCaptureRealtime, hasUsedQuickCaptureHistorical]);

  // Check if user has clicked the planner CTA
  const { value: hasUsedPlanner } = useUserTrait(
    TRELLO_UI_BUTTON_CLICKED_CONNECTACCOUNTBUTTON_PLANNERSCREEN_CHANGED,
  );

  const isEligibleForD1Spotlight =
    isEligibleForStaggeredPPDiscovery &&
    !isOneTimeMessageDismissed(
      NEW_INVITEE_STAGGERED_D1_PP_DISCOVERY_SPOTLIGHT_TOUR_MESSAGE_ID,
    );

  const isEligibleForD2Spotlight = useMemo(() => {
    return (
      isEligibleForStaggeredPPDiscovery &&
      isOneTimeMessageDismissed(
        NEW_INVITEE_STAGGERED_D1_PP_DISCOVERY_SPOTLIGHT_TOUR_MESSAGE_ID,
      ) &&
      !isOneTimeMessageDismissed(
        NEW_INVITEE_STAGGERED_D2_PP_DISCOVERY_SPOTLIGHT_TOUR_MESSAGE_ID,
      ) &&
      isD2TimeBasedEligible
    );
  }, [
    isEligibleForStaggeredPPDiscovery,
    isOneTimeMessageDismissed,
    isD2TimeBasedEligible,
  ]);

  const getActiveSpotlight = useCallback(() => {
    if (isEligibleForD1Spotlight) {
      if (hasUsedInbox) {
        return plannerOpen ? PLANNER_PANEL_SPOTLIGHT : PLANNER_BUTTON_SPOTLIGHT;
      }
      return inboxOpen ? INBOX_PANEL_SPOTLIGHT : INBOX_BUTTON_SPOTLIGHT;
    }

    if (isEligibleForD2Spotlight) {
      if (hasUsedPlanner && !hasUsedInbox && !hasViewedInboxSpotlight) {
        return inboxOpen ? INBOX_PANEL_SPOTLIGHT : INBOX_BUTTON_SPOTLIGHT;
      }
      if (!hasUsedPlanner && !hasViewedPlannerSpotlight) {
        return plannerOpen ? PLANNER_PANEL_SPOTLIGHT : PLANNER_BUTTON_SPOTLIGHT;
      }
    }
    return null;
  }, [
    hasUsedInbox,
    hasUsedPlanner,
    hasViewedInboxSpotlight,
    hasViewedPlannerSpotlight,
    inboxOpen,
    isEligibleForD1Spotlight,
    isEligibleForD2Spotlight,
    plannerOpen,
  ]);

  const startSpotlight = useCallback(() => {
    if (isEligibleForD1Spotlight || isEligibleForD2Spotlight) {
      setActiveSpotlight(getActiveSpotlight());
    }
  }, [isEligibleForD1Spotlight, isEligibleForD2Spotlight, getActiveSpotlight]);

  useEffect(() => {
    if (
      (isEligibleForD1Spotlight || isEligibleForD2Spotlight) &&
      activeSpotlight === null
    ) {
      startSpotlight();
    }
  }, [
    isEligibleForD1Spotlight,
    isEligibleForD2Spotlight,
    activeSpotlight,
    startSpotlight,
  ]);

  useEffect(() => {
    if (activeSpotlight === null) {
      return;
    }

    switch (activeSpotlight) {
      case PLANNER_BUTTON_SPOTLIGHT:
        Analytics.sendViewedComponentEvent({
          componentType: 'spotlight',
          componentName: 'newInviteePlannerButtonSpotlight',
          source: 'newInviteePlannerButtonSpotlight',
          attributes: {
            awarenessElement: 'planner',
          },
        });
        break;
      case PLANNER_PANEL_SPOTLIGHT:
        Analytics.sendViewedComponentEvent({
          componentType: 'spotlight',
          componentName: 'newInviteePlannerPanelSpotlight',
          source: 'newInviteePlannerPanelSpotlight',
          attributes: {
            awarenessElement: 'planner',
          },
        });
        break;
      case INBOX_BUTTON_SPOTLIGHT:
        Analytics.sendViewedComponentEvent({
          componentType: 'spotlight',
          componentName: 'newInviteeInboxButtonSpotlight',
          source: 'newInviteeInboxButtonSpotlight',
          attributes: {
            awarenessElement: 'inbox',
          },
        });
        break;
      case INBOX_PANEL_SPOTLIGHT:
        Analytics.sendViewedComponentEvent({
          componentType: 'spotlight',
          componentName: 'newInviteeInboxPanelSpotlight',
          source: 'newInviteeInboxPanelSpotlight',
          attributes: {
            awarenessElement: 'inbox',
          },
        });
        break;
      default:
        break;
    }
  }, [activeSpotlight]);

  const dismissSpotlight = useCallback(() => {
    if (isEligibleForD1Spotlight) {
      dismissOneTimeMessage(
        NEW_INVITEE_STAGGERED_D1_PP_DISCOVERY_SPOTLIGHT_TOUR_MESSAGE_ID,
      );
    } else if (!isEligibleForD1Spotlight && isEligibleForD2Spotlight) {
      dismissOneTimeMessage(
        NEW_INVITEE_STAGGERED_D2_PP_DISCOVERY_SPOTLIGHT_TOUR_MESSAGE_ID,
      );
    }
    switch (activeSpotlight) {
      case PLANNER_BUTTON_SPOTLIGHT:
        Analytics.sendClickedButtonEvent({
          buttonName: 'newInviteePlannerButtonSpotlightDismissButton',
          source: 'newInviteePlannerButtonSpotlight',
          attributes: {
            awarenessElement: 'planner',
          },
        });
        break;
      case PLANNER_PANEL_SPOTLIGHT:
        Analytics.sendClickedButtonEvent({
          buttonName: 'newInviteePlannerPanelSpotlightDismissButton',
          source: 'newInviteePlannerPanelSpotlight',
          attributes: {
            awarenessElement: 'planner',
          },
        });
        break;
      case INBOX_BUTTON_SPOTLIGHT:
        Analytics.sendClickedButtonEvent({
          buttonName: 'newInviteeInboxButtonSpotlightDismissButton',
          source: 'newInviteeInboxButtonSpotlight',
          attributes: {
            awarenessElement: 'inbox',
          },
        });
        break;
      case INBOX_PANEL_SPOTLIGHT:
        Analytics.sendClickedButtonEvent({
          buttonName: 'newInviteeInboxPanelSpotlightDismissButton',
          source: 'newInviteeInboxPanelSpotlight',
          attributes: {
            awarenessElement: 'inbox',
          },
        });
        break;
      default:
        break;
    }
    setActiveSpotlight(null);
  }, [
    activeSpotlight,
    dismissOneTimeMessage,
    isEligibleForD1Spotlight,
    isEligibleForD2Spotlight,
  ]);

  const handleCtaClick = useCallback(() => {
    switch (activeSpotlight) {
      case PLANNER_BUTTON_SPOTLIGHT:
        Analytics.sendClickedButtonEvent({
          buttonName: 'newInviteePlannerButtonSpotlightOpenButton',
          source: 'newInviteePlannerButtonSpotlight',
          attributes: {
            awarenessElement: 'planner',
          },
        });
        togglePlanner();
        break;
      case PLANNER_PANEL_SPOTLIGHT:
        Analytics.sendClickedButtonEvent({
          buttonName: 'newInviteePlannerPanelSpotlightTryItButton',
          source: 'newInviteePlannerPanelSpotlight',
          attributes: {
            awarenessElement: 'planner',
          },
        });
        setWasPlannerPanelSpotlightDismissed({
          wasPlannerPanelSpotlightDismissed: true,
        });
        break;
      case INBOX_BUTTON_SPOTLIGHT:
        Analytics.sendClickedButtonEvent({
          buttonName: 'newInviteeInboxButtonSpotlightOpenButton',
          source: 'newInviteeInboxButtonSpotlight',
          attributes: {
            awarenessElement: 'inbox',
          },
        });
        toggleInbox();
        break;
      case INBOX_PANEL_SPOTLIGHT:
        Analytics.sendClickedButtonEvent({
          buttonName: 'newInviteeInboxPanelSpotlightTryItButton',
          source: 'newInviteeInboxPanelSpotlight',
          attributes: {
            awarenessElement: 'inbox',
          },
        });
        setInboxActiveButton({ activeButton: 'email' });
        break;
      default:
        break;
    }
    dismissSpotlight();
  }, [
    activeSpotlight,
    dismissSpotlight,
    togglePlanner,
    setWasPlannerPanelSpotlightDismissed,
    toggleInbox,
    setInboxActiveButton,
  ]);

  const renderActiveSpotlight = useCallback(() => {
    if (
      (!isEligibleForD1Spotlight && !isEligibleForD2Spotlight) ||
      activeSpotlight === null
    ) {
      return null;
    }

    switch (activeSpotlight) {
      case PLANNER_BUTTON_SPOTLIGHT:
        return (
          <Spotlight
            key={PLANNER_BUTTON_SPOTLIGHT}
            heading={intl.formatMessage({
              id: 'templates.pp_discovery_for_invitees_d1.nav-planner-spotlight-headline',
              defaultMessage: 'Protect your time with Trello Planner',
              description:
                'Heading for the new invitee combined PP discovery Spotlight for Planner',
            })}
            actions={[
              {
                onClick: handleCtaClick,
                text: intl.formatMessage({
                  id: 'templates.new_user_discovery.spotlight-planner-open',
                  defaultMessage: 'Open',
                  description:
                    'Open button for the new invitee combined PP discovery Spotlight for Planner',
                }),
              },
              {
                onClick: dismissSpotlight,
                appearance: 'subtle',
                text: intl.formatMessage({
                  id: 'templates.new_user_discovery.spotlight-planner-dismiss',
                  defaultMessage: 'Dismiss',
                  description: 'Dismiss button',
                }),
              },
            ]}
            dialogPlacement="top center"
            dialogWidth={SPOTLIGHT_WIDTH}
            targetRadius={BUTTON_SPOTLIGHT_RADIUS}
            target={PLANNER_BUTTON_SPOTLIGHT}
            targetBgColor={spotlightBGColor}
            image={PlannerImage}
          >
            <FormattedMessage
              id="templates.pp_discovery_for_invitees_d1.nav-planner-spotlight-description"
              defaultMessage="Connect your calendar, schedule your cards, and create focus time to get things done."
              description="Description for the new invitee combined PP discovery Spotlight"
            />
          </Spotlight>
        );

      case PLANNER_PANEL_SPOTLIGHT:
        return (
          <Spotlight
            key={PLANNER_PANEL_SPOTLIGHT}
            heading={intl.formatMessage({
              id: 'templates.pp_discovery_for_invitees_d1.nav-planner-spotlight-headline',
              defaultMessage: 'Protect your time with Trello Planner',
              description:
                'Heading for the new invitee combined PP discovery Spotlight for Planner',
            })}
            actions={[
              {
                onClick: handleCtaClick,
                text: intl.formatMessage({
                  id: 'templates.pp_discovery_for_invitees_d1.nav-spotlight-cta',
                  defaultMessage: 'Try it',
                  description: 'CTA for the planner panel spotlight',
                }),
              },
              {
                onClick: dismissSpotlight,
                appearance: 'subtle',
                text: intl.formatMessage({
                  id: 'templates.new_user_discovery.spotlight-planner-dismiss',
                  defaultMessage: 'Dismiss',
                  description: 'Dismiss button',
                }),
              },
            ]}
            dialogPlacement="right middle"
            dialogWidth={SPOTLIGHT_WIDTH}
            targetRadius={PANEL_SPOTLIGHT_RADIUS}
            target={PLANNER_PANEL_SPOTLIGHT}
            targetBgColor={spotlightBGColor}
            shouldWatchTarget={true}
          >
            <FormattedMessage
              id="templates.pp_discovery_for_invitees_d1.nav-planner-spotlight-description"
              defaultMessage="Connect your calendar, schedule your cards, and create focus time to get things done."
              description="Description for the new invitee combined PP discovery Spotlight"
            />
          </Spotlight>
        );

      case INBOX_BUTTON_SPOTLIGHT:
        return (
          <Spotlight
            key={INBOX_BUTTON_SPOTLIGHT}
            heading={intl.formatMessage({
              id: 'templates.pp_discovery_for_invitees_d1.nav-inbox-spotlight-headline',
              defaultMessage: 'Consolidate your to-dos',
              description:
                'Heading for the new invitee combined PP discovery Spotlight for Inbox',
            })}
            actions={[
              {
                onClick: handleCtaClick,
                text: intl.formatMessage({
                  id: 'templates.new_user_discovery.spotlight-planner-open',
                  defaultMessage: 'Open',
                  description:
                    'Open button for the new invitee combined PP discovery Spotlight for Inbox',
                }),
              },
              {
                onClick: dismissSpotlight,
                appearance: 'subtle',
                text: intl.formatMessage({
                  id: 'templates.new_user_discovery.spotlight-planner-dismiss',
                  defaultMessage: 'Dismiss',
                  description: 'Dismiss button',
                }),
              },
            ]}
            dialogPlacement="top center"
            dialogWidth={SPOTLIGHT_WIDTH}
            targetRadius={BUTTON_SPOTLIGHT_RADIUS}
            target={INBOX_BUTTON_SPOTLIGHT}
            targetBgColor={spotlightBGColor}
            image={InboxImage}
          >
            <FormattedMessage
              id="templates.pp_discovery_for_invitees_d1.nav-inbox-spotlight-description"
              defaultMessage="Inbox is your private space to capture to-dos directly or from email, web, and other apps."
              description="Description for the new invitee combined PP discovery Spotlight for Inbox"
            />
          </Spotlight>
        );

      case INBOX_PANEL_SPOTLIGHT:
        return (
          <Spotlight
            key={INBOX_PANEL_SPOTLIGHT}
            heading={intl.formatMessage({
              id: 'templates.pp_discovery_for_invitees_d1.inbox-spotlight-headline',
              defaultMessage: 'All your to-dos in one place',
              description: 'Heading for the inbox panel spotlight',
            })}
            actions={[
              {
                onClick: handleCtaClick,
                text: intl.formatMessage({
                  id: 'templates.pp_discovery_for_invitees_d1.nav-spotlight-cta',
                  defaultMessage: 'Try it',
                  description: 'CTA for the inbox panel spotlight',
                }),
              },
              {
                onClick: dismissSpotlight,
                appearance: 'subtle',
                text: intl.formatMessage({
                  id: 'templates.new_user_discovery.spotlight-planner-dismiss',
                  defaultMessage: 'Dismiss',
                  description: 'Dismiss button',
                }),
              },
            ]}
            dialogPlacement="right middle"
            dialogWidth={SPOTLIGHT_WIDTH}
            targetRadius={PANEL_SPOTLIGHT_RADIUS}
            target={INBOX_PANEL_SPOTLIGHT}
            targetBgColor={spotlightBGColor}
            shouldWatchTarget={true}
          >
            <FormattedMessage
              id="templates.pp_discovery_for_invitees_d1.nav-inbox-spotlight-description"
              defaultMessage="Inbox is your private space to capture to-dos directly or from email, web, and other apps."
              description="Description for the new invitee combined PP discovery Spotlight for Inbox"
            />
          </Spotlight>
        );
      default:
        return null;
    }
  }, [
    isEligibleForD1Spotlight,
    isEligibleForD2Spotlight,
    activeSpotlight,
    handleCtaClick,
    dismissSpotlight,
    spotlightBGColor,
  ]);

  return {
    renderActiveSpotlight,
    activeSpotlight,
  };
};
