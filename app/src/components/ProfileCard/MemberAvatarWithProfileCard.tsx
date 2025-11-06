import type { FunctionComponent, MouseEvent, MouseEventHandler } from 'react';
import { useCallback } from 'react';
import { useContextSelector } from 'use-context-selector';

import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { mergeRefs } from '@trello/dom-hooks';
import { useBoardId } from '@trello/id-context';
import { MemberAvatar } from '@trello/member-avatar';
import { Popover, usePopover } from '@trello/nachos/popover';
import type { TestId } from '@trello/test-ids';

import { BoardMembersContext } from 'app/src/components/BoardMembersContext';
import { useCanEditBoard } from 'app/src/components/BoardPermissionsContext';
import { LazyCardProfileCard } from './LazyCardProfileCard';

interface MemberAvatarWithProfileCardProps {
  memberId: string;
  /**
   * Whether to show the remove member option in the profile card.
   * @default true
   */
  isRemoveMemberOptionEnabled?: boolean;
  onHide?: () => void;
  onShow?: () => void;
  size?: number;
  tabIndex?: number;
  testId?: TestId;
  cardId: string;
  listId?: string;
  avatarRef?: React.Ref<HTMLElement>;
}

export const MemberAvatarWithProfileCard: FunctionComponent<
  MemberAvatarWithProfileCardProps
> = ({
  memberId,
  isRemoveMemberOptionEnabled = true,
  onHide,
  onShow,
  size,
  tabIndex = -1,
  testId,
  cardId,
  listId,
  avatarRef,
}) => {
  const boardId = useBoardId();

  const isDeactivated = useContextSelector(
    BoardMembersContext,
    useCallback((value) => value.isMemberDeactivated(memberId), [memberId]),
  );
  const canEditBoard = useCanEditBoard();

  const { triggerRef, popoverProps, toggle, hide } = usePopover<HTMLDivElement>(
    { onShow, onHide },
  );

  const onClose = useCallback<MouseEventHandler>(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      hide();
    },
    [hide],
  );

  const onClickMemberAvatar = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();

      toggle();

      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'member',
        source: 'cardView',
        containers: formatContainers({ cardId, boardId, listId }),
      });
    },
    [cardId, boardId, listId, toggle],
  );

  return (
    <>
      <MemberAvatar
        avatarRef={mergeRefs(triggerRef, avatarRef)}
        deactivated={isDeactivated}
        idMember={memberId}
        onClick={onClickMemberAvatar}
        size={size}
        tabIndex={tabIndex}
        testId={testId}
        ariaExpanded={popoverProps.isVisible}
      />

      <Popover {...popoverProps} noVerticalPadding>
        <LazyCardProfileCard
          onClose={onClose}
          cardId={cardId}
          boardId={boardId}
          listId={listId}
          memberId={memberId}
          canRemoveMember={isRemoveMemberOptionEnabled && canEditBoard}
        />
      </Popover>
    </>
  );
};
