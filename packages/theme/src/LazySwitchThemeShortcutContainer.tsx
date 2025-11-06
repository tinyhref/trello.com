import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { useLazyComponent } from '@trello/use-lazy-component';

export const LazySwitchThemeShortcutContainer: FunctionComponent = () => {
  const SwitchThemeShortcutContainer = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "switch-theme-shortcut-container" */ './SwitchThemeShortcutContainer'
      ),
    { namedImport: 'SwitchThemeShortcutContainer', preload: false },
  );
  return (
    <Suspense fallback={null}>
      <SwitchThemeShortcutContainer />
    </Suspense>
  );
};
