import cx from 'classnames';
import type { FunctionComponent } from 'react';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';

import type { ElementGetFeedbackArgs } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/dist/types/internal-types';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { autoScrollForExternal } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/external';
import { unsafeOverflowAutoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/element';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import type {
  ElementDragType,
  ExternalDragType,
} from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useGpuAcceleratedFeatures } from '@trello/gpu';
import { optimisticIdManager } from '@trello/graphql';
import { useBoardId } from '@trello/id-context';
import { useSharedStateSelector } from '@trello/shared-state';
import {
  islandOverlapSharedState,
  useAreMultiplePanelsOpen,
} from '@trello/split-screen';
import type { ListTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';

import { useBoardListsContext } from 'app/src/components/BoardListsContext';
import { useCanEditBoard } from 'app/src/components/BoardPermissionsContext';
import { useCollapsedListsStateGarbageCollector } from 'app/src/components/CollapsedListsState';
import { useIsInboxBoard } from 'app/src/components/Inbox';
import { LIST_WIDTH, MemoizedList } from 'app/src/components/List';
import { ListGap } from 'app/src/components/List/ListGap';
import { useIncrementalIdleItemRenderer } from 'app/src/components/List/useIncrementalIdleItemRenderer';
import { useSetupListsAndCardsViewportObserver } from 'app/src/components/List/useListsAndCardsViewportObserver';
import { AddListButton } from 'app/src/components/ListComposer/AddListButton';
import { MemoizedPossibleListComposer } from 'app/src/components/ListComposer/PossibleListComposer';
import { useIsKeyboardShortcutsEnabled } from 'app/src/components/Shortcuts/useIsKeyboardShortcutsEnabled';
import {
  DRAG_SCROLL_DISABLED_ATTRIBUTE,
  enableDragScroll,
} from 'app/src/enableDragScroll';
import { BoardListViewKeyboardShortcutListener } from './BoardListViewKeyboardShortcutListener';
import { useAttachCopyHandler } from './useAttachCopyHandler';
import { useAttachPasteHandler } from './useAttachPasteHandler';
import { usePossiblyOpenCardComposerInFirstList } from './usePossiblyOpenCardComposerInFirstList';
import { usePossiblyOpenListComposer } from './usePossiblyOpenListComposer';

import * as styles from './BoardLists.module.less';

let pageSize: number;
const getPageSize = () => {
  if (!pageSize) {
    pageSize = Math.max(Math.ceil(window.innerWidth / LIST_WIDTH), 5);
  }
  return pageSize;
};

// We want our board to overflow scroll beyond the left and right edge indefinitely.
// We are choosing `6000px` to represent "forever".
const overflow = {
  forRightEdge: { top: 6000, right: 6000, bottom: 6000 },
  forLeftEdge: { top: 6000, bottom: 6000, left: 6000 },
};
// Exported for unit tests, don't rely on this elsewhere.
export const getOverflow = () => overflow;

const scrollTypeAllowList = new Set([
  'trello/card',
  'trello/list',
  'trello/member',
]);

export const canScroll = (isDraggedOver: boolean = false) => {
  return (args: ElementGetFeedbackArgs<ElementDragType>): boolean => {
    const type = args.source.data.type;
    return isDraggedOver && scrollTypeAllowList.has(type as string);
  };
};

export const canScrollExternal = (isDraggedOver: boolean = false) => {
  return (args: ElementGetFeedbackArgs<ExternalDragType>): boolean => {
    return (
      isDraggedOver && args.source.types.includes('application/vnd.trello.card')
    );
  };
};

interface ListAndComposerProps {
  lists: Array<{
    id: string;
    pos: number;
    type?: 'datasource' | null;
  }>;
  index: number;
  id: string;
  pos: number;
}

export const ListAndComposer: FunctionComponent<ListAndComposerProps> = ({
  lists,
  index,
  id,
  pos,
}) => (
  <>
    <MemoizedList listId={id} position={pos} />
    <MemoizedPossibleListComposer
      prevPosition={lists[index - 1]?.pos ?? 0}
      position={pos}
      nextPosition={lists[index + 1]?.pos ?? Infinity}
    />
  </>
);

export const BoardLists: FunctionComponent = () => {
  const boardId = useBoardId();

  const ref = useRef<HTMLOListElement>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const isGpuAcceleratedFeaturesEnabled = useGpuAcceleratedFeatures();

  const canEditBoard = useCanEditBoard();
  const isInboxBoard = useIsInboxBoard();
  const isKeyboardShortcutsEnabled = useIsKeyboardShortcutsEnabled();

  const areMultiplePanelsOpen = useAreMultiplePanelsOpen();
  const isIslandOverlapping = useSharedStateSelector(
    islandOverlapSharedState,
    useCallback((state) => state.board, []),
  );

  const lists = useBoardListsContext(useCallback((value) => value.lists, []));

  usePossiblyOpenCardComposerInFirstList();
  usePossiblyOpenListComposer();

  useIncrementalIdleItemRenderer({
    queueId: boardId,
    items: lists ?? [],
    pageSize: getPageSize(),
    isLoading: !lists,
  });

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    return combine(
      autoScrollForElements({
        element: ref.current,
        getConfiguration: () => ({ maxScrollSpeed: 'fast' }),
        canScroll: canScroll(isDraggedOver),
      }),
      autoScrollForExternal({
        element: ref.current,
        getConfiguration: () => ({ maxScrollSpeed: 'fast' }),
        canScroll: canScrollExternal(isDraggedOver),
      }),
      unsafeOverflowAutoScrollForElements({
        element: ref.current,
        getOverflow,
        canScroll: canScroll(isDraggedOver),
      }),
      enableDragScroll(ref.current, {
        fxIgnore: (e) => {
          // Ignore clicks in interactive elements.
          const target = e.target as HTMLElement;
          if (target.closest(`[${DRAG_SCROLL_DISABLED_ATTRIBUTE}]`)) {
            return true;
          }

          const boardElement = e.currentTarget as HTMLElement;
          const boardHeight = boardElement.getBoundingClientRect().height;
          const scrollbarHeight = 12;
          // Ignore clicks on the scrollbar.
          if (e.offsetY > boardHeight - scrollbarHeight) {
            return true;
          }

          return false;
        },
      }),
      monitorForElements({
        onDrag: ({ location }) => {
          // Check if any of the drop targets currently being dragged over are contained within
          // this board, and if so, set setIsDraggedOver to true.
          if (
            location.current.dropTargets.some((dropTarget) =>
              ref.current?.contains(dropTarget.element),
            )
          ) {
            setIsDraggedOver(true);
          } else {
            setIsDraggedOver(false);
          }
        },
      }),
    );
  }, [isDraggedOver]);

  useAttachCopyHandler();
  useAttachPasteHandler(canEditBoard && !isInboxBoard);

  useSetupListsAndCardsViewportObserver();
  useCollapsedListsStateGarbageCollector();

  return (
    <ol
      id="board"
      ref={ref}
      className={cx({
        [styles.lists]: true,
        [styles.animate]: isGpuAcceleratedFeaturesEnabled,
        'js-no-higher-edits': true,
        'u-fancy-scrollbar': true,
        [styles.islandOverlap]: isIslandOverlapping,
        [styles.singlePanel]: !areMultiplePanelsOpen,
      })}
      data-testid={getTestId<ListTestIds>('lists')}
    >
      <MemoizedPossibleListComposer
        prevPosition={-1}
        position={0}
        nextPosition={lists?.length ? lists[0].pos : Infinity}
      />
      <ListGap
        prevPosition={-1}
        position={0}
        nextPosition={lists?.length ? lists[0].pos : Infinity}
      />
      {lists?.map((list, index) => (
        <Fragment key={optimisticIdManager.getStableIdKey(list.id)}>
          <ListAndComposer
            lists={lists}
            index={index}
            id={list.id}
            pos={list.pos}
          />
          {index < lists.length - 1 && (
            <ListGap
              prevPosition={lists[index - 1]?.pos ?? 0}
              position={list.pos}
              nextPosition={lists[index + 1]?.pos ?? 0}
            />
          )}
        </Fragment>
      ))}
      {canEditBoard && !isInboxBoard && (
        <AddListButton
          position={lists?.[lists.length - 1]?.pos ?? 0}
          hasOpenLists={Boolean(lists?.length)}
        />
      )}
      {isKeyboardShortcutsEnabled && <BoardListViewKeyboardShortcutListener />}
    </ol>
  );
};
