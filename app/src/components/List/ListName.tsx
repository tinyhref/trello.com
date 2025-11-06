import cx from 'classnames';
import type {
  ChangeEventHandler,
  FocusEventHandler,
  FunctionComponent,
  KeyboardEventHandler,
  RefObject,
} from 'react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { developerConsoleState } from '@trello/developer-console-state';
import { useBoardId, useListId } from '@trello/id-context';
import { getKey, Key } from '@trello/keybindings';
import { useSharedStateSelector } from '@trello/shared-state';
import type { ListTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { AutosizeTextarea } from 'app/src/components/AutosizeTextarea';
import { useCanEditBoard } from 'app/src/components/BoardPermissionsContext';
import { useIsSmartList } from 'app/src/components/SmartList/useIsSmartList';
import { stopPropagationAndPreventDefault } from 'app/src/stopPropagationAndPreventDefault';
import { useListNameFragment } from './ListNameFragment.generated';
import { useUpdateListNameMutation } from './UpdateListNameMutation.generated';
import { useIsListCollapsed } from './useListContext';
import { useHasListOrCardBeenInViewport } from './useListsAndCardsViewportObserver';

import * as styles from './ListName.module.less';

interface ListNameProps {
  // Reference to the parent element (ie, <ListHeader>) which is used to fix
  // some issues related to textareas inside draggable elements.
  headerRef: RefObject<HTMLDivElement>;
}

export const ListName: FunctionComponent<ListNameProps> = ({ headerRef }) => {
  const boardId = useBoardId();
  const listId = useListId();
  const showModelIds = useSharedStateSelector(
    developerConsoleState,
    useCallback((state) => state.showModelIds, []),
  );
  const isSmartList = useIsSmartList(listId);
  const isListCollapsed = useIsListCollapsed();

  const { data: list } = useListNameFragment({
    from: { id: listId },
    optimistic: true,
  });

  const canEditBoard = useCanEditBoard();

  const [updateListName] = useUpdateListNameMutation();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [shouldFocusButton, setShouldFocusButton] = useState(false);

  // Focus the button when editing stops
  useLayoutEffect(() => {
    if (!isEditing && shouldFocusButton && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [isEditing, shouldFocusButton]);

  // Ensure the textarea value is populated with the name from cache.
  // Runs if the list name is changed while the textarea is inactive, e.g.
  // on initial page load, or if the list name is changed by another user.
  useLayoutEffect(() => {
    if (!isEditing && list?.name && list.name !== textareaRef.current?.value) {
      setName(list.name);
    }
  }, [isEditing, list?.name]);

  // Wait until the list has entered the viewport before rendering the textarea.
  // This resolves a niche issue related to opening a board directly into a
  // different view, wherein the lists view is still rendered, but set to
  // display: none, which causes the list name's height calculation to break.
  const hasListBeenInViewport = useHasListOrCardBeenInViewport(listId);

  const isDisabled = !canEditBoard || !hasListBeenInViewport || isListCollapsed;

  const startEditing = useCallback(async () => {
    if (isDisabled) {
      return;
    }

    if (headerRef.current) {
      headerRef.current.draggable = false;
    }

    setShouldFocusButton(true);
    setIsEditing(true);
  }, [isDisabled, headerRef]);

  const stopEditing = useCallback(async () => {
    setIsEditing(false);

    if (headerRef.current) {
      headerRef.current.draggable = true;
    }

    if (document.activeElement === textareaRef.current) {
      textareaRef.current?.blur();
    }
  }, [headerRef]);

  const onChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(
    (event) => {
      setName(event.target.value);
    },
    [],
  );

  const isSavingRef = useRef(false);
  const onSave = useCallback(async () => {
    if (isSavingRef.current) {
      return;
    }

    const trimmedName = name.trim();
    if (!trimmedName || list?.name === trimmedName) {
      setName(list?.name ?? '');
      stopEditing();
      return;
    }

    isSavingRef.current = true;

    const traceId = Analytics.startTask({
      taskName: 'edit-list/name',
      source: 'boardScreen',
    });

    try {
      stopEditing();

      await updateListName({
        variables: {
          listId,
          name: trimmedName,
          traceId,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateListName: {
            id: listId,
            name: trimmedName,
            __typename: 'List',
          },
        },
      });

      Analytics.taskSucceeded({
        taskName: 'edit-list/name',
        source: 'boardScreen',
        traceId,
      });

      Analytics.sendTrackEvent({
        action: 'edited',
        actionSubject: 'listName',
        source: 'boardScreen',
        containers: formatContainers({ boardId }),
        attributes: {
          taskId: traceId,
          isSmartList,
        },
      });
    } catch (err) {
      Analytics.taskFailed({
        taskName: 'edit-list/name',
        source: 'boardScreen',
        traceId,
        error: err,
      });
    }

    isSavingRef.current = false;
  }, [
    boardId,
    isSmartList,
    list?.name,
    listId,
    name,
    stopEditing,
    updateListName,
  ]);

  const onKeyDown = useCallback<KeyboardEventHandler<HTMLTextAreaElement>>(
    (event) => {
      if (getKey(event) === Key.Enter) {
        event.preventDefault();
        onSave();
      } else if (getKey(event) === Key.Escape) {
        event.preventDefault();
        stopEditing();
      }
    },
    [onSave, stopEditing],
  );

  const onFocus = useCallback<FocusEventHandler<HTMLTextAreaElement>>(
    (event) => {
      startEditing();
      event.target.select();
    },
    [startEditing],
  );

  return (
    <div
      className={cx(
        styles.container,
        isListCollapsed && styles['container--collapsed'],
      )}
    >
      <h2
        className={styles.heading}
        dir="auto"
        data-testid={getTestId<ListTestIds>('list-name')}
        id={`list-${listId}`}
      >
        <button
          ref={buttonRef}
          className={cx({
            [styles.listName]: true,
            [styles['listName--disabled']]: isDisabled,
          })}
          hidden={isEditing}
          onClick={startEditing}
        >
          {/* This span is a workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=568313 Making 
          the button content take up all the space in the button allows it to be draggable in FireFox */}
          <span className={styles.ListNameText}>{list?.name}</span>
        </button>
      </h2>
      {showModelIds && <p className={styles.listId}>{listId}</p>}
      {!isDisabled && (
        <AutosizeTextarea
          aria-label={name}
          className={cx({
            [styles.listNameTextarea]: true,
            [styles['listNameTextarea--editing']]: isEditing,
          })}
          dir="auto"
          maxLength={512}
          onBlur={onSave}
          onChange={onChange}
          // Disable the drag start event, which ensures that the textarea's
          // contents are not draggable. Without this, the value of the textarea
          // can be dragged, which is undesirable.
          onDragStart={stopPropagationAndPreventDefault}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          ref={textareaRef}
          shouldFocus={isEditing}
          spellCheck="false"
          value={name}
          tabIndex={isEditing ? 0 : -1}
          data-testid={getTestId<ListTestIds>('list-name-textarea')}
        />
      )}
    </div>
  );
};
