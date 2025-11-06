import type { HistoryAction } from '@trello/action-history';
import { ActionHistory } from '@trello/action-history';
import { client } from '@trello/graphql';

import { CardActionFragmentDoc } from './CardActionFragment.generated';

/**
 * Helper function to record a card action in history.
 * We need ModelCache for HistoryContext, i.e. card metadata;
 * ideally this would use GraphQL, but requires somewhat complex lazy fetching.
 */
export const recordCardAction = (idCard: string, action: HistoryAction) => {
  const card = client.readFragment({
    id: `Card:${idCard}`,
    fragment: CardActionFragmentDoc,
  });
  const context = {
    idBoard: card.idBoard,
    idCard: card.id,
    idList: card.idList,
    idLabels: card.idLabels,
    idMembers: card.idMembers,
  };

  ActionHistory.append(action, context);
};
