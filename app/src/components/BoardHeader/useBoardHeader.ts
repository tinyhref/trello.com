import { useMemo } from 'react';

import { useMemberId } from '@trello/authentication';
import { useBoardMembers } from '@trello/business-logic-react/board';
import { checkIsTemplate } from '@trello/business-logic/board';
import { useBoardId } from '@trello/id-context';
import type {
  Board_PermissionLevel,
  PremiumFeatures,
} from '@trello/model-types';

import { useNativeBoardQuickloadAndSubscription } from 'app/src/components/App/useNativeBoardQuickloadAndSubscription';
import { useBoardHeaderFragment } from './BoardHeaderFragment.generated';
import { useTrelloBoardHeaderFragment } from './TrelloBoardHeaderFragment.generated';

export const useBoardHeader = () => {
  const nativeQuickloadAndSubscriptionsEnabled =
    useNativeBoardQuickloadAndSubscription();
  const memberId = useMemberId();

  const nativeBoardId = useBoardId(true);
  const boardId = useBoardId();

  const { data: boardData } = useBoardHeaderFragment({
    from: {
      id: boardId,
    },
  });

  const { data: nativeBoardData } = useTrelloBoardHeaderFragment({
    from: {
      id: nativeBoardId,
    },
  });

  const { isMemberOfOrganization, isAdmin, getMemberType } =
    useBoardMembers(boardId);

  const isBoardAdmin = isAdmin(memberId);
  const isBoardMember = getMemberType(memberId) === 'normal' || isBoardAdmin;
  const isWorkspaceMember = isMemberOfOrganization(memberId);

  const workspaceId =
    (nativeQuickloadAndSubscriptionsEnabled
      ? nativeBoardData?.workspace?.objectId
      : boardData?.idOrganization) ?? '';

  const enterpriseId =
    (nativeQuickloadAndSubscriptionsEnabled
      ? nativeBoardData?.enterprise?.objectId
      : boardData?.idEnterprise) ?? '';

  const boardHeaderData = nativeQuickloadAndSubscriptionsEnabled
    ? nativeBoardData
    : boardData;
  const prefs = boardHeaderData?.prefs;

  const isClosed = boardHeaderData?.closed ?? false;

  const isSubscribed = nativeQuickloadAndSubscriptionsEnabled
    ? nativeBoardData?.viewer?.subscribed
    : boardData?.subscribed;

  const isTemplate = checkIsTemplate({
    isTemplate: prefs?.isTemplate ?? false,
    permissionLevel:
      prefs?.permissionLevel?.toLowerCase() as Board_PermissionLevel,
    premiumFeatures: boardHeaderData?.premiumFeatures as PremiumFeatures,
  });

  const canInviteMembers = useMemo(() => {
    // If member isn't in workspace, they cannot invite others if the workspace has restricted invites
    if (!isWorkspaceMember && !prefs?.canInvite) {
      return false;
    }

    if (prefs?.invitations === 'admins' && !isBoardAdmin) {
      return false;
    }

    return isBoardAdmin || (prefs?.invitations === 'members' && isBoardMember);
  }, [
    isBoardAdmin,
    isBoardMember,
    isWorkspaceMember,
    prefs?.canInvite,
    prefs?.invitations,
  ]);

  return {
    boardId,
    nativeBoardId,
    workspaceId,
    enterpriseId,
    isClosed,
    isSubscribed,
    isTemplate,
    isBoardAdmin,
    isBoardMember,
    isWorkspaceMember,
    canInviteMembers,
  };
};
