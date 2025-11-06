import type {
  ChangeEvent,
  ClipboardEventHandler,
  FocusEventHandler,
  FormEventHandler,
  FunctionComponent,
  KeyboardEventHandler,
} from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { determinePossibleCardRole } from '@trello/card-roles';
import { useCallbackRef, useClickOutside } from '@trello/dom-hooks';
import {
  useFeatureGate,
  useGetExperimentValue,
} from '@trello/feature-gate-client';
import type { CurrentBoardFullCardFragment } from '@trello/graphql';
import { getFragmentDocument, optimisticIdManager } from '@trello/graphql';
import { intl } from '@trello/i18n';
import { useBoardId, useListId, useWorkspaceId } from '@trello/id-context';
import { getKey, Key, Scope, useShortcut } from '@trello/keybindings';
import type { Board } from '@trello/model-types';
import { Button } from '@trello/nachos/button';
import { CloseIcon } from '@trello/nachos/icons/close';
import type { HideReasonType } from '@trello/nachos/popover';
import { HideReason, Popover, usePopover } from '@trello/nachos/popover';
import { calculatePosition, NULL_POS } from '@trello/position';
import { SharedState, useSharedState } from '@trello/shared-state';
import { getSmartCardClient } from '@trello/smart-card/smart-card-client';
import { usePersistedState } from '@trello/storage';
import type { ListTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { AutosizeTextarea } from 'app/src/components/AutosizeTextarea';
import { openCardBack } from 'app/src/components/CardFront/openCardBack';
import { cardIdsAddedSinceFilteringSharedState } from 'app/src/components/FilterPopover/cardIdsAddedSinceFilteringSharedState';
import { useIsInboxBoard } from 'app/src/components/Inbox';
import { useListNameFragment } from 'app/src/components/List/ListNameFragment.generated';
import { bypassViewportCheckForListOrCardId } from 'app/src/components/List/useListsAndCardsViewportObserver';
import { usePasteFilesOnList } from 'app/src/components/List/usePasteFilesOnList';
import { LazyQuickCaptureTip } from 'app/src/components/QuickCaptureDiscovery/LazyQuickCaptureTip';
import { viewFiltersContextSharedState } from 'app/src/components/ViewFilters/viewFiltersContextSharedState';
import { useAddCardToListMutation } from './AddCardToListMutation.generated';
import { AiAgentMentionSelector } from './AiAgentMentionSelector';
import { CardComposerLimitError } from './CardComposerLimitError';
import { cardComposerState, closeCardComposer } from './cardComposerState';
import { createOptimisticCardResponse } from './createOptimisticCardResponse';
import { MAX_CARDS, SaveMultiplePopover } from './SaveMultiplePopover';
import { useCardComposerLimits } from './useCardComposerLimits';
import { usePersistentScrollIntoView } from './usePersistentScrollIntoView';

import * as styles from './CardComposer.module.less';

/**
 * Store the input value state across rerenders.
 * Treat this as an internal detail; it's only exported for unit tests.
 */
export const cardComposerInputValueState = new SharedState<string>('');

export interface CardComposerProps {
  prevPosition: number;
  position: number;
  nextPosition: number;
}

/**
 * Thin wrapper on {calculateValidPosition}. Just translates card composer
 * positioning into @trello/position positioning.
 * @param previous The previous card position, or a number <= 0 if there is none
 * @param next The next card position, or {Infinity} if there is none
 * @returns The position of a card between previous and next
 */
const calculateCardPosition = (previous: number, next: number): number =>
  calculatePosition(
    previous > 0 ? previous : NULL_POS,
    next !== Infinity ? next : NULL_POS,
  );

export const CardComposer: FunctionComponent<CardComposerProps> = ({
  position,
  nextPosition,
}) => {
  const boardId = useBoardId();
  const listId = useListId();
  const workspaceId = useWorkspaceId();
  const { data: list } = useListNameFragment({
    from: { id: listId },
    optimistic: true,
  });
  const [addCardToList] = useAddCardToListMutation();
  const { pasteFileOnList } = usePasteFilesOnList();

  const { value: isRovoAgentsEnabled } = useFeatureGate(
    'phx_card_composer_rovo_agents',
  );
  const [selectedAgentName, setSelectedAgentName] = useState<
    string | undefined
  >(undefined);
  const ref = useRef<HTMLLIElement>(null);
  const [textareaElement, textareaRef] = useCallbackRef<HTMLTextAreaElement>();

  const [inputValue] = useSharedState(cardComposerInputValueState);
  const [cardIdsAddedSinceFiltering, setCardIdsAddedSinceFiltering] =
    useSharedState(cardIdsAddedSinceFilteringSharedState);
  const [viewFiltersContext] = useSharedState(viewFiltersContextSharedState);
  const { filters } = viewFiltersContext.viewFilters;

  const [draft, updateDraft] = usePersistedState<{ title: string }>(
    `boardCardComposerSettings-${boardId}`,
    null,
  );

  const [isComposingWithPaste, setIsComposingWithPaste] = useState(false);

  const { cohort: quickCaptureTipExperimentCohort } = useGetExperimentValue({
    experimentName: 'ghost_evergreen_quick_capture_tip',
    parameter: 'cohort',
    fireExposureEvent: false,
  });

  const { popoverProps, hide, show, targetRef } =
    usePopover<HTMLButtonElement>();

  // Need a combined ref so we can use one from the usePopover and another for the textarea to be used with the mention selector
  // Tried a handful of ways to reuse the one from usePopver, but ran into various issues.
  // When I asked cursor, this is the only working solution it was able to come up with.
  const combinedRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
      targetRef(node); // Call the existing targetRef from usePopover
      textareaRef(node); // Call our new textareaRef
    },
    [targetRef, textareaRef],
  );

  useEffect(() => {
    if (draft?.title && !inputValue) {
      cardComposerInputValueState.setValue(draft.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft?.title]);

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: 'inlineCardComposerInlineDialog',
      containers: formatContainers({ boardId, listId, workspaceId }),
    });
  }, [boardId, listId, workspaceId]);

  const enqueueProgrammaticScrollIntoView = usePersistentScrollIntoView(ref);
  const onFocus = useCallback<FocusEventHandler<HTMLTextAreaElement>>(
    (e) => {
      enqueueProgrammaticScrollIntoView();
      // Set the input cursor to the end of the value. Without this, sometimes the
      // cursor can get displaced across rerenders, causing input to feel janky.
      const currentValue = e.target.value;
      e.target.setSelectionRange(currentValue.length, currentValue.length);
    },
    [enqueueProgrammaticScrollIntoView],
  );

  const isInboxBoard = useIsInboxBoard();

  const saveSingleCard = useCallback(
    async ({
      shouldOpenCardBackOnCreation = false,
      cardName,
      updatePosition = null,
      agentName,
    }: {
      shouldOpenCardBackOnCreation?: boolean;
      cardName: string;
      updatePosition?: number | null;
      agentName?: string | undefined;
    }) => {
      const traceId = Analytics.startTask({
        taskName: 'create-card/list',
        source: 'inlineCardComposerInlineDialog',
      });

      try {
        const cardRole = determinePossibleCardRole({ name: cardName });

        let newPosition;
        if (updatePosition !== null) {
          newPosition = updatePosition;
        } else {
          newPosition = calculateCardPosition(position, nextPosition);
        }

        updateDraft(null);
        cardComposerInputValueState.setValue('');
        cardComposerState.setValue({ position: newPosition });

        const optimisticId = optimisticIdManager.generateOptimisticId('Card');

        // This is needed in the case of a user selecting an agent and then hitting backspace to remove the agent mention
        const isAgentMentionedInCardName =
          agentName && cardName.includes(`@${agentName}`);
        const result = await addCardToList({
          variables: {
            idList: listId,
            name: cardName,
            pos: newPosition,
            cardRole,
            traceId,
            agentName:
              isRovoAgentsEnabled && isAgentMentionedInCardName
                ? agentName
                : undefined,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            createCard: createOptimisticCardResponse({
              id: optimisticId,
              idBoard: boardId,
              idList: listId,
              cardRole,
              name: cardName,
              pos: newPosition,
            }),
          },
          update(cache, { data }) {
            const newCard = data?.createCard;

            if (!newCard) {
              return;
            }

            bypassViewportCheckForListOrCardId(newCard.id);

            // When an `optimisticResponse` is configured on a mutation,
            // `update` is called twice - once with the optimistic ID, and once
            // with the resolved ID.
            if (newCard.id !== optimisticId) {
              optimisticIdManager.resolveId(optimisticId, newCard.id);

              if (filters.isFiltering()) {
                setCardIdsAddedSinceFiltering(
                  cardIdsAddedSinceFiltering.add(newCard.id),
                );
              }
            }

            /**
             * First part of getting optimistic updates to work is adding the card
             * to the set of board.cards, which will refresh the queries that include
             * board.cards. For example, the BoardListsContextQuery.
             */
            cache.modify<Board>({
              id: cache.identify({
                id: boardId,
                __typename: 'Board',
              }),
              fields: {
                cards(existingCards = [], { readField }) {
                  const newCardRef =
                    cache.writeFragment<CurrentBoardFullCardFragment>({
                      data: newCard,
                      fragment: getFragmentDocument('CurrentBoardFullCard'),
                      fragmentName: 'CurrentBoardFullCard',
                    });

                  // Quick safety check - if the new card is already
                  // present in the cache, we don't need to add it again.
                  if (
                    !newCardRef ||
                    existingCards.some(
                      (cardRef) => readField('id', cardRef) === newCard.id,
                    )
                  ) {
                    return existingCards;
                  }

                  // Append the new ref to the array of existing refs for cards
                  return existingCards.concat(newCardRef);
                },
              },
            });
          },
        });

        const newCardId = result.data?.createCard?.id;

        let linkCardProvider = undefined;

        if (cardRole === 'link') {
          const smartCardClient = getSmartCardClient();
          const url = result.data?.createCard?.url ?? '';

          const resolvedUrl = await smartCardClient
            .fetchData(url)
            .catch(() => {});

          if (resolvedUrl?.meta) {
            linkCardProvider =
              resolvedUrl.meta.key || resolvedUrl.meta.definitionId;
          }
        }

        Analytics.sendTrackEvent({
          action: 'created',
          actionSubject: 'card',
          source: 'inlineCardComposerInlineDialog',
          attributes: {
            taskId: traceId,
            cardRole,
            linkCardProvider,
            containerType: isInboxBoard ? 'inbox' : undefined,
            composedWithPaste: isComposingWithPaste,
            isAiAgentMentioned:
              isRovoAgentsEnabled && isAgentMentionedInCardName,
          },
          containers: formatContainers({
            idCard: newCardId,
            idList: listId,
            idBoard: boardId,
            idOrganization: workspaceId,
          }),
        });

        Analytics.taskSucceeded({
          taskName: 'create-card/list',
          source: 'inlineCardComposerInlineDialog',
          traceId,
        });

        setIsComposingWithPaste(false);

        if (shouldOpenCardBackOnCreation) {
          if (!newCardId) return;

          Analytics.sendPressedShortcutEvent({
            shortcutName: 'createAndOpenCardShortcut',
            keyValue: Key.Enter,
            source: 'inlineCardComposerInlineDialog',
            containers: formatContainers({
              idCard: newCardId,
              idList: listId,
              idBoard: boardId,
              idOrganization: workspaceId,
            }),
          });

          openCardBack(newCardId);
        }
      } catch (error) {
        cardComposerInputValueState.setValue(cardName);
        Analytics.taskFailed({
          taskName: 'create-card/list',
          traceId,
          source: 'inlineCardComposerInlineDialog',
          error,
        });
      }
    },
    [
      nextPosition,
      updateDraft,
      addCardToList,
      listId,
      boardId,
      isInboxBoard,
      isComposingWithPaste,
      workspaceId,
      position,
      filters,
      setCardIdsAddedSinceFiltering,
      cardIdsAddedSinceFiltering,
      isRovoAgentsEnabled,
    ],
  );

  const [multipleCount, setMultipleCount] = useState(0);
  const [openOnCreation, setOpenOnCreation] = useState(false);

  const saveCard = useCallback(
    async (shouldOpenCardBackOnCreation: boolean = false) => {
      const cardName = cardComposerInputValueState.value.trim();

      if (!cardName) {
        closeCardComposer();
        return;
      }
      const cardTitles = cardName.split(/\r\n|\r|\n/).filter(Boolean);

      if (cardTitles.length === 1) {
        return saveSingleCard({
          shouldOpenCardBackOnCreation,
          cardName,
          agentName: selectedAgentName,
        });
      }
      setMultipleCount(cardTitles.length);
      setOpenOnCreation(shouldOpenCardBackOnCreation);
      show();
    },
    [saveSingleCard, show, selectedAgentName],
  );

  const saveCardsFromMultiplePopover = useCallback(
    async (saveMultiple: boolean = false) => {
      const shouldOpenCardBackOnCreation = openOnCreation;
      setOpenOnCreation(false);
      const cardName = cardComposerInputValueState.value.trim();
      if (!saveMultiple) {
        return saveSingleCard({
          shouldOpenCardBackOnCreation,
          cardName: cardName.replace(/(\r\n|\n|\r)/gm, ' '),
          agentName: selectedAgentName,
        });
      }
      let updatePosition;
      updatePosition = calculateCardPosition(position, nextPosition);
      const cardTitles = cardName.split(/\r\n|\r|\n/).filter(Boolean);
      for (const [idx, title] of cardTitles.entries()) {
        const lastCard = idx === cardTitles.length - 1;
        const shouldOpen = shouldOpenCardBackOnCreation && lastCard;
        await saveSingleCard({
          shouldOpenCardBackOnCreation: shouldOpen,
          cardName: title,
          updatePosition,
        });
        updatePosition = calculateCardPosition(updatePosition, nextPosition);
      }
      Analytics.sendTrackEvent({
        action: 'created',
        actionSubject: 'multipleCards',
        source: 'createMultipleCardsInlineDialog',
        attributes: {
          numCardsLength: cardTitles.length,
        },
        containers: formatContainers({
          idBoard: boardId,
          idList: listId,
          idOrganization: workspaceId,
        }),
      });
      hide();
      cardComposerState.setValue({ position: updatePosition });
    },
    [
      boardId,
      hide,
      listId,
      nextPosition,
      openOnCreation,
      position,
      saveSingleCard,
      workspaceId,
      selectedAgentName,
    ],
  );

  const onChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    cardComposerInputValueState.setValue(e.target.value);
  }, []);

  const onClickCancel = useCallback(() => {
    updateDraft(null);
    cardComposerInputValueState.setValue('');
    closeCardComposer();
  }, [updateDraft]);

  const onKeyDown = useCallback<KeyboardEventHandler<HTMLTextAreaElement>>(
    (e) => {
      if (getKey(e) === Key.Enter) {
        e.preventDefault();
        saveCard(e.shiftKey);
      }
    },
    [saveCard],
  );

  const onPaste = useCallback<ClipboardEventHandler<HTMLTextAreaElement>>(
    (e) => {
      const pastedFiles = e.clipboardData?.files;
      const includesText = e.clipboardData?.types.includes('text/plain');

      if (e.clipboardData?.getData('text/plain')) {
        setIsComposingWithPaste(true);
      }

      if (!pastedFiles?.length || includesText) {
        return;
      }

      e.stopPropagation();
      e.preventDefault();

      let updatePosition: number;
      updatePosition = calculateCardPosition(position, nextPosition);

      Array.from(pastedFiles).forEach((file) => {
        pasteFileOnList(file, listId, updatePosition);
        updatePosition = calculateCardPosition(updatePosition, nextPosition);
      });
      cardComposerState.setValue({ position: updatePosition });
    },
    [listId, nextPosition, pasteFileOnList, position],
  );

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault();
      saveCard();
    },
    [saveCard],
  );

  const handleEscape = useCallback(() => {
    const currentValue = cardComposerInputValueState.value.trim();
    updateDraft(currentValue ? { title: currentValue } : null);
    cardComposerInputValueState.setValue('');
    closeCardComposer();
  }, [updateDraft]);

  useShortcut(handleEscape, {
    scope: Scope.Board,
    key: Key.Escape,
  });

  const [isQuickCaptureTipPopoverVisible, setIsQuickCaptureTipPopoverVisible] =
    useState(false);
  const onQuickCaptureTipPopoverVisibilityChange = useCallback(
    (isVisible: boolean) => {
      setIsQuickCaptureTipPopoverVisible(isVisible);
    },
    [],
  );

  const [isAiAgentMentionSelectorVisible, setIsAiAgentMentionSelectorVisible] =
    useState(false);
  const onAiAgentMentionSelectorVisibilityChange = useCallback(
    (isVisible: boolean) => {
      setIsAiAgentMentionSelectorVisible(isVisible);
    },
    [],
  );

  const onAiAgentMentionSelectorRequestFocusRestore = useCallback(() => {
    // Restore focus to the textarea after the mention selector closes
    // Use a 100ms delay because something in the Portal unmounting process
    // steals focus back to <body> in the 0-100ms window after closing.
    // This delay ensures we restore focus after that interference completes.
    if (textareaElement) {
      setTimeout(() => {
        textareaElement.focus({ preventScroll: true });
      }, 100);
    }
  }, [textareaElement]);

  const onAiAgentMentionSelectorSelectAgent = useCallback(
    (agentName: string) => {
      const currentValue = cardComposerInputValueState.value;
      // Replace the @mention text with the agent name
      // Find the last @ symbol and replace everything after it with the agent name
      const lastAtIndex = currentValue.lastIndexOf('@');
      if (lastAtIndex !== -1) {
        const newValue =
          currentValue.substring(0, lastAtIndex) + `@${agentName} `;
        cardComposerInputValueState.setValue(newValue);
        setSelectedAgentName(agentName);
      }
    },
    [],
  );

  const onClickOutside = useCallback(() => {
    if (
      popoverProps.isVisible ||
      isQuickCaptureTipPopoverVisible ||
      (isAiAgentMentionSelectorVisible && isRovoAgentsEnabled)
    ) {
      return;
    }
    const currentValue = cardComposerInputValueState.value.trim();
    if (currentValue === '') {
      updateDraft(null);
    } else {
      saveCard();
    }
    cardComposerInputValueState.setValue('');
    closeCardComposer();
  }, [
    popoverProps.isVisible,
    isQuickCaptureTipPopoverVisible,
    isAiAgentMentionSelectorVisible,
    isRovoAgentsEnabled,
    saveCard,
    updateDraft,
  ]);

  useClickOutside({ ref, handleClickOutside: onClickOutside });

  const hideSaveMultiplePopover = useCallback(
    (reason: HideReasonType) => {
      if (reason === HideReason.CLICK_OUTSIDE) {
        if (multipleCount > MAX_CARDS) {
          hide();
          return;
        }
        saveCardsFromMultiplePopover(false);
      }
      hide();
    },
    [hide, multipleCount, saveCardsFromMultiplePopover],
  );

  const cardButtonLabel = useMemo(
    () =>
      intl.formatMessage(
        {
          id: 'templates.card_composer_inline.add-card-in',
          defaultMessage: `Add card in {listName}`,
          description: 'Button to add card to a list',
        },
        {
          listName: list?.name,
        },
      ),
    [list?.name],
  );

  const isAtOrOverLimits = useCardComposerLimits();
  if (isAtOrOverLimits) {
    return (
      <li className={styles.container} ref={ref}>
        <CardComposerLimitError />
      </li>
    );
  }

  return (
    <li className={styles.container} ref={ref}>
      <form onSubmit={onSubmit}>
        <AutosizeTextarea
          // The amount in pixels added by each row of text in a card name:
          bufferHeight={20}
          className={styles.cardComposer}
          dir="auto"
          placeholder={intl.formatMessage({
            id: 'templates.card_composer_inline.enter-a-title-or-paste-a-link',
            defaultMessage: 'Enter a title or paste a link',
            description: 'Text inside card composer component',
          })}
          onFocus={onFocus}
          shouldFocus={true}
          value={inputValue}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          data-testid={getTestId<ListTestIds>('list-card-composer-textarea')}
          ref={isRovoAgentsEnabled ? combinedRef : targetRef}
        />
        <div className={styles.cardComposerSubmit}>
          <Button
            testId={getTestId<ListTestIds>(
              'list-card-composer-add-card-button',
            )}
            appearance="primary"
            type="submit"
            aria-label={cardButtonLabel}
          >
            <FormattedMessage
              id="templates.card_composer_inline.add-card"
              defaultMessage="Add card"
              description="Button text for creating a new card"
            />
          </Button>
          {quickCaptureTipExperimentCohort !== 'not-enrolled' && (
            <LazyQuickCaptureTip
              onPopoverVisibilityChange={
                onQuickCaptureTipPopoverVisibilityChange
              }
            />
          )}
          <Button
            onClick={onClickCancel}
            iconBefore={<CloseIcon size="medium" />}
            appearance="subtle"
            aria-label={intl.formatMessage({
              id: 'templates.card_composer_inline.cancel-new-card',
              defaultMessage: 'Cancel new card',
              description: 'Button to cancel creating a new card',
            })}
            testId={getTestId<ListTestIds>('list-card-composer-cancel-button')}
          />
          <Popover
            {...popoverProps}
            onHide={hideSaveMultiplePopover}
            title="Create"
          >
            <SaveMultiplePopover
              count={multipleCount}
              saveCallback={saveCardsFromMultiplePopover}
              closeCallback={hide}
            />
          </Popover>
        </div>
      </form>
      {isRovoAgentsEnabled && (
        <AiAgentMentionSelector
          inputValue={inputValue}
          inputElement={textareaElement}
          onVisibilityChange={onAiAgentMentionSelectorVisibilityChange}
          onRequestFocusRestore={onAiAgentMentionSelectorRequestFocusRestore}
          onSelectAgent={onAiAgentMentionSelectorSelectAgent}
        />
      )}
    </li>
  );
};
