import { useCallback, useEffect, useRef } from 'react';

import { addIdleTask, clearIdleTask } from '@trello/idle-task-scheduler';
import { SharedState, useSharedStateSelector } from '@trello/shared-state';

const state = new SharedState<Record<string, number>>({});
// The SharedState should be treated as a local value (hence its short name),
// but we want to export it for unit tests, so use this alias externally.
export const incrementalIdleItemRendererState = state;

interface IncrementalIdleItemRendererProps {
  /**
   * The ID of the parent model. For example, when incrementally rendering lists
   * on a board, the queue ID should be the board ID.
   */
  queueId: string;
  /**
   * The items to render incrementally. We use item position as the cursor to
   * simplify consumption.
   */
  items: Array<{ pos: number }>;
  /**
   * The number of items to render incrementally per idle task.
   */
  pageSize: number;
  /**
   * Whether the items are still loading. Should only be toggled once; it's used
   * as a flag to trigger a re-run of the main useEffect.
   * @default false
   */
  isLoading?: boolean;
  /**
   * The strategy determines how the idle tasks should be enqueued.
   *
   * - `eager`: Enqueue all tasks together. Used to prioritize lists over cards.
   *   For lists, this means that we will render every list on the board before
   *   we render page 2 of cards on any list.
   * - `sequential`: Enqueue the next task once the last one has resolved.
   *   For cards, this means that we will render batches of cards in different
   *   lists; e.g. across two long lists A and B, we'll render page 2 of list A,
   *   then page 2 of list B, then page 3 of list A, etc.
   *
   * @default 'sequential'
   */
  strategy?: 'eager' | 'sequential';
}

/**
 * Given a sorted list of items with a `pos` attribute, increment a cursor
 * reflecting the position of the last item that should be rendered using idle
 * tasks. This is currently used to incrementally render lists and cards on a
 * board when the CPU has idle time.
 */
export const useIncrementalIdleItemRenderer = ({
  queueId,
  items,
  pageSize,
  isLoading = false,
  strategy = 'sequential',
}: IncrementalIdleItemRendererProps): void => {
  // Store items in a ref; we don't want to rerender when they change.
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const cursorIndexRef = useRef(-1);
  const taskIdsRef = useRef<number[]>([]);

  const resolveTask = useCallback(() => {
    if (taskIdsRef.current.length) {
      taskIdsRef.current.shift();
    }
  }, []);

  const incrementCursor = useCallback(() => {
    resolveTask();

    if (!isFinite(state.value[queueId])) return;

    const nextIndex = cursorIndexRef.current + pageSize;
    const lastItemIndex = itemsRef.current.length - 1;
    if (nextIndex >= lastItemIndex) {
      cursorIndexRef.current = lastItemIndex;
      state.setValue({ [queueId]: Infinity });
      return;
    }

    cursorIndexRef.current = nextIndex;
    state.setValue({ [queueId]: itemsRef.current[nextIndex].pos });

    if (strategy === 'sequential') {
      taskIdsRef.current.push(addIdleTask(incrementCursor));
    }
  }, [queueId, pageSize, strategy, resolveTask]);

  /**
   * When invoked with the 'eager' strategy, identify how many pages we'll
   * need to render up front, and enqueue all necessary tasks immediately.
   */
  const enqueueAllTasks = useCallback(() => {
    const remainingItems = itemsRef.current.length - cursorIndexRef.current - 1;
    const numRemainingPages = Math.ceil(remainingItems / pageSize);

    for (let i = 0; i < numRemainingPages; i++) {
      taskIdsRef.current.push(addIdleTask(incrementCursor));
    }
  }, [incrementCursor, pageSize]);

  const hasInitialized = queueId in state.value;
  useEffect(() => {
    if (hasInitialized || isLoading) return;

    // Initialize the cursor on mount. The first page should load immediately.
    state.setValue({ [queueId]: -1 });
    incrementCursor();

    if (strategy === 'eager') {
      enqueueAllTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasInitialized, isLoading, queueId]);

  // Clean up the shared state and idle tasks on unmount.
  useEffect(() => {
    return () => {
      for (const taskId of taskIdsRef.current) {
        clearIdleTask(taskId);
      }
      cursorIndexRef.current = -1;
      taskIdsRef.current = [];
      state.setValue(({ [queueId]: _, ...rest }) => rest);
    };
  }, [queueId]);
};

export const useShouldRenderIncrementalItem = (queueId: string, pos: number) =>
  useSharedStateSelector(
    state,
    useCallback((value) => value[queueId] >= pos, [queueId, pos]),
  );
