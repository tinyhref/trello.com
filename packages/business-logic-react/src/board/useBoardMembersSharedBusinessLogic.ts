import { useCallback, useMemo } from 'react';

import { useMemberId } from '@trello/authentication';
import {
  canRemoveMember,
  getAdminBoardMembers,
  getExplicitAdminBoardMembers,
  getNormalBoardMembers,
} from '@trello/business-logic/board';
import { isEnterpriseAdmin } from '@trello/business-logic/enterprise';
import {
  getMembershipsMap,
  isMembershipAdmin,
} from '@trello/business-logic/membership';
import { isPremOrganizationAdmin } from '@trello/business-logic/organization';
import { inviteTokenForModel } from '@trello/invitation-tokens';

import type { BoardMembersFragment } from './BoardMembersFragment.generated';
import { useBoardMembersMemberFragment } from './BoardMembersMemberFragment.generated';

type Board = BoardMembersFragment;
type Member = BoardMembersFragment['members'][number];
type Membership = BoardMembersFragment['memberships'][number];

/**
 * Hook that provides a list of board members and memberships, as well
 * as utility functions for determining if a given user is a member of the board,
 * admin of the board, admin of the workspace, etc.
 */
export const useBoardMembersSharedBusinessLogic = ({
  board,
  idBoard,
}: {
  board: Board | null | undefined;
  idBoard: string;
}) => {
  const idCurrentMember = useMemberId();

  const { data: currentMember } = useBoardMembersMemberFragment({
    from: {
      id: idCurrentMember,
    },
    optimistic: true,
  });

  const idOrganization = board?.idOrganization ?? null;
  const idEnterprise = board?.idEnterprise ?? null;

  const members = useMemo(() => board?.members ?? [], [board?.members]);

  const memberships = useMemo(
    () => board?.memberships ?? [],
    [board?.memberships],
  );

  const organizationMemberships = useMemo(
    () => board?.organization?.memberships ?? [],
    [board?.organization?.memberships],
  );

  const membershipsMap = useMemo(
    () => getMembershipsMap(memberships),
    [memberships],
  );

  const organizationMembershipsMap = useMemo(
    () => getMembershipsMap(organizationMemberships),
    [organizationMemberships],
  );

  const membersMap = useMemo<Map<string, Member>>(() => {
    const map = new Map();
    members.forEach((member) => {
      map.set(member.id, member);
    });
    return map;
  }, [members]);

  /**
   * List of explicit admins, meaning members that have memberType === "admin".
   * This differs from admins because you can be an implicit admin on a board, meaning that
   * we will use the idPremOrgsAdmin and other fields to see if you have admin priviledges.
   */
  const explicitAdmins = useMemo(
    () => getExplicitAdminBoardMembers(members, membershipsMap),
    [members, membershipsMap],
  );

  /**
   * List of members with membership status of "normal"
   */
  const normals = useMemo(
    () => getNormalBoardMembers(members, membershipsMap),
    [members, membershipsMap],
  );

  /**
   * List of members with membership status of "admin" OR implicit admins.
   * You are an implicit admin if you have admin rights due to being the admin
   * of the boards organization.
   */
  const admins = useMemo(
    () => getAdminBoardMembers(members, membershipsMap, idOrganization),
    [members, membershipsMap, idOrganization],
  );

  /**
   * Get a board membership by member id
   */
  const getMembership = useCallback<
    (idMember: string) => Membership | undefined
  >(
    (idMember: string) => {
      const membership = membershipsMap.get(idMember);
      return membership;
    },
    [membershipsMap],
  );

  /**
   * Get a board member by member id
   */
  const getMember = useCallback<(idMember: string) => Member | undefined>(
    (idMember: string) => {
      const member = membersMap.get(idMember);
      return member;
    },
    [membersMap],
  );

  /**
   * Implicit admin check only available for the current authenticated member.
   * if there are an admin of the enterprise that owns the board, they have full
   * priviledges
   * if they are an admin of the organization that owns the board, they have full
   * priviledges
   */
  const isCurrentMemberImplicitAdmin = useCallback(() => {
    if (currentMember) {
      if (
        idEnterprise &&
        currentMember.idEnterprisesAdmin !== null &&
        isEnterpriseAdmin(currentMember, idEnterprise)
      ) {
        return true;
      } else if (
        idOrganization &&
        currentMember.idPremOrgsAdmin !== null &&
        isPremOrganizationAdmin(currentMember, idOrganization)
      ) {
        return true;
      }
    }
  }, [currentMember, idEnterprise, idOrganization]);

  /**
   * Determine if a given member id has admin priviledges.
   */
  const isAdmin = useCallback<(idMember: string) => boolean>(
    (idMember: string) => {
      if (idMember === idCurrentMember && isCurrentMemberImplicitAdmin()) {
        return true;
      }

      const membership = getMembership(idMember);
      const member = getMember(idMember);

      if (!membership || !member) {
        return false;
      }

      if (isMembershipAdmin(membership)) {
        return true;
      }

      /**
       * At this point, we are investigating a member of the board for
       * whether they are an implicit admin of the organization. If they
       * are, they have full priviledges.
       */
      return (
        !!idOrganization && isPremOrganizationAdmin(member, idOrganization)
      );
    },
    [
      idCurrentMember,
      isCurrentMemberImplicitAdmin,
      getMembership,
      getMember,
      idOrganization,
    ],
  );

  /**
   * Determine if a given member id is an explicit admin, meaning memberType "admin"
   * This differs from isAdmin because you can be an implicit admin on a board, meaning that
   * we will use the idPremOrgsAdmin and other fields to see if you have admin priviledges.
   */
  const isExplicitAdmin = useCallback(
    (idMember: string) => {
      const membership = getMembership(idMember);
      return membership && isMembershipAdmin(membership);
    },
    [getMembership],
  );

  /**
   * Determine if a given member id is a member on the board
   */
  const isMember = useCallback(
    (idMember: string) => {
      const membership = getMembership(idMember);
      return !!membership;
    },
    [getMembership],
  );

  /**
   * Check if the member is deactivated
   * @returns boolean
   */
  const isMemberDeactivated = useCallback(
    (idMember: string) => {
      const member = getMember(idMember);
      const membership = getMembership(idMember);
      return Boolean(membership?.deactivated || member?.activityBlocked);
    },
    [getMember, getMembership],
  );

  /**
   * Check if the member is a ghost member
   * @returns boolean
   */
  const isMemberGhost = useCallback(
    (idMember: string) => {
      return getMember(idMember)?.memberType === 'ghost';
    },
    [getMember],
  );

  /**
   * Get the memberType for a given member id
   * @returns "admin" "normal" "observer"
   */
  const getMemberType = useCallback(
    (idMember: string) => {
      const membership = getMembership(idMember);
      return membership?.memberType;
    },
    [getMembership],
  );

  /**
   * Get the member type from the boards organization, given a member id
   * @returns "admin" "normal" undefined
   */
  const getMemberTypeForOrganization = useCallback(
    (idMember: string) => {
      const membership = organizationMembershipsMap.get(idMember);
      return membership?.memberType;
    },
    [organizationMembershipsMap],
  );

  /**
   * Determine if the member is part of the boards organization
   */
  const isMemberOfOrganization = useCallback(
    (idMember: string) => {
      if (idMember === idCurrentMember && isCurrentMemberImplicitAdmin()) {
        return true;
      }

      const membership = organizationMembershipsMap.get(idMember);
      return !!membership;
    },
    [idCurrentMember, isCurrentMemberImplicitAdmin, organizationMembershipsMap],
  );

  /**
   * Determine if the member is an admin of the associated organization
   */
  const isAdminOfOrganization = useCallback(
    (idMember: string) => {
      if (idMember === idCurrentMember && isCurrentMemberImplicitAdmin()) {
        return true;
      }

      const membership = organizationMembershipsMap.get(idMember);
      return !!membership && isMembershipAdmin(membership);
    },
    [idCurrentMember, isCurrentMemberImplicitAdmin, organizationMembershipsMap],
  );

  /**
   * Determine if the given member id is a guest on the workspace/organization.
   * They are a guest if they are a member of the board, but not the workspace
   * that owns the board.
   */
  const isGuest = useCallback(
    (idMember: string) => {
      if (!idOrganization) {
        return false;
      }

      if (isMember(idMember) && !isMemberOfOrganization(idMember)) {
        return true;
      }

      return false;
    },
    [idOrganization, isMember, isMemberOfOrganization],
  );

  const getMemberPermissionLevel = useCallback(
    (idMember: string) => {
      const memberType = getMemberType(idMember);
      if (memberType === 'observer') {
        return 'observer';
      }

      if (memberType === 'normal' || memberType === 'admin') {
        return 'member';
      }

      const inviteToken = inviteTokenForModel(idBoard);
      if (inviteToken) {
        const memberIdFromToken = inviteToken.split('-')[0];
        if (memberIdFromToken === idMember && isMember(memberIdFromToken)) {
          return 'inviteToken';
        }
      }

      if (
        board?.prefs?.permissionLevel === 'private' &&
        (memberType === 'normal' ||
          memberType === 'admin' ||
          isAdminOfOrganization(idMember))
      ) {
        return 'private';
      }

      if (
        isMemberOfOrganization(idMember) &&
        board?.prefs?.permissionLevel === 'org'
      ) {
        return 'org';
      }

      if (board?.prefs?.permissionLevel === 'public') {
        return 'public';
      }

      if (idEnterprise) {
        if (
          board?.prefs?.permissionLevel === 'enterprise' &&
          currentMember?.id === idMember &&
          currentMember?.enterpriseLicenses?.some(
            (entLicense) => entLicense.idEnterprise === idEnterprise,
          )
        ) {
          return 'enterprise';
        }
      }

      return 'none';
    },
    [
      board?.prefs?.permissionLevel,
      currentMember?.enterpriseLicenses,
      currentMember?.id,
      getMemberType,
      idBoard,
      idEnterprise,
      isAdminOfOrganization,
      isMember,
      isMemberOfOrganization,
    ],
  );

  const canRemoveBoardMember = useCallback(
    (idTargetMember: string) => {
      const targetMember = getMember(idTargetMember);
      if (!board || !currentMember || !targetMember) {
        return false;
      }

      return canRemoveMember(
        currentMember,
        targetMember,
        board,
        board.organization,
      );
    },
    [currentMember, board, getMember],
  );

  const canDeleteCommentFromMember = useCallback(
    (idMember: string) => {
      // If it's the current members comment, they can delete.
      if (idMember === idCurrentMember) {
        return true;
      }

      // If the current member is an admin and the commenter is not, they can delete.
      // isAdmin handles checking for implicit admin permissions as well.
      if (isAdmin(idCurrentMember) && !isAdmin(idMember)) {
        return true;
      }

      return false;
    },
    [idCurrentMember, isAdmin],
  );

  return {
    admins,
    explicitAdmins,
    normals,
    members,
    memberships,
    getMembership,
    getMember,
    isAdmin,
    isMember,
    isMemberDeactivated,
    isMemberGhost,
    getMemberType,
    getMemberTypeForOrganization,
    isExplicitAdmin,
    isMemberOfOrganization,
    isAdminOfOrganization,
    isGuest,
    getMemberPermissionLevel,
    canRemoveBoardMember,
    canDeleteCommentFromMember,
  };
};
