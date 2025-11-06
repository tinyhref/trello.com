import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useFeatureGate } from '@trello/feature-gate-client';
import { useLazyComponent } from '@trello/use-lazy-component';

import {
  openGASpotlightTour,
  useIsGAOnboardingOpen,
} from '../betaGASharedState';

export const LazyGAOnboardingModal: FunctionComponent = () => {
  const shouldShowOnboarding = useIsGAOnboardingOpen();

  const { value: isPreventOnboardingLoadEnabled } = useFeatureGate(
    'ghost_prevent_onboarding_load',
  );

  const shouldLoad = !isPreventOnboardingLoadEnabled || shouldShowOnboarding;

  const PPOnboardingModal = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "personal-productivity-onboarding-modal" */ './PPOnboardingModal'
      ),
    {
      namedImport: 'PPOnboardingModal',
      preload: shouldLoad,
    },
  );

  if (!shouldLoad) {
    return null;
  }

  return (
    shouldShowOnboarding && (
      <Suspense fallback={null}>
        <ChunkLoadErrorBoundary fallback={null}>
          <PPOnboardingModal onComplete={openGASpotlightTour} />
        </ChunkLoadErrorBoundary>
      </Suspense>
    )
  );
};
