import type { TrelloWindow } from '@trello/window-types';

import { loadBundle } from './loadBundle';
import { loadPreferredLocaleBundle } from './loadPreferredLocaleBundle';

declare const window: TrelloWindow;

async function loadAndStartTrello() {
  await loadBundle('ltp');
  await loadBundle('app');
  window.startTrello();
}

export async function bootstrap() {
  await loadPreferredLocaleBundle();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAndStartTrello);
  } else {
    loadAndStartTrello();
  }
}
