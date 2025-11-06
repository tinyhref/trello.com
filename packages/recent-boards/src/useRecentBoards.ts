import { NetworkStatus } from '@apollo/client';
import { useEffect, useMemo } from 'react';

import type { StandardComparator } from '@trello/arrays';
import { useMemberId } from '@trello/authentication';
import { useMemberInboxIds } from '@trello/personal-workspace';
import { useSharedState } from '@trello/shared-state';

import { mostRecentBoardSharedState } from './mostRecentBoardSharedState';
import { useRecentBoardsDetailQuery } from './RecentBoardsDetailQuery.generated';
import type { RecentBoardsSlimQuery } from './RecentBoardsSlimQuery.generated';
import { useRecentBoardsSlimQuery } from './RecentBoardsSlimQuery.generated';
import type { RecentBoard } from './recentBoardsState';
import { recentBoardsState } from './recentBoardsState';

export class MissingRecentBoardsSlimDataError extends Error {
  constructor() {
    const message = 'Failed to load data from useRecentBoardsSlimQuery';
    super(message);
    this.name = 'MissingRecentBoardsSlimError';
  }
}

export class MissingRecentBoardsDetailDataError extends Error {
  constructor() {
    const message = 'Failed to load data from useRecentBoardsDetailQuery';
    super(message);
    this.name = 'MissingRecentBoardsDetailError';
  }
}

const dateComparator: StandardComparator<{
  dateLastView?: Date | string | null;
}> = (boardA, boardB) => {
  if (!boardB.dateLastView || !boardA.dateLastView) return 0;
  return (
    new Date(boardB.dateLastView).getTime() -
    new Date(boardA.dateLastView).getTime()
  );
};

export const getCombinedRecentBoardIds = ({
  boardsFromLocalStorage,
  boardsFromDb,
}: {
  boardsFromLocalStorage: RecentBoard[];
  boardsFromDb: NonNullable<RecentBoardsSlimQuery['member']>['boards'];
}) => {
  const MAX_RECENT_BOARDS = 8;
  const EXTRA_BOARDS_TO_FETCH = 4;

  const combinedBoards = [
    ...boardsFromLocalStorage,
    ...boardsFromDb.filter((board) => !board.closed && !!board.dateLastView),
  ];

  const seenBoardIds = new Set<string>();
  return combinedBoards
    .sort(dateComparator)
    .filter(({ id }) => !seenBoardIds.has(id) && !!seenBoardIds.add(id))
    .slice(0, MAX_RECENT_BOARDS + EXTRA_BOARDS_TO_FETCH)
    .map((board) => board.id);
};

interface UseRecentBoardsProps {
  skip?: boolean;
}

