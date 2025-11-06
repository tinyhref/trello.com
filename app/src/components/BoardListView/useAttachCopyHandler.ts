import { useCallback, useEffect } from 'react';

import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { isElementTextbox } from '@trello/dom';
import { client } from '@trello/graphql';
import { intl } from '@trello/i18n';
import { getHighestVisibleElevation } from '@trello/layer-manager';
import { showFlag } from '@trello/nachos/experimental-flags';
import { TrelloStorage } from '@trello/storage';

import { activeCardSharedState } from 'app/src/components/CardFront/activeCardSharedState';
import {
  getURLFromSmartCardId,
  isSmartCardId,
} from 'app/src/components/SmartList/useIsSmartList';
import type {
  CardClipboardQuery,
  CardClipboardQueryVariables,
} from './CardClipboardQuery.generated';
import { CardClipboardDocument } from './CardClipboardQuery.generated';

export function useAttachCopyHandler() {
  const { isOneTimeMessageDismissed } = useOneTimeMessagesDismissed();

  const showOneTimeMessage = useCallback(
    async (eventType: 'copy' | 'cut') => {
      if (
        eventType === 'cut' &&
        !isOneTimeMessageDismissed(`pasteAlert-moveCard`)
      ) {
        setTimeout(() => {
          showFlag({
            id: 'paste-to-move',
            title: intl.formatMessage({
              id: 'templates.clipboard.paste-to-move',
              defaultMessage:
                'Paste while hovering over a list to move this card to that list',
              description:
                'When pasting a card while hovering over a list, move the card to that list.',
            }),
            appearance: 'info',
            msTimeout: 5000,
          });
        }, 2000);
      } else if (!isOneTimeMessageDismissed(`pasteAlert-copyCard`)) {
        setTimeout(() => {
          showFlag({
            id: 'paste-to-copy',
            title: intl.formatMessage({
              id: 'templates.clipboard.paste-to-copy',
              defaultMessage:
                'Paste while hovering over a list to copy this card to that list',
              description:
                'When pasting a card while hovering over a list, copy the card to that list.',
            }),

            appearance: 'info',
            msTimeout: 5000,
          });
        }, 2000);
      }
    },
    [isOneTimeMessageDismissed],
  );

  const useHandleCopy = useCallback(
    async (event: ClipboardEvent): Promise<undefined> => {
      const targetElement = event.target as HTMLElement;

      if (
        // if the user is selecting text, bail
        window.getSelection()?.toString() !== '' ||
        isElementTextbox(targetElement)
      ) {
        return;
      }

      if (getHighestVisibleElevation() > 0) {
        return;
      }

      if (!activeCardSharedState.value?.idActiveCard) {
        return;
      }

      const { data } = await client.query<
        CardClipboardQuery,
        CardClipboardQueryVariables
      >({
        query: CardClipboardDocument,
        variables: {
          idCard: activeCardSharedState.value?.idActiveCard,
        },
      });

      let url = data?.card?.url;

      /**
       * Cards within a Smart List are not real Trello cards, and don't have
       * card ids. Smart List cards are urls presented with a Smart Card.
       * Their unique identifier is created in the client.
       */
      if (!url && isSmartCardId(activeCardSharedState.value?.idActiveCard)) {
        url = getURLFromSmartCardId(activeCardSharedState.value.idActiveCard);
      }

      if (!url) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      showOneTimeMessage(event.type as 'copy' | 'cut');
      await navigator.clipboard.writeText(url);
      showFlag({
        id: 'card-copied-to-clipboard',
        title: intl.formatMessage({
          id: 'templates.clipboard.card-copied-to-clipboard',
          defaultMessage: 'Card copied to clipboard',
          description: 'The text for when a card is copied to clipboard.',
        }),
        appearance: 'success',
        msTimeout: 5000,
      });

      if (event.type === 'cut') {
        TrelloStorage.set('cut', url);
      } else {
        TrelloStorage.unset('cut');
      }
    },
    [showOneTimeMessage],
  );

  useEffect(() => {
    window.document.addEventListener('copy', useHandleCopy);
    window.document.addEventListener('cut', useHandleCopy);
    return () => {
      window.document.removeEventListener('copy', useHandleCopy);
      window.document.removeEventListener('cut', useHandleCopy);
    };
  });
}
