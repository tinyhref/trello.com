import type { RefObject } from 'react';
import { useCallback, useEffect } from 'react';

import {
  attachClosestEdge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { once } from '@atlaskit/pragmatic-drag-and-drop/once';
import type { SourceType } from '@trello/analytics-types';
import { Analytics } from '@trello/atlassian-analytics';
import { isSafari } from '@trello/browser';
import { sendErrorEvent } from '@trello/error-reporting';
import { useFeatureGate } from '@trello/feature-gate-client';
import { client } from '@trello/graphql';
import { useBoardId } from '@trello/id-context';
import { showFlag } from '@trello/nachos/experimental-flags';
import type { PersonalWorkspaceIds } from '@trello/personal-workspace';
import { useMemberInboxIds } from '@trello/personal-workspace';
import { useSharedStateSelector } from '@trello/shared-state';
import { token } from '@trello/theme';

import { useCardMove } from 'app/src/components/BoardListView/useCardMove';
import { useCanEditBoard } from 'app/src/components/BoardPermissionsContext';
import { useIsDragToMergeEnabled } from 'app/src/components/BulkAction/useIsDragToMergeEnabled';
import { useBulkCardMove } from 'app/src/components/MoveCardPopover/useBulkCardMove';
import { useCreateCardFromSmartList } from 'app/src/components/SmartList/useCreateCardFromSmartList';
import { isDraggableSmartListCard } from 'app/src/components/SmartList/useSmartListCardDragAndDrop';
import { cardDragAndDropState, onDropCard } from './cardDragAndDropState';
import { CardDragFragmentDoc } from './CardDragFragment.generated';
import { readListVisibleCardsFromCache } from './readListVisibleCardsFromCache';
import { useMultiCardDragAndDrop } from './useMultiCardDragAndDrop';

// idle - The card has not been picked up.
// not-moving - The card has been picked up, but not yet moved.
// moving - The card has been picked up (but has not yet been put down).
type DraggableState = 'idle' | 'moving' | 'not-moving';

type DraggableCardData = {
  type: 'trello/card';
  cardId: string;
  listId: string;
  boardId: string;
  position: number;
  previewHeight: number;
};

type DroppableCardData = {
  type: 'trello/droppable-card';
  cardId: string;
  listId: string;
  position: number;
};

export const isDraggableCard = (
  data: Record<string | symbol, unknown>,
): data is DraggableCardData => {
  return 'type' in data && data.type === 'trello/card';
};

interface UseCardDragAndDropOptions {
  ref: RefObject<HTMLLIElement>;
  cardFrontRef: RefObject<HTMLDivElement>;
  dropPreviewTopRef: RefObject<HTMLDivElement>;
  dropPreviewBottomRef: RefObject<HTMLDivElement>;
  cardId: string;
  listId: string;
  position: number;
  sourceType?: SourceType;
}

const showErrorFlag = (error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : '';
  let title;
  if (errorMessage === 'ENTERPRISE_OWNED_ENTITY') {
    title = "Can't move enterprise owned card";
  } else {
    title = 'Error moving card';
    // Send unknown error to Sentry
    sendErrorEvent(error);
  }

  showFlag({
    id: 'moveerror',
    title,
    appearance: 'error',
    isAutoDismiss: true,
    msTimeout: 2000,
  });
};

export function useCardDragAndDrop({
  ref,
  cardFrontRef,
  dropPreviewTopRef,
  dropPreviewBottomRef,
  cardId,
  listId,
  position,
  sourceType,
}: UseCardDragAndDropOptions) {
  const boardId = useBoardId();
  const canEditBoard = useCanEditBoard();
  const { moveCard } = useCardMove();
  const { createCard } = useCreateCardFromSmartList();
  const { bulkMoveCards } = useBulkCardMove();

  const inboxIds: Partial<PersonalWorkspaceIds> = useMemberInboxIds();

  const { value: isExternalCardDragEnabled } = useFeatureGate(
    'trello_xf_use_card_drag_external',
  );

  const isDragToMergeEnabled = useIsDragToMergeEnabled();

  const {
    selectedCardIds,
    isMultiDragDisabled,
    isMultiDrag,
    isMultiDragActive,
    computeSameListMultiDropIndex,
  } = useMultiCardDragAndDrop(cardId);

  const moveState: DraggableState = useSharedStateSelector(
    cardDragAndDropState,
    useCallback(
      (state) => {
        if (isMultiDragActive && selectedCardIds.includes(cardId)) {
          return 'moving';
        }
        if (state.cardId !== cardId) return 'idle';
        if (
          state.currentListId === state.originalListId &&
          state.currentPosition === state.originalPosition
        ) {
          return 'not-moving';
        }
        return 'moving';
      },
      [cardId, isMultiDragActive, selectedCardIds],
    ),
  );

  const showDropPreview = useSharedStateSelector(
    cardDragAndDropState,
    useCallback(
      // We only want to show the drop preview above or below the card that's
      // currently being hovered over:
      (state) => {
        if (
          state.cardId === cardId ||
          state.currentListId !== listId ||
          state.currentPosition !== position
        ) {
          return null;
        }
        return state.currentClosestEdge;
      },
      [cardId, listId, position],
    ),
  );

  const findPreviousAndNextCardIdsCallback = useCallback(() => {
    const cards = readListVisibleCardsFromCache({ boardId, listId });
    const cardIndex = cards.findIndex(({ id }) => id === cardId);
    const previousCardId = cards[cardIndex - 1]?.id;
    const nextCardId = cards[cardIndex + 1]?.id;
    return { previousCardId, nextCardId };
  }, [boardId, listId, cardId]);

  const findPreviousAndNextCardIds = once(findPreviousAndNextCardIdsCallback);

  useEffect(() => {
    if (!ref.current || !canEditBoard) {
      return;
    }

    if (isMultiDrag && isMultiDragDisabled) {
      return;
    }

    return combine(
      draggable({
        element: ref.current,
        getInitialData: () => {
          const initialData: DraggableCardData = {
            type: 'trello/card',
            cardId,
            listId,
            boardId,
            position,
            previewHeight:
              cardFrontRef.current?.getBoundingClientRect().height ?? 36,
          };

          return initialData;
        },
        onGenerateDragPreview({ nativeSetDragImage, source, location }) {
          const cardFront = cardFrontRef.current;
          if (!cardFront) return;

          setCustomNativeDragPreview({
            getOffset: preserveOffsetOnSource({
              element: source.element,
              input: location.current.input,
            }),
            render({ container }) {
              const rect = cardFront.getBoundingClientRect();

              const wrapper = document.createElement('div');
              wrapper.style.position = 'relative';
              wrapper.style.width = `${rect.width}px`;
              wrapper.style.height = `${rect.height}px`;

              const preview = cardFront.cloneNode(true) as HTMLDivElement;
              preview.style.width = `${rect.width}px`;
              preview.style.height = `${rect.height}px`;
              preview.style.cursor = 'grabbing';
              preview.dataset.dragPreview = 'true';
              wrapper.appendChild(preview);

              if (isMultiDrag) {
                const maxAdditionalPreviewCards = 5;
                const numAdditionalCards = Math.min(
                  selectedCardIds.length - 1,
                  maxAdditionalPreviewCards,
                );
                const cardHorizontalOffset = 2;
                const cardVerticalOffset = 6;

                for (let i = 1; i <= numAdditionalCards; i += 1) {
                  const card = document.createElement('div');
                  card.style.position = 'absolute';
                  card.style.width = `${rect.width}px`;
                  card.style.height = `${rect.height}px`;
                  card.style.right = `${cardHorizontalOffset * i}px`;
                  card.style.top = `${cardVerticalOffset * i}px`;
                  card.style.zIndex = String(-i);
                  card.style.borderRadius = token('radius.large', '8px');
                  card.style.backgroundColor = token(
                    'elevation.surface.raised',
                    '#FFFFFF',
                  );
                  card.style.boxShadow = token(
                    'elevation.shadow.raised',
                    '0px 1px 1px #091E4240, 0px 0px 1px #091E424F',
                  );
                  card.dataset.testid = `drag-preview-${i}`;
                  wrapper.appendChild(card);
                }
              }

              if (!isSafari()) {
                wrapper.style.transform = 'rotate(4deg)';
              }
              container.appendChild(wrapper);
            },
            nativeSetDragImage,
          });
        },
        onDragStart: (data) => {
          const { source } = data;
          if (!isDraggableCard(source.data)) {
            return;
          }

          cardDragAndDropState.setValue({
            cardId: source.data.cardId,
            originalListId: source.data.listId,
            originalPosition: source.data.position,
            currentListId: source.data.listId,
            currentPosition: source.data.position,
            previewHeight: source.data.previewHeight,
          });
        },
        onDrop: onDropCard,
        getInitialDataForExternal: () => {
          if (isExternalCardDragEnabled) {
            const cardData = client.readFragment({
              id: `Card:${cardId}`,
              fragment: CardDragFragmentDoc,
              fragmentName: 'CardDrag',
            });
            if (!cardData) {
              return {};
            }
            const { name: cardName, cardRole } = cardData;
            return {
              'application/vnd.trello.card': JSON.stringify({
                url: `${window.location.origin}/c/${cardId}`,
                cardId,
                listId,
                boardId,
                position,
                role: cardRole,
                previewHeight:
                  cardFrontRef.current?.getBoundingClientRect().height ?? 36,
              }),
              'text/plain': cardName,
              'text/uri-list': `${window.location.origin}/c/${cardId}`,
            };
          }
          return {};
        },
      }),
      dropTargetForElements({
        element: ref.current,
        canDrop: ({ source }) =>
          isDraggableCard(source.data) || isDraggableSmartListCard(source.data),
        getIsSticky: () => true,
        getData: ({ input, element }) => {
          const data: DroppableCardData = {
            type: 'trello/droppable-card',
            cardId,
            listId,
            position,
          };

          if (isDragToMergeEnabled && !isMultiDragActive) {
            const { previousCardId, nextCardId } = findPreviousAndNextCardIds();
            const dndState = cardDragAndDropState.value;
            // if the card is being dragged above the previous card, restrict the allowed edges to bottom
            if (
              previousCardId &&
              dndState.cardId &&
              dndState.cardId === previousCardId
            ) {
              return attachClosestEdge(data, {
                input,
                element,
                allowedEdges: ['bottom'],
              });
            }
            // if the card is being dragged below the next card, restrict the allowed edges to top
            if (
              nextCardId &&
              dndState.cardId &&
              dndState.cardId === nextCardId
            ) {
              return attachClosestEdge(data, {
                input,
                element,
                allowedEdges: ['top'],
              });
            }
          }

          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['top', 'bottom'],
          });
        },
        // Allows us to detect whether the card is being moved above or below the drop target and show the card placeholder in the right place
        onDrag: ({ self }) => {
          cardDragAndDropState.setValue({
            currentClosestEdge: extractClosestEdge(self.data),
            currentListId: listId,
            currentPosition: position,
          });
        },
        onDrop: async ({ source, self }) => {
          const currentClosestEdge = extractClosestEdge(self.data);
          const cards = readListVisibleCardsFromCache({ boardId, listId });
          const cardIndex =
            cards.findIndex(({ id }) => id === cardId) ?? cards.length;

          const confettiTargetElement =
            currentClosestEdge === 'top'
              ? dropPreviewTopRef.current
              : dropPreviewBottomRef.current;

          if (
            isDraggableSmartListCard(source.data) &&
            listId !== source.data.listId
          ) {
            try {
              await createCard({
                index:
                  currentClosestEdge === 'bottom' ? cardIndex + 1 : cardIndex,
                idList: listId,
                idListSource: source.data.listId,
                source: 'boardScreen',
                url: source.data.url,
                isDnD: true,
              });
            } catch (error) {
              // Analytics are sent in createCard
            }
          }

          if (!isDraggableCard(source.data)) {
            return;
          }

          if (listId !== source.data.listId) {
            const newCardIndex =
              currentClosestEdge === 'bottom' ? cardIndex + 1 : cardIndex;
            try {
              if (isMultiDragActive) {
                await bulkMoveCards({
                  cardIds: selectedCardIds,
                  listId: source.data.listId,
                  idBoard: source.data.boardId,
                  posIndex: newCardIndex,
                  targetBoardId: boardId,
                  targetListId: listId,
                  source: sourceType ?? 'boardScreen',
                });
                return;
              }

              await moveCard({
                cardId: source.data.cardId,
                listId,
                index: newCardIndex,
                confettiTargetElement,
                sourceType,
              });
            } catch (error) {
              // Analytics is sent in moveCard
              showErrorFlag(error);
            }
          } else {
            const isMovingDown = position > source.data.position;
            const isMovingUp = position < source.data.position;

            let newCardIndex = cardIndex;
            if (currentClosestEdge === 'top' && isMovingDown) {
              newCardIndex = cardIndex - 1;
            } else if (currentClosestEdge === 'bottom' && isMovingUp) {
              newCardIndex = cardIndex + 1;
            }

            try {
              if (isMultiDragActive) {
                const newMultiCardIndex = computeSameListMultiDropIndex(
                  cards,
                  currentClosestEdge,
                );

                await bulkMoveCards({
                  cardIds: selectedCardIds,
                  listId: source.data.listId,
                  idBoard: source.data.boardId,
                  posIndex: newMultiCardIndex,
                  targetBoardId: boardId,
                  targetListId: listId,
                  source: sourceType ?? 'boardScreen',
                });
                return;
              }

              await moveCard({
                cardId: source.data.cardId,
                listId,
                index: newCardIndex,
                sourceType,
              });
            } catch (error) {
              // Analytics is sent in moveCard
              showErrorFlag(error);
            }
          }

          // ignore the drag action if the card is being dragged from the non-inbox board to the inbox
          if (
            inboxIds?.idBoard === boardId &&
            inboxIds?.idBoard !== source.data.boardId
          ) {
            Analytics.sendTrackEvent({
              action: 'moved',
              actionSubject: 'moveCardToInbox',
              containers: {
                board: {
                  id: source.data.boardId as string,
                },
              },
              source: 'boardScreen',
              attributes: {
                targetContainer: 'inbox',
                personalProductivity: 'inbox',
              },
            });
          }
        },
      }),
    );
  }, [
    ref,
    position,
    cardId,
    boardId,
    listId,
    canEditBoard,
    createCard,
    moveCard,
    cardFrontRef,
    dropPreviewTopRef,
    dropPreviewBottomRef,
    isExternalCardDragEnabled,
    sourceType,
    inboxIds?.idBoard,
    bulkMoveCards,
    isMultiDrag,
    isMultiDragDisabled,
    selectedCardIds,
    isMultiDragActive,
    computeSameListMultiDropIndex,
    isDragToMergeEnabled,
    findPreviousAndNextCardIds,
  ]);

  return {
    showDropPreview,
    moveState,
  };
}
