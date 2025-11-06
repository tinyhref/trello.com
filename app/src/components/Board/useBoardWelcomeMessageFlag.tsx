import { useCallback } from 'react';

import { TrelloIcon } from '@atlaskit/logo';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { intl } from '@trello/i18n';
import { useBoardId } from '@trello/id-context';
import { dismissFlag, showFlag } from '@trello/nachos/experimental-flags';

export const useBoardWelcomeMessageFlag = () => {
  const boardId = useBoardId();
  const { dismissOneTimeMessage } = useOneTimeMessagesDismissed();

  const handleWelcomeMessageFlagDismiss = useCallback(() => {
    dismissOneTimeMessage('d0-invitee-board-welcome');
    dismissFlag({ id: 'inviteeBoardWelcomeMessage' });
  }, [dismissOneTimeMessage]);

  const showWelcomeMessageFlag = useCallback(() => {
    showFlag({
      appearance: 'success',
      id: 'inviteeBoardWelcomeMessage',
      title: intl.formatMessage({
        id: 'templates.pp_discovery_for_invitees_d0.board-headline',
        // eslint-disable-next-line formatjs/no-emoji
        defaultMessage: 'You’ve just joined a Trello board 🎉',
        description: 'Board welcome message headline',
      }),
      icon: (
        <TrelloIcon appearance="brand" shouldUseNewLogoDesign size="xxsmall" />
      ),
      onManualDismiss: handleWelcomeMessageFlagDismiss,
      description: (
        <>
          {intl.formatMessage({
            id: 'templates.pp_discovery_for_invitees_d0.board-description-part1',
            defaultMessage:
              'Use this board to organize, plan, and track anything that matters to you or the person who invited you. ',
            description: 'First part of board welcome message description',
          })}
          <br />
          <br />
          {intl.formatMessage({
            id: 'templates.pp_discovery_for_invitees_d0.board-description-part2',
            defaultMessage: 'You can also create your own.',
            description: 'Second part of board welcome message description',
          })}
        </>
      ),
    });

    Analytics.sendViewedComponentEvent({
      componentType: 'flag',
      componentName: 'inviteeBoardWelcomeMessage',
      source: 'boardScreen',
      containers: formatContainers({ boardId }),
    });
  }, [handleWelcomeMessageFlagDismiss, boardId]);

  return {
    showWelcomeMessageFlag,
  };
};
