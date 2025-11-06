import { useCallback, useEffect } from 'react';

import {
  cacheFactory,
  getPreloadsFromInitialPath,
  QuickLoad,
} from '@trello/quickload';
import { quickLoadSharedState } from '@trello/quickload-shared-state';
import { useSharedStateSelector } from '@trello/shared-state';

import { syncQuickloadResultsToCache } from './syncQuickloadResultsToCache';

export const useQuickload = () => {
  const isQuickLoading = useSharedStateSelector(
    quickLoadSharedState,
    useCallback((state) => state.isLoading, []),
  );

  /**
   * Syncs quickload data to the apollo cache. This is currently redundant
   * to what we do in loadApiDataFromQuickload, because we call syncDeltaToCache
   * when a request completes. But I imagine that one day we'll get rid of that in
   * favor of code being in src/components
   */
  const syncQuickLoadData = useCallback(async () => {
    await syncQuickloadResultsToCache();

    quickLoadSharedState.setValue({
      isLoading: false,
    });
  }, []);

  /**
   * Quickload contains a cache that should be cleared once our caches are hydrated.
   * Here we add promise listeners for when data has been synced to ModelCache and Apollo.
   * When all of them are complete, we can clear quickload.
   */
  const clearQuickloadCache = useCallback(async () => {
    const { preloads } = getPreloadsFromInitialPath();
    const queries = preloads.map(({ queryName }) => queryName);
    await Promise.all([
      ...queries.map((queryName) =>
        cacheFactory.waitForQueryHydratedTo(queryName, 'Apollo'),
      ),
      ...queries.map((queryName) =>
        cacheFactory.waitForQueryHydratedTo(queryName, 'ModelCache'),
      ),
    ]);
    QuickLoad.clear();
    QuickLoad.markComplete();
  }, []);

  useEffect(() => {
    syncQuickLoadData();
    clearQuickloadCache();
  }, [syncQuickLoadData, clearQuickloadCache]);

  return isQuickLoading;
};
