import { useEffect } from 'react';

import { Analytics } from '@trello/atlassian-analytics';

import type { GenericLiveUpdate } from 'app/scripts/init/live-updater';
import { analyticsUpdaterClient } from 'app/scripts/network/analyticsUpdaterClient';

interface TracedUpdate {
  delta: {
    traceId?: string;
    spanId?: string;
    type: string;
  };
}

const markAnalyticsTaskSucceeded = (
  update: GenericLiveUpdate & TracedUpdate,
) => {
  const { typeName, delta } = update;

  if (delta.traceId) {
    Analytics.taskSucceeded({
      taskName: 'send-message',
      traceId: delta.traceId,
      spanId: delta.spanId,
      source: 'appStartup',
      attributes: {
        id: delta.id,
        actionType: delta.type,
        typeName,
      },
    });
  }
};

export const useSocketTracing = () => {
  useEffect(() => {
    // @ts-expect-error
    analyticsUpdaterClient.subscribe(markAnalyticsTaskSucceeded);
  }, []);
};
