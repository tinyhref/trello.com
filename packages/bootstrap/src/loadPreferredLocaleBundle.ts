import type { TrelloWindow } from '@trello/window-types';

import { getPreferredLocale } from './getPreferredLocale';
import { loadLocaleBundle } from './loadLocaleBundle';

declare const window: TrelloWindow;

let loader: Promise<void>;

export function loadPreferredLocaleBundle() {
  // We only want to load the preferred locale bundle once
  // per session to avoid conflicting code
  if (loader) {
    return loader;
  }

  const locale = getPreferredLocale();
  window.locale = locale;
  loader = loadLocaleBundle(locale);

  return loader;
}
