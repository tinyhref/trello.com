import { useMemo } from 'react';

import { useMemberId } from '@trello/authentication';
import { Entitlements } from '@trello/entitlements';

import type { EligibleWorkspacesForProvisioningQuery } from './EligibleWorkspacesForProvisioningQuery.generated';
import { useEligibleWorkspacesForProvisioningQuery } from './EligibleWorkspacesForProvisioningQuery.generated';

export type EntitlementRequired = 'enterprise' | 'free' | 'standardOrPremium';

type Organization = NonNullable<
  NonNullable<EligibleWorkspacesForProvisioningQuery['member']>['organizations']
>[number];

const isWorkspaceFree = (organization: Pick<Organization, 'offering'>) =>
  organization.offering && Entitlements.isFree(organization.offering);

const isWorkspaceStandardOrPremium = (
  organization: Pick<Organization, 'offering'>,
) =>
  organization.offering &&
  (Entitlements.isStandard(organization.offering) ||
    Entitlements.isPremium(organization.offering));

const isWorkspaceEnterprise = (organization: Pick<Organization, 'offering'>) =>
  organization.offering && Entitlements.isEnterprise(organization.offering);

const isWorkspaceLinkedToJwmSite = (
  organization: Pick<Organization, 'jwmLink'>,
) => !!organization.jwmLink?.idCloud;

const isWorkspaceFreeTrial = (
  organization: Pick<Organization, 'paidAccount'>,
) => {
  if (organization.paidAccount?.trialType !== 'freeTrial') {
    return false;
  }
  const expiration = organization.paidAccount?.trialExpiration;
  return expiration && new Date(expiration) > new Date();
};

const isWorkspaceInEnterprise = (
  organization: Pick<Organization, 'idEnterprise'>,
  enterpriseId?: string,
) => {
  if (!enterpriseId) {
    return true;
  }
  return organization.idEnterprise === enterpriseId;
};
const isWorkspaceEligible = ({
  organization,
  entitlementRequired,
  enterpriseId,
  treatFreeTrialAsFree,
}: {
  organization: Organization;
  entitlementRequired?: EntitlementRequired;
  enterpriseId?: string;
  treatFreeTrialAsFree?: boolean;
}) => {
  switch (entitlementRequired) {
    case 'free':
      return (
        (isWorkspaceFree(organization) ||
          (treatFreeTrialAsFree && isWorkspaceFreeTrial(organization))) &&
        !isWorkspaceLinkedToJwmSite(organization)
      );
    case 'standardOrPremium':
      return (
        isWorkspaceStandardOrPremium(organization) &&
        (treatFreeTrialAsFree ? !isWorkspaceFreeTrial(organization) : true) &&
        !isWorkspaceLinkedToJwmSite(organization)
      );
    case 'enterprise':
      return (
        isWorkspaceEnterprise(organization) &&
        (treatFreeTrialAsFree ? !isWorkspaceFreeTrial(organization) : true) &&
        !isWorkspaceLinkedToJwmSite(organization) &&
        isWorkspaceInEnterprise(organization, enterpriseId)
      );
    default:
      return (
        !isWorkspaceEnterprise(organization) &&
        !isWorkspaceLinkedToJwmSite(organization)
      );
  }
};

export type EligibleWorkspaceOptions = Array<{
  id: string;
  displayName: string;
}>;

/**
 * Derives eligible workspace options for the provisioning and linking flow.
 *
 * Users with multiple eligible workspaces are presented with a workspace
 * selector in the site creation screen, indicating which Trello workspace
 * should be linked to the created JWM site.
 *
 * This hook populates the values for the workspace selector in CFFE, which are
 * represented as `id` and `displayName`.
 */
export const useEligibleWorkspacesForProvisioning = ({
  workspaceId,
  entitlementRequired,
  enterpriseId,
  treatFreeTrialAsFree,
}: {
  workspaceId?: string;
  entitlementRequired?: EntitlementRequired;
  enterpriseId?: string;
  treatFreeTrialAsFree?: boolean;
} = {}): EligibleWorkspaceOptions => {
  const memberId = useMemberId();
  const { data } = useEligibleWorkspacesForProvisioningQuery({
    variables: { memberId },
    waitOn: ['MemberHeader'],
  });
  const organizations = data?.member?.organizations;

  return useMemo(() => {
    if (!organizations?.length) {
      return [];
    }
    if (workspaceId) {
      const currentWorkspace = organizations.find(
        (organization) => organization.id === workspaceId,
      );

      // Hide all touchpoints for users that are not members of the current workspace (1)
      // or that are a member of an ineligible workspace (2)

      // 1. If the workspaceId is not found in the list of organizations,
      // it means the user is not a member of that workspace (ie. a guest).
      if (!currentWorkspace) {
        return [];
      }

      // 2. If the current workspace is ineligible, use this layer as a redundancy
      // to essentially disqualify all workspaces from being eligible, in effect
      // hiding touchpoints. This is a bit undesirable, and we should eventually
      // move this logic up into a different part of the eligibility evaluation.
      if (
        !isWorkspaceEligible({
          organization: currentWorkspace,
          entitlementRequired,
          enterpriseId,
          treatFreeTrialAsFree,
        })
      ) {
        return [];
      }
    }

    return organizations
      .filter((organization) =>
        isWorkspaceEligible({
          organization,
          entitlementRequired,
          enterpriseId,
          treatFreeTrialAsFree,
        }),
      )
      .map(({ id, displayName }) => ({ id, displayName }));
  }, [
    organizations,
    workspaceId,
    entitlementRequired,
    enterpriseId,
    treatFreeTrialAsFree,
  ]);
};
