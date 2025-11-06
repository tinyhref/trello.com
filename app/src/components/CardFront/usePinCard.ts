import { useCallback } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { useFeatureGate } from '@trello/feature-gate-client';

import { useQuickEditPinCardMutation } from 'app/src/components/QuickCardEditor/QuickEditPinCardMutation.generated';
import { useCardPinFragment } from './CardPinFragment.generated';

export function usePinCard({ cardId }: { cardId: string }) {
  const [quickEditPinCardMutation] = useQuickEditPinCardMutation();
  const { value: pinCardFeatureFlag } = useFeatureGate(
    'trello_web_pinned_cards',
  );
  const { data: card } = useCardPinFragment({
    from: { id: cardId },
    optimistic: true,
  });

  const updateCardPin = useCallback(
    async (newStatus: boolean) => {
      if (!pinCardFeatureFlag) {
        return;
      }

      const traceId = Analytics.startTask({
        taskName: 'edit-card/pinned',
        source: 'quickCardEditorInlineDialog',
      });

      await quickEditPinCardMutation({
        variables: { idCard: cardId, pinned: newStatus, traceId },
        optimisticResponse: {
          __typename: 'Mutation',
          setPinCard: {
            __typename: 'Card',
            id: cardId,
            pinned: newStatus,
          },
        },
        update(cache) {
          cache.modify({
            id: cache.identify({ id: cardId, __typename: 'Card' }),
            fields: { pinned: () => newStatus },
          });
        },
      });
    },
    [cardId, pinCardFeatureFlag, quickEditPinCardMutation],
  );

  const togglePinnedCard = useCallback(async () => {
    await updateCardPin(!card?.pinned);
  }, [card?.pinned, updateCardPin]);

  const isCardPinned = useCallback(() => {
    return card?.pinned ?? false;
  }, [card?.pinned]);

  return { updateCardPin, isCardPinned, togglePinnedCard };
}
