import type { FunctionComponent } from 'react';
import { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { useMemberId } from '@trello/authentication';
import { DynamicButton } from '@trello/dynamic-tokens';
import { intl } from '@trello/i18n';
import { getScreenFromUrl } from '@trello/marketing-screens';
import { Tooltip } from '@trello/nachos/tooltip';

import { useBoardJoinButtonAddMemberMutation } from './BoardJoinButtonAddMemberMutation.generated';
import { useBoardJoinButton } from './useBoardJoinButton';

import * as styles from './BoardJoinButton.module.less';

interface BoardJoinButtonProps {
  boardId: string;
  workspaceId?: string;
}

export const BoardJoinButton: FunctionComponent<BoardJoinButtonProps> = ({
  boardId,
  workspaceId,
}) => {
  const memberId = useMemberId();

  // Used to optimistically hide button between click and when the query data is updated.
  const [hideButton, setHideButton] = useState(false);

  const [addMember] = useBoardJoinButtonAddMemberMutation();

  const { confirmed, memberType } = useBoardJoinButton({ boardId });

  const onClick = useCallback(async () => {
    if (!memberId) return;

    const traceId = Analytics.startTask({
      taskName: 'edit-board/members/join',
      source: 'boardScreen',
    });

    setHideButton(true);

    try {
      await addMember({
        variables: {
          boardId,
          member: { id: memberId },
          type: memberType,
          acceptUnconfirmed: true,
          allowBillableGuest: true,
          traceId,
        },
      });

      Analytics.sendTrackEvent({
        action: 'added',
        actionSubject: 'member',
        actionSubjectId: memberId,
        source: getScreenFromUrl(),
        containers: formatContainers({
          boardId,
          organizationId: workspaceId,
          workspaceId,
        }),
        attributes: {
          addedTo: 'board',
          confirmed,
          memberType,
          taskId: traceId,
          // add prop for Trello Invite From Slack project
          // source: member.source,
        },
      });
      Analytics.taskSucceeded({
        taskName: 'edit-board/members/join',
        source: 'boardScreen',
        traceId,
      });
    } catch (e) {
      Analytics.taskFailed({
        taskName: 'edit-board/members/join',
        source: 'boardScreen',
        traceId,
        error: e,
      });
    }
  }, [addMember, boardId, confirmed, memberId, memberType, workspaceId]);

  if (hideButton) {
    return null;
  }

  return (
    <Tooltip
      content={
        <FormattedMessage
          id="templates.board_header.workspace-members-can-join-this-board"
          defaultMessage="Workspace members can join this board."
          description="When a workspace member tries to join this board, they will be able to do so."
        />
      }
    >
      <DynamicButton
        onClick={onClick}
        className={styles.joinButton}
        aria-label={intl.formatMessage({
          id: 'templates.board_header.join-board',
          defaultMessage: 'Join board',
          description: 'Button that members can click on to join the board',
        })}
      >
        <FormattedMessage
          id="templates.board_header.join-board"
          defaultMessage="Join board"
          description="Button that members can click on to join the board"
        />
      </DynamicButton>
    </Tooltip>
  );
};
