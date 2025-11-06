import { Analytics } from '@trello/atlassian-analytics';
import { sendErrorEvent } from '@trello/error-reporting';
import type { DataWithId, JSONObject } from '@trello/graphql';
import {
  client,
  syncDeltaToCache,
  syncNativeDeltaToCache,
} from '@trello/graphql';
import { getScreenFromUrl } from '@trello/marketing-screens';
import type { QuickloadError } from '@trello/quickload';
import {
  cacheFactory,
  getPreloadHashKey,
  getPreloadsFromInitialPath,
  getQueryByOperationName,
  waitForQuickloadPreload,
} from '@trello/quickload';
import { quickLoadSharedState } from '@trello/quickload-shared-state';

/**
 * This function will grab preloads from quickload, then loop through them
 * and sync them to the apollo cache. Upon completion, it needs to mark the
 * query as being synced to the apollo cache so that queries waiting in
 * quickloadDataByDirective can resolve.
 */
export const syncQuickloadResultsToCache = async (): Promise<void> => {
  const { preloads } = getPreloadsFromInitialPath();

  await Promise.all(
    preloads.map(async ({ queryName, url, modelName, graphQLPayload }) => {
      const startTime = Date.now();
      try {
        quickLoadSharedState.setValue({
          routeToLoadingState: {
            ...quickLoadSharedState.value.routeToLoadingState,
            [queryName]: true,
          },
        });
        const preloadKey = getPreloadHashKey({ url, graphQLPayload });
        const result = await waitForQuickloadPreload(preloadKey);

        if (!result) {
          return;
        }

        const data = result[0];

        // somehow this happens, not sure why
        // fixes an issue in sentry https://sentry.io/organizations/atlassian-2y/issues/3084762141/?project=5988847
        if (!data) {
          return;
        }

        const query = getQueryByOperationName(queryName);
        interface NativeGraphQLResponse {
          data: {
            trello: Record<string, JSONObject>;
          };
        }
        const nativeData = (data as unknown as NativeGraphQLResponse).data;
        const isNativeQuery = !!graphQLPayload;
        if (isNativeQuery && query) {
          try {
            // The me query doesn't take in any args. Grab the memberId in the
            // response so Apollo normalizes the cache write.
            const currentUserMemberId = nativeData.trello?.me?.id;
            const variables = currentUserMemberId
              ? { id: currentUserMemberId }
              : graphQLPayload.variables;
            syncNativeDeltaToCache(client, nativeData, {
              fromDocument: query,
              variables,
            });
          } catch (error) {
            console.error('Error running syncNativeDeltaToCache:', error);
          }
        } else {
          syncDeltaToCache(client, modelName, data as unknown as DataWithId, {
            fromDocument: query!,
          });
        }

        Analytics.sendOperationalEvent({
          action: 'succeeded',
          actionSubject: 'quickload',
          attributes: {
            waitTime: Date.now() - startTime,
            operation: queryName,
          },
          source: getScreenFromUrl(),
        });
      } catch (err) {
        let status = 0;
        let message = null;
        if (Array.isArray(err)) {
          [status, message] = err as QuickloadError;
        }

        // no need to report on these
        if ([0, 401, 403, 404].includes(status)) {
          return;
        }

        if (message === 'invalid token') {
          return;
        }

        sendErrorEvent(err);
        Analytics.sendOperationalEvent({
          action: 'failed',
          actionSubject: 'quickload',
          attributes: {
            waitTime: Date.now() - startTime,
            operation: queryName,
            status,
          },
          source: getScreenFromUrl(),
        });
      } finally {
        cacheFactory.markQueryHydratedFor(queryName, 'Apollo');
        // Or we can check for `modelName.startsWith('Trello')`
        const isNativeQuery = queryName.startsWith('Trello');
        if (isNativeQuery) {
          // Marking it hydrated so Quickload will not wait for it indefinitely
          cacheFactory.markQueryHydratedFor(queryName, 'ModelCache');
        }

        quickLoadSharedState.setValue({
          routeToLoadingState: {
            ...quickLoadSharedState.value.routeToLoadingState,
            [queryName]: false,
          },
        });
      }
    }),
  );
};
