import type {
  RealtimeDeletePayload,
  RealtimeUpdatePayload,
} from '@trello/realtime-updater';
import { realtimeUpdaterEvents } from '@trello/realtime-updater';
import { getMilliseconds } from '@trello/time';

import { currentModelManager } from 'app/scripts/controller/currentModelManager';

interface BoardModel {
  id: string;
  markAsViewed(): () => void;
}

const markCurrentBoardAsViewed = () =>
  (
    currentModelManager.getCurrentBoard() as unknown as BoardModel
  )?.markAsViewed();

// It is more of Board viewed status watcher now
export const SessionStatus = {
  start() {
    let markAsViewedTimeout: number;
    realtimeUpdaterEvents.on('ready', () => {
      window.addEventListener('beforeunload', () => {
        window.clearTimeout(markAsViewedTimeout);
        markCurrentBoardAsViewed();
      });
    });

    const onUpdateOrDelete = (
      payload: RealtimeDeletePayload | RealtimeUpdatePayload,
    ) => {
      const { idModelChannel } = payload as unknown as {
        idModelChannel: string | undefined;
      };
      if (
        idModelChannel !== undefined &&
        idModelChannel === currentModelManager.getCurrentBoard()?.id
      ) {
        // We're depending on the fact that the timeout will be cleared on view changes,
        // so the timeout won't fire if the current board changes in the next 5 minutes.
        window.clearTimeout(markAsViewedTimeout);

        markAsViewedTimeout = window.setTimeout(
          () => {
            window.clearTimeout(markAsViewedTimeout);
            markCurrentBoardAsViewed();
          },
          getMilliseconds({ minutes: 5 }),
        );
      }
    };

    realtimeUpdaterEvents.on('updateModels', onUpdateOrDelete);
    realtimeUpdaterEvents.on('deleteModels', onUpdateOrDelete);
  },
};
