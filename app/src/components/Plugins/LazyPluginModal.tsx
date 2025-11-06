import { Suspense, type FunctionComponent } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { Action } from './PluginHeader';

interface LazyPluginModalProps {
  callback?: () => void;
  url: string;
  accentColor: string;
  height: number;
  fullscreen: boolean;
  title?: string;
  actions?: Action[];
}

export const LazyPluginModal: FunctionComponent<LazyPluginModalProps> = ({
  callback,
  url,
  accentColor,
  height,
  fullscreen,
  title,
  actions,
}) => {
  const NewPluginModal = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "NewPluginModal" */ 'app/src/components/Plugins/NewPluginModal'
      ),
    { namedImport: 'NewPluginModal' },
  );
  return (
    <ErrorBoundary>
      <ChunkLoadErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <NewPluginModal
            callback={callback}
            url={url}
            accentColor={accentColor}
            height={height}
            fullscreen={fullscreen}
            title={title}
            actions={actions}
          />
        </Suspense>
      </ChunkLoadErrorBoundary>
    </ErrorBoundary>
  );
};
