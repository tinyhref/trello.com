import { SharedState } from '@trello/shared-state';

interface MostRecentBoardSharedState {
  id: string | null;
  nodeId: string | null;
  name: string | null;
  shortLink: string | null;
}

export const defaultMostRecentBoardSharedState: MostRecentBoardSharedState = {
  id: null,
  nodeId: null,
  name: null,
  shortLink: null,
};

export const mostRecentBoardSharedState = new SharedState(
  defaultMostRecentBoardSharedState,
);
