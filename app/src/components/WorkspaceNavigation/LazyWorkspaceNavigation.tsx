import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import {
  ChunkLoadErrorBoundary,
  ErrorBoundary,
} from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import { WorkspaceNavigationError } from './WorkspaceNavigationError';

export const LazyWorkspaceNavigation: FunctionComponent<object> = () => {
  const WorkspaceSettingsNavigation = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "workspace-settings-navigation" */ './WorkspaceSettingsNavigation'
      ),
    { namedImport: 'WorkspaceSettingsNavigation' },
  );

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-web-eng',
        feature: 'Workspace Navigation',
      }}
      errorHandlerComponent={WorkspaceNavigationError}
    >
      <Suspense fallback={null}>
        <ChunkLoadErrorBoundary fallback={<WorkspaceNavigationError />}>
          <WorkspaceSettingsNavigation />
        </ChunkLoadErrorBoundary>
      </Suspense>
    </ErrorBoundary>
  );
};
