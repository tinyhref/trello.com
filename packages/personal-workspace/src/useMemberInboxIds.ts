import { useCallback, useMemo } from 'react';

import { useMemberId } from '@trello/authentication';
import { client } from '@trello/graphql';
import { useBoardId } from '@trello/id-context';
import { useSharedState, useSharedStateSelector } from '@trello/shared-state';

import { BoardTypeFragmentDoc } from './BoardTypeFragment.generated';
import { cachedPersonalWorkspaceIdsState } from './cachedPersonalWorkspaceIdsState';
import type { PersonalWorkspaceIds } from './PersonalWorkspace.types';

export const useMemberInboxIds = (): Partial<PersonalWorkspaceIds> => {
  const memberId = useMemberId();
  const inboxIds = useSharedStateSelector(
    cachedPersonalWorkspaceIdsState,
    useCallback((state) => state[memberId], [memberId]),
  );

  return inboxIds || {};
};

export const useIsInboxBoardPassContextVals = ({
  boardId,
  memberId,
}: {
  boardId: string | null;
  memberId: string;
}) => {
  const [inboxIds] = useSharedState(cachedPersonalWorkspaceIdsState);
  const memberInboxIds = inboxIds[memberId];
  return Boolean(
    boardId && memberInboxIds?.idBoard && memberInboxIds.idBoard === boardId,
  );
};

export const useIsInboxBoardWithId = (boardId: string) => {
  const memberId = useMemberId();
  const isInboxBoard = useMemo(() => {
    const boardTypeFragment = client.readFragment({
      id: `Board:${boardId}`,
      fragment: BoardTypeFragmentDoc,
    });
    return boardTypeFragment?.type === 'inbox';
  }, [boardId]);
  // fallback to board type check if inbox board is not cached
  // TODO: remove this once we have inbox available in the quickload
  return useIsInboxBoardPassContextVals({ boardId, memberId }) || isInboxBoard;
};

export const useIsInboxBoard = () => {
  const boardId = useBoardId();
  return useIsInboxBoardWithId(boardId);
};
