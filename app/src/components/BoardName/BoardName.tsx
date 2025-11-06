import cx from 'classnames';
import type {
  FocusEventHandler,
  FunctionComponent,
  KeyboardEventHandler,
  KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Analytics } from '@trello/atlassian-analytics';
import { developerConsoleState } from '@trello/developer-console-state';
import { showFlag } from '@trello/nachos/experimental-flags';
import { useSharedStateSelector } from '@trello/shared-state';
import type { BoardHeaderTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';
import { token } from '@trello/theme';

import { useCanRenameBoard } from 'app/src/components/BoardPermissionsContext';
import { stopPropagationAndPreventDefault } from 'app/src/stopPropagationAndPreventDefault';
import type { BoardNameProps } from './BoardName.types';
import { useBoardNameFragment } from './BoardNameFragment.generated';
import { useUpdateBoardNameMutation } from './UpdateBoardNameMutation.generated';

import * as styles from './BoardName.module.less';

/**
 * This instance of BoardName is the OG version based on client-side graphql data.
 * @param boardId Id of the board that we're currently rendering
 */
export const BoardName: FunctionComponent<BoardNameProps> = ({ boardId }) => {
  const showModelIds = useSharedStateSelector(
    developerConsoleState,
    useCallback((state) => state.showModelIds, []),
  );
  const intl = useIntl();
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [updateBoardName] = useUpdateBoardNameMutation();

  const { data: board } = useBoardNameFragment({
    from: { id: boardId },
  });
  const boardName = board?.name;

  const canRename = useCanRenameBoard();

  /**
   * Resizes the board name input up to the maximum width of the board header. Currently,
   * this gets the board header width via a document query, but once the board header is
   * completely in react should be done via a passed ref instead
   */
  const resizeInput = useCallback(() => {
    if (!inputRef?.current) {
      return;
    }
    inputRef.current.style.width = '0';
    let inputWidthForNewValue = inputRef.current.offsetWidth;

    inputRef.current.scrollLeft = 1e10;
    // With the width set to zero and the input scrolled to the end of the content, the element's
    // scrollLeft value is the width of the content! Now we add that to the offset.
    inputWidthForNewValue += inputRef.current.scrollLeft;

    // Here we make sure the input doesn't fall off the side of the page. The "-24" is for padding.
    // eslint-disable-next-line @trello/no-query-selector
    const boardHeader = document.querySelector<HTMLElement>('.js-board-header');
    const headerOffsetWidth = boardHeader?.offsetWidth;
    const maxWidth = (headerOffsetWidth || 1e10) - 24;

    const inputWidth =
      inputWidthForNewValue < maxWidth ? inputWidthForNewValue : maxWidth;
    // Now we have an input that's only as wide as the content needs, without running off the page.
    inputRef.current.style.width = inputWidth + 'px';
  }, [inputRef]);

  const onStartEditing = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      stopPropagationAndPreventDefault(e);
      if (isEditing || !canRename) {
        return;
      }

      setIsEditing(true);

      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'input',
        actionSubjectId: 'boardNameInput',
        source: 'boardScreen',
        containers: {
          board: {
            id: boardId,
          },
        },
      });
    },
    [isEditing, canRename, boardId],
  );

  // focus and select the input onClick. This is done here because the input ref
  // is not yet defined in the onClick of the div
  useEffect(() => {
    if (isEditing) {
      inputRef?.current?.focus();
      inputRef?.current?.select();
    }
  }, [inputRef, isEditing]);

  /**
   * Reset the input when we change boards
   */
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = boardName || '';
    }
  }, [boardId, boardName]);

  const onEndEditing: FocusEventHandler<HTMLInputElement> = useCallback(
    async (e) => {
      if (!isEditing) {
        return;
      }

      const newBoardName = e.currentTarget.value.trim();

      if (!newBoardName || newBoardName === '') {
        if (inputRef.current) {
          inputRef.current.value = boardName || '';
        }
        setIsEditing(false);
        return;
      }

      setIsEditing(false);

      if (newBoardName === boardName) {
        return;
      }

      const traceId = Analytics.startTask({
        taskName: 'edit-board/name',
        source: 'boardScreen',
      });

      try {
        await updateBoardName({
          variables: {
            boardId,
            traceId,
            board: {
              name: newBoardName,
            },
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateBoard: {
              __typename: 'Board',
              id: boardId,
              name: newBoardName,
            },
          },
        });

        Analytics.taskSucceeded({
          taskName: 'edit-board/name',
          source: 'boardScreen',
          traceId,
        });
      } catch (error) {
        Analytics.taskFailed({
          taskName: 'edit-board/name',
          source: 'boardScreen',
          traceId,
          error,
        });

        showFlag({
          id: 'change-board-name-error',
          title: (
            <FormattedMessage
              id="templates.your-cards.something-went-wrong"
              defaultMessage="Something went wrong"
              description="Message displayed when board name update fails."
            />
          ),
          appearance: 'error',
          isAutoDismiss: true,
        });
      }
    },
    [isEditing, boardName, updateBoardName, boardId],
  );

  // Ensure the element is focusable via the keyboard
  const onWrapperKeyUp: KeyboardEventHandler = useCallback(
    (e: ReactKeyboardEvent<Element>) => {
      if (e.key === 'Enter') {
        onStartEditing(e);
      }
    },
    [onStartEditing],
  );

  // Pressing Enter submits the name change
  const onInputKeyUp: KeyboardEventHandler = useCallback(
    (e: ReactKeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.currentTarget.blur();
      }
    },
    [],
  );

  return (
    <>
      <div
        className={cx({
          [styles.boardNameContainer]: true,
          [styles.boardNameRenamable]: canRename,
          [styles.isEditing]: isEditing,
        })}
        data-testid={getTestId<BoardHeaderTestIds>('board-name-container')}
        tabIndex={0}
        aria-label={intl.formatMessage({
          id: 'templates.board_header.board-name',
          defaultMessage: 'Board name',
          description: 'Aria label for the board name input field.',
        })}
        role="textbox"
        onKeyUp={onWrapperKeyUp}
        onClick={onStartEditing}
      >
        <input
          data-testid={getTestId<BoardHeaderTestIds>('board-name-input')}
          defaultValue={boardName}
          ref={inputRef}
          onBlur={onEndEditing}
          // Make sure the initial input is correctly sized
          onFocus={resizeInput}
          // Make sure the input is resized as a user types
          onInput={resizeInput}
          className={cx(styles.boardNameInput)}
          onKeyUp={onInputKeyUp}
        />
        <h1
          className={styles.boardName}
          data-testid={getTestId<BoardHeaderTestIds>('board-name-display')}
        >
          {boardName}
        </h1>
      </div>
      {showModelIds && (
        <p style={{ marginTop: token('space.075', '6px') }}>{boardId}</p>
      )}
    </>
  );
};
