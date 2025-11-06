import { isMemberLoggedIn } from '@trello/authentication';
import { monitor } from '@trello/monitor';

import { connectionConfig } from './connectionConfig';

export const calculatePollingDelay = (pollRequestFailures: number) => {
  const baseDelay = connectionConfig.getBasePollingDelay();
  const statusMultipliers = connectionConfig.getBasePollingMultipliers();
  const status =
    isMemberLoggedIn() && monitor.getStatus() === 'active' ? 'active' : 'idle';

  return Math.min(
    baseDelay *
      statusMultipliers[status] *
      Math.max(1, Math.pow(2, pollRequestFailures)),
    60000,
  );
};
