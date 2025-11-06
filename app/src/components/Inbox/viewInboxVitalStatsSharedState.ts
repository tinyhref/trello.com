import { SharedState } from '@trello/shared-state';

interface ViewInboxVitalStatsInitialState {
  status: 'stopped';
  traceId: null;
}
interface ViewInboxVitalStatsStartedState {
  status: 'started';
  traceId: string;
}
interface ViewInboxVitalStatsAbortedState {
  status: 'aborted';
  traceId: string;
}
interface ViewInboxVitalStatsFailedState {
  status: 'failed';
  traceId: string;
  error: Error | string;
}
interface ViewInboxVitalStatsSucceededState {
  status: 'succeeded';
  traceId: string;
}
type ViewInboxVitalStatsSharedState =
  | ViewInboxVitalStatsAbortedState
  | ViewInboxVitalStatsFailedState
  | ViewInboxVitalStatsInitialState
  | ViewInboxVitalStatsStartedState
  | ViewInboxVitalStatsSucceededState;

export const viewInboxVitalStatsSharedState =
  new SharedState<ViewInboxVitalStatsSharedState>({
    status: 'stopped',
    traceId: null,
  });
