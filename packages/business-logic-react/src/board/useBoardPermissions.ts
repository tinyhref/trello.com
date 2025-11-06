import { isMemberLoggedIn } from '@trello/authentication';
import { isWorkspaceReadOnly } from '@trello/business-logic/organization';
import { Entitlements, PremiumFeatures } from '@trello/entitlements';

import { useBoardCommentPermissionsFragment } from './BoardCommentPermissionsFragment.generated';
import { useBoardOrganizationCommentPermissionsFragment } from './BoardOrganizationCommentPermissionsFragment.generated';
import { useBoardMembers } from './useBoardMembers';

interface Options {
  boardId: string;
}

interface BoardPermissions {
  canComment: (idMember: string) => boolean;
  canVote: (idMember: string) => boolean;
  canEdit: (idMember: string) => boolean;
  isTemplate: () => boolean;
}

export const useBoardPermissions = ({ boardId }: Options): BoardPermissions => {
  const {
    isAdmin,
    isMember,
    getMemberType,
    isMemberOfOrganization,
    isAdminOfOrganization,
  } = useBoardMembers(boardId);

  const { data: board } = useBoardCommentPermissionsFragment({
    from: { id: boardId },
    optimistic: true,
  });

  const { data: boardOrg } = useBoardOrganizationCommentPermissionsFragment({
    from: { id: boardId },
    optimistic: true,
  });

  const offering = boardOrg?.organization?.offering;
  const status = boardOrg?.organization?.limits.orgs.usersPerFreeOrg.status;
  const isWorkspaceFree = Entitlements.isFree(offering);
  const isBoardReadOnly = isWorkspaceReadOnly(offering, status);

  const isBoardClosed = board?.closed ?? false;

  const isTemplate = () => {
    const isPublic = board?.prefs?.permissionLevel === 'public';
    if (!board?.prefs?.isTemplate) {
      return false;
    } else if (
      isPublic ||
      board?.premiumFeatures.includes(PremiumFeatures.privateTemplates)
    ) {
      return true;
    }

    return false;
  };

  const allowsSelfJoin = () => {
    return (board?.prefs?.selfJoin ?? false) && !isTemplate();
  };

  const memberMatchesSetting = (idMember: string, settingValue: string) => {
    const isMemberObserver = getMemberType(idMember) === 'observer';
    const isMemberOfBoard = isMember(idMember);
    switch (settingValue) {
      case 'public':
        return isMemberLoggedIn();
      case 'org':
        return (
          isMemberOfBoard ||
          isMemberOfOrganization(idMember) ||
          isMemberObserver
        );
      case 'observers':
        return isMemberOfBoard || isMemberObserver;
      case 'members':
        return isMemberOfBoard;
      default:
        return false;
    }
  };

  const isEditableByWorkspaceMember = (idMember: string) => {
    return (
      (!isWorkspaceFree && isAdminOfOrganization(idMember)) ||
      (allowsSelfJoin() && isMemberOfOrganization(idMember))
    );
  };

  const canComment = (idMember: string) => {
    const commentingPreference = board?.prefs?.comments;
    const isCommentingEnabled = commentingPreference !== 'disabled';

    if (isBoardReadOnly || isBoardClosed) {
      //if the workspace is read only or closed, no one can comment.
      return false;
    } else if (isAdmin(idMember)) {
      return isCommentingEnabled;
    } else if (isMemberLoggedIn()) {
      return (
        memberMatchesSetting(idMember, commentingPreference ?? '') ||
        (isEditableByWorkspaceMember(idMember) && isCommentingEnabled)
      );
    } else {
      return commentingPreference === 'public';
    }
  };

  const canVote = (idMember: string) => {
    const votingPreference = board?.prefs?.voting;
    const isVotingEnabled = votingPreference !== 'disabled';

    if (isBoardReadOnly || isBoardClosed) {
      //if the workspace is read only or closed, no one can vote.
      return false;
    } else if (isAdmin(idMember)) {
      return votingPreference !== 'disabled';
    } else if (isMemberLoggedIn()) {
      return (
        memberMatchesSetting(idMember, votingPreference ?? '') ||
        (isEditableByWorkspaceMember(idMember) && isVotingEnabled)
      );
    } else {
      return votingPreference === 'public';
    }
  };

  const canEdit = (idMember: string) => {
    if (isBoardReadOnly || isBoardClosed) {
      return false;
    }

    const memberType = getMemberType(idMember) ?? '';

    // If a board with observers belongs to a workspace that downgrades to
    // free, we should continue to respect the read-only permissions for the
    // observers even though now they are by default admins of the (free) workspace
    if (
      memberType === 'observer' &&
      (!isAdminOfOrganization(idMember) || isWorkspaceFree)
    ) {
      return false;
    }

    if (['admin', 'normal'].includes(memberType)) {
      return true;
    }

    return isEditableByWorkspaceMember(idMember);
  };

  return {
    canComment,
    canVote,
    canEdit,
    isTemplate,
  };
};
