import { Analytics } from '@trello/atlassian-analytics';
import { developerConsoleState } from '@trello/developer-console-state';
import {
  getServerGateOverridesHeaderValue,
  SERVER_GATE_OVERRIDES_HEADER,
} from '@trello/server-gate-overrides';
import type { TrelloWindow } from '@trello/window-types';

import { fetch } from './fetch';
import type {
  NetworkRequestEventAttributes,
  TrelloFetchOptions,
  TrelloRequestInit,
} from './trelloFetch.types';

declare const window: TrelloWindow;

// hash that contains the url and maps it to the request promise
// for fetching the resource. If you mount multiple components at once,
// each of week has its own instance of an apollo hook, apollo wont
// know that you are already fetching that resource until it exists in
// the cache. Therefore, we construct this map to make sure we only
// make the request once, then remove it from the hash.
const requestHash: { [url: string]: Promise<Response> | null } = {};

function maybeAddOperationNameToUrl(
  url: string,
  networkRequestEventAttributes: NetworkRequestEventAttributes | undefined,
): string {
  const operationNameInUrl = developerConsoleState.value.operationNameInUrl;
  const operationNameEnabled = operationNameInUrl;

  if (operationNameEnabled && networkRequestEventAttributes?.operationName) {
    try {
      // Add the operationName as a query parameter for GraphQL requests in
      // non-prod environments.
      const urlObject = new URL(url, window.location.origin);
      urlObject.searchParams.set(
        'operationName',
        networkRequestEventAttributes.operationName,
      );
      return urlObject.toString();
    } catch (err) {
      // If we have a problem parsing the URL, just return the original.
      return url;
    }
  } else {
    // For non-GraphQL requests or prod environments, just return the original URL.
    return url;
  }
}

export const trelloFetch = async (
  url: string,
  init?: TrelloRequestInit,
  options?: TrelloFetchOptions,
) => {
  const { clientVersion = '', networkRequestEventAttributes } = options || {};

  const deduplicate = options?.deduplicate ?? (init?.method ?? 'GET') === 'GET'; //only deduplicate by default on GET requests
  const cacheKey = [url, ...(init?.body ? [init.body] : [])].join('|'); //append the stringified body to URL when generating/accessing cached records to avoid collisions when de-duplicating POST requests

  const useTrelloTimingHeader =
    developerConsoleState.value.useTrelloTimingHeader;

  const currentPromise = deduplicate && requestHash[cacheKey];
  let requestPromise;

  if (currentPromise) {
    requestPromise = currentPromise;
  } else {
    const gateOverrides = getServerGateOverridesHeaderValue();

    requestPromise = fetch(
      maybeAddOperationNameToUrl(url, networkRequestEventAttributes),
      {
        credentials: 'include',
        ...init,
        headers: {
          'X-Trello-Client-Version': clientVersion,
          'X-Trello-Operation-Name':
            networkRequestEventAttributes?.operationName || 'unknown',
          'X-Trello-Operation-Source':
            networkRequestEventAttributes?.source || 'unknown',
          ...(useTrelloTimingHeader
            ? {
                'X-Send-Trello-Timing': '1',
              }
            : {}),
          ...(init?.headers || {}),
          ...(networkRequestEventAttributes?.traceId
            ? {
                ...Analytics.getTaskRequestHeaders(
                  networkRequestEventAttributes.traceId,
                ),
              }
            : {}),
          ...(gateOverrides
            ? { [SERVER_GATE_OVERRIDES_HEADER]: gateOverrides }
            : {}),
        },
      },
    );
  }

  if (!requestHash[cacheKey]) {
    requestHash[cacheKey] = requestPromise;
  }

  try {
    const response = await requestPromise;
    return response.clone();
  } finally {
    // once the request finishes, remove the url from the cache
    // so the future refetches can still run
    requestHash[cacheKey] = null;
  }
};

window.trelloFetch = trelloFetch;
