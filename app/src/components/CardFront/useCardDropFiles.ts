import { useCallback, useContext, useEffect } from 'react';

import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  dropTargetForExternal,
  monitorForExternal,
} from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
import { useFeatureGate } from '@trello/feature-gate-client';
import { useBoardId, useCardId } from '@trello/id-context';

import { useCanAddFileType } from 'app/src/components/BoardListView/useCanAddFileType';
import { useCanEditBoard } from 'app/src/components/BoardPermissionsContext';
import { CardFrontContext } from './CardFrontContext';
import { dragFileSharedState } from './dragFileSharedState';
import { useIsOverAttachmentLimits } from './useIsOverAttachmentLimits';
import { usePasteFilesOnCard } from './usePasteFilesOnCard';

export function useCardDropFiles() {
  const boardId = useBoardId();

  const cardId = useCardId();
  const { cardFrontRef } = useContext(CardFrontContext);

  const { canAddFileType } = useCanAddFileType();
  const { isOverAttachmentLimits } = useIsOverAttachmentLimits();

  const canEditBoard = useCanEditBoard();
  const { pasteFilesOnCard } = usePasteFilesOnCard();

  const { value: isExternalCardDataEnabled, loading: externalCardGateLoading } =
    useFeatureGate('trello_xf_use_card_drag_external');

  const canDropFiles = useCallback(() => {
    return canAddFileType('computer');
  }, [canAddFileType]);

  const dropFiles = useCallback(
    async (items: DataTransferItem[] | null) => {
      dragFileSharedState.setValue({ cardId: null, fileState: null });
      if (!items || !canDropFiles) {
        return;
      }

      const files = [...items]
        .filter((item) => item.kind === 'file')
        .map((item) => item.getAsFile())
        .filter((file) => file !== null) as File[];

      if (files) {
        pasteFilesOnCard(files, cardId);
      }
    },
    [canDropFiles, cardId, pasteFilesOnCard],
  );

  const dragEnter = useCallback(async () => {
    const fileState = (await canDropFiles())
      ? (await isOverAttachmentLimits(cardId))
        ? 'limited'
        : 'hover'
      : 'restricted';
    dragFileSharedState.setValue({ cardId, fileState });
  }, [canDropFiles, cardId, isOverAttachmentLimits]);

  useEffect(() => {
    if (
      !cardFrontRef.current ||
      !canEditBoard ||
      externalCardGateLoading ||
      isExternalCardDataEnabled
    ) {
      return;
    }

    return combine(
      dropTargetForExternal({
        element: cardFrontRef.current,
        onDrop: ({ source }) => {
          dropFiles(source?.items ? [...source.items] : null);
        },
        onDragEnter: () => {
          dragEnter();
        },
        onDragLeave: () => {
          dragFileSharedState.setValue({ cardId: null, fileState: null });
        },
      }),
      monitorForExternal({
        onDrop: () => {
          dragFileSharedState.setValue({ cardId: null, fileState: null });
        },
      }),
    );
  }, [
    boardId,
    canDropFiles,
    canEditBoard,
    cardId,
    cardFrontRef,
    dragEnter,
    dropFiles,
    isOverAttachmentLimits,
    pasteFilesOnCard,
    externalCardGateLoading,
    isExternalCardDataEnabled,
  ]);
}
