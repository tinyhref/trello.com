import type { ApolloError } from '@apollo/client';
import { useMemo } from 'react';

import { useMemberId } from '@trello/authentication';
import { isDesktop } from '@trello/browser';
import {
  isAdminOfOrganization,
  type Credit,
} from '@trello/business-logic/organization';
import { Entitlements } from '@trello/entitlements';
import type { Organization } from '@trello/model-types';
import { needsCC } from '@trello/paid-account';

import { hasAlreadyUsedTrial } from 'app/src/components/FreeTrial/useStartFreeTrialForOrg';
import { useWorkspaceToUpgradeQuery } from './WorkspaceToUpgradeQuery.generated';

export interface EligibleWorkspaceToUpgrade
  extends Pick<Organization, 'displayName' | 'id' | 'name' | 'offering'> {
  logoHash?: string | null;
  memberships: { idMember: string }[];
  credits?: Credit[];
}

interface EligibleWorkspacesToUpgradeOptions {
  /**
   * Custom filter function to filter which workspaces are returned.
   * This will override the logic that filters out Premium workspaces
   * from the results, so it can be custom-tailored to the use case.
   */
  filter?: (workspace: EligibleWorkspaceToUpgrade) => boolean;
  skip?: boolean;
}

interface EligibleWorkspacesToUpgradeResponse {
  loading: boolean;
  error?: ApolloError;
  workspaces: EligibleWorkspaceToUpgrade[];
  allWorkspaces: EligibleWorkspaceToUpgrade[];
}

/**
 * Query all workspaces that the current member is eligible to upgrade
 * To be eligible:
 * - The member must be an admin of the workspace
 * - The workspace must not be an enterprise or premium PO workspace
 * - The workspace must not be in disabled standing
 *
 * By default, it will also filter out workspaces that have Premium,
 * so that it returns all workspaces that are on Free or Standard plans.
 * This can be customized by providing a custom `filter` option
 *
 * On Desktop it will also filter out workspaces that have already used
 * a free trial, since we only offer free trials on Desktop.
 */
export const useEligibleWorkspacesToUpgradeQuery = ({
  filter: customEligibilityFilter,
  skip,
}: EligibleWorkspacesToUpgradeOptions = {}): EligibleWorkspacesToUpgradeResponse => {
  const memberId = useMemberId();
  const { data, loading, error } = useWorkspaceToUpgradeQuery({
    variables: { memberId },
    skip,
    waitOn: ['MemberHeader', 'MemberBoards'],
  });

  const workspaces = useMemo(
    () =>
      (data?.member?.organizations ?? [])
        /**
         * Filter workspaces by eligibility, eliminating those that the user
         * is not an admin of, those that are externally billed, and those
         * in disabled standing
         */
        .filter((workspace) => {
          const isAdmin = Boolean(
            data?.member && isAdminOfOrganization(data.member, workspace),
          );
          const isEnterpriseOrPremiumPO =
            workspace.premiumFeatures?.includes('externallyBilled');
          const isDisabled = needsCC(workspace.paidAccount?.standing);
          return isAdmin && !isEnterpriseOrPremiumPO && !isDisabled;
        })
        /**
         * Filter workspaces by target offerings
         */
        .filter((workspace) => {
          if (customEligibilityFilter) {
            return customEligibilityFilter(workspace);
          }
          return !Entitlements.isPremium(workspace.offering);
        })
        /**
         * Filter out workspaces that have already used a free trial on Desktop
         */
        .filter((workspace) => {
          return !isDesktop() || !hasAlreadyUsedTrial(workspace.credits ?? []);
        }),
    [data, customEligibilityFilter],
  );

  return {
    workspaces,
    allWorkspaces: data?.member?.organizations ?? [],
    loading,
    error,
  };
};
