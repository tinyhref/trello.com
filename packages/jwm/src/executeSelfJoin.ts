import { executeAccessRequestsBulkRequest } from '@trello/id-invitations-service';

import type { PollCanBrowseProjectResult } from './pollCanBrowseProjects';
import { pollCanBrowseProjects } from './pollCanBrowseProjects';

const POLLING_TIMEOUT = 120000;
const POLLING_INTERVAL = 1000;

export interface SelfJoinResult {
  success: boolean;
  result: PollCanBrowseProjectResult | string;
  time: number;
}

export const executeSelfJoin = async (
  cloudId: string | undefined,
): Promise<SelfJoinResult> => {
  const start = Date.now();
  await executeAccessRequestsBulkRequest(cloudId); // if this does not throw error, proceed.

  const result = await pollCanBrowseProjects({
    cloudId,
    pollingIntervalMS: POLLING_INTERVAL,
    pollingTimeoutMS: POLLING_TIMEOUT,
  });

  return {
    success: result === 'PERMITTED',
    result,
    time: Date.now() - start,
  };
};
