import { canBrowseProjects } from './permissions';

interface PollCanBrowseProjectParams {
  cloudId?: string;
  pollingTimeoutMS: number;
  pollingIntervalMS: number;
}

export type PollCanBrowseProjectResult = 'PERMITTED' | 'TIMEOUT';

/**
 * Calls and polls jira /rest/api/2/mypermissions for BROWSE_PROJECTS permission
 *
 * @param cloudId id of jira instance to be queried
 * @param pollingTimeoutMS number of milliseconds to poll this endpoint, for no polling pass 0
 * @param pollingInterval number of milliseconds to wait between polls
 * @returns success
 */
export const pollCanBrowseProjects = async ({
  cloudId,
  pollingTimeoutMS,
  pollingIntervalMS,
}: PollCanBrowseProjectParams): Promise<PollCanBrowseProjectResult> => {
  const limitTime = Date.now() + pollingTimeoutMS;
  while (limitTime > Date.now()) {
    const result = await canBrowseProjects(cloudId!);
    if (result.success && result.result) {
      return 'PERMITTED';
    }
    await new Promise<void>((res) => {
      setTimeout(() => {
        res();
      }, pollingIntervalMS);
    });
  }
  return 'TIMEOUT';
};
