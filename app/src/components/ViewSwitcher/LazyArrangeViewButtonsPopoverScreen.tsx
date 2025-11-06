import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { Spinner } from '@trello/nachos/spinner';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { ViewSwitcherPopoverScreenProps } from './ArrangeViewButtonsPopoverScreen';

export const LazyArrangeViewButtonsPopoverScreen: FunctionComponent<
  ViewSwitcherPopoverScreenProps
> = (props) => {
  const ArrangeViewButtonsPopoverScreen = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "arrange-view-buttons-popover-screen" */ './ArrangeViewButtonsPopoverScreen'
      ),
    { preload: false, namedImport: 'ArrangeViewButtonsPopoverScreen' },
  );

  return (
    <ChunkLoadErrorBoundary fallback={null}>
      <Suspense fallback={<Spinner />}>
        <ArrangeViewButtonsPopoverScreen {...props} />
      </Suspense>
    </ChunkLoadErrorBoundary>
  );
};
