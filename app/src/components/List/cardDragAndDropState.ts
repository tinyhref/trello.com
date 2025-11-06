import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { SharedState } from '@trello/shared-state';

interface CardDragAndDropState {
  cardId: string | null;
  originalListId: string | null;
  originalPosition: number | null;
  currentClosestEdge: Edge | null;
  currentListId: string | null;
  currentPosition: number | null;
  previewHeight: number;
}

const initialState: CardDragAndDropState = {
  cardId: null,
  originalListId: null,
  originalPosition: null,
  currentClosestEdge: null,
  currentListId: null,
  currentPosition: null,
  previewHeight: 36,
};

export const cardDragAndDropState = new SharedState<CardDragAndDropState>(
  initialState,
);

export const onDropCard = () => {
  cardDragAndDropState.setValue(initialState);
};
