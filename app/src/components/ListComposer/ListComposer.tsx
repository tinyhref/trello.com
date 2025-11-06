import type {
  ChangeEventHandler,
  FormEventHandler,
  FunctionComponent,
  KeyboardEventHandler,
  RefObject,
} from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import FocusLock from 'react-focus-lock';
import { FormattedMessage } from 'react-intl';

import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { useClickOutside } from '@trello/dom-hooks';
import type { CurrentBoardFullListFragment } from '@trello/graphql';
import { getFragmentDocument, optimisticIdManager } from '@trello/graphql';
import { intl } from '@trello/i18n';
import { useBoardId, useWorkspaceId } from '@trello/id-context';
import { isSubmitEvent, Key, Scope, useShortcut } from '@trello/keybindings';
import { getScreenFromUrl } from '@trello/marketing-screens';
import type { Board } from '@trello/model-types';
import { Button } from '@trello/nachos/button';
import { CloseIcon } from '@trello/nachos/icons/close';
import { usePopover } from '@trello/nachos/popover';
import { SPACING } from '@trello/position';
import {
  dangerouslyConvertPrivacyString,
  type PIIString,
} from '@trello/privacy';
import { useSharedStateSelector } from '@trello/shared-state';
import { usePersistedState } from '@trello/storage';
import type { ListTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { AutosizeTextarea } from 'app/src/components/AutosizeTextarea';
import { bypassViewportCheckForListOrCardId } from 'app/src/components/List/useListsAndCardsViewportObserver';
import { useIsCreateJiraListModalOpen } from 'app/src/components/SmartList/jiraIssueModalState';
import { useIsSmartListCreationEnabled } from 'app/src/components/SmartList/useIsSmartListCreationEnabled';
import { useAddListMutation } from './AddListMutation.generated';
import { createOptimisticListResponse } from './createOptimisticListResponse';
import { CreateSmartListButton } from './CreateSmartListButton';
import { ListComposerLimitMessage } from './ListComposerLimitMessage';
import {
  closeListComposer,
  listComposerState,
  openListComposer,
} from './listComposerState';
import { useListComposerLimits } from './useListComposerLimits';

import * as styles from './ListComposer.module.less';

export interface SaveListArgs {
  name?: string;
  datasourceLink?: PIIString;
  datasourceFilter?: boolean;
  type?: 'datasource';
}

export interface ListComposerProps {
  prevPosition: number;
  position: number;
  nextPosition: number;
}

export const ListComposer: FunctionComponent<ListComposerProps> = ({
  position,
  nextPosition,
}) => {
  const boardId = useBoardId();
  const workspaceId = useWorkspaceId();

  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const limitMessageRef = useRef<HTMLDivElement>(null);
  const addListButtonRef = useSharedStateSelector(
    listComposerState,
    useCallback((state) => state.triggerRef, []),
  );

  const [createList] = useAddListMutation();

  const { hasTooManyTotalLists, isListComposerDisabled } =
    useListComposerLimits();

  const [name, setName] = useState('');

  const [draft, updateDraft] = usePersistedState<{ title: string }>(
    `boardListComposerSettings-${boardId}`,
    null,
  );

  const isSmartListCreationEnabled = useIsSmartListCreationEnabled();

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: 'inlineListComposerInlineDialog',
      containers: formatContainers({ boardId, workspaceId }),
    });
  }, [boardId, workspaceId]);

  useEffect(() => {
    if (draft?.title && !name) {
      setName(draft.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft?.title]);

  const onChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>((e) => {
    setName(e.target.value);
  }, []);

  const [isSaving, setIsSaving] = useState(false);

  const saveList = useCallback(
    async (saveListArgs: SaveListArgs = {}) => {
      const {
        name: listNameFromArgs,
        datasourceFilter,
        datasourceLink,
        type,
      } = saveListArgs;

      const listNameFromTextarea = textareaRef.current?.value.trim();
      const listName = listNameFromTextarea || listNameFromArgs;

      if (!listName || isSaving) {
        return;
      }

      setIsSaving(true);

      const isLastList = !Number.isFinite(nextPosition);

      const taskName = datasourceLink ? 'create-list/smart' : 'create-list';
      const listType = datasourceLink ? 'jira' : undefined; // only possible source is jira (currently)
      const traceId = Analytics.startTask({
        taskName,
        source: getScreenFromUrl(),
      });

      try {
        const pos = isLastList
          ? position + SPACING
          : (position + nextPosition) / 2;

        updateDraft(null);
        setName('');
        setIsSaving(false);

        if (isLastList) {
          openListComposer({ position: pos, triggerRef: addListButtonRef });
        } else {
          closeListComposer();
        }

        const optimisticId = optimisticIdManager.generateOptimisticId('List');

        await createList({
          variables: {
            name: listName,
            idBoard: boardId,
            pos,
            traceId,
            datasourceFilter,
            datasourceLink: dangerouslyConvertPrivacyString(datasourceLink),
            type,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            createList: createOptimisticListResponse({
              id: optimisticId,
              idBoard: boardId,
              name: listName,
              pos,
            }),
          },
          update(cache, { data }) {
            const newList = data?.createList;

            if (!newList) {
              return;
            }

            bypassViewportCheckForListOrCardId(newList.id);

            if (newList.id !== optimisticId) {
              optimisticIdManager.resolveId(optimisticId, newList.id);
            }

            /**
             * First part of getting optimistic updates to work is adding the list
             * to the set of board.lists, which will refresh the queries that include
             * board.lists. For example, the BoardListsContextQuery.
             */
            cache.modify<Board>({
              id: cache.identify({
                id: boardId,
                __typename: 'Board',
              }),
              fields: {
                lists(existingLists = [], { readField }) {
                  const newListRef =
                    cache.writeFragment<CurrentBoardFullListFragment>({
                      data: newList,
                      fragment: getFragmentDocument('CurrentBoardFullList'),
                      fragmentName: 'CurrentBoardFullList',
                    });

                  // Quick safety check - if the new list is already
                  // present in the cache, we don't need to add it again.
                  if (
                    !newListRef ||
                    existingLists?.some(
                      (ref) => readField('id', ref) === newList.id,
                    )
                  ) {
                    return existingLists;
                  }

                  // Append the new ref to the array of existing refs for lists
                  return (existingLists || []).concat(newListRef);
                },
              },
              optimistic: true,
            });
          },
        });

        Analytics.taskSucceeded({
          taskName,
          source: getScreenFromUrl(),
          traceId,
        });

        Analytics.sendTrackEvent({
          action: 'created',
          actionSubject: 'list',
          source: 'inlineListComposerInlineDialog',
          containers: formatContainers({ boardId, workspaceId }),
          attributes: {
            listType,
          },
        });
      } catch (error) {
        setName(listName);
        setIsSaving(false);

        Analytics.taskFailed({
          taskName,
          source: getScreenFromUrl(),
          traceId,
          error,
        });
      }
    },
    [
      createList,
      boardId,
      workspaceId,
      isSaving,
      nextPosition,
      position,
      updateDraft,
      addListButtonRef,
    ],
  );

  const onSubmit = useCallback<FormEventHandler>(
    (e) => {
      e.preventDefault();
      saveList();
    },
    [saveList],
  );

  const onKeyDown = useCallback<KeyboardEventHandler<HTMLTextAreaElement>>(
    (e) => {
      if (isSubmitEvent(e)) {
        e.preventDefault();
        saveList();
      }
    },
    [saveList],
  );

  const onCloseListComposer = useCallback(() => {
    const title = textareaRef.current?.value.trim();
    updateDraft(title ? { title } : null);
    closeListComposer();
  }, [updateDraft]);

  useShortcut(onCloseListComposer, {
    key: Key.Escape,
    scope: Scope.Board,
  });

  const { triggerRef, toggle, hide, popoverProps } =
    usePopover<HTMLButtonElement>();

  const getOutsideRef = useCallback(() => {
    /**
     * useClickOutside hook determines if a click is
     * outside of the ref passed to it, and if so closes the
     * list composer.
     *
     * When the smart list popover is visible, we want
     * to have that ref be the one that we check for
     * clicks instead of the list composer ref.
     */
    if (isListComposerDisabled) {
      return limitMessageRef;
    } else if (popoverProps.isVisible) {
      return triggerRef;
    } else {
      return formRef;
    }
  }, [triggerRef, isListComposerDisabled, popoverProps.isVisible]);

  const isCreateJiraListModalOpen = useIsCreateJiraListModalOpen();

  const clickOutsideRef = getOutsideRef();
  useClickOutside({
    ref: clickOutsideRef as RefObject<HTMLElement>,
    handleClickOutside: onCloseListComposer,
    enabled: !isCreateJiraListModalOpen,
  });

  return (
    <div className={styles.listComposerContainer}>
      {isListComposerDisabled ? (
        <ListComposerLimitMessage
          hasTooManyTotalLists={hasTooManyTotalLists}
          ref={limitMessageRef}
        />
      ) : (
        <FocusLock
          returnFocus={() => {
            requestAnimationFrame(() => {
              addListButtonRef?.current?.focus();
            });
            return false;
          }}
        >
          <form
            className={styles.listComposer}
            onSubmit={onSubmit}
            ref={formRef}
          >
            <AutosizeTextarea
              value={name}
              onChange={onChange}
              onKeyDown={onKeyDown}
              className={styles.listNameTextarea}
              ref={textareaRef}
              shouldFocus={true}
              spellCheck="false"
              dir="auto"
              maxLength={512}
              autoComplete="off"
              name={intl.formatMessage({
                id: 'templates.list_add.enter-list-name-ellipsis',
                defaultMessage: 'Enter list name…',
                description: 'Text inside list composer component',
              })}
              placeholder={intl.formatMessage({
                id: 'templates.list_add.enter-list-name-ellipsis',
                defaultMessage: 'Enter list name…',
                description: 'Text inside list composer component',
              })}
              aria-label={intl.formatMessage({
                id: 'templates.list_add.enter-list-name-ellipsis',
                defaultMessage: 'Enter list name…',
                description: 'Text inside list composer component',
              })}
              data-testid={getTestId<ListTestIds>('list-name-textarea')}
            />
            <div className={styles.listComposerSubmit}>
              <Button
                appearance="primary"
                isLoading={isSaving}
                type="submit"
                testId={getTestId<ListTestIds>('list-composer-add-list-button')}
              >
                <FormattedMessage
                  id="templates.list_add.add-list"
                  defaultMessage="Add list"
                  description="The button to add a list"
                />
              </Button>

              {isSmartListCreationEnabled && (
                <CreateSmartListButton
                  saveList={saveList}
                  toggle={toggle}
                  hide={hide}
                  triggerRef={triggerRef}
                  popoverProps={popoverProps}
                />
              )}

              <Button
                appearance="subtle"
                iconBefore={<CloseIcon size="medium" />}
                onClick={closeListComposer}
                aria-label={intl.formatMessage({
                  id: 'templates.list_add.cancel-edit-list',
                  defaultMessage: 'Cancel list editing',
                  description: 'The button to cancel list editing',
                })}
                testId={getTestId<ListTestIds>('list-composer-cancel-button')}
              />
            </div>
          </form>
        </FocusLock>
      )}
    </div>
  );
};
