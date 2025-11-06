import type { RefObject } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import type { DragLocationHistory } from '@atlaskit/pragmatic-drag-and-drop/dist/types/entry-point/types';
import type { ExternalDragPayload } from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
import {
  dropTargetForExternal,
  monitorForExternal,
} from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
import {
  containsFiles,
  getFiles,
} from '@atlaskit/pragmatic-drag-and-drop/external/file';
import { some } from '@atlaskit/pragmatic-drag-and-drop/external/some';
import {
  containsText,
  getText,
} from '@atlaskit/pragmatic-drag-and-drop/external/text';
import {
  containsURLs,
  getURLs,
} from '@atlaskit/pragmatic-drag-and-drop/external/url';
import { useFeatureGate } from '@trello/feature-gate-client';
import { useBoardId } from '@trello/id-context';

import { useCanEditBoard } from 'app/src/components/BoardPermissionsContext';
import {
  clearPeekedCollapsedList,
  isListCollapsed,
  peekCollapsedList,
  peekedCollapsedListIdState,
} from 'app/src/components/CollapsedListsState';
import { cardDragAndDropState } from './cardDragAndDropState';
import { usePasteFilesOnList } from './usePasteFilesOnList';
import { usePasteTextOnList } from './usePasteTextOnList';

function containsTrelloCard({ source }: { source: ExternalDragPayload }) {
  return source.types.includes('application/vnd.trello.card');
}

interface UseListDropExternalOptions {
  listRef: RefObject<HTMLDivElement>;
  listId: string;
}

export function useListDropExternal({
  listRef,
  listId,
}: UseListDropExternalOptions) {
  const boardId = useBoardId();

  const canEditBoard = useCanEditBoard();
  const { pasteFilesOnList } = usePasteFilesOnList();
  const { pasteTextOnList } = usePasteTextOnList();

  const { value: isExternalCardDataEnabled } = useFeatureGate(
    'trello_xf_use_card_drag_external',
  );

  const dropFiles = useCallback(
    async (files: File[]) => {
      if (!files) {
        return;
      }
      pasteFilesOnList(files, listId);
    },
    [listId, pasteFilesOnList],
  );

  const previewCollapsedListTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clearPreviewCollapsedListTimeout = useCallback(() => {
    if (previewCollapsedListTimeoutRef.current) {
      clearTimeout(previewCollapsedListTimeoutRef.current);
      previewCollapsedListTimeoutRef.current = null;
    }
  }, []);

  const handleDrop = useCallback(
    async (source: ExternalDragPayload, location: DragLocationHistory) => {
      clearPreviewCollapsedListTimeout();
      if (location.current?.dropTargets[0].element !== listRef.current) {
        return;
      }
      const files = getFiles({ source });
      if (files.length > 0) {
        dropFiles(files);
        return;
      }
      const text = getText({ source });
      if (text) {
        await pasteTextOnList(text, listId);
        return;
      }
      const urls = getURLs({ source });
      for (const url of urls) {
        await pasteTextOnList(url, listId);
      }
    },
    [
      clearPreviewCollapsedListTimeout,
      dropFiles,
      listId,
      listRef,
      pasteTextOnList,
    ],
  );

  useEffect(() => {
    if (!listRef.current || !canEditBoard || !isExternalCardDataEnabled) {
      return;
    }

    const element = listRef.current;
    let timeoutId: NodeJS.Timeout;

    const cleanupDragAndDrop = combine(
      dropTargetForExternal({
        element,
        onDrop: ({ source, location }) => {
          handleDrop(source, location);
        },
        onDragEnter: ({ source }) => {
          if (!containsTrelloCard({ source })) {
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
        onDragLeave: ({ source }) => {
          if (containsTrelloCard({ source })) {
            clearPreviewCollapsedListTimeout();
            if (peekedCollapsedListIdState.value === listId) {
              clearPeekedCollapsedList();
            }
          }
        },
      }),
      monitorForExternal({
        canMonitor: some(containsFiles, containsText, containsURLs),
      }),
    );

    return () => {
      cleanupDragAndDrop();
      clearTimeout(timeoutId);
    };
  }, [
    boardId,
    canEditBoard,
    clearPreviewCollapsedListTimeout,
    dropFiles,
    handleDrop,
    isExternalCardDataEnabled,
    listId,
    listRef,
    pasteFilesOnList,
  ]);
}
