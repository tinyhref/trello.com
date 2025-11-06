import type { FunctionComponent } from 'react';
import { Suspense } from 'react';

import { useOneTimeMessagesDismissed } from '@trello/business-logic-react/member';
import { ChunkLoadErrorBoundary } from '@trello/error-boundaries';
import { useFeatureGate } from '@trello/feature-gate-client';
import { useLazyComponent } from '@trello/use-lazy-component';

export const LazyGAWelcomeModal: FunctionComponent = () => {
  const GAWelcomeModal = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "personal-productivity-ga-welcome-modal" */ './GAWelcomeModal'
      ),
    { namedImport: 'GAWelcomeModal', preload: false },
  );

  const { isOneTimeMessageDismissed } = useOneTimeMessagesDismissed();

  const isDismissed = isOneTimeMessageDismissed('beta-ga-welcome-modal');

  const { value: isPreventOnboardingLoadEnabled } = useFeatureGate(
    'ghost_prevent_onboarding_load',
  );

  const shouldLoad = !isPreventOnboardingLoadEnabled || !isDismissed;

  if (!shouldLoad) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <ChunkLoadErrorBoundary fallback={null}>
        <GAWelcomeModal />
      </ChunkLoadErrorBoundary>
    </Suspense>
  );
};
