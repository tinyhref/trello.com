import { SharedState } from '@trello/shared-state';
import { wait } from '@trello/time';

import { getInternetConnectionState } from './getInternetConnectionState';

type ConnectionState = 'healthy' | 'unhealthy';

let currentGetInternetConnectionStatePromise: ReturnType<
  typeof getInternetConnectionState
> | null;

export const internetConnectionState = new SharedState<ConnectionState>(
  'healthy',
);

export async function verifyAndUpdateInternetHealth() {
  currentGetInternetConnectionStatePromise =
    currentGetInternetConnectionStatePromise || getInternetConnectionState();
  const internetHealthState = await currentGetInternetConnectionStatePromise;
  internetConnectionState.setValue(internetHealthState);
  currentGetInternetConnectionStatePromise = null;
}

export async function verifyAndUpdateInternetHealthUntilHealthy(): Promise<void> {
  await verifyAndUpdateInternetHealth();

  if (internetConnectionState.value === 'healthy') {
    return;
  }

  await wait(500);
  return verifyAndUpdateInternetHealthUntilHealthy();
}
