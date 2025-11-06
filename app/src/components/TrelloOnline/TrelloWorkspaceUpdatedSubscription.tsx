import { useCallback, type FunctionComponent } from 'react';

import { TrelloWorkspaceAri } from '@atlassian/ari';
import { useMemberId } from '@trello/authentication';
import { useIsMemberOfOrganization } from '@trello/business-logic-react/organization';
import { useFeatureGate } from '@trello/feature-gate-client';
import { useSharedStateSelector } from '@trello/shared-state';
import { workspaceState } from '@trello/workspace-state';

import { isMongoId } from 'app/scripts/init/useSocketSubscription';
import { useTrelloWorkspaceUpdatedSubscription } from './TrelloWorkspaceUpdatedSubscription.generated';

export interface TrelloWorkspaceUpdatedSubscriptionProps {
  workspaceId?: string;
}
/**
 * Component that subscribes to the TrelloWorkspaceUpdatedSubscription.
 * This is an optimization to avoid re-rendering more complex components
 * when subscription data arrives.
 *
 */
export const TrelloWorkspaceUpdatedSubscription: FunctionComponent<
  TrelloWorkspaceUpdatedSubscriptionProps
> = () => {
  const { value: useGqlSubscriptions } = useFeatureGate(
    'gql_client_subscriptions',
  );
  const workspaceId = useSharedStateSelector(
    workspaceState,
    useCallback((state) => state.workspaceId, []),
  );
  const memberId = useMemberId();

  const memberOfWorkspace = useIsMemberOfOrganization({
    idMember: memberId,
    idOrganization: workspaceId,
  });

  const workspaceAri =
    workspaceId && isMongoId(workspaceId)
      ? TrelloWorkspaceAri.create({ workspaceId }).toString()
      : null;

  useTrelloWorkspaceUpdatedSubscription({
    variables: { workspaceId: workspaceAri || '' },
    // Turn off Apollo's default caching since we're handling that in cacheSubscriptionResponseLink
    fetchPolicy: 'no-cache',
    skip: !workspaceId || !useGqlSubscriptions || !memberOfWorkspace,
  });
  return null;
};
