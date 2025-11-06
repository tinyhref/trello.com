import { useEffect } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { client } from '@trello/graphql';
import { useMemberInboxIds } from '@trello/personal-workspace';
import { useSplitScreenSharedState } from '@trello/split-screen';

import {
  ViewBoardCardListDocument,
  type ViewBoardCardListQuery,
  type ViewBoardCardListQueryVariables,
} from 'app/src/components/Board/ViewBoardCardListQuery.generated';
import { viewInboxVitalStatsSharedState } from './viewInboxVitalStatsSharedState';

const runInboxVitalStats = ({ idInboxBoard }: { idInboxBoard: string }) => {
  if (viewInboxVitalStatsSharedState.value.status === 'stopped') {
    const traceId = Analytics.startTask({
      taskName: 'view-inbox',
      source: 'inboxScreen',
    });
    viewInboxVitalStatsSharedState.setValue({ status: 'started', traceId });
  }

  // ViewBoardCardListQuery is a simple query that fetches the board and card
  // ids. It's not actually used to render the board, but just to fetch the ids
  // from the apollo cache as a way of knowing when the data is loaded.  The
  // observer here is notified when the data requested by this query changes, it
  // doesn't specifically care about this query.
  // eslint-disable-next-line @trello/no-cache-only-queries
  const boardDataObserver = client.watchQuery<
    ViewBoardCardListQuery,
    ViewBoardCardListQueryVariables
  >({
    query: ViewBoardCardListDocument,
    variables: {
      id: idInboxBoard,
    },
    fetchPolicy: 'cache-only',
  });

  const dataSubscriber = boardDataObserver.subscribe((result) => {
    // board has not loaded yet
    if (!result?.data?.board?.id) {
      return;
    }

    // if there are no cards, then the CardFront component won't render, so
    // we'll mark the task succeeded now. Note we need to distinguish between
    // "cards have not loaded yet" (cards === undefined) and "cards have loaded,
    // but are empty"
    if (result.data.board?.cards?.length === 0) {
      viewInboxVitalStatsSharedState.setValue({ status: 'succeeded' });
    }
  });

  const unsubscribeFromSharedState = viewInboxVitalStatsSharedState.subscribe(
    (state) => {
      if (state.status === 'started') {
        return;
      }

      let finalized = false;
      if (state.status === 'aborted') {
        Analytics.taskAborted({
          taskName: 'view-inbox',
          traceId: state.traceId,
          source: 'inboxScreen',
        });
        finalized = true;
      } else if (state.status === 'failed') {
        Analytics.taskFailed({
          taskName: 'view-inbox',
          traceId: state.traceId,
          source: 'inboxScreen',
          error: state.error,
        });
        finalized = true;
      } else if (state.status === 'succeeded') {
        Analytics.taskSucceeded({
          taskName: 'view-inbox',
          traceId: state.traceId,
          source: 'inboxScreen',
        });
        finalized = true;
      }

      if (finalized) {
        unsubscribeFromSharedState();
        viewInboxVitalStatsSharedState.reset();
        dataSubscriber.unsubscribe();
      }
    },
  );

  return () => {
    if (viewInboxVitalStatsSharedState.value.status === 'started') {
      viewInboxVitalStatsSharedState.setValue({ status: 'aborted' });
    }
    dataSubscriber.unsubscribe();
    unsubscribeFromSharedState();
  };
};

export const useInboxVitalStats = () => {
  const { idBoard: idInboxBoard } = useMemberInboxIds();
  const { panels } = useSplitScreenSharedState();
  useEffect(() => {
    if (!idInboxBoard || !panels.inbox) {
      return;
    }

    const cancelVitalStat = runInboxVitalStats({ idInboxBoard });
    return () => {
      cancelVitalStat();
    };
  }, [idInboxBoard, panels.inbox]);
};
