import {
  idInvitationsService,
  reportingErrorHandler,
} from './idInvitationsService';

export interface AccessRequestCapabilitiesResults {
  userAccessLevel: string;
  verificationStatus: string;
  autojoinAllowed: boolean;
  results: Record<string, string>;
  resultsV2: Record<string, Array<AccessRequestCapabilitiesDetail>>;
}

export interface AccessRequestCapabilitiesDetail {
  accessMode: string;
  role: string;
}

/**
 * https://hello.atlassian.net/wiki/spaces/ETRUST/pages/626729299/API+Guide+-+v1+access-requests+capabilities
 *
 * @param cloudId
 * @param skip will not execute when skip is true
 * @returns loading/resolved/error state of this web request
 */
export const executeAccessRequestCapabilities = async (
  cloudId: string | undefined,
): Promise<AccessRequestCapabilitiesResults | undefined> => {
  if (!cloudId) {
    return undefined;
  }
  const path = `invitations/v1/access-requests/capabilities?resource=ari:cloud:jira::site/${cloudId}`;
  const result = await idInvitationsService<
    AccessRequestCapabilitiesResults,
    string
  >(
    path,
    { method: 'GET' },
    (json) => {
      return json as AccessRequestCapabilitiesResults;
    },
    reportingErrorHandler('access-request-capabilities'),
  );

  if (result.error) {
    throw new Error(result.error);
  }

  return result.result!;
};
