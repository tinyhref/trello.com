import { useCallback, useEffect } from 'react';

import { client } from '@trello/graphql';
import { useBoardId } from '@trello/id-context';
import { addIdleTask } from '@trello/idle-task-scheduler';

import type { BoardOpenListsFragment } from 'app/src/components/BoardListView/BoardOpenListsFragment.generated';
import { BoardOpenListsFragmentDoc } from 'app/src/components/BoardListView/BoardOpenListsFragment.generated';
import { collapsedListsState } from './collapsedListsState';
import { useIsCollapsibleListsEnabled } from './useIsCollapsibleListsEnabled';

/**
 * The collapsed lists state is stored client-side, in local storage.
 * This means that we need to be good stewards, and keep things as tidy as
 * possible, or else we could risk taking up too much space, since this is an
 * unbounded model.
 *
 * On board load, this hook is responsible for assessing the collapsed lists
 * state for the current board, and cleaning things up wherever possible.
 * Some candidates for deletion include:
 * - Boards that no longer have access to the collapsed lists feature
 *   (e.g. from downgrading pay tiers)
 * - Collapsed lists that are no longer included in the board's lists model
 *   (e.g. from archiving, deleting, or moving to a different board)
 * - Boards that have not been viewed within a certain period of time (TODO)
 */
export const useCollapsedListsStateGarbageCollector = () => {
  const boardId = useBoardId();
  const isCollapsibleListsEnabled = useIsCollapsibleListsEnabled(boardId);

  // Compare the list of collapsed list IDs against all open list IDs on the
  // board, and clean up any list IDs that are no longer on the board:
  const cleanUpCollapsedListIds = useCallback(() => {
    const collapsedLists = collapsedListsState.value[boardId] || {};
    const collapsedListIds = Object.keys(collapsedLists);
    if (!collapsedListIds.length) {
      return;
    }

    // Keep this hook non-reactive with a direct client read:
    const data = client.readFragment<BoardOpenListsFragment>({
      fragment: BoardOpenListsFragmentDoc,
      id: `Board:${boardId}`,
    });

    if (!data) {
      return;
    }

    const openListIds = new Set(data.lists.map((list) => list.id));
    const badListIds = collapsedListIds.filter((id) => !openListIds.has(id));

    if (badListIds.length) {
      collapsedListsState.setValue((value) => {
        badListIds.forEach((id) => delete value[boardId][id]);
        return value;
      });
    }
  }, [boardId]);

  useEffect(() => {
    // If the board doesn't have access to collapsible lists, clear it out:
    if (!isCollapsibleListsEnabled) {
      if (boardId in collapsedListsState.value) {
        collapsedListsState.setValue((value) => {
          delete value[boardId];
          return value;
        });
      }
      return;
    }

    // Defer the cleanup task for cleaning up collapsed list IDs, since it's not
    // critical and shouldn't compete for resources.
    addIdleTask(cleanUpCollapsedListIds, 5000);
  }, [boardId, isCollapsibleListsEnabled, cleanUpCollapsedListIds]);
};
