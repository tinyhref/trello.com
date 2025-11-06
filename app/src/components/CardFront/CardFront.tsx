import cx from 'classnames';
import type { MouseEventHandler } from 'react';
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { useForwardRef } from '@trello/dom-hooks';
import { useFeatureGate } from '@trello/feature-gate-client';
import { CardIdProvider } from '@trello/id-context';
import { TrelloStorage } from '@trello/storage';
import { getCardUrl } from '@trello/urls';

import { viewBoardTaskState } from 'app/src/components/Board/viewBoardTaskState';
import { useCanEditBoard } from 'app/src/components/BoardPermissionsContext';
import { useCardType } from 'app/src/components/CardType';
import { useIsInboxBoard } from 'app/src/components/Inbox';
import { viewInboxVitalStatsSharedState } from 'app/src/components/Inbox/viewInboxVitalStatsSharedState';
import { QuickCardEditorOverlay } from 'app/src/components/QuickCardEditor';
import { useIsKeyboardShortcutsEnabled } from 'app/src/components/Shortcuts/useIsKeyboardShortcutsEnabled';
import { CARD_ID_ATTRIBUTE } from './CardFront.constants';
import { CardFrontActions } from './CardFrontActions';
import { CardFrontContext } from './CardFrontContext';
import { useCardFrontFragment } from './CardFrontFragment.generated';
import { CardFrontKeyboardShortcutListener } from './CardFrontKeyboardShortcutListener';
import { CardFrontType } from './CardFrontType';
import { getCardFrontTestIdForCardType } from './getCardFrontTestIdForCardType';
import { openCardBack } from './openCardBack';
import { useCardFrontClickHandler } from './useCardFrontClickHandler';
import { useMultiSelectClickHandler } from './useMultiSelectClickHandler';
import { useRestoreFocusToMinimalCard } from './useRestoreFocusToMinimalCard';
import {
  disableFocusManagement,
  restoreFocusManagement,
  useSetActiveCardOnHoverOrFocus,
} from './useSetActiveCardOnHoverOrFocus';

import * as styles from './CardFront.module.less';

export type CardFrontSource = 'Board' | 'Planner';

export interface CardFrontProps {
  cardId: string;
  /**
   * Whether to render the card as a minimal card.
   * This is meant to be paired with lazy rendering techniques.
   * @default false
   */
  isMinimal?: boolean;
  /**
   * Whether to include information about the board on Trello card fronts.
   * This is used for showing cards outside of the board context, e.g. Planner.
   * Note that this setting won't be respected on non-default card types.
   * @default false
   */
  showBoardInfo?: boolean;
  /**
   * Callback for opening the card back dialog, which occurs when the card front
   * is clicked, the Enter key is pressed, or from the quick card editor.
   * @default {@link openCardBack}
   */
  openCardBackDialog?: (cardId: string) => Promise<void>;
  cardFrontSource?: CardFrontSource;
  selectedForBulkAction?: boolean;
  plannerEventCardId?: string;
}

/**
 * This component is designed to be the entry point for all card fronts.
 * It wires up logic intended to be shared across all card front types,
 * and renders the actual card front type.
 */
