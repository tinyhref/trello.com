import type { Member } from '@trello/model-types';

export const isAdminOfEnterprise = (
  member: Pick<Member, 'idEnterprisesAdmin'>,
  idEnterprise: string,
): boolean => {
  return !!member?.idEnterprisesAdmin?.includes(idEnterprise);
};
