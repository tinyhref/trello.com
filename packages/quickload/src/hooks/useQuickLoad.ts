import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DocumentNode } from 'graphql';

import type { TrelloWindow } from '@trello/window-types';

import { cacheFactory } from '../cacheFactory';
import { getPreloadsFromInitialPath } from '../getPreloadsFromInitialPath';
import type { QuickLoadOperations } from '../operation-to-quickload-url.generated';
import { deferredQuickLoads } from './deferredQuickLoads';

declare const window: TrelloWindow;

export const useQuickLoad = ({
  waitOn,
  document,
  skip,
}: {
  waitOn: (QuickLoadOperations | 'None')[];
  document: DocumentNode;
  skip?: boolean;
}) => {
  const hasCompletedQuickloadRef = useRef(false);
  const preloadConfigForInitialPath = getPreloadsFromInitialPath();
  const initialPathname = preloadConfigForInitialPath.path;
  const validPreloadsForInitialPath = preloadConfigForInitialPath.preloads.map(
    ({ queryName }) => queryName,
  );
  const deferredPreloads = preloadConfigForInitialPath.deferredPreloads;
  const isValidOperationToWaitOn = waitOn.every(
    (operation) =>
      validPreloadsForInitialPath.includes(operation) ||
      deferredPreloads.includes(operation),
  );
  const isOnInitialPath = useMemo(
    () => initialPathname === window.location.pathname.replace(/\?(.*)$/, ''),
    [initialPathname],
  );
  const canUseWaitOn =
    // dev didn't supply waitOn argument
    waitOn.length > 0 &&
    // dev specified None, which means skip all this
    waitOn[0] !== 'None' &&
    // dev attempted to wait on preload that isn't valid for the initial route
    isValidOperationToWaitOn &&
    // we don't support route transitions since requests aren't made through QuickLoad anymore
    isOnInitialPath;
  // If we are in Storybook just move on as there are no quickloads
  const isStorybook = window?.__TRELLO_STORYBOOK_PREVIEW ?? false;
  const canQuickLoad = canUseWaitOn && !skip && !isStorybook;
  const [isQuickLoading, setIsQuickLoading] = useState(
    canQuickLoad ? true : false,
  );

  const waitForQuickLoads = useCallback(async () => {
    setIsQuickLoading(true);

    for (const operation of waitOn) {
      if (validPreloadsForInitialPath.includes(operation)) {
        await cacheFactory.waitForQueryHydratedTo(operation, 'Apollo');
      } else if (operation !== 'None') {
        await deferredQuickLoads[operation]?.getValueAsync();
      }
    }

    hasCompletedQuickloadRef.current = true;
    setIsQuickLoading(false);
  }, [validPreloadsForInitialPath, waitOn]);

  useEffect(() => {
    if (hasCompletedQuickloadRef.current) {
      return;
    }

    if (!canQuickLoad) {
      if (isQuickLoading) {
        hasCompletedQuickloadRef.current = true;
        setIsQuickLoading(false);
      }
      return;
    }

    waitForQuickLoads();
  }, [skip, canQuickLoad, isQuickLoading, waitForQuickLoads]);

  // If we are in Storybook we must return false
  if (isStorybook) {
    return false;
  }

  /**
   * So this is tricky... When someone uses this hook, they can pass skip: true, then
   * change to skip: false. When that happens, if we return isQuickLoading, then there
   * will be a frame between the useEffect running and the useQuery hook running where
   * Apollo will decide to make the network request because isQuickLoading is false.
   * Rather than make another state update to combat that, we return true here so that
   * we are performant, since this hook is used across so many components.
   */
  if (
    canUseWaitOn &&
    !isQuickLoading &&
    !hasCompletedQuickloadRef.current &&
    !skip
  ) {
    return true;
  }

  return isQuickLoading;
};