export const CardFront = forwardRef<HTMLDivElement, CardFrontProps>(
  (
    {
      cardId,
      isMinimal: _isMinimal = false,
      showBoardInfo = false,
      openCardBackDialog = openCardBack,
      cardFrontSource,
      plannerEventCardId,
    },
    ref,
  ) => {
    const canEditBoard = useCanEditBoard();
    const cardFrontRef = useForwardRef(ref);
    const editButtonRef = useRef<HTMLButtonElement>(null);
    const isKeyboardShortcutsEnabled = useIsKeyboardShortcutsEnabled();

    const { data } = useCardFrontFragment({
      from: { id: cardId },
      optimistic: true,
    });

    const { value: isPinnedCardsEnabled } = useFeatureGate(
      'trello_web_pinned_cards',
    );

    const isMinimal = _isMinimal || !data;
    const pinned = isPinnedCardsEnabled && data?.pinned;
    const cardType = useCardType(cardId);
    const isArchived = data?.closed;

    const cardUrl = useMemo(() => {
      if (!data?.url) return undefined;
      return getCardUrl({ url: data.url, id: cardId });
    }, [cardId, data?.url]);

    const onClick = useCardFrontClickHandler({
      cardId,
      cardFrontRef,
      cardType,
      cardUrl,
      openCardBackDialog,
    });

    const onClickCapture = useMultiSelectClickHandler({
      cardId,
    });

    const [isQuickCardEditorOpen, setIsQuickCardEditorOpen] = useState(false);

    const openQuickCardEditorOverlay = useCallback(() => {
      disableFocusManagement();
      setIsQuickCardEditorOpen(true);
    }, []);

    const closeQuickCardEditorOverlay = useCallback(async () => {
      setIsQuickCardEditorOpen(false);
      restoreFocusManagement();
    }, [setIsQuickCardEditorOpen]);

    const handleContextMenu: MouseEventHandler<HTMLDivElement> = useCallback(
      (event) => {
        if (
          TrelloStorage.get('nocontext') ||
          !canEditBoard ||
          !cardFrontRef.current?.contains(event.target as HTMLElement) ||
          isArchived
        ) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        Analytics.sendUIEvent({
          action: 'rightClicked',
          actionSubject: 'card',
          source:
            cardFrontSource === 'Planner' ? 'plannerCardFront' : 'boardScreen',
        });
        openQuickCardEditorOverlay();
      },
      [
        canEditBoard,
        cardFrontRef,
        isArchived,
        cardFrontSource,
        openQuickCardEditorOverlay,
      ],
    );

    const { onBlur, onFocus, onMouseDown, onMouseLeave, onMouseMove } =
      useSetActiveCardOnHoverOrFocus(cardId);

    useRestoreFocusToMinimalCard({ cardId, isMinimal });

    const isInboxBoard = useIsInboxBoard();
    useLayoutEffect(() => {
      if (isInboxBoard) {
        if (viewInboxVitalStatsSharedState.value.status === 'started') {
          viewInboxVitalStatsSharedState.setValue({ status: 'succeeded' });
        }
      } else {
        if (viewBoardTaskState.value.status !== 'completed') {
          viewBoardTaskState.setValue({
            status: 'completed',
          });
        }
      }
    }, [isInboxBoard]);

    // Focus management causes scrolling jank in Planner.
    useEffect(() => {
      if (cardFrontSource === 'Planner') {
        disableFocusManagement();
        return () => {
          restoreFocusManagement();
        };
      }
    }, [cardFrontSource]);

    const testId = getCardFrontTestIdForCardType(cardType, isMinimal);

    const cardFrontContextValue = useMemo(() => {
      return {
        cardFrontRef,
        cardFrontSource,
        cardType,
        editButtonRef,
        openCardBackDialog,
        openQuickCardEditorOverlay,
        plannerEventCardId,
        showBoardInfo,
      };
    }, [
      cardFrontRef,
      cardFrontSource,
      cardType,
      openCardBackDialog,
      openQuickCardEditorOverlay,
      plannerEventCardId,
      showBoardInfo,
    ]);

    return (
      <CardIdProvider value={cardId}>
        <CardFrontContext.Provider value={cardFrontContextValue}>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div
            className={cx({
              [styles.cardFront]: true,
              [styles['cardFront--separator']]: cardType === 'separator',
              [styles.pinned]: pinned,
            })}
            onClickCapture={onClickCapture}
            onClick={onClick}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onFocus={onFocus}
            onBlur={onBlur}
            onContextMenu={handleContextMenu}
            ref={cardFrontRef}
            data-testid={testId}
            {...{ [CARD_ID_ATTRIBUTE]: cardId }}
          >
            <CardFrontType
              name={data?.name}
              url={cardUrl}
              isMinimal={isMinimal}
            />
            {!isMinimal && (
              <>
                <CardFrontActions cardType={cardType} />
                {canEditBoard && isQuickCardEditorOpen && (
                  <QuickCardEditorOverlay
                    cardFrontRef={cardFrontRef}
                    onClose={closeQuickCardEditorOverlay}
                    cardFrontSource={cardFrontSource}
                    plannerEventCardId={plannerEventCardId}
                  />
                )}
                {isKeyboardShortcutsEnabled && (
                  <CardFrontKeyboardShortcutListener
                    cardFrontSource={cardFrontSource ?? 'Board'}
                  />
                )}
              </>
            )}
          </div>
        </CardFrontContext.Provider>
      </CardIdProvider>
    );
  },
);

export const MemoizedCardFront = memo(CardFront);
