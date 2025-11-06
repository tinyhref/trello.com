import { useSharedState } from '@trello/shared-state';

import type { GlobalThemeState } from './globalThemeState';
import { globalThemeState } from './globalThemeState';

export const useGlobalTheme = (): GlobalThemeState => {
  const [state] = useSharedState(globalThemeState, {
    onlyUpdateIfChanged: true,
  });

  return state;
};
