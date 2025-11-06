/*
 * ============================================================================
 * APOLLO CLIENT CACHE SIZE CONFIGURATION
 * ============================================================================
 *
 * Apollo recommends setting cache sizes before loading the library since some
 * caches are initialized when the library is loaded. We do that here in quickload
 * since it executes before the Apollo client is created.
 *
 * See: https://www.apollographql.com/docs/react/caching/memory-management
 * ============================================================================
 */
import type { CacheSizes } from '@apollo/client/utilities';

import type { Task } from '@trello/analytics-types';
import type { TrelloWindow } from '@trello/window-types';

import { cleanPreload } from './cleanPreload';
import { getPreloadsFromPath } from './getPreloadsFromPath';
import { get64BitSpanId, get128BitTraceId } from './getTraceId';
import { makeUrl } from './makeUrl';
import { getPreloadHashKey, preloadsHash } from './preloadsHash';
import type {
  Callback,
  CleanPreload,
  GraphQLPayload,
  Preload,
} from './quickload.types';

// @ts-expect-error Element implicitly has an 'any' type because expression of type 'symbol' can't be used to index type 'typeof globalThis'.
globalThis[Symbol.for('apollo.cacheSize')] = {
  'inMemoryCache.executeSelectionSet': 200000,
  'inMemoryCache.executeSubSelectedArray': 100000,
  'inMemoryCache.maybeBroadcastWatch': 100000,
} satisfies Partial<CacheSizes>;

declare const window: TrelloWindow;

// eslint-disable-next-line @trello/enforce-variable-case
const parseJSON = function (data: string) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
};

const makeGraphQLRequest = function (
  url: string,
  payload: GraphQLPayload,
  next: Callback,
  operationName = 'unknown',
  operationSource = 'quickload',
  traceId?: string | null,
  taskName?: string | null,
) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json; charset=utf-8');
  headers.append('Accept', 'application/json');
  headers.append('X-Trello-Client-Version', window.trelloVersion || 'dev-0');
  headers.append('X-Trello-Operation-Source', operationSource);
  headers.append('X-Trello-Operation-Name', operationName);

  if (traceId) {
    headers.append('X-Trello-TraceId', traceId);
    headers.append('X-B3-TraceId', traceId);
    headers.append('X-B3-SpanId', get64BitSpanId());
    headers.append('X-Trello-Task', taskName || 'not-implemented');
  }

  (async () => {
    try {
      // eslint-disable-next-line @trello/fetch-includes-client-version
      const response = await fetch(
        !operationName ? url : `${url}?operationName=${operationName}`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        // we're still awaiting the data to make sure the request shows as
        // completed in the network tab. Without this, the request will
        // show as pending until the next request is made.
        const data = await response.json();
        next(null, [data, null]);
      } else {
        next([response.status, await response.text()]);
      }
    } catch (err) {
      // TODO: We probably got here because the JSON response was not valid JSON. We need to work out when we should do in this scenario.
      next([0, 'failed to fetch']);
    }
  })();
};

const makeRestApiRequest = function (
  url: string,
  next: Callback,
  operationName = 'unknown',
  operationSource = 'model-loader',
  traceId?: string | null,
  taskName?: Task | null,
) {
  const xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    !operationName ? url : `${url}&operationName=${operationName}`,
    true,
  );
  xhr.setRequestHeader('Accept', 'application/json,text/plain');
  xhr.setRequestHeader(
    'X-Trello-Client-Version',
    window.trelloVersion || 'dev-0',
  );
  xhr.setRequestHeader('X-Trello-Operation-Source', operationSource);
  xhr.setRequestHeader('X-Trello-Operation-Name', operationName);

  if (traceId) {
    xhr.setRequestHeader('X-Trello-TraceId', traceId);
    xhr.setRequestHeader('X-B3-TraceId', traceId);
    xhr.setRequestHeader('X-B3-SpanId', get64BitSpanId());
    xhr.setRequestHeader('X-Trello-Task', taskName || 'not-implemented');
  }

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status !== 200) {
        next([xhr.status, xhr.responseText]);
      } else {
        next(null, [parseJSON(xhr.responseText), xhr]);
      }
    }
  };

  xhr.send(null);
};

const removePreload = function (key: string) {
  if (!(key in preloadsHash)) {
    return;
  }
  delete preloadsHash[key];
};

const preload = function (
  url: string,
  operationName = 'preload',
  graphQLPayload?: GraphQLPayload,
  traceId?: string,
  taskName?: Task | null,
) {
  if (!url) {
    return;
  }

  const preloadObject: Preload = {
    isLoading: true,
    callbacks: [],
    start: Date.now(),
    used: false,
    url,
    traceId,
  };

  const preloadKey = getPreloadHashKey({ url, graphQLPayload });
  preloadsHash[preloadKey] = preloadObject;

  if (graphQLPayload) {
    makeGraphQLRequest(
      url,
      graphQLPayload,
      function (err, data) {
        preloadObject.isLoading = false;
        if (err) {
          preloadObject.error = err;
          for (const callback of Array.from(preloadObject.callbacks)) {
            callback(err);
          }
          return;
        }
        preloadObject.data = data;
        for (const callback of Array.from(preloadObject.callbacks)) {
          callback(null, data);
        }
      },
      operationName,
      'quickload',
      traceId,
      taskName,
    );

    return;
  }

  makeRestApiRequest(
    url,
    function (err, data) {
      let callback;
      preloadObject.isLoading = false;
      if (err) {
        preloadObject.error = err;
        for (callback of Array.from(preloadObject.callbacks)) {
          callback(err);
        }
        return;
      }
      preloadObject.data = data;
      for (callback of Array.from(preloadObject.callbacks)) {
        callback(null, data);
      }
    },
    operationName,
    'quickload',
    traceId,
    taskName,
  );
};

const quickload = {
  // The "init" method is called once from index.template.ts to kick off preloading
  init() {
    const traceId = get128BitTraceId();
    const { preloads } = getPreloadsFromPath();

    for (const { url, operationName, graphQLPayload, taskName } of preloads) {
      preload(url, operationName, graphQLPayload, traceId, taskName);
    }
  },
  getPreloadsFromPath,
  makeUrl,
  load(
    url: string,
    next: Callback = () => {},
    operationName: string,
    operationSource: string,
    traceId?: string | null,
    taskName?: Task | null,
  ): CleanPreload | void {
    const preloadKey = getPreloadHashKey({ url });
    const preloadObject = preloadsHash[preloadKey];
    if (preloadObject !== undefined) {
      preloadObject.used = true;
      if (preloadObject.isLoading) {
        preloadObject.callbacks.push(next);
      } else {
        next(preloadObject.error, preloadObject.data);
      }
      return cleanPreload(preloadObject);
    } else {
      makeRestApiRequest(
        url,
        next,
        operationName,
        operationSource,
        traceId,
        taskName,
      );
    }
  },
  getPreloadTraceId(): string | undefined {
    const { preloads } = getPreloadsFromPath();
    for (const { url, graphQLPayload } of preloads) {
      const preloadKey = getPreloadHashKey({ url, graphQLPayload });
      if (preloadKey in preloadsHash) {
        return preloadsHash[preloadKey].traceId;
      }
    }
    return;
  },
  clear() {
    for (const key in preloadsHash) {
      removePreload(key);
    }
  },
  markComplete() {
    this.status = 'complete';
  },
  status: 'pending',
};

// don't want to run init in tests, because it can show/cause errors
process.env.NODE_ENV !== 'test' && quickload.init();
export const QuickLoad = (window.QuickLoad = quickload);
