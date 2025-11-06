import type { FunctionComponent } from 'react';
import { Suspense, useCallback, useState } from 'react';

import { AtlassianSwitcherPrefetchTrigger } from '@atlassian/switcher';
import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { HeaderButton } from '@trello/header-primitives';
import { useLazyComponent } from '@trello/use-lazy-component';

import { AtlassianAppSwitcherIcon } from './AtlassianAppSwitcherIcon';

import * as styles from './AtlassianAppSwitcherButton.module.less';

export const LazyAtlassianAppSwitcherButton: FunctionComponent = () => {
  const [shouldRender, setShouldRender] = useState(false);

  const AtlassianAppSwitcherButton = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "atlassian-app-switcher-button" */ './AtlassianAppSwitcherButton'
      ),
    { namedImport: 'AtlassianAppSwitcherButton', preload: shouldRender },
  );

  const onClickPlaceholderButton = useCallback(() => {
    setShouldRender(true);
  }, []);

  const renderPlaceholderButton = useCallback(
    () => (
      <HeaderButton
        className={styles.appSwitcher}
        icon={<AtlassianAppSwitcherIcon />}
        onClick={onClickPlaceholderButton}
      />
    ),
    [onClickPlaceholderButton],
  );

  return (
    <AtlassianSwitcherPrefetchTrigger product={'trello'}>
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-ghost',
          feature: 'Atlassian Switcher',
        }}
      >
        {shouldRender ? (
          <ChunkLoadErrorBoundary fallback={null}>
            <Suspense fallback={renderPlaceholderButton()}>
              <AtlassianAppSwitcherButton />
            </Suspense>
          </ChunkLoadErrorBoundary>
        ) : (
          renderPlaceholderButton()
        )}
      </ErrorBoundary>
    </AtlassianSwitcherPrefetchTrigger>
  );
};
