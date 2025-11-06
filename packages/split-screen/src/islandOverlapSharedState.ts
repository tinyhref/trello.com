import { SharedState } from '@trello/shared-state';

interface IslandOverlapState {
  inbox: boolean;
  planner: boolean;
  board: boolean;
  switcher: boolean;
}

export const islandOverlapSharedState = new SharedState<IslandOverlapState>({
  board: false,
  inbox: false,
  planner: false,
  switcher: false,
});
