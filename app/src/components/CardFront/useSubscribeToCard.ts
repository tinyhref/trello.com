import { useCallback } from 'react';

import type { SourceType } from '@trello/analytics-types';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { isMemberLoggedIn } from '@trello/authentication';
import { client, optimisticIdManager } from '@trello/graphql';
import { useBoardId, useCardId } from '@trello/id-context';
import type { Card } from '@trello/model-types';

import { useIsSubscribedToCardFragment } from 'app/src/components/Comments/IsSubscribedToCardFragment.generated';
import { useBoardSubscribePrefsFragment } from './BoardSubscribePrefsFragment.generated';
import { useSubscribeToCardShortcutMutation } from './SubscribeToCardShortcutMutation.generated';

export function useSubscribeToCard(source: SourceType = 'cardView') {
  const boardId = useBoardId();
  const cardId = useCardId();

  const [subscribeMutation] = useSubscribeToCardShortcutMutation();

  const { data } = useIsSubscribedToCardFragment({
    from: { id: cardId },
    optimistic: true,
  });

  const { data: boardData } = useBoardSubscribePrefsFragment({
    from: { id: boardId },
    optimistic: true,
  });

  const isSubscribedToCard = data?.subscribed ?? false;

  const isTemplate = boardData?.prefs?.isTemplate ?? false;

  const toggleSubscribe = useCallback(async () => {
    if (isTemplate || !isMemberLoggedIn()) {
      return;
    }

    const traceId = Analytics.startTask({
      taskName: 'edit-card/subscribed',
      source,
    });

    try {
      const subscribed = !isSubscribedToCard;

      let resolvedCardId = cardId;
      if (optimisticIdManager.isOptimisticId(cardId)) {
        client.cache.modify<Card>({
          id: client.cache.identify({ id: cardId, __typename: 'Card' }),
          fields: { subscribed: () => subscribed },
          optimistic: true,
        });
        resolvedCardId = await optimisticIdManager.waitForId(cardId);
      }

      await subscribeMutation({
        variables: { cardId: resolvedCardId, traceId, subscribed },
        optimisticResponse: {
          __typename: 'Mutation',
          updateCardSubscription: {
            __typename: 'Card',
            id: resolvedCardId,
            subscribed,
          },
        },
      });
      Analytics.taskSucceeded({
        taskName: 'edit-card/subscribed',
        traceId,
        source,
      });

      Analytics.sendUpdatedCardFieldEvent({
        field: 'subscribed',
        source,
        containers: formatContainers({
          idCard: resolvedCardId,
          idBoard: boardId,
        }),
        attributes: {
          taskId: traceId,
        },
      });
    } catch (err) {
      Analytics.taskFailed({
        taskName: 'edit-card/subscribed',
        traceId,
        source,
        error: err,
      });
    }
  }, [
    boardId,
    cardId,
    isSubscribedToCard,
    isTemplate,
    source,
    subscribeMutation,
  ]);

  return { toggleSubscribe, isSubscribedToCard };
}
