import { PersistentSharedState } from '@trello/shared-state';

interface BoardSwitcherSharedState {
  layout: 'grid' | 'list';
  mode: 'modal' | 'panel';
  selectedWorkspaceId: string | null;
  expandSectionsState: Record<string, boolean>;
}

export const defaultBoardSwitcherSharedState: BoardSwitcherSharedState = {
  layout: 'grid',
  mode: 'modal',
  selectedWorkspaceId: null,
  expandSectionsState: {},
};

export const boardSwitcherSharedState = new PersistentSharedState(
  defaultBoardSwitcherSharedState,
  { storageKey: 'boardSwitcherState' },
);
