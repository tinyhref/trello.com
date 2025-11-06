import { getMemberId } from '@trello/authentication';
import { PersistentSharedState } from '@trello/shared-state';

export interface WorkspaceNavigationState {
  expanded: boolean;
  expandedViewStatus:
    | 'hidden-in-transition'
    | 'hidden-transition-complete'
    | 'visible-in-transition'
    | 'visible-transition-complete';
}

// this only applies to the very first time the user view workspace nav
// after that, PersistentSharedState will read expanded/collapse from local storage
const initializeExpanded = true;

export const workspaceNavigationState =
  new PersistentSharedState<WorkspaceNavigationState>(
    {
      expanded: initializeExpanded,
      expandedViewStatus: initializeExpanded
        ? 'visible-transition-complete'
        : 'hidden-transition-complete',
    },
    { storageKey: () => `workspaceNavigation-${getMemberId() ?? 'anonymous'}` },
  );
