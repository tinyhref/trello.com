import type { RefObject } from 'react';
import { useCallback, useContext, useEffect } from 'react';

import { useFeatureGate } from '@trello/feature-gate-client';
import { useBoardId, useCardId } from '@trello/id-context';
import { isUrl } from '@trello/urls';

import { useCanAddFileType } from 'app/src/components/BoardListView/useCanAddFileType';
import { useCanEditBoard } from 'app/src/components/BoardPermissionsContext';
import { CardFrontContext } from './CardFrontContext';
import { dragFileSharedState } from './dragFileSharedState';
import { useIsOverAttachmentLimits } from './useIsOverAttachmentLimits';
import { usePasteTextOnCard } from './usePasteTextOnCard';

interface UseCardDropTextOptions {
  dropTargetRef: RefObject<HTMLElement>;
}

export function useCardDropText({ dropTargetRef }: UseCardDropTextOptions) {
  const boardId = useBoardId();

  const cardId = useCardId();
  const { cardFrontRef: cardRef } = useContext(CardFrontContext);
  const canEditBoard = useCanEditBoard();
  const card = cardRef.current;

  const { pasteTextOnCard } = usePasteTextOnCard();

  const { canAddFileType } = useCanAddFileType();
  const { isOverAttachmentLimits } = useIsOverAttachmentLimits();

  const canAddUrl = useCallback(() => {
    return canAddFileType('link');
  }, [canAddFileType]);

  const { value: isExternalCardDataEnabled, loading: externalCardGateLoading } =
    useFeatureGate('trello_xf_use_card_drag_external');

  const dropListener = useCallback(
    async (event: DragEvent) => {
      dragFileSharedState.setValue({ cardId: null, fileState: null });
      const text =
        event.dataTransfer?.getData('text') ||
        event.dataTransfer?.getData('text/uri-list');

      if (!text) {
        return;
      }

      if (isUrl(text)) {
        event.preventDefault();
        event.stopPropagation();
        await pasteTextOnCard(text, cardId);
      }
    },
    [cardId, pasteTextOnCard],
  );

  const dragEnterListener = useCallback(
    async (event: DragEvent) => {
      if (event.dataTransfer?.types.includes('text/uri-list')) {
        const fileState = (await canAddUrl())
          ? (await isOverAttachmentLimits(cardId))
            ? 'limited'
            : 'hover'
          : 'restricted';
        dragFileSharedState.setValue({ cardId, fileState });
      }
    },
    [canAddUrl, cardId, isOverAttachmentLimits],
  );

  const dragLeaveListener = useCallback(
    async (event: DragEvent) => {
      if (
        event.dataTransfer?.types.includes('text/uri-list') &&
        event.target === dropTargetRef.current
      ) {
        dragFileSharedState.setValue({ cardId: null, fileState: null });
      }
    },
    [dropTargetRef],
  );

  useEffect(() => {
    if (
      !card ||
      !canEditBoard ||
      externalCardGateLoading ||
      isExternalCardDataEnabled
    ) {
      return;
    }

    /* eslint-disable @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop */
    card.addEventListener('drop', dropListener);
    card.addEventListener('dragenter', dragEnterListener);
    card.addEventListener('dragleave', dragLeaveListener);
    return () => {
      card?.removeEventListener('drop', dropListener);
      card?.removeEventListener('dragenter', dragEnterListener);
      card?.removeEventListener('dragleave', dragLeaveListener);
    };
    /* eslint-enable @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop */
  }, [
    boardId,
    canEditBoard,
    dropListener,
    card,
    cardId,
    cardRef,
    dragEnterListener,
    dragLeaveListener,
    externalCardGateLoading,
    isExternalCardDataEnabled,
  ]);
}
