import { useCallback, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import { boardSwitcherOpenSharedState } from '@trello/board-switcher';
import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { Spotlight } from '@trello/nachos/experimental-onboarding';
import { token } from '@trello/theme';

import existingUserBoardSwitcherImage from './existing-user-board-switcher.gif';
import { BOARD_SWITCHER_SPOTLIGHT } from './PersonalProductivityOnboarding.constants';

export const BoardSwitcherButtonSpotlight = () => {
  const intl = useIntl();

  const spotlightBGColor = token('color.background.input', '#FFFFFFF');
  const { dismissOneTimeMessage } = useOneTimeMessagesDismissed();

  const handleBoardSwitcherIndividualSpotlightDismiss =
    useCallback(async () => {
      Analytics.sendClickedButtonEvent({
        buttonName: 'boardSwitcherSpotlightDismissButton',
        source: 'boardSwitcherSpotlight',
      });

      boardSwitcherOpenSharedState.setValue({
        isSpotlightOpen: false,
      });

      await dismissOneTimeMessage(BOARD_SWITCHER_SPOTLIGHT);
    }, [dismissOneTimeMessage]);

  useEffect(() => {
    boardSwitcherOpenSharedState.setValue({
      isOpen: true,
      isSpotlightOpen: true,
    });
  }, []);

  return (
    <Spotlight
      key={BOARD_SWITCHER_SPOTLIGHT}
      heading={intl.formatMessage({
        id: 'templates.split_screen.spotlights.find-and-open-boards',
        defaultMessage: 'Find and open boards',
        description: 'Heading for board switcher Spotlight',
      })}
      actions={[
        {
          onClick: handleBoardSwitcherIndividualSpotlightDismiss,
          text: intl.formatMessage({
            id: 'templates.split_screen.spotlights.dismiss',
            defaultMessage: 'Dismiss',
            description: 'Dismiss button for Spotlight tour',
          }),
        },
      ]}
      dialogPlacement="right top"
      dialogWidth={275}
      targetRadius={16}
      target={BOARD_SWITCHER_SPOTLIGHT}
      image={existingUserBoardSwitcherImage}
      targetBgColor={spotlightBGColor}
    >
      <FormattedMessage
        id="templates.split_screen.spotlights.search-by-board"
        defaultMessage="Search by board name or choose from the list."
        description="Board switcher navigation Spotlight"
      />
    </Spotlight>
  );
};
