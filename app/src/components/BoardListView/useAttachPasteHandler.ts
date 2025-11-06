import { useCallback, useEffect } from 'react';

import { isElementTextbox } from '@trello/dom';
import { getHighestVisibleElevation } from '@trello/layer-manager';
import { TrelloStorage } from '@trello/storage';
import { throttle } from '@trello/time';

import { useBoardListsContext } from 'app/src/components/BoardListsContext';
import { activeCardSharedState } from 'app/src/components/CardFront/activeCardSharedState';
import { usePasteFilesOnCard } from 'app/src/components/CardFront/usePasteFilesOnCard';
import { usePasteTextOnCard } from 'app/src/components/CardFront/usePasteTextOnCard';
import { useIsOverCardLimits } from 'app/src/components/List/useIsOverCardLimits';
import { usePasteFilesOnList } from 'app/src/components/List/usePasteFilesOnList';
import { usePasteTextOnList } from 'app/src/components/List/usePasteTextOnList';
import { activeListIdSharedState } from './activeListIdSharedState';

export function useAttachPasteHandler(canEditBoard: boolean) {
  const { isOverCardLimits } = useIsOverCardLimits();
  const { pasteFilesOnList } = usePasteFilesOnList();
  const { pasteFilesOnCard } = usePasteFilesOnCard();
  const { pasteTextOnList } = usePasteTextOnList();
  const { pasteTextOnCard } = usePasteTextOnCard();
  const lists = useBoardListsContext(
    useCallback((value) => value.lists, []),
  )?.map((list) => list.id);

  const handlePaste = useCallback(
    async (event: ClipboardEvent): Promise<void> => {
      if (!canEditBoard) {
        return;
      }

      // If they're pasting text into an input of some kind, just let the
      // default handling happen.
      if (isElementTextbox(event.target as Element)) {
        return;
      }

      if (getHighestVisibleElevation() > 0) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const pastedFiles = event.clipboardData?.files;
      const pastedText =
        event.clipboardData?.getData('text') ||
        (!pastedFiles?.length ? await navigator.clipboard.readText() : null);

      if (!pastedText && !pastedFiles?.length) {
        return;
      }

      const idList = activeListIdSharedState.value;

      if (!idList && !activeCardSharedState.value?.idActiveCard) {
        return;
      }

      if (!lists?.includes(idList)) {
        return;
      }

      // show error if at limits
      if (
        !activeCardSharedState.value?.idActiveCard &&
        isOverCardLimits(idList)
      ) {
        return;
      }

      // Some applications (like PowerPoint and OneNote) will put several
      // different types on the clipboard when you copy. If there is some text,
      // assume they want that (and not a picture of the text).
      if (pastedText) {
        if (activeCardSharedState.value?.idActiveCard) {
          await pasteTextOnCard(
            pastedText,
            activeCardSharedState.value.idActiveCard,
          );
          return;
        }
        await pasteTextOnList(pastedText, idList);
      } else if (pastedFiles?.length) {
        if (activeCardSharedState.value?.idActiveCard) {
          await pasteFilesOnCard(
            [...pastedFiles],
            activeCardSharedState.value.idActiveCard,
          );
          return;
        }
        await pasteFilesOnList([...pastedFiles], idList);
      }
      TrelloStorage.set('cut', false);
    },
    [
      canEditBoard,
      lists,
      isOverCardLimits,
      pasteTextOnList,
      pasteTextOnCard,
      pasteFilesOnList,
      pasteFilesOnCard,
    ],
  );

  useEffect(() => {
    const throttledPasteHandler = throttle(handlePaste, 500, {
      leading: true,
      trailing: false,
    });
    window.document.addEventListener('paste', throttledPasteHandler);
    return () => {
      window.document.removeEventListener('paste', throttledPasteHandler);
    };
  }, [canEditBoard, handlePaste]);
}
