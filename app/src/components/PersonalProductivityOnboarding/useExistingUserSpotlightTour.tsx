import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import { boardSwitcherOpenSharedState } from '@trello/board-switcher';
import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { intl } from '@trello/i18n';
import { Spotlight } from '@trello/nachos/experimental-onboarding';
import { useSplitScreenSharedState } from '@trello/split-screen';
import { token } from '@trello/theme';

import { closeGASpotlightTour } from 'app/src/components/PersonalProductivityBeta/betaGASharedState';
import existingUserBoardSwitcherImage from './existing-user-board-switcher.gif';
import newUserInboxSpotlightImage from './inbox-spotlight.gif';
import newUserPanelSpotlightImage from './panels-spotlight.gif';
import {
  BOARD_SWITCHER_SPOTLIGHT,
  BOARD_SWITCHER_SPOTLIGHT_MESSAGE_ID,
  BOARD_SWITCHER_SPOTLIGHT_RADIUS,
  INBOX_SPOTLIGHT,
  INBOX_SPOTLIGHT_RADIUS,
  ISLAND_NAV_SPOTLIGHT_MESSAGE_ID,
  NEW_USER_SPOTLIGHT_TOUR_MESSAGE_ID,
  PANEL_NAVIGATION_SPOTLIGHT,
  PANEL_NAVIGATION_SPOTLIGHT_RADIUS,
} from './PersonalProductivityOnboarding.constants';
import { personalProductivityOnboardingStepSharedState } from './personalProductivityOnboardingStepSharedState';

interface ExistingUserSpotlightTourProps {
  next: () => void;
}

