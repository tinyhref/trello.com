import type { MouseEventHandler, RefObject } from 'react';
import { useCallback } from 'react';
import { useContext } from 'use-context-selector';

import { Analytics } from '@trello/atlassian-analytics';
import { useFeatureGate } from '@trello/feature-gate-client';
import {
  useIsBoardPanelOpen,
  useIsPlannerPanelOpen,
} from '@trello/split-screen';
import { usePressTracing } from '@trello/ufo';

import type { CardType } from 'app/src/components/CardType';
import { useIsInboxBoard } from 'app/src/components/Inbox';
import { InboxModalContext } from 'app/src/components/Inbox/InboxModalContext';

/**
 * Card types that can be opened via click or Enter keypress.
 * In the future, I think this can support all card types; right now,
 * however, board & link cards are rendered in both stacks, so it's not
 * trivial to refactor them. Once the old stack has been cleaned up, I
 * think we could expand this to support click handling for all types.
 */
export const CARD_TYPES_WITH_CARD_BACK = new Set<CardType>([
  'mirror',
  'default',
  'cover',
  'planner-discovery',
]);

interface UseCardFrontClickHandlerOptions {
  cardId: string;
  cardFrontRef: RefObject<HTMLElement>;
  cardType: CardType;
  cardUrl?: string;
  openCardBackDialog: (cardId: string) => Promise<void>;
}

/**
 * Handles click events on the card front container.
 * While an anchor tag is configured as the card name for accessibility,
 * we actually want the entire card front element to be clickable.
 */
export const useCardFrontClickHandler = ({
  cardId,
  cardFrontRef,
  cardType,
  cardUrl,
  openCardBackDialog,
}: UseCardFrontClickHandlerOptions) => {
  const isInboxBoard = useIsInboxBoard();
  const { value: isSplitScreenEnabled } = useFeatureGate(
    'trello_personal_productivity_release',
  );
  const isBoardPanelOpen = useIsBoardPanelOpen();
  const isPlannerPanelOpen = useIsPlannerPanelOpen();

  const { modalId: isShowingModal, hideModal } = useContext(InboxModalContext);

  const rawTraceInteraction = usePressTracing('cardback-view-press-tracing');

  const traceInteraction = useCallback(
    (event?: Event | React.UIEvent<Element, UIEvent>) => {
      rawTraceInteraction(event);
    },
    [rawTraceInteraction],
  );

  return useCallback<MouseEventHandler>(
    (e) => {
      traceInteraction(e); // trigger UFO tracing interaction

      // Functionally just disables this callback in Storybook.
      if (!cardUrl) return;
      if (!CARD_TYPES_WITH_CARD_BACK.has(cardType)) return;
      if (!isInboxBoard && cardType === 'mirror') {
        return;
      }
      if (e.ctrlKey || e.shiftKey) {
        Analytics.sendClickedButtonEvent({
          buttonName: 'cardFrontNewTab',
          source: 'boardScreen',
          attributes: {
            key: e.ctrlKey ? 'ctrl' : 'shift',
          },
        });
        return;
      }
      // Ignore clicks on elements outside of the card front, e.g. popovers.
      if (!cardFrontRef.current?.contains(e.target as HTMLElement)) {
        return;
      }

      e.stopPropagation();
      e.preventDefault();

      // Don't open card back of non-inbox or non-planner cards if board panel is closed
      if (
        isSplitScreenEnabled &&
        !isBoardPanelOpen &&
        !isInboxBoard &&
        !isPlannerPanelOpen
      ) {
        return;
      }

      if (isShowingModal) {
        hideModal();
      }

      if (e.metaKey) {
        window.open(cardUrl, '_blank');
        return;
      }

      openCardBackDialog(cardId);
    },
    [
      traceInteraction,
      isInboxBoard,
      cardUrl,
      cardType,
      cardFrontRef,
      isSplitScreenEnabled,
      isBoardPanelOpen,
      isPlannerPanelOpen,
      isShowingModal,
      openCardBackDialog,
      cardId,
      hideModal,
    ],
  );
};
