import _ from 'underscore';

import type { TracedError } from '@trello/atlassian-analytics';
import { clientVersion } from '@trello/config';
import {
  getErrorTextFromFetchResponse,
  isFetchCancellationError,
  makeErrorEnum,
} from '@trello/error-handling';
import { sendErrorEvent, sendNetworkErrorEvent } from '@trello/error-reporting';
import { trelloFetch } from '@trello/fetch';

import type { PollingBatchResponse } from './realtimeUpdater.types';
import { realtimeUpdaterEvents } from './realtimeUpdaterEvents';
import { subscriptionManager } from './subscriptionManager';
import { syncError } from './syncError';

const realtimeUpdaterError = makeErrorEnum('RPC', ['SyncError', 'BatchError']);

const tryParseJson = function (str: string) {
  try {
    return JSON.parse(str);
  } catch (error) {
    return null;
  }
};

let syncErrorAlreadyReported = false;

export const resync = async ({
  idModel,
  onSyncError,
}: {
  idModel: string;
  onSyncError?: () => void;
}) => {
  const subscription = subscriptionManager.currentSubscriptions[idModel];

  if (subscription) {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { modelType, idModel, ixLastUpdate, tags } = subscription;
    const url = `/1/${modelType}/${idModel}/deltas?ixLastUpdate=${encodeURIComponent(
      ixLastUpdate.toString(),
    )}&tags=${encodeURIComponent(tags.join(','))}`;

    try {
      const response = await trelloFetch(
        url,
        {
          headers: {
            'X-Trello-Resync': true,
            'X-Trello-Client-Version': clientVersion,
          },
        },
        {
          networkRequestEventAttributes: {
            operationName: 'resync',
            source: 'trelloFetch',
          },
        },
      );

      let syncErrorOccurrence = null;

      if (!response.ok) {
        subscriptionManager.handleInvalidSubscription(idModel);
        sendNetworkErrorEvent({
          url,
          status: response.status,
          response: await getErrorTextFromFetchResponse(response),
          operationName: 'resync',
        });
      } else {
        const result: PollingBatchResponse = await response.json();

        if (result.syncError !== null && result.syncError !== undefined) {
          syncErrorOccurrence = realtimeUpdaterError.SyncError(
            result.syncError,
          );
        } else {
          subscriptionManager.setIxLastUpdate(
            idModel,
            result.modelIxUpdate[idModel],
          );

          _.chain(result?.messages || [])
            .map(tryParseJson)
            .compact()
            .forEach(({ notify, idModelChannel }) => {
              realtimeUpdaterEvents.trigger(notify.event, {
                idModelChannel,
                ...notify,
              });
            });
        }
      }

      if (syncErrorOccurrence) {
        syncError(syncErrorOccurrence, {
          isUsingSocket: true,
          syncErrorAlreadyReported,
        });
        syncErrorAlreadyReported = true;
        onSyncError?.();
      }
    } catch (err) {
      if (err instanceof Error && isFetchCancellationError(err)) {
        // the browser cancelled the request
      } else {
        sendErrorEvent(err as TracedError, {
          tags: {
            ownershipArea: 'trello-platform',
          },
          extraData: {
            component: 'SocketConnection',
            operationName: 'resync',
          },
        });
      }
    }
  }
};