export const useExistingUserSpotlightTour = ({
  next,
}: ExistingUserSpotlightTourProps) => {
  const { panels, toggleInbox } = useSplitScreenSharedState();
  const { dismissOneTimeMessage } = useOneTimeMessagesDismissed();
  const spotlightBGColor = token('color.background.input', '#FFFFFFF');

  const dismissExistingUsersSpotlightTour = useCallback(async () => {
    personalProductivityOnboardingStepSharedState.setValue({
      step: null,
      activeTarget: null,
    });
    closeGASpotlightTour();
    await dismissOneTimeMessage(BOARD_SWITCHER_SPOTLIGHT_MESSAGE_ID, {
      optimistic: false, //if we don't do this, the spotlight pulse on the board switcher button is visible for a split second
    });
    await dismissOneTimeMessage(ISLAND_NAV_SPOTLIGHT_MESSAGE_ID, {
      optimistic: false, //if we don't do this unoptimistically, the spotlight pulse on the board switcher button is visible for a split second
    });
    await dismissOneTimeMessage(NEW_USER_SPOTLIGHT_TOUR_MESSAGE_ID);
  }, [dismissOneTimeMessage]);

  const dismissPanelSpotlight = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'panelSpotlightDismissButton',
      source: 'panelSpotlight',
    });
    if (!panels.inbox) {
      toggleInbox();
    }
    dismissExistingUsersSpotlightTour();
  }, [panels.inbox, toggleInbox, dismissExistingUsersSpotlightTour]);

  const dismissBoardSwitcherSpotlight = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'boardSwitcherSpotlightDismissButton',
      source: 'boardSwitcherSpotlight',
    });
    if (!panels.inbox) {
      toggleInbox();
    }
    boardSwitcherOpenSharedState.setValue({
      isOpen: false,
      isSpotlightOpen: false,
    });
    dismissExistingUsersSpotlightTour();
  }, [panels.inbox, toggleInbox, dismissExistingUsersSpotlightTour]);

  const dismissInboxSpotlight = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'inboxSpotlightDismissButton',
      source: 'inboxSpotlight',
    });
    dismissExistingUsersSpotlightTour();
  }, [dismissExistingUsersSpotlightTour]);

  const panelNavigationNextButton = useCallback(() => {
    boardSwitcherOpenSharedState.setValue({
      isOpen: true,
      isSpotlightOpen: true, // Stops trapping focus causing focus war
    });
    Analytics.sendClickedButtonEvent({
      buttonName: 'islandNavigationSpotlightNextButton',
      source: 'islandNavigationSpotlight',
      attributes: {
        discoveryCampaign: 'existingUserIntroCampaign',
      },
    });

    // note: we are sending an Analytics.viewedComponent event within the BoardSwitcherSpotlight
    next();
  }, [next]);

  const boardSwitcherNextButton = useCallback(() => {
    if (!panels.inbox) {
      toggleInbox();
    }

    boardSwitcherOpenSharedState.setValue({
      isOpen: false,
      isSpotlightOpen: false,
    });

    Analytics.sendViewedComponentEvent({
      componentType: 'spotlight',
      componentName: 'inboxSpotlight',
      source: 'inboxSpotlight',
    });

    Analytics.sendClickedButtonEvent({
      buttonName: 'boardSwitcherSpotlightNextButton',
      source: 'boardSwitcherSpotlight',
      attributes: {
        discoveryCampaign: 'existingUserIntroCampaign',
      },
    });
    next();
  }, [panels.inbox, toggleInbox, next]);

  const existingUserSpotlights = [
    <Spotlight
      key={PANEL_NAVIGATION_SPOTLIGHT}
      heading={intl.formatMessage({
        id: 'templates.split_screen.spotlights.show-or-hide-panels',
        defaultMessage: 'Show or hide panels',
        description: 'Heading for panel navigation Spotlight',
      })}
      actionsBeforeElement={'1/3'}
      actions={[
        {
          onClick: panelNavigationNextButton,
          text: intl.formatMessage({
            id: 'templates.split_screen.spotlights.next',
            defaultMessage: 'Next',
            description: 'Next button for panel navigation Spotlight',
          }),
        },
        {
          onClick: dismissPanelSpotlight,
          text: intl.formatMessage({
            id: 'templates.split_screen.spotlights.dismiss',
            defaultMessage: 'Dismiss',
            description: 'Dismiss button for Spotlight tour',
          }),
        },
      ]}
      dialogPlacement={'top center'}
      dialogWidth={275}
      targetRadius={PANEL_NAVIGATION_SPOTLIGHT_RADIUS}
      target={PANEL_NAVIGATION_SPOTLIGHT}
      image={newUserPanelSpotlightImage}
      targetBgColor={spotlightBGColor}
    >
      <FormattedMessage
        id="templates.split_screen.spotlights.select-each-section"
        defaultMessage="Select each section to show or hide a board, Inbox, and Planner."
        description="Panel navigation Spotlight"
      />
    </Spotlight>,
    <Spotlight
      key={BOARD_SWITCHER_SPOTLIGHT_MESSAGE_ID}
      heading={intl.formatMessage({
        id: 'templates.split_screen.spotlights.find-and-open-boards',
        defaultMessage: 'Find and open boards',
        description: 'Heading for board switcher Spotlight',
      })}
      actionsBeforeElement={'2/3'}
      actions={[
        {
          onClick: boardSwitcherNextButton,
          text: intl.formatMessage({
            id: 'templates.split_screen.spotlights.next',
            defaultMessage: 'Next',
            description: 'Next button for board switcher Spotlight',
          }),
        },
        {
          onClick: dismissBoardSwitcherSpotlight,
          text: intl.formatMessage({
            id: 'templates.split_screen.spotlights.dismiss',
            defaultMessage: 'Dismiss',
            description: 'Dismiss button for Spotlight tour',
          }),
        },
      ]}
      dialogWidth={275}
      dialogPlacement={'right top'}
      targetRadius={BOARD_SWITCHER_SPOTLIGHT_RADIUS}
      target={BOARD_SWITCHER_SPOTLIGHT}
      image={existingUserBoardSwitcherImage}
      targetBgColor={spotlightBGColor}
    >
      <FormattedMessage
        id="templates.split_screen.spotlights.search-by-board"
        defaultMessage="Search by board name or choose from the list."
        description="Board switcher navigation Spotlight"
      />
    </Spotlight>,
    <Spotlight
      key={INBOX_SPOTLIGHT}
      heading={intl.formatMessage({
        id: 'templates.split_screen.spotlights.many-ways-to-capture',
        defaultMessage: 'Many ways to capture',
        description: 'Heading for Inbox Spotlight',
      })}
      actionsBeforeElement={'3/3'}
      actions={[
        {
          onClick: dismissInboxSpotlight,
          text: intl.formatMessage({
            id: 'templates.split_screen.spotlights.done',
            defaultMessage: 'Done',
            description: 'Done button for Inbox Spotlight',
          }),
        },
      ]}
      dialogPlacement={'right top'}
      dialogWidth={275}
      targetRadius={INBOX_SPOTLIGHT_RADIUS}
      target={INBOX_SPOTLIGHT}
      image={newUserInboxSpotlightImage}
      targetBgColor={spotlightBGColor}
      shouldWatchTarget={true}
    >
      <FormattedMessage
        id="templates.split_screen.spotlights.add-cards-directly"
        defaultMessage="Add cards directly or capture from email and Slack. Select each card to find out more."
        description="Inbox Spotlight"
      />
    </Spotlight>,
  ];

  return { existingUserSpotlights };
};
