import { getApiGatewayUrl } from '@trello/api-gateway';
import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { parseNetworkError } from '@trello/graphql-error-handling';
import type { PIIString } from '@trello/privacy';
import type { SafeUrl } from '@trello/safe-urls';
import { sanitizeUrl } from '@trello/safe-urls';

import { safeTrelloFetch } from './fetch';
import type { ResolverContext } from './types';

interface AuthDirectory {
  directoryId: string;
  name: string;
  isDefault: boolean;
  // always true unless the directory is scheduled for deletion
  isActive: boolean;
  idpType?: string;
  samlConfigurationId?: string;
  externalDirectoryId?: string;
  domains?: string[];
}

interface AuthDirectoryListResponse {
  directories: AuthDirectory[];
}

interface SamlResponse {
  directoryId: string;
  samlConfigurationId: string;
  samlConfiguration: {
    issuer: string;
    ssoUrl: PIIString;
    publicCertificate: string;
    entityId: string;
    acsUrl: string;
  };
}

export const getAvsApiBaseUrl = () => getApiGatewayUrl('/admin/private');

async function _fetch(apiUrl: SafeUrl, context: ResolverContext) {
  return safeTrelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'Member.atlassianOrganizations',
      operationName: context.operationName,
    },
  });
}

export async function atlassianOrganizationSsoUrl(
  idMember: string,
  orgId: string,
  context: ResolverContext,
) {
  // Fetch org SAML config via AVS or APS
  // https://developer.atlassian.com/cloud/account-valet/rest/api-group-get-saml-configuration-for-an-organization/#api-org-orgid-saml-configuration-get
  let apiUrl =
    getAvsApiBaseUrl() +
    sanitizeUrl`/org/${{
      value: orgId,
      type: 'organizationId',
    }}/saml-configuration`;

  let response = await _fetch(apiUrl as unknown as SafeUrl, context);

  if (response.ok) {
    const { samlConfiguration } = (await response.json()) as SamlResponse;

    /*
      If status code 200 is returned, but the ssoUrl is empty,
      throw an error, so the component knows to show an error flag.
    */
    if (!samlConfiguration?.ssoUrl) {
      throw new Error(
        `An error occurred while fetching Org SAML Config. ` +
          `(status: ${response.status}, statusText: ${response.statusText}, ` +
          `orgId: ${orgId}, message: SSO Url was empty.`,
      );
    }

    return [samlConfiguration?.ssoUrl];
  } else {
    // Two status codes are expected errors. Ignore them.
    // 404 returned when OrgId isn't found or Org isn't FlexAuth.
    // 402 returned when Org isn't licensed for Access.
    if ([402, 404].includes(response.status)) {
      return [];
    }

    if (response.status >= 400 && response.status < 500) {
      const { code } = await response.clone().json();
      if (code === 'ORG_ENABLED_FOR_MIDP') {
        // https://developer.atlassian.com/cloud/account-valet/rest/api-group-get-a-list-of-directories-for-an-organization/#api-org-orgid-directories-get
        apiUrl =
          getAvsApiBaseUrl() +
          sanitizeUrl`/org/${{
            value: orgId,
            type: 'organizationId',
          }}/directories`;
        response = await _fetch(apiUrl as unknown as SafeUrl, context);
        let { directories } =
          (await response.json()) as AuthDirectoryListResponse;
        directories = directories.filter(
          (dir) => !!dir.isActive && !!dir.samlConfigurationId,
        );
        /*
          If there's no valid directory, then this org has no valid
          SSO configuration available, which is not necessarily an error.
        */
        if (!directories.length) {
          return [];
        }

        // https://developer.atlassian.com/cloud/account-valet/rest/api-group-get-saml-configuration-for-a-directory/#api-org-orgid-directory-directoryid-saml-get
        let ssoUrls = await Promise.all(
          directories.map(async (dir) => {
            apiUrl =
              getAvsApiBaseUrl() +
              sanitizeUrl`/org/${{
                value: orgId,
                type: 'organizationId',
              }}/directory/${{ value: dir.directoryId, type: 'otherId' }}/saml`;
            response = await _fetch(apiUrl as unknown as SafeUrl, context);
            const { samlConfiguration } =
              (await response.json()) as SamlResponse;
            return Promise.resolve(samlConfiguration?.ssoUrl);
          }),
        );

        /*
          If status code 200 is returned, but there are no valid ssoUrls,
          throw an error, so the component knows to show an error flag.
        */
        ssoUrls = ssoUrls.filter((ssoUrl) => !!ssoUrl);
        if (!ssoUrls.length) {
          throw new Error(
            `An error occurred while fetching Org SAML Config. ` +
              `(status: 200, statusText: ${''}, ` +
              `orgId: ${orgId}, message: SSO Url was empty.`,
          );
        }

        return ssoUrls;
      }
    }

    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
      ownershipArea: 'trello-enterprise',
    });
    throw await parseNetworkError(response);
  }
}
