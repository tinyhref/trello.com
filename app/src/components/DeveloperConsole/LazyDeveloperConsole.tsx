import { Suspense } from 'react';

import { developerConsoleState } from '@trello/developer-console-state';
import { useSharedState } from '@trello/shared-state';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyDeveloperConsole = () => {
  const DeveloperConsole = useLazyComponent(
    () =>
      import(/* webpackChunkName: "developer-console" */ './DeveloperConsole'),
    { namedImport: 'DeveloperConsole', preload: false },
  );

  const [state] = useSharedState(developerConsoleState);

  return state.developerConsoleEnabled ? (
    <Suspense fallback={null}>
      <DeveloperConsole />
    </Suspense>
  ) : null;
};
