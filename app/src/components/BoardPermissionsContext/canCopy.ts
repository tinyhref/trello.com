import {
  allowsSelfJoin,
  canJoin,
  checkIsTemplate,
  isMemberOfBoard,
} from '@trello/business-logic/board';
import { isMemberOfOrganization } from '@trello/business-logic/organization';
import type {
  Board,
  Enterprise,
  Member,
  Organization,
} from '@trello/model-types';

export const canCopy = (
  member: Pick<
    Member,
    'confirmed' | 'id' | 'idEnterprisesAdmin' | 'idPremOrgsAdmin' | 'memberType'
  > & { idEnterprise?: string | null },
  board: Pick<Board, 'enterpriseOwned' | 'memberships' | 'premiumFeatures'> & {
    prefs?: Pick<
      Board['prefs'],
      'isTemplate' | 'permissionLevel' | 'selfJoin'
    > | null;
    memberships?:
      | Pick<Board['memberships'][number], 'id' | 'idMember' | 'memberType'>[]
      | null;
    organization?: Pick<Board['organization'], 'id'> | null;
    idEnterprise?: string | null;
  },
  workspace:
    | (Pick<Organization, 'id' | 'offering'> & {
        idEnterprise?: string | null;
        enterprise?: Pick<Organization['enterprise'], 'id'> | null;
        memberships: Pick<
          Organization['memberships'][number],
          'deactivated' | 'id' | 'idMember' | 'memberType' | 'unconfirmed'
        >[];
      })
    | null,
  enterprise: Pick<Enterprise, 'id' | 'idAdmins'> | null,
) => {
  const idEnterprise = board.idEnterprise;
  const enterpriseOwned = board.enterpriseOwned;
  const permissionLevel = board.prefs?.permissionLevel;

  const isPublic = board.prefs?.permissionLevel === 'public';
  const isTemplate = checkIsTemplate({
    isTemplate: board.prefs?.isTemplate,
    permissionLevel: board.prefs?.permissionLevel,
    premiumFeatures: board.premiumFeatures,
  });

  const isPublicTemplate = isPublic && isTemplate;
  const isNonMember =
    !isMemberOfBoard(board, member.id) &&
    !canJoin(member, board, workspace, enterprise);
  const isGuest =
    isMemberOfBoard(board, member.id) &&
    workspace &&
    !isMemberOfOrganization(member, workspace, enterprise);
  const isManagedEntMember =
    idEnterprise &&
    member.confirmed &&
    member.idEnterprise &&
    member.idEnterprise === idEnterprise;

  // Guests on Enterprise boards cannot copy them unless they are owned by the enterprise
  if (enterpriseOwned && isGuest && !isManagedEntMember) {
    return false;
    // If the board is self-joinable and has a permissionLevel of
    // `org` or `enterprise` visible, assume that they can copy the
    // board since they've gotten this far in loading the UI
  } else if (
    allowsSelfJoin(board) &&
    (permissionLevel === 'org' || permissionLevel === 'enterprise')
  ) {
    return true;
    // Non-members viewing a public Enterprise board cannot copy it unless it is also a template
  } else if (
    enterpriseOwned &&
    isNonMember &&
    !isManagedEntMember &&
    !isPublicTemplate
  ) {
    return false;
    // Allow copy in all other circumstances
  } else {
    return true;
  }
};
