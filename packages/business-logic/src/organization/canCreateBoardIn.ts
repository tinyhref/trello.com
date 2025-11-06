import { isPaidManagedEnterpriseMember } from '@trello/business-logic/member';
import { Entitlements } from '@trello/entitlements';
import type { Member } from '@trello/model-types';

export const canCreateBoardIn = (
  organization: {
    offering: string;
  },
  member: {
    confirmed?: boolean;
    idEnterprise?: string | null;
    enterpriseLicenses?:
      | Pick<Member['enterpriseLicenses'][number], 'idEnterprise' | 'type'>[]
      | null;
  },
) => {
  return (
    !organization ||
    !isPaidManagedEnterpriseMember(member) ||
    (organization !== null
      ? Entitlements.isEnterprise(organization.offering)
      : undefined)
  );
};
