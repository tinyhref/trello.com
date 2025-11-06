import cx from 'classnames';
import type { FunctionComponent } from 'react';
import { Fragment, useCallback, useMemo, useRef } from 'react';

import { optimisticIdManager } from '@trello/graphql';
import { useListId } from '@trello/id-context';
import { useSharedStateSelector } from '@trello/shared-state';
import type { ListTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { useBoardListsContext } from 'app/src/components/BoardListsContext';
import { useIsDragToMergeEnabled } from 'app/src/components/BulkAction/useIsDragToMergeEnabled';
import { MemoizedPossibleCardComposer } from 'app/src/components/CardComposer/PossibleCardComposer';
import { visibleCardIdsSharedState } from 'app/src/components/FilterPopover/visibleCardIdsSharedState';
import { PinnedCardSeparator } from 'app/src/components/PinnedCardSeparator';
import { cardDragAndDropState } from './cardDragAndDropState';
import { MemoizedListCard } from './ListCard';
import { ListCardDropPreview } from './ListCardDropPreview';
import { ListCardGap } from './ListCardGap';
import { useAutoScrollListCards } from './useAutoScrollListCards';
import { useIncrementalIdleItemRenderer } from './useIncrementalIdleItemRenderer';
import { useIsListCollapsed } from './useListContext';
import { useMultiCardDragAndDrop } from './useMultiCardDragAndDrop';

import * as styles from './ListCards.module.less';

// Keep this in sync with `@row-gap` in ListCards.less.
const VERTICAL_SPACE_BETWEEN_CARDS = 8;

let pageSize: number;

export const getPageSize = () => {
  if (!pageSize) {
    // Combined heights of global (48) + board (58) + list (46) headers.
    const unavailableVerticalSpace = 152;
    // Combined height of a card front with a one-line name (36).
    const minCardFrontHeight = 36 + VERTICAL_SPACE_BETWEEN_CARDS;
    const availableHeight = window.innerHeight - unavailableVerticalSpace;
    const rawPageSize = Math.ceil(availableHeight / minCardFrontHeight);
    pageSize = Math.max(rawPageSize, 15);
  }
  return pageSize;
};

interface ListCardsProps {
  className?: string;
}

export const ListCards: FunctionComponent<ListCardsProps> = ({ className }) => {
  const listId = useListId();

  const cardsRef = useRef<HTMLOListElement>(null);
  const cards = useBoardListsContext(
    useCallback((value) => value.listCards?.[listId], [listId]),
  );
  const isCollapsed = useIsListCollapsed();
  const isDragToMergeEnabled = useIsDragToMergeEnabled();

  useAutoScrollListCards(cardsRef);

  useIncrementalIdleItemRenderer({
    queueId: listId,
    items: cards ?? [],
    pageSize: getPageSize(),
    isLoading: !cards,
  });

  const { selectedCardIdsSet, isMultiDragActive } = useMultiCardDragAndDrop();

  const shouldShowDropPreview = useSharedStateSelector(
    cardDragAndDropState,
    useCallback(
      (state) => {
        // If dragging into the list but not over a card, position will be null:
        return state.currentListId === listId && state.currentPosition === null;
      },
      [listId],
    ),
  );

  const visibleCardIds = useSharedStateSelector(
    visibleCardIdsSharedState,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useCallback((state) => Array.from(state), [cards]),
  );
  const visibleCardIdsSet = useMemo(
    () =>
      new Set(
        isMultiDragActive && !isDragToMergeEnabled
          ? visibleCardIds.filter((id) => !selectedCardIdsSet.has(id))
          : visibleCardIds,
      ),
    [
      visibleCardIds,
      selectedCardIdsSet,
      isMultiDragActive,
      isDragToMergeEnabled,
    ],
  );

  const { lastVisibleCardId, secondLastVisibleCardId } = useMemo(() => {
    if (!cards?.length) {
      return {
        lastVisibleCardId: undefined,
        secondLastVisibleCardId: undefined,
      };
    }

    let _lastVisibleCardId, _secondLastVisibleCardId;
    for (let i = cards?.length - 1; i >= 0; i--) {
      if (visibleCardIdsSet.has(cards[i].id)) {
        if (!_lastVisibleCardId) {
          _lastVisibleCardId = cards[i].id;
        } else if (!_secondLastVisibleCardId) {
          _secondLastVisibleCardId = cards[i].id;
          break;
        }
      }
    }

    return {
      lastVisibleCardId: _lastVisibleCardId,
      secondLastVisibleCardId: _secondLastVisibleCardId,
    };
  }, [cards, visibleCardIdsSet]);

  const movingCardId = useSharedStateSelector(
    cardDragAndDropState,
    useCallback((state) => {
      if (
        state.currentListId === state.originalListId &&
        state.currentPosition === state.originalPosition
      ) {
        return null;
      }
      return state.cardId;
    }, []),
  );

  return (
    <>
      {(cards?.length ?? 0) - (movingCardId === lastVisibleCardId ? 1 : 0) >
        0 && !isCollapsed ? (
        <ListCardGap
          listId={listId}
          prevPosition={-1}
          position={0}
          filtered={true}
          nextPosition={cards![0].pos}
        />
      ) : null}
      <ol
        className={cx(styles.listCards, className)}
        hidden={isCollapsed}
        ref={cardsRef}
        data-testid={getTestId<ListTestIds>('list-cards')}
      >
        <MemoizedPossibleCardComposer
          prevPosition={-1}
          position={0}
          nextPosition={cards?.length ? cards[0].pos : Infinity}
        />

        {cards?.map((card, index) => {
          /**
           don't render gap if:
            - it's the last in the list (the add card button is already on the bottom)
            - it corresponds to the moving card (double gap stacking)
            - it's the second last and the last card is moving (double gap stacking) 
           however, if drag to merge is enabled, the moving card will still be visible and we should render the gap
           */
          const cardIsMoving = card.id === movingCardId;
          const secondToLastAndLastIsMoving =
            lastVisibleCardId === movingCardId &&
            card.id === secondLastVisibleCardId;
          const doNotRenderGap =
            card.id === lastVisibleCardId ||
            (!isDragToMergeEnabled &&
              (cardIsMoving || secondToLastAndLastIsMoving));

          return (
            <Fragment key={optimisticIdManager.getStableIdKey(card.id)}>
              <MemoizedListCard
                cardId={card.id}
                position={card.pos}
                filtered={visibleCardIdsSet.has(card.id)}
              />
              <MemoizedPossibleCardComposer
                prevPosition={cards[index - 1]?.pos ?? 0}
                position={card.pos}
                nextPosition={cards[index + 1]?.pos ?? Infinity}
              />

              {doNotRenderGap ? null : (
                <ListCardGap
                  listId={listId}
                  prevPosition={cards[index - 1]?.pos ?? 0}
                  position={card.pos}
                  nextPosition={cards[index + 1]?.pos ?? Infinity}
                  filtered={visibleCardIdsSet.has(card.id)}
                />
              )}

              <PinnedCardSeparator
                listCards={cards}
                currentCard={card}
                index={index}
                filtered={visibleCardIdsSet.has(card.id)}
              />
            </Fragment>
          );
        })}

        {shouldShowDropPreview && (
          <ListCardDropPreview className={styles.lastDropPreview} />
        )}
      </ol>
    </>
  );
};
