import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import type { WorkspaceShareLinkSettingsProps } from './WorkspaceShareLinkSettings';

interface LazyWorkspaceShareLinkSettingsProps
  extends WorkspaceShareLinkSettingsProps {
  canManageMembers: boolean;
}

export const LazyWorkspaceShareLinkSettings = ({
  canManageMembers,
  ...props
}: LazyWorkspaceShareLinkSettingsProps) => {
  const WorkspaceShareLinkSettings = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "workspace-share-link-settings" */ './WorkspaceShareLinkSettings'
      ),
    { namedImport: 'WorkspaceShareLinkSettings' },
  );

  return canManageMembers ? (
    <ChunkLoadErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <WorkspaceShareLinkSettings {...props} />
      </Suspense>
    </ChunkLoadErrorBoundary>
  ) : null;
};
