import { useCallback, useEffect, useMemo, useState } from 'react';

import { useMemberNodeId } from '@trello/business-logic-react/member';
import { client } from '@trello/graphql';

import type { Account } from './Planner.types';
import { PlannerAccountByIdFragmentDoc } from './PlannerAccountByIdFragment.generated';
import { usePlannerMemberAccountFragment } from './PlannerMemberAccountFragment.generated';

export const usePlannerAccounts = () => {
  const [isLoadingEnabledCalendars, setIsLoadingEnabledCalendars] =
    useState(true);

  const memberNodeId = useMemberNodeId();

  const { data } = usePlannerMemberAccountFragment({
    from: { id: memberNodeId },
    optimistic: true,
    returnPartialData: true,
  });

  const {
    accountsWithScopeIssues,
    allAccounts,
    expiredAccounts,
    problematicAccounts,
    validAccounts,
  } = useMemo(() => {
    const all: Account[] = [];
    const valid: Account[] = [];
    const problematic: Account[] = [];
    const expired: Account[] = [];
    const withScopeIssues: Account[] = [];

    const accounts = data?.planner?.accounts?.edges;
    if (accounts) {
      for (const account of accounts) {
        const accountNode = account.node;
        if (!accountNode?.id) {
          continue;
        }

        // Use readFragment to validate that all expected fields are present
        // This ensures the account data is fully loaded in the GraphQL cache
        const validatedAccount = client.readFragment(
          {
            id: client.cache.identify({
              __typename: 'TrelloPlannerCalendarAccount',
              id: accountNode.id,
            }),
            fragment: PlannerAccountByIdFragmentDoc,
          },
          true,
        );

        if (!validatedAccount) {
          continue;
        }

        all.push(validatedAccount);

        if (validatedAccount.isExpired) {
          problematic.push(validatedAccount);
          expired.push(validatedAccount);
        } else if (!validatedAccount.hasRequiredScopes) {
          problematic.push(validatedAccount);
          withScopeIssues.push(validatedAccount);
        } else {
          valid.push(validatedAccount);
        }
      }
    }

    return {
      accountsWithScopeIssues: withScopeIssues,
      allAccounts: all,
      expiredAccounts: expired,
      problematicAccounts: problematic,
      validAccounts: valid,
    };
  }, [data?.planner?.accounts?.edges]);

  /**
   * Returns the primary account ID for the user's planner accounts.
   *
   * Uses the primaryAccountId field from the backend if available,
   * otherwise finds the first valid account (has required scopes and not expired).
   *
   * @returns The ID of the primary planner account, or undefined if no valid account exists
   */
  const primaryAccountId = useMemo(
    () =>
      data?.planner?.primaryAccountId ||
      data?.planner?.accounts?.edges?.find(
        (edge) => edge?.node?.hasRequiredScopes && !edge?.node?.isExpired,
      )?.node?.id ||
      undefined,
    [data?.planner?.accounts?.edges, data?.planner?.primaryAccountId],
  );

  const primaryAccount = useMemo(
    () =>
      data?.planner?.accounts?.edges?.find(
        (edge) => edge?.node?.id === primaryAccountId,
      ),
    [data?.planner?.accounts?.edges, primaryAccountId],
  );

  /**
   * Returns the enabled calendars for a specific account ID.
   *
   * @param accountId - The account ID to get enabled calendars for
   * @returns Array of enabled calendars for the account
   */
  const getEnabledCalendarsForAccount = useCallback(
    (accountId: string) => {
      // Find the account in validAccounts and return its enabled calendars
      const account = validAccounts.find((acc) => acc?.id === accountId);
      const calendars = account?.enabledCalendars?.edges
        ?.map((edge) => edge?.node)
        .filter(Boolean);

      return calendars && calendars.length > 0 ? calendars : undefined;
    },
    [validAccounts],
  );

  /**
   * Returns the provider calendars for a specific account ID.
   *
   * @param accountId - The account ID to get provider calendars for
   * @returns Array of provider calendars for the account
   */
  const getProviderCalendarsForAccount = useCallback(
    (accountId: string) => {
      // Find the account in validAccounts and return its provider calendars
      const account = validAccounts.find((acc) => acc?.id === accountId);
      const calendars = account?.providerCalendars?.edges
        ?.map((edge) => edge?.node)
        .filter(Boolean);

      return calendars?.length ? calendars : undefined;
    },
    [validAccounts],
  );

  useEffect(() => {
    // If there are no valid accounts, we're not loading
    if (validAccounts.length === 0) {
      setIsLoadingEnabledCalendars(false);
      return;
    }

    // Check if all valid accounts have finished loading their calendars
    const allAccountsLoaded = validAccounts.every(
      (account) => account?.enabledCalendars?.pageInfo?.hasNextPage === false,
    );

    if (allAccountsLoaded) {
      setIsLoadingEnabledCalendars(false);
    }
  }, [validAccounts]);

  const hasReachedAccountLimit = useMemo(() => {
    return allAccounts.length >= 10;
  }, [allAccounts]);

  /**
   * Accounts filtered to only include those that have an enabled primary calendar.
   * This is useful for components that need to show account options
   * where only accounts with enabled primary calendars are available.
   */
  const accountsWithEnabledPrimaryCalendar = useMemo(() => {
    return validAccounts.filter((account) => {
      if (!account?.id) {
        return false;
      }
      const enabledCalendars = getEnabledCalendarsForAccount(account.id);
      const primaryCalendar = enabledCalendars?.find((cal) => cal?.isPrimary);
      return !!primaryCalendar?.id;
    });
  }, [validAccounts, getEnabledCalendarsForAccount]);

  /**
   * Sorts a list of accounts so the primary account is first, then
   * alphabetically by display name. Also ensures, for type safety, that null
   * accounts are filtered out.
   *
   * @param accounts - The accounts to sort and sanitize
   * @returns The sorted and sanitized accounts
   */
  const sortAndSanitizeAccounts = useCallback(
    (accounts: Account[]) => {
      return accounts
        .filter((account) => !!account)
        .sort((a, b) => {
          if (a?.id === primaryAccountId) {
            return -1;
          } else if (b?.id === primaryAccountId) {
            return 1;
          }

          const isAValid = validAccounts.find((acc) => acc?.id === a?.id);
          const isBValid = validAccounts.find((acc) => acc?.id === b?.id);

          if (isAValid && !isBValid) {
            return -1;
          } else if (!isAValid && isBValid) {
            return 1;
          }

          return a?.displayName?.localeCompare(b?.displayName ?? '') ?? 1;
        });
    },
    [primaryAccountId, validAccounts],
  );

  return {
    accountsWithEnabledPrimaryCalendar,
    accountsWithScopeIssues,
    allAccounts,
    expiredAccounts,
    getEnabledCalendarsForAccount,
    getProviderCalendarsForAccount,
    hasReachedAccountLimit,
    isLoadingEnabledCalendars:
      validAccounts.length > 0 ? isLoadingEnabledCalendars : undefined,
    primaryAccount,
    primaryAccountId,
    problematicAccounts,
    validAccounts,
    sortAndSanitizeAccounts,
  };
};
