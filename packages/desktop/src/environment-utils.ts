import { isDesktop, isWindows } from '@trello/browser';

export const shouldHandleWindowsFrame = (): boolean =>
  isWindows() && isDesktop();
