import { useCallback } from 'react';
import { useIntl } from 'react-intl';

import { sendErrorEvent } from '@trello/error-reporting';
import { showFlag } from '@trello/nachos/experimental-flags';
import { useSharedState } from '@trello/shared-state';

import { ClickToCreateAccountIdState } from './ClickToCreateAccountIdState';
import { PLANNER_CONSTANTS } from './plannerConstants';
import { useLazyLoadCreateEventFields } from './useLazyLoadCreateEventFields';
import { usePlannerAccount } from './usePlannerAccount';
import { usePlannerAccounts } from './usePlannerAccounts';
import { usePlannerRef } from './usePlannerRef';
import { useToggleCalendar } from './useToggleCalendar';

/**
 * Hook to determine which account and calendar should be used for creating planner events.
 * Handles all the logic internally including cache warmth checks and calendar toggling.
 *
 * ## Order of Operations
 *
 * This hook follows a specific decision tree to determine the best account and calendar:
 *
 * 1. **Cache Warmth Check**: If the planner cache is cold (no primaryAccountId),
 *    it first calls `lazyLoadCreateEventFields()` to load necessary data.
 *
 * 2. **Selected Account Check**: If a selected account ID is provided for an on click created event,
 *    it checks if the account has an enabled primary calendar.
 *    If found, returns that calendar immediately. If not, it checks if the account has a provider calendar with a primary calendar.
 *    If found, it toggles the calendar to the enabled state and returns the calendar ID and account ID..
 *
 * 3. **Primary Account Default Calendar**: Checks if the primary account's
 *    default calendar (isPrimary: true) is enabled. If found, returns that calendar immediately.
 *
 * 4. **Fallback to Other Accounts**: If primary account's default calendar is not enabled,
 *    iterates through other valid accounts to find one with an enabled default calendar.
 *    Returns the first match found.
 *
 * 5. **Toggle Primary Calendar**: If no other accounts have enabled default calendars,
 *    attempts to toggle the primary account's default calendar to enabled state.
 *    This involves calling the calendar API with the current view's date range.
 *
 * 6. **Fallback**: If all attempts fail, returns an object with empty strings.
 *    Error handling and user feedback are managed by the calling code (typically useCreatePlannerEvent).
 *
 * ## Key Behaviors
 *
 * - **Calendar Priority**: Always prefers default calendars (isPrimary: true) over others
 * - **Selected Account Priority**: If a selected account ID is provided, it is checked first
 * - **Account Priority**: Primary account is checked first, then other accounts
 * - **Cache Management**: Automatically handles cold cache scenarios
 * - **Calendar Toggling**: Can enable calendars on-demand when needed
 * - **Simple Fallback**: Returns empty strings when no calendar is available, letting calling code handle errors
 *
 * @returns A function that returns a Promise resolving to `{ plannerCalendarId, providerAccountId }` with empty strings if no calendar is available
 */
