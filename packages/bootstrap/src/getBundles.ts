import type { TrelloWindow } from '@trello/window-types';

declare const window: TrelloWindow;

export function getBundles() {
  return window.__bundles;
}
