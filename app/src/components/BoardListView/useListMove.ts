import { useCallback } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { client } from '@trello/graphql';
import {
  BoardListsContextListFragmentDoc,
  type BoardListsContextListFragment,
} from '@trello/graphql/fragments';
import { intl } from '@trello/i18n';
import { useBoardId } from '@trello/id-context';
import { getScreenFromUrl } from '@trello/marketing-screens';
import type { Board } from '@trello/model-types';
import { showFlag } from '@trello/nachos/experimental-flags';
import { useMemberInboxIds } from '@trello/personal-workspace';
import { calculateItemPosition } from '@trello/position';

import { showCustomFieldErrorFlag } from 'app/src/components/MoveCardPopover/showCustomFieldErrorFlag';
import type { BoardOpenListsFragment } from './BoardOpenListsFragment.generated';
import { BoardOpenListsFragmentDoc } from './BoardOpenListsFragment.generated';
import { useUpdateListPositionMutation } from './UpdateListPositionMutation.generated';

export const sortLists = (board: BoardOpenListsFragment | null) =>
  [...(board?.lists ?? [])].sort((a, b) => a.pos - b.pos);

export function useListMove() {
  const currentBoardId = useBoardId();
  const { idBoard: inboxBoardId } = useMemberInboxIds();
  const [updateListPosition] = useUpdateListPositionMutation();

  const moveListToIndex = useCallback(
    async (
      listId: string,
      targetIndex: number,
      boardId: string = currentBoardId,
    ) => {
      if (boardId === inboxBoardId) {
        showFlag({
          id: 'movelist',
          title: intl.formatMessage({
            id: 'alerts.list move failed',
            defaultMessage: 'Unable to move list',
            description: 'List move failed',
          }),
          appearance: 'error',
          msTimeout: 8000,
        });
        return;
      }

      const board = client.readFragment<BoardOpenListsFragment>({
        id: `Board:${boardId}`,
        fragment: BoardOpenListsFragmentDoc,
      });
      const list = client.readFragment<BoardListsContextListFragment>({
        id: `List:${listId}`,
        fragment: BoardListsContextListFragmentDoc,
      });

      const hasTargetBoard = boardId !== currentBoardId;
      const taskName = hasTargetBoard ? 'edit-list/idBoard' : 'edit-list/pos';
      const lists = sortLists(board);
      const listIndex = lists.findIndex(
        (sortedList) => sortedList.id === listId,
      );

      if (!list || listIndex === targetIndex) {
        return;
      }

      const traceId = Analytics.startTask({
        taskName,
        source: getScreenFromUrl(),
      });

      try {
        const position = calculateItemPosition(targetIndex, lists, list);

        // send to server
        await updateListPosition({
          variables: {
            idBoard: boardId,
            idList: listId,
            pos: position,
            traceId,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateListPosition: {
              id: listId,
              idBoard: boardId,
              pos: position,
              __typename: 'List',
            },
          },
          update(cache, { data }) {
            if (!data?.updateListPosition || !hasTargetBoard) {
              return;
            }

            // Remove the list from the current board
            cache.modify<Board>({
              id: cache.identify({
                id: currentBoardId,
                __typename: 'Board',
              }),
              fields: {
                lists(existingLists = [], { readField }) {
                  return existingLists.filter(
                    (listRef) => readField('id', listRef) !== listId,
                  );
                },
              },
            });
          },
        });

        Analytics.taskSucceeded({
          taskName,
          source: getScreenFromUrl(),
          traceId,
        });

        if (hasTargetBoard) {
          showFlag({
            id: 'movelist',
            title: intl.formatMessage(
              {
                id: 'view title.moved list',
                defaultMessage:
                  'Moved list {listName} to {boardName} successfully.',
                description: 'Moved list',
              },
              { listName: list?.name, boardName: board?.name },
            ),
            appearance: 'success',
            msTimeout: 8000,
          });
        }
      } catch (error) {
        Analytics.taskFailed({
          taskName,
          source: getScreenFromUrl(),
          traceId,
          error,
        });
        const isCustomFieldError = showCustomFieldErrorFlag({
          error,
          targetBoardId: boardId,
          flagId: 'movelist',
        });
        if (!isCustomFieldError) {
          showFlag({
            id: 'movelist',
            title: intl.formatMessage({
              id: 'alerts.list move failed',
              defaultMessage: 'Unable to move list',
              description: 'List move failed',
            }),
            appearance: 'error',
            msTimeout: 8000,
          });
        }
      }
    },
    [currentBoardId, inboxBoardId, updateListPosition],
  );

  return {
    moveListToIndex,
  };
}
