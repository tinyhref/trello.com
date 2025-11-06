import { logoutUser } from '@trello/authentication';
import { ApiError } from '@trello/error-handling';
import { startSessionWatcher } from '@trello/session-cookie';

import { errorSignal } from 'app/scripts/lib/error-signal';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
errorSignal.subscribe(function ({ error }: any) {
  if (error instanceof ApiError.Unauthenticated) {
    logoutUser();
  }
});

startSessionWatcher();
