import { useCardId } from '@trello/id-context';

import type { CardStickersFragment } from './CardStickersFragment.generated';
import { useCardStickersFragment } from './CardStickersFragment.generated';

type CardSticker = NonNullable<CardStickersFragment>['stickers'][number];

interface UseCardStickersResult {
  hasStickers: boolean;
  stickers: CardSticker[];
}

export const useCardStickers = (): UseCardStickersResult => {
  const cardId = useCardId();

  const { data } = useCardStickersFragment({
    from: { id: cardId },
    optimistic: true,
  });

  return {
    hasStickers: data?.stickers ? data.stickers.length > 0 : false,
    stickers: data?.stickers ?? [],
  };
};