export const useRecentBoards = (props?: UseRecentBoardsProps) => {
  const memberId = useMemberId();
  const { idBoard: inboxId } = useMemberInboxIds();

  // PersistentSharedState has issues with array type, and infers this as:
  // `RecentBoard[] | (RecentBoard | undefined)[] | undefined`
  const [recentBoardsFromLocalStorage] =
    useSharedState<RecentBoard[]>(recentBoardsState);

  const {
    data: dataRecentBoardsSlim,
    loading: loadingRecentBoardsSlim,
    error: errorRecentBoardsSlim,
    // eslint-disable-next-line @trello/no-apollo-refetch
    refetch: refetchSlim,
    networkStatus: networkStatusSlim,
  } = useRecentBoardsSlimQuery({
    variables: {
      memberId,
    },
    notifyOnNetworkStatusChange: true,
    skip: props?.skip,
    waitOn: ['MemberBoards'],
  });

  const idRecentBoards = useMemo(
    () =>
      getCombinedRecentBoardIds({
        // PersistentSharedState has issues with array type, and infers this as:
        // `RecentBoard[] | (RecentBoard | undefined)[] | undefined`
        boardsFromLocalStorage: recentBoardsFromLocalStorage as RecentBoard[],
        boardsFromDb: dataRecentBoardsSlim?.member?.boards ?? [],
      }),
    [dataRecentBoardsSlim?.member?.boards, recentBoardsFromLocalStorage],
  );

  const filteredIdRecentBoards = useMemo(() => {
    return idRecentBoards.filter((id) => id !== inboxId);
  }, [idRecentBoards, inboxId]);

  const {
    data: dataRecentBoardsDetail,
    loading: loadingRecentBoardsDetail,
    error: errorRecentBoardsDetail,
    // eslint-disable-next-line @trello/no-apollo-refetch
    refetch: refetchDetail,
    networkStatus: networkStatusDetail,
  } = useRecentBoardsDetailQuery({
    variables: {
      idBoards: filteredIdRecentBoards,
    },
    notifyOnNetworkStatusChange: true,
    skip: !dataRecentBoardsSlim?.member?.boards,
    waitOn: ['MemberBoards'],
  });

  const error = useMemo(() => {
    if (errorRecentBoardsSlim || errorRecentBoardsDetail) {
      return errorRecentBoardsSlim || errorRecentBoardsDetail;
    }
    /*
      There is a known issue where our Apollo/GraphQL implementation returns
      undefined for data, loading, and error. We create a specific instance
      of error in these cases, so that we can report it as a non-error
      operational event.
    */
    if (!dataRecentBoardsSlim?.member || !dataRecentBoardsDetail?.boards) {
      if (!dataRecentBoardsSlim?.member) {
        return new MissingRecentBoardsSlimDataError();
      } else {
        return new MissingRecentBoardsDetailDataError();
      }
    }
    return null;
  }, [
    errorRecentBoardsSlim,
    errorRecentBoardsDetail,
    dataRecentBoardsSlim?.member,
    dataRecentBoardsDetail?.boards,
  ]);

  // treat a refetch like we're loading
  const refetching =
    networkStatusSlim === NetworkStatus.refetch ||
    networkStatusDetail === NetworkStatus.refetch;

  const refetch = useMemo(() => {
    if (loadingRecentBoardsSlim || loadingRecentBoardsDetail || refetching) {
      return refetchSlim;
    }
    if (errorRecentBoardsSlim) {
      return refetchSlim;
    }
    if (errorRecentBoardsDetail) {
      return refetchDetail;
    }
    /*
      There is a known issue where our Apollo/GraphQL implementation returns
      undefined for data, loading, and error. We create a specific instance
      of error in these cases, so that we can report it as a non-error
      operational event.
    */
    if (!dataRecentBoardsSlim?.member || !dataRecentBoardsDetail?.boards) {
      if (!dataRecentBoardsSlim?.member) {
        return refetchSlim;
      } else {
        return refetchDetail;
      }
    }
    return null;
  }, [
    loadingRecentBoardsSlim,
    errorRecentBoardsSlim,
    refetchSlim,
    loadingRecentBoardsDetail,
    errorRecentBoardsDetail,
    refetchDetail,
    refetching,
    dataRecentBoardsDetail?.boards,
    dataRecentBoardsSlim?.member,
  ]);

  const data = useMemo(() => {
    if (
      dataRecentBoardsDetail?.boards &&
      dataRecentBoardsSlim?.member?.boardStars
    ) {
      return {
        // Boards from RecentBoardsState may have been closed, so re-filter:
        boards: dataRecentBoardsDetail?.boards?.filter(
          (board) => !board.closed,
        ),
        boardStars: dataRecentBoardsSlim?.member?.boardStars,
      };
    }
    return null;
  }, [
    dataRecentBoardsDetail?.boards,
    dataRecentBoardsSlim?.member?.boardStars,
  ]);

  useEffect(() => {
    const board = data?.boards[0];
    if (board) {
      mostRecentBoardSharedState.setValue({
        id: board.id,
        nodeId: board.nodeId,
        name: board.name,
        shortLink: board.shortLink,
      });
    }
  }, [data?.boards]);

  return {
    loading: loadingRecentBoardsSlim || loadingRecentBoardsDetail || refetching,
    error,
    data,
    // We're returning refetchSlim here given it's the foundational/first
    // query that needs to be made. It will trigger refetchDetail. This is
    // likely not going to be used in this state anyway.
    refetch: refetch || refetchSlim,
  };
};
