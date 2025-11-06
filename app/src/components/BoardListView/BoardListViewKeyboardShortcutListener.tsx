import type { FunctionComponent } from 'react';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import type {
  ActionSubjectIdType,
  EventAttributes,
} from '@trello/analytics-types';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { isMemberLoggedIn } from '@trello/authentication';
import { client } from '@trello/graphql';
import type { BoardListsContextCardFragment } from '@trello/graphql/fragments';
import { BoardListsContextCardFragmentDoc } from '@trello/graphql/fragments';
import { intl } from '@trello/i18n';
import {
  useBoardId,
  useEnterpriseId,
  useWorkspaceId,
} from '@trello/id-context';
import type {
  KeyString,
  ShortcutEvent,
  ShortcutHandler,
} from '@trello/keybindings';
import {
  getNormalizedKeyCase,
  isArrowKey,
  Key,
  Scope,
  useShortcutHandler,
} from '@trello/keybindings';
import { showFlag } from '@trello/nachos/experimental-flags';
import { freeze } from '@trello/objects';

import { ModelCache } from 'app/scripts/db/ModelCache';
import {
  redoAction,
  repeatAction,
  undoAction,
} from 'app/scripts/lib/last-action';
import { LabelState } from 'app/scripts/view-models/LabelState';
import { useCanEditBoard } from 'app/src/components/BoardPermissionsContext';
import { openCardComposer } from 'app/src/components/CardComposer';
import { focusCardFront } from 'app/src/components/CardFront';
import { activeCardSharedState } from 'app/src/components/CardFront/activeCardSharedState';
import {
  collapseAllListsOnBoard,
  collapsedListsState,
  collapseList,
  expandAllListsOnBoard,
  expandList,
  isListCollapsed,
  useIsCollapsibleListsEnabled,
} from 'app/src/components/CollapsedListsState';
import { activeListIdSharedState } from './activeListIdSharedState';
import { fireCardFrontConfetti } from './fireCardFrontConfetti';
import { getCardIdForArrowKey } from './getCardIdForArrowKey';
import { getListIdForAdjacentListKey } from './getListIdForAdjacentListKey';
import { getListElement } from './getListsTreeWalker';
import { useCardMove } from './useCardMove';

// Please keep this array sorted alphabetically for legibility.
export const BOARD_SHORTCUT_KEY = [
  Key.AngleLeft,
  Key.AngleRight,
  Key.ArrowDown,
  Key.ArrowLeft,
  Key.ArrowRight,
  Key.ArrowUp,
  Key.Backslash,
  Key.Comma,
  Key.j,
  Key.k,
  Key.n,
  Key.Period,
  Key.Pipe,
  Key.q,
  Key.r,
  Key.SemiColon,
  Key.x,
  Key.z,
  Key.Z,
] as const;
export type BoardShortcutKey = (typeof BOARD_SHORTCUT_KEY)[number];

const VALID_KEYBOARD_SHORTCUTS = new Set<KeyString>(BOARD_SHORTCUT_KEY);
const isValidKeyboardShortcut = (key: string): key is BoardShortcutKey =>
  VALID_KEYBOARD_SHORTCUTS.has(key as KeyString);

export const KEY_TO_SHORTCUT_NAME = freeze<
  Record<BoardShortcutKey, ActionSubjectIdType>
>({
  [Key.AngleLeft]: 'moveToPreviousListShortcut',
  [Key.AngleRight]: 'moveToNextListShortcut',
  [Key.ArrowDown]: 'moveDownShortcut',
  [Key.ArrowLeft]: 'moveLeftShortcut',
  [Key.ArrowRight]: 'moveRightShortcut',
  [Key.ArrowUp]: 'moveUpShortcut',
  [Key.Backslash]: 'collapseListShortcut',
  [Key.Comma]: 'moveToPreviousListShortcut',
  [Key.j]: 'moveDownShortcut',
  [Key.k]: 'moveUpShortcut',
  [Key.n]: 'insertCardShortcut',
  [Key.Period]: 'moveToNextListShortcut',
  [Key.Pipe]: 'collapseAllListsShortcut',
  [Key.q]: 'myCardsShortcut',
  [Key.r]: 'repeatActionShortcut',
  [Key.SemiColon]: 'toggleLabelTextShortcut',
  [Key.x]: 'clearAllFiltersShortcut',
  [Key.z]: 'undoActionShortcut',
  [Key.Z]: 'redoActionShortcut',
});

const isModifierKeyPressed = (event: ShortcutEvent) => {
  return event.altKey || event.ctrlKey || event.metaKey;
};

