import { TrelloStorage } from '@trello/storage';

import { WEB_SOCKETS_LOCAL_STORAGE_KEY } from './webSockets.constants';

export function setWebSocketsActive(active: boolean) {
  TrelloStorage.set(WEB_SOCKETS_LOCAL_STORAGE_KEY, active ? 'yes' : 'no');
  if (active) {
    // eslint-disable-next-line no-console
    console.log(
      'Websockets engaged! Reload the page, please. Use deactivateWebSockets() to turn sockets off.',
    );
  } else {
    // eslint-disable-next-line no-console
    console.log(
      'Shutting Websockets down! Reload the page, please. Use activateWebSockets() to turn sockets back on.',
    );
  }
}
