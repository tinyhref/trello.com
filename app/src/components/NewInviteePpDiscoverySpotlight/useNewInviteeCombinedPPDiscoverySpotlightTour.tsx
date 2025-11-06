import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
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
  INBOX_AND_PLANNER_BUTTON_SPOTLIGHT,
  INBOX_AND_PLANNER_PANEL_SPOTLIGHT,
  INBOX_BUTTON_SPOTLIGHT,
  NEW_INVITEE_COMBINED_PP_DISCOVERY_SPOTLIGHT_TOUR_MESSAGE_ID,
  PANEL_SPOTLIGHT_RADIUS,
  PLANNER_BUTTON_SPOTLIGHT,
  SPOTLIGHT_WIDTH,
} from './NewInviteePpDiscoverySpotlight.constants';
import PlannerImage from './Planner.gif';
import { useIsEligibleForPPDiscovery } from './useIsEligibleForPPDiscovery';
import { usePreloadGifs } from './usePreloadGifs';

export const useNewInviteeCombinedPPDiscoverySpotlightTour = () => {
  const { isEligibleForCombinedPPDiscovery } = useIsEligibleForPPDiscovery();
  const { toggleInbox, togglePlanner } = useSplitScreenSharedState();
  const { isOneTimeMessageDismissed, dismissOneTimeMessage } =
    useOneTimeMessagesDismissed();
  const [, setInboxActiveButton] = useInboxActiveButtonSharedState();

  const [activeSpotlight, setActiveSpotlight] = useState<string | null>(null);

  const spotlightBGColor = token('color.background.input', '#FFFFFF');
  const inboxOpen = useIsInboxPanelOpen();
  const plannerOpen = useIsPlannerPanelOpen();

  const isEligibleForSpotlight =
    isEligibleForCombinedPPDiscovery &&
    !isOneTimeMessageDismissed(
      NEW_INVITEE_COMBINED_PP_DISCOVERY_SPOTLIGHT_TOUR_MESSAGE_ID,
    );

  usePreloadGifs();

  // Determine which spotlight to show based on panel states
  const getActiveSpotlight = useCallback(() => {
    if (inboxOpen && !plannerOpen) {
      return PLANNER_BUTTON_SPOTLIGHT;
    } else if (!inboxOpen && plannerOpen) {
      return INBOX_BUTTON_SPOTLIGHT;
    } else if (!inboxOpen && !plannerOpen) {
      return INBOX_AND_PLANNER_BUTTON_SPOTLIGHT;
    } else {
      return INBOX_AND_PLANNER_PANEL_SPOTLIGHT;
    }
  }, [inboxOpen, plannerOpen]);

  const startSpotlight = useCallback(() => {
    if (isEligibleForSpotlight) {
      setActiveSpotlight(getActiveSpotlight());
    }
  }, [isEligibleForSpotlight, getActiveSpotlight]);

  useEffect(() => {
    if (isEligibleForSpotlight && activeSpotlight === null) {
      startSpotlight();
    }
  }, [isEligibleForSpotlight, activeSpotlight, startSpotlight]);

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
      case INBOX_AND_PLANNER_BUTTON_SPOTLIGHT:
        Analytics.sendViewedComponentEvent({
          componentType: 'spotlight',
          componentName: 'newInviteeCombinedButtonSpotlight',
          source: 'newInviteeCombinedButtonSpotlight',
          attributes: {
            awarenessElement: 'inboxAndPlanner',
          },
        });
        break;
      case INBOX_AND_PLANNER_PANEL_SPOTLIGHT:
        Analytics.sendViewedComponentEvent({
          componentType: 'spotlight',
          componentName: 'newInviteeCombinedPanelSpotlight',
          source: 'newInviteeCombinedPanelSpotlight',
          attributes: {
            awarenessElement: 'inboxAndPlanner',
          },
        });
        break;
      default:
        break;
    }
  }, [activeSpotlight]);

  const dismissSpotlight = useCallback(() => {
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
      case INBOX_BUTTON_SPOTLIGHT:
        Analytics.sendClickedButtonEvent({
          buttonName: 'newInviteeInboxButtonSpotlightDismissButton',
          source: 'newInviteeInboxButtonSpotlight',
          attributes: {
            awarenessElement: 'inbox',
          },
        });
        break;
      case INBOX_AND_PLANNER_BUTTON_SPOTLIGHT:
        Analytics.sendClickedButtonEvent({
          buttonName: 'newInviteeCombinedButtonSpotlightDismissButton',
          source: 'newInviteeCombinedButtonSpotlight',
          attributes: {
            awarenessElement: 'inboxAndPlanner',
          },
        });
        break;
      case INBOX_AND_PLANNER_PANEL_SPOTLIGHT:
        Analytics.sendClickedButtonEvent({
          buttonName: 'newInviteeCombinedPanelSpotlightDismissButton',
          source: 'newInviteeCombinedPanelSpotlight',
          attributes: {
            awarenessElement: 'inboxAndPlanner',
          },
        });
        break;
      default:
        break;
    }

    setActiveSpotlight(null);
    dismissOneTimeMessage(
      NEW_INVITEE_COMBINED_PP_DISCOVERY_SPOTLIGHT_TOUR_MESSAGE_ID,
    );
  }, [dismissOneTimeMessage, activeSpotlight]);

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
      case INBOX_AND_PLANNER_PANEL_SPOTLIGHT:
        Analytics.sendClickedButtonEvent({
          buttonName: 'newInviteeCombinedPanelSpotlightTryItButton',
          source: 'newInviteeCombinedPanelSpotlight',
          attributes: {
            awarenessElement: 'inboxAndPlanner',
          },
        });
        setInboxActiveButton({ activeButton: 'email' });
        break;
      case INBOX_AND_PLANNER_BUTTON_SPOTLIGHT:
        Analytics.sendClickedButtonEvent({
          buttonName: 'newInviteeCombinedButtonSpotlightOpenButton',
          source: 'newInviteeCombinedButtonSpotlight',
          attributes: {
            awarenessElement: 'inboxAndPlanner',
          },
        });
        toggleInbox();
        togglePlanner();
        break;
      default:
        break;
    }
    dismissSpotlight();
  }, [
    activeSpotlight,
    dismissSpotlight,
    togglePlanner,
    toggleInbox,
    setInboxActiveButton,
  ]);

  const renderActiveSpotlight = useCallback(() => {
    if (!isEligibleForSpotlight || activeSpotlight === null) {
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

      case INBOX_AND_PLANNER_BUTTON_SPOTLIGHT:
        return (
          <Spotlight
            key={INBOX_AND_PLANNER_BUTTON_SPOTLIGHT}
            heading={intl.formatMessage({
              id: 'templates.pp_discovery_for_invitees_d1.nav-combined-spotlight-headline',
              defaultMessage: 'Your private space in Trello',
              description:
                'Heading for the new invitee combined PP discovery Spotlight for Inbox and Planner',
            })}
            actions={[
              {
                onClick: handleCtaClick,
                text: intl.formatMessage({
                  id: 'templates.new_user_discovery.spotlight-planner-open',
                  defaultMessage: 'Open',
                  description:
                    'Open button for the new invitee combined PP discovery Spotlight for Inbox and Planner',
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
            target={INBOX_AND_PLANNER_BUTTON_SPOTLIGHT}
            targetBgColor={spotlightBGColor}
            image={PlannerImage}
          >
            <FormattedMessage
              id="templates.pp_discovery_for_invitees_d1.nav-combined-spotlight-description"
              defaultMessage="Inbox and Planner are just for you – capture your to-dos, block time to get things done, and build a powerful workflow."
              description="Description for the new invitee combined PP discovery Spotlight for Inbox and Planner"
            />
          </Spotlight>
        );

      case INBOX_AND_PLANNER_PANEL_SPOTLIGHT:
        return (
          <Spotlight
            key={INBOX_AND_PLANNER_PANEL_SPOTLIGHT}
            heading={intl.formatMessage({
              id: 'templates.pp_discovery_for_invitees_d1.nav-combined-spotlight-headline',
              defaultMessage: 'Your private space in Trello',
              description:
                'Heading for the new invitee combined PP discovery Spotlight for Inbox and Planner',
            })}
            actions={[
              {
                onClick: handleCtaClick,
                text: intl.formatMessage({
                  id: 'templates.pp_discovery_for_invitees_d1.nav-spotlight-cta',
                  defaultMessage: 'Try it',
                  description:
                    'CTA for the new invitee combined PP discovery Spotlight',
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
            target={INBOX_AND_PLANNER_PANEL_SPOTLIGHT}
            targetBgColor={spotlightBGColor}
            shouldWatchTarget={true}
          >
            <FormattedMessage
              id="templates.pp_discovery_for_invitees_d1.nav-combined-spotlight-description"
              defaultMessage="Inbox and Planner are just for you – capture your to-dos, block time to get things done, and build a powerful workflow."
              description="Description for the new invitee combined PP discovery Spotlight for Inbox and Planner"
            />
          </Spotlight>
        );

      default:
        return null;
    }
  }, [
    isEligibleForSpotlight,
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
