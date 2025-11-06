/*
  workspaceNavigationErrorState tracks whether an error occured towards
  the top level of workspace navigation. In this case, we want to hide
  the sidebar entirely.

  We use SharedState rather than PeristentState because:
    1. We do _not_ want to persist this state. It's determined purely
    based on what type of page you are on, it should not be persisted 
    across sessions.
    2. PersistentState syncs across tabs. That behavior is not desired 
    with error state, because the user can have some tabs that have 
    errored and others not. We do not want each tab trying to sync its 
    hidden state with the other tab.
*/
import { SharedState } from '@trello/shared-state';

interface WorkspaceNavigationErrorState {
  hasError: boolean;
}

export const workspaceNavigationErrorState =
  new SharedState<WorkspaceNavigationErrorState>({
    hasError: false,
  });
