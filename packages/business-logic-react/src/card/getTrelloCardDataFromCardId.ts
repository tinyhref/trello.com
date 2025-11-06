import { TrelloCardAri } from '@atlassian/ari';
import { client } from '@trello/graphql';

import {
  BoardWorkspaceIdPlannerFragmentDoc,
  type BoardWorkspaceIdPlannerFragment,
} from './BoardWorkspaceIdPlannerFragment.generated';
import {
  CardDataPlannerFragmentDoc,
  type CardDataPlannerFragment,
} from './CardDataPlannerFragment.generated';
import {
  MirrorCardDataPlannerFragmentDoc,
  type MirrorCardDataPlannerFragment,
} from './MirrorCardDataPlannerFragment.generated';

/**
 * Retrieves Trello card data from a card ID, handling mirror cards by returning source card data.
 *
 * @param cardId - The ID of the card to retrieve data for
 * @returns An object containing:
 *   - cardAri: The ARI (Atlassian Resource Identifier) for the card
 *   - cardName: The name of the card (source card name for mirror cards)
 *   - cardRole: The role of the card (e.g., 'mirror')
 *   - cardObjectId: The object ID (source card ID for mirror cards)
 */
export const getTrelloCardDataFromCardId = (cardId: string) => {
  const cardData = client.readFragment<CardDataPlannerFragment>({
    id: client.cache.identify({
      __typename: 'Card',
      id: cardId,
    }),
    fragment: CardDataPlannerFragmentDoc,
  });
  const boardData = client.readFragment<BoardWorkspaceIdPlannerFragment>({
    id: client.cache.identify({
      __typename: 'Board',
      id: cardData?.idBoard,
    }),
    fragment: BoardWorkspaceIdPlannerFragmentDoc,
  });

  // Workaround for https://trello.atlassian.net/browse/TJC-5414
  const draggedCardAri = TrelloCardAri.create({
    cardId,
    workspaceId: boardData?.idOrganization ?? undefined,
  }).toString();
  const draggedCardName = cardData?.name;
  const cardRole = cardData?.cardRole;

  let cardAri = draggedCardAri;
  let cardName = draggedCardName;
  let cardObjectId = cardId;

  // If a mirror card is dragged onto Planner, we associate
  // the source card instead of the mirror card
  if (cardRole === 'mirror') {
    const mirrorSourceId = cardData?.mirrorSourceId;
    const mirrorCardData = client.readFragment<MirrorCardDataPlannerFragment>({
      id: client.cache.identify({
        __typename: 'Card',
        id: mirrorSourceId,
      }),
      fragment: MirrorCardDataPlannerFragmentDoc,
    });

    const mirrorSourceWorkspaceData =
      client.readFragment<BoardWorkspaceIdPlannerFragment>({
        id: client.cache.identify({
          __typename: 'Board',
          id: mirrorCardData?.idBoard,
        }),
        fragment: BoardWorkspaceIdPlannerFragmentDoc,
      });

    if (mirrorSourceId) {
      cardObjectId = mirrorSourceId;
      // Workaround for https://trello.atlassian.net/browse/TJC-5414
      cardAri = TrelloCardAri.create({
        cardId: mirrorSourceId,
        workspaceId: mirrorSourceWorkspaceData?.idOrganization ?? undefined,
      }).toString();
    }
    const mirrorCardSourceName = mirrorCardData?.name;
    cardName = mirrorCardSourceName || draggedCardName;
  }

  return { cardAri, cardName, cardRole, cardObjectId };
};
