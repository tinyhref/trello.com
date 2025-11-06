import { useCallback } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { Key, Scope, useShortcut } from '@trello/keybindings';
import { getScreenFromUrl } from '@trello/marketing-screens';
import {
  addSearchParamsToLocation,
  getLocation,
  isActiveRoute,
  routerState,
} from '@trello/router';
import { navigate } from '@trello/router/navigate';
import { RouteId } from '@trello/router/routes';

export const useHelpShortcut = () => {
  const onShortcut = useCallback(() => {
    Analytics.sendPressedShortcutEvent({
      shortcutName: 'shortcutsPage',
      source: getScreenFromUrl(),
      keyValue: '?',
    });

    if (isActiveRoute(routerState.value, RouteId.BOARD)) {
      const location = addSearchParamsToLocation(getLocation(), {
        overlay: 'shortcuts',
      });
      navigate(`${location.pathname}${location.search}`, { trigger: false });
    } else {
      navigate('/shortcuts', {
        trigger: true,
      });
    }
  }, []);

  useShortcut(onShortcut, {
    scope: Scope.Global,
    key: Key.QuestionMark,
  });
};
