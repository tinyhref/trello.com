import { useEffect, useMemo } from 'react';

import { isDesktop } from '@trello/browser';
import { desktopIpc } from '@trello/desktop';
import { useGlobalTheme } from '@trello/theme';

export const useDesktopTheme = () => {
  const isEnabled = useMemo(
    () => isDesktop() && desktopIpc?.isChannelSupported('theme'),
    [],
  );

  const theme = useGlobalTheme();

  useEffect(() => {
    if (isEnabled) {
      desktopIpc.send('theme', theme);
    }
  }, [isEnabled, theme]);
};
