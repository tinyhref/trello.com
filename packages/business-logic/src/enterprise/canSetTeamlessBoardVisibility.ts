import { Entitlements } from '@trello/entitlements';
import type { Enterprise, Member, Organization } from '@trello/model-types';

import { isWorkspaceAdmin } from './isWorkspaceAdmin';

export const canSetTeamlessBoardVisibility = (
  boardVisibility: 'enterprise' | 'org' | 'private' | 'public',
  member: Pick<Member, 'idEnterprisesAdmin' | 'idPremOrgsAdmin'> & {
    organizations: (Pick<Organization, 'id'> & {
      idEnterprise?: string | null;
    })[];
  },
  enterprise?: Pick<Enterprise, 'id' | 'offering'> & {
    organizationPrefs: {
      boardVisibilityRestrict?: {
        enterprise?: string | null;
        org?: string | null;
        private?: string | null;
        public?: string | null;
      } | null;
    } | null;
  },
) => {
  if (!enterprise) {
    return false;
  }

  if (Entitlements.isEnterprise(enterprise.offering)) {
    return true;
  }

  if (['org', 'enterprise'].includes(boardVisibility)) {
    return false;
  }

  const organizationPrefs = enterprise.organizationPrefs;
  const pref = organizationPrefs?.boardVisibilityRestrict?.[boardVisibility];

  return (
    !pref ||
    pref === 'org' ||
    (pref === 'admin' && isWorkspaceAdmin(member, enterprise.id))
  );
};
