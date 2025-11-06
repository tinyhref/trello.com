import { useCallback, useEffect } from 'react';

import { tenantType } from '@atlassiansox/analytics-web-client';
import { Analytics } from '@trello/atlassian-analytics';
import { isMemberLoggedIn } from '@trello/authentication';
import { useSharedStateSelector } from '@trello/shared-state';
import { workspaceState } from '@trello/workspace-state';

export const useAnalyticsTenant = (): void => {
  const workspaceId = useSharedStateSelector(
    workspaceState,
    useCallback((state) => state.workspaceId, []),
  );

  useEffect(() => {
    if (!isMemberLoggedIn()) {
      Analytics.setTenantInfo(tenantType.NONE);
      return;
    }

    if (workspaceId !== null) {
      Analytics.setTenantInfo(tenantType.TRELLO_WORKSPACE_ID, workspaceId);
    } else {
      Analytics.setTenantInfo(tenantType.NONE);
    }
  }, [workspaceId]);
};
