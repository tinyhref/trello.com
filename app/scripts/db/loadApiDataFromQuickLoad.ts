// eslint-disable-next-line no-restricted-imports
import Bluebird from 'bluebird';

import type { QuickLoadOperations } from '@trello/quickload';
import {
  cacheFactory,
  deferredQuickLoads,
  formatUrl,
  getPreloadsFromInitialPath,
  getPreloadsFromPath,
  getQueryByOperationName,
  OperationToQuickloadUrl,
  QuickLoad,
} from '@trello/quickload';

import { ninvoke } from 'app/scripts/lib/util/ninvoke';
import type { MappingRules } from './db.types';
import { loadApiDataFromUrl } from './loadApiDataFromUrl';
import { ModelCache } from './ModelCache';
import type { ModelNames } from './ModelName';

/**
 * Will load data from the quickload cache. If using this, you want to align the queryName
 * you pass with an existing quickload query, such as MemberHeader. We use operation names to
 * denote which query you are loading, specified as the name of the query in the graphql file.
 * @param queryName: MemberHeader, MemberBoards, etc.
 * @param traceId: traceId used for vital stats
 * @param idModel: the model that quickload we will replace the url string with. For example, for
 * CurrentBoardFull we replace the :idBoard param with the shortLink
 * @param modelType: Member, Board, etc
 * @param mappingRules: defines how to modify data before adding to the model cache
 * @returns
 */
export const loadApiDataFromQuickLoad = (
  queryName: QuickLoadOperations,
  {
    traceId,
    idModel,
    isHeaderLoad,
    modelType,
    mappingRules,
  }: {
    traceId?: string | null;
    idModel?: string;
    isHeaderLoad?: boolean | null;
    modelType: ModelNames;
    mappingRules?: MappingRules;
  },
) => {
  const operationDefinition = OperationToQuickloadUrl[queryName];

  if (!operationDefinition) {
    throw new Error(`${queryName} quickload definition was removed or renamed`);
  }

  const { param } = getPreloadsFromPath();

  if (!idModel) {
    if (operationDefinition.rootId === ':idMember') {
      idModel = 'me';
    } else if (param) {
      idModel = param;
    } else {
      // this can't really happen, unless someone passes the wrong idModel and there is no param
      // as a result. Throwing an error should stop this in development, but don't want to throw
      // in prod
      if (process.env.NODE_ENV !== 'production') {
        throw new Error(
          `Could not find param for ${queryName}. Please ensure correct idModel is being passed.`,
        );
      }

      return Bluebird.resolve();
    }
  }

  const apiUrl = formatUrl(operationDefinition.url, {
    rootId: operationDefinition.rootId,
    idModel,
  });

  return loadApiDataFromUrl(apiUrl, {
    modelType,
    operationName: operationDefinition.operationName,
    traceId: traceId || QuickLoad.getPreloadTraceId(),
    isHeaderLoad: Boolean(isHeaderLoad),
    idModel,
  })
    .then(([data, _, { wasDerivedFromCache }]) => {
      if (data) {
        // we already synced this to the cache in the past, skip syncing
        if (wasDerivedFromCache) {
          return data;
        }

        const validPreloadsForInitialPath =
          getPreloadsFromInitialPath().preloads.map(
            // eslint-disable-next-line @typescript-eslint/no-shadow
            ({ queryName }) => queryName,
          );

        const skipSyncingToApollo =
          QuickLoad.status === 'pending' &&
          validPreloadsForInitialPath.includes(queryName);

        // Mark any deferred requests as complete as well
        deferredQuickLoads[queryName]?.setValue(null);

        return ninvoke(
          ModelCache,
          'enqueueDelta',
          modelType,
          data,
          mappingRules,
          {
            document: getQueryByOperationName(queryName),
            // the useQuickLoad hook will take care of syncing data to the apollo cache
            // once this is 'complete' then we can start syncing these deltas to apollo
            // There are quickload requests that can be made for different routes than the one
            // that we are on, such as CurrentBoardFull while on card route. So we also check
            // that it's a valid preload for the route, since CurrentBoardFull might finish
            // before QuickLoad is complete, and we would otherwise skip syncing it here.
            skipSyncingToApollo,
          },
        );
      } else {
        return [];
      }
    })
    .then((results: unknown) => {
      /**
       * At this point we can mark queries hydrated to both caches. That is because
       * the enqueueDelta does a syncDeltaToCache that is synchronous. If that wasn't,
       * we'd want to change this so that there isn't a race between the useQuickload
       * hook and loading from here.
       */
      cacheFactory.markQueryHydratedFor(queryName, 'ModelCache');
      cacheFactory.markQueryHydratedFor(queryName, 'Apollo');
      return results;
    })
    .catch((err: Error) => {
      cacheFactory.markQueryHydratedFor(queryName, 'ModelCache');
      cacheFactory.markQueryHydratedFor(queryName, 'Apollo');
      throw err;
    });
};
