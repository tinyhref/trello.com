import { PersistentSharedState } from '@trello/shared-state';

export type MonitorStatus = 'active' | 'idle';

export const monitorStatus = new PersistentSharedState<MonitorStatus>(
  'active',
  {
    session: true,
    storageKey: 'trello.currentUserActivityStatus',
  },
);
