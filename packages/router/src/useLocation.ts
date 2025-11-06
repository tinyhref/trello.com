import { useSharedStateSelector } from '@trello/shared-state';

import type { LocationState } from './routerState';
import { routerState } from './routerState';

export function useLocation(): LocationState {
  const location = useSharedStateSelector(
    routerState,
    (value) => value.location,
  );
  return location;
}
