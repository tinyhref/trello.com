import { useMemo } from 'react';

import { adminHubBaseUrl } from '@trello/config';

import { useIsSiteAdmin } from './useIsSiteAdmin';
import { useJwmLinkOrganization } from './useJwmLinkOrganization';
import { useTenantOrgId } from './useTenantOrgId';

interface JwmInviteLinkNavData {
  adminhubInviteUrl: string | undefined;
  showInviteButton: boolean;
}

export const useJwmAdminhubInviteDeeplink = (
  orgId?: string,
): JwmInviteLinkNavData => {
  const data = useJwmLinkOrganization(orgId);
  const cloudId = data?.idCloud;
  const entityUrl = data?.entityUrl || undefined;

  const { loading, isSiteAdmin } = useIsSiteAdmin(cloudId);

  const online = !data?.inaccessible;
  const tenantOrgId = useTenantOrgId(cloudId ?? '');

  const linkData: JwmInviteLinkNavData = useMemo(() => {
    if (loading || !entityUrl || !orgId || !tenantOrgId) {
      return {
        showInviteButton: false,
        adminhubInviteUrl: undefined,
      };
    } else {
      // Don't show the invite button until it's confirmed the user is a site admin (loading is finished)
      const showInviteButton = isSiteAdmin && online;

      const adminhubInviteUrl = `${adminHubBaseUrl}/o/${tenantOrgId}/users?status=ACTIVE`;

      return {
        showInviteButton,
        adminhubInviteUrl,
      };
    }
  }, [loading, entityUrl, isSiteAdmin, orgId, tenantOrgId, online]);

  return linkData;
};