export const useEventAccountCalendarForCreate = (): ((
  optimisticEventPrefix?: string,
) => Promise<{
  plannerCalendarId: string;
  providerAccountId: string;
}>) => {
  const intl = useIntl();
  const { primaryAccountId, validAccounts, getEnabledCalendarsForAccount } =
    usePlannerAccounts();
  const [lazyLoadCreateEventFields] = useLazyLoadCreateEventFields();
  const { toggleCalendar } = useToggleCalendar();
  const { plannerRef } = usePlannerRef();

  const { plannerAccountDisplayName: primaryAccountDisplayName } =
    usePlannerAccount({ accountId: primaryAccountId });

  const isPlannerCacheCold = !primaryAccountId;
  const [clickToCreateAccountId] = useSharedState(ClickToCreateAccountIdState);

  const getEventAccountCalendarForCreate = useCallback(
    async (optimisticEventPrefix?: string) => {
      const isClickFocusTime =
        PLANNER_CONSTANTS.CLICK_TEMP_DRAFT_ID === optimisticEventPrefix;
      const calendarApi = plannerRef.current?.getApi();

      // Only load the create event fields when the cache is cold, i.e.,
      // when Planner hasn't been opened yet. This ensures that the regular
      // already opened Planner creation path is not slowed down by a redundant query
      const lazyLoadedCreateEventFields = isPlannerCacheCold
        ? await lazyLoadCreateEventFields()
        : undefined;

      const finalPrimaryAccountId =
        lazyLoadedCreateEventFields?.primaryAccountId ?? primaryAccountId;

      const finalPrimaryAccountDisplayName =
        lazyLoadedCreateEventFields?.primaryAccountDisplayName ??
        primaryAccountDisplayName;

      if (isClickFocusTime) {
        const targetAccountId =
          clickToCreateAccountId || finalPrimaryAccountId || '';
        const enabledCalendars = getEnabledCalendarsForAccount(targetAccountId);

        const enabledPrimaryCalendar = enabledCalendars?.find(
          (calendar) => calendar?.isPrimary,
        );

        if (enabledPrimaryCalendar) {
          return {
            plannerCalendarId: enabledPrimaryCalendar.id,
            providerAccountId: targetAccountId,
          };
        } else {
          const selectedAccount = validAccounts.find(
            (account) => account?.id === targetAccountId,
          );

          const providerCalendars =
            selectedAccount?.providerCalendars?.edges?.map((edge) => edge.node);

          const providerPrimaryCalendar = providerCalendars?.find(
            (calendar) => calendar?.isPrimary,
          );

          try {
            const enabledCalendarId = await toggleCalendar({
              providerCalendarId: providerPrimaryCalendar?.id ?? '',
              account: selectedAccount,
              start: calendarApi?.view.currentStart.toISOString() ?? '',
              end: calendarApi?.view.currentEnd.toISOString() ?? '',
              newCheckedState: true,
            });
            return {
              plannerCalendarId: enabledCalendarId ?? '',
              providerAccountId: targetAccountId,
            };
          } catch (error) {
            sendErrorEvent(error, {
              tags: {
                ownershipArea: 'trello-electric',
                feature: 'Planner',
              },
              extraData: {
                component: 'EventDetailAccountSelect',
                action: 'enableCalendar',
              },
            });

            showFlag({
              id: 'toggleCalendar',
              title: intl.formatMessage({
                id: 'templates.planner.toggle-error',
                defaultMessage:
                  'There was an error toggling this calendar, please try again.',
                description: 'Error flag message for toggling default calendar',
              }),
              appearance: 'error',
              isAutoDismiss: true,
            });

            return {
              plannerCalendarId: '',
              providerAccountId: '',
            };
          }
        }
      }

      // Check if primary account's default calendar is enabled
      let primaryAccountDefaultCalendar;
      if (finalPrimaryAccountId) {
        const primaryAccountEnabledCalendars = getEnabledCalendarsForAccount(
          finalPrimaryAccountId,
        );
        primaryAccountDefaultCalendar = primaryAccountEnabledCalendars?.find(
          (cal) => cal?.isPrimary,
        );
      }

      if (
        primaryAccountDefaultCalendar &&
        primaryAccountDefaultCalendar.id &&
        finalPrimaryAccountId
      ) {
        return {
          plannerCalendarId: primaryAccountDefaultCalendar.id,
          providerAccountId: finalPrimaryAccountId,
        };
      }

      // Look for other accounts with enabled default calendars
      for (const account of validAccounts) {
        // Skip the primary account and any accounts that are not valid
        if (!account?.id || account.id === finalPrimaryAccountId) {
          continue;
        }

        const enabledCalendars = getEnabledCalendarsForAccount(account.id);
        const defaultCalendar = enabledCalendars?.find((cal) => cal?.isPrimary);
        if (defaultCalendar && defaultCalendar.id && account.id) {
          return {
            plannerCalendarId: defaultCalendar.id,
            providerAccountId: account.id,
          };
        }
      }

      const primaryAccount = validAccounts.find(
        (account) => account?.id === finalPrimaryAccountId,
      );

      if (primaryAccount && primaryAccount.id) {
        try {
          const toggledCalendarId = await toggleCalendar({
            providerCalendarId: finalPrimaryAccountDisplayName || '',
            start: calendarApi?.view.currentStart.toISOString() || '',
            end: calendarApi?.view.currentEnd.toISOString() || '',
            newCheckedState: true,
            account: primaryAccount,
          });

          if (toggledCalendarId && finalPrimaryAccountId) {
            return {
              plannerCalendarId: toggledCalendarId,
              providerAccountId: finalPrimaryAccountId,
            };
          }
        } catch (error) {
          sendErrorEvent(error, {
            tags: {
              ownershipArea: 'trello-electric',
              feature: 'Planner',
            },
            extraData: {
              component: 'EventDetailAccountSelect',
              action: 'enableCalendar',
            },
          });

          showFlag({
            id: 'toggleCalendar',
            title: intl.formatMessage({
              id: 'templates.planner.toggle-default-calendar-error',
              defaultMessage:
                'There was an error toggling your default calendar.',
              description: 'Error flag message for toggling default calendar',
            }),
            appearance: 'error',
            isAutoDismiss: true,
          });
        }
      }

      return {
        plannerCalendarId: '',
        providerAccountId: '',
      };
    },
    [
      plannerRef,
      validAccounts,
      isPlannerCacheCold,
      lazyLoadCreateEventFields,
      primaryAccountId,
      primaryAccountDisplayName,
      getEnabledCalendarsForAccount,
      toggleCalendar,
      intl,
      clickToCreateAccountId,
    ],
  );

  return getEventAccountCalendarForCreate;
};
