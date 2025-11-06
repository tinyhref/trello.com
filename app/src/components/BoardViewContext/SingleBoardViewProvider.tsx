import type {
  FunctionComponent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from 'react';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useMemberId } from '@trello/authentication';
import { canEdit } from '@trello/business-logic/board';

import { Util } from 'app/scripts/lib/util';
import type { ViewFilters } from 'app/src/components/ViewFilters';
import {
  isCustomFieldsEnabled,
  ViewFiltersContext,
} from 'app/src/components/ViewFilters';
import type {
  BoardViewContextValue,
  CardWithChecklistDefined,
} from './BoardViewContext';
import { BoardViewContext } from './BoardViewContext';
import { usePermissionsBoardQuery } from './PermissionsBoardQuery.generated';
import { useSingleBoardDataQuery } from './SingleBoardDataQuery.generated';
import { useSingleBoardDataWithoutChecklistsQuery } from './SingleBoardDataWithoutChecklistsQuery.generated';

/**
 * Providing our own omit helper to ensure type safety.
 *
 * Returns a copy of the object of type T with the key TKey omitted.
 */
function omit<T, TKey extends string>(obj: T, field: TKey): Omit<T, TKey> {
  const { [field]: _, ...rest } = obj;
  return rest;
}

/**
 * Keep track of new cards created within the View, so that we can display them
 * even if they don't match the active filters. This way, when a user creates a
 * new card, they see immediate feedback that their card was successfully
 * created. Reset this list of new cards whenever filters change, since the
 * user has already seen the feedback that the card got created.
 */
function useNewlyCreatedCardIds(filters: ViewFilters) {
  const [newlyCreatedCardIds, setNewlyCreatedCardIds] = useState<string[]>([]);

  const onNewCardCreated = useCallback(({ idCard }: { idCard: string }) => {
    setNewlyCreatedCardIds((prev) => [...prev, idCard]);
  }, []);

  const prevFilters = useRef(filters);
  useEffect(() => {
    if (prevFilters.current !== filters) {
      setNewlyCreatedCardIds([]);
      prevFilters.current = filters;
    }
  }, [filters]);

  return { newlyCreatedCardIds, onNewCardCreated };
}

interface SingleBoardViewProviderProps {
  idBoard: string;
  navigateToCard?: (id: string) => void;
  /**
   * Checklist items are extremely expensive to hydrate, so we have a stripped
   * query that doesn't include them. Use carefully.
   * @default false
   */
  includeChecklistItems?: boolean;
  isDateBasedView?: boolean;
  /**
   * Skips all associated GraphQL queries.
   * @default false
   */
  skip?: boolean;
  children: ReactNode;
  showCloseButton?: boolean;
  defaultZoom?: string;
}

const noop = () => {};
export const SingleBoardViewProvider: FunctionComponent<
  SingleBoardViewProviderProps
