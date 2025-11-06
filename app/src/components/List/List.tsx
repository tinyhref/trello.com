import cx from 'classnames';
import type { FunctionComponent } from 'react';
import { useRef } from 'react';

import type { ListTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { useIsInboxBoard } from 'app/src/components/Inbox';
import { DRAG_SCROLL_DISABLED_ATTRIBUTE } from 'app/src/enableDragScroll';
import { ListCards } from './ListCards';
import { ListColorUpdater } from './ListColorUpdater';
import { ListFooter } from './ListFooter';
import { ListHeader } from './ListHeader';
import {
  useIsListCollapsed,
  useShouldRenderListContent,
} from './useListContext';
import { useListDropExternal } from './useListDropExternal';
import { useListDropFiles } from './useListDropFiles';
import { useListDropText } from './useListDropText';

import * as styles from './List.module.less';

interface ListProps {
  listId: string;
  position: number;
  isActiveDropTarget: boolean;
  moveState: string;
}

export const List: FunctionComponent<ListProps> = ({
  listId,
  position,
  isActiveDropTarget,
  moveState,
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  const isCollapsed = useIsListCollapsed();
  const shouldRenderContent = useShouldRenderListContent();
  const isInboxBoard = useIsInboxBoard();

  useListDropFiles({ listId, listRef });
  useListDropText({ listId, listRef });
  useListDropExternal({ listId, listRef });

  return (
    <div
      className={cx({
        [styles.list]: true,
        [styles.collapsed]: isCollapsed,
        [styles.dropTarget]: isActiveDropTarget,
        [styles.isDragging]: moveState !== 'idle',
      })}
      ref={listRef}
      data-testid={getTestId<ListTestIds>('list')}
      {...{ [DRAG_SCROLL_DISABLED_ATTRIBUTE]: true }}
    >
      <ListHeader listRef={listRef} position={position} />
      {shouldRenderContent && <ListCards />}
      {!isInboxBoard && <ListFooter />}
      {shouldRenderContent && <ListColorUpdater listRef={listRef} />}
    </div>
  );
};
