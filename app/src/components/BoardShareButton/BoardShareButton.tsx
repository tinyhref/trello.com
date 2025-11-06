import classNames from 'classnames';
import type { FunctionComponent } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Badge from '@atlaskit/badge';
import PersonAddIcon from '@atlaskit/icon/core/person-add';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { useMemberId } from '@trello/authentication';
import { isEmbeddedInAtlassian } from '@trello/browser';
import { useBoardAccessRequests } from '@trello/business-logic-react/board';
import { intl } from '@trello/i18n';
import { pauseShortcuts, resumeShortcuts } from '@trello/keybindings';
import { Dialog, useDialog } from '@trello/nachos/dialog';
import {
  Spotlight,
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
} from '@trello/nachos/experimental-onboarding';
import type { BoardHeaderTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { LazyBoardInviteModal } from 'app/src/components/BoardInviteModal';
import { useBoardShareButtonAccessRequestsSpotlightFragment } from './BoardShareButtonAccessRequestsSpotlightFragment.generated';
import { useBoardShareButtonAccessRequestsSpotlightMessageMutation } from './BoardShareButtonAccessRequestsSpotlightMessageMutation.generated';

import * as styles from './BoardShareButton.module.less';

const BOARD_SHARE_BUTTON_ACCESS_REQUESTS_SPOTLIGHT_MESSAGE =
  'board-share-button-access-requests-spotlight';

interface BoardShareButtonProps {
  idBoard: string;
  idOrg: string;
}

export const BoardShareButton: FunctionComponent<BoardShareButtonProps> = ({
  idBoard,
  idOrg,
}) => {
  const [startingTab, setStartingTab] = useState<'members' | 'requests'>(
    'members',
  );
  const {
    show: showDialog,
    hide: hideDialog,
    isOpen: isDialogOpen,
    dialogProps,
  } = useDialog();

  const isEmbedded = isEmbeddedInAtlassian();

  const { accessRequests } = useBoardAccessRequests({ boardId: idBoard });

  const isSpotlightFeatureAvailable =
    accessRequests && accessRequests.length > 0;

  const memberId = useMemberId();
  const [isSpotlightActive, setIsSpotlightActive] = useState(false);
  const { data: memberData } =
    useBoardShareButtonAccessRequestsSpotlightFragment({
      from: { id: memberId },
    });

  const [dismissOneTimeMessage, { data: dismissResponse }] =
    useBoardShareButtonAccessRequestsSpotlightMessageMutation();

  const messagesDismissed =
    dismissResponse?.addOneTimeMessagesDismissed?.oneTimeMessagesDismissed ??
    memberData?.oneTimeMessagesDismissed;

  const boardShareButtonAccessRequestsSpotlightDismissed =
    !!messagesDismissed?.find(
      (message: string) =>
        message === BOARD_SHARE_BUTTON_ACCESS_REQUESTS_SPOTLIGHT_MESSAGE,
    );

  const dismissSpotlight = useCallback(async () => {
    setIsSpotlightActive(false);
    await dismissOneTimeMessage({
      variables: {
        messageId: BOARD_SHARE_BUTTON_ACCESS_REQUESTS_SPOTLIGHT_MESSAGE,
      },
    });
  }, [dismissOneTimeMessage, setIsSpotlightActive]);

  const handleDismissSpotlightClick = useCallback(() => {
    dismissSpotlight();
    Analytics.sendClickedButtonEvent({
      buttonName: 'dismissButton',
      source: 'boardShareButtonAccessRequestsSpotlight',
    });
  }, [dismissSpotlight]);

  const handleSpotlightOpenShareModal = useCallback(() => {
    setStartingTab('requests');
    dismissSpotlight();
    showDialog();
    Analytics.sendClickedButtonEvent({
      buttonName: 'viewBoardAccessRequestsButton',
      source: 'boardShareButtonAccessRequestsSpotlight',
    });
  }, [showDialog, dismissSpotlight]);

  const onNextFrame = (func: () => void, delay = 0): number => {
    const nextFrameTimeoutId = window.setTimeout(() => {
      window.requestAnimationFrame(() => window.requestAnimationFrame(func));
    }, delay);
    return nextFrameTimeoutId;
  };

  useEffect(() => {
    if (
      !boardShareButtonAccessRequestsSpotlightDismissed &&
      isSpotlightFeatureAvailable
    ) {
      const nextFrameTimeoutId = onNextFrame(() => {
        setIsSpotlightActive(true);
        Analytics.sendViewedComponentEvent({
          componentName: 'boardShareButtonAccessRequestsSpotlight',
          componentType: 'spotlight',
          source: 'boardScreen',
        });
      }, 250);
      return () => window.clearTimeout(nextFrameTimeoutId);
    }
  }, [
    boardShareButtonAccessRequestsSpotlightDismissed,
    isSpotlightFeatureAvailable,
  ]);

  useEffect(() => {
    if (isSpotlightActive) {
      pauseShortcuts();
    } else if (!isSpotlightActive) {
      resumeShortcuts();
    }

    return () => resumeShortcuts();
  }, [isSpotlightActive]);

  const openBoardShareModal = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'shareButton',
      source: 'boardScreen',
      containers: formatContainers({
        idBoard,
        idOrganization: idOrg,
        workspaceId: idOrg,
      }),
    });

    showDialog();
  }, [idBoard, idOrg, showDialog]);

  return (
    <>
      <SpotlightManager blanketIsTinted>
        <SpotlightTarget name="board-share-button">
          <button
            title={intl.formatMessage({
              id: 'templates.board_share_button.share-board',
              defaultMessage: 'Share board',
              description: 'Share board',
            })}
            className={classNames({
              [styles.boardShareButton]: true,

              [styles.embedded]: isEmbedded,
            })}
            data-testid={getTestId<BoardHeaderTestIds>('board-share-button')}
            onClick={openBoardShareModal}
          >
            {!isEmbedded && (
              <div className={styles.personAddIconContainer}>
                <PersonAddIcon
                  label={intl.formatMessage({
                    id: 'templates.board_share_button.share-board',
                    defaultMessage: 'Share board',
                    description: 'Share board',
                  })}
                  color="currentColor"
                />
              </div>
            )}
            <span className={styles.boardShareButtonText}>
              <FormattedMessage
                id="templates.board_share_button.share"
                defaultMessage="Share"
                description="Share"
              />
            </span>
            {accessRequests && accessRequests.length > 0 && (
              <span className={styles.accessRequestsBadgeContainer}>
                <Badge appearance="important">{accessRequests.length}</Badge>
              </span>
            )}
          </button>
        </SpotlightTarget>
        <SpotlightTransition>
          {isSpotlightActive && (
            <Spotlight
              target="board-share-button"
              targetRadius={4}
              key="board-share-button"
              dialogPlacement="right top"
              actions={[
                {
                  appearance: 'default',
                  onClick: handleSpotlightOpenShareModal,
                  // TODO: i18n
                  text: 'See request',
                },
                {
                  appearance: 'subtle',
                  onClick: handleDismissSpotlightClick,
                  // TODO: i18n
                  text: 'Dismiss',
                },
              ]}
            >
              {/* TODO: i18n */}
              <h4>Someone wants to join this board!</h4>
              {/* TODO: i18n */}
              See all of this board's members and join requests in the share
              menu.
            </Spotlight>
          )}
        </SpotlightTransition>
      </SpotlightManager>
      {isDialogOpen && (
        <Dialog className={styles.inviteDialog} {...dialogProps}>
          <LazyBoardInviteModal
            idBoard={idBoard}
            idOrg={idOrg}
            onClose={hideDialog}
            startingTab={startingTab}
          />
        </Dialog>
      )}
    </>
  );
};
