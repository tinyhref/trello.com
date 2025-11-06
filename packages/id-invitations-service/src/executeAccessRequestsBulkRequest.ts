import type { AccessRequestCapabilitiesDetail } from './executeAccessRequestCapabilities';
import {
  idInvitationsService,
  reportingErrorHandler,
} from './idInvitationsService';

export interface AccessRequestBulkRequestBody {
  accessMode: string;
  source: string;
  resources: AccessRequestBulkRequestResource[];
}

export interface AccessRequestBulkRequestResource {
  ari: string;
}

export interface AccessRequestBulkRequestResults {
  results: Record<string, string>;
  resultsV2?: Record<string, Array<AccessRequestCapabilitiesDetail>>;
  code?: string;
  message?: string;
}

/**
 * docs link needed
 *
 * @param cloudIds
 */
export const executeAccessRequestsBulkRequest = async (
  cloudId: string | undefined,
): Promise<AccessRequestBulkRequestResults> => {
  if (!cloudId) {
    throw new Error('no cloud ids provided');
  }
  const ari = `ari:cloud:jira-software::site/${cloudId}`;
  const body: AccessRequestBulkRequestBody = {
    accessMode: 'DIRECT_ACCESS',
    source: 'trelloToJWMSelfJoin',
    resources: [{ ari }],
  };

  const result = await idInvitationsService<
    [AccessRequestBulkRequestResults],
    string
  >(
    'invitations/v1/access-requests/bulk/request',
    { method: 'POST', body: JSON.stringify(body) },
    (json) => {
      return json as [AccessRequestBulkRequestResults];
    },
    reportingErrorHandler('access-request-bulk-request'),
  );

  if (result.error) {
    throw new Error(result.error);
  }

  const bulkRequestResult = result.result?.[0];

  if (bulkRequestResult?.resultsV2![ari][0].accessMode !== 'ACCESS_GRANTED') {
    throw new Error(bulkRequestResult?.resultsV2![ari][0].accessMode);
  }

  return bulkRequestResult!;
};
