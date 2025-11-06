import cx from 'classnames';
import type { FunctionComponent, MouseEventHandler } from 'react';
import { useCallback, useEffect } from 'react';

import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { isMemberLoggedIn } from '@trello/authentication';
import { useIsTemplateBoard } from '@trello/business-logic-react/board';
import { intl } from '@trello/i18n';
import { useBoardId, useListId, useWorkspaceId } from '@trello/id-context';
import { Button } from '@trello/nachos/button';
import { OverflowMenuHorizontalIcon } from '@trello/nachos/icons/overflow-menu-horizontal';
import { usePopover } from '@trello/nachos/popover';
import { Tooltip } from '@trello/nachos/tooltip';
import { useSharedStateSelector } from '@trello/shared-state';
import type { ListTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { useCanEditBoard } from 'app/src/components/BoardPermissionsContext';
import { LazyListActionsPopover } from 'app/src/components/ListActionsPopover';
import { listDragAndDropState } from './listDragAndDropState';
import { useListNameFragment } from './ListNameFragment.generated';

import * as styles from './ListEditButton.module.less';

export const ListEditButton: FunctionComponent = () => {
  const boardId = useBoardId();
  const listId = useListId();
  const workspaceId = useWorkspaceId();

  const canEditBoard = useCanEditBoard();
  const isTemplateBoard = useIsTemplateBoard(boardId);
  const { data: list } = useListNameFragment({
    from: { id: listId },
    optimistic: true,
  });

  // Render the edit button if the user can edit the board.
  // If the board is not a template, logged in users can watch the list.
  const shouldRender = canEditBoard || (!isTemplateBoard && isMemberLoggedIn());

  const isDragging = useSharedStateSelector(
    listDragAndDropState,
    useCallback((state) => state.listId === listId, [listId]),
  );

  const { popoverProps, toggle, hide, triggerRef, push, pop } =
    usePopover<HTMLButtonElement>({});

  useEffect(() => {
    if (isDragging) {
      hide();
    }
  }, [isDragging, popoverProps.isVisible, hide]);

  const openListMenu = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
    toggle();

    Analytics.sendClickedButtonEvent({
      buttonName: 'listMenuButton',
      source: 'listHeader',
      containers: formatContainers({
        idBoard: boardId,
        idList: listId,
        idOrganization: workspaceId,
      }),
    });
  }, [toggle, boardId, listId, workspaceId]);

  if (!shouldRender) {
    return null;
  }

  return (
    <>
      <Tooltip
        content={intl.formatMessage({
          id: 'view title.list actions',
          defaultMessage: 'List actions',
          description: 'List actions',
        })}
      >
        <Button
          appearance="subtle"
          ref={triggerRef}
          iconBefore={
            <OverflowMenuHorizontalIcon color="currentColor" size="small" />
          }
          // isSelected prop controls hover style of buttons, so need to break up class names
          // for non-selected and selected states
          className={cx(
            popoverProps.isVisible
              ? styles[`listEditButton--isSelected`]
              : styles.listEditButton,
          )}
          onClick={openListMenu}
          aria-haspopup="true"
          data-testid={getTestId<ListTestIds>('list-edit-menu-button')}
          isSelected={popoverProps.isVisible}
          aria-label={
            list?.name
              ? intl.formatMessage(
                  {
                    id: 'templates.list_menu.more-actions-on-list-name',
                    defaultMessage: 'More actions on {listName}',
                    description: 'More actions on list',
                  },
                  { listName: list?.name },
                )
              : intl.formatMessage({
                  id: 'templates.list_menu.more-actions',
                  defaultMessage: 'More actions',
                  description: 'More actions',
                })
          }
        />
      </Tooltip>

      {popoverProps.isVisible && (
        <LazyListActionsPopover
          push={push}
          hide={hide}
          pop={pop}
          popoverProps={popoverProps}
        />
      )}
    </>
  );
};
