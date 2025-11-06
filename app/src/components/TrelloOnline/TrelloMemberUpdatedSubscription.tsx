import type { FunctionComponent } from 'react';

import { TrelloUserAri } from '@atlassian/ari';
import { useFeatureGate } from '@trello/feature-gate-client';
import { client } from '@trello/graphql';
import { useIsActiveRoute } from '@trello/router';
import { RouteId } from '@trello/router/routes';

import { isMongoId } from 'app/scripts/init/useSocketSubscription';
import { useQuickCaptureNotificationsAddedToState } from 'app/src/components/InboxNotifications/useQuickCaptureNotificationsAddedToState';
import { shouldRefetchPlannerDataState } from 'app/src/components/Planner/AddCardToPlannerPopover/shouldRefetchPlannerDataState';
import { shouldEnableDefaultCalendarOnRefetch } from 'app/src/components/Planner/shouldEnableDefaultCalendarOnRefetch';
import { useTrelloMemberUpdatedSubscription } from './TrelloMemberUpdatedSubscription.generated';

export interface TrelloMemberUpdatedSubscriptionProps {
  memberId?: string;
}

/**
 * Component that subscribes to the TrelloBoardUpdatedSubscription.
 * This is an optimization to avoid re-rendering more complex components
 * when subscription data arrives.
 * @param memberId id of the member in ARI format
 * @returns
 */
export const TrelloMemberUpdatedSubscription: FunctionComponent<
  TrelloMemberUpdatedSubscriptionProps
> = ({ memberId }) => {
  const addQuickCaptureNotifications =
    useQuickCaptureNotificationsAddedToState();
  const { value: useGqlSubscriptions } = useFeatureGate(
    'gql_client_subscriptions',
  );
  const { value: useMemberPlannerUpdateOnData } = useFeatureGate(
    'trello_enterprise_member_planner_update_on_data',
  );
  const { value: isQuickCaptureInboxNotificationsEnabled } = useFeatureGate(
    'ghost_qc_inbox_notifications',
  );
  const isBoardOrCardRoute = useIsActiveRoute(RouteId.BOARD);
  const memberAri = isMongoId(memberId)
    ? TrelloUserAri.create({ userId: memberId }).toString()
    : memberId;

  // AGG Subscription needs a member ARI.  Skip until we have one
  useTrelloMemberUpdatedSubscription({
    variables: { memberId: memberAri || '' },
    // Turn off Apollo's default caching since we're handling that in cacheSubscriptionResponseLink
    fetchPolicy: 'no-cache',
    skip: !memberId || !useGqlSubscriptions,
    onData: (data) => {
      if (
        data.data?.data?.trello.onMemberUpdated?.planner &&
        useMemberPlannerUpdateOnData
      ) {
        const accountAris =
          data.data?.data?.trello.onMemberUpdated?.planner?.accounts?.edges?.map(
            (edge) => edge.node.id,
          ) || [];
        for (const accountAri of accountAris) {
          client.cache.modify({
            id: client.cache.identify({
              __typename: 'TrelloPlannerCalendarAccount',
              id: accountAri,
            }),
            fields: {
              enabledCalendars: () => null,
            },
          });
        }
        shouldRefetchPlannerDataState.setValue(true);
        shouldEnableDefaultCalendarOnRefetch.setValue(true);
      }
      if (
        data.data?.data?.trello.onMemberUpdated?.notifications &&
        isQuickCaptureInboxNotificationsEnabled &&
        isBoardOrCardRoute
      ) {
        const notifications =
          data.data.data.trello.onMemberUpdated.notifications;

        if (notifications.quickCaptureCards && addQuickCaptureNotifications) {
          addQuickCaptureNotifications(notifications.quickCaptureCards);
        }
      }
    },
  });

  return null;
};
