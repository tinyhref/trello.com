import { client } from '@trello/graphql';
import { getLocation, removeSearchParamsFromLocation } from '@trello/router';
import { navigate } from '@trello/router/navigate';
import { getCardUrl } from '@trello/urls';

import type { CardUrlFragment } from './CardUrlFragment.generated';
import { CardUrlFragmentDoc } from './CardUrlFragment.generated';

export const openCardBack = async (cardId: string) => {
  const card = client.readFragment<CardUrlFragment>(
    { id: `Card:${cardId}`, fragment: CardUrlFragmentDoc },
    true,
  );

  const cardUrl = getCardUrl({
    url: card?.url,
    id: cardId,
    name: card?.name,
    idShort: card?.idShort,
    idBoard: card?.idBoard,
  });
  const location = getLocation();

  // Always remove the openCard parameter to prevent it from persisting when opening cards
  // This ensures that when clicking on card attachments, the openCard parameter doesn't
  // remain in the URL and cause the wrong card to be opened
  const cleanLocation = removeSearchParamsFromLocation(location, ['openCard']);

  navigate(`${cardUrl}${cleanLocation.search}`, { trigger: true });
};
