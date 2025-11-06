import type { FunctionComponent, PropsWithChildren } from 'react';
import { Suspense } from 'react';

import { AtlassianAccountMigrationStage as Stages } from '@trello/aa-migration';
import { ErrorBoundary } from '@trello/error-boundaries';
import { useLazyComponent } from '@trello/use-lazy-component';

import { useAtlassianAccountMigrationStageOverlays } from './useAtlassianAccountMigrationStageOverlays';
import { useInterruptibleRouteTransition } from './useInterruptibleRouteTransition';

// Wraps all banners related to managing Atlassian Account migration stages,
// which are by design exclusive from each other.
export const AtlassianAccountMigrationStageOverlays: FunctionComponent<
  PropsWithChildren<unknown>
> = ({ children }) => {
  const AtlassianManagedAccountOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "atlassian-account-migration" */ 'app/src/components/AtlassianManagedAccount/AtlassianManagedAccountOverlay'
      ),
    { namedImport: 'AtlassianManagedAccountOverlay', preload: false },
  );
  const AtlassianAccountMigrationConfirmationOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "atlassian-account-migration" */ 'app/src/components/AtlassianAccountMigration/AtlassianAccountMigrationConfirmationOverlay'
      ),
    {
      namedImport: 'AtlassianAccountMigrationConfirmationOverlay',
      preload: false,
    },
  );

  const { stage, forceStage, shouldRenderOverlay } =
    useAtlassianAccountMigrationStageOverlays();

  const { interrupt } = useInterruptibleRouteTransition();

  if (!shouldRenderOverlay && !forceStage) {
    return null;
  }

  const renderOverlay = () => {
    switch (stage) {
      case Stages.newlyManaged:
        return <AtlassianManagedAccountOverlay shouldInterrupt={interrupt} />;
      case Stages.enterpriseMigration:
      case Stages.inactiveMigration:
        return (
          <AtlassianAccountMigrationConfirmationOverlay
            forceShow={!!forceStage}
            wasInactiveMigration={stage === Stages.inactiveMigration}
            wasEnterpriseMigration={stage === Stages.enterpriseMigration}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-web-eng',
        feature: 'Atlassian Account Onboarding',
      }}
      sendCrashEvent={false}
    >
      <Suspense fallback={null}>{renderOverlay()}</Suspense>
    </ErrorBoundary>
  );
};
