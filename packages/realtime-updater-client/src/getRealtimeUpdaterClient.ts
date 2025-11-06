import { RealtimeUpdaterClient } from '@trello/realtime-updater';
import type { TrelloWindow } from '@trello/window-types';

declare const window: TrelloWindow;

let realtimeUpdaterClient: RealtimeUpdaterClient;

export const getRealtimeUpdaterClient = () => {
  if (!realtimeUpdaterClient) {
    realtimeUpdaterClient = new RealtimeUpdaterClient();
    window.realtimeUpdaterClient = realtimeUpdaterClient;
  }

  return realtimeUpdaterClient;
};
