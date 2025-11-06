import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { CreateWorkspaceViewPopoverScreenContentProps } from './CreateWorkspaceViewPopoverScreenContent';

export const LazyCreateWorkspaceViewPopoverScreenContent: FunctionComponent<
  CreateWorkspaceViewPopoverScreenContentProps
> = (props) => {
  const CreateWorkspaceViewPopoverScreenContent = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "create-workspace-view-popover-content" */ './CreateWorkspaceViewPopoverScreenContent'
      ),
    {
      namedImport: 'CreateWorkspaceViewPopoverScreenContent',
    },
  );

  return (
    <ChunkLoadErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <CreateWorkspaceViewPopoverScreenContent {...props} />
      </Suspense>
    </ChunkLoadErrorBoundary>
  );
};
