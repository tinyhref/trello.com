import type { RefObject } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import {
  attachClosestEdge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Analytics } from '@trello/atlassian-analytics';
import { client } from '@trello/graphql';
import { intl } from '@trello/i18n';
import { useBoardId } from '@trello/id-context';
import { showFlag } from '@trello/nachos/experimental-flags';
import { useSharedStateSelector } from '@trello/shared-state';

import type { BoardOpenListsFragment } from 'app/src/components/BoardListView/BoardOpenListsFragment.generated';
import { BoardOpenListsFragmentDoc } from 'app/src/components/BoardListView/BoardOpenListsFragment.generated';
import { useCardMove } from 'app/src/components/BoardListView/useCardMove';
import { useListMove } from 'app/src/components/BoardListView/useListMove';
import { useCanEditBoard } from 'app/src/components/BoardPermissionsContext';
import {
  clearPeekedCollapsedList,
  isListCollapsed,
  peekCollapsedList,
  peekedCollapsedListIdState,
} from 'app/src/components/CollapsedListsState';
import { useBulkCardMove } from 'app/src/components/MoveCardPopover/useBulkCardMove';
import { useCreateCardFromSmartList } from 'app/src/components/SmartList/useCreateCardFromSmartList';
import { isDraggableSmartListCard } from 'app/src/components/SmartList/useSmartListCardDragAndDrop';
import { cardDragAndDropState } from './cardDragAndDropState';
import { listDragAndDropState } from './listDragAndDropState';
import { isDraggableCard } from './useCardDragAndDrop';
import { isDraggableList } from './useListHeaderAsDragHandle';
import { useMultiCardDragAndDrop } from './useMultiCardDragAndDrop';

// idle - The list has not been picked up.
// not-moving - The list has been picked up, but not yet moved.
// moving - The list has been picked up (but has not yet been put down).
type DraggableState = 'idle' | 'moving' | 'not-moving';

type DroppableListData = {
  type: 'trello/droppable-list';
  listId: string;
};

type DroppableSmartListData = {
  type: 'trello/droppable-smart-list';
  listId: string;
};

const isDroppableList = (
  data: Record<string | symbol, unknown>,
): data is DroppableListData => {
  return 'type' in data && data.type === 'trello/droppable-list';
};

const isDroppableSmartList = (
  data: Record<string | symbol, unknown>,
): data is DroppableSmartListData => {
  return 'type' in data && data.type === 'trello/droppable-smart-list';
};

interface UseListDragAndDropOptions {
  listWrapperRef: RefObject<HTMLLIElement> | RefObject<HTMLOListElement>;
  listId: string;
  position: number;
  isSmartList?: boolean;
}

