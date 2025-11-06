import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { CardTemplatesPopoverProps } from './CardTemplatesPopover';

export const LazyCardTemplatesPopover: FunctionComponent<
  CardTemplatesPopoverProps
> = (props) => {
  const CardTemplatesPopover = useLazyComponent(
    () =>
      import(/* webpackChunkName: "card-templates" */ './CardTemplatesPopover'),
    { namedImport: 'CardTemplatesPopover' },
  );

  return (
    <ErrorBoundary
      tags={{ ownershipArea: 'trello-web-eng', feature: 'Card Templates' }}
    >
      <Suspense fallback={null}>
        <ChunkLoadErrorBoundary fallback={null}>
          <CardTemplatesPopover {...props} />
        </ChunkLoadErrorBoundary>
      </Suspense>
    </ErrorBoundary>
  );
};
