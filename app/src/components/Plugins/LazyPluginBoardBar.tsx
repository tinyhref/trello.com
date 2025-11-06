import { Suspense, type FunctionComponent } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { Action } from './PluginHeader';

interface LazyPluginBoardBarProps {
  callback?: () => void;
  url: string;
  accentColor?: string | undefined;
  height: number;
  title?: string;
  actions?: Action[];
  resizable?: boolean;
  boardHeight?: number;
}

export const LazyPluginBoardBar: FunctionComponent<LazyPluginBoardBarProps> = ({
  boardHeight,
  callback,
  url,
  accentColor,
  height,
  title,
  actions,
  resizable,
}) => {
  const NewPluginBoardBar = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "NewPluginBoardBar" */ 'app/src/components/Plugins/NewPluginBoardBar'
      ),
    { namedImport: 'NewPluginBoardBar' },
  );
  return (
    <ErrorBoundary>
      <ChunkLoadErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <NewPluginBoardBar
            boardHeight={boardHeight}
            callback={callback}
            url={url}
            accentColor={accentColor}
            height={height}
            resizable={resizable}
            title={title}
            actions={actions}
          />
        </Suspense>
      </ChunkLoadErrorBoundary>
    </ErrorBoundary>
  );
};
