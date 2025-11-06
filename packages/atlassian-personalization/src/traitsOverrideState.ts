import { PersistentSharedState } from '@trello/shared-state';

import type { Traits } from './traits';

export const traitsOverrideState = new PersistentSharedState<Traits>(
  {},
  {
    storageKey: 'TRAITS_OVERRIDES',
  },
);
