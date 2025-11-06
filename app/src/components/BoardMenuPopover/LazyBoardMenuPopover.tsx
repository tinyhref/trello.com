import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { BoardMenuPopoverProps } from './BoardMenuPopover';
import { BoardMenuPopoverSkeleton } from './BoardMenuPopoverSkeleton';

export const LazyBoardMenuPopover: FunctionComponent<BoardMenuPopoverProps> = (
  props,
) => {
  const BoardMenuPopover = useLazyComponent(
    () =>
      import(/* webpackChunkName: "board-menu-popover" */ './BoardMenuPopover'),
    { namedImport: 'BoardMenuPopover' },
  );

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-web-eng',
        feature: 'Board Menu',
      }}
    >
      <ChunkLoadErrorBoundary fallback={null}>
        <Suspense fallback={<BoardMenuPopoverSkeleton />}>
          <BoardMenuPopover {...props} />
        </Suspense>
      </ChunkLoadErrorBoundary>
    </ErrorBoundary>
  );
};
