import type { RefObject } from 'react';
import { useCallback, useEffect } from 'react';

import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  dropTargetForExternal,
  monitorForExternal,
} from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
import { useFeatureGate } from '@trello/feature-gate-client';
import { useBoardId } from '@trello/id-context';

import { useCanEditBoard } from 'app/src/components/BoardPermissionsContext';
import { usePasteFilesOnList } from './usePasteFilesOnList';

interface UseListDropFilesOptions {
  listRef: RefObject<HTMLDivElement>;
  listId: string;
}

export function useListDropFiles({ listRef, listId }: UseListDropFilesOptions) {
  const boardId = useBoardId();

  const canEditBoard = useCanEditBoard();
  const { pasteFilesOnList } = usePasteFilesOnList();

  const { value: isExternalCardDataEnabled, loading: externalCardGateLoading } =
    useFeatureGate('trello_xf_use_card_drag_external');

  const dropFiles = useCallback(
    async (items: DataTransferItem[] | null) => {
      if (!items) {
        return;
      }
      const files = [...items]
        .filter((item) => item.kind === 'file')
        .map((item) => item.getAsFile())
        .filter((file) => file !== null) as File[];
      if (files) {
        pasteFilesOnList(files, listId);
      }
    },
    [listId, pasteFilesOnList],
  );

  useEffect(() => {
    if (
      !listRef.current ||
      !canEditBoard ||
      externalCardGateLoading ||
      isExternalCardDataEnabled
    ) {
      return;
    }

    return combine(
      dropTargetForExternal({
        element: listRef.current,
        onDrop: ({ source, location }) => {
          if (location.current?.dropTargets[0].element !== listRef.current) {
            return;
          }
          dropFiles(source?.items ? [...source.items] : null);
        },
      }),
      monitorForExternal({}),
    );
  }, [
    boardId,
    canEditBoard,
    dropFiles,
    externalCardGateLoading,
    isExternalCardDataEnabled,
    listRef,
    pasteFilesOnList,
  ]);
}
