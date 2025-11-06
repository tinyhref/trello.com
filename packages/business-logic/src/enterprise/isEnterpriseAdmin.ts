import type { Member } from '@trello/model-types';

/**
 * Determines if a member is an admin of an enterprise
 */
export const isEnterpriseAdmin = (
  member: Pick<Member, 'idEnterprisesAdmin'>,
  idEnterprise: string,
) => {
  return member.idEnterprisesAdmin.includes(idEnterprise);
};
