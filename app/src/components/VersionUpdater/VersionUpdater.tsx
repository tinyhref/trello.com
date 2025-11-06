import type { FunctionComponent, PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';

import { client } from '@trello/config';
import { Cookies } from '@trello/cookies';
import { useDynamicConfig } from '@trello/dynamic-config';
import { Spinner } from '@trello/nachos/spinner';
import { routerState } from '@trello/router';
import { TrelloStorage } from '@trello/storage';

import * as styles from './VersionUpdater.module.less';

interface ClientChecks {
  clientHead?: string;
  clientVersion?: number;
}

const lastReloadTimestampStorageKey = 'lastReloadTimestamp';

function hasReloadedRecently() {
  const lastReloadTimestamp = TrelloStorage.get(lastReloadTimestampStorageKey);
  if (lastReloadTimestamp === null) {
    return false;
  } else {
    // Return true if it's been less than 5 minutes since the last reload.
    return Date.now() - lastReloadTimestamp < 300000;
  }
}

function updateLastReloadTimestamp() {
  try {
    TrelloStorage.set(lastReloadTimestampStorageKey, Date.now());
  } catch (e) {
    // We can't do anything for storage write errors at this point, we're
    // about to reload anyhow
  }
}

export const useRequiredVersionUpdater = (clientChecks: ClientChecks = {}) => {
  // Passing this as params helps with testing.
  // There's currently a limitation on spying on named exports,
  // and passing the client.head|version instead of overriding
  // globally in tests is safer
  const { clientHead = client.head, clientVersion = client.version } =
    clientChecks;

  const passiveMinimumVersion = useDynamicConfig<number>(
    'trello_web_passively_reload_to_minimum_version',
  );
  const forcefulExactVersion = useDynamicConfig<number>(
    'trello_web_forcefully_reload_to_exact_version',
  );

  const [isUpdating, setIsUpdating] = useState(false);

  // If our client is below the minimum required version, and they
  // are on a 'build' head and not using a custom version cookie, we
  // will either subscribe to the next navigation and trigger a full page
  // refresh OR just force an immediate refresh (if the force refresh flag
  // is also enabled)
  const requiredVersion = forcefulExactVersion || passiveMinimumVersion;
  const requiredExactVersion = forcefulExactVersion;
  const notCustomBranch = clientHead === 'build' && !Cookies.get('head');
  const requiresUpgrade = notCustomBranch && clientVersion < requiredVersion;
  const requiresDowngrade =
    requiredExactVersion !== 0 &&
    notCustomBranch &&
    clientVersion > requiredExactVersion;
  const willForceRefresh =
    (requiresUpgrade || requiresDowngrade) && forcefulExactVersion > 0;

  // Scheduled refresh
  useEffect(() => {
    if ((requiresUpgrade || requiresDowngrade) && !willForceRefresh) {
      const currentRoutePath = routerState.value.location.pathname;
      const unsubscribe = routerState.subscribe(({ location }) => {
        if (!hasReloadedRecently() && currentRoutePath !== location.pathname) {
          updateLastReloadTimestamp();
          setIsUpdating(true);
          window.location.reload();
        }
      });
      return unsubscribe;
    }
  }, [requiresUpgrade, requiresDowngrade, willForceRefresh]);

  // Forced refresh
  useEffect(() => {
    if (
      !hasReloadedRecently() &&
      (requiresUpgrade || requiresDowngrade) &&
      willForceRefresh
    ) {
      updateLastReloadTimestamp();
      setIsUpdating(true);
      window.location.reload();
    }
  }, [requiresUpgrade, requiresDowngrade, willForceRefresh]);

  return { isUpdating, requiresUpgrade, requiresDowngrade, willForceRefresh };
};

export const VersionUpdater: FunctionComponent<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const { isUpdating } = useRequiredVersionUpdater();

  // If we have started refreshing the page, we don't want to render the app anymore
  // as it leads to a successful transition followed by the full page refresh
  if (isUpdating) {
    return <Spinner centered wrapperClassName={styles.spinner} />;
  }

  return <>{children}</>;
};
