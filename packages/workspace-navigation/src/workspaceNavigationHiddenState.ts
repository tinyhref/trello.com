/*
  workspaceNavigationHiddenState tracks whether the sidebar is hidden
  (for example, on global pages) or not hidden (for example, on boards)

  We use SharedState rather than PersistentState because:
    1. We do _not_ want to persist this state. It's determined purely
    based on what type of page you are on, it should not be persisted
    across sessions.
    2. PersistentState syncs across tabs. That behavior is not desired
    with hidden state, because the user can have some tabs where the
    sidebar is hidden (home page) and others where it is not hidden
    (board page). We do not want each tab trying to sync its hidden
    state with the other tab.
*/
import { isMemberLoggedIn } from '@trello/authentication';
import { SharedState } from '@trello/shared-state';

export interface WorkspaceNavigationHiddenState {
  hidden: boolean;
}

export const workspaceNavigationHiddenState =
  new SharedState<WorkspaceNavigationHiddenState>({
    // We'd like to initialize hidden to the correct value (to the degree possible)
    // We know WorkspaceNav is hidden for logged out users
    hidden: !isMemberLoggedIn(),
  });
