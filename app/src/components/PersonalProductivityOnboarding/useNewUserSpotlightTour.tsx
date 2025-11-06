import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import type { SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { intl } from '@trello/i18n';
import { Spotlight } from '@trello/nachos/experimental-onboarding';

import newUserInboxSpotlightImage from './inbox-spotlight.gif';
import newUserOnboardingListSpotlightImage from './onboarding-list-spotlight.gif';
import newUserPanelSpotlightImage from './panels-spotlight.gif';
import {
  INBOX_SPOTLIGHT,
  INBOX_SPOTLIGHT_RADIUS,
  ISLAND_NAV_SPOTLIGHT_MESSAGE_ID,
  NEW_USER_SPOTLIGHT_TOUR_MESSAGE_ID,
  ONBOARDING_LIST_SPOTLIGHT,
  ONBOARDING_LIST_SPOTLIGHT_RADIUS,
  PANEL_NAVIGATION_SPOTLIGHT,
  PANEL_NAVIGATION_SPOTLIGHT_RADIUS,
  SPOTLIGHT_WIDTH,
} from './PersonalProductivityOnboarding.constants';
import { personalProductivityOnboardingStepSharedState } from './personalProductivityOnboardingStepSharedState';

import * as styles from './useNewUserSpotlightTour.module.less';

interface NewUserSpotlightTourProps {
  next: () => void;
  onDismissSpotlight?: () => void;
  showInboxSpotlightState: boolean;
  showListSpotlightState: boolean;
}

export const useNewUserSpotlightTour = ({
  next,
  onDismissSpotlight,
  showInboxSpotlightState,
  showListSpotlightState,
}: NewUserSpotlightTourProps) => {
  const totalNewUserSpotlights =
    3 - (showInboxSpotlightState ? 0 : 1) - (showListSpotlightState ? 0 : 1);

  const panelNavigationNextButton = useCallback(() => {
    if (showInboxSpotlightState) {
      Analytics.sendViewedComponentEvent({
        componentType: 'spotlight',
        componentName: 'inboxSpotlight',
        source: 'inboxSpotlight',
      });
    } else if (showListSpotlightState) {
      Analytics.sendViewedComponentEvent({
        componentType: 'spotlight',
        componentName: 'onboardingListSpotlight',
        source: 'onboardingListSpotlight',
      });
    }

    Analytics.sendClickedButtonEvent({
      buttonName: 'islandNavigationSpotlightNextButton',
      source: 'islandNavigationSpotlight',
      attributes: {
        discoveryCampaign: 'newUserOnboarding',
      },
    });
    next();
  }, [next, showInboxSpotlightState, showListSpotlightState]);

  const inboxSpotlightNextButton = useCallback(() => {
    Analytics.sendViewedComponentEvent({
      componentType: 'spotlight',
      componentName: 'onboardingListSpotlight',
      source: 'onboardingListSpotlight',
    });

    Analytics.sendClickedButtonEvent({
      buttonName: 'inboxSpotlightNextButton',
      source: 'inboxSpotlight',
      attributes: {
        discoveryCampaign: 'newUserOnboarding',
      },
    });

    next();
  }, [next]);

  const { dismissOneTimeMessage } = useOneTimeMessagesDismissed();

  const nextButtonText = intl.formatMessage({
    id: 'templates.new_user_discovery.spotlight-next',
    defaultMessage: 'Next',
    description: 'Next button',
  });

  // Dismiss Logic
  const dismissNewUserSpotlightTour = useCallback(async () => {
    const doneButtonSource: SourceType[] = [
      'islandNavigationSpotlight',
      'inboxSpotlight',
      'onboardingListSpotlight',
    ];
    Analytics.sendClickedButtonEvent({
      buttonName: 'onboardingListSpotlightDoneButton',
      source: doneButtonSource[totalNewUserSpotlights - 1],
      attributes: {
        discoveryCampaign: 'newUserOnboarding',
      },
    });
    personalProductivityOnboardingStepSharedState.setValue({
      step: null,
      activeTarget: null,
    });
    onDismissSpotlight?.();
    await dismissOneTimeMessage(NEW_USER_SPOTLIGHT_TOUR_MESSAGE_ID);
    await dismissOneTimeMessage(ISLAND_NAV_SPOTLIGHT_MESSAGE_ID);
  }, [totalNewUserSpotlights, dismissOneTimeMessage, onDismissSpotlight]);

  const doneButton = {
    onClick: dismissNewUserSpotlightTour,
    text: intl.formatMessage({
      id: 'templates.new_user_discovery.spotlight-done',
      defaultMessage: 'Done',
      description: 'Done button',
    }),
  };

  const newUserPanelSpotlight = (
    <Spotlight
      heading={intl.formatMessage({
        id: 'templates.new_user_discovery.spotlight-panel-title',
        defaultMessage: 'One, two, three… panels',
        description: 'Heading for panel navigation Spotlight',
      })}
      actionsBeforeElement={`1/${totalNewUserSpotlights}`}
      dialogPlacement={'top center'}
      dialogWidth={SPOTLIGHT_WIDTH}
      actions={
        totalNewUserSpotlights > 1
          ? [
              {
                onClick: panelNavigationNextButton,
                text: nextButtonText,
              },
            ]
          : [doneButton]
      }
      target={PANEL_NAVIGATION_SPOTLIGHT}
      targetRadius={PANEL_NAVIGATION_SPOTLIGHT_RADIUS}
      image={newUserPanelSpotlightImage}
      key={PANEL_NAVIGATION_SPOTLIGHT}
    >
      <FormattedMessage
        id="templates.new_user_discovery.spotlight-panel-description"
        defaultMessage="You can show and hide your Inbox, board, and Planner with your preferred view, and switch your boards."
        description="Panel navigation Spotlight description"
      />
    </Spotlight>
  );
  const newUserInboxSpotlight = (
    <Spotlight
      key={INBOX_SPOTLIGHT}
      heading={intl.formatMessage({
        id: 'templates.new_user_discovery.spotlight-inbox-title',
        defaultMessage: 'From email to Inbox',
        description: 'Heading for inbox Spotlight',
      })}
      actionsBeforeElement={`2/${totalNewUserSpotlights}`}
      dialogPlacement={'right top'}
      dialogWidth={SPOTLIGHT_WIDTH}
      actions={
        totalNewUserSpotlights > 2
          ? [
              {
                onClick: inboxSpotlightNextButton,
                text: nextButtonText,
              },
            ]
          : [doneButton]
      }
      target={INBOX_SPOTLIGHT}
      targetRadius={INBOX_SPOTLIGHT_RADIUS}
      image={newUserInboxSpotlightImage}
    >
      <FormattedMessage
        id="templates.new_user_discovery.spotlight-inbox-description"
        defaultMessage="Add a card to your Inbox by emailing {emailLink} from the email address linked with your Trello account."
        description="Inbox Spotlight description"
        values={{
          emailLink: (
            <a
              href="mailto:inbox@app.trello.com"
              className={styles.emailLink}
              onClick={() => {
                Analytics.sendClickedLinkEvent({
                  linkName: 'inboxSpotlightEmailLink',
                  source: 'inboxSpotlight',
                  attributes: {
                    discoveryCampaign: 'newUserOnboarding',
                  },
                });
              }}
            >
              <FormattedMessage
                id="templates.new_user_discovery.spotlight-inbox-email"
                defaultMessage="inbox@app.trello.com"
                description="Inbox email"
              />
            </a>
          ),
        }}
      />
    </Spotlight>
  );
  const newUserListSpotlight = (
    <Spotlight
      key={ONBOARDING_LIST_SPOTLIGHT}
      heading={intl.formatMessage({
        id: 'templates.new_user_discovery.spotlight-list-title',
        defaultMessage: 'Get to know Trello',
        description: 'Heading for Getting Started list Spotlight',
      })}
      actionsBeforeElement={`${totalNewUserSpotlights}/${totalNewUserSpotlights}`}
      dialogPlacement={'right middle'}
      dialogWidth={SPOTLIGHT_WIDTH}
      actions={[doneButton]}
      target={ONBOARDING_LIST_SPOTLIGHT}
      targetRadius={ONBOARDING_LIST_SPOTLIGHT_RADIUS}
      image={newUserOnboardingListSpotlightImage}
    >
      <FormattedMessage
        id="templates.new_user_discovery.spotlight-list-description"
        defaultMessage="Use this 'Trello Starter Guide' list to learn the basics and level up your Trello skills."
        description="Getting started lits Spotlight description"
      />
    </Spotlight>
  );

  return {
    newUserPanelSpotlight,
    newUserInboxSpotlight,
    newUserListSpotlight,
  };
};
