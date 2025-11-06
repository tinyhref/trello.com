import { useMemo } from 'react';

import { useTenantOrgIdQuery } from './TenantOrgIdQuery.generated';

export const useTenantOrgId = (cloudId: string): string | null => {
  const { data: tenantContexts, loading } = useTenantOrgIdQuery({
    variables: { cloudIds: [cloudId] },
    waitOn: ['None'],
    skip: !cloudId,
  });

  const orgId = useMemo(() => {
    const contexts = tenantContexts?.tenantContexts;
    if (loading || !contexts || contexts.length === 0 || !contexts[0]?.orgId) {
      return null;
    }

    return contexts[0]?.orgId ?? null;
  }, [loading, tenantContexts?.tenantContexts]);

  return orgId;
};
