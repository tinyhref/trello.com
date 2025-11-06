import type {
  RealtimeUpdatePayloadResponses,
  RealtimeUpdaterModelType,
} from '@trello/realtime-updater';
import { realtimeUpdaterEvents } from '@trello/realtime-updater';

export interface Deleted {
  id: string;
  deleted: true;
}
export function isDeleted<T>(entry: Deleted | T): entry is Deleted {
  return entry && (entry as Deleted).deleted === true;
}

export type LiveUpdate = {
  [typeName in RealtimeUpdaterModelType]: {
    typeName: typeName;
    delta: Deleted | RealtimeUpdatePayloadResponses[typeName];
  };
};

export type GenericLiveUpdate = LiveUpdate[RealtimeUpdaterModelType];

export type Callback = (update: GenericLiveUpdate) => void;
export type Publish = (update: GenericLiveUpdate) => void;
export type Subscribe = (callback: Callback) => Publish;

const listeners: Callback[] = [];

export function subscribe(callback: Callback): Publish {
  listeners.push(callback);

  return (update: GenericLiveUpdate) => {
    listeners.forEach((fx) => {
      if (fx !== callback) {
        fx(update);
      }
    });
  };
}

function sendUpdates(updates: GenericLiveUpdate[]): void {
  listeners.forEach((fx) => {
    updates.forEach(fx);
  });
}

realtimeUpdaterEvents.on('updateModels', ({ typeName, deltas }): void => {
  sendUpdates(
    deltas.map(
      (delta) =>
        ({
          typeName,
          delta,
        }) as GenericLiveUpdate,
    ),
  );
});

realtimeUpdaterEvents.on('deleteModels', ({ typeName, deltas }): void => {
  sendUpdates(
    deltas.map(
      ({ id }) =>
        ({
          typeName,
          delta: {
            id,
            deleted: true,
          },
        }) as GenericLiveUpdate,
    ),
  );
});

realtimeUpdaterEvents.on(
  'invalidModel',
  (typeName: RealtimeUpdaterModelType, id: string) => {
    // We want to treat invalid (unable to subscribe) Boards/Organizations as
    // deletes
    //
    // Right now we don't want to try to handle invalid members as deletes, because
    // destroying a member record will trigger delete API calls from any memberLists
    if (typeName === 'Board' || typeName === 'Organization') {
      const update: GenericLiveUpdate = {
        typeName,
        delta: { id, deleted: true },
      } as GenericLiveUpdate;

      sendUpdates([update]);
    }
  },
);
