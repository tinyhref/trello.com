import type { FunctionComponent, ReactNode } from 'react';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import type {
  ActionSubjectIdType,
  EventAttributes,
} from '@trello/analytics-types';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { isMemberLoggedIn, useMemberId } from '@trello/authentication';
import { useIsTemplateBoard } from '@trello/business-logic-react/board';
import { useFeatureGate } from '@trello/feature-gate-client';
import {
  useBoardId,
  useCardId,
  useEnterpriseId,
  useListId,
  useWorkspaceId,
} from '@trello/id-context';
import type {
  KeyString,
  ShortcutEvent,
  ShortcutHandler,
} from '@trello/keybindings';
import { getNormalizedKeyCase, Key } from '@trello/keybindings';
import type { BaseLabelColor } from '@trello/labels';
import { formatLabelColor } from '@trello/labels/formatLabelColor';
import { getHighestVisibleElevation } from '@trello/layer-manager';
import { Popover, usePopover } from '@trello/nachos/popover';
import { freeze } from '@trello/objects';
import { useIsInboxBoard } from '@trello/personal-workspace';
import { useIsBoardPanelOpen } from '@trello/split-screen';

import { ModelCache } from 'app/scripts/db/ModelCache';
import { LabelKeyHelper } from 'app/scripts/views/label/LabelKeyHelper';
import { getNextCardIdInList } from 'app/src/components/BoardListView/getNextCardIdInList';
import {
  useCanEditBoard,
  useCanVoteOnBoard,
} from 'app/src/components/BoardPermissionsContext';
import { LazyCardMembersPopover } from 'app/src/components/CardMembersPopover';
import { LazyCardDateRangePicker } from 'app/src/components/DateRangePicker/LazyCardDateRangePicker';
import { toggleLabelsPopover } from 'app/src/components/LabelsPopover';
import { activeCardSharedState } from './activeCardSharedState';
import type { CardFrontSource } from './CardFront';
import { CardFrontContext } from './CardFrontContext';
import { focusCardFront } from './focusCardFront';
import { useArchiveCard } from './useArchiveCard';
import { CARD_TYPES_WITH_CARD_BACK } from './useCardFrontClickHandler';
import { usePinCard } from './usePinCard';
import {
  disableFocusManagement,
  restoreFocusManagement,
} from './useSetActiveCardOnHoverOrFocus';
import { useSubscribeToCard } from './useSubscribeToCard';
import { useToggleCardMember } from './useToggleCardMember';
import { useVoteOnCard } from './useVoteOnCard';

export const CARD_SHORTCUT_KEY = [
  Key.a,
  Key.c,
  Key.d,
  Key.e,
  Key.Enter,
  Key.l,
  Key.m,
  Key.p,
  Key.s,
  Key.Space,
  Key.v,
  Key.Zero,
  Key.One,
  Key.Two,
  Key.Three,
  Key.Four,
  Key.Five,
  Key.Six,
  Key.Seven,
  Key.Eight,
  Key.Nine,
] as const;
type CardShortcutKey = (typeof CARD_SHORTCUT_KEY)[number];

const VALID_KEYBOARD_SHORTCUTS = new Set<KeyString>(CARD_SHORTCUT_KEY);
const isValidKeyboardShortcut = (key: string): key is CardShortcutKey =>
  VALID_KEYBOARD_SHORTCUTS.has(key as KeyString);

export const KEY_TO_SHORTCUT_NAME = freeze<
  Record<CardShortcutKey, ActionSubjectIdType>
>({
  [Key.a]: 'assignMembersShortcut',
  [Key.c]: 'archiveCardShortcut',
  [Key.d]: 'dueDatesShortcut',
  [Key.e]: 'quickCardEditorShortcut',
  [Key.Enter]: 'openCardShortcut',
  [Key.l]: 'editLabelsShortcut',
  [Key.m]: 'assignMembersShortcut',
  [Key.p]: 'pinCardShortcut',
  [Key.s]: 'subscribeShortcut',
  [Key.Space]: 'assignSelfShortcut',
  [Key.v]: 'voteShortcut',
  [Key.Zero]: 'toggleLabelShortcut',
  [Key.One]: 'toggleLabelShortcut',
  [Key.Two]: 'toggleLabelShortcut',
  [Key.Three]: 'toggleLabelShortcut',
  [Key.Four]: 'toggleLabelShortcut',
  [Key.Five]: 'toggleLabelShortcut',
  [Key.Six]: 'toggleLabelShortcut',
  [Key.Seven]: 'toggleLabelShortcut',
  [Key.Eight]: 'toggleLabelShortcut',
  [Key.Nine]: 'toggleLabelShortcut',
});

