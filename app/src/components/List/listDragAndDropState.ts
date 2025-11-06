import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { SharedState } from '@trello/shared-state';

import { LIST_WIDTH } from './List.constants';

interface ListDragAndDropState {
  listId: string | null;
  originalPosition: number | null;
  currentPosition: number | null;
  currentClosestEdge: Edge | null;
  previewWidth: number;
  previewHeight: number;
}

const initialState: ListDragAndDropState = {
  listId: null,
  originalPosition: null,
  currentPosition: null,
  currentClosestEdge: null,
  previewWidth: LIST_WIDTH,
  previewHeight: 96,
};

export const listDragAndDropState = new SharedState<ListDragAndDropState>(
  initialState,
);

export const onDropList = () => {
  listDragAndDropState.setValue(initialState);
};
