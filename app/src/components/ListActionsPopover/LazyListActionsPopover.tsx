import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { Popover } from '@trello/nachos/popover';
import type { ListTestIds } from '@trello/test-ids';
import { getTestId } from '@trello/test-ids';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { ListActionsPopoverProps } from './ListActionsPopover';
import { ListActionsPopoverSkeleton } from './ListActionsPopoverSkeleton';
import { ListActionsScreen } from './ListActionsScreen';

const getLabelledBy = (currentScreen: number | undefined) => {
  switch (currentScreen) {
    case ListActionsScreen.Options:
      return 'list-actions-menu';
    case ListActionsScreen.CopyList:
      return 'copy-list-header';
    case ListActionsScreen.MoveList:
      return 'move-list-header';
    case ListActionsScreen.MoveAllCards:
      return 'move-all-cards-header';
    case ListActionsScreen.SortList:
      return 'sort-list-header';
    default:
      return undefined;
  }
};

export const LazyListActionsPopover: FunctionComponent<
  ListActionsPopoverProps
> = (props) => {
  const ListActionsPopover = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "list-actions-popover" */ './ListActionsPopover'
      ),
    { namedImport: 'ListActionsPopover' },
  );

  const currentScreen = props.popoverProps.currentScreen;

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-web-eng',
        feature: 'List Actions Popover',
      }}
    >
      <Popover
        testId={getTestId<ListTestIds>('list-actions-popover')}
        labelledBy={getLabelledBy(currentScreen)}
        {...props.popoverProps}
      >
        <ChunkLoadErrorBoundary fallback={null}>
          <Suspense fallback={<ListActionsPopoverSkeleton />}>
            <ListActionsPopover {...props} />
          </Suspense>
        </ChunkLoadErrorBoundary>
      </Popover>
    </ErrorBoundary>
  );
};
