import {
  getMembershipTypeFromOrganization,
  isAdminOfOrganization,
} from '@trello/business-logic/organization';
import { Entitlements } from '@trello/entitlements';
import type { Board, Member } from '@trello/model-types';

import { getMembership } from '../membership/getMembership';
import type { MemberType } from './memberType.types';

/**
 * Returns board admins. Has an `implicitAdmin` option that lets you decide whether you want to count
 * premium and enterprise workspace admins as board admins.
 * Disable implicitAdmin if you don't want enterprise admins and workspace
 * admins to be automatically counted as board admins if workspace is premium or enterprise.
 */
export const getMemberTypeFromBoard = (
  member: Pick<Member, 'id' | 'idPremOrgsAdmin' | 'memberType'> & {
    idEnterprisesAdmin?: string[] | null;
  },
  board: {
    memberships: Pick<
      Board['memberships'][number],
      'deactivated' | 'idMember' | 'memberType' | 'unconfirmed'
    >[];
  },
  organization:
    | (Pick<Board['organization'], 'id' | 'offering'> & {
        memberships: (Pick<
          Board['organization']['memberships'][number],
          'deactivated' | 'idMember' | 'memberType' | 'unconfirmed'
        > & {
          id?: string;
        })[];
        enterprise?: {
          id?: Board['organization']['enterprise']['id'];
          idAdmins?: Board['organization']['enterprise']['idAdmins'];
        } | null;
      })
    | null
    | undefined,
  implicitAdmin = true,
): MemberType => {
  if (member.memberType === 'ghost') {
    return 'pending';
  }

  // If the member is an admin of the board's workspace's enterprise, they are
  // implicitly an admin of the board
  if (
    implicitAdmin &&
    organization?.enterprise?.idAdmins?.includes(member.id)
  ) {
    return 'admin';
  }

  // If the member is an admin of the board's workspace, they are implicitly an
  // admin of the board if the workspace is premium
  if (
    implicitAdmin &&
    organization &&
    !Entitlements.isFree(organization.offering) &&
    isAdminOfOrganization(member, organization)
  ) {
    return 'admin';
  }

  const boardMembership = getMembership(board.memberships, member.id);

  if (boardMembership) {
    if (boardMembership.deactivated) {
      return 'deactivated';
    }

    if (boardMembership.unconfirmed) {
      return 'unconfirmed';
    }

    return boardMembership.memberType;
  }

  // Converted from app/scripts/models/internal/MembershipModel.ts getExplicitMemberType
  if (organization && getMembershipTypeFromOrganization(member, organization)) {
    return 'org';
  }

  return 'public';
};
