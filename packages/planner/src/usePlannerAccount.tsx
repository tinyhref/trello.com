import { useEffect, useMemo, useState } from 'react';

import { useMemberNodeId } from '@trello/business-logic-react/member';
import { plannerDevToolsState } from '@trello/business-logic/planner';
import { usePlannerAccountId } from '@trello/id-context';

import { usePlannerAccountByIdFragment } from './PlannerAccountByIdFragment.generated';
import { usePlannerMemberAccountFragment } from './PlannerMemberAccountFragment.generated';

/**
 * Custom hook to retrieve planner account data for either a specific account or the default account.
 * Fetches data for a specific account if provided, otherwise uses account from context or falls back
 * to the primary account.
 *
 * The hook will:
 * 1. Use the provided accountId if specified
 * 2. Fall back to accountId from context if available
 * 3. Use the primary account ID as final fallback
 *
 * By default, only returns valid accounts (has required scopes and not expired).
 * Can optionally return expired accounts if returnExpiredAccount is true.
 *
 * @param options - Configuration options
 * @param options.accountId - Optional account ID to fetch specific account data
 * @param options.returnExpiredAccount - Whether to return expired accounts (default: false)
 * @returns {Object} Account data including:
 * - accountType: The type of account (e.g. 'GOOGLE', 'OUTLOOK')
 * - enabledCalendars: List of calendars enabled for this account
 * - enabledCalendarsPageInfo: Pagination info for enabled calendars
 * - isLoadingEnabledCalendars: Whether enabled calendars are still loading
 * - outboundAuthId: ID for outbound authentication
 * - plannerAccountDisplayName: Display name for the account
 * - plannerAccountId: ID of the planner account
 * - providerCalendar: Calendar provider details
 * - primaryCalendarId: ID of the primary calendar
 */
export const usePlannerAccount = ({
  accountId,
  returnExpiredAccount = false,
}: {
  accountId?: string;
  returnExpiredAccount?: boolean;
} = {}) => {
  const [isLoadingEnabledCalendars, setIsLoadingEnabledCalendars] =
    useState(true);

  const memberNodeId = useMemberNodeId();
  const { data: plannerAccountData } = usePlannerMemberAccountFragment({
    from: { id: memberNodeId },
    optimistic: true,
  });

  const accountIdFromContext = usePlannerAccountId();
  const fallbackAccountId = plannerAccountData?.planner?.primaryAccountId;
  const providedAccountId =
    accountId || accountIdFromContext || fallbackAccountId;

  const { data: specificAccountData } = usePlannerAccountByIdFragment({
    from: { id: providedAccountId || '' },
    optimistic: true,
  });

  const account = useMemo(() => {
    if ((accountId || accountIdFromContext) && specificAccountData) {
      return specificAccountData;
    }

    const validPlannerAccount =
      plannerAccountData?.planner?.accounts?.edges?.find(
        (edge) => edge?.node?.hasRequiredScopes && !edge?.node?.isExpired,
      )?.node;

    const firstPlannerAccount =
      plannerAccountData?.planner?.accounts?.edges?.[0]?.node;

    // If returnExpiredAccount is true, return the first planner account even if it is expired
    // Planner.tsx relies on the plannerAccountId to determine whether or not a valid account is connected,
    // so we by default will not return an expired / invalid account.
    return returnExpiredAccount
      ? validPlannerAccount || firstPlannerAccount
      : validPlannerAccount;
  }, [
    accountId,
    accountIdFromContext,
    specificAccountData,
    plannerAccountData?.planner?.accounts?.edges,
    returnExpiredAccount,
  ]);

  const enabledCalendars = useMemo(() => {
    return (
      account?.enabledCalendars?.edges
        ?.map((edge) => edge.node)
        .filter(Boolean) || undefined
    );
  }, [account]);

  const providerCalendar = useMemo(() => {
    return account?.providerCalendars || undefined;
  }, [account]);

  // This id will only return a value if the primary calendar is enabled
  const primaryCalendarId = useMemo(() => {
    return enabledCalendars?.find((calendar) => calendar?.isPrimary)?.id;
  }, [enabledCalendars]);

  plannerDevToolsState.setValue({
    ...plannerDevToolsState,
    accountId: account?.id || '',
  });

  const isExpired = useMemo(
    () => (account?.isExpired === undefined ? undefined : account?.isExpired),
    [account],
  );

  useEffect(() => {
    if (account?.enabledCalendars?.pageInfo?.hasNextPage === false) {
      setIsLoadingEnabledCalendars(false);
    }
  }, [account]);

  return {
    account,
    accountType: account?.accountType || undefined,
    enabledCalendars,
    enabledCalendarsPageInfo: account?.enabledCalendars?.pageInfo || undefined,
    isLoadingEnabledCalendars: account ? isLoadingEnabledCalendars : undefined,
    outboundAuthId: account?.outboundAuthId || undefined,
    plannerAccountDisplayName: account?.displayName || undefined,
    plannerAccountId: account?.id || undefined,
    providerCalendar,
    primaryCalendarId,
    isExpired,
    hasRequiredScopes: account?.hasRequiredScopes,
    isPrimary: account?.id === plannerAccountData?.planner?.primaryAccountId,
    isProblematic: isExpired || !account?.hasRequiredScopes,
  };
};
