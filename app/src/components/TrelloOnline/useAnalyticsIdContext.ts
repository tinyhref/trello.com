import { useCallback, useEffect } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { useSharedStateSelector } from '@trello/shared-state';
import { workspaceState } from '@trello/workspace-state';

import { useEnterpriseContextData } from './useEnterpriseContextData';

export const useAnalyticsIdContext = () => {
  const workspaceId = useSharedStateSelector(
    workspaceState,
    useCallback((state) => state.workspaceId, []),
  );
  const enterprise = useEnterpriseContextData(workspaceId);

  useEffect(() => {
    Analytics.clearIdContext();
  }, [workspaceId]);

  useEffect(() => {
    if (!enterprise?.organization?.enterprise?.id) {
      return;
    }

    Analytics.setIdContext({
      enterprise: {
        id: enterprise.organization.enterprise.id,
      },
    });
  }, [enterprise?.organization?.enterprise?.id]);
};
