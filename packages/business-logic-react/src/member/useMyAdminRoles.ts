import { useMemberId } from '@trello/authentication';

import type { MyAdminRolesFragment } from './MyAdminRolesFragment.generated';
import { useMyAdminRolesFragment } from './MyAdminRolesFragment.generated';

/**
 * Returns the member with properties related to the member's PremOrgs or Enterprise Admin
 * roles if applicable.
 */
export const useMyAdminRoles = (): { member?: MyAdminRolesFragment } => {
  const memberId = useMemberId();

  const { data } = useMyAdminRolesFragment({
    from: { id: memberId },
  });

  return { member: data ?? undefined };
};
