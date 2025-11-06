import { createIntl, createIntlCache } from 'react-intl';

import type { TrelloWindow } from '@trello/window-types';

declare const window: TrelloWindow;

const cache = createIntlCache();
export const intlCache = createIntl(
  {
    locale: window.locale,
    messages: window.__locale,
  },
  cache,
);
