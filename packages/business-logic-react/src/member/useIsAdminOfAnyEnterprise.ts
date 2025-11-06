import { isAdminOfAnyEnterprise } from '@trello/business-logic/member';

import { useIsAdminOfAnyEnterpriseFragment } from './IsAdminOfAnyEnterpriseFragment.generated';

export const useIsAdminOfAnyEnterprise = (
  idMember?: string | null,
): boolean => {
  const { data: member } = useIsAdminOfAnyEnterpriseFragment({
    from: {
      id: idMember,
    },
  });
  if (!member) {
    return false;
  }
  return isAdminOfAnyEnterprise(member, member?.organizations);
};
