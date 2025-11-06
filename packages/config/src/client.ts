import type { TrelloWindow } from '@trello/window-types';

export { AppId } from '@trello/window-types';

declare const window: TrelloWindow;

const config = window.init_config || {};

export const appId = config.appId || null;
export const dontDismissNotifications = config.dontDismissNotifications || null;
export const limitMemoryUsage = config.limitMemoryUsage || null;
export const desktopVersion = config.desktopVersion || '0';
