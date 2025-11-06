import type { FunctionComponent } from 'react';
import { useCallback } from 'react';

import { useFeatureGate } from '@trello/feature-gate-client';
import { useSharedStateSelector } from '@trello/shared-state';

import { legacyBoardModelsSharedState } from 'app/src/components/Board/legacyBoardModelsSharedState';
import { useTrelloBoardUpdatedCardLabelsSubscription } from './TrelloBoardUpdatedCardLabelsSubscription.generated';
import { useTrelloBoardUpdatedSubscription } from './TrelloBoardUpdatedSubscription.generated';

/**
 * Component that subscribes to the TrelloBoardUpdatedSubscription.
 * This is an optimization to avoid re-rendering more complex components
 * when subscription data arrives.
 *
 */
export const TrelloBoardUpdatedSubscription: FunctionComponent = () => {
  const { value: useGqlSubscriptions } = useFeatureGate(
    'gql_client_subscriptions',
  );

  const { value: useCardLabelsSubscription } = useFeatureGate(
    'trello_web_native_gql_labels',
  );

  const boardNodeId = useSharedStateSelector(
    legacyBoardModelsSharedState,
    useCallback((state) => state.board.model?.get('nodeId') ?? '', []),
  );

  // Spike for using native board subscription with card labels
  useTrelloBoardUpdatedCardLabelsSubscription({
    variables: { nodeId: boardNodeId },
    fetchPolicy: 'no-cache',
    skip: !boardNodeId || !useGqlSubscriptions || !useCardLabelsSubscription,
  });

  // AGG Subscription needs a nodeId/ARI. Skip until we have one
  useTrelloBoardUpdatedSubscription({
    variables: { nodeId: boardNodeId },
    // Turn off Apollo's default caching since we're handling that in cacheSubscriptionResponseLink
    fetchPolicy: 'no-cache',
    skip: !boardNodeId || !useGqlSubscriptions || useCardLabelsSubscription,
  });

  return null;
};
