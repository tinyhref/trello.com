import { useMemo } from 'react';

import { isMemberLoggedIn, useMemberId } from '@trello/authentication';
import { isAdminOfBoard as isMemberBoardAdminHelper } from '@trello/business-logic/board';
import {
  canSetVisibilityOnBoard,
  isAdminOfOrganization,
} from '@trello/business-logic/organization';
// eslint-disable-next-line no-restricted-imports
import type { Board_Prefs_PermissionLevel } from '@trello/graphql/generated';

import { useBoardVisibilityMemberQuery } from './BoardVisibilityMemberQuery.generated';
import { useBoardVisibilityOrganizationQuery } from './BoardVisibilityOrganizationQuery.generated';
import { useBoardVisibilityPermissionsQuery } from './BoardVisibilityPermissionsQuery.generated';

interface Args {
  orgId?: string | null;
  boardId?: string | null;
  skip?: boolean;
}

/**
 * Compares the board's visibility with the workspace's board visibility settings
 */
export const useBoardVisibility = ({ orgId, boardId, skip }: Args) => {
  const memberId = useMemberId();
  const { data: boardData, loading: boardDataLoading } =
    useBoardVisibilityPermissionsQuery({
      variables: {
        boardId: boardId || '',
      },
      skip: skip || !boardId,
      waitOn: ['CurrentBoardInfo'],
    });

  const { data: memberData, loading: memberDataLoading } =
    useBoardVisibilityMemberQuery({
      variables: {
        memberId,
      },
      skip: skip || !isMemberLoggedIn(),
      waitOn: ['MemberHeader'],
    });

  const { data: orgData, loading: orgDataLoading } =
    useBoardVisibilityOrganizationQuery({
      variables: {
        orgId: orgId || '',
      },
      skip: skip || !orgId,
      waitOn: ['MemberHeader', 'MemberBoards'],
    });

  const boardVisibility = boardData?.board?.prefs?.permissionLevel || null;
  const boardIsTemplate = boardData?.board?.prefs?.isTemplate || null;
  const organization = orgData?.organization;
  const restrictions = organization?.prefs?.boardVisibilityRestrict as Record<
    Board_Prefs_PermissionLevel,
    string
  >;

  const userIsBoardAdmin = useMemo(() => {
    if (memberData?.member && boardData?.board) {
      return isMemberBoardAdminHelper(
        memberData?.member,
        boardData?.board,
        true,
      );
    } else {
      return false;
    }
  }, [boardData?.board, memberData?.member]);

  const userIsWorkspaceAdmin = useMemo(() => {
    if (memberData?.member && organization) {
      return isAdminOfOrganization(memberData?.member, organization);
    } else {
      return false;
    }
  }, [organization, memberData?.member]);

  const workspaceHasEnterprise = !!organization?.idEnterprise;

  const workspaceRestrictsCurrentBoardVisibility =
    restrictions &&
    boardVisibility &&
    (restrictions[boardVisibility] === 'none' ||
      (restrictions[boardVisibility] === 'admin' && !userIsWorkspaceAdmin));

  const workspaceAllowsPrivateBoards =
    !organization ||
    canSetVisibilityOnBoard({
      org: organization,
      isOrgAdmin: userIsWorkspaceAdmin,
      boardVisibility: 'private',
    });
  const workspaceAllowsPublicBoards =
    !organization ||
    canSetVisibilityOnBoard({
      org: organization,
      isOrgAdmin: userIsWorkspaceAdmin,
      boardVisibility: 'public',
    });
  const workspaceAllowsWorkspaceVisibleBoards =
    !organization ||
    canSetVisibilityOnBoard({
      org: organization,
      isOrgAdmin: userIsWorkspaceAdmin,
      boardVisibility: 'org',
    });
  const workspaceAllowsEnterpriseVisibleBoards =
    !organization ||
    canSetVisibilityOnBoard({
      org: organization,
      isOrgAdmin: userIsWorkspaceAdmin,
      boardVisibility: 'enterprise',
    });

  const workspaceRestrictsAllBoardVisibilities =
    !!organization &&
    !workspaceAllowsPrivateBoards &&
    !workspaceAllowsPublicBoards &&
    !workspaceAllowsWorkspaceVisibleBoards &&
    !workspaceAllowsEnterpriseVisibleBoards;

  return {
    userIsBoardAdmin,
    userIsWorkspaceAdmin,
    boardVisibility,
    boardIsTemplate,
    loading: orgDataLoading || boardDataLoading || memberDataLoading,
    workspaceAllowsPrivateBoards,
    workspaceAllowsPublicBoards,
    workspaceAllowsWorkspaceVisibleBoards,
    workspaceAllowsEnterpriseVisibleBoards,
    workspaceRestrictsAllBoardVisibilities,
    workspaceRestrictsCurrentBoardVisibility,
    workspaceHasEnterprise,
  };
};
