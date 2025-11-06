import type { MouseEvent as ReactMouseEvent, Ref } from 'react';
import { useCallback } from 'react';

import type { useBoardMembers } from '@trello/business-logic-react/board';
import {
  avatarsFromAvatarUrl,
  getNonPublicIfAvailable,
  type Avatars,
} from '@trello/business-logic/member';
import { ComponentWrapper } from '@trello/component-wrapper';
import { useFeatureGate } from '@trello/feature-gate-client';
import { MemberAvatarUnconnected } from '@trello/member-avatar';
import { Popover, usePopover } from '@trello/nachos/popover';
import {
  dangerouslyConvertPrivacyString,
  type PIIString,
} from '@trello/privacy';
import type { BoardHeaderTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { PopOver } from 'app/scripts/views/lib/PopOver';
import { LazyBoardProfileCard } from 'app/src/components/ProfileCard';

export interface MemberAvatarUnconnectedWithPopoverProps {
  className?: string;
  avatarClassName?: string;
  fullName?: PIIString | null;
  username?: PIIString;
  initials?: PIIString | null;
  size?: number;
  hoverable?: boolean;
  deactivated?: boolean;
  lightBackground?: boolean;
  boardAdmin?: boolean;
  isGhost?: boolean;
  workspaceAdmin?: boolean;
  isFreeWorkspace?: boolean;
  tabIndex?: number;
  avatarRef?: Ref<HTMLElement>;
  ariaExpanded?: boolean;

  idMember: string;
  mode: 'facepile' | 'popover';
  onClickMember: (idMember: string) => void;
  idBoard: string;
  testId: string;
  avatars?: Avatars;
}

const MemberAvatarUnconnectedWithPopover = ({
  fullName,
  username,
  initials,
  size,
  boardAdmin,
  isGhost,
  workspaceAdmin,
  deactivated,
  isFreeWorkspace,
  idMember,
  mode,
  onClickMember,
  idBoard,
  testId,
  avatars,
}: MemberAvatarUnconnectedWithPopoverProps) => {
  const { triggerRef, toggle, popoverProps } = usePopover<HTMLButtonElement>();

  const onCloseFacepileAvatar = useCallback(() => {
    toggle();
  }, [toggle]);

  const onClickFacepileAvatar = useCallback(() => {
    toggle();
  }, [toggle]);

  const onClickPopoverAvatar = useCallback(() => {
    onClickMember(idMember);
  }, [onClickMember, idMember]);

  const onClick =
    mode === 'facepile' ? onClickFacepileAvatar : onClickPopoverAvatar;

  return (
    <>
      <MemberAvatarUnconnected
        fullName={fullName}
        username={username}
        avatars={avatars}
        initials={initials}
        size={size}
        onClick={onClick}
        boardAdmin={boardAdmin}
        isGhost={isGhost}
        workspaceAdmin={workspaceAdmin}
        deactivated={deactivated}
        testId={testId}
        isFreeWorkspace={isFreeWorkspace}
        avatarRef={triggerRef}
      />
      <Popover {...popoverProps} noVerticalPadding>
        <LazyBoardProfileCard
          onClose={onCloseFacepileAvatar}
          memberId={idMember}
          boardId={idBoard}
        />
      </Popover>
    </>
  );
};

interface UseRenderAvatarProps {
  size?: number;
  /**
   *  mode changes the method in we use to render the BoardProfileCard,
   *  'facepile' will use the old PopOver component to toggle the BoardProfileCard on the facepile avatar directly
   *  'popover' will push the BoardProfileCard as a screen on the BoardMembersScreen popover
   * */
  mode?: 'facepile' | 'popover';
  onClickMember: (idMember: string) => void;
  idBoard: string;
  isFreeWorkspace: boolean;
  getMember: ReturnType<typeof useBoardMembers>['getMember'];
  isAdminOfOrganization: ReturnType<
    typeof useBoardMembers
  >['isAdminOfOrganization'];
  isAdmin: ReturnType<typeof useBoardMembers>['isAdmin'];
  isGhost: (idMember: string) => boolean;
  isDeactivated: (idMember: string) => boolean;
}

export const useRenderAvatar = ({
  size = 28,
  mode = 'facepile',
  onClickMember,
  getMember,
  idBoard,
  isFreeWorkspace,
  isAdmin,
  isAdminOfOrganization,
  isDeactivated,
  isGhost,
}: UseRenderAvatarProps): ((idMember: string) => JSX.Element) => {
  const { value: isDeprecatePopoverUseRenderAvatarEnabled } = useFeatureGate(
    'billplat_deprecate_popover_use_render_avatar',
  );

  const onCloseFacepileAvatar = useCallback(() => {
    PopOver.hide();
  }, []);

  return (idMember) => {
    const member = getMember(idMember);

    const onClickFacepileAvatar = (e: ReactMouseEvent) =>
      PopOver.toggle({
        elem: e.currentTarget,
        hideHeader: true,
        reactElement: (
          <ComponentWrapper key="profile">
            <LazyBoardProfileCard
              onClose={onCloseFacepileAvatar}
              memberId={idMember}
              boardId={idBoard}
            />
          </ComponentWrapper>
        ),
      });

    const onClickPopoverAvatar = () => {
      onClickMember(idMember);
    };

    const onClick =
      mode === 'facepile' ? onClickFacepileAvatar : onClickPopoverAvatar;
    const testId =
      mode === 'facepile'
        ? getTestId<BoardHeaderTestIds>('board-facepile-member')
        : getTestId<BoardHeaderTestIds>('board-facepile-popover-member');

    const avatarUrl = member && getNonPublicIfAvailable(member, 'avatarUrl');
    const avatars = avatarUrl
      ? avatarsFromAvatarUrl(dangerouslyConvertPrivacyString(avatarUrl))
      : undefined;

    if (isDeprecatePopoverUseRenderAvatarEnabled) {
      return (
        <MemberAvatarUnconnectedWithPopover
          fullName={member?.fullName}
          username={member?.username}
          initials={member?.initials}
          size={size}
          boardAdmin={isAdmin(idMember)}
          isGhost={isGhost(idMember)}
          workspaceAdmin={isAdminOfOrganization(idMember)}
          deactivated={isDeactivated(idMember)}
          isFreeWorkspace={isFreeWorkspace}
          idMember={idMember}
          mode={mode}
          onClickMember={onClickMember}
          testId={testId}
          idBoard={idBoard}
          avatars={avatars}
        />
      );
    }

    return (
      <MemberAvatarUnconnected
        fullName={member?.fullName}
        username={member?.username}
        avatars={avatars}
        initials={member?.initials}
        size={size}
        onClick={onClick}
        boardAdmin={isAdmin(idMember)}
        isGhost={isGhost(idMember)}
        workspaceAdmin={isAdminOfOrganization(idMember)}
        deactivated={isDeactivated(idMember)}
        testId={testId}
        isFreeWorkspace={isFreeWorkspace}
      />
    );
  };
};
