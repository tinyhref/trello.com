import { useContext, useEffect, useMemo, useRef } from 'react';

import { deepEqual } from '@trello/objects';
import { useSharedState } from '@trello/shared-state';

import { useGetMirrorCardPaidStatus } from 'app/src/components/MirrorCard/useGetMirrorCardPaidStatus';
import type { ViewFilters } from 'app/src/components/ViewFilters';
import {
  isCustomFieldsEnabled,
  ViewFiltersContext,
} from 'app/src/components/ViewFilters';
import {
  useCardFilterQuery,
  type CardFilterQuery,
} from './CardFilterQuery.generated';
import {
  cardIdsAddedSinceFilteringSharedState,
  resetCardIdsAddedSinceFiltering,
} from './cardIdsAddedSinceFilteringSharedState';
import { useTrelloBoardMirrorCardFilterQuery } from './TrelloBoardMirrorCardFilterQuery.generated';
import { visibleCardIdsSharedState } from './visibleCardIdsSharedState';

type Board = NonNullable<CardFilterQuery['board']>;

const getIds = (data?: Array<{ id: string }>): string[] =>
  data?.map(({ id }) => id) ?? [];

/**
 * Uses the viewFilters context to determine which cards are visible
 * on the active board. The checkFilterableCard will map the board/card data
 * to the appropriate format in order to call satisfiesFilter.
 * @returns an array of cardIds
 */
const getVisibleCardIds = (
  board: Board | null,
  filters: ViewFilters,
  cardIdsAddedSinceFiltering: Set<string>,
  isPremiumMirrorCard: boolean,
): Set<string> => {
  const noFiltering = !filters.isFiltering();
  const filteredCards = board?.cards?.filter(
    (card) =>
      noFiltering ||
      filters.checkFilterableCard(
        board.id,
        card,
        board?.customFields ?? [],
        isCustomFieldsEnabled(board?.boardPlugins || []),
      ),
  );

  const filteredCardsWithoutMirrors =
    // when the filter is set and the user is not in a premium workspace, the free mirror cards will not be included in the filter result
    !noFiltering && !isPremiumMirrorCard
      ? filteredCards?.filter((card) => card.cardRole !== 'mirror')
      : filteredCards;

  const filteredCardIds = getIds(filteredCardsWithoutMirrors);

  const visibleCardIds = new Set([
    ...filteredCardIds,
    ...cardIdsAddedSinceFiltering,
  ]);

  return visibleCardIds;
};

/**
 * Hook that will watch the filter context and update the set of visible
 * card ids on the board. ListCard will then use the set of card id's to
 * show or hide cards depending on if they are in that set.
 * This hook should not contain any state updates, as it is used at the top
 * level of the board canvas, and using state will cause unnecessary rerenders.
 * @param boardId the id of the current board
 */
export const useVisibleCardsSharedStateSetter = (boardId: string) => {
  const viewFiltersContext = useContext(ViewFiltersContext);
  const { filters, boardId: filterBoardId } = viewFiltersContext.viewFilters;
  const lastFilters = useRef(filters);
  const [, setVisibleCardIds] = useSharedState(visibleCardIdsSharedState);
  const cardIdsAddedSinceFiltering =
    cardIdsAddedSinceFilteringSharedState.value;

  // We need to wait on the quickloads (especially the mirror cards)
  // eslint-disable-next-line @trello/no-cache-only-queries
  const { data, loading } = useCardFilterQuery({
    waitOn: [
      'CurrentBoardInfo',
      'CurrentBoardListsCards',
      'TrelloBoardMirrorCards',
    ],
    variables: { idBoard: boardId },
    fetchPolicy: 'cache-only',
    returnPartialData: true,
  });

  // needed to ensure the filter is updated when the mirror card query comes back
  // eslint-disable-next-line @trello/no-cache-only-queries
  const { data: mirrorCardData } = useTrelloBoardMirrorCardFilterQuery({
    waitOn: ['TrelloBoardMirrorCards'],
    variables: { id: data?.board?.shortLink ?? '' },
    skip: !data?.board?.shortLink,
    fetchPolicy: 'cache-only',
  });

  const board: Board | null = data?.board ?? null;

  const isPremiumMirrorCard = useGetMirrorCardPaidStatus();

  useEffect(() => {
    /**
     * If the filters changed, we can reset the card ids that have been
     * added since we last filtered, since now the user is expecting the cards
     * to be filtered again.
     */
    if (!deepEqual(lastFilters.current, filters)) {
      resetCardIdsAddedSinceFiltering();
      lastFilters.current = filters;
    }
  }, [filters]);

  const cardIds = useMemo(
    () =>
      board && filterBoardId && boardId === filterBoardId
        ? getVisibleCardIds(
            board,
            filters,
            cardIdsAddedSinceFiltering,
            isPremiumMirrorCard,
          )
        : new Set<string>(),
    // mirrorCardData included to ensure filter updates with mirror card info
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      board,
      boardId,
      cardIdsAddedSinceFiltering,
      filterBoardId,
      filters,
      isPremiumMirrorCard,
      mirrorCardData,
    ],
  );

  useEffect(() => {
    setVisibleCardIds(cardIds);
  }, [setVisibleCardIds, cardIds]);

  return { cardIds, loading };
};
