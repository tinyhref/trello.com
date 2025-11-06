import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { BoardHeaderPluginButtonsProps } from './BoardHeaderPluginButtons';

export const LazyBoardHeaderPluginButtons: FunctionComponent<
  BoardHeaderPluginButtonsProps
> = (props) => {
  const BoardHeaderPluginButtons = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "board-header-plugin-buttons" */ './BoardHeaderPluginButtons'
      ),
    { namedImport: 'BoardHeaderPluginButtons' },
  );

  return (
    <ChunkLoadErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <BoardHeaderPluginButtons {...props} />
      </Suspense>
    </ChunkLoadErrorBoundary>
  );
};
