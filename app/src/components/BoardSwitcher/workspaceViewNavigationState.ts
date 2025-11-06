import { getMemberId } from '@trello/authentication';
import { PersistentSharedState } from '@trello/shared-state';

import type { WorkspaceViewsQueryVariables } from './WorkspaceViewsQuery.generated';

export interface WorkspaceViewNavigationState {
  filter: WorkspaceViewsQueryVariables['organizationViewsFilter'];
}

const initialState: WorkspaceViewNavigationState = {
  filter: ['team', 'private'],
};

export const workspaceViewNavigationState =
  new PersistentSharedState<WorkspaceViewNavigationState>(initialState, {
    storageKey: () =>
      `workspaceViewNavigationState-${getMemberId() ?? 'anonymous'}`,
  });
