import { Suspense, type FunctionComponent } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyPluginPopover: FunctionComponent = () => {
  const PluginPopover = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "PluginPopover" */ 'app/src/components/Plugins/PluginPopover/PluginPopover'
      ),
    { namedImport: 'PluginPopover' },
  );
  return (
    <ErrorBoundary>
      <ChunkLoadErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <PluginPopover />
        </Suspense>
      </ChunkLoadErrorBoundary>
    </ErrorBoundary>
  );
};
