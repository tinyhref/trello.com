import { getOperationName } from '@trello/quickload';

import type { NonCurrentBoardMembersQuery } from './NonCurrentBoardMembersQuery.generated';
import {
  NonCurrentBoardMembersDocument,
  useNonCurrentBoardMembersQuery,
} from './NonCurrentBoardMembersQuery.generated';
import { useBoardMembersSharedBusinessLogic } from './useBoardMembersSharedBusinessLogic';

export type Member = NonNullable<
  NonCurrentBoardMembersQuery['board']
>['members'][number];

/**
 * Hook that provides a list of board members and memberships, as well
 * as utility functions for determining if a given user is a member of the board,
 * admin of the board, admin of the workspace, etc.
 *
 * This hook is used outside a single board context. Therefore, it uses a query
 * to get board data, which it passes to useBoardMembersSharedBusinessLogic.
 *
 * NOTE: This hook is _extremely_ expensive, and should be used sparingly.
 * In most cases, within the context of a board view, you can use
 * `BoardMembersContext` (if it doesn't expose everything you need, add it
 * as needed). For this reason, this hook is marked @deprecated.
 *
 * For more context, see https://hello.atlassian.net/wiki/spaces/TRELLOFE/blog/2023/07/10/2652082374/Cutting+BoardFacepile+render+time+in+half
 */
export const useNonCurrentBoardMembers = (
  idBoard: string,
  {
    skip,
    operationName,
  }: {
    skip: boolean;
    operationName?: string;
  } = {
    skip: false,
  },
) => {
  const { data, loading, error } = useNonCurrentBoardMembersQuery({
    variables: {
      idBoard,
    },
    waitOn: ['CurrentBoardInfo'],
    skip,
    context: {
      operationName: operationName
        ? `${getOperationName(NonCurrentBoardMembersDocument)}:${operationName}`
        : 'NonCurrentBoardMembersQuery:unknown',
    },
  });

  const board = data?.board;

  const boardMembersSharedBusinessLogic = useBoardMembersSharedBusinessLogic({
    board,
    idBoard,
  });

  return {
    ...boardMembersSharedBusinessLogic,
    loading,
    error,
  };
};
