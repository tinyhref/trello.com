import { SharedState } from '@trello/shared-state';

interface ViewBoardTaskStateStopped {
  traceId: null;
  status: 'stopped';
  error: null;
}
interface ViewBoardTaskStateStarted {
  traceId: string;
  status: 'started';
  error: null;
}
interface ViewBoardTaskStatCompleted {
  traceId: string;
  status: 'completed';
  error: null;
}
interface ViewBoardTaskStateFailed {
  traceId: string;
  status: 'failed';
  error: Error | string;
}

export const viewBoardTaskState = new SharedState<
  | ViewBoardTaskStatCompleted
  | ViewBoardTaskStateFailed
  | ViewBoardTaskStateStarted
  | ViewBoardTaskStateStopped
>({
  traceId: null,
  status: 'stopped',
  error: null,
});