const isModifierKeyPressed = (event: ShortcutEvent) => {
  return event.altKey || event.ctrlKey || event.metaKey;
};

interface CardFrontKeyboardShortcutListenerProps {
  cardFrontSource: CardFrontSource;
}

export const CardFrontKeyboardShortcutListener: FunctionComponent<
  CardFrontKeyboardShortcutListenerProps
> = ({ cardFrontSource }) => {
  const cardId = useCardId();
  const idEnterprise = useEnterpriseId();
  const workspaceId = useWorkspaceId();
  const boardId = useBoardId();
  const idList = useListId();
  const idMember = useMemberId();
  const isInboxBoard = useIsInboxBoard();
  const [currentCardModel, setCurrentCardModel] = useState(
    ModelCache.get('Card', cardId),
  );
  const [popoverTitle, setPopoverTitle] = useState<ReactNode | null>(null);
  const [popoverScreenType, setPopoverScreenType] = useState<
    'dates' | 'members' | null
  >(null);
  const { popoverProps, toggle, triggerRef, hide } = usePopover({
    onHide: () => {
      setPopoverScreenType(null);
      restoreFocusManagement();
    },
    placement: 'right',
  });

  const { value: isSplitScreenEnabled } = useFeatureGate(
    'trello_personal_productivity_release',
  );
  const isBoardPanelOpen = useIsBoardPanelOpen();

  const {
    cardFrontRef,
    cardType,
    editButtonRef,
    openQuickCardEditorOverlay,
    openCardBackDialog,
  } = useContext(CardFrontContext);

  const canEditBoard = useCanEditBoard();
  const isTemplateBoard = useIsTemplateBoard(boardId);

  const containers = useMemo(
    () =>
      formatContainers({
        boardId,
        cardId,
        idList,
        workspaceId,
        idEnterprise,
      }),
    [cardId, boardId, idList, workspaceId, idEnterprise],
  );

  /**
   * Helper function for tracking analytics events for keyboard shortcuts.
   * Needs to be called for each handler manually, since some shortcuts have
   * additional attributes.
   */
  const sendPressedShortcutEvent = useCallback(
    ({
      key,
      attributes,
    }: {
      key: CardShortcutKey;
      attributes?: EventAttributes;
    }) => {
      Analytics.sendPressedShortcutEvent({
        shortcutName: KEY_TO_SHORTCUT_NAME[key],
        keyValue: key,
        source:
          cardFrontSource === 'Planner' ? 'plannerCardFront' : 'boardScreen',
        containers,
        attributes,
      });
    },
    [cardFrontSource, containers],
  );

  const archiveCard = useArchiveCard();

  const { toggleMember, isOnCard } = useToggleCardMember({
    boardId,
    cardId,
    source: 'cardView',
  });

  const { toggleVote, hasVoted } = useVoteOnCard();
  const canVote = useCanVoteOnBoard();

  const { toggleSubscribe, isSubscribedToCard } = useSubscribeToCard();
  const { value: pinCardFeatureFlag } = useFeatureGate(
    'trello_web_pinned_cards',
  );
  const { togglePinnedCard } = usePinCard({ cardId });

  const handleKeyPress = useCallback<ShortcutHandler>(
    (event) => {
      const key = getNormalizedKeyCase(event);

      if (!isValidKeyboardShortcut(key) || isModifierKeyPressed(event)) {
        return;
      }

      // Prevent keyboard shortcuts on non-inbox cards when the board panel is hidden
      if (isSplitScreenEnabled && !isBoardPanelOpen && !isInboxBoard) {
        return;
      }

      // This technically shouldn't be possible, since focus should be wiped out
      // when any layered elements are open, but it's possible for hijinks to
      // occur with legacy layers. If any layered elements are open, simply
      // disable all keyboard shortcuts.
      if (getHighestVisibleElevation() > 0) {
        return;
      }

      if (key === Key.Enter && !CARD_TYPES_WITH_CARD_BACK.has(cardType)) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      // Prevents action from getting executed repeatedly if a key is held down
      if (event.repeat) {
        return;
      }

      // Safety mechanism. In niche situations, it's possible for a card to be
      // focused, but no longer "active"; for example, if another element is
      // focused, but quickly destroyed. We're not that concerned with tracking
      // down all the scenarios in which this is possible (although we think
      // we've eliminated most of them), but we do want the active card state to
      // be kept in sync with keyboard shortcuts whenever possible.
      if (activeCardSharedState.value.idActiveCard !== cardId) {
        activeCardSharedState.setValue({ idActiveCard: cardId });
      }

      // Enter and Vote (in specific cases) are the only shortcuts that works if you don't have edit perms
      if (!canEditBoard && !([Key.Enter, Key.v] as KeyString[]).includes(key))
        return;

      // keyboard shortcuts that can be used by link/board/separator cardType
      switch (key) {
        // Archive the card
        case Key.c: {
          const nextCardId = getNextCardIdInList(idList, cardId) ?? null;
          archiveCard();
          if (nextCardId) {
            focusCardFront(nextCardId);
          } else {
            // if we archived the last card, unset the active card value
            activeCardSharedState.setValue({ idActiveCard: null });
          }
          sendPressedShortcutEvent({ key });
          return;
        }

        // Open quick card editor overlay
        case Key.e: {
          openQuickCardEditorOverlay();
          sendPressedShortcutEvent({ key });
          return;
        }

        default:
          break;
      }

      if (cardType !== 'default') {
        return;
      }

      // keyboard shortcuts that can be used by default cardType cards
      switch (key) {
        // Open member popover:
        case Key.a:
        case Key.m: {
          if (isTemplateBoard) {
            return;
          }

          disableFocusManagement();

          setPopoverScreenType('members');
          setPopoverTitle(
            <FormattedMessage
              id="templates.choose_member.title"
              defaultMessage="Members"
              description="Title for the card members popover"
            />,
          );

          triggerRef(cardFrontRef.current);
          toggle();

          sendPressedShortcutEvent({ key });
          return;
        }

        case Key.p: {
          if (!pinCardFeatureFlag) {
            return;
          }
          togglePinnedCard();
          sendPressedShortcutEvent({ key });
          return;
        }

        // Open date popover
        case Key.d: {
          const legacyBoardModel = ModelCache.get('Board', boardId);
          const legacyCardModel = ModelCache.get('Card', cardId);
          setCurrentCardModel(legacyCardModel);

          if (!legacyBoardModel || !legacyCardModel || isTemplateBoard) {
            return;
          }

          disableFocusManagement();

          setPopoverScreenType('dates');
          setPopoverTitle(
            <FormattedMessage
              id="templates.due_date_picker.dates"
              defaultMessage="Dates"
              description="Title for the card dates popover"
            />,
          );

          triggerRef(cardFrontRef.current);
          toggle();
          sendPressedShortcutEvent({ key });
          return;
        }

        // Open card back
        case Key.Enter: {
          openCardBackDialog(cardId);
          sendPressedShortcutEvent({ key });
          return;
        }

        // Open label popover
        case Key.l: {
          if (!editButtonRef.current) {
            return;
          }

          if (isInboxBoard) {
            return;
          }

          disableFocusManagement();
          toggleLabelsPopover({
            idCard: cardId,
            source: 'cardView',
            triggerElement: editButtonRef.current,
            onHide: restoreFocusManagement,
          });
          sendPressedShortcutEvent({ key });
          return;
        }

        // Subscribe or unsubscribe to the card
        case Key.s: {
          if (isMemberLoggedIn() && !isTemplateBoard) {
            toggleSubscribe();
            sendPressedShortcutEvent({
              key,
              attributes: {
                toggleValue: isSubscribedToCard ? 'unsubscribe' : 'subscribe',
              },
            });
          }
          return;
        }

        // Join or leave the card
        case Key.Space: {
          if (isInboxBoard) {
            return;
          }
          const toggleValue = isOnCard(idMember) ? 'remove' : 'add';

          toggleMember(idMember);
          sendPressedShortcutEvent({
            key,
            attributes: { toggleValue },
          });
          return;
        }

        // Update vote on a card
        case Key.v: {
          if (canVote) {
            toggleVote();
            sendPressedShortcutEvent({
              key,
              attributes: {
                toggleValue: hasVoted ? 'unvote' : 'vote',
              },
            });
          }
          return;
        }

        // Toggle label
        case Key.Zero:
        case Key.One:
        case Key.Two:
        case Key.Three:
        case Key.Four:
        case Key.Five:
        case Key.Six:
        case Key.Seven:
        case Key.Eight:
        case Key.Nine: {
          const legacyCardModel = ModelCache.get('Card', cardId);
          if (!legacyCardModel) return;

          let hasUniqueLabel = true;
          const fxNoUniqueLabel = (color: BaseLabelColor) => {
            if (editButtonRef.current) {
              disableFocusManagement();
              hasUniqueLabel = false;
              toggleLabelsPopover({
                idCard: cardId,
                source: 'cardView',
                triggerElement: editButtonRef.current,
                hideOnSelect: true,
                onHide: restoreFocusManagement,
                initialSearchQuery: formatLabelColor(color),
              });
            }
          };

          LabelKeyHelper.setLabelFromKey(key, legacyCardModel, fxNoUniqueLabel);

          let toggleValue = 'showLabelsPopover';
          if (hasUniqueLabel) {
            const color = LabelKeyHelper.colorForKey(key);
            toggleValue = legacyCardModel.hasLabel(color) ? 'remove' : 'add';
          }
          sendPressedShortcutEvent({
            key,
            attributes: { toggleValue },
          });
          return;
        }

        default:
          return;
      }
    },
    [
      archiveCard,
      boardId,
      canEditBoard,
      canVote,
      cardFrontRef,
      cardId,
      cardType,
      editButtonRef,
      hasVoted,
      idList,
      idMember,
      isBoardPanelOpen,
      isInboxBoard,
      isOnCard,
      isSplitScreenEnabled,
      isSubscribedToCard,
      isTemplateBoard,
      openCardBackDialog,
      openQuickCardEditorOverlay,
      pinCardFeatureFlag,
      sendPressedShortcutEvent,
      toggle,
      toggleMember,
      togglePinnedCard,
      toggleSubscribe,
      toggleVote,
      triggerRef,
    ],
  );

  useEffect(() => {
    const element = cardFrontRef.current;
    // NOTE: It is meaningful that we are using keypress instead of keydown, as
    // for some reason, event key codes are different between the keydown event
    // and the keypress event, and @trello/keybindings doesn't have support for
    // non-English keyboard inputs (e.g. Russian) with keydown events.
    element?.addEventListener('keypress', handleKeyPress);
    return () => {
      element?.removeEventListener('keypress', handleKeyPress);
    };
  }, [cardFrontRef, handleKeyPress]);

  if (!popoverScreenType) {
    return null;
  }

  return (
    <Popover title={popoverTitle} {...popoverProps}>
      {popoverScreenType === 'dates' && (
        <LazyCardDateRangePicker
          due={currentCardModel?.get('due') ?? null}
          start={currentCardModel?.get('start') ?? null}
          dueReminder={currentCardModel?.get('dueReminder') ?? null}
          hidePopover={hide}
          idCard={cardId}
          idBoard={boardId}
          idOrg={workspaceId}
        />
      )}
      {popoverScreenType === 'members' && (
        <LazyCardMembersPopover
          boardId={boardId}
          cardId={cardId}
          workspaceId={workspaceId}
          source={'cardView'}
        />
      )}
    </Popover>
  );
};
