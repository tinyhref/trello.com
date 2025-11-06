import { useSmartListFragment } from './SmartListFragment.generated';

const SMART_LIST_CARD_ID_PREFIX = 'SMARTLIST';

export const useIsSmartList = (listId: string) => {
  const { data } = useSmartListFragment({
    from: { id: listId },
    optimistic: true,
  });
  return Boolean(data?.type);
};

/**
 * Cards within a Smart List are not real Trello cards, and don't have
 * card ids. Smart List cards are urls presented with a Smart Card.
 * The url is unique to the Smart List item, but not unique to each instance.
 * Smart List cards do not appear twice in one list, so joining its url with
 * a list id creates a unique identifier for the Smart List card.
 */
export const getSmartListCardId = ({
  listId,
  url,
}: {
  listId: string;
  url: string;
}) => `${SMART_LIST_CARD_ID_PREFIX}-${url}-${listId}`;

export const isSmartCardId = (id: string) =>
  id.includes(SMART_LIST_CARD_ID_PREFIX);

export const getURLFromSmartCardId = (id: string) =>
  id.split('-').slice(1, -1).join('-');
