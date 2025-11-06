import { SharedState } from '@trello/shared-state';

export interface WorkspaceState {
  workspaceId: string | null;
  isGlobal: boolean;
  isLoading: boolean;
  idBoard: string | null;
  workspaceViewId: string | null;
}

/**
 * Represents the current workspace state.
 */
export const workspaceState = new SharedState<WorkspaceState>({
  workspaceId: null,
  isGlobal: false,
  isLoading: true,
  idBoard: null,
  workspaceViewId: null,
});
