import { useMemo } from 'react';

import { useHasEligibleWorkspaces } from './useHasEligibleWorkspaces';

export const useHasNoPaidWorkspaces = () => {
  const { isEligible: hasEligibleStandardOrPremiumWorkspaces } =
    useHasEligibleWorkspaces({
      entitlementRequired: 'standardOrPremium',
      treatFreeTrialAsFree: true,
    });
  const { isEligible: hasEligibleEnterpriseWorkspaces } =
    useHasEligibleWorkspaces({
      entitlementRequired: 'enterprise',
      treatFreeTrialAsFree: true,
    });
  const hasNoPaidWorkspaces = useMemo(
    () =>
      !hasEligibleStandardOrPremiumWorkspaces &&
      !hasEligibleEnterpriseWorkspaces,
    [hasEligibleStandardOrPremiumWorkspaces, hasEligibleEnterpriseWorkspaces],
  );
  return {
    hasNoPaidWorkspaces,
  };
};
