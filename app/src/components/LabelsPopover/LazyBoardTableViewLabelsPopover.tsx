import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { BoardTableViewLabelsPopoverProps } from './BoardTableViewLabelsPopover';

export const LazyBoardTableViewLabelsPopover: FunctionComponent<
  BoardTableViewLabelsPopoverProps
> = (props) => {
  const BoardTableViewLabelsPopover = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "board-table-view-labels-popover" */ './BoardTableViewLabelsPopover'
      ),
    { namedImport: 'BoardTableViewLabelsPopover' },
  );
  return (
    <ErrorBoundary
      tags={{ ownershipArea: 'trello-web-eng', feature: 'Labels Popover' }}
    >
      <ChunkLoadErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <BoardTableViewLabelsPopover {...props} />
        </Suspense>
      </ChunkLoadErrorBoundary>
    </ErrorBoundary>
  );
};
