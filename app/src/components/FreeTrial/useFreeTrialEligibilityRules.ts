import { addDays, isAfter } from 'date-fns';
import { useCallback, useMemo } from 'react';

import type { SourceType } from '@trello/analytics-types';
import { getFreeTrialProperties } from '@trello/business-logic/organization';
import { idToDate } from '@trello/dates';
import { Entitlements } from '@trello/entitlements';
import { needsCC } from '@trello/paid-account';
import { navigate } from '@trello/router/navigate';
import { getOrganizationHomeUrl } from '@trello/urls';

import { useFreeTrialEligibilityRulesQuery } from './FreeTrialEligibilityRulesQuery.generated';
import { useStandardPremiumFreeTrial } from './useStandardPremiumFreeTrial';
import type { FreeTrialVia } from './useStartFreeTrialForOrg';
import {
  FREE_TRIAL_RESET_DATE,
  hasAlreadyUsedTrial,
  useStartFreeTrialForOrg,
} from './useStartFreeTrialForOrg';

export interface StartFreeTrialOptions {
  redirect?: boolean;
  count?: number;
  via?: FreeTrialVia;
}

export interface FreeTrialRules {
  isAdmin: boolean;
  hasCredit: boolean;
  isTrialActive?: boolean;
  isExpired?: boolean;
  isEligible: boolean;
  isStandard: boolean;
  isPremium: boolean;
  loading: boolean;
  daysLeft: number;
  startDate?: Date;
  startFreeTrial: (
    options?: StartFreeTrialOptions,
    source?: SourceType,
  ) => Promise<void>;
  addingTrial: boolean;
  endDate: Date | null;
  totalFreeTrialCredits: number;
  canRequestToJoinEnterprise: boolean;
  hasEnterpriseJoinRequest: boolean;
  joinableEnterpriseId: string | null;
  /** Returns `true` if the current premium trial is for a workspace that originally paid for Standard. */
  isStandardPremiumFreeTrial: boolean;
  isTrialExtended: boolean;
  isEnterpriseWorkspace: boolean;
}

export const useFreeTrialEligibilityRules = (
  orgId?: string,
  options: { skip: boolean } = { skip: false },
): FreeTrialRules => {
  const { data, loading } = useFreeTrialEligibilityRulesQuery({
    variables: {
      orgId: orgId || '',
    },
    skip: !orgId || options.skip,
    waitOn: ['MemberHeader', 'MemberBoards'],
  });

  const member = data?.member;
  const organization = data?.organization;
  const memberId = member?.id || '';
  const offering = organization?.offering || '';
  const isStandard = Entitlements.isStandard(offering);
  const isPremium = Entitlements.isPremium(offering);
  const isEnterpriseWorkspace = Entitlements.isEnterprise(offering);

  // The request to join enterprise overlay does not support users who are
  // associated with multiple enterprises, so only offer this option if they're
  // associated with one. It is very rare for a user to be associated with
  // multiple enterprises, so this was a tradeoff we made
  const joinableEnterprises =
    member?.enterprises?.filter((ent) =>
      Entitlements.isEnterprise(ent.offering),
    ) ?? [];

  const hasOneJoinableEnterprise = joinableEnterprises.length === 1;
  const joinableEnterpriseId = hasOneJoinableEnterprise
    ? joinableEnterprises[0].id
    : null;
  const enterpriseJoinRequest = organization?.enterpriseJoinRequest;
  const hasEnterpriseJoinRequest = Boolean(enterpriseJoinRequest);

  const canRequestToJoinEnterprise =
    hasOneJoinableEnterprise &&
    Boolean(joinableEnterpriseId) &&
    !hasEnterpriseJoinRequest;

  const isConfirmed = member?.confirmed;
  const orgName = organization?.name;
  const credits = useMemo(
    () => organization?.credits || [],
    [organization?.credits],
  );
  const isDisabled = needsCC(organization?.paidAccount?.standing);

  const { freeTrialEndDate, isStandardPremiumFreeTrialActive } =
    useStandardPremiumFreeTrial(orgId || '');
  const trialProperties = useMemo(
    () =>
      getFreeTrialProperties(
        credits,
        offering,
        isStandardPremiumFreeTrialActive
          ? freeTrialEndDate
          : data?.organization?.paidAccount?.trialExpiration,
      ),
    [
      credits,
      data?.organization?.paidAccount?.trialExpiration,
      freeTrialEndDate,
      isStandardPremiumFreeTrialActive,
      offering,
    ],
  );
  const hasCredit = !!trialProperties?.credit;

  const hasRecentTrial = hasAlreadyUsedTrial(credits);

  const hasActivePromoCredits = credits.some(
    (credit) =>
      credit.type === 'promoCode' &&
      Boolean(credit.count) &&
      isAfter(
        addDays(idToDate(credit.id), credit.count),
        FREE_TRIAL_RESET_DATE,
      ),
  );
  const hasStandardPromoCredits = isStandard && hasActivePromoCredits;
  const totalFreeTrialCredits = credits.filter(
    (credit) => credit.type === 'freeTrial',
  ).length;
  const isAdmin = !!organization?.memberships.find(
    (orgMember) =>
      orgMember.idMember === memberId && orgMember.memberType === 'admin',
  );

  const [startFreeTrialForOrg, { loading: addingTrial }] =
    useStartFreeTrialForOrg();

  const startFreeTrial = useCallback(
    async (
      { redirect = true, count, via = undefined }: StartFreeTrialOptions = {},
      source?: SourceType,
    ) => {
      if (loading || !organization) {
        return;
      }

      await startFreeTrialForOrg({ count, organization, via }, source);

      if (redirect) {
        navigate(getOrganizationHomeUrl(orgName), {
          trigger: true,
          replace: true,
        });
      }
    },
    [orgName, startFreeTrialForOrg, loading, organization],
  );

  const isTrialExtended = useMemo(
    () =>
      organization?.credits?.some(
        (credit) => credit.via === 'reverse-trial-extension',
      ) ?? false,
    [organization?.credits],
  );

  return {
    startFreeTrial,
    addingTrial,
    isAdmin,
    hasCredit,
    isTrialActive: trialProperties?.isActive,
    isTrialExtended,
    isExpired: trialProperties?.isExpired,
    isEligible: Boolean(
      isAdmin &&
        !hasRecentTrial &&
        !isDisabled &&
        isConfirmed &&
        !isPremium &&
        !isEnterpriseWorkspace &&
        !hasStandardPromoCredits,
    ),
    loading,
    isStandard,
    isPremium,
    daysLeft: trialProperties?.daysLeft || 0,
    startDate: trialProperties?.startDate,
    endDate: trialProperties?.expiresAt ?? null,
    totalFreeTrialCredits,
    canRequestToJoinEnterprise,
    hasEnterpriseJoinRequest,
    joinableEnterpriseId,
    isStandardPremiumFreeTrial: isStandardPremiumFreeTrialActive,
    isEnterpriseWorkspace,
  };
};

// TODO: rethink the original useFreeTrialEligibilityRules implementation
// to account for checks in multiple teams
export const GTM_LAUNCH_DATE = new Date('8/24/2021');
