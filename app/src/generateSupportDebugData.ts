import { asString } from '@trello/browser';
import { clientVersion } from '@trello/config';
import { client } from '@trello/graphql';
import type { SocketEventType } from '@trello/realtime-updater';
import { subscriptionManager } from '@trello/realtime-updater';
import { importWithRetry } from '@trello/use-lazy-component';
import {
  connectionInformationState,
  webSocketState,
} from '@trello/web-sockets';

import { ModelCache } from 'app/scripts/db/ModelCache';

interface SocketEvent {
  eventType: SocketEventType;
  eventTime: string;
  eventData: object | string | null;
  timeSincePageLoadInSeconds: number;
}

const optionalSocketData: {
  eventLog: SocketEvent[];
} = {
  eventLog: [],
};

interface ErrorDetails {
  errorTime: string;
  timeSincePageLoadInSeconds: number;
  error: Pick<ErrorEvent, 'colno' | 'filename' | 'lineno' | 'message'>;
}

const optionalErrorData: {
  log: ErrorDetails[];
} = {
  log: [],
};

export const generateSupportDebugData = () => {
  // Strip the "_events" property from the ModelCache because it contains
  // circular references and can't be stringified.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { _events, ...modelCacheWithoutEvents } = ModelCache as any;

  const supportDebugData = {
    meta: {
      browser: asString,
      features: {}, // should we use feature gates here? (there is no gates export and dynamic config doesn't make sense)
      version: clientVersion,
      sessionStartTime: new Date(Date.now() - performance.now()).toString(),
      sessionDurationInSeconds: performance.now() / 1000,
      exportTime: new Date().toString(),
    },
    // @ts-expect-error Property 'watches' does not exist on type 'ApolloCache<NormalizedCacheObject>'
    apolloWatches: client.cache.watches,
    apolloMemoryInternals: client.getMemoryInternals?.(),
    apolloCache: client.cache.extract(),
    modelCache: modelCacheWithoutEvents,
    errors: {
      ...optionalErrorData,
    },
    socketConnection: {
      currentSubscriptions: subscriptionManager.currentSubscriptions,
      state: webSocketState.value,
      ...optionalSocketData,
    },
    connectivityLog: connectionInformationState.value.eventLog,
  };

  importWithRetry(
    () =>
      import(
        /* webpackChunkName: "download-support-debug-data" */ './downloadSupportDebugData'
      ),
  ).then(({ downloadSupportDebugData }) => {
    downloadSupportDebugData(supportDebugData);
  });

  return supportDebugData;
};
