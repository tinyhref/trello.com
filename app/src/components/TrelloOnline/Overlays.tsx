import { Suspense, useCallback, useMemo } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { overlayState } from '@trello/nachos/overlay';
import { useSharedState } from '@trello/shared-state';
import { useLazyComponent } from '@trello/use-lazy-component';

import { LazyEndOfTrialFrictionDialog } from 'app/src/components/EndOfTrialFriction';
import type { OnCloseEvent } from 'app/src/components/FreeTrial';
import { LazyGAWelcomeModal } from 'app/src/components/PersonalProductivityBeta/GAWelcomeModal/LazyGAWelcomeModal';
import { LazyGAOnboardingModal } from 'app/src/components/PersonalProductivityBeta/PPOnboardingModal/LazyGAOnboardingModal';
import { LazyPremiumTrialModalOverlay } from 'app/src/components/PremiumTrialModalOverlay/LazyPremiumTrialModalOverlay';
import { LazyPremiumTrialPaymentModalOverlay } from 'app/src/components/PremiumTrialPaymentModalOverlay/LazyPremiumTrialPaymentModalOverlay';

export const Overlays = () => {
  let component = null;

  const PlanSelectionOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "plan-selection-overlay" */ 'app/src/components/FreeTrial'
      ),
    {
      namedImport: 'PlanSelectionOverlay',
      preload: false,
    },
  );
  const AtlassianAccountMigrationStageOverlays = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "atlassian-account-migration" */ 'app/src/components/AtlassianAccountMigrationStage'
      ),
    {
      namedImport: 'AtlassianAccountMigrationStageOverlays',
      preload: false,
    },
  );

  const [overlay, setOverlayState] = useSharedState(overlayState);

  const onClosePlanSelectionOverlay = useCallback(
    (event: OnCloseEvent) => {
      overlay.context.callback?.(event);

      setOverlayState({
        overlayType: null,
        context: {},
      });
    },
    [overlay.context, setOverlayState],
  );

  const freeTrialOptions = useMemo(
    () => ({
      redirect: overlay.context?.redirect,
    }),
    [overlay.context?.redirect],
  );

  if (overlay.overlayType === 'plan-selection') {
    component = overlay.context?.orgId && (
      <PlanSelectionOverlay
        orgId={overlay.context?.orgId}
        startFreeTrialOptions={freeTrialOptions}
        onClose={onClosePlanSelectionOverlay}
        boardLeftHandNavButtonClicked={
          overlay.context.boardLeftHandNavButtonClicked
        }
      />
    );
  }

  return (
    <ChunkLoadErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        {component}
        <AtlassianAccountMigrationStageOverlays />
        <LazyGAOnboardingModal />
        <LazyGAWelcomeModal />
        <LazyPremiumTrialModalOverlay />
        <LazyPremiumTrialPaymentModalOverlay />
        <LazyEndOfTrialFrictionDialog />
      </Suspense>
    </ChunkLoadErrorBoundary>
  );
};
