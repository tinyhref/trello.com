import cx from 'classnames';
import type { FunctionComponent, HTMLAttributes, RefObject } from 'react';
import { useMemo, useRef } from 'react';

import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { useBoardId, useListId, useWorkspaceId } from '@trello/id-context';
import type { ListTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { expandList } from 'app/src/components/CollapsedListsState';
import { useIsInboxBoard } from 'app/src/components/Inbox';
import { CollapseListButton } from './CollapseListButton';
import { ListEditButton } from './ListEditButton';
import { ListHeaderCardCount } from './ListHeaderCardCount';
import { ListLimitsPowerUpBadge } from './ListLimitsPowerUpBadge';
import { ListName } from './ListName';
import { ListSubscribedIcon } from './ListSubscribedIcon';
import { useIsListCollapsed } from './useListContext';
import { useListHeaderAsDragHandle } from './useListHeaderAsDragHandle';

import * as styles from './ListHeader.module.less';

interface ListHeaderProps {
  listRef: RefObject<HTMLDivElement>;
  position: number;
}

export const ListHeader: FunctionComponent<ListHeaderProps> = ({
  listRef,
  position,
}) => {
  const workspaceId = useWorkspaceId();
  const boardId = useBoardId();
  const listId = useListId();
  const handleRef = useRef<HTMLDivElement>(null);
  const isInboxBoard = useIsInboxBoard();

  useListHeaderAsDragHandle({
    listRef,
    handleRef,
    listId,
    position,
  });

  const isCollapsed = useIsListCollapsed();

  const collapsedAttributes = useMemo<
    Pick<HTMLAttributes<HTMLDivElement>, 'onClick' | 'role'>
  >(() => {
    if (!isCollapsed) {
      return {};
    }
    return {
      onClick: () => {
        expandList(listId);

        Analytics.sendClickedButtonEvent({
          buttonName: 'expandListButton',
          source: 'boardScreen',
          containers: formatContainers({ boardId, listId, workspaceId }),
        });
      },
      role: 'button',
    };
  }, [isCollapsed, boardId, listId, workspaceId]);

  return (
    <div
      className={cx(styles.listHeader, isCollapsed && styles.collapsed)}
      ref={handleRef}
      data-testid={getTestId<ListTestIds>('list-header')}
      {...collapsedAttributes}
    >
      <ListName headerRef={handleRef} />
      {!isCollapsed && (
        <>
          <ListSubscribedIcon />
          <ListLimitsPowerUpBadge />
        </>
      )}
      {!isInboxBoard && <CollapseListButton />}
      {!isCollapsed && !isInboxBoard && <ListEditButton />}
      <ListHeaderCardCount />
    </div>
  );
};
