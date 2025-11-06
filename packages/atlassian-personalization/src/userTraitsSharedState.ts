import { SharedState } from '@trello/shared-state';

import type { Attribute } from './fetchUserPersonalization';

type UserTraits = {
  attributes: Attribute[];
  loading: boolean;
  refreshing: boolean;
};

export const userTraitsSharedState = new SharedState<
  Record<string, UserTraits>
>({});
