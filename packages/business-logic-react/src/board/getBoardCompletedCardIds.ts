import { client } from '@trello/graphql';

import {
  BoardMirrorCardFragmentDoc,
  type BoardMirrorCardFragment,
} from './BoardMirrorCardFragment.generated';

type Card = {
  id: string;
  mirrorSourceId?: string | null;
  dueComplete: boolean;
  closed: boolean;
  nodeId: string;
};

export type CardIdentifier = {
  id: string;
  nodeId: string;
};

/**
 * Identifies completed cards on a board, including both regular cards and mirror cards.
 *
 * This function analyzes a list of cards to find those that are marked as completed.
 * For regular cards, it checks if `dueComplete` is true. For mirror cards, it checks
 * if their source card is completed. Only non-closed cards are considered.
 *
 * @param cards - An array of card objects to analyze. Each card should have properties
 *                for identification, completion status, and mirror relationships.
 *                Defaults to an empty array if not provided.
 *
 * @returns An array of CardIdentifier objects representing completed cards.
 *          Each CardIdentifier contains both the card's ID and ARI (nodeId).
 *          Regular completed cards and mirror cards with completed source cards
 *          are included in the result.
 *
 * @remarks
 * - Only non-closed cards are considered for completion status
 * - Mirror cards are included if their source card is completed
 * - The function handles multiple mirror cards pointing to the same source
 * - Uses Apollo cache to read source card completion status for mirror cards
 */
export const getBoardCompletedCardIds = (cards: Card[] = []) => {
  const completedCards: CardIdentifier[] = [];
  // this will keep a map of mirror card source ids to the card ids so we can only archive the mirror and not the source
  const mirrorCardMapping: Record<string, CardIdentifier[]> = {};
  cards
    // we need this filter because manually updating the closed field in the cache doesn't mean these cards won't be skipped by the `filter: visible` section in the fragment
    ?.filter((card) => !card.closed)
    .forEach((card) => {
      if (card.mirrorSourceId) {
        // multiple cards could mirror the same source card, so we need to keep track of all of them
        mirrorCardMapping[card.mirrorSourceId] = [
          ...(mirrorCardMapping[card.mirrorSourceId] || []),
          { id: card.id, nodeId: card.nodeId },
        ];
      } else if (card.dueComplete) {
        completedCards.push({ id: card.id, nodeId: card.nodeId });
      }
    });

  Object.keys(mirrorCardMapping).forEach((mirrorCardSourceId) => {
    const card = client.readFragment<BoardMirrorCardFragment>({
      fragment: BoardMirrorCardFragmentDoc,
      id: `Card:${mirrorCardSourceId}`,
    });
    if (card?.dueComplete) {
      // if the mirrors source card is marked done, we can archive the mirror card
      completedCards.push(...mirrorCardMapping[mirrorCardSourceId]);
    }
  });

  return completedCards;
};
