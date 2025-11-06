import { useEffect, useMemo } from 'react';

import type { RealtimeUpdaterModelType } from '@trello/realtime-updater';

import type { LiveUpdate } from 'app/scripts/init/live-updater';
import { LiveUpdaterClient } from 'app/scripts/init/live-updater-client';

export const useSocketUpdate = <TModel extends RealtimeUpdaterModelType>({
  modelName,
  onMessage,
}: {
  modelName: RealtimeUpdaterModelType;
  onMessage: (message: LiveUpdate[TModel]) => void;
}) => {
  const client = useMemo(() => new LiveUpdaterClient(), []);

  useEffect(() => {
    // @ts-expect-error TS(2345): Argument of type '(newMessage: LiveUpdate[ModelNam... Remove this comment to see the full error message
    client.subscribe((newMessage: LiveUpdate[TModel]) => {
      if (newMessage.typeName === modelName) {
        onMessage(newMessage);
      }
    });

    return () => client.unsubscribe(() => {});
  }, [client, modelName, onMessage]);
};
