import type { LocationState } from './routerState';
import { routerState } from './routerState';

export function getLocation(): LocationState {
  return routerState.value.location;
}