> = ({
  idBoard,
  navigateToCard = noop,
  includeChecklistItems = false,
  isDateBasedView = false,
  skip = false,
  children,
  showCloseButton,
  defaultZoom,
}: SingleBoardViewProviderProps) => {
  const memberId = useMemberId();
  const {
    viewFilters: { filters },
  } = useContext(ViewFiltersContext);

  //Currently filtered to only return due checkItems.
  //If other checkItems are needed for Views, may need server change.
  //card_checklists is rate-limited by checklists by API call and board/:id/checklists
  //currently returns all board checklists, regardless of archive status
  const dataWithDueChecklists = useSingleBoardDataQuery({
    skip: skip || !includeChecklistItems,
    variables: { idBoard },
    waitOn: ['CurrentBoardInfo', 'CurrentBoardListsCards'],
  });

  const dataWithoutChecklists = useSingleBoardDataWithoutChecklistsQuery({
    skip: skip || includeChecklistItems,
    variables: { idBoard },
    waitOn: ['CurrentBoardInfo', 'CurrentBoardListsCards'],
  });

  const { data, loading, error, refetch } = includeChecklistItems
    ? dataWithDueChecklists
    : dataWithoutChecklists;

  const board = data?.board;
  const boardPlugins = board?.boardPlugins;
  const cards = board?.cards;
  const lists = board?.lists;
  const customFields = board?.customFields;

  const { newlyCreatedCardIds, onNewCardCreated } =
    useNewlyCreatedCardIds(filters);

  const [filteredCards, filteredChecklistItems] = useMemo(() => {
    const isSingleBoardFiltering = filters.isFiltering();

    const visibleCards = cards?.filter((card) => !card.isTemplate) ?? [];

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const filteredCards = isSingleBoardFiltering
      ? visibleCards.filter(
          (card) =>
            newlyCreatedCardIds.includes(card.id) ||
            filters.checkFilterableCard(
              idBoard,
              card,
              customFields ?? [],
              isCustomFieldsEnabled(boardPlugins || []),
            ),
        )
      : visibleCards;

    const cardComparator = filters.sort.getComparator(lists);
    filteredCards.sort(cardComparator);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const filteredChecklistItems = includeChecklistItems
      ? visibleCards.flatMap((card) =>
          (card as CardWithChecklistDefined)?.checklists?.flatMap((checklist) =>
            checklist.checkItems
              .filter(
                (item) =>
                  // SingleBoardData is filtered by 'due' as it
                  // is currently the only checkItems we need.
                  // If we change the data to get more checklists,
                  // We may need to re-implement 'due' checks
                  !isSingleBoardFiltering ||
                  filters.checkAdvancedChecklistItem({
                    ...item,
                    // Pass the cards labels so we can satisfy labels filters
                    // in calendar view
                    labels: card?.labels ?? [],
                  }),
              )
              .map((item) => ({
                item,
                checklist: omit(checklist, 'checkitems'),
                card: omit(card, 'checklists'),
              })),
          ),
        )
      : [];

    return [filteredCards, filteredChecklistItems];
  }, [
    boardPlugins,
    cards,
    customFields,
    filters,
    includeChecklistItems,
    lists,
    newlyCreatedCardIds,
    idBoard,
  ]);

  const boardsData: BoardViewContextValue['boardsData'] = useMemo(
    () => ({
      boardsDataContextType: 'board',
      boards: data?.board ? [omit(data?.board, 'cards')] : undefined,
      isLoading: loading,
      error,
      dangerous_refetch: refetch,
    }),
    [data?.board, refetch, error, loading],
  );

  const cardsData: BoardViewContextValue['cardsData'] = useMemo(
    () => ({
      cards: filteredCards,
      isLoading: loading,
      isLoadingInitial: loading,
      error,
      loadMore: () => {},
      canLoadMore: false,
      isLoadingMore: false,
      setSortBy: () => {},
      total: filteredCards.length,
    }),
    [loading, error, filteredCards],
  );

  const checklistItemData = useMemo(
    () => ({
      checklistItems: filteredChecklistItems,
    }),
    [filteredChecklistItems],
  );

  const getLinkToCardProps: BoardViewContextValue['getLinkToCardProps'] =
    useCallback(
      ({ idCard, cardUrl, onClick }) => {
        return {
          href: cardUrl ?? '#',
          onClick: (e: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) => {
            if (idCard) {
              e.preventDefault();
              navigateToCard(idCard);

              onClick?.(e);
            }
          },
        };
      },
      [navigateToCard],
    );

  const {
    data: permissionQueryData,
    error: permissionQueryError,
    loading: permissionQueryLoading,
  } = usePermissionsBoardQuery({
    variables: {
      boardId: idBoard,
      memberId,
    },
    waitOn: ['MemberHeader', 'MemberBoards'],
  });

  const canEditBoard = useCallback(
    (_: string) => {
      if (permissionQueryError || permissionQueryLoading) {
        return false;
      }
      if (permissionQueryData?.member && data?.board) {
        return canEdit(
          permissionQueryData.member,
          data.board,
          permissionQueryData?.board?.organization || null,
          permissionQueryData?.board?.organization?.enterprise || null,
        );
      }
      return false;
    },
    [
      permissionQueryData?.member,
      permissionQueryData?.board?.organization,
      permissionQueryError,
      permissionQueryLoading,
      data?.board,
    ],
  );

  const getRelativePosition = useCallback(
    (idList: string, idCard?: string) => {
      if (!cards || !idCard) {
        return undefined;
      }

      const cardsInList = cards
        .filter((card) => card.idList === idList)
        .sort((a, b) => a.pos - b.pos);

      const indexOfCard = cardsInList.findIndex((card) => card.id === idCard);
      const cardBefore =
        indexOfCard !== -1 ? cardsInList[indexOfCard] : undefined;
      const cardAfter =
        indexOfCard !== -1 ? cardsInList[indexOfCard + 1] : undefined;

      if (cardBefore && cardAfter) {
        return (cardBefore.pos + cardAfter.pos) / 2;
      } else if (cardBefore) {
        return cardBefore.pos + Util.spacing;
      }
    },
    [cards],
  );

  const contextValue = useMemo(
    (): BoardViewContextValue => ({
      contextType: 'board',
      boardsData,
      cardsData,
      checklistItemData,
      navigateToCard,
      getLinkToCardProps,
      getRelativePosition,
      onNewCardCreated,
      canEditBoard,
      idBoard,
      idOrg: data?.board?.idOrganization || undefined,
      isDateBasedView,
      showCloseButton,
      defaultZoom,
    }),
    [
      boardsData,
      cardsData,
      checklistItemData,
      navigateToCard,
      getLinkToCardProps,
      getRelativePosition,
      onNewCardCreated,
      canEditBoard,
      idBoard,
      data?.board?.idOrganization,
      isDateBasedView,
      showCloseButton,
      defaultZoom,
    ],
  );

  return (
    <BoardViewContext.Provider value={contextValue}>
      {children}
    </BoardViewContext.Provider>
  );
};
