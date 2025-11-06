import { useEffect } from 'react';

import { optimisticIdManager } from '@trello/graphql';
import type { RealtimeUpdatePayload } from '@trello/realtime-updater';
import { realtimeUpdaterEvents } from '@trello/realtime-updater';

import type { ConvertCardRoleButtonQuery } from './ConvertCardRoleButtonQuery.generated';
import { useConvertCardRoleButtonQuery } from './ConvertCardRoleButtonQuery.generated';

export function useRefetchConvertCardRoleButtonQuery(cardId: string): {
  data: ConvertCardRoleButtonQuery | undefined;
  loading: boolean;
} {
  const skip = optimisticIdManager.isOptimisticId(cardId);

  // eslint-disable-next-line @trello/no-apollo-refetch
  const { data, loading, refetch } = useConvertCardRoleButtonQuery({
    skip,
    variables: { cardId },
    waitOn: ['PreloadCard'],
  });

  useEffect(() => {
    if (skip) return;

    const realtimeUpdateHandler = (
      updatePayload: RealtimeUpdatePayload,
    ): void => {
      if (
        updatePayload.typeName === 'Card' &&
        updatePayload.deltas.find((d) => d.id === cardId)
      ) {
        refetch();
      }
    };

    realtimeUpdaterEvents.on('updateModels', realtimeUpdateHandler);

    return () => {
      realtimeUpdaterEvents.off('updateModels', realtimeUpdateHandler);
    };
  }, [cardId, refetch, skip]);

  return { data, loading };
}
