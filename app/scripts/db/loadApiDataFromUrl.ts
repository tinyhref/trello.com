// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';

import { Analytics } from '@trello/atlassian-analytics';
import { assert, getApiError } from '@trello/error-handling';
import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { fromNode } from '@trello/promise-helpers';
import type {
  Callback,
  GraphQLPayload,
  QuickloadError,
} from '@trello/quickload';
import { QuickLoad } from '@trello/quickload';

import type { ModelNames } from 'app/scripts/db/ModelName';
import { Time } from 'app/scripts/lib/time';
import { getUpToDateModel } from './getUpToDateModel';
import { waitFor } from './waitFor';

export type ModelTypes =
  | ModelNames
  | 'highlights'
  | 'notificationsCount'
  | 'search'
  | 'upNext';

type Response = JSON | JSON[] | null;
const preloadUncalledSentinel = {};

const quickload = function (
  url: string,
  operationName: string,
  traceId?: string | null,
  graphQLPayload?: GraphQLPayload,
): Bluebird<[Response, XMLHttpRequest, unknown]> {
  let preload = preloadUncalledSentinel;
  return fromNode<[Response, XMLHttpRequest]>(
    // @ts-expect-error
    (next: Callback) =>
      // @ts-expect-error
      (preload = QuickLoad.load(
        url,
        next,
        operationName,
        'model-loader',
        traceId,
        traceId ? Analytics.getTaskForTraceId(traceId) : null,
      )),
  )
    .catch(function (args: QuickloadError) {
      const [statusCode, responseText] = args;
      const apiError = getApiError(statusCode, responseText);
      sendNetworkErrorEvent({
        status: statusCode,
        response: apiError.toString(),
        url,
        operationName,
      });
      return Promise.reject(apiError);
    })
    .then((result) => {
      assert(
        preload !== preloadUncalledSentinel,
        "Promises resolved synchronously; didn't get preload information from QuickLoad",
      );
      return result;
    })
    .then(([data, xhr]: [Response, XMLHttpRequest]) => [data, xhr, preload]);
};

const updateServerTime = function (xhr: XMLHttpRequest) {
  const serverTime = xhr?.getResponseHeader('X-Server-Time');
  if (serverTime) {
    Time.updateServerTime(parseInt(serverTime, 10));
  }
};

const apiRequestsMap = new Map<string, boolean>();

export const loadApiDataFromUrl = (
  url: string,
  {
    operationName,
    modelType,
    traceId,
    isHeaderLoad = false,
    idModel,
    graphQLPayload,
  }: {
    operationName?: string;
    modelType: ModelTypes;
    isHeaderLoad?: boolean | null;
    traceId?: string | null;
    idModel?: string | null;
    graphQLPayload?: GraphQLPayload;
  },
): Bluebird<
  [Response, XMLHttpRequest | null, { wasDerivedFromCache: boolean }]
> => {
  const upToDateModel = apiRequestsMap.get(url)
    ? getUpToDateModel(modelType, idModel)
    : null;

  if (upToDateModel) {
    // @ts-expect-error `upToDateModel` is a TrelloModel, but is expected to be JSON. We should work out
    // if TrelloModel should extend JSON (later).
    return Bluebird.resolve([
      upToDateModel,
      null,
      { wasDerivedFromCache: true },
    ]);
  }

  apiRequestsMap.set(url, true);

  return quickload(
    url,
    operationName ?? `load:${modelType}`,
    traceId,
    graphQLPayload,
  )
    .then(([data, xhr]) => {
      updateServerTime(xhr);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dataId: string = (data as any)?.id ?? '';
      if (dataId && idModel && idModel !== dataId) {
        const shortLinkPrefix = url.split('?')[0];
        const chunks = shortLinkPrefix.split('/');
        const fullIdPrefix = chunks
          .map((chunk, i) =>
            // the shortlink prefix will look like '/1/model/shortlink'
            // we are looking for the last chunk, making sure it is a shortlink
            // and replace it with full id. Than join it all back with '/'
            i === chunks.length - 1 && chunk === idModel ? dataId : chunk,
          )
          .join('/');
        const fullIdUrl = url.replace(shortLinkPrefix, fullIdPrefix);

        apiRequestsMap.set(fullIdUrl, true);
      }

      return [data, xhr, { wasDerivedFromCache: false }];
    })
    .then((result) => {
      // We skip this logic when we're running GraphiQL because the header is never loaded in that context.
      if (isHeaderLoad) {
        return result;
      } else {
        return new Bluebird(function (resolve) {
          return waitFor('headerData', resolve);
        }).then(() => result);
      }
    }) as Bluebird<
    [Response, XMLHttpRequest, { wasDerivedFromCache: boolean }]
  >;
};
