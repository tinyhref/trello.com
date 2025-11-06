import type { RefObject } from 'react';
import { useEffect } from 'react';

import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { isSafari } from '@trello/browser';
import { useBoardId } from '@trello/id-context';
import type { ListTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { useCanEditBoard } from 'app/src/components/BoardPermissionsContext';
import { listDragAndDropState, onDropList } from './listDragAndDropState';

// 50 is an arbitrary amount for now; if we really wanted to optimize this,
// we could compare against the screen size (see `ListCards::getPageSize`).
const MAX_LIST_CARDS_CHILD_COUNT = 50;

/**
 * When we create a drag preview for a list, we clone its entire node tree.
 * However, the limit of visible cards in a single list is 5,000. This is
 * obviously untenable, so we need to prune the number of child nodes to render.
 */
const pruneListDragPreviewElementCount = (preview: HTMLElement) => {
  // eslint-disable-next-line @trello/no-query-selector
  const listCards: HTMLElement | null = preview.querySelector(
    `[data-testid=${getTestId<ListTestIds>('list-cards')}]`,
  );

  if (!listCards || listCards.childElementCount <= MAX_LIST_CARDS_CHILD_COUNT) {
    return;
  }

  const prunedChildren: Node[] = [];
  for (const childNode of listCards.children) {
    if ((childNode as HTMLElement).hidden) {
      continue;
    }

    prunedChildren.push(childNode);

    if (prunedChildren.length >= MAX_LIST_CARDS_CHILD_COUNT) {
      break;
    }
  }

  listCards.replaceChildren(...prunedChildren);
};

export type DraggableListData = {
  type: 'trello/list';
  listId: string;
  position: number;
  previewHeight: number;
  previewWidth: number;
};

export const isDraggableList = (
  data: Record<string | symbol, unknown>,
): data is DraggableListData => {
  return 'type' in data && data.type === 'trello/list';
};

interface UseListDragAndDropOptions {
  listRef: RefObject<HTMLDivElement>;
  handleRef: RefObject<HTMLDivElement>;
  listId: string;
  position: number;
}

export function useListHeaderAsDragHandle({
  listRef,
  handleRef,
  listId,
  position,
}: UseListDragAndDropOptions) {
  const boardId = useBoardId();

  const canEditBoard = useCanEditBoard();

  useEffect(() => {
    const list = listRef.current;
    const handle = handleRef.current;
    if (!list || !handle || !canEditBoard) {
      return;
    }

    return draggable({
      element: handle,
      getInitialData: (): DraggableListData => {
        const rect = list.getBoundingClientRect();
        return {
          type: 'trello/list',
          listId,
          position,
          previewWidth: rect.width,
          previewHeight: rect.height,
        };
      },
      onGenerateDragPreview({ nativeSetDragImage, source, location }) {
        disableNativeDragPreview({ nativeSetDragImage });
        setCustomNativeDragPreview({
          getOffset: preserveOffsetOnSource({
            element: source.element,
            input: location.current.input,
          }),
          render({ container }) {
            const rect = list.getBoundingClientRect();
            const preview = list.cloneNode(true) as HTMLDivElement;
            preview.style.width = `${rect.width}px`;
            preview.style.height = `${rect.height}px`;
            preview.style.maxWidth = 'revert';
            if (!isSafari()) {
              preview.style.transform = 'rotate(4deg)';
            }
            preview.style.cursor = 'grabbing';
            preview.dataset.dragPreview = 'true';
            pruneListDragPreviewElementCount(preview);
            container.appendChild(preview);
          },
          nativeSetDragImage,
        });
      },
      onDragStart: ({ source }) => {
        if (!isDraggableList(source.data)) return;

        listDragAndDropState.setValue({
          listId: source.data.listId,
          originalPosition: source.data.position,
          currentPosition: source.data.position,
          previewHeight: source.data.previewHeight,
          previewWidth: source.data.previewWidth,
        });
      },
      onDrop: onDropList,
    });
  }, [boardId, canEditBoard, handleRef, listId, listRef, position]);

  return;
}
