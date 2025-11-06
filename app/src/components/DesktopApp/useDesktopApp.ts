import { useDesktopTheme } from './DesktopTheme/useDesktopTheme';
import { useDesktopNotifications } from './DesktopNotification';
import { useDesktopStarredBoards } from './DesktopStarredBoards';
import { useDesktopUrls } from './DesktopUrls';

export const useDesktopApp = () => {
  useDesktopNotifications();
  useDesktopStarredBoards();
  useDesktopUrls();
  useDesktopTheme();
};
