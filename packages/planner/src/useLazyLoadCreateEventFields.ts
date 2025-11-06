import { useMemberNodeId } from '@trello/business-logic-react/member';
import { client } from '@trello/graphql';

import {
  TrelloPlannerCreateFieldsDocument,
  type TrelloPlannerCreateFieldsQuery,
  type TrelloPlannerCreateFieldsQueryVariables,
} from './TrelloPlannerCreateFieldsQuery.generated';

type LazyLoadCreateEventFieldsResult =
  | {
      primaryAccountId?: string;
      primaryCalendarId?: string;
      primaryAccountDisplayName?: string;
    }
  | undefined;

/**
 * Lazy loads the required Planner fields for the create event flow.
 * This is a helper hook for `useCreatePlannerEvent` that is private to this package and not exported.
 * @returns A function that returns the required Planner fields.
 */
export const useLazyLoadCreateEventFields = (): [
  () => Promise<LazyLoadCreateEventFieldsResult>,
] => {
  const memberNodeId = useMemberNodeId();

  const lazyLoadCreateEventFields =
    async (): Promise<LazyLoadCreateEventFieldsResult> => {
      if (!memberNodeId) return;

      const trelloPlannerResult = await client.query<
        TrelloPlannerCreateFieldsQuery,
        TrelloPlannerCreateFieldsQueryVariables
      >({
        query: TrelloPlannerCreateFieldsDocument,
        variables: {
          nodeId: memberNodeId,
        },
      });

      const primaryAccountId =
        trelloPlannerResult.data?.trello?.member?.planner?.primaryAccountId;

      const primaryAccount =
        trelloPlannerResult.data?.trello?.member?.planner?.accounts?.edges?.filter(
          (account) => account?.node?.id === primaryAccountId,
        )[0];

      const primaryAccountDisplayName = primaryAccount?.node?.displayName;

      const primaryCalendarId =
        primaryAccount?.node?.enabledCalendars?.edges?.find(
          (calendar) => calendar?.node?.isPrimary,
        )?.node?.id;

      return {
        primaryAccountId: primaryAccountId ?? undefined,
        primaryCalendarId: primaryCalendarId ?? undefined,
        primaryAccountDisplayName: primaryAccountDisplayName ?? undefined,
      };
    };

  return [lazyLoadCreateEventFields];
};
