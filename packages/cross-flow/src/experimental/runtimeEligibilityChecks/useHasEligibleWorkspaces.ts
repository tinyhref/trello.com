import {
  type EligibleWorkspaceOptions,
  type EntitlementRequired,
  useEligibleWorkspacesForProvisioning,
} from '../useEligibleWorkspacesForProvisioning';
import type { RuntimeEligibilityCheckResult } from './RuntimeEligibilityCheck';

export const useHasEligibleWorkspaces = ({
  workspaceId,
  entitlementRequired,
  enterpriseId,
  treatFreeTrialAsFree,
}: {
  workspaceId?: string;
  entitlementRequired?: EntitlementRequired;
  enterpriseId?: string;
  treatFreeTrialAsFree?: boolean;
}): RuntimeEligibilityCheckResult<{
  eligibleWorkspaceOptions: EligibleWorkspaceOptions;
}> => {
  const eligibleWorkspaceOptions = useEligibleWorkspacesForProvisioning({
    workspaceId,
    entitlementRequired,
    enterpriseId,
    treatFreeTrialAsFree,
  });

  return {
    isEligible: eligibleWorkspaceOptions.length > 0,
    eligibleWorkspaceOptions,
  };
};
