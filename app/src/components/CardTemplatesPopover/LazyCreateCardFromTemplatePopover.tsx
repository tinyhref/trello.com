import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { CreateCardFromTemplatePopoverProps } from './CreateCardFromTemplatePopover';

export const LazyCreateCardFromTemplatePopover: FunctionComponent<
  CreateCardFromTemplatePopoverProps
> = (props) => {
  const CreateCardFromTemplatePopover = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "card-templates" */ './CreateCardFromTemplatePopover'
      ).then((module) => ({
        CreateCardFromTemplatePopover: module.CreateCardFromTemplatePopover,
      })),
    { namedImport: 'CreateCardFromTemplatePopover' },
  );

  return (
    <ErrorBoundary
      tags={{ ownershipArea: 'trello-web-eng', feature: 'Card Templates' }}
    >
      <Suspense fallback={null}>
        <ChunkLoadErrorBoundary fallback={null}>
          <CreateCardFromTemplatePopover {...props} />
        </ChunkLoadErrorBoundary>
      </Suspense>
    </ErrorBoundary>
  );
};
