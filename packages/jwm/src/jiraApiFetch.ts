import { getApiGatewayUrl } from '@trello/api-gateway';
import { Analytics } from '@trello/atlassian-analytics';
import { clientVersion } from '@trello/config';
import { getErrorTextFromFetchResponse } from '@trello/error-handling';
import { fetch } from '@trello/fetch';

import { CloudInstanceRestrictedError } from './CloudInstanceRestrictedError';

interface JiraApiRequestInit {
  method: 'DELETE' | 'GET' | 'POST' | 'PUT';
  body?: string;
}

/*
  Function for making fetch requests to the Jira REST API via
  Stargate. 
  
  Checks for errors due to suspended tenants and throws a 
  CloudInstanceRestrictedError when they occur, making it easier for 
  consumers to detect and handle suspended instances. Suspended 
  instances are also known as offline instances.
*/

export const jiraApiFetch = async (
  idCloud: string,
  path: string,
  requestInit: JiraApiRequestInit = { method: 'GET' },
) => {
  const url = getApiGatewayUrl(`ex/jira/${idCloud}/rest/api${path}`);

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': clientVersion,
    },
    ...requestInit,
  });

  if (response.ok) {
    return response.json();
  } else {
    if (response.status === 403) {
      const json = await response.json();

      // A cloud tenant can be suspended due to missed payments or
      // other causes. When a tenant is suspended, API requests for
      // that cloudId will fail with 403 errors and the message that
      // "Tenant is restricted".
      // We throw a unique class of error here, so that consumers of
      // this function can easily detect when a fetch failure is due
      // to a suspended tenant, and handle that accordingly.
      if (json.message.includes('Tenant is restricted')) {
        Analytics.sendOperationalEvent({
          action: 'attempted',
          actionSubject: 'fetchJiraData',
          source: '@trello/jwm',
          attributes: {
            message: json.message,
          },
        });
        throw new CloudInstanceRestrictedError();
      }
    }
    throw new Error(await getErrorTextFromFetchResponse(response));
  }
};
