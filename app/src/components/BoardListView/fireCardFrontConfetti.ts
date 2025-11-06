import { fireConfetti, shouldFireConfetti } from '@trello/confetti';
import { client } from '@trello/graphql';

import type {
  CardListNameFragment,
  CardNameFragment,
} from './CardListName.generated';
import {
  CardListNameFragmentDoc,
  CardNameFragmentDoc,
} from './CardListName.generated';

/**
 * Fires confetti at confettiTarget Element given any of the provided
 * card or list IDs have associate names that match confetti firing criteria
 */
export function fireCardFrontConfetti(
  { cardId, listId }: { cardId?: string; listId?: string },
  confettiTarget: Element,
) {
  const card = cardId
    ? client.readFragment<CardNameFragment>({
        id: `Card:${cardId}`,
        fragment: CardNameFragmentDoc,
      })
    : null;
  const list = listId
    ? client.readFragment<CardListNameFragment>({
        id: `List:${listId}`,
        fragment: CardListNameFragmentDoc,
      })
    : null;

  if (
    shouldFireConfetti(card?.name ?? '') ||
    shouldFireConfetti(list?.name ?? '')
  ) {
    const { left, top } = confettiTarget.getBoundingClientRect();

    fireConfetti({
      x: left / window.innerWidth,
      y: top / window.innerHeight,
    });
  }
}
