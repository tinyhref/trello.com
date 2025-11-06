import type { FunctionComponent, MouseEvent } from 'react';
import { useCallback, useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { DynamicButton } from '@trello/dynamic-tokens';
import { useBoardId, useWorkspaceId } from '@trello/id-context';
import { AddIcon } from '@trello/nachos/icons/add';
import { useSharedStateSelector } from '@trello/shared-state';
import type { ListTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { DRAG_SCROLL_DISABLED_ATTRIBUTE } from 'app/src/enableDragScroll';
import { ListComposerLimitMessage } from './ListComposerLimitMessage';
import { listComposerState, openListComposer } from './listComposerState';
import { useListComposerLimits } from './useListComposerLimits';

import * as styles from './AddListButton.module.less';

interface AddListButtonProps {
  position: number;
  hasOpenLists?: boolean;
}

export const AddListButton: FunctionComponent<AddListButtonProps> = ({
  position,
  hasOpenLists = true,
}) => {
  const boardId = useBoardId();
  const workspaceId = useWorkspaceId();
  const isListComposerOpen = useSharedStateSelector(
    listComposerState,
    useCallback((state) => state.isOpen, []),
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const onClick = useCallback(() => {
    openListComposer({ position, triggerRef });

    Analytics.sendClickedButtonEvent({
      buttonName: 'addAnotherListButton',
      source: 'boardScreen',
      containers: formatContainers({ boardId, workspaceId }),
    });
  }, [position, workspaceId, boardId]);

  const onDoubleClick = useCallback(
    (e: MouseEvent) => {
      if (e.target && e.target === containerRef.current) {
        onClick();
      }
    },
    [onClick],
  );

  const { hasTooManyTotalLists, isListComposerDisabled } =
    useListComposerLimits();

  return (
    <li className={styles.buttonListContainer}>
      <div
        className={styles.addListButtonContainer}
        onDoubleClick={onDoubleClick}
        ref={containerRef}
        hidden={isListComposerOpen}
        data-testid={getTestId<ListTestIds>('list-composer-button-container')}
        role="presentation"
      >
        {isListComposerDisabled ? (
          <ListComposerLimitMessage
            className={styles.limitMessage}
            hasTooManyTotalLists={hasTooManyTotalLists}
          />
        ) : (
          <DynamicButton
            ref={triggerRef}
            className={styles.addListButton}
            iconBefore={<AddIcon size="small" />}
            onClick={onClick}
            testId={getTestId<ListTestIds>('list-composer-button')}
            {...{ [DRAG_SCROLL_DISABLED_ATTRIBUTE]: true }}
          >
            {hasOpenLists ? (
              <FormattedMessage
                id="templates.list_add.add-another-list"
                defaultMessage="Add another list"
                description="The text of the button for adding another list when there are already open lists"
              />
            ) : (
              <FormattedMessage
                id="templates.list_add.add-a-list"
                defaultMessage="Add a list"
                description="The text of the button for adding a new list when there are no open lists"
              />
            )}
          </DynamicButton>
        )}
      </div>
    </li>
  );
};
