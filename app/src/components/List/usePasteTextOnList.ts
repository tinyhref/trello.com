import { useCallback } from 'react';

import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { determinePossibleCardRole } from '@trello/card-roles';
import { useBoardId } from '@trello/id-context';
import { SPACING } from '@trello/position';
import { TrelloStorage } from '@trello/storage';
import { truncate } from '@trello/strings';
import { isUrl, parseTrelloUrl } from '@trello/urls';

import { attachmentTypeFromUrl } from 'app/scripts/lib/util/url/attachment-type-from-url';
import { containsUrl } from 'app/scripts/lib/util/url/contains-url';
import {
  ClipboardAddCardToListDocument,
  useClipboardAddCardToListMutation,
} from 'app/src/components/BoardListView/ClipboardAddCardToListMutation.generated';
import { useCanAddFileType } from 'app/src/components/BoardListView/useCanAddFileType';
import { useCopyPasteCard } from 'app/src/components/BoardListView/useCopyPasteCard';
import { usePasteUrl } from 'app/src/components/BoardListView/usePasteUrl';
import { readListVisibleCardsFromCache } from './readListVisibleCardsFromCache';
import { useIsOverCardLimits } from './useIsOverCardLimits';

// Given some arbitrary text, convert it to a name (and possible description)
function processText(text: string) {
  // Get an appropriate name/description for an arbitrary blob of text
  let desc, name;
  if (/[\r\n]/.test(text)) {
    // If the text contains a newline, then use the first line as the name
    const matches = new RegExp(/^\s*([^\r\n]+)/).exec(text);
    // Protect against passing text that only contains newlines.
    const firstLine = matches?.[1] || '';

    name = truncate(firstLine, 256);
    desc = text;
  } else {
    name = truncate(text, 256);
    // If the name got clipped or contains a URL (which wouldn't be clickable)
    // then also put the text into the description
    if (name !== text || containsUrl(text)) {
      desc = text;
    } else {
      desc = '';
    }
  }

  return { name, desc };
}

export const usePasteTextOnList = () => {
  const idBoard = useBoardId();

  const { isOverCardLimits } = useIsOverCardLimits();
  const { pasteCardUrlOnList } = useCopyPasteCard();
  const { canAddFileType } = useCanAddFileType();
  const { pasteUrlOnList, pasteBoardUrlOnList } = usePasteUrl();
  const [addCardToListMutation] = useClipboardAddCardToListMutation();

  const canAddUrl = useCallback(
    (url: string) => {
      const attachmentType = attachmentTypeFromUrl(url);
      return canAddFileType(attachmentType);
    },
    [canAddFileType],
  );

  const createCardFromPastedText = useCallback(
    async (text: string, idList: string, pos: number) => {
      if (!idList) {
        return;
      }

      const traceId = Analytics.startTask({
        taskName: 'create-card/paste-text',
        source: 'cardFromClipboard',
      });

      // If uploaded text is empty or only contains newlines, we don't create a card.
      if (!text || !/[^\r\n]+/.test(text)) {
        return;
      }
      const { name, desc } = processText(text);
      const cardRole = determinePossibleCardRole({ name });

      try {
        const { data } = await addCardToListMutation({
          mutation: ClipboardAddCardToListDocument,
          variables: {
            idList,
            traceId,
            name,
            desc,
            pos,
            cardRole,
          },
        });
        Analytics.sendTrackEvent({
          action: 'created',
          actionSubject: 'card',
          source: 'cardFromClipboard',
          containers: formatContainers({
            idBoard,
            idList,
            idCard: data?.createCard?.id,
          }),
          attributes: {
            taskId: traceId,
          },
        });

        Analytics.taskSucceeded({
          taskName: 'create-card/paste-text',
          traceId,
          source: 'cardFromClipboard',
        });
      } catch (e) {
        Analytics.taskFailed({
          taskName: 'create-card/paste-text',
          traceId,
          source: 'cardFromClipboard',
          error: e,
        });
      }
    },
    [addCardToListMutation, idBoard],
  );

  const pasteTextOnList = useCallback(
    async (pastedText: string, idList: string) => {
      // show error if at limits
      if (isOverCardLimits(idList)) {
        return;
      }

      const cards = readListVisibleCardsFromCache({
        listId: idList,
        boardId: idBoard,
      });
      const pos = (idList && cards?.at(-1)?.pos) || SPACING;

      if (isUrl(pastedText)) {
        const parsedTrelloText = parseTrelloUrl(pastedText);
        const isCut = TrelloStorage.get('cut') === pastedText;
        if (parsedTrelloText?.type === 'card' && parsedTrelloText?.shortLink) {
          await pasteCardUrlOnList(
            parsedTrelloText.shortLink,
            idList,
            pos,
            isCut,
          );
        } else if (parsedTrelloText?.type === 'board') {
          await pasteBoardUrlOnList(pastedText, idList, pos);
        } else {
          if (!canAddUrl(pastedText)) {
            return;
          }
          await pasteUrlOnList(pastedText, idList, pos);
        }
      } else {
        await createCardFromPastedText(pastedText, idList, pos);
      }
    },
    [
      canAddUrl,
      createCardFromPastedText,
      idBoard,
      isOverCardLimits,
      pasteBoardUrlOnList,
      pasteCardUrlOnList,
      pasteUrlOnList,
    ],
  );

  return { pasteTextOnList };
};
