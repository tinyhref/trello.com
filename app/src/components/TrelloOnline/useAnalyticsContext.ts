import { useCallback, useEffect } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { useFeatureGate } from '@trello/feature-gate-client';
import { useSharedStateSelector } from '@trello/shared-state';
import { addUFOCustomData } from '@trello/ufo';
import { workspaceState } from '@trello/workspace-state';

import { getDefaultAnalyticsContext } from 'app/src/defaultAnalyticsContext';
import { useMemberContextData } from './useMemberContextData';
import { useOrgContextData } from './useOrgContextData';

export const useAnalyticsContext = () => {
  const workspaceId = useSharedStateSelector(
    workspaceState,
    useCallback((state) => state.workspaceId, []),
  );
  const memberData = useMemberContextData();
  const orgData = useOrgContextData(workspaceId);

  useEffect(() => {
    Analytics.clearContext('organization');
    Analytics.clearContext('workspace');
  }, [workspaceId]);

  // evaluating here so that when it changes, the context is updated
  const { value: hasPersonalProductivity, loading: personalProdGateLoading } =
    useFeatureGate('trello_personal_productivity_release');

  useEffect(() => {
    const newContext = getDefaultAnalyticsContext({
      member: memberData?.member,
      organization: orgData?.organization,
      workspace: orgData?.organization, //we should use orgData until a workspace exists to query with GraphQL
    });
    Analytics.setContext(newContext);
    addUFOCustomData({ maxPaidStatus: newContext.member?.maxPaidStatus });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberData?.member?.id, orgData?.organization?.id]);

  useEffect(() => {
    if (!personalProdGateLoading) {
      Analytics.setHasPersonalProductivity(hasPersonalProductivity);
    }
  }, [hasPersonalProductivity, personalProdGateLoading]);
};
