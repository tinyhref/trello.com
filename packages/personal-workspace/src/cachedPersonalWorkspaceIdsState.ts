import { PersistentSharedState } from '@trello/shared-state';

import type { PersonalWorkspaceIds } from './PersonalWorkspace.types';

export const cachedPersonalWorkspaceIdsState = new PersistentSharedState<{
  [memberId: string]: PersonalWorkspaceIds | undefined;
}>({}, { storageKey: 'inboxIds' });
