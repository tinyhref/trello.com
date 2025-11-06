import type { RefObject } from 'react';
import { useCallback, useEffect } from 'react';

import { useFeatureGate } from '@trello/feature-gate-client';
import { useBoardId } from '@trello/id-context';

import { useCanEditBoard } from 'app/src/components/BoardPermissionsContext';
import { usePasteTextOnList } from './usePasteTextOnList';

interface UseListDropTextOptions {
  listRef: RefObject<HTMLDivElement>;
  listId: string;
}

export function useListDropText({ listRef, listId }: UseListDropTextOptions) {
  const boardId = useBoardId();

  const canEditBoard = useCanEditBoard();
  const { pasteTextOnList } = usePasteTextOnList();
  const list = listRef.current;

  const { value: isExternalCardDataEnabled, loading: externalCardGateLoading } =
    useFeatureGate('trello_xf_use_card_drag_external');

  const dropListener = useCallback(
    async (event: DragEvent) => {
      const text =
        event.dataTransfer?.getData('text') ||
        event.dataTransfer?.getData('text/uri-list');

      if (!text) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      await pasteTextOnList(text, listId);
    },
    [listId, pasteTextOnList],
  );

  useEffect(() => {
    if (
      !list ||
      !canEditBoard ||
      externalCardGateLoading ||
      isExternalCardDataEnabled
    ) {
      return;
    }

    // eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop
    list.addEventListener('drop', dropListener);
    return () => {
      list?.removeEventListener('drop', dropListener);
    };
  }, [
    boardId,
    canEditBoard,
    dropListener,
    externalCardGateLoading,
    isExternalCardDataEnabled,
    list,
    pasteTextOnList,
  ]);
}
