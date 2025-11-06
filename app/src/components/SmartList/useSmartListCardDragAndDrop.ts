import type { RefObject } from 'react';
import { useCallback, useEffect } from 'react';

import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { Analytics } from '@trello/atlassian-analytics';
import { isSafari } from '@trello/browser';
import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { intl } from '@trello/i18n';
import { dismissFlag, showFlag } from '@trello/nachos/experimental-flags';
import { useSharedStateSelector } from '@trello/shared-state';

import { useCanEditBoard } from 'app/src/components/BoardPermissionsContext';
import {
  cardDragAndDropState,
  onDropCard,
} from 'app/src/components/List/cardDragAndDropState';

const SMART_LIST_CARD_DRAG_START_MESSAGE = 'smart-list-card-drag-start-message';

// idle - The card has not been picked up.
// not-moving - The card has been picked up, but not yet moved.
// moving - The card has been picked up (but has not yet been put down).
type DraggableState = 'idle' | 'moving' | 'not-moving';

type DraggableSmartListCardData = {
  type: 'trello/smart-list-card';
  /**
   * Here, the value of cardId is not the id of a Trello card, but a unique
   * identifier for the url provided by Linking Platform that a SmartList
   * represents with a SmartCard.
   */
  cardId: string;
  listId: string;
  position: number;
  previewHeight: number;
  url: string;
};

export const isDraggableSmartListCard = (
  data: Record<string | symbol, unknown>,
): data is DraggableSmartListCardData => {
  return 'type' in data && data.type === 'trello/smart-list-card';
};

interface UseSmartListCardDragAndDropOptions {
  ref: RefObject<HTMLLIElement>;
  cardFrontRef: RefObject<HTMLDivElement>;
  cardId: string;
  listId: string;
  position: number;
  url: string;
}
export function useSmartListCardDragAndDrop({
  ref,
  cardFrontRef,
  cardId,
  listId,
  position,
  url,
}: UseSmartListCardDragAndDropOptions) {
  const canEditBoard = useCanEditBoard();

  const { dismissOneTimeMessage, isOneTimeMessageDismissed } =
    useOneTimeMessagesDismissed();

  const dismissSmartListCardDragStartFlag = useCallback(() => {
    dismissFlag({ id: 'smartListCardDragStart' });
    dismissOneTimeMessage(SMART_LIST_CARD_DRAG_START_MESSAGE);
  }, [dismissOneTimeMessage]);

  const onClickSmartListSupportPage = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'smartListsManagementLink',
      source: 'boardScreen',
      attributes: { sourceFlag: 'smartListCardDragStart' },
    });
  }, []);

  const moveState: DraggableState = useSharedStateSelector(
    cardDragAndDropState,
    useCallback(
      (state) => {
        if (state.cardId !== cardId) return 'idle';
        if (
          state.currentListId === state.originalListId &&
          state.currentPosition === state.originalPosition
        ) {
          return 'not-moving';
        }
        return 'moving';
      },
      [cardId],
    ),
  );

  useEffect(() => {
    if (!ref.current || !canEditBoard) {
      return;
    }

    return draggable({
      element: ref.current,
      getInitialData: () => {
        const initialData: DraggableSmartListCardData = {
          type: 'trello/smart-list-card',
          cardId,
          listId,
          position,
          previewHeight:
            cardFrontRef.current?.getBoundingClientRect().height ?? 36,
          url,
        };

        return initialData;
      },
      onGenerateDragPreview({ nativeSetDragImage, source, location }) {
        const cardFront = cardFrontRef.current;
        if (!cardFront) return;

        setCustomNativeDragPreview({
          getOffset: preserveOffsetOnSource({
            element: source.element,
            input: location.current.input,
          }),
          render({ container }) {
            const rect = cardFront.getBoundingClientRect();
            const preview = cardFront.cloneNode(true) as HTMLDivElement;
            preview.style.width = `${rect.width}px`;
            preview.style.height = `${rect.height}px`;
            if (!isSafari()) {
              preview.style.transform = 'rotate(4deg)';
            }
            preview.style.cursor = 'grabbing';
            preview.dataset.dragPreview = 'true';
            container.appendChild(preview);
          },
          nativeSetDragImage,
        });
      },
      onDragStart: ({ source }) => {
        if (!isDraggableSmartListCard(source.data)) {
          return;
        }

        if (!isOneTimeMessageDismissed(SMART_LIST_CARD_DRAG_START_MESSAGE)) {
          showFlag({
            id: 'smartListCardDragStart',
            title: intl.formatMessage({
              id: 'templates.smart_lists.drag-and-drop-flag-title',
              defaultMessage: 'Drag and drop to copy the card',
              description:
                'Title of flag appearing on drag start of Smart List card',
            }),
            description: intl.formatMessage({
              id: 'templates.smart_lists.drag-to-copy',
              defaultMessage:
                'Drag to copy a card to another list. To remove or reorder cards in a Jira list, edit the search query.',
              description:
                'Body of flag appearing on drag start of Smart List card',
            }),
            appearance: 'info',
            actions: [
              {
                content: intl.formatMessage({
                  id: 'templates.smart_lists.how-to',
                  defaultMessage: 'How to use Jira lists',
                  description: 'Link to Jira List Support page',
                }),
                href: 'https://support.atlassian.com/trello/docs/show-a-list-of-jira-issues-in-trello/',
                onClick: onClickSmartListSupportPage,
                target: '_blank',
                type: 'link',
              },
              {
                content: intl.formatMessage({
                  id: 'templates.smart_lists.dont-show-this-again',
                  defaultMessage: "Don't show this again",
                  description: 'Button to not show this flag again',
                }),
                onClick: dismissSmartListCardDragStartFlag,
                type: 'link',
              },
            ],
            isAutoDismiss: true,
          });
        }

        cardDragAndDropState.setValue({
          cardId: source.data.cardId,
          originalListId: source.data.listId,
          originalPosition: source.data.position,
          currentListId: source.data.listId,
          currentPosition: source.data.position,
          previewHeight: source.data.previewHeight,
        });
      },
      onDrop: onDropCard,
    });
  }, [
    canEditBoard,
    cardFrontRef,
    cardId,
    dismissSmartListCardDragStartFlag,
    isOneTimeMessageDismissed,
    listId,
    onClickSmartListSupportPage,
    position,
    ref,
    url,
  ]);

  return { moveState };
}