/**
 * Keyboard shortcuts for the board view, which encompasses board shortcuts,
 * list shortcuts, and card front shortcuts. These are all applied at this layer
 * because `useShortcutHandler` only applies event listeners to the document,
 * instead of to specific elements.
 *
 * Note: this is currently rendered by the BoardLists component, mostly because
 * it's our clearest entry point to the new stack being rendered with the
 * Board Canvas Modernization project; in the future, this should be hoisted up
 * to the Board component.
 */
export const BoardListViewKeyboardShortcutListener: FunctionComponent = () => {
  const boardId = useBoardId();
  const enterpriseId = useEnterpriseId();
  const workspaceId = useWorkspaceId();

  const canEditBoard = useCanEditBoard();

  /**
   * Helper function for tracking analytics events for keyboard shortcuts.
   * Needs to be called for each handler manually, since some shortcuts have
   * additional attributes.
   */
  const trackShortcutEvent = useCallback(
    ({
      key,
      attributes,
      isCardShortcut = false,
    }: {
      key: BoardShortcutKey;
      attributes?: EventAttributes;
      isCardShortcut?: boolean;
    }) => {
      Analytics.sendPressedShortcutEvent({
        shortcutName: KEY_TO_SHORTCUT_NAME[key],
        keyValue: key,
        source: 'boardScreen',
        containers: formatContainers({
          idBoard: boardId,
          idCard: isCardShortcut
            ? activeCardSharedState.value.idActiveCard
            : null,
          idEnterprise: enterpriseId,
          workspaceId,
        }),
        attributes,
      });
    },
    [boardId, enterpriseId, workspaceId],
  );

  const { moveCard } = useCardMove();

  const isCollapsibleListsEnabled = useIsCollapsibleListsEnabled(boardId);

  const handleKeyDown = useCallback<ShortcutHandler>(
    async (event) => {
      const key = getNormalizedKeyCase(event);

      if (!isValidKeyboardShortcut(key) || isModifierKeyPressed(event)) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      if (isArrowKey(key) || key === Key.j || key === Key.k) {
        const cardId = getCardIdForArrowKey(key) ?? null;
        focusCardFront(cardId);
        trackShortcutEvent({ key, isCardShortcut: true });
        return;
      }

      // Prevents action from getting executed repeatedly if a key is held down
      // Arrow key movement above is intentionally excluded from repeated action prevention
      if (event.repeat) {
        return;
      }

      const { idActiveCard } = activeCardSharedState.value;

      switch (key) {
        // Move a card to the top or bottom of an adjacent list.
        case Key.AngleLeft:
        case Key.AngleRight:
        case Key.Comma:
        case Key.Period: {
          if (!canEditBoard || !idActiveCard) return;

          const card = client.readFragment<BoardListsContextCardFragment>(
            {
              id: `Card:${idActiveCard}`,
              fragment: BoardListsContextCardFragmentDoc,
            },
            true,
          );
          if (!card?.idList) return;

          const adjacentListId = getListIdForAdjacentListKey(card.idList, key);
          if (!adjacentListId) return;

          const adjacentListElement = getListElement(adjacentListId);
          if (adjacentListElement) {
            fireCardFrontConfetti(
              { listId: adjacentListId },
              adjacentListElement,
            );
          }

          trackShortcutEvent({ key });

          const index = event.shiftKey ? 0 : 1e9;

          try {
            await moveCard({
              cardId: idActiveCard,
              listId: adjacentListId,
              index,
            });
          } catch (error) {
            // Analytics is sent in moveCard
          }

          const isMoveLeft = key === Key.AngleLeft || key === Key.Comma;

          const dismissFlag = showFlag({
            id: isMoveLeft ? 'card-moved-left' : 'card-moved-right',
            title: isMoveLeft
              ? intl.formatMessage({
                  id: 'templates.shortcuts.card-moved-left',
                  defaultMessage: 'Card moved left',
                  description: 'Card moved left',
                })
              : intl.formatMessage({
                  id: 'templates.shortcuts.card-moved-right',
                  defaultMessage: 'Card moved right',
                  description: 'Card moved right',
                }),
            appearance: 'normal',
            msTimeout: 8000,
            actions: [
              {
                content: (
                  <FormattedMessage
                    id="templates.shortcuts.undo"
                    defaultMessage="Undo"
                    description="Undo"
                  />
                ),
                onClick: () => {
                  undoAction({
                    source: 'boardScreen',
                    idCard: idActiveCard,
                  });
                  dismissFlag();
                },
                type: 'button',
              },
            ],
          });
          return;
        }

        // Open card composer
        case Key.n: {
          if (!canEditBoard) return;

          const currentListId = activeListIdSharedState.value;

          // If a card is being hovered over, open the composer below it
          if (idActiveCard) {
            const card = client.readFragment<BoardListsContextCardFragment>({
              id: `Card:${idActiveCard}`,
              fragment: BoardListsContextCardFragmentDoc,
            });

            if (!card) return;

            openCardComposer({
              listId: card.idList,
              position: card.pos,
            });
            // If a list is being hovered over, open the composer at the bottom
          } else if (currentListId) {
            openCardComposer({
              listId: currentListId,
              position: 1e9, // end of list
            });
          } else {
            return;
          }

          trackShortcutEvent({ key });
          return;
        }

        // Toggle the "quiet mode" filter to show the current member's cards.
        case Key.q: {
          const legacyBoardModel = ModelCache.get('Board', boardId);
          if (!isMemberLoggedIn || !legacyBoardModel) return;

          const traceId = Analytics.startTask({
            taskName: 'edit-board/filter',
            source: 'boardScreen',
          });

          try {
            legacyBoardModel?.filter.toggleQuietMode();
            trackShortcutEvent({ key });
            Analytics.taskSucceeded({
              taskName: 'edit-board/filter',
              source: 'boardScreen',
              traceId,
            });
          } catch (error) {
            Analytics.taskFailed({
              taskName: 'edit-board/filter',
              source: 'boardScreen',
              traceId,
              error,
            });
          }
          return;
        }

        // Repeat last action
        case Key.r: {
          if (canEditBoard) {
            if (idActiveCard) {
              repeatAction({
                source: 'cardView',
                idBoard: boardId,
                idCard: idActiveCard || undefined,
              });
              trackShortcutEvent({ key, isCardShortcut: true });
            }
          }
          return;
        }

        // Toggle label text
        case Key.SemiColon: {
          LabelState.toggleText();
          trackShortcutEvent({
            key,
            attributes: {
              toggleValue: LabelState.getShowText() ? 'hide' : 'show',
            },
          });
          return;
        }

        // Clear all existing filters.
        case Key.x: {
          const legacyBoardModel = ModelCache.get('Board', boardId);
          if (!legacyBoardModel) return;

          const traceId = Analytics.startTask({
            taskName: 'remove-boardFilter',
            source: 'boardScreen',
          });

          try {
            legacyBoardModel?.filter.clear();
            trackShortcutEvent({ key });
            Analytics.taskSucceeded({
              taskName: 'remove-boardFilter',
              source: 'boardScreen',
              traceId,
            });
          } catch (error) {
            Analytics.taskFailed({
              taskName: 'remove-boardFilter',
              source: 'boardScreen',
              traceId,
              error,
            });
          }
          return;
        }

        // Undo last action
        case Key.z: {
          if (canEditBoard) {
            undoAction({ source: 'boardScreen', idBoard: boardId });
            trackShortcutEvent({ key });
          }
          return;
        }

        // Redo last action
        case Key.Z: {
          if (canEditBoard) {
            redoAction({ source: 'boardScreen', idBoard: boardId });
            trackShortcutEvent({ key });
          }
          return;
        }

        // Collapse or expand a list
        case Key.Backslash: {
          if (!isCollapsibleListsEnabled) {
            return;
          }

          const currentListId = activeListIdSharedState.value;
          if (!currentListId) {
            return;
          }

          const wasListCollapsed = isListCollapsed(currentListId);
          if (wasListCollapsed) {
            expandList(currentListId);
          } else {
            collapseList(currentListId);
          }

          trackShortcutEvent({
            key,
            attributes: {
              toggleValue: wasListCollapsed ? 'expand' : 'collapse',
            },
          });
          return;
        }

        // Collapse or expand all lists on the board
        case Key.Pipe: {
          if (!isCollapsibleListsEnabled) {
            return;
          }

          const collapsedListsOnBoard = collapsedListsState.value[boardId];
          const wereAnyListsCollapsed =
            collapsedListsOnBoard &&
            Object.values(collapsedListsOnBoard).some(Boolean);

          if (wereAnyListsCollapsed) {
            expandAllListsOnBoard(boardId);
          } else {
            collapseAllListsOnBoard(boardId);
          }

          trackShortcutEvent({
            key,
            attributes: {
              toggleValue: wereAnyListsCollapsed ? 'expand' : 'collapse',
            },
          });
          return;
        }

        default:
          return;
      }
    },
    [
      boardId,
      canEditBoard,
      isCollapsibleListsEnabled,
      moveCard,
      trackShortcutEvent,
    ],
  );

  useShortcutHandler(handleKeyDown, { scope: Scope.Board });

  return null;
};
