import { useCallback, useEffect } from 'react';

import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import type { DropTargetRecord } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
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
import {
  attachClosestEdge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { useFeatureGate } from '@trello/feature-gate-client';

import { useCanAddFileType } from 'app/src/components/BoardListView/useCanAddFileType';
import { useCanEditBoard } from 'app/src/components/BoardPermissionsContext';
import { cardDragAndDropState } from 'app/src/components/List/cardDragAndDropState';
import { useCardDragFragment } from 'app/src/components/List/CardDragFragment.generated';
import { dragFileSharedState } from './dragFileSharedState';
import { useHandleDropTrelloCard } from './useHandleDropTrelloCard';
import { useIsOverAttachmentLimits } from './useIsOverAttachmentLimits';
import { usePasteFilesOnCard } from './usePasteFilesOnCard';
import { usePasteTextOnCard } from './usePasteTextOnCard';

function containsTrelloCard({ source }: { source: ExternalDragPayload }) {
  return source.types.includes('application/vnd.trello.card');
}

type DroppableCardData = {
  type: 'trello/droppable-card';
  cardId: string;
  listId: string;
  position?: number;
};

interface UseCardDropExternalOptions {
  cardFrontRef: React.RefObject<HTMLDivElement>;
  listId: string;
  cardId: string;
}

export function useCardDropExternalWithCardData({
  cardFrontRef,
  listId,
  cardId,
}: UseCardDropExternalOptions) {
  const { data: cardData } = useCardDragFragment({ from: { id: cardId } });
  const position = cardData?.pos ?? 0;
  const cardType = cardData?.cardRole ?? 'default';

  const { handleDropTrelloCard } = useHandleDropTrelloCard({ cardId });

  const { canAddFileType } = useCanAddFileType();
  const { isOverAttachmentLimits } = useIsOverAttachmentLimits();

  const canEditBoard = useCanEditBoard();

  const { pasteFilesOnCard } = usePasteFilesOnCard();
  const { pasteTextOnCard } = usePasteTextOnCard();

  const { value: isExternalCardDataEnabled } = useFeatureGate(
    'trello_xf_use_card_drag_external',
  );

  const dropFiles = useCallback(
    async (items: DataTransferItem[] | null) => {
      dragFileSharedState.setValue({ cardId: null, fileState: null });
      if (!items || !canAddFileType('computer')) {
        return;
      }

      const files = [...items]
        .filter((item) => item.kind === 'file')
        .map((item) => item.getAsFile())
        .filter((file) => file !== null) as File[];

      if (files) {
        pasteFilesOnCard(files, cardId);
        return;
      }
    },
    [canAddFileType, cardId, pasteFilesOnCard],
  );

  const dragEnter = useCallback(async () => {
    if (cardType !== 'default') {
      return;
    }
    const fileState = canAddFileType('computer')
      ? (await isOverAttachmentLimits(cardId))
        ? 'limited'
        : 'hover'
      : 'restricted';
    dragFileSharedState.setValue({ cardId, fileState });
  }, [canAddFileType, cardId, cardType, isOverAttachmentLimits]);

  const handleDrop = useCallback(
    (source: ExternalDragPayload, self: DropTargetRecord) => {
      if (cardType !== 'default') {
        return;
      }
      if (containsTrelloCard({ source })) {
        handleDropTrelloCard(source, self);
        return;
      }
      const files = getFiles({ source });
      if (files.length > 0) {
        dropFiles(source?.items ? [...source.items] : null);
        return;
      }
      const text = getText({ source });
      if (text) {
        dragFileSharedState.setValue({ cardId: null, fileState: null });
        pasteTextOnCard(text, cardId);
        return;
      }
      const urls = getURLs({ source });
      for (const url of urls) {
        dragFileSharedState.setValue({ cardId: null, fileState: null });
        pasteTextOnCard(url, cardId);
      }
    },
    [cardId, cardType, dropFiles, handleDropTrelloCard, pasteTextOnCard],
  );

  useEffect(() => {
    if (!cardFrontRef.current || !canEditBoard || !isExternalCardDataEnabled) {
      return;
    }

    return combine(
      dropTargetForExternal({
        element: cardFrontRef.current,
        onDrop: ({ source, self }) => {
          handleDrop(source, self);
          dragFileSharedState.setValue({ cardId: null, fileState: null });
        },
        onDragEnter: ({ source }) => {
          if (!source.types.includes('application/vnd.trello.card')) {
            dragEnter();
          }
        },
        onDragLeave: () => {
          dragFileSharedState.setValue({ cardId: null, fileState: null });
        },
        getData: ({ source, input, element }) => {
          if (!source.types.includes('application/vnd.trello.card')) {
            return {};
          }

          const data: DroppableCardData = {
            type: 'trello/droppable-card',
            cardId,
            listId,
            position,
          };

          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['top', 'bottom'],
          });
        },
        onDrag: ({ self, source }) => {
          if (!containsTrelloCard({ source })) {
            return;
          }

          cardDragAndDropState.setValue({
            currentClosestEdge: extractClosestEdge(self.data),
            currentListId: listId,
            currentPosition: position,
          });
        },
        getIsSticky: () => true,
      }),
      monitorForExternal({
        onDrop: () => {
          dragFileSharedState.setValue({ cardId: null, fileState: null });
          cardDragAndDropState.setValue({
            currentClosestEdge: null,
            currentListId: null,
            currentPosition: null,
          });
        },
        canMonitor: some(
          containsFiles,
          containsText,
          containsURLs,
          containsTrelloCard,
        ),
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    canEditBoard,
    cardId,
    dragEnter,
    dropFiles,
    isOverAttachmentLimits,
    pasteFilesOnCard,
    isExternalCardDataEnabled,
    cardFrontRef.current,
  ]);
}
