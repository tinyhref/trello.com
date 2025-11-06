import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { routerState, type RouterState } from '@trello/router';
import type { RouteIdType } from '@trello/router/routes';
import { TrelloSessionStorage, type StorageKey } from '@trello/storage';

import { useIsEmployee } from 'app/src/useIsEmployee';

interface RouterNavigationEvent {
  time: number;
  uuid: string;
  current: RouterState<RouteIdType>;
  previous: RouterState<RouteIdType>;
}

const routerDiagnosticsLogStorageKey: StorageKey<'sessionStorage'> =
  'PLATFORM_ROUTER_DIAGNOSTICS_LOG';

// Maximum number of navigation log entries. Once the log grows beyond this size, the oldest log entries are dropped as new entries are created.
const routerLoggingLimit = 100;

const routerStateSubscription = (
  value: RouterState<RouteIdType>,
  previousValue: RouterState<RouteIdType>,
) => {
  const routerDiagnosticsLog: RouterNavigationEvent[] =
    TrelloSessionStorage.get(routerDiagnosticsLogStorageKey) ?? [];
  const newLogItem: RouterNavigationEvent = {
    time: Date.now(),
    uuid: uuidv4(),
    current: value,
    previous: previousValue,
  };
  TrelloSessionStorage.set(
    routerDiagnosticsLogStorageKey,
    [...routerDiagnosticsLog, newLogItem].slice(-routerLoggingLimit),
  );
};

export const useRoutingDiagnostics = () => {
  const [hasRouterSubscription, setHasRouterSubscription] = useState(false);
  //Only log requests from Trellists for diagnostics
  const shouldLog = useIsEmployee();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined = undefined;

    if (!hasRouterSubscription && shouldLog) {
      unsubscribe = routerState.subscribe(routerStateSubscription);
      setHasRouterSubscription(true);
    }

    return () => unsubscribe?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- depending on hasRouterSubscription would cause unwanted recursion here, as it's only set in the useEffect hook.
  }, [shouldLog]);
};