export function useListAsDropTarget({
  listWrapperRef,
  listId,
  position,
  isSmartList = false,
}: UseListDragAndDropOptions) {
  const boardId = useBoardId();

  const canEditBoard = useCanEditBoard();
  const { moveCard } = useCardMove();
  const { moveListToIndex } = useListMove();
  const { createCard } = useCreateCardFromSmartList();
  const { bulkMoveCards } = useBulkCardMove();

  const { selectedCardIds, isMultiDragActive } = useMultiCardDragAndDrop();

  const moveState: DraggableState = useSharedStateSelector(
    listDragAndDropState,
    useCallback(
      (state) => {
        if (state.listId !== listId) {
          return 'idle';
        }
        return state.currentPosition === state.originalPosition
          ? 'not-moving'
          : 'moving';
      },
      [listId],
    ),
  );

  const showDropPreview = useSharedStateSelector(
    listDragAndDropState,
    useCallback(
      (state) => {
        if (state.listId === listId || state.currentPosition !== position) {
          return null;
        }
        return state.currentClosestEdge;
      },
      [listId, position],
    ),
  );

  const previewCollapsedListTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clearPreviewCollapsedListTimeout = useCallback(() => {
    if (previewCollapsedListTimeoutRef.current) {
      clearTimeout(previewCollapsedListTimeoutRef.current);
      previewCollapsedListTimeoutRef.current = null;
    }
  }, []);

  const onClickSmartListSupportPage = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'smartListsManagementLink',
      source: 'boardScreen',
      attributes: { sourceFlag: 'smartListCannotDropCard' },
    });
  }, []);

  useEffect(() => {
    if (!listWrapperRef.current || !canEditBoard) {
      return;
    }

    let timeoutId: NodeJS.Timeout;

    const cleanup = dropTargetForElements({
      element: listWrapperRef.current,
      canDrop: ({ source }) =>
        isDraggableCard(source.data) ||
        isDraggableList(source.data) ||
        isDraggableSmartListCard(source.data),
      getData: ({ input, element, source }) => {
        const data: DroppableListData | DroppableSmartListData = {
          type: isSmartList
            ? 'trello/droppable-smart-list'
            : 'trello/droppable-list',
          listId,
        };
        if (isDraggableList(source.data)) {
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['left', 'right'],
          });
        }
        return data;
      },
      getIsSticky: () => true,
      onDragEnter: ({ source }) => {
        if (
          !isDraggableCard(source.data) &&
          !isDraggableSmartListCard(source.data)
        ) {
          return;
        }
        cardDragAndDropState.setValue({
          currentClosestEdge: 'bottom',
          currentListId: listId,
          currentPosition: null,
        });

        // If a collapsed list has a card dragged over it for more than 500ms,
        // temporarily expand the list so that the card can be dropped with
        // precision. Don't subscribe to the shared state, for stabler renders.
        if (
          !previewCollapsedListTimeoutRef.current &&
          isListCollapsed(listId)
        ) {
          timeoutId = setTimeout(() => {
            peekCollapsedList(listId);
            previewCollapsedListTimeoutRef.current = null;
          }, 500);
          previewCollapsedListTimeoutRef.current = timeoutId;
        }
      },
      onDrag: ({ self, source }) => {
        if (isDraggableList(source.data)) {
          listDragAndDropState.setValue({
            currentClosestEdge: extractClosestEdge(self.data),
            currentPosition: position,
          });
        }
      },
      onDragLeave: ({ source }) => {
        if (
          isDraggableCard(source.data) ||
          isDraggableSmartListCard(source.data)
        ) {
          clearPreviewCollapsedListTimeout();
          if (peekedCollapsedListIdState.value === listId) {
            clearPeekedCollapsedList();
          }
        }
      },
      onDrop: async ({ source, location, self }) => {
        clearPreviewCollapsedListTimeout();

        // Smart Lists only accept draggable lists on drop
        if (isDroppableSmartList(self.data) && !isDraggableList(source.data)) {
          if (source.data.listId !== listId) {
            showFlag({
              id: 'smartListCannotDropCard',
              title: intl.formatMessage({
                id: 'templates.smart_lists.this-card-cant-be-added',
                defaultMessage: "The card can't be added to this list",
                description:
                  'Title of flag appearing on drop of card into Smart List',
              }),
              description: intl.formatMessage({
                id: 'templates.smart_lists.to-add-cards',
                defaultMessage:
                  'To add cards to a Jira list, edit the search query.',
                description:
                  'Body of flag appearing on drop of card into Smart List',
              }),
              appearance: 'error',
              actions: [
                {
                  content: intl.formatMessage({
                    id: 'templates.smart_lists.how-to',
                    defaultMessage: 'How to use Jira lists',
                    description: 'Link to Jira List Support page',
                  }),
                  href: 'https://support.atlassian.com/trello/docs/show-a-list-of-jira-issues-in-trello/',
                  onClick: onClickSmartListSupportPage,
                  target: '_blank',
                  type: 'link',
                },
              ],
              isAutoDismiss: true,
            });
            Analytics.sendUIEvent({
              action: 'viewed',
              actionSubject: 'flag',
              actionSubjectId: 'smartListCannotDropCard',
              source: 'boardScreen',
            });
          }
          return;
        }

        // If multiple drop targets are receiving this drop event, prioritize
        // the other ones; for example, if a card is dropped over a list, it may
        // also be over a specific card, which has its own drop target for more
        // precise reordering.
        if (location.current.dropTargets.length > 1) return;
        if (isDraggableCard(source.data) && isDroppableList(self.data)) {
          try {
            if (isMultiDragActive) {
              await bulkMoveCards({
                cardIds: selectedCardIds,
                listId: source.data.listId,
                idBoard: source.data.boardId,
                posIndex: 1e9,
                targetBoardId: boardId,
                targetListId: self.data.listId,
                source: 'boardScreen',
              });
              return;
            }

            await moveCard({
              cardId: source.data.cardId,
              listId: self.data.listId,
              index: 1e9,
              confettiTargetElement: listWrapperRef.current,
            });
          } catch (error) {
            // Analytics is sent in moveCard
          }
          return;
        }

        if (
          isDraggableSmartListCard(source.data) &&
          isDroppableList(self.data)
        ) {
          try {
            await createCard({
              index: 1e9,
              idList: self.data.listId,
              idListSource: source.data.listId,
              source: 'boardScreen',
              url: source.data.url,
              isDnD: true,
            });
          } catch (error) {
            // Analytics are sent in createCard
          }
        }

        if (isDraggableList(source.data)) {
          const board = client.readFragment<BoardOpenListsFragment>({
            id: `Board:${boardId}`,
            fragment: BoardOpenListsFragmentDoc,
          });
          const listsCopy = [...(board?.lists ?? [])];
          const lists = listsCopy.sort((a, b) => a.pos - b.pos);
          const listIndex = lists.findIndex(({ id }) => id === listId) ?? 1e9;

          const currentClosestEdge = extractClosestEdge(self.data);

          const isMovingLeft = position < source.data.position;
          const isMovingRight = position > source.data.position;

          let targetIndex = listIndex;
          if (currentClosestEdge === 'left' && isMovingRight) {
            targetIndex = listIndex - 1;
          } else if (currentClosestEdge === 'right' && isMovingLeft) {
            targetIndex = listIndex + 1;
          }

          moveListToIndex(source.data.listId, targetIndex);
        }
      },
    });

    return () => {
      cleanup();
      clearTimeout(timeoutId);
    };
  }, [
    boardId,
    canEditBoard,
    clearPreviewCollapsedListTimeout,
    createCard,
    isSmartList,
    listId,
    listWrapperRef,
    bulkMoveCards,
    moveCard,
    moveListToIndex,
    onClickSmartListSupportPage,
    position,
    isMultiDragActive,
    selectedCardIds,
  ]);

  return { moveState, showDropPreview };
}
