import cx from 'classnames';
import type { FunctionComponent, MouseEvent, Ref } from 'react';
import { useCallback, useMemo, useState } from 'react';

import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { useMemberId } from '@trello/authentication';
import { isEmbeddedInAtlassian } from '@trello/browser';
import { useBoardMembers } from '@trello/business-logic-react/board';
import { Entitlements } from '@trello/entitlements';
import { intl } from '@trello/i18n';
import { Dialog, useDialog } from '@trello/nachos/dialog';
import { Popover, PopoverScreen, usePopover } from '@trello/nachos/popover';
import type { BoardHeaderTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { useNativeGraphqlMigrationMilestone3 } from 'app/src/components/App/useNativeGraphqlMigrationMilestone3';
import { LazyBoardInviteModal } from 'app/src/components/BoardInviteModal';
import { Facepile } from 'app/src/components/Facepile';
import { LazyBoardProfileCard } from 'app/src/components/ProfileCard';
import { AddBoardMemberToWorkspace } from 'app/src/components/ProfileCard/AddBoardMemberToWorkspace';
import { stopPropagationAndPreventDefault } from 'app/src/stopPropagationAndPreventDefault';
import { Screens } from './BoardFacepile.types';
import { useBoardFacepileBoardFragment } from './BoardFacepileFragment.generated';
import { BoardMembersScreen } from './BoardMembersScreen';
import { useTrelloBoardFacepileBoardFragment } from './TrelloBoardFacepileFragment.generated';
import { useOrderedFacepileMemberships } from './useOrderedFacepileMemberships';
import { useRenderAvatar } from './useRenderAvatar';

import * as styles from './BoardFacepile.module.less';

export interface BoardFacepileProps {
  boardId: string;
  nativeBoardId: string;
  renderingInMenu?: boolean;
}

export const BoardFacepileUnconnected: FunctionComponent<{
  idBoard: string;
  isFreeWorkspace: boolean;
  showMoreRef: Ref<HTMLButtonElement>;
  onShowMoreClick: () => void;
  idMembers: string[];
  idOrganization: string;
  onClickMember: (idMember: string) => void;
  renderingInMenu?: boolean;
}> = ({
  idBoard,
  isFreeWorkspace,
  showMoreRef,
  onShowMoreClick,
  idMembers,
  idOrganization,
  onClickMember,
  renderingInMenu,
}) => {
  const { getMember, getMembership, isAdmin, isAdminOfOrganization } =
    useBoardMembers(idBoard);
  const renderAvatar = useRenderAvatar({
    mode: renderingInMenu ? 'popover' : 'facepile',
    idBoard,
    onClickMember,
    isFreeWorkspace,
    isAdminOfOrganization,
    isAdmin,
    isGhost: (idMember) => getMember(idMember)?.memberType === 'ghost',
    isDeactivated: (idMember) => getMembership(idMember)?.deactivated === true,
    getMember,
  });
  const isEmbedded = isEmbeddedInAtlassian();

  const maxFaceCount = useMemo(() => {
    if (isEmbedded) {
      return 2;
    } else {
      return 5;
    }
  }, [isEmbedded]);

  return (
    <Facepile
      className={cx({
        [styles.boardFacepile]: true,
      })}
      memberIds={idMembers}
      idOrganization={idOrganization}
      showProfileCards={true}
      maxFaceCount={maxFaceCount}
      renderAvatar={renderAvatar}
      onShowMoreClick={onShowMoreClick}
      showMoreRef={showMoreRef}
      showMoreTestId={getTestId<BoardHeaderTestIds>('board-facepile-show-more')}
      renderingInMenu={renderingInMenu}
    />
  );
};

export const BoardFacepile: FunctionComponent<BoardFacepileProps> = ({
  boardId,
  nativeBoardId,
  renderingInMenu,
}) => {
  const shouldUseNativeGraphQL = useNativeGraphqlMigrationMilestone3();

  const idMember = useMemberId();
  const { isMemberOfOrganization, isAdmin, getMemberType } =
    useBoardMembers(boardId);

  const { data: board } = useBoardFacepileBoardFragment({
    from: { id: boardId },
    optimistic: true,
  });

  const { data: nativeBoard } = useTrelloBoardFacepileBoardFragment({
    from: {
      id: nativeBoardId,
    },
    optimistic: true,
  });

  const prefs = shouldUseNativeGraphQL ? nativeBoard?.prefs : board?.prefs;

  const idMembers = useOrderedFacepileMemberships(boardId);

  const {
    toggle: togglePopover,
    push,
    pop,
    hide: hidePopover,
    triggerRef,
    popoverProps,
  } = usePopover<HTMLButtonElement>({
    initialScreen: Screens.BoardMembersScreen,
  });

  const {
    show: showDialog,
    hide: hideDialog,
    isOpen: isDialogOpen,
    dialogProps,
  } = useDialog();

  const organizationId = shouldUseNativeGraphQL
    ? nativeBoard?.workspace?.objectId
    : board?.idOrganization;

  const idOrganization = useMemo(() => organizationId ?? '', [organizationId]);

  const renderBoardInviteModal = useCallback(
    (e: MouseEvent) => {
      stopPropagationAndPreventDefault(e);
      Analytics.sendClickedLinkEvent({
        linkName: 'inviteToBoardLinkV2',
        source: 'allBoardMembersInlineDialog',
        containers: formatContainers({
          idBoard: boardId,
          idOrganization,
        }),
      });

      showDialog();
      hidePopover();
    },
    [boardId, idOrganization, showDialog, hidePopover],
  );

  const [currentSelectedMemberId, setCurrentSelectedMemberId] = useState<
    string | null
  >(null);

  const onProfileBack = useCallback(() => {
    pop();
  }, [pop]);

  const onAddMemberToWorkspaceOverride = useCallback(() => {
    push(Screens.AddMemberToWorkspace);
  }, [push]);

  const onClickMember = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (idMember: string) => {
      setCurrentSelectedMemberId(idMember);
      push(Screens.BoardProfileCard);
    },
    [push],
  );

  const onClickMemberInMenu = useCallback(
    (memberId: string) => {
      !popoverProps.isVisible && togglePopover();
      popoverProps.currentScreen === Screens.BoardMembersScreen &&
        push(Screens.BoardProfileCard);
      setCurrentSelectedMemberId(memberId);
    },
    [popoverProps.currentScreen, popoverProps.isVisible, push, togglePopover],
  );

  const onShowMoreClickInMenu = useCallback(() => {
    !popoverProps.isVisible && togglePopover();
    pop(Infinity);
  }, [pop, popoverProps.isVisible, togglePopover]);

  const offering =
    (shouldUseNativeGraphQL
      ? nativeBoard?.workspace?.offering
      : board?.organization?.offering) ?? '';

  const isFreeWorkspace = Entitlements.isFree(offering);
  const canInviteMembers = useMemo(() => {
    // If member isn't in workspace, they cannot invite others if the workspace has restricted invites
    if (!isMemberOfOrganization(idMember) && !prefs?.canInvite) {
      return false;
    }

    if (prefs?.invitations === 'admins' && !isAdmin(idMember)) {
      return false;
    }

    return (
      isAdmin(idMember) ||
      (prefs?.invitations === 'members' && getMemberType(idMember) === 'normal')
    );
  }, [
    getMemberType,
    idMember,
    isAdmin,
    isMemberOfOrganization,
    prefs?.canInvite,
    prefs?.invitations,
  ]);

  if (!shouldUseNativeGraphQL && !board) {
    return null;
  }

  if (shouldUseNativeGraphQL && !nativeBoard) {
    return null;
  }

  return (
    <>
      <BoardFacepileUnconnected
        idBoard={boardId}
        isFreeWorkspace={isFreeWorkspace}
        showMoreRef={triggerRef}
        onShowMoreClick={
          renderingInMenu ? onShowMoreClickInMenu : togglePopover
        }
        idMembers={idMembers}
        idOrganization={idOrganization}
        onClickMember={renderingInMenu ? onClickMemberInMenu : onClickMember}
        renderingInMenu={renderingInMenu}
      />
      <Popover
        {...popoverProps}
        title={intl.formatMessage({
          id: 'templates.popover_board_header_all_members.board-members',
          defaultMessage: 'Board members',
          description:
            'Popover displaying all board members in the board header.',
        })}
      >
        <PopoverScreen id={Screens.BoardMembersScreen}>
          <BoardMembersScreen
            idBoard={boardId}
            idOrganization={idOrganization}
            renderBoardInviteModal={renderBoardInviteModal}
            onClickMember={onClickMember}
            canInviteMembers={canInviteMembers}
            isFreeWorkspace={isFreeWorkspace}
          />
        </PopoverScreen>
        <PopoverScreen
          id={Screens.BoardProfileCard}
          hideHeader
          noVerticalPadding
        >
          <LazyBoardProfileCard
            key="profile"
            onClose={togglePopover}
            onBack={onProfileBack}
            memberId={currentSelectedMemberId ?? ''}
            boardId={boardId}
            onAddMemberToWorkspaceOverride={onAddMemberToWorkspaceOverride}
          />
        </PopoverScreen>
        <PopoverScreen
          id={Screens.AddMemberToWorkspace}
          title={intl.formatMessage({
            id: 'templates.popover_board_header_all_members.add-to-workspace',
            defaultMessage: 'Add to Workspace',
            description:
              'Add all board members to the workspace in header popover.',
          })}
        >
          <AddBoardMemberToWorkspace
            onBack={onProfileBack}
            memberId={currentSelectedMemberId ?? ''}
            boardId={boardId}
          />
        </PopoverScreen>
      </Popover>
      {isDialogOpen && (
        <Dialog className={styles.inviteDialog} {...dialogProps}>
          <LazyBoardInviteModal
            idBoard={boardId}
            idOrg={idOrganization}
            onClose={hideDialog}
          />
        </Dialog>
      )}
    </>
  );
};
